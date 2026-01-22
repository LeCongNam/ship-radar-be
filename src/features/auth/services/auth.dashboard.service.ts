import { Injectable } from '@nestjs/common';
import {
  PERMISSION_CONSTANT,
  ROLE_CONSTANT,
} from '../../../infrastructure/constants';
import {
  RolePermissionRepository,
  RoleRepository,
} from '../../../infrastructure/repositories';

@Injectable()
export class AuthDashboardService {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly rolePermissionRepo: RolePermissionRepository,
  ) {}
  async initDashboard() {
    await this.roleRepo.getModel().createMany({
      data: [
        {
          id: 1,
          name: ROLE_CONSTANT.ADMIN,
          description: 'Administrator with full access',
        },
        {
          id: 2,
          name: ROLE_CONSTANT.CUSTOMER,
          description: 'Regular user with limited access',
        },
      ],
      skipDuplicates: true,
    });

    const listPermissions = Object.keys(PERMISSION_CONSTANT).map((key) => ({
      roleId: 1,
      permission: PERMISSION_CONSTANT[key],
    }));
    await this.rolePermissionRepo.getModel().createMany({
      data: listPermissions,
      skipDuplicates: true,
    });
  }
}
