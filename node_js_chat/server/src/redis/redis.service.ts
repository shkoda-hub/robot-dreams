import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ChatEventType } from '../common/types/chat.events';
import { REDIS_CHAT_EVENTS_CHANNEL_NAME } from '../common/constants';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_PUB') private readonly redisPub: Redis,
    @Inject('INSTANCE_ID') private readonly instanceId: string,
  ) {}

  async publishMessage<T = ChatEventType>(
    type: T,
    data: object,
  ): Promise<void> {
    const message = JSON.stringify({
      type,
      data,
      src: this.instanceId,
    });

    await this.redisPub.publish(REDIS_CHAT_EVENTS_CHANNEL_NAME, message);
  }
}
