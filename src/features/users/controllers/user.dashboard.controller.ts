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
  Req,
  UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { JwtAuthenticationGuard } from '../../auth/guards/jwt-auth.guard';
import { UserDashboardService } from '../services/user.dashboard.service';

@Controller('dashboard/users')
@UseGuards(JwtAuthenticationGuard)
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
  findAll(@Req() request: Request) {
    const usr = this.getUserInfo(request);
    return this.userDashboardService.findAll(usr.user);
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
