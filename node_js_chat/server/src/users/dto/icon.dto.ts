import { Exclude, Expose } from 'class-transformer';
import * as Buffer from 'node:buffer';

@Exclude()
export class IconDTO {
  @Expose()
  data: Buffer;

  @Expose()
  contentType: string;
}
