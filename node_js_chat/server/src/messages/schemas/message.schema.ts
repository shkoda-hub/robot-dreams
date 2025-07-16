import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: { createdAt: 'sentAt' } })
export class Message {
  @Prop()
  chatId: string;

  @Prop()
  author: string;

  @Prop()
  text: string;

  @Prop()
  sentAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
