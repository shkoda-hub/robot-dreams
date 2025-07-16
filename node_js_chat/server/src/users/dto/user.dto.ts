import {
  Exclude,
  Expose,
  Transform,
  TransformFnParams,
} from 'class-transformer';
import { Types } from 'mongoose';

@Exclude()
export class UserDto {
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
  name: string;

  @Expose()
  iconUrl: string;
}
