import { Injectable } from '@nestjs/common';
import { Category } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super(prisma.category);
  }
}
