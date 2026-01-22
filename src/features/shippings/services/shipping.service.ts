import { Injectable, NotFoundException } from '@nestjs/common';
import { ShippingRepository } from '../../../infrastructure/repositories';
import { CreateShippingDto } from '../dto/create-shipping.dto';
import { UpdateShippingDto } from '../dto/update-shipping.dto';

@Injectable()
export class ShippingService {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async create(createShippingDto: CreateShippingDto) {
    const data: any = { ...createShippingDto };
    if (createShippingDto.codAmount !== undefined) {
      data.codAmount = createShippingDto.codAmount.toString();
    }

    return this.shippingRepository.create(data);
  }

  async findAll(orderId?: number, status?: string) {
    const where: any = {};

    if (orderId) {
      where.orderId = orderId;
    }

    if (status) {
      where.status = status;
    }

    return this.shippingRepository.findMany({
      where,
      include: {
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByTracking(trackingNumber: string) {
    const shipping = await this.shippingRepository.findUnique({
      where: { trackingNumber },
      include: {
        order: {
          include: {
            shop: true,
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!shipping) {
      throw new NotFoundException(
        `Shipping with tracking number ${trackingNumber} not found`,
      );
    }

    return shipping;
  }

  async findOne(id: number) {
    const shipping = await this.shippingRepository.findUnique({
      where: { id },
      include: {
        order: true,
      },
    });

    if (!shipping) {
      throw new NotFoundException(`Shipping with ID ${id} not found`);
    }

    return shipping;
  }

  async update(id: number, updateShippingDto: UpdateShippingDto) {
    await this.findOne(id);

    const data: any = { ...updateShippingDto };
    if (updateShippingDto.codAmount !== undefined) {
      data.codAmount = updateShippingDto.codAmount.toString();
    }

    return this.shippingRepository.update(id, data);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.shippingRepository.delete(id);
  }
}
