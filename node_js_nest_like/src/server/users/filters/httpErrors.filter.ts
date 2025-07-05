import { ExceptionFilter } from '../../../core/interfaces/interfaces';
import e from 'express';
import { HttpException } from '../../../core/http/http-exception';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception: any,
    req: e.Request,
    res: e.Response,
    _next: e.NextFunction,
  ): any {
    if (exception instanceof HttpException) {
      const status = exception.statusCode;
      const message = exception.errorMessage;
      const errorData = exception.errorData;
      return res.status(status).json({ message, errorData });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}
