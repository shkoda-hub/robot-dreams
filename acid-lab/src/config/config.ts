import * as process from 'node:process';

export default () => ({
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'development',
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    name: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
});
