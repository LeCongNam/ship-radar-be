import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheableMemory } from 'cacheable';
import { Keyv } from 'keyv';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { CategoryModule } from './features/categories/category.module';
import { CustomerModule } from './features/customers/customer.module';
import { DeliveryBrandModule } from './features/delivery-brands/delivery-brand.module';
import { OrderItemModule } from './features/order-items/order-item.module';
import { OrderModule } from './features/orders/order.module';
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
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'req.body.confirmPassword',
            'req.body.otp',
          ],
        },
        serializers: {
          req: (req) => {
            // Gán body vào object req để pino có thể đọc được
            req.body = req.raw.body;
            return req;
          },
        },
        // Nếu bạn muốn hiển thị body đẹp hơn trong log
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        // Chỉnh sửa phần transport ở đây
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: process.env.NODE_ENV === 'production', // Giúp log gọn hơn trên 1 dòng
                  translateTime: 'SYS:standard', // Hiển thị thời gian dễ đọc
                },
              }
            : undefined,
      },
    }), // Pino logger module
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
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(process.cwd(), 'src', '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    AuthModule,
    RepositoryModule,
    CustomerModule,
    RoleModule,
    UserRoleModule,
    PermissionModule,
    ProductModule,
    OrderModule,
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
