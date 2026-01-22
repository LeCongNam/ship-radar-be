import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../../infrastructure/shared/cache.service';
import { AuthController } from './controllers/auth.controller';
import { AuthDashboardController } from './controllers/auth.dashboard.controller';
import { AuthDashboardService } from './services/auth.dashboard.service';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController, AuthDashboardController],
  providers: [
    AuthService,
    AuthDashboardService,
    JwtStrategy,
    CacheService,
    JwtService,
  ],
})
export class AuthModule {}
