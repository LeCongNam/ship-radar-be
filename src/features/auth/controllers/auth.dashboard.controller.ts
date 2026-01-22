import { Controller, Post } from '@nestjs/common';
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { AuthDashboardService } from '../services/auth.dashboard.service';

@Controller('auth/dashboard')
export class AuthDashboardController extends BaseController {
  constructor(private readonly authDbSvc: AuthDashboardService) {
    super();
  }

  @Post('init')
  async initDashboard() {
    await this.authDbSvc.initDashboard();
    return { message: 'Dashboard initialized successfully' };
  }
}
