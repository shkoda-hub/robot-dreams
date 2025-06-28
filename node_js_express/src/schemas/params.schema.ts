import {z} from 'zod';

export const paramsSchema = z.object({
  id: z.string(),
}).openapi('Params schema');
