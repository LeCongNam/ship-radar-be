import { Module } from '@nestjs/common';
import { DeliveryBrandController } from './controllers/delivery-brand.controller';
import { DeliveryBrandDashboardController } from './controllers/delivery-brand.dashboard.controller';
import { DeliveryBrandDashboardService } from './services/delivery-brand.dashboard.service';
import { DeliveryBrandService } from './services/delivery-brand.service';

@Module({
  controllers: [DeliveryBrandController, DeliveryBrandDashboardController],
  providers: [DeliveryBrandService, DeliveryBrandDashboardService],
})
export class DeliveryBrandModule {}
