import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { UserDashboardService } from '../services/user.dashboard.service';

@Controller('dashboard/users')
export class UserDashboardController extends BaseController {
  constructor(private readonly userDashboardService: UserDashboardService) {
    super();
  }

  @Post()
  create(@Param('userId', ParseIntPipe) userId: number, @Body() data: any) {
    return this.userDashboardService.create(userId, data);
  }

  @Get('data')
  getDashboardData(@Param('userId', ParseIntPipe) userId: number) {
    return this.userDashboardService.getDashboard(userId);
  }

  @Patch()
  update(@Param('userId', ParseIntPipe) userId: number, @Body() data: any) {
    return this.userDashboardService.update(userId, data);
  }

  @Delete()
  remove(@Param('userId', ParseIntPipe) userId: number) {
    return this.userDashboardService.remove(userId);
  }

  @Get()
  findAll() {
    return this.userDashboardService.findAll();
  }

  @Put(':userId/status')
  updateStatus(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() data: any,
  ) {
    return this.userDashboardService.updateStatus(userId, data);
  }

  @Get(':userId')
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.userDashboardService.findOne(userId);
  }
}
