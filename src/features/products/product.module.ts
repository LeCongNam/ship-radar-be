import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductDashboardController } from './controllers/product.dashboard.controller';
import { ProductHelperService } from './services/product-helper.service';
import { ProductDashboardService } from './services/product.dashboard.service';
import { ProductService } from './services/product.service';

@Module({
  controllers: [ProductController, ProductDashboardController],
  providers: [ProductService, ProductDashboardService, ProductHelperService],
})
export class ProductModule {}
