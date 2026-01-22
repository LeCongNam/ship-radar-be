import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryBrandRepository } from '../../../infrastructure/repositories';
import { CreateDeliveryBrandDto } from '../dto/create-delivery-brand.dto';
import { UpdateDeliveryBrandDto } from '../dto/update-delivery-brand.dto';

@Injectable()
export class DeliveryBrandService {
  constructor(
    private readonly deliveryBrandRepository: DeliveryBrandRepository,
  ) {}

  async create(createDeliveryBrandDto: CreateDeliveryBrandDto) {
    return this.deliveryBrandRepository.create(createDeliveryBrandDto);
  }

  async findAll(isActive?: boolean) {
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.deliveryBrandRepository.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
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
}
