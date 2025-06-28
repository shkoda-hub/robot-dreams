import {z} from 'zod';
import {BrewMethod} from './brew.schema';

export const querySchema = z.object({
  method   : z.nativeEnum(BrewMethod).optional(),
  ratingMin: z.coerce.number().min(1).max(5).optional(),
}).openapi({ description: 'Optional query params' });
