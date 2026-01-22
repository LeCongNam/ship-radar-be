import { Injectable } from '@nestjs/common';
import { UserRoles } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRoleRepository extends BaseRepository<UserRoles> {
  constructor() {
    super(prisma.userRoles);
  }

  async getAllUserRoles(userId: number) {
    return this.getModel().findMany({
      where: { userId },
      include: { role: true },
    });
  }
}
