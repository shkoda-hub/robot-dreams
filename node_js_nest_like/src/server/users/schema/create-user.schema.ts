import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string(),
  age: z.number(),
  phone: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
