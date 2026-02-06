import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  sku: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  productCode?: string;

  ownerId?: number;

  productCodeFilter?: string;
}
