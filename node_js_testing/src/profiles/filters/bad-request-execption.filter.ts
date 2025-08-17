import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter, HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from '../../logger/logger';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}

  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    const status: number = exception.getStatus();
    const body = exception.getResponse();

    this.logger.error(
      `Received request with invalid body: ${JSON.stringify(request.body, null, 2)}`,
    );

    response.status(status).json(body);
  }
}
