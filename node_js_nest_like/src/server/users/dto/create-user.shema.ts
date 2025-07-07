import { z } from 'zod';

export const createUserShema = z.object({
  name: z.string(),
  age: z.number(),
  phone: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof createUserShema>;
