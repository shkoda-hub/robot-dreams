import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_PUB',
      useValue: new Redis('redis://redis:6379'),
    },
    {
      provide: 'REDIS_SUB',
      useValue: new Redis('redis://redis:6379'),
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
