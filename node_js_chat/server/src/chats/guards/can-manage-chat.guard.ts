import { CanActivate, ForbiddenException, Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { Request } from 'express';
import { ChatsService } from '../chats.service';
import { UpdateChatDto } from '../dto/update-chat.dto';

@Injectable()
export class CanManageChatGuard implements CanActivate {
  constructor(private readonly chatService: ChatsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const body = request.body as UpdateChatDto;
    const chat = await this.chatService.getChatDocument(request.params.id);
    const user = request.get('X-User') as string;

    if (user !== chat.creator && !body.remove?.includes(user)) {
      throw new ForbiddenException('Not allowed to update chat');
    }

    return true;
  }
}
