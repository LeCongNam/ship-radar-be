import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../infrastructure/dto';

export class FindAllPermissionDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  roleId?: number;
}
