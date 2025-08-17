import {
  IsEmail,
  IsInt,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateProfileDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(2)
  displayName: string;

  @IsInt()
  @Min(0)
  age: number;
}
