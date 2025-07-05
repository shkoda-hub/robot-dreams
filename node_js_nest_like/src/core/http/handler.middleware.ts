import { ArgumentMetadata } from '../interfaces/interfaces';
import { CONTROLLER_PIPES, METHOD_PIPES, PARAMS_KEY } from '../decorators/keys';
import { Request, RequestHandler, Response } from 'express';
import { extractParams } from './utils/utils';

export const HandlerMiddleware = (
  instance: any,
  handler: RequestHandler,
  globalPipes: any[] = [],
) => {
  const controllerPipes =
    Reflect.getOwnMetadata(CONTROLLER_PIPES, instance.constructor) || [];
  const methodPipes = Reflect.getOwnMetadata(METHOD_PIPES, handler) || [];

  return async (req: Request, res: Response) => {
    const allParams: ArgumentMetadata[] =
      Reflect.getOwnMetadata(PARAMS_KEY, handler) || [];

    allParams.sort((a, b) => a.index - b.index);

    const args: any[] = [];

    for (const meta of allParams) {
      let value = extractParams(req, meta.type);
      if (meta.data != null) {
        value = (value == null ? {} : value)[meta.data];
      }

      const pipesChain = [
        ...globalPipes,
        ...controllerPipes,
        ...methodPipes,
        ...(meta.pipes || []),
      ];

      for (const Pipe of pipesChain) {
        const pipe = typeof Pipe === 'function' ? new Pipe() : Pipe;
        value = await pipe.transform(value, meta);
      }

      args[meta.index] = value;
    }

    const result = await handler.apply(instance, args);
    res.json(result);
  };
};
