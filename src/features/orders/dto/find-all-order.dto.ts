import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindAllOrderDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  shopId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
