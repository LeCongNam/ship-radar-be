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
import { FindAllShippingDto } from '../dto/find-all-shipping.dto';
import { UpdateShippingDto } from '../dto/update-shipping.dto';
import { ShippingDashboardService } from '../services/shipping.dashboard.service';

@Controller('dashboard/shipping')
export class ShippingDashboardController {
  constructor(
    private readonly shippingDashboardService: ShippingDashboardService,
  ) {}

  @Post()
  create(@Body() createShippingDto: CreateShippingDto) {
    return this.shippingDashboardService.create(createShippingDto);
  }

  @Get()
  findAll(@Query() query: FindAllShippingDto) {
    return this.shippingDashboardService.findAll(
      query.page,
      query.pageSize,
      query.search,
      query.orderId,
      query.deliveryBrandId,
      query.status,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingDashboardService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShippingDto: UpdateShippingDto,
  ) {
    return this.shippingDashboardService.update(+id, updateShippingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingDashboardService.remove(+id);
  }

  @Patch(':id/update-status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.shippingDashboardService.updateStatus(+id, body.status);
  }
}
