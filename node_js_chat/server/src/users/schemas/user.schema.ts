import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  id: false,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class User {
  @Prop()
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('iconUrl').get(function (this: UserDocument) {
  return `/api/users/${this._id.toHexString()}/icon`;
});
