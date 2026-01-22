import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserDashboardController } from './controllers/user.dashboard.controller';
import { UserDashboardService } from './services/user.dashboard.service';
import { UserService } from './services/user.service';

@Module({
  controllers: [UserController, UserDashboardController],
  providers: [UserService, UserDashboardService],
})
export class UserModule {}
