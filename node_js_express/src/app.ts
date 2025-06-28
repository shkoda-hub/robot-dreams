import express, {Application} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import pino from 'pino-http';
import {scopePerRequest} from 'awilix-express';
import brewsContainer from './container';
import brewRouter from './routes/brew.router';
import {notFound} from './middlewares/notFound';
import {errorHandler} from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import {openapiDocument} from './openapi/openapi';
import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import {z} from 'zod';

extendZodWithOpenApi(z);

export class App {
  private readonly application: Application;

  constructor() {
    this.application = express();
  }

  public init(): Application {
    this.application.use(helmet());
    this.application.use(cors());
    this.application.use(compression());

    if (process.env.NODE_ENV === 'development') this.application.use(morgan('dev'));
    if (process.env.NODE_ENV === 'production') this.application.use(pino());

    this.application.use(express.json());
    this.application.use(express.urlencoded({ extended: false }));

    this.application.use(scopePerRequest(brewsContainer));
    this.application.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

    this.application.use('/api', brewRouter);
    this.application.use(notFound);
    this.application.use(errorHandler);

    return this.application;
  }
}
