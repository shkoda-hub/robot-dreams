import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatsModule } from '../chats/chats.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [ChatsModule, MessagesModule],
  providers: [ChatGateway],
})
export class WsModule {}
