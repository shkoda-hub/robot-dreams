import { DataSource } from 'typeorm';
import { Post } from './entities/post.entity';

const dataSource = new DataSource({
  type: 'postgres',
  url: 'postgres://postgres:postgres@localhost:5432/acid_lab',
  entities: [Post],
  synchronize: true,
});

export async function getDataSource() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource;
}
