import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../../../infrastructure/dto';
import { ProductRepository } from '../../../infrastructure/repositories';
import { CreateProductDto } from '../dto/create-product.dto';
import { FindAllProductDto } from '../dto/find-all-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductDashboardService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(createProductDto: CreateProductDto) {
    return this.productRepository.create(createProductDto as any);
  }

  async findAll(query: FindAllProductDto) {
    const {
      page = 1,
      pageSize = 10,
      search,
      where,
      skip,
    } = new PaginationDto(query);

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.productRepository.findMany({
        where,
        skip,
        take: Number(pageSize),
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.productRepository.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findUnique({
      where: { id },
      include: {
        category: true,
        orderItems: {
          include: {
            order: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const data: any = { ...updateProductDto };
    if (updateProductDto.price !== undefined) {
      data.price = updateProductDto.price.toString();
    }

    console.log(data);

    return this.productRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.productRepository.delete(id);
  }

  async activate(id: string) {
    await this.findOne(id);

    return this.productRepository.update(id, { isActive: true });
  }

  async deactivate(id: string) {
    await this.findOne(id);

    return this.productRepository.update(id, { isActive: false });
  }

  async updateStock(id: string, stock: number) {
    await this.findOne(id);

    return this.productRepository.update(id, { stock });
  }
}
