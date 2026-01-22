import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../../infrastructure/repositories';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(createProductDto: CreateProductDto) {
    return this.productRepository.create(createProductDto as any);
  }

  async findAll(categoryId?: string, isActive?: boolean) {
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.productRepository.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const data: any = { ...updateProductDto };
    if (updateProductDto.price !== undefined) {
      data.price = updateProductDto.price.toString();
    }

    return this.productRepository.update(id, data);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.productRepository.delete(id);
  }
}
