import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../../../infrastructure/dto';
import { CategoryRepository } from '../../../infrastructure/repositories';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { FindAllCategoryDto } from '../dto/find-all-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryDashboardService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create(createCategoryDto);
  }

  async findAll(query: FindAllCategoryDto) {
    const { page = 1, pageSize = 10, where, skip } = new PaginationDto(query);

    const [data, total] = await Promise.all([
      this.categoryRepository.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.categoryRepository.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.categoryRepository.delete(id);
  }

  async activate(id: string) {
    await this.findOne(id);

    return this.categoryRepository.update(id, { isActive: true });
  }

  async deactivate(id: string) {
    await this.findOne(id);

    return this.categoryRepository.update(id, { isActive: false });
  }
}
