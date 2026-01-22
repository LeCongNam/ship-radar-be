import { Injectable } from '@nestjs/common';
import { UserDevice } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserDeviceRepository extends BaseRepository<UserDevice> {
  constructor() {
    super(prisma.userDevice);
  }
}
