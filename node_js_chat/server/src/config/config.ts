import * as process from 'node:process';

export default () => ({
  port: Number(process.env.PORT) || 3000,
  mongoUrl: process.env.MONGODB_URI || 'mongodb://mongodb:27017/chat',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  env: process.env.NODE_ENV || 'development',
});
