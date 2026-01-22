import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DashboardLayoutDto {
  @IsString()
  @IsNotEmpty()
  widgetId: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}

export class CreateDashboardSettingsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DashboardLayoutDto)
  @IsOptional()
  layout?: DashboardLayoutDto[];

  @IsString()
  @IsOptional()
  theme?: string; // light, dark, auto

  @IsString()
  @IsOptional()
  preferences?: string; // JSON string for user preferences
}

export class UpdateDashboardSettingsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DashboardLayoutDto)
  @IsOptional()
  layout?: DashboardLayoutDto[];

  @IsString()
  @IsOptional()
  theme?: string;

  @IsString()
  @IsOptional()
  preferences?: string;
}
