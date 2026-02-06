import { Injectable } from '@nestjs/common';
import { DeliveryBrand } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class DeliveryBrandRepository extends BaseRepository<DeliveryBrand> {
  constructor() {
    super(prisma.deliveryBrand);
  }
}
