import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProfileDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  displayName: string;

  @Expose()
  age: number;
}
