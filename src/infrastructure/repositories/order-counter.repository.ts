import { Injectable } from '@nestjs/common';
import { OrderCounter } from '../../../generated/prisma/browser';
import { prisma } from '../../lib/prisma/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class OrderCounterRepository extends BaseRepository<OrderCounter> {
  constructor() {
    super(prisma.orderCounter);
  }
}
