import { Post } from './entities/post.entity';
import * as process from 'node:process';
import { getDataSource } from './data-source';
import { DataSource } from 'typeorm';

async function readInRUMode(dataSource: DataSource): Promise<void> {
  console.log(
    `[${new Date().toISOString()}] [READER IN READ UNCOMMITTED MODE]`,
  );
  await dataSource.transaction(async (manager) => {
    await manager.query(`
      SET default_transaction_read_only = on;
    `);

    await manager.query(`
      LOCK TABLE posts IN SHARE MODE;
    `);

    for (let i = 0; i < 3; i++) {
      const post = await manager.findOne(Post, {
        where: { id: '11111111-2222-3333-4444-555555555555' },
      });
      console.log(
        `[${new Date().toISOString()}] [READER IN READ UNCOMMITTED MODE]: ${post!.title}`,
      );
    }
  });
}

async function readInRCMode(dataSource: DataSource): Promise<void> {
  console.log(`[${new Date().toISOString()}] [READER IN READ COMMITTED MODE]`);

  await dataSource.transaction(async (manager) => {
    for (let i = 0; i < 3; i++) {
      const post = await manager.findOne(Post, {
        where: { id: '11111111-2222-3333-4444-555555555555' },
      });
      console.log(
        `[${new Date().toISOString()}] [READER IN READ COMMITTED MODE]: ${post!.title}`,
      );
    }
  });
}

async function main() {
  const dataSource = await getDataSource();

  switch (process.env.READ_MODE) {
    case 'RC':
      await readInRCMode(dataSource);
      break;
    case 'RU':
      await readInRUMode(dataSource);
      break;
    default:
  }
  await dataSource.destroy();
}

main().catch(console.error);
