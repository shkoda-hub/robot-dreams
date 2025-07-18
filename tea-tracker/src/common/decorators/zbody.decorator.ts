import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export const ZBody = (schema: ZodSchema<any>): ParameterDecorator => {
  const decoratorFactory = createParamDecorator(
    async (_: unknown, ctx: ExecutionContext) => {
      const req = ctx.switchToHttp().getRequest();
      try {
        return await schema.parseAsync(req.body);
      } catch (err) {
        if (err instanceof ZodError) {
          throw new BadRequestException(err.errors);
        }
        throw err;
      }
    },
  );

  return decoratorFactory();
};
