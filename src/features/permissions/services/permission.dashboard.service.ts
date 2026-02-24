import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PermissionRepository,
  RolePermissionRepository,
} from '../../../infrastructure/repositories';
import { prisma } from '../../../lib/prisma/prisma';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@Injectable()
export class PermissionDashboardService {
  constructor(
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async getAllPermissions() {
    const [data, total] = await Promise.all([
      this.permissionRepository.findMany({ orderBy: { id: 'asc' } }),
      this.permissionRepository.count(),
    ]);

    return { data, total };
  }

  async create(createPermissionDto: CreatePermissionDto) {
    return this.rolePermissionRepository.create(createPermissionDto as any);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    roleId?: number,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (roleId) {
      where.roleId = roleId;
    }

    if (search) {
      where.permission = { contains: search };
    }

    const [data, total] = await Promise.all([
      this.permissionRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.permissionRepository.count({ where }),
    ]);

    return {
      data,
      total
    };
  }

  async findOne(id: number) {
    const permission = await this.rolePermissionRepository.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    await this.findOne(id);

    return this.rolePermissionRepository.update(id, updatePermissionDto);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.rolePermissionRepository.delete({
      where: { id },
    });
  }

  async removeByRole(roleId: number) {
    await prisma.rolePermissions.deleteMany({
      where: { roleId },
    });

    return { message: `All permissions for role ${roleId} have been removed` };
  }
}
