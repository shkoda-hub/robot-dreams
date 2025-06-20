import {z} from 'zod';
import {createUserSchema, updateUserSchema} from '../schemas/user.schema';

export interface UserDto extends BaseUserDto {
  id: string;
}

interface BaseUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
