import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis, { RedisValue } from 'ioredis';

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
}
