import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateChatDTO {
  @Expose()
  name?: string;

  @Expose()
  members: string[];
}
