import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Message } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDTO } from './dto/message.dto';
import Redis from 'ioredis';
import { Subject } from 'rxjs';
import { REDIS_CHAT_EVENTS_CHANNEL_NAME } from '../common/constants';
import { ChatEvent, ChatEventType } from '../common/types/chat.events';
import {
  transformToDto,
  transformToDtoArray,
} from '../common/utils/mongo.utils';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MessagesService implements OnModuleInit, OnModuleDestroy {
  public readonly message$ = new Subject<MessageDTO>();
  public readonly typing$ = new Subject<{
    chatId: string;
    user: string;
    isTyping: boolean;
  }>();

  private sub: Redis;

  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @Inject('REDIS_SUB') private readonly redisSub: Redis,
    @Inject('INSTANCE_ID') private readonly instanceId: string,
    private readonly redisService: RedisService,
  ) {}

  onModuleDestroy() {
    this.sub.disconnect();
  }

  async onModuleInit() {
    this.sub = this.redisSub.duplicate();
    await this.sub.subscribe(REDIS_CHAT_EVENTS_CHANNEL_NAME);
    this.sub.on('message', (channel, raw) => {
      const { type, data, src } = JSON.parse(raw) as ChatEvent;
      if (src === this.instanceId) return;
      switch (type) {
        case ChatEventType.TYPING:
          this.typing$.next(data);
          break;
        case ChatEventType.MESSAGE:
          this.message$.next(data);
          break;
      }
    });
  }

  async getMessages(
    chatId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: MessageDTO[]; nextCursor?: string }> {
    const filter: Record<string, any> = { chatId };

    if (cursor) {
      filter.sentAt = { $lt: new Date(cursor) };
    }
    const docs = await this.messageModel
      .find(filter)
      .sort({ sentAt: -1 })
      .limit(limit + 1)
      .lean()
      .exec();

    let nextCursor: string | undefined = undefined;
    if (docs.length > limit) {
      const extra = docs.pop()!;
      nextCursor = extra.sentAt.toISOString();
    }

    const items = transformToDtoArray(MessageDTO, docs);
    return { items, nextCursor };
  }

  async createMessage(chatId: string, text: string, author: string) {
    const doc = await this.messageModel.create({
      chatId,
      author,
      text,
    });

    const message = transformToDto(MessageDTO, doc);

    this.message$.next(message);
    await this.redisService.publishMessage(ChatEventType.MESSAGE, message);

    return message;
  }

  async setTypingStatus(
    chatId: string,
    user: string,
    isTyping: boolean,
  ): Promise<void> {
    const payload = { chatId, user, isTyping };

    this.typing$.next(payload);
    await this.redisService.publishMessage(ChatEventType.TYPING, payload);
  }
}
