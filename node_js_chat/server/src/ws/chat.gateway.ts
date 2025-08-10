import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ForbiddenException, OnModuleDestroy } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { Subscription } from 'rxjs';
import { ChatsService } from '../chats/chats.service';
import { ChatEventType } from '../common/types/chat.events';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

type ChatSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  { user: string | undefined }
>;

@WebSocketGateway({ path: '/ws', cors: true })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayInit, OnModuleDestroy
{
  @WebSocketServer() private server: Server;
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
  ) {}

  onModuleDestroy() {
    this.subscriptions.unsubscribe();
  }

  afterInit(): void {
    this.subscriptions.add(
      this.chatsService.chatCreated$.subscribe((chatDto) => {
        for (const [, socket] of this.server.sockets.sockets) {
          const user = socket.data.user as string;

          if (chatDto.members.includes(user) || chatDto) {
            socket.emit(ChatEventType.CHAT_CREATED, chatDto);
          }
        }
      }),
    );
    this.subscriptions.add(
      this.chatsService.membersUpdated$.subscribe(({ chatId, members }) => {
        this.server
          .to(chatId)
          .emit(ChatEventType.MEMBERS_UPDATED, { chatId, members });
      }),
    );
    this.subscriptions.add(
      this.messagesService.message$.subscribe((msgDto) => {
        this.server.to(msgDto.chatId).emit(ChatEventType.MESSAGE, msgDto);
      }),
    );
    this.subscriptions.add(
      this.messagesService.typing$.subscribe((status) => {
        this.server.to(status.chatId).emit(ChatEventType.TYPING, status);
      }),
    );
  }

  handleConnection(client: ChatSocket): any {
    const user = client.handshake.auth?.user as string;

    if (!user) return client.disconnect(true);
    client.data.user = user;
  }

  @SubscribeMessage('join')
  async onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() { chatId }: { chatId: string },
  ): Promise<void> {
    await client.join(chatId);
  }

  @SubscribeMessage('leave')
  async onLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() { chatId }: { chatId: string },
  ): Promise<void> {
    await client.leave(chatId);
  }

  @SubscribeMessage('send')
  async onSend(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() { chatId, text }: { chatId: string; text: string },
  ): Promise<void> {
    const user = client.data.user;
    if (!user) throw new ForbiddenException();
    try {
      await this.messagesService.createMessage(chatId, text, user);
    } catch {
      throw new WsException('Failed to send message');
    }
  }

  @SubscribeMessage('typing')
  async onTyping(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() { chatId, isTyping }: { chatId: string; isTyping: boolean },
  ): Promise<void> {
    const user = client.data.user;
    if (!user) throw new ForbiddenException();
    await this.messagesService.setTypingStatus(chatId, user, isTyping);
  }
}
