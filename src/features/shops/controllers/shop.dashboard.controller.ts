import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { CreateShopDto } from '../dto/create-shop.dto';
import { GetListShopDashboardDto } from '../dto/get-list.dto';
import { UpdateShopDto } from '../dto/update-shop.dto';
import { ShopDashboardService } from '../services/shop.dashboard.service';

@Controller('dashboard/shops')
export class ShopDashboardController extends BaseController {
  constructor(private readonly shopDashboardService: ShopDashboardService) {
    super();
  }

  @Get()
  getList(@Query() query: GetListShopDashboardDto) {
    return this.shopDashboardService.getList(query);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.shopDashboardService.getById(id);
  }

  @Get(':id/statistics')
  getStatistics(@Param('id') id: string) {
    return this.shopDashboardService.getStatistics(id);
  }

  @Post()
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopDashboardService.create(createShopDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopDashboardService.update(id, updateShopDto);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string) {
    return this.shopDashboardService.toggleActive(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.shopDashboardService.delete(id);
  }
}
