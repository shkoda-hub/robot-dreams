import {NextFunction, Request, Response} from 'express';
import {z, ZodTypeAny} from 'zod';
import createHttpError from 'http-errors';

export const validateBody = <Schema extends ZodTypeAny>(
  schema: Schema
) => {
  return (req: Request<unknown, unknown, z.infer<Schema>>, res: Response, next: NextFunction) => {
    const result =  schema.safeParse(req.body);

    if (!result.success) {
      throw createHttpError(400, 'Validation failed', {
        errors: result.error.format(),
      });
    }

    req.body = result.data;
    next();
  };
};
