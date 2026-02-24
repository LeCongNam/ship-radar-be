import { IsArray, IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;


  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  permissions?: number[];
}
