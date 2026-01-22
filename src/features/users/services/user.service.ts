import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../../infrastructure/repositories';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const existingUsername = await this.userRepository.findFirst({
      where: { username: createUserDto.username },
    });
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Prepare user data
    const userData: any = {
      ...createUserDto,
      password: hashedPassword,
    };

    // Convert date string to Date if provided
    if (createUserDto.dob) {
      userData.dob = new Date(createUserDto.dob);
    }

    // Create user
    const user = await this.userRepository.create(userData);

    return this.userRepository.formatResponse(user);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    isActive?: boolean,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { username: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      this.userRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      }),
      this.userRepository.count({ where }),
    ]);

    const formattedUsers = users.map((user) =>
      this.userRepository.formatResponse(user),
    );

    return {
      data: formattedUsers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
        shops: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.userRepository.formatResponse(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const user = await this.userRepository.update(id, updateUserDto);
    return this.userRepository.formatResponse(user);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.userRepository.delete(id);
  }

  async getDashboard(userId: number) {
    const user = await this.findOne(userId);

    // Get user statistics
    const statsData: any = await this.userRepository.findUnique({
      where: { id: userId },
      include: {
        shops: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        tokens: {
          where: {
            isRevoked: false,
            isBlacklisted: false,
          },
          select: {
            id: true,
            createdAt: true,
            expiresAt: true,
          },
        },
        userDevices: {
          select: {
            id: true,
            deviceType: true,
            osVersion: true,
            appVersion: true,
            lastActiveAt: true,
          },
        },
      },
    });

    return {
      user: this.userRepository.formatResponse(user as any),
      statistics: {
        totalShops: statsData?.shops?.length || 0,
        activeShops:
          statsData?.shops?.filter((s: any) => s.isActive).length || 0,
        activeSessions: statsData?.tokens?.length || 0,
        totalDevices: statsData?.userDevices?.length || 0,
      },
      shops: statsData?.shops || [],
      devices: statsData?.userDevices || [],
    };
  }

  async updatePassword(userId: number, newPassword: string) {
    await this.findOne(userId);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.userRepository.update(userId, {
      password: hashedPassword,
    });
  }

  async toggleActive(id: number) {
    const user = await this.findOne(id);

    const updated = await this.userRepository.update(id, {
      isActive: !user.isActive,
    });

    return this.userRepository.formatResponse(updated);
  }
}
