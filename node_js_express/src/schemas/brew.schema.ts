import {z} from 'zod';
import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);


const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

export enum BrewMethod {
  V60 = 'v60',
  Aeropress = 'aeropress',
  Chemex = 'chemex',
  Espresso = 'espresso',
}

export const createBrewSchema = z.object({
  beans   : z.string().min(3).max(40),
  method  : z.nativeEnum(BrewMethod),
  rating  : z.number().min(1).max(5).optional(),
  notest  : z.string().max(200).optional(),
  brewedAt: z.string().datetime().default(() => new Date().toISOString())
}).openapi({ description: 'Create new Brew' });

export const brewSchema= createBrewSchema.extend({
  id: z.string()
}).openapi({ description: 'Brew' });
