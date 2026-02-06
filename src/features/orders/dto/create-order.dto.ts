import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  status: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  receiverName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  receiverPhone: string;

  @IsNotEmpty()
  @IsString()
  receiverAddress: string;

  @IsOptional()
  @IsString()
  noted?: string;

  @IsNotEmpty()
  @IsInt()
  shopId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems?: CreateOrderItemDto[];

  orderBarcode?: string;
}
