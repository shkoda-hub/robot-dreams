import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateTransferDto {
  @Expose()
  from: string;

  @Expose()
  to: string;

  @Expose()
  amount: number;
}
