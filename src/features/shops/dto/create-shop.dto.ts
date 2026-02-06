import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateShopDto {
  id?: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  ownerId?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
