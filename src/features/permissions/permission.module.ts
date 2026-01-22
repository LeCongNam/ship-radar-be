import { Module } from '@nestjs/common';
import { PermissionController } from './controllers/permission.controller';
import { PermissionDashboardController } from './controllers/permission.dashboard.controller';
import { PermissionDashboardService } from './services/permission.dashboard.service';
import { PermissionService } from './services/permission.service';

@Module({
  controllers: [PermissionController, PermissionDashboardController],
  providers: [PermissionService, PermissionDashboardService],
})
export class PermissionModule {}
