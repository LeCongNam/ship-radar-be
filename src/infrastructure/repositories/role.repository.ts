import { Injectable } from '@nestjs/common';
import { Role } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super(prisma.role);
  }

  getAllRoleByIds(roleIds: number[]): Promise<Role[]> {
    return this.getModel().findMany({
      where: { id: { in: roleIds } },
    });
  }
}
