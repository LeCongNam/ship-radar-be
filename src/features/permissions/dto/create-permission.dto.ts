import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  permission: string;
}
