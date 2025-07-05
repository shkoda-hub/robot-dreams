import {
  ArgumentMetadata,
  PipeTransform,
} from '../../../core/interfaces/interfaces';
import { ZodError, ZodSchema } from 'zod';
import { HttpException } from '../../../core/http/http-exception';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await this.schema.parseAsync(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpException('Invalid input', 400, error.errors);
      }
      throw error;
    }
  }
}
