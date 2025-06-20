import {z} from 'zod';

export const createUserSchema = z.object({
  firstName: z.string().min(1),
  lastName:  z.string().min(1),
  email:     z.string().email(),
  phone:     z.string().optional(),
});


export const updateUserSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Empty request body' },
  );
