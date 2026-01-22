import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateDeliveryBrandDto } from '../dto/create-delivery-brand.dto';
import { UpdateDeliveryBrandDto } from '../dto/update-delivery-brand.dto';
import { DeliveryBrandService } from '../services/delivery-brand.service';

@Controller('delivery-brand')
export class DeliveryBrandController {
  constructor(private readonly deliveryBrandService: DeliveryBrandService) {}

  @Post()
  create(@Body() createDeliveryBrandDto: CreateDeliveryBrandDto) {
    return this.deliveryBrandService.create(createDeliveryBrandDto);
  }

  @Get()
  findAll(@Query('isActive') isActive?: string) {
    const filter = isActive !== undefined ? isActive === 'true' : undefined;
    return this.deliveryBrandService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryBrandService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeliveryBrandDto: UpdateDeliveryBrandDto,
  ) {
    return this.deliveryBrandService.update(+id, updateDeliveryBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryBrandService.remove(+id);
  }
}
