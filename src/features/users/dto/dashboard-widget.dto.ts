import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum WidgetType {
  STATISTICS = 'statistics',
  CHART = 'chart',
  TABLE = 'table',
  CARD = 'card',
  LIST = 'list',
}

export class CreateDashboardWidgetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(WidgetType)
  @IsNotEmpty()
  type: WidgetType;

  @IsNumber()
  @IsOptional()
  position?: number;

  @IsString()
  @IsOptional()
  config?: string; // JSON string for widget configuration

  @IsString()
  @IsOptional()
  size?: string; // e.g., "small", "medium", "large"
}

export class UpdateDashboardWidgetDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(WidgetType)
  @IsOptional()
  type?: WidgetType;

  @IsNumber()
  @IsOptional()
  position?: number;

  @IsString()
  @IsOptional()
  config?: string;

  @IsString()
  @IsOptional()
  size?: string;
}
