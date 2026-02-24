import { Injectable } from '@nestjs/common';
import { Permission } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> {
  constructor() {
    super(prisma.permission);
  }
}
