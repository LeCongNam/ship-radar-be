import { Injectable } from '@nestjs/common';
import { Shop } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class ShopRepository extends BaseRepository<Shop> {
  constructor() {
    super(prisma.shop);
  }
}
