import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDeliveryBrandDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  hotline?: string;

  @IsOptional()
  @IsString()
  supportEmail?: string;

  @IsOptional()
  @IsString()
  supportPhone?: string;

  @IsOptional()
  @IsString()
  operating_hours?: string;
}
