import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import type { Cache } from 'cache-manager';
import { User } from '../../../../generated/prisma/client';
import { ROLE_CONSTANT } from '../../../infrastructure/constants';
import {
  RoleRepository,
  TokenRepository,
  UserRepository,
  UserRoleRepository,
} from '../../../infrastructure/repositories';
import { DeviceInfo } from '../../../infrastructure/shared/base.controller';
import { CacheService } from '../../../infrastructure/shared/cache.service';
import { LoginAuthDto } from '../dto/login.dto';
import { RegisterAuthDto } from '../dto/register.dto';
import { SendOtpDto } from '../dto/send-otp.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';

@Injectable()
export class AuthService {
  private readonly _logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenRepo: TokenRepository,
    private readonly roleRepo: RoleRepository,
    private readonly userRoleRepo: UserRoleRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private cacheService: CacheService,
  ) {}

  async login(
    loginDto: LoginAuthDto,
    device: DeviceInfo,
  ): Promise<{
    data: {
      user: Omit<User, 'password'>;
      token: { accessToken: string; refreshToken: string };
    };
  }> {
    const userInfoCacheKey = this.cacheService.createCacheKeyAuth(
      loginDto.email,
    );

    const hasUser = await this.userRepo.findOneBy({ email: loginDto.email });

    if (!hasUser) {
      this._logger.warn('User not found with email: ' + loginDto.email);
      throw new UnprocessableEntityException(
        'User does not exist or password is incorrect!',
      );
    }

    const isPasswordValid = await compare(
      loginDto.password.trim(),
      hasUser?.password?.trim() || '',
    );

    if (!isPasswordValid) {
      this._logger.warn('Invalid password for email: ' + loginDto.email);
      throw new UnprocessableEntityException(
        'User does not exist or password is incorrect!',
      );
    }

    const { accessToken, refreshToken } = await this._generateTokens({
      userId: hasUser.id,
      email: hasUser.email,
      deviceId: device.deviceId!,
      deviceType: device.deviceType!,
    });

    const userRoles = await this.userRoleRepo.getAllUserRoles(hasUser.id);

    const roles = await this.roleRepo.getAllRoleByIds(
      userRoles.map((ur) => ur.roleId),
    );

    await this.cacheManager.set(userInfoCacheKey, {
      user: this.userRepo.formatResponse(hasUser),
      roles,
    });

    return {
      data: {
        user: this.userRepo.formatResponse(hasUser),
        token: {
          accessToken,
          refreshToken,
        },
      },
    };
  }

  async register(registerDto: RegisterAuthDto) {
    const oldUser = await this.userRepo.findOneBy({
      email: registerDto.email,
    });

    if (oldUser) {
      throw new UnprocessableEntityException('User already exists');
    }

    const salt = await genSalt(10);

    registerDto.password = await hash(registerDto.password, salt);
    const newUser = await this.userRepo.create(registerDto);

    const defaultRole = await this.roleRepo.findOneBy({
      name: ROLE_CONSTANT.CUSTOMER,
    });

    if (defaultRole) {
      await this.userRoleRepo.create({
        userId: newUser.id,
        roleId: defaultRole.id,
      });
    }

    return this.userRepo.formatResponse(newUser);
  }

  async logout(user: JwtDataReturn, device: DeviceInfo) {
    await this.tokenRepo.getModel().update({
      where: { userId: user.user.id, deviceId: device.deviceId },
      data: {
        isRevoked: true,
        isBlacklisted: true,
      },
    });

    // Blacklist token in cache
    const blackListToken = this.cacheService.createKeyBlacklistToken(
      user.user.email,
      device.deviceId!,
    );
    await this.cacheManager.set(blackListToken, user);
  }

  async getProfile(userInfo: User) {
    const user = (await this.userRepo.findOneBy({ id: userInfo.id })) as User;
    return this.userRepo.formatResponse(user);
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  async verifyOtp(dto: VerifyOtpDto, device: DeviceInfo) {
    // Check attempt limit: Max 5 failed attempts
    const attemptKey = `otp:attempt:${dto.email}`;
    const attempts = (await this.cacheManager.get<number>(attemptKey)) || 0;

    if (attempts >= 5) {
      this._logger.warn(`Too many failed OTP attempts for email: ${dto.email}`);
      throw new UnprocessableEntityException(
        'Too many failed attempts. Please request a new OTP.',
      );
    }

    const cachedOtpKey = this.cacheService.createCacheKeyOtp(
      dto.otp,
      dto.email,
    );
    const cachedOtp = await this.cacheManager.get<string>(cachedOtpKey);

    if (!cachedOtp || cachedOtp !== dto.otp) {
      this._logger.warn(`Invalid or expired OTP for email: ${dto.email}`);
      // Increment failed attempts
      await this.cacheManager.set(attemptKey, attempts + 1, 90 * 1000);
      throw new UnprocessableEntityException('Invalid or expired OTP');
    } else {
      // Reset attempts on success
      await this.cacheManager.del(attemptKey);
      await this.cacheManager.del(cachedOtpKey);
    }

    const user = await this.userRepo.findOneBy({ email: dto.email });

    if (!user) {
      this._logger.warn(`User not found with email: ${dto.email}`);
      throw new UnprocessableEntityException('User does not exist');
    }

    const { accessToken, refreshToken } = await this._generateTokens({
      userId: user.id,
      email: user.email,
      deviceId: device.deviceId!,
      deviceType: device.deviceType!,
    });

    const userRoles = await this.userRoleRepo.getAllUserRoles(user.id);

    const roles = await this.roleRepo.getAllRoleByIds(
      userRoles.map((ur) => ur.roleId),
    );

    const userInfoCacheKey = this.cacheService.createCacheKeyAuth(dto.email);

    await this.cacheManager.set(userInfoCacheKey, {
      user: this.userRepo.formatResponse(user),
      roles,
    });

    return {
      user: this.userRepo.formatResponse(user),
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  async sendOtp(dto: SendOtpDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });

    if (!user) {
      this._logger.warn(`User not found with email: ${dto.email}`);
      throw new UnprocessableEntityException('User does not exist');
    }

    // Rate limiting: Max 3 OTP requests per 15 minutes
    const rateLimitKey = `otp:rate:${dto.email}`;
    const attempts = (await this.cacheManager.get<number>(rateLimitKey)) || 0;

    if (attempts >= 3) {
      this._logger.warn(`Too many OTP requests for email: ${dto.email}`);
      throw new UnprocessableEntityException(
        'Too many OTP requests. Please try again later.',
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const cachedOtpKey = this.cacheService.createCacheKeyOtp(otp, dto.email);

    await this.cacheManager.set(cachedOtpKey, otp, 90 * 1000); // OTP valid for 1.5 minutes
    await this.cacheManager.set(rateLimitKey, attempts + 1, 15 * 60 * 1000); // 15 minutes

    // Here you would typically send the OTP via email or SMS
    this._logger.log(`OTP for email ${dto.email} is ${otp}`);

    return { message: 'OTP sent successfully' };
  }

  async refreshToken(
    user: GenerateTokensPayload,
    device: DeviceInfo,
    token: string,
  ) {
    const blackListToken = this.cacheService.createKeyBlacklistToken(
      user.email,
      device.deviceId!,
    );

    const isTokenBlacklisted = await this.cacheManager.get(blackListToken);

    if (isTokenBlacklisted) {
      this._logger.warn(
        `Attempt to use blacklisted token for email: ${user.email}`,
      );

      // TODO: log out user from all devices if needed here
      // SEND ALERT EMAIL TO USER

      throw new UnprocessableEntityException('Token is invalidated or revoked');
    }

    const isValidToken = await this.tokenRepo.findOneBy({
      userId: user.userId,
      refreshToken: token,
      isRevoked: false,
      isBlacklisted: false,
    });

    if (!isValidToken) {
      this._logger.warn(
        `Invalid or revoked refresh token for userId: ${user.userId}`,
      );
      throw new UnprocessableEntityException(
        'Token not found or has been revoked',
      );
    }

    const { accessToken, refreshToken } = await this._generateTokens({
      userId: user.userId,
      email: user.email,
      deviceId: device.deviceId!,
      deviceType: device.deviceType!,
    });

    return {
      data: {
        accessToken,
        refreshToken,
      },
    };
  }

  private async _generateTokens(payload: GenerateTokensPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenRepo.generateToken(payload as any),
      this.tokenRepo.generateTokenRefreshToken(payload, {
        expiresIn: '30d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}

export type GenerateTokensPayload = {
  userId: number;
  email: string;
  deviceId: string;
  deviceType: string;
};
