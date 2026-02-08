import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  CategoryRepository,
  DeliveryBrandRepository,
  OrderCounterRepository,
  OrderItemRepository,
  OrderRepository,
  ProductRepository,
  RolePermissionRepository,
  RoleRepository,
  ShippingRepository,
  ShopRepository,
  TokenRepository,
  UserDeviceRepository,
  UserRepository,
  UserRoleRepository,
} from '.';

const providers = [
  CategoryRepository,
  DeliveryBrandRepository,
  OrderItemRepository,
  OrderRepository,
  ProductRepository,
  RolePermissionRepository,
  RoleRepository,
  ShippingRepository,
  ShopRepository,
  TokenRepository,
  UserDeviceRepository,
  UserRepository,
  UserRoleRepository,
  OrderCounterRepository,
];

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
    }),
  ],
  providers,
  exports: providers,
})
export class RepositoryModule {}
