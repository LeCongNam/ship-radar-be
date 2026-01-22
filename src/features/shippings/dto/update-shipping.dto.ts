import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateShippingDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shipperName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  shipperPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  licensePlate?: string;

  @IsOptional()
  @IsString()
  noted?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsBoolean()
  isCod?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  codAmount?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
