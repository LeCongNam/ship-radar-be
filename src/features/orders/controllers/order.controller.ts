import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { CreateOrderDto } from '../dto/create-order.dto';
import { FindAllOrderDto } from '../dto/find-all-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderService } from '../services/order.service';

@Controller('orders')
export class OrderController extends BaseController {
  constructor(private readonly orderService: OrderService) {
    super();
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(@Query() query: FindAllOrderDto) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}
