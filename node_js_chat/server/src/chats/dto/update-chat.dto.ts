import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateChatDto {
  @Expose()
  add?: string[];

  @Expose()
  remove?: string[];
}
