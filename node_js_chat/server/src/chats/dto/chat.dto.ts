import {
  Exclude,
  Expose,
  Transform,
  TransformFnParams,
} from 'class-transformer';
import { Types } from 'mongoose';

@Exclude()
export class ChatDTO {
  @Expose()
  @Transform(
    ({ obj }: TransformFnParams): string => {
      const document = obj as { _id: Types.ObjectId };
      return document._id.toString();
    },
    { toClassOnly: true },
  )
  id!: string;

  @Expose()
  name: string;

  @Expose()
  members: string[];

  @Expose()
  @Transform(({ value }): string => {
    const date = value as Date;
    return date.toISOString();
  })
  updatedAt?: string;
}
