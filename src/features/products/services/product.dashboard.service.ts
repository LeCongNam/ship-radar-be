import { Injectable, NotFoundException } from '@nestjs/common';

import { Product, User } from '../../../../generated/prisma/client';
import { PaginationDto } from '../../../infrastructure/dto';
import { ProductRepository } from '../../../infrastructure/repositories';
import { CreateProductDto } from '../dto/create-product.dto';
import { FindAllProductDto, STOCK_STATUS } from '../dto/find-all-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductHelperService } from './product-helper.service';

@Injectable()
export class ProductDashboardService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productHelperService: ProductHelperService,
  ) {}

  async create(createProductDto: CreateProductDto, user: { user: User }) {
    const productCode = this.productHelperService.createProductCode();
    createProductDto.productCode = productCode;

    createProductDto.ownerId = user.user.id;

    createProductDto.productCodeFilter = productCode.slice(-4);

    return this.productRepository.create(
      createProductDto as unknown as Product,
    );
  }

  async findAll(query: FindAllProductDto) {
    const stockStatus = query.stockStatus;

    delete query.stockStatus;

    const { page, pageSize, search, where, skip } = new PaginationDto(query);

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { productCode: { contains: search } },
      ];
    }

    if (stockStatus) {
      if (stockStatus === STOCK_STATUS.IN_STOCK) {
        where.stock = { gt: 0 };
      }

      if (stockStatus === STOCK_STATUS.OUT_OF_STOCK) {
        where.stock = { equals: 0 };
      }
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
      metadata: {
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
