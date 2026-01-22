import { Injectable, NotFoundException } from '@nestjs/common';
import { ShippingRepository } from '../../../infrastructure/repositories';
import { CreateShippingDto } from '../dto/create-shipping.dto';
import { UpdateShippingDto } from '../dto/update-shipping.dto';

@Injectable()
export class ShippingDashboardService {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async create(createShippingDto: CreateShippingDto) {
    const data: any = { ...createShippingDto };
    if (createShippingDto.codAmount !== undefined) {
      data.codAmount = createShippingDto.codAmount.toString();
    }

    return this.shippingRepository.create(data);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    orderId?: number,
    deliveryBrandId?: number,
    status?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { trackingNumber: { contains: search } },
        { shipperName: { contains: search } },
        { shipperPhone: { contains: search } },
      ];
    }

    if (orderId) {
      where.orderId = orderId;
    }

    if (deliveryBrandId) {
      where.deliveryBrandId = deliveryBrandId;
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.shippingRepository.findMany({
        where,
        skip,
        take: limit,
        include: {
          order: {
            include: {
              shop: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.shippingRepository.count({ where }),
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
    const shipping = await this.shippingRepository.findUnique({
      where: { id },
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

  async updateStatus(id: number, status: string) {
    await this.findOne(id);

    return this.shippingRepository.update(id, { status });
  }
}
