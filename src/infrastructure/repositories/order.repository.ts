import { Injectable } from '@nestjs/common';
import { Order } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(prisma.order);
  }
}
