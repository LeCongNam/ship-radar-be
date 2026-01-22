import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePermissionDto {
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  permission?: string;
}
