import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderItemRepository } from '../../../infrastructure/repositories';
import { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemRepository.create(createOrderItemDto as any);
  }

  async findAll(orderId?: number) {
    const where: any = {};

    if (orderId) {
      where.orderId = orderId;
    }

    return this.orderItemRepository.findMany({
      where,
      include: {
        order: true,
        product: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const orderItem = await this.orderItemRepository.findUnique({
      where: { id },
      include: {
        order: true,
        product: true,
      },
    });

    if (!orderItem) {
      throw new NotFoundException(`Order item with ID ${id} not found`);
    }

    return orderItem;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    await this.findOne(id);

    const data: any = { ...updateOrderItemDto };
    if (updateOrderItemDto.price !== undefined) {
      data.price = updateOrderItemDto.price.toString();
    }

    return this.orderItemRepository.update(id, data);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.orderItemRepository.delete(id);
  }
}
