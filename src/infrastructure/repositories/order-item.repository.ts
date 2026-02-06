import { Injectable } from '@nestjs/common';
import { OrderItem } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class OrderItemRepository extends BaseRepository<OrderItem> {
  constructor() {
    super(prisma.orderItem);
  }
}
