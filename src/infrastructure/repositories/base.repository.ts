import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client/scripts/default-index.js';
import { prisma } from '../../lib/prisma/prisma';
import * as baseRepositoryInterface from './base-repository.interface';

type TransactionClient = Omit<
  Prisma.TransactionClient,
  '$commit' | '$rollback'
>;

@Injectable()
export abstract class BaseRepository<
  T,
> implements baseRepositoryInterface.IBaseRepository<T> {
  // model lúc này sẽ là delegate của riêng bảng đó (vd: prisma.user)
  protected model: baseRepositoryInterface.PrismaModelDelegate<T>;
  protected prisma: Prisma.TransactionClient;

  constructor(model: any) {
    this.model = model as baseRepositoryInterface.PrismaModelDelegate<T>;
    this.prisma = prisma;
  }

  async findAll(tx?: TransactionClient): Promise<T[]> {
    const executor = tx || this.model;
    return executor.findMany();
  }

  async findMany(args?: any, tx?: TransactionClient): Promise<T[]> {
    const executor = tx || this.model;
    return executor.findMany(args);
  }

  async findOneBy(
    filter: Partial<T>,
    tx?: TransactionClient,
  ): Promise<T | null> {
    return await this.model.findFirst({ where: filter });
  }

  async findById(id: any, tx?: TransactionClient): Promise<T | null> {
    // Lưu ý: id cần ép kiểu đúng với schema (Int hoặc String)
    const executor = tx || this.model;
    return executor.findUnique({
      where: { id },
    });
  }

  async findUnique(args: any, tx?: TransactionClient): Promise<T | null> {
    const executor = tx || this.model;
    return executor.findUnique(args);
  }

  async findFirst(args?: any, tx?: TransactionClient): Promise<T | null> {
    const executor = tx || this.model;
    return executor.findFirst(args);
  }

  async count(args?: any, tx?: TransactionClient): Promise<number> {
    const executor = tx || this.model;
    return await executor.count(args);
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create({ data });
  }

  async update(id: any, data: any, tx?: TransactionClient): Promise<T> {
    const executor = tx || this.model;
    return executor.update({
      where: { id },
      data,
    });
  }

  async updateById(id: any, data: any, tx?: TransactionClient): Promise<T> {
    const executor = tx || this.model;
    return executor.update({
      where: { id },
      data,
    });
  }

  async delete(id: any, tx?: TransactionClient): Promise<T> {
    const executor = tx || this.model;
    return executor.delete({ where: { id } });
  }

  async softDelete(id: any, tx?: TransactionClient): Promise<T> {
    const executor = tx || this.model;
    return executor.update({
      where: { id },
      data: { deletedAt: new Date() } as any,
    });
  }

  async findAndCount(
    args?: any,
    tx?: TransactionClient,
  ): Promise<[T[], number]> {
    const executor = tx || this.model;
    const countArgs: any = {};

    // Only pass 'where' to count() method
    if (args?.where) {
      countArgs.where = args.where;
    }

    const [data, count] = await Promise.all([
      executor.findMany(args),
      executor.count(countArgs),
    ]);
    return [data, count];
  }

  getModel(
  ): baseRepositoryInterface.PrismaModelDelegate<T> | TransactionClient {
    return this.model;
  }
  
  async executeInTransaction<T>(
    callback: (tx: TransactionClient) => Promise<T>,
  ): Promise<T> {
    return prisma.$transaction(callback);
  }
}
