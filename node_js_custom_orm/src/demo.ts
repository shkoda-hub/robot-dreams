import { Pool } from 'pg';
import { Product, ProductRepository } from './repositories/product.repository';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const DB_URL = 'postgres://postgres:postgres@localhost:5432/demo';

const pull = new Pool({
  connectionString: DB_URL,
});

const productsRepository = new ProductRepository(pull);

async function makeMigration() {
  try {
    const pathToSql = path.join(__dirname, './migrations/init-db.sql');
    const query = await fs.readFile(pathToSql, 'utf8');
    await pull.query(query);
  } catch (err) {
    console.error('error during migration', err);
  }

}

async function main() {
  await makeMigration();

  const newProduct: Omit<Product, 'id'> = {
    name: 'mobile phone',
    price: 100,
  };

  console.log('saving new product...');
  const savedProduct = await productsRepository.save(newProduct);
  console.log(`product saved successfully: ${JSON.stringify(savedProduct)} \n`);

  console.log(`searching product by name...`);
  const phones = await productsRepository.findAll({
    name: 'mobile phone',
  });
  console.log(
    `products by name found successfully: ${JSON.stringify(phones)} \n`,
  );

  console.log('searching product by id...');
  const product = await productsRepository.findOne(savedProduct.id);
  console.log(`product found successfully: ${JSON.stringify(product)} \n`);

  console.log('updating product price...');
  const updatedProduct = await productsRepository.update(savedProduct.id, {
    price: 200,
  });
  console.log(
    `product updated successfully: ${JSON.stringify(updatedProduct)} \n`,
  );

  console.log('deleting product by id...');
  await productsRepository.delete(savedProduct.id);
  console.log('product deleted successfully \n');

  console.log(`trying to search deleted product...`);
  const deletedProduct = await productsRepository.findOne(savedProduct.id);
  console.log(`product not found: ${JSON.stringify(deletedProduct)} \n`);

  await pull.end();
}

main().catch((err) => {
  console.error(err);
});
