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
import { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { FindAllOrderItemDto } from '../dto/find-all-order-item.dto';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';
import { OrderItemDashboardService } from '../services/order-item.dashboard.service';

@Controller('dashboard/order-item')
export class OrderItemDashboardController {
  constructor(
    private readonly orderItemDashboardService: OrderItemDashboardService,
  ) {}

  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemDashboardService.create(createOrderItemDto);
  }

  @Get()
  findAll(@Query() query: FindAllOrderItemDto) {
    return this.orderItemDashboardService.findAll(
      query.page,
      query.pageSize,
      query.orderId,
      query.productId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderItemDashboardService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemDashboardService.update(+id, updateOrderItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderItemDashboardService.remove(+id);
  }
}
