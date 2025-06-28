import {Request, Response, NextFunction} from 'express';
import {HttpError} from 'http-errors';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  const status = (err instanceof HttpError && err.status) || 500;
  const message = err instanceof Error ? err.message : 'Server error';
  const details = err instanceof HttpError ? err.errors : 'Server error';

  res.status(status).json({ message, details });
}
