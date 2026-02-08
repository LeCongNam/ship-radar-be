import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  IS_PUBLIC_KEY,
  JWT_CONSTANTS,
  PERMISSION_KEY,
} from '../../../infrastructure/constants';

@Injectable()
export class PermissionsAuthGuard extends AuthGuard([
  JWT_CONSTANTS.TYPE.JWT_ACCESS_TOKEN,
]) {
  private readonly logger = new Logger(PermissionsAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // First, authenticate the user
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }

    // Get required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('User not found in request');
      throw new ForbiddenException('User authentication required');
    }

    // Extract user permissions from roles
    const userPermissions: string[] = request.user.permissions || [];

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      this.logger.warn(
        `User ${user.email || user.id} lacks required permissions: ${requiredPermissions.join(', ')}`,
      );
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
