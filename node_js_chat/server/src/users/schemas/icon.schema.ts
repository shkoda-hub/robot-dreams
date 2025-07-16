import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserIconDocument = HydratedDocument<UserIcon>;

@Schema()
export class UserIcon {
  @Prop()
  userId: string;

  @Prop({
    type: {
      data: Buffer,
      contentType: String,
    },
  })
  img: {
    data: Buffer;
    contentType: string;
  };
}

export const UserIconSchema = SchemaFactory.createForClass(UserIcon);
