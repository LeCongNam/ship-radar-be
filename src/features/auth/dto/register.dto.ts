import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;
}
