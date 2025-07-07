import { RequestHandler, Request, Response, NextFunction } from 'express';
import { CONTROLLER_GUARDS, METHOD_GUARDS } from '../decorators/keys';
import { CanActivate, ExecutionContext } from '../interfaces/interfaces';
import { HttpException } from './http-exception';

export function GuardsMiddleware(
  instance: any,
  handlerFn: RequestHandler,
  globalGuards: any[] = [],
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const controllerGuards: any[] =
      Reflect.getOwnMetadata(CONTROLLER_GUARDS, instance.constructor) || [];
    const methodGuards: any[] =
      Reflect.getOwnMetadata(METHOD_GUARDS, handlerFn) || [];

    const guards = [...globalGuards, ...controllerGuards, ...methodGuards];

    const context: ExecutionContext = { req, res };

    for (const GuardClass of guards) {
      const guard: CanActivate = new GuardClass();
      const canActivate = await guard.canActivate(context);
      if (!canActivate) {
        throw new HttpException('Forbidden', 403);
      }
    }

    next();
  };
}
