import { Request, RequestHandler, Response } from 'express';
import { extractParams } from './utils/utils';
import { CONTROLLER_PIPES, METHOD_PIPES, PARAMS_KEY } from '../decorators/keys';
import { ArgumentMetadata } from '../interfaces/interfaces';

export const HandlerMiddleware = (
  instance: any,
  handler: RequestHandler,
  globalPipes: any[] = [],
) => {
  return async (req: Request, res: Response) => {
    const args = await buildHandlerArgs(req, instance, handler, globalPipes);
    const result = await handler.apply(instance, args);
    res.json(result);
  };
};

async function buildHandlerArgs(
  req: Request,
  instance: any,
  handler: RequestHandler,
  globalPipes: any[],
) {
  const controllerPipes =
    Reflect.getOwnMetadata(CONTROLLER_PIPES, instance.constructor) || [];
  const methodPipes = Reflect.getOwnMetadata(METHOD_PIPES, handler) || [];

  const allParams: ArgumentMetadata[] =
    Reflect.getOwnMetadata(PARAMS_KEY, handler) || [];

  const args: any[] = [];

  for (const meta of allParams.sort((a, b) => a.index - b.index)) {
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

    args[meta.index] = await runPipes(value, meta, pipesChain);
  }

  return args;
}

async function runPipes(value: any, meta: ArgumentMetadata, pipesChain: any[]) {
  let initialValue = value;

  for (const Pipe of pipesChain) {
    const pipe = typeof Pipe === 'function' ? new Pipe() : Pipe;
    initialValue = await pipe.transform(initialValue, meta);
  }

  return initialValue;
}
