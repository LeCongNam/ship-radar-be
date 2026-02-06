import { Injectable, NotFoundException } from '@nestjs/common';
import {
  OrderItemRepository,
  OrderRepository,
} from '../../../infrastructure/repositories';
import { CreateOrderDto } from '../dto/create-order.dto';
import { FindAllOrderDto } from '../dto/find-all-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { orderItems, ...orderData } = createOrderDto;

    // Create order with items using prisma directly
    const order = await this.orderRepository.getModel().create({
      data: {
        ...orderData,
        orderItems: orderItems
          ? {
              create: orderItems,
            }
          : undefined,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        shop: true,
      },
    });

    return order;
  }

  async findAll(query: FindAllOrderDto) {
    const { status, shopId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (shopId) {
      where.shopId = shopId;
    }

    const [data, total] = await Promise.all([
      this.orderRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          shop: true,
          shippings: true,
        },
      }),
      this.orderRepository.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        shop: true,
        shippings: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { orderItems, ...orderData } = updateOrderDto;

    return this.orderRepository.update(id, orderData);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.orderRepository.delete(id);
  }
}
