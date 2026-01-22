import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheableMemory } from 'cacheable';
import { Keyv } from 'keyv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { CategoryModule } from './features/categories/category.module';
import { CustomerModule } from './features/customers/customer.module';
import { DeliveryBrandModule } from './features/delivery-brands/delivery-brand.module';
import { OrderItemModule } from './features/order-items/order-item.module';
import { PermissionModule } from './features/permissions/permission.module';
import { ProductModule } from './features/products/product.module';
import { RoleModule } from './features/roles/role.module';
import { ShippingModule } from './features/shippings/shipping.module';
import { ShopModule } from './features/shops/shop.module';
import { StaffModule } from './features/staff/staff.module';
import { UserDeviceModule } from './features/user-devices/user-device.module';
import { UserRoleModule } from './features/user-roles/user-role.module';
import { UserModule } from './features/users/user.module';
import { RepositoryModule } from './infrastructure/repositories/repository.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configSrv: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            new KeyvRedis(configSrv.get<string>('REDIS_URL')),
          ],
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    RepositoryModule,
    CustomerModule,
    RoleModule,
    UserRoleModule,
    PermissionModule,
    ProductModule,
    OrderItemModule,
    ShippingModule,
    DeliveryBrandModule,
    UserDeviceModule,
    CategoryModule,
    StaffModule,
    UserModule,
    ShopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
