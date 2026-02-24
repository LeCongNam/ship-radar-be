import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { FindAllPermissionDto } from '../dto/find-all-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { PermissionDashboardService } from '../services/permission.dashboard.service';

@Controller('dashboard/permissions')
export class PermissionDashboardController extends BaseController {
  constructor(
    private readonly permissionDashboardService: PermissionDashboardService,
  ) {
    super();
  }

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionDashboardService.create(createPermissionDto);
  }

  @Get('list')
  getAllPermissions() {
    return this.permissionDashboardService.getAllPermissions();
  }

  @Get()
  findAll(@Query() query: FindAllPermissionDto) {
    return this.permissionDashboardService.findAll(
      query.page,
      query.pageSize,
      query.roleId,
      query.search,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionDashboardService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionDashboardService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionDashboardService.remove(+id);
  }

  @Delete('role/:roleId')
  removeByRole(@Param('roleId') roleId: string) {
    return this.permissionDashboardService.removeByRole(+roleId);
  }
}
