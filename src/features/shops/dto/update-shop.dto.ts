import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateShopDto } from './create-shop.dto';

export class UpdateShopDto extends PartialType(
  OmitType(CreateShopDto, ['id', 'ownerId'] as const),
) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
