import { Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import ms from 'ms'; // Import thư viện ms
import { DeviceType, Token } from '../../../generated/prisma/client';
import { GenerateTokensPayload } from '../../features/auth/services/auth.service';
import { prisma } from '../../lib/prisma';
import { BaseRepository } from './base.repository';
import { UserDeviceRepository } from './device.repository';

@Injectable()
export class TokenRepository extends BaseRepository<Token> {
  private readonly _logger = new Logger(TokenRepository.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userDeviceRepository: UserDeviceRepository,
  ) {
    super(prisma.token);
  }

  async generateToken(
    payload: { userId: number; email: string },
    options: JwtSignOptions = {},
  ): Promise<string> {
    try {
      const expiresIn =
        options?.expiresIn || process.env.JWT_EXPIRES_IN! || '1h';
      const secret = process.env.JWT_SECRET || 'default_secret';

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const token = this.jwtService.sign(payload, {
        ...options,
        expiresIn,
        secret,
      });

      return token;
    } catch (error) {
      this._logger.error('Error generating token', error);
      throw error;
    }
  }

  async generateTokenRefreshToken(
    payload: GenerateTokensPayload,
    options: JwtSignOptions = {},
  ): Promise<string> {
    try {
      const expiresIn =
        options?.expiresIn || process.env.JWT_EXPIRES_IN! || '1h';
      const secret = process.env.JWT_SECRET || 'default_secret';

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const token = this.jwtService.sign(
        { userId: payload.userId, email: payload.email },
        {
          ...options,
          expiresIn,
          secret,
        },
      );

      // Tính toán thời gian hết hạn
      const expiresAt = this.calculateExpiresAt(expiresIn);

      await this.saveRefreshToken(payload, token, expiresAt);

      return token;
    } catch (error) {
      this._logger.error('Error generating token', error);
      throw error;
    }
  }

  private calculateExpiresAt(expiresIn: string | number): Date {
    const now = new Date();

    if (typeof expiresIn === 'number') {
      // Nếu là number, prisma thường hiểu là giây
      return new Date(now.getTime() + expiresIn * 1000);
    }

    // Nếu là string (vd: '1h', '7d'), dùng ms để convert ra milliseconds
    const milliseconds = ms(expiresIn as ms.StringValue);
    return new Date(now.getTime() + milliseconds);
  }

  async saveRefreshToken(
    payload: GenerateTokensPayload,
    refreshToken: string,
    expiresAt: Date, // Nhận thêm tham số này
  ): Promise<Token> {
    const device = await this.userDeviceRepository.findOneBy({
      id: payload.deviceId,
      userId: payload.userId,
    });

    console.log(payload);

    // Tìm và thu hồi (Revoke) các token cũ của user này
    await this.model.updateMany({
      where: {
        userId: payload.userId,
        isRevoked: false,
        isBlacklisted: false,
        ...(device && Object.keys(device)?.length > 0
          ? { deviceId: device.id }
          : {}),
      },
      data: {
        isRevoked: true,
        isBlacklisted: true,
      },
    });

    if (!device) {
      this._logger.log(
        'No device found for userId: ' +
          payload.userId +
          ', deviceId: ' +
          payload.deviceId,
      );

      if (!payload.deviceType) {
        throw new Error('Device type is required for new device registration');
      } else {
        await this.userDeviceRepository.create({
          userId: payload.userId,
          id: payload.deviceId,
          deviceType: payload?.deviceType as any as DeviceType,
        });
      }
    }

    // Tạo token mới với thời gian hết hạn đã tính toán
    return this.model.create({
      data: {
        userId: payload.userId,
        refreshToken,
        expiresAt, // Lưu vào DB
        deviceId: payload.deviceId, // Track device
      },
    });
  }
}
