import { Module } from '@nestjs/common';
import { OrderItemController } from './controllers/order-item.controller';
import { OrderItemDashboardController } from './controllers/order-item.dashboard.controller';
import { OrderItemDashboardService } from './services/order-item.dashboard.service';
import { OrderItemService } from './services/order-item.service';

@Module({
  controllers: [OrderItemController, OrderItemDashboardController],
  providers: [OrderItemService, OrderItemDashboardService],
})
export class OrderItemModule {}
