import { Module } from '@nestjs/common';
import { RoleController } from './controllers/role.controller';
import { RoleDashboardController } from './controllers/role.dashboard.controller';
import { RoleDashboardService } from './services/role.dashboard.service';
import { RoleService } from './services/role.service';

@Module({
  controllers: [RoleController, RoleDashboardController],
  providers: [RoleService, RoleDashboardService],
})
export class RoleModule {}
