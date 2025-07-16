import { ChatsService } from './chats.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Headers,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CreateChatDTO } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CanManageChatGuard } from './guards/can-manage-chat.guard';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllChats(@Headers('X-User') user: string) {
    const chats = await this.chatsService.getAllChats(user);
    return {
      items: chats,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createChat(
    @Body() createChatDto: CreateChatDTO,
    @Headers('X-User') creator: string,
  ) {
    return await this.chatsService.createChat(createChatDto, creator);
  }

  @Patch(':id/members')
  @HttpCode(HttpStatus.OK)
  @UseGuards(CanManageChatGuard)
  async updateChat(
    @Body() updateChatDto: UpdateChatDto,
    @Param('id') id: string,
    @Headers('X-User') admin: string,
  ) {
    return await this.chatsService.updateChat(id, updateChatDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CanManageChatGuard)
  async deleteChat(@Param('id') id: string, @Headers('X-User') admin: string) {
    return await this.chatsService.deleteChat(id);
  }
}
