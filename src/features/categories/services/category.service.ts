import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../../../infrastructure/repositories';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create(createCategoryDto);
  }

  async findAll(isActive?: boolean) {
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.categoryRepository.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findUnique({
      where: { id },
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
}
