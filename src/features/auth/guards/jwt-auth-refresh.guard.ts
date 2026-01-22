import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JWT_CONSTANTS } from '../../../infrastructure/constants';

@Injectable()
export class JwtAuthenticationRefreshGuard extends AuthGuard(
  JWT_CONSTANTS.TYPE.JWT_REFRESH,
) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
