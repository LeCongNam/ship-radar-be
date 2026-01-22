import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../infrastructure/dto';

export class FindAllOrderItemDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  productId?: number;
}
