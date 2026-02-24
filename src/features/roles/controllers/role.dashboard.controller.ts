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
import { CreateRoleDto } from '../dto/create-role.dto';
import { FindAllRoleDto } from '../dto/find-all-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleDashboardService } from '../services/role.dashboard.service';

@Controller('dashboard/roles')
export class RoleDashboardController extends BaseController{
  constructor(private readonly roleDashboardService: RoleDashboardService) {
    super();
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleDashboardService.create(createRoleDto);
  }

  @Get()
  findAll(@Query() query: FindAllRoleDto) {
    return this.roleDashboardService.findAll(
     query
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleDashboardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleDashboardService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleDashboardService.remove(+id);
  }

  @Post(':id/permissions')
  assignPermissions(
    @Param('id') id: string,
    @Body() body: { permissions: number[] },
  ) {
    return this.roleDashboardService.assignPermissions(+id, body.permissions);
  }

  @Get(':id/users')
  getUsersByRole(@Param('id') id: string) {
    return this.roleDashboardService.getUsersByRole(+id);
  }
}
