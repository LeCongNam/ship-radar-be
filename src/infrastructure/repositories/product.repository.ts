import { Injectable } from '@nestjs/common';
import { Product } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(prisma.product);
  }
}
