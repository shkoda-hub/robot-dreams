import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Headers,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('chats/:chatId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessages(
    @Headers('X-User') user: string,
    @Param('chatId') chatId: string,
    @Query('limit') limit: string,
    @Query('cursor') cursor?: string,
  ) {
    return await this.messagesService.getMessages(
      chatId,
      parseInt(limit, 10),
      cursor,
    );
  }

  @Post()
  async createMessage(
    @Headers('X-User') author: string,
    @Param('chatId') chatId: string,
    @Body('text') message: string,
  ) {
    return await this.messagesService.createMessage(chatId, message, author);
  }
}
