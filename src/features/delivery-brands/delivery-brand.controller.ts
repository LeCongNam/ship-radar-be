import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliveryBrandService } from './delivery-brand.service';
import { CreateDeliveryBrandDto } from './dto/create-delivery-brand.dto';
import { UpdateDeliveryBrandDto } from './dto/update-delivery-brand.dto';

@Controller('delivery-brand')
export class DeliveryBrandController {
  constructor(private readonly deliveryBrandService: DeliveryBrandService) {}

  @Post()
  create(@Body() createDeliveryBrandDto: CreateDeliveryBrandDto) {
    return this.deliveryBrandService.create(createDeliveryBrandDto);
  }

  @Get()
  findAll() {
    return this.deliveryBrandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryBrandService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeliveryBrandDto: UpdateDeliveryBrandDto) {
    return this.deliveryBrandService.update(+id, updateDeliveryBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryBrandService.remove(+id);
  }
}
