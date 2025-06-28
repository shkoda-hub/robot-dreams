import {z, ZodTypeAny} from 'zod';
import {NextFunction, Request, Response} from 'express';
import createHttpError from 'http-errors';

export const validateQuery = <Schema extends ZodTypeAny>(
  schema: Schema,
) => {
  return (
    req: Request<unknown, unknown, unknown, unknown, z.infer<typeof schema>>,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      throw createHttpError(400, 'Validation failed', {
        errors: result.error.format(),
      });
    }

    req.params = result.data;
    next();
  };
};
