import {
  ErrorRequestHandler,
  NextFunction,
  RequestHandler,
  Response,
  Request,
} from 'express';

export const asyncHandler = (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  fn: Function,
): RequestHandler | ErrorRequestHandler => {
  if (fn.length === 4) {
    return fn as ErrorRequestHandler;
  }

  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve((fn as RequestHandler)(req, res, next)).catch(next);
  };
};
