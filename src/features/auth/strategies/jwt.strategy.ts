import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANTS } from '../../../infrastructure/constants';
import {
  UserRepository,
  UserRoleRepository,
} from '../../../infrastructure/repositories';
import { CacheService } from '../../../infrastructure/shared/cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  JWT_CONSTANTS.TYPE.JWT_ACCESS_TOKEN,
) {
  constructor(
    private _configSrv: ConfigService,
    private _userRepo: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private cacheService: CacheService,
    private userRoleRepo: UserRoleRepository,
  ) {
    const jwtSecret = _configSrv.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error(
        'JWT_SECRET_CUSTOMER is not defined in the environment variables',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: TokenPayload): Promise<JwtDataReturn> {
    const user = await this._userRepo.findOneBy({ id: payload.userId });
    const usrRole = (await this.userRoleRepo.getModel().findMany({
      where: {
        userId: payload.userId,
      },
      include: {
        role: true,
      },
    })) as any[];

    const roles = usrRole.map((ur) => ur?.role?.name);

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return {
      user,
      roles,
    };
  }
}
