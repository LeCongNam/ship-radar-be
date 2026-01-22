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
import { CreateRoleDto } from '../dto/create-role.dto';
import { FindAllRoleDto } from '../dto/find-all-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleDashboardService } from '../services/role.dashboard.service';

@Controller('dashboard/role')
export class RoleDashboardController {
  constructor(private readonly roleDashboardService: RoleDashboardService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleDashboardService.create(createRoleDto);
  }

  @Get()
  findAll(@Query() query: FindAllRoleDto) {
    return this.roleDashboardService.findAll(
      query.page,
      query.pageSize,
      query.search,
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
    @Body() body: { permissions: string[] },
  ) {
    return this.roleDashboardService.assignPermissions(+id, body.permissions);
  }

  @Get(':id/users')
  getUsersByRole(@Param('id') id: string) {
    return this.roleDashboardService.getUsersByRole(+id);
  }
}
