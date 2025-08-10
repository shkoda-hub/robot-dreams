import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Model } from 'mongoose';
import { CreateChatDTO } from './dto/create-chat.dto';
import { ChatDTO } from './dto/chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Subject } from 'rxjs';
import Redis from 'ioredis';
import { REDIS_CHAT_EVENTS_CHANNEL_NAME } from '../common/constants';
import { UpdateChatResponseDto } from './dto/update-chat.response.dto';
import { ChatEvent, ChatEventType } from '../common/types/chat.events';
import {
  transformToDto,
  transformToDtoArray,
} from '../common/utils/mongo.utils';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ChatsService implements OnModuleInit, OnModuleDestroy {
  private sub: Redis;

  public readonly chatCreated$ = new Subject<ChatDTO>();
  public readonly membersUpdated$ = new Subject<{
    chatId: string;
    members: string[];
  }>();

  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @Inject('REDIS_SUB') private readonly redisSub: Redis,
    @Inject('INSTANCE_ID') private readonly instanceId: string,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    this.sub = this.redisSub.duplicate();
    await this.sub.subscribe(REDIS_CHAT_EVENTS_CHANNEL_NAME);
    this.sub.on('message', (channel, raw) => {
      const { type, data, src } = JSON.parse(raw) as ChatEvent;
      if (src === this.instanceId) return;
      switch (type) {
        case ChatEventType.CHAT_CREATED:
          this.chatCreated$.next(data);
          break;
        case ChatEventType.MEMBERS_UPDATED:
          this.membersUpdated$.next(data);
          break;
      }
    });
  }

  async getAllChats(user: string): Promise<ChatDTO[]> {
    const chats = await this.chatModel
      .find({
        $or: [{ members: { $in: [user] } }, { creator: user }],
      })
      .lean()
      .exec();

    return transformToDtoArray(ChatDTO, chats);
  }

  async createChat(
    createChatDTO: CreateChatDTO,
    creator: string,
  ): Promise<ChatDTO> {
    const { name: chatName } = createChatDTO;
    const members = Array.from(new Set([...createChatDTO.members, creator]));

    const name = chatName
      ? chatName
      : members.length === 2
        ? `${members[0]} & ${members[1]}`
        : 'New chat';

    const chat = await this.chatModel.create({ name, members, creator });

    const chatDto = transformToDto(ChatDTO, chat);

    this.chatCreated$.next(chatDto);
    await this.redisService.publishMessage(ChatEventType.CHAT_CREATED, chatDto);

    return chatDto;
  }

  async updateChat(
    id: string,
    updateChatDto: UpdateChatDto,
  ): Promise<UpdateChatResponseDto> {
    const { add = [], remove = [] } = updateChatDto;
    const chat = await this.getChatDocument(id);

    if (!add.length && !remove.length) {
      return transformToDto(UpdateChatResponseDto, chat);
    }

    chat.members = chat.members.filter((member) => !remove.includes(member));
    add.forEach((member) => chat.members.push(member));

    await chat.save();

    const payload = { chatId: id, members: chat.members };

    this.membersUpdated$.next(payload);
    await this.redisService.publishMessage(
      ChatEventType.MEMBERS_UPDATED,
      payload,
    );

    return transformToDto(UpdateChatResponseDto, chat);
  }

  async deleteChat(id: string): Promise<void> {
    const chat = await this.getChatDocument(id);
    await chat.deleteOne();
  }

  public async getChatDocument(id: string): Promise<ChatDocument> {
    const chat = await this.chatModel.findOne({ _id: id }).exec();

    if (!chat) {
      throw new NotFoundException(`Chat with id ${id} not found`);
    }
    return chat;
  }

  onModuleDestroy() {
    this.sub.disconnect();
  }
}
