import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryBrandRepository } from '../../../infrastructure/repositories';
import { CreateDeliveryBrandDto } from '../dto/create-delivery-brand.dto';
import { UpdateDeliveryBrandDto } from '../dto/update-delivery-brand.dto';

@Injectable()
export class DeliveryBrandDashboardService {
  constructor(
    private readonly deliveryBrandRepository: DeliveryBrandRepository,
  ) {}

  async create(createDeliveryBrandDto: CreateDeliveryBrandDto) {
    return this.deliveryBrandRepository.create(createDeliveryBrandDto);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    isActive?: boolean,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { hotline: { contains: search } },
        { supportEmail: { contains: search } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [data, total] = await Promise.all([
      this.deliveryBrandRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.deliveryBrandRepository.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const deliveryBrand = await this.deliveryBrandRepository.findUnique({
      where: { id },
    });

    if (!deliveryBrand) {
      throw new NotFoundException(`Delivery brand with ID ${id} not found`);
    }

    return deliveryBrand;
  }

  async update(id: number, updateDeliveryBrandDto: UpdateDeliveryBrandDto) {
    await this.findOne(id);

    return this.deliveryBrandRepository.update(id, updateDeliveryBrandDto);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.deliveryBrandRepository.delete(id);
  }

  async activate(id: number) {
    await this.findOne(id);

    return this.deliveryBrandRepository.update(id, { isActive: true });
  }

  async deactivate(id: number) {
    await this.findOne(id);

    return this.deliveryBrandRepository.update(id, { isActive: false });
  }
}
