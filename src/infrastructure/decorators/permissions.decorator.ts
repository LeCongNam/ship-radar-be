import { SetMetadata } from '@nestjs/common';
import { PERMISSION_KEY } from '../constants';

/**
 * Decorator to require specific permissions for a route
 * Usage: @RequirePermissions(PERMISSION_CONSTANT.MANAGE_USERS, PERMISSION_CONSTANT.VIEW_USERS)
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
