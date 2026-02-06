import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../../../infrastructure/repositories';
import { User } from '../entities/user.entity';

@Injectable()
export class UserDashboardService {
  private dashboards: Map<number, any> = new Map();

  constructor(private readonly userRepository: UserRepository) {}

  async create(userId: number, data: any) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (this.dashboards.has(userId)) {
      throw new BadRequestException(`Dashboard already exists for this user`);
    }

    const dashboard = {
      userId,
      settings: data.settings || {},
      widgets: data.widgets || [],
      layout: data.layout || [],
      preferences: data.preferences || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.dashboards.set(userId, dashboard);
    return dashboard;
  }

  async findOne(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const dashboard = this.dashboards.get(userId);
    if (!dashboard) {
      throw new NotFoundException(`Dashboard not found for user ${userId}`);
    }

    return dashboard;
  }

  async update(userId: number, data: any) {
    const dashboard = await this.findOne(userId);

    const updated = {
      ...dashboard,
      ...data,
      userId: dashboard.userId,
      updatedAt: new Date(),
    };

    this.dashboards.set(userId, updated);
    return updated;
  }

  async remove(userId: number) {
    await this.findOne(userId);
    this.dashboards.delete(userId);
    return { message: 'Dashboard deleted successfully' };
  }

  async getDashboard(userId: number) {
    const user: any = await this.userRepository.findUnique({
      where: { id: userId },
      include: {
        shops: true,
        tokens: {
          where: {
            isRevoked: false,
            isBlacklisted: false,
          },
        },
        userDevices: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      user: this.userRepository.formatResponse(user),
      statistics: {
        totalShops: user.shops?.length || 0,
        activeShops: user.shops?.filter((s: any) => s.isActive).length || 0,
        activeSessions: user.tokens?.length || 0,
        totalDevices: user.userDevices?.length || 0,
      },
      shops: user.shops || [],
      devices: user.userDevices || [],
    };
  }

  async updateStatus(userId: number, data: any) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.userRepository.update(userId, {
      isActive: data.isActive,
    });

    const newUser = await this.userRepository.findById(userId);

    return this.userRepository.formatResponse(newUser!);
  }

  async findAll(user: User) {
    return this.userRepository.findMany();
  }
}
