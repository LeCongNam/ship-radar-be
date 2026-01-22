import { Module } from '@nestjs/common';
import { ShippingController } from './controllers/shipping.controller';
import { ShippingDashboardController } from './controllers/shipping.dashboard.controller';
import { ShippingDashboardService } from './services/shipping.dashboard.service';
import { ShippingService } from './services/shipping.service';

@Module({
  controllers: [ShippingController, ShippingDashboardController],
  providers: [ShippingService, ShippingDashboardService],
})
export class ShippingModule {}
