import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../infrastructure/dto';

export enum STOCK_STATUS {
  ALL = 'all',
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

export class FindAllProductDto extends PaginationDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(STOCK_STATUS)
  stockStatus?: STOCK_STATUS;
}
