import { Injectable } from '@nestjs/common';
import { RolePermissions } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class RolePermissionRepository extends BaseRepository<RolePermissions> {
  constructor() {
    super(prisma.rolePermissions);
  }
}
