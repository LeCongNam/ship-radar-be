import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../../../infrastructure/dto';
import {
  RolePermissionRepository,
  RoleRepository,
} from '../../../infrastructure/repositories';
import { prisma } from '../../../lib/prisma/prisma';
import { CreateRoleDto } from '../dto/create-role.dto';
import { FindAllRoleDto } from '../dto/find-all-role.dto';
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

  async findAll(query: FindAllRoleDto) {
   const { page, pageSize: limit, search, skip, where } = new PaginationDto(query); 
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [data, total] = await this.roleRepository.findAndCount({
      where,
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    })

    return {
      data,
      total
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

   const { permissions, ...rest } = updateRoleDto;

   if (permissions) {
     await this.assignPermissions(id, permissions);
   }

    return this.roleRepository.update(id, rest);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.roleRepository.delete({
      where: { id },
    });
  }

  async assignPermissions(roleId: number, permissions: number[]) {
    await this.findOne(roleId);

    // Delete existing permissions
    await prisma.rolePermissions.deleteMany({
      where: { roleId },
    });

    // Create new permissions
    const permissionData = permissions.map((permission) => ({
      roleId,
      permissionId: permission,
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
