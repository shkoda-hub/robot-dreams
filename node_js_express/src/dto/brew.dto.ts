import {z} from 'zod';
import {brewSchema, createBrewSchema} from '../schemas/brew.schema';

export type CreateBrewDto = z.infer<typeof createBrewSchema>;
export type BrewDto       = z.infer<typeof brewSchema>;
