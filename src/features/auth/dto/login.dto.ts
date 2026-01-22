import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  deviceId?: string;

  deviceType?: string | null;
  osVersion?: string | null;
}
