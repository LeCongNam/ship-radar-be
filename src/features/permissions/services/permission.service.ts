import { Injectable, NotFoundException } from '@nestjs/common';
import { RolePermissionRepository } from '../../../infrastructure/repositories';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return this.rolePermissionRepository.create(createPermissionDto as any);
  }

  async findAll(roleId?: number) {
    const where: any = {};

    if (roleId) {
      where.roleId = roleId;
    }

    return this.rolePermissionRepository.findMany({
      where,
      include: {
        role: true,
      },
      orderBy: { id: 'asc' },
    });
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
}
