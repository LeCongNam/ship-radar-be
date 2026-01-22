import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../infrastructure/dto';

export class FindAllShippingDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  deliveryBrandId?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
