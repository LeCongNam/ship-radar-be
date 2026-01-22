import { Injectable } from '@nestjs/common';
import { Shipping } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class ShippingRepository extends BaseRepository<Shipping> {
  constructor() {
    super(prisma.shipping);
  }
}
