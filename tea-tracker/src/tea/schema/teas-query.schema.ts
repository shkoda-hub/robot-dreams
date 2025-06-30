import { z } from 'zod';

export const teasQuerySchema = z.object({
  minRating: z.coerce.number().min(1).max(10).optional(),
  page: z.coerce.number().min(1),
  limit: z.coerce.number().min(1),
});
