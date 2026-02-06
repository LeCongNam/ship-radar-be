import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from '../../../infrastructure/dto';
import {
  OrderRepository,
  ShopRepository,
} from '../../../infrastructure/repositories';
import { prisma } from '../../../lib/prisma/prisma';
import { QueryBuilder } from '../../../lib/query-builder';
import { CreateOrderDto } from '../dto/create-order.dto';
import { FindAllOrderDto } from '../dto/find-all-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { UpdateStatusDashboardDto } from '../dto/update-status.dashboard.dto';
import { OrderStateFactory, StatusName } from '../patterns/order-state.factory';

@Injectable()
export class OrderDashboardService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private shopRepository: ShopRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { orderItems, ...orderData } = createOrderDto;

    orderData.orderBarcode = this.orderRepository.createOrderBarcode();

    const lastFourDigits = this.orderRepository.getFourLastDigitsOfOrderBarcode(
      orderData.orderBarcode,
    );

    // Append last four digits to orderBarcodeFilter for easier searching
    orderData['orderBarcodeFilter'] = lastFourDigits;

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

  async findAll(query: FindAllOrderDto, userInfo: JwtDataReturn) {
    const { page = 1, pageSize = 10, where, skip } = new PaginationDto(query);

    const shopsOfUser = await this.shopRepository.findMany({
      where: {
        ownerId: userInfo.user.id,
      },
    });

    const DB_NAME = process.env.DATABASE_NAME;
    console.log('🚀 ~ OrderDashboardService ~ findAll ~ DB_NAME:', DB_NAME);

    const { params, sql } = QueryBuilder.table('information_schema.tables')
      .select('TABLE_ROWS as total')
      .where('table_schema', '=', DB_NAME!)
      .where('table_name', '=', 'Order')
      .build();

    const [data, totalCount] = await Promise.all([
      this.orderRepository.findMany({
        where: {
          ...where,
          shopId: {
            in: shopsOfUser.map((shop) => shop.id),
          },
        },
        skip,
        take: pageSize,
        // orderBy: { createdAt: 'desc' },
        include: {
          shop: true,
          shippings: true,
        },
      }),
      prisma.$queryRaw`  SELECT TABLE_ROWS as total
        FROM information_schema.tables
        WHERE table_schema = ${DB_NAME}
        AND table_name = 'Order'` as any as Promise<{ total: bigint }[]>,
    ]);

    const total = totalCount.length > 0 ? Number(totalCount[0].total) : 0;

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: string) {
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

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { orderItems, ...orderData } = updateOrderDto;

    return this.orderRepository.update(id, orderData);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.orderRepository.delete(id);
  }

  async updateStatus(
    id: string,
    body: UpdateStatusDashboardDto,
    userInfo: JwtDataReturn,
  ) {
    console.log(
      '🚀 ~ OrderDashboardService ~ updateStatus ~ userInfo:',
      userInfo,
    );
    const oldOrder = await this.findOne(id);

    const orderState = new OrderStateFactory({
      order: oldOrder,
      initialStatus: oldOrder.status as StatusName,
      userInfo,
    });

    const {
      switched: isSwitched,
      newOrder,
      message,
    } = orderState.switch(body.status);

    if (isSwitched === false) {
      throw new BadRequestException(
        message || 'Cannot switch to the desired status',
      );
    }

    return this.orderRepository.update(id, { status: newOrder.status });
  }

  async getOrderStatistics(shopId?: number) {
    const where: any = {};
    if (shopId) {
      where.shopId = shopId;
    }

    const [total, pending, processing, completed, cancelled] =
      await Promise.all([
        this.orderRepository.count({ where }),
        this.orderRepository.count({
          where: { ...where, status: 'PENDING' },
        }),
        this.orderRepository.count({
          where: { ...where, status: 'PROCESSING' },
        }),
        this.orderRepository.count({
          where: { ...where, status: 'COMPLETED' },
        }),
        this.orderRepository.count({
          where: { ...where, status: 'CANCELLED' },
        }),
      ]);

    return {
      total,
      pending,
      processing,
      completed,
      cancelled,
    };
  }

  async getRecentOrders(limit: number = 10, shopId?: number) {
    const where: any = {};
    if (shopId) {
      where.shopId = shopId;
    }

    return this.orderRepository.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        shop: true,
      },
    });
  }
}
