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
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { CreateProductDto } from '../dto/create-product.dto';
import { FindAllProductDto } from '../dto/find-all-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductDashboardService } from '../services/product.dashboard.service';

@Controller('dashboard/products')
export class ProductDashboardController extends BaseController {
  constructor(
    private readonly productDashboardService: ProductDashboardService,
  ) {
    super();
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productDashboardService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: FindAllProductDto) {
    return this.productDashboardService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productDashboardService.findOne(id);
    return {
      data: product,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productDashboardService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productDashboardService.remove(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.productDashboardService.activate(id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.productDashboardService.deactivate(id);
  }

  @Patch(':id/update-stock')
  updateStock(@Param('id') id: string, @Body() body: { stock: number }) {
    return this.productDashboardService.updateStock(id, body.stock);
  }
}
