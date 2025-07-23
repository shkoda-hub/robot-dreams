import { Orm } from '../orm/orm';
import { Pool } from 'pg';

export interface Product {
  id: string;
  name: string;
  price: number;
}

export class ProductRepository extends Orm<Product> {
  constructor(pool: Pool) {
    super('products', pool);
  }
}
