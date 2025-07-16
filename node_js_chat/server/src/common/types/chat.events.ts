import { ChatDTO } from '../../chats/dto/chat.dto';
import { MessageDTO } from '../../messages/dto/message.dto';

export type ChatEvent =
  | CreateChatEvent
  | UpdateChatEvent
  | NewMessageEvent
  | TypingEvent;

type CreateChatEvent = {
  type: ChatEventType.CHAT_CREATED;
  data: ChatDTO;
  src: string;
};

type UpdateChatEvent = {
  type: ChatEventType.MEMBERS_UPDATED;
  data: {
    chatId: string;
    members: string[];
  };
  src: string;
};

type NewMessageEvent = {
  type: ChatEventType.MESSAGE;
  data: MessageDTO;
  src: string;
};

type TypingEvent = {
  type: ChatEventType.TYPING;
  data: {
    chatId: string;
    user: string;
    isTyping: boolean;
  };
  src: string;
};

export enum ChatEventType {
  CHAT_CREATED = 'chatCreated',
  MEMBERS_UPDATED = 'membersUpdated',
  MESSAGE = 'message',
  TYPING = 'typing',
}
