import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  pageSize: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  get skip() {
    return (this.page - 1) * this.pageSize;
  }

  where: Record<string, any> = {};

  constructor(partial?: any) {
    if (partial) {
      const ignored = ['page', 'pageSize', 'search', 'skip', 'limit', 'where'];
      Object.entries(partial).forEach(([key, value]) => {
        // Chỉ nhặt những gì không nằm trong danh sách ignore và có giá trị
        if (!ignored.includes(key) && value !== undefined && value !== '') {
          // Tự động convert số nếu có thể (đúng chất cơ khí)
          this.where[key] = isNaN(Number(value)) ? value : Number(value);
        }
      });

      if (partial.search) {
        this.search = partial.search;
      }

      if (partial.page) {
        this.page = Number(partial.page);
      } else {
        this.page = 1;
      }

      if (partial.pageSize) {
        this.pageSize = Number(partial.pageSize);
      } else {
        this.pageSize = 10;
      }
    }
  }
}
