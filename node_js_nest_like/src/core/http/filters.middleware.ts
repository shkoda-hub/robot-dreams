import {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
  RequestHandler,
} from 'express';
import { CONTROLLER_FILTERS, METHOD_FILTERS } from '../decorators/keys';
import { ExceptionFilter } from '../interfaces/interfaces';

export function FiltersMiddleware(
  instance: any,
  handlerFn: RequestHandler,
  globalFilters: any[] = [],
): ErrorRequestHandler {
  const controllerFilters: any[] =
    Reflect.getOwnMetadata(CONTROLLER_FILTERS, instance.constructor) || [];
  const methodFilters: any[] =
    Reflect.getOwnMetadata(METHOD_FILTERS, handlerFn) || [];

  const chain = [...methodFilters, ...controllerFilters, ...globalFilters];

  return (err: any, req: Request, res: Response, next: NextFunction) => {
    for (const FilterClass of chain) {
      const filter: ExceptionFilter = new FilterClass();
      filter.catch(err, req, res, next);
      if (res.headersSent) {
        return;
      }
    }
    next(err);
  };
}
