import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { JwtAuthenticationGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from '../dto/create-order.dto';
import { FindAllOrderDto } from '../dto/find-all-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { UpdateStatusDashboardDto } from '../dto/update-status.dashboard.dto';
import { OrderDashboardService } from '../services/order.dashboard.service';

@Controller('dashboard/orders')
@UseGuards(JwtAuthenticationGuard)
export class OrderDashboardController extends BaseController {
  constructor(private readonly orderDashboardService: OrderDashboardService) {
    super();
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderDashboardService.create(createOrderDto);
  }

  @Get()
  findAll(@Query() query: FindAllOrderDto, @Req() req: Request) {
    const userInfo = this.getUserInfo(req);
    return this.orderDashboardService.findAll(query, userInfo);
  }

  @Get('statistics')
  getStatistics(@Query('shopId', ParseIntPipe) shopId?: number) {
    return this.orderDashboardService.getOrderStatistics(shopId);
  }

  @Get('recent')
  getRecent(
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('shopId', ParseIntPipe) shopId?: number,
  ) {
    return this.orderDashboardService.getRecentOrders(limit, shopId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.orderDashboardService.findOne(id);
    return {
      data: order,
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderDashboardService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateStatusDashboardDto,
    @Req() req: Request,
  ) {
    const userInfo = this.getUserInfo(req);
    return this.orderDashboardService.updateStatus(id, body, userInfo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderDashboardService.remove(id);
  }
}
