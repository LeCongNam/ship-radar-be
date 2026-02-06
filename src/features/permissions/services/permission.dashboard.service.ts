import { Injectable, NotFoundException } from '@nestjs/common';
import { PERMISSIONS_LIST } from '../../../infrastructure/constants';
import { RolePermissionRepository } from '../../../infrastructure/repositories';
import { prisma } from '../../../lib/prisma/prisma';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@Injectable()
export class PermissionDashboardService {
  constructor(
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  async getAllPermissions() {
    return {
      data: PERMISSIONS_LIST,
      total: PERMISSIONS_LIST.length,
    };
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
      this.rolePermissionRepository.findMany({
        where,
        skip,
        take: limit,
        include: {
          role: true,
        },
        orderBy: { id: 'asc' },
      }),
      this.rolePermissionRepository.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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
