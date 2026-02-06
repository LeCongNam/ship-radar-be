import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { OrderDashboardController } from './controllers/order.dashboard.controller';
import { OrderDashboardService } from './services/order.dashboard.service';
import { OrderService } from './services/order.service';

@Module({
  controllers: [OrderController, OrderDashboardController],
  providers: [OrderService, OrderDashboardService],
  exports: [OrderService, OrderDashboardService],
})
export class OrderModule {}
