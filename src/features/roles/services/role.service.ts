import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from '../../../infrastructure/repositories';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.create(createRoleDto);
  }

  async findAll() {
    return this.roleRepository.findMany({
      include: {
        permissions: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findUnique({
      where: { id },
      include: {
        permissions: true,
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
}
