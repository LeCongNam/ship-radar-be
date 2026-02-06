import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../../../generated/prisma/browser';
import { JWT_CONSTANTS } from '../../../infrastructure/constants';
import { UserRepository } from '../../../infrastructure/repositories';
import { CacheService } from '../../../infrastructure/shared/cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  JWT_CONSTANTS.TYPE.JWT_REFRESH,
) {
  constructor(
    private _configSrv: ConfigService,
    private _userRepo: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private cacheService: CacheService,
  ) {
    const jwtSecret = _configSrv.get<string>('JWT_REFRESH_SECRET');
    if (!jwtSecret) {
      throw new Error(
        'JWT_REFRESH_SECRET is not defined in the environment variables',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    const user = await this._userRepo.findOneBy({ id: payload.userId });
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
