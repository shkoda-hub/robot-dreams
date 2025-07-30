import { getDataSource } from './data-source';
import { Post } from './entities/post.entity';

async function init() {
  const dataSource = await getDataSource();
  const repository = dataSource.getRepository(Post);

  const id = '11111111-2222-3333-4444-555555555555';

  if (!(await repository.findOne({ where: { id } }))) {
    await repository.save({ id, title: 'test', draft: false });
  }

  await dataSource.destroy();
}

init().catch(console.error);
