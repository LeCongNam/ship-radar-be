import { Injectable, NotFoundException } from '@nestjs/common';
import { PermissionRepository } from '../../../infrastructure/repositories';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return this.permissionRepository.create(createPermissionDto as any);
  }

  async findAll(roleId?: number) {
    const where: any = {};

    if (roleId) {
      where.roleId = roleId;
    }

    return this.permissionRepository.findMany({
      where, 
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const permission = await this.permissionRepository.findUnique({
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

    return this.permissionRepository.update(id, updatePermissionDto);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.permissionRepository.delete({
      where: { id },
    });
  }
}
