import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Account } from '../transfer/entities/account.entity';
import { Movement } from '../transfer/entities/movements.entity';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Account, Movement],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
  connectTimeoutMS: 5000,
  migrationsRun: true,
});
