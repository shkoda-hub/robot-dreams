import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis, { RedisValue } from 'ioredis';
import { RedisStreamBatch, RedisStreamEntry } from '../types/redis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  constructor(
    @Inject('REDIS_PUB') private readonly pub: Redis,
    @Inject('REDIS_SUB') private readonly sub: Redis,
  ) {}

  async ensureXGroup(stream: string, group: string): Promise<void> {
    try {
      await this.pub.xgroup('CREATE', stream, group, '0', 'MKSTREAM');
    } catch {
      this.logger.warn(`Group ${group} is already registered`);
    }
  }

  async xadd(stream: string, ...args: RedisValue[]) {
    return this.pub.xadd(stream, ...args);
  }

  async xack(stream: string, group: string, id: string) {
    await this.pub.xack(stream, group, id);
  }

  async xdel(stream: string, id: string) {
    await this.pub.xdel(stream, id);
  }

  async xread(options: {
    stream: [string, string];
    count: number;
    block: number;
  }) {
    const { stream, count, block } = options;

    return this.sub.xread('COUNT', count, 'BLOCK', block, 'STREAMS', ...stream);
  }

  async xutoclaim(
    stream: string,
    group: string,
    consumer: string,
    minTime = 30_000,
    startId = '0',
    count = 20,
  ): Promise<[string, RedisStreamEntry<string[]>[]]> {
    const result = await this.sub.xautoclaim(
      stream,
      group,
      consumer,
      minTime,
      startId,
      'COUNT',
      count,
    );

    return result as unknown as [string, RedisStreamEntry<string[]>[]];
  }

  async xreadgroup(
    group: string,
    consumer: string,
    count: number = 10,
    block: number = 5000,
    stream: [string, string],
  ): Promise<RedisStreamBatch<string[]>[] | null> {
    const result = await this.sub.xreadgroup(
      'GROUP',
      group,
      consumer,
      'COUNT',
      count,
      'BLOCK',
      block,
      'STREAMS',
      ...stream,
    );

    return result as unknown as RedisStreamBatch<string[]>[] | null;
  }
}
