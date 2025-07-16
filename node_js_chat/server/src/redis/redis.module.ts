import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: 'REDIS_PUB',
      useFactory: (cfg: ConfigService) => new Redis(cfg.get('redisUrl')!),
    },
    {
      inject: [ConfigService],
      provide: 'REDIS_SUB',
      useFactory: (cfg: ConfigService) => new Redis(cfg.get('redisUrl')!),
    },
    {
      provide: 'INSTANCE_ID',
      useFactory: (): string => uuid(),
    },
    RedisService,
  ],
  exports: ['REDIS_PUB', 'REDIS_SUB', 'INSTANCE_ID', RedisService],
})
export class RedisModule {}
