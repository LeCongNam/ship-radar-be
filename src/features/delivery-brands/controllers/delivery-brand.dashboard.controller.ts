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
import { PERMISSION_CONSTANT } from '../../../infrastructure/constants';
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { RequirePermissions } from '../../../infrastructure/shared/permissions.decorator';
import { CreateDeliveryBrandDto } from '../dto/create-delivery-brand.dto';
import { FindAllDeliveryBrandDto } from '../dto/find-all-delivery-brand.dto';
import { UpdateDeliveryBrandDto } from '../dto/update-delivery-brand.dto';
import { DeliveryBrandDashboardService } from '../services/delivery-brand.dashboard.service';

@Controller('dashboard/delivery-brands')
export class DeliveryBrandDashboardController extends BaseController {
  constructor(
    private readonly deliveryBrandDashboardService: DeliveryBrandDashboardService,
  ) {
    super();
  }

  @Post()
  @RequirePermissions(PERMISSION_CONSTANT.CREATE_DELIVERY_BRAND)
  create(@Body() createDeliveryBrandDto: CreateDeliveryBrandDto) {
    return this.deliveryBrandDashboardService.create(createDeliveryBrandDto);
  }

  @Get()
  @RequirePermissions(PERMISSION_CONSTANT.VIEW_DELIVERY_BRANDS)
  findAll(@Query() query: FindAllDeliveryBrandDto) {
    return this.deliveryBrandDashboardService.findAll(
      query.page,
      query.pageSize,
      query.search,
      query.isActive,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryBrandDashboardService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeliveryBrandDto: UpdateDeliveryBrandDto,
  ) {
    return this.deliveryBrandDashboardService.update(
      +id,
      updateDeliveryBrandDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryBrandDashboardService.remove(+id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.deliveryBrandDashboardService.activate(+id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.deliveryBrandDashboardService.deactivate(+id);
  }
}
