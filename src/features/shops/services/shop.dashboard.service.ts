import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShopRepository } from '../../../infrastructure/repositories';
import { CreateShopDto } from '../dto/create-shop.dto';
import { GetListShopDashboardDto } from '../dto/get-list.dto';
import { UpdateShopDto } from '../dto/update-shop.dto';

@Injectable()
export class ShopDashboardService {
  constructor(private readonly shopRepository: ShopRepository) {}

  async getList(query: GetListShopDashboardDto) {
    const { page = 1, pageSize = 10, search } = query;

    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { address: { contains: search } },
      ];
    }

    const [shops, total] = await this.shopRepository.findAndCount({
      where,
      skip,
      take: pageSize,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: shops,
      total,
    };
  }

  async getById(id: number) {
    const shop = await this.shopRepository.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
            phoneNumber: true,
          },
        },
        orders: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!shop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }

    return shop;
  }

  async create(createShopDto: CreateShopDto, user: any) {
    const shop = await this.shopRepository.create({
      ...createShopDto,
      ownerId: user.user.id,
    });
    return shop;
  }

  async update(id: number, updateShopDto: UpdateShopDto) {
    // Check if shop exists
    const existingShop = await this.shopRepository.findById(id);
    if (!existingShop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }

    const shop = await this.shopRepository.update(id, updateShopDto);
    return shop;
  }

  async delete(id: number) {
    // Check if shop exists
    const existingShop = await this.shopRepository.findById(id);
    if (!existingShop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }

    // Check if shop has orders
    const shopWithOrders = (await this.shopRepository.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    })) as any;

    if (shopWithOrders && shopWithOrders._count?.orders > 0) {
      throw new BadRequestException(
        `Cannot delete shop with existing orders. Please deactivate instead.`,
      );
    }

    const shop = await this.shopRepository.delete(id);
    return shop;
  }

  async toggleActive(id: number) {
    const existingShop = await this.shopRepository.findById(id);
    if (!existingShop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }

    const shop = await this.shopRepository.update(id, {
      isActive: !existingShop.isActive,
    });
    return shop;
  }

  async getStatistics(id: number) {
    const shop = (await this.shopRepository.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    })) as any;

    if (!shop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }

    // Get order statistics
    const orderStats = (await this.shopRepository.getModel().findUnique({
      where: { id },
      select: {
        orders: {
          select: {
            totalPrice: true,
            status: true,
          },
        },
      },
    })) as any;

    const totalRevenue =
      orderStats?.orders?.reduce(
        (sum: number, order: any) => sum + Number(order.totalPrice),
        0,
      ) || 0;

    const ordersByStatus =
      orderStats?.orders?.reduce(
        (acc: Record<string, number>, order: any) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ) || {};

    return {
      shopId: id,
      shopName: shop.name,
      totalOrders: shop._count?.orders || 0,
      totalRevenue,
      ordersByStatus,
      isActive: shop.isActive,
    };
  }
}
