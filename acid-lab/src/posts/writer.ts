import { getDataSource } from './data-source';

async function main() {
  const dataSource = await getDataSource();
  const postTitle = `title_${Date.now()}`;

  console.log(
    `[${new Date().toISOString()}] [WRITER]: updating post title => ${postTitle}`,
  );
  await dataSource.transaction(async (manager) => {
    await manager.query(
      `
      UPDATE posts SET title = $1 WHERE id = '11111111-2222-3333-4444-555555555555';
    `,
      [postTitle],
    );
    await manager.query(`
      SELECT pg_sleep(5);
    `);
    console.log(`[${new Date().toISOString()}] [WRITER]: post updated`);
  });
}

main().catch(console.error);
