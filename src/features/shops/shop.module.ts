import { Module } from '@nestjs/common';
import { ShopController } from './controllers/shop.controller';
import { ShopDashboardController } from './controllers/shop.dashboard.controller';
import { ShopDashboardService } from './services/shop.dashboard.service';
import { ShopService } from './services/shop.service';

@Module({
  controllers: [ShopController, ShopDashboardController],
  providers: [ShopService, ShopDashboardService],
})
export class ShopModule {}
