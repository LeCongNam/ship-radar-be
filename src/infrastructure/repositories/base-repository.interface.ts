export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  create(data: any): Promise<T>;
  update(id: string | number, data: any): Promise<T>;
  delete(id: string | number): Promise<T>;
  softDelete(id: string | number): Promise<T>;
}

// Tạo một type hỗ trợ để định nghĩa các phương thức chung của Prisma Delegate
// Chúng ta dùng 'any' ở đây vì mỗi model (User, Post...) có tham số 'where', 'data' khác nhau
export interface PrismaModelDelegate<T> {
  findMany(args?: any): Promise<T[]>;
  findUnique(args: any): Promise<T | null>;
  findFirst(args?: any): Promise<T | null>;
  create(args: any): Promise<T>;
  update(args: any): Promise<T>;
  delete(args: any): Promise<T>;
  count(args?: any): Promise<number>;

  upsert(args: any): Promise<T>;
  updateMany(args: any): Promise<any>;
  deleteMany(args: any): Promise<any>;
  aggregate(args: any): Promise<any>;
  groupBy(args: any): Promise<any>;
  createMany(args: any): Promise<any>;
}
