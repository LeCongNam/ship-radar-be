import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsNumber()
  deliveryBrandId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  trackingNumber: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  shipperName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  shipperPhone: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  licensePlate?: string;

  @IsOptional()
  @IsString()
  noted?: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsBoolean()
  isCod?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  codAmount?: number;

  @IsNotEmpty()
  @IsString()
  status: string;
}
