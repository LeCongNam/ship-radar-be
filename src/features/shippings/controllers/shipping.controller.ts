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
import { CreateShippingDto } from '../dto/create-shipping.dto';
import { UpdateShippingDto } from '../dto/update-shipping.dto';
import { ShippingService } from '../services/shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post()
  create(@Body() createShippingDto: CreateShippingDto) {
    return this.shippingService.create(createShippingDto);
  }

  @Get()
  findAll(
    @Query('orderId') orderId?: string,
    @Query('status') status?: string,
  ) {
    return this.shippingService.findAll(orderId ? +orderId : undefined, status);
  }

  @Get('tracking/:trackingNumber')
  findByTracking(@Param('trackingNumber') trackingNumber: string) {
    return this.shippingService.findByTracking(trackingNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShippingDto: UpdateShippingDto,
  ) {
    return this.shippingService.update(+id, updateShippingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingService.remove(+id);
  }
}
