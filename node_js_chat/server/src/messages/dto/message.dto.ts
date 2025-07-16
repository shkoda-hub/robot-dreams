import {
  Exclude,
  Expose,
  Transform,
  TransformFnParams,
} from 'class-transformer';
import { Types } from 'mongoose';

@Exclude()
export class MessageDTO {
  @Expose()
  @Transform(
    ({ obj }: TransformFnParams): string => {
      const document = obj as { _id: Types.ObjectId };
      return document._id.toString();
    },
    { toClassOnly: true },
  )
  id: string;

  @Expose()
  chatId: string;

  @Expose()
  author: string;

  @Expose()
  text: string;

  @Expose()
  @Transform(({ value }) => {
    const date = value as Date;
    return date.toISOString();
  })
  sentAt: string;
}
