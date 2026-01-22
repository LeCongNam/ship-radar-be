import { Injectable, NotFoundException } from '@nestjs/common';
import {
  RolePermissionRepository,
  RoleRepository,
} from '../../../infrastructure/repositories';
import { prisma } from '../../../lib/prisma';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RoleDashboardService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.create(createRoleDto);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.roleRepository.findMany({
        where,
        skip,
        take: limit,
        include: {
          permissions: true,
          users: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { id: 'asc' },
      }),
      this.roleRepository.count({ where }),
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
    const role = await this.roleRepository.findUnique({
      where: { id },
      include: {
        permissions: true,
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id);

    return this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.roleRepository.delete({
      where: { id },
    });
  }

  async assignPermissions(roleId: number, permissions: string[]) {
    await this.findOne(roleId);

    // Delete existing permissions
    await prisma.rolePermissions.deleteMany({
      where: { roleId },
    });

    // Create new permissions
    const permissionData = permissions.map((permission) => ({
      roleId,
      permission,
    }));

    await prisma.rolePermissions.createMany({
      data: permissionData,
    });

    return this.findOne(roleId);
  }

  async getUsersByRole(roleId: number) {
    await this.findOne(roleId);

    return this.roleRepository.findUnique({
      where: { id: roleId },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                isActive: true,
              },
            },
          },
        },
      },
    });
  }
}
