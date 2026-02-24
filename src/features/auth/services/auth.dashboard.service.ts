import { Injectable } from '@nestjs/common';
import {
  ROLE_CONSTANT
} from '../../../infrastructure/constants';
import {
  PermissionRepository,
  RolePermissionRepository,
  RoleRepository,
  UserRepository,
} from '../../../infrastructure/repositories';
import { ControllerDiscoveryService } from '../../../infrastructure/shared/discovery/controller-discovery.service';
import { prisma } from '../../../lib/prisma/prisma';
import { AuthService } from './auth.service';

@Injectable()
export class AuthDashboardService {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly rolePermissionRepo: RolePermissionRepository,
    private authService: AuthService,
    private controllerDiscoveryService: ControllerDiscoveryService,
    private userRepo: UserRepository,
    private permissionRepo: PermissionRepository,
  ) { }

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

    const user = await this.userRepo.findOneBy({ email: 'namlem4u@gmail.com' });

    if (!user)
      await this.authService.register({
        email: 'namlem4u@gmail.com',
        password: 'abcd1234',
        username: 'namlem4u',
      });



    const listPermissions: any[] = []
    
    const controllersSummary = this.controllerDiscoveryService.getControllersSummary();

    for (const item of controllersSummary) {
      for (const m of item.methods) {
        listPermissions.push({
          permission: m.permission,
          description: m.description,
          module: item.controller,
          name: m.name,
        });
      }
    }
    console.log("🚀 ~ AuthDashboardService ~ initDashboard ~ listPermissions:", listPermissions.length)

    await this.permissionRepo.getModel().createMany({
      data: listPermissions,
      // skipDuplicates: true,
    });
    

    const listPermissionDB = await this.permissionRepo.findMany();

    await this.rolePermissionRepo.getModel().createMany({
      data: listPermissionDB.map((perm) => ({
        roleId: 1,
        permissionId: perm.id,
      })),
      skipDuplicates: true,
    });


    await prisma.userRoles.createMany({
      data: [
        { userId: 1, roleId: 1 },
        { userId: 1, roleId: 2 },
      ],
      skipDuplicates: true, // Thêm dòng này để lờ lỗi nếu đã tồn tại
    });
  }
}
