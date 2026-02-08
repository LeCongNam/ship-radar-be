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
    private permissionRepo: UserRoleRepository,
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

    const usrRoles = (await this.userRoleRepo.getModel().findMany({
      where: {
        userId: payload.userId,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    })) as any[];

    const roles = usrRoles.map((usrRole) => usrRole?.role?.name);

    const permissions: string[] = [];

    usrRoles.forEach((usrRole) => {
      const perms = usrRole?.role?.permissions || [];

      perms.forEach((perm: any) => {
        permissions.push(perm.permission);
      });
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return {
      user,
      roles,
      permissions: [...new Set(permissions)],
    };
  }
}
