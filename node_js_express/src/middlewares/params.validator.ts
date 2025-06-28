import {z, ZodTypeAny} from 'zod';
import {NextFunction, Request, Response} from 'express';
import createHttpError from 'http-errors';

export const validateParams = <Schema extends ZodTypeAny>(
  schema: Schema,
) => {
  return (
    req: Request<z.infer<typeof schema>, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      throw createHttpError(400, 'Validation failed', {
        errors: result.error.format(),
      });
    }

    req.params = result.data;
    next();
  };
};
