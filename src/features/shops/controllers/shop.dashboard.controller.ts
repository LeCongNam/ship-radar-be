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
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { JwtAuthenticationGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateShopDto } from '../dto/create-shop.dto';
import { GetListShopDashboardDto } from '../dto/get-list.dto';
import { UpdateShopDto } from '../dto/update-shop.dto';
import { ShopDashboardService } from '../services/shop.dashboard.service';

@Controller('dashboard/shops')
@UseGuards(JwtAuthenticationGuard)
export class ShopDashboardController extends BaseController {
  constructor(private readonly shopDashboardService: ShopDashboardService) {
    super();
  }

  @Get()
  getList(@Query() query: GetListShopDashboardDto) {
    return this.shopDashboardService.getList(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.shopDashboardService.getById(id);
  }

  @Get(':id/statistics')
  getStatistics(@Param('id', ParseIntPipe) id: number) {
    return this.shopDashboardService.getStatistics(id);
  }

  @Post()
  create(@Req() request: any, @Body() createShopDto: CreateShopDto) {
    const userInfo = this.getUserInfo(request);
    return this.shopDashboardService.create(createShopDto, userInfo.user);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShopDto: UpdateShopDto,
  ) {
    return this.shopDashboardService.update(id, updateShopDto);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.shopDashboardService.toggleActive(id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.shopDashboardService.delete(id);
  }
}
