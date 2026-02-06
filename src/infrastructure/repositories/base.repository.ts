import { Injectable } from '@nestjs/common';
import * as baseRepositoryInterface from './base-repository.interface';

@Injectable()
export abstract class BaseRepository<
  T,
> implements baseRepositoryInterface.IBaseRepository<T> {
  // model lúc này sẽ là delegate của riêng bảng đó (vd: prisma.user)
  protected model: baseRepositoryInterface.PrismaModelDelegate<T>;

  constructor(model: baseRepositoryInterface.PrismaModelDelegate<T>) {
    this.model = model;
  }

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async findMany(args?: any): Promise<T[]> {
    return this.model.findMany(args);
  }

  async findOneBy(filter: Partial<T>): Promise<T | null> {
    return this.model.findFirst({ where: filter });
  }

  async findById(id: any): Promise<T | null> {
    // Lưu ý: id cần ép kiểu đúng với schema (Int hoặc String)
    return this.model.findUnique({
      where: { id },
    });
  }

  async findUnique(args: any): Promise<T | null> {
    return this.model.findUnique(args);
  }

  async findFirst(args?: any): Promise<T | null> {
    return this.model.findFirst(args);
  }

  async count(args?: any): Promise<number> {
    return await this.model.count(args);
  }

  async create(data: Partial<T>): Promise<T> {
    // eslint-disable-next-line no-useless-catch
    try {
      return this.model.create({ data });
    } catch (error) {
      throw error;
    }
  }

  async update(id: any, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async updateById(id: any, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: any): Promise<T> {
    return this.model.delete({ where: { id } });
  }

  async softDelete(id: any): Promise<T> {
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() } as any,
    });
  }

  async findAndCount(args?: any): Promise<[T[], number]> {
    const countArgs: any = {};

    // Only pass 'where' to count() method
    if (args?.where) {
      countArgs.where = args.where;
    }

    const [data, count] = await Promise.all([
      this.model.findMany(args),
      this.model.count(countArgs),
    ]);
    return [data, count];
  }

  getModel(): baseRepositoryInterface.PrismaModelDelegate<T> {
    return this.model;
  }
}
