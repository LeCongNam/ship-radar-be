import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  createCacheKeyAuth(email: string): string {
    return `user-info-${email}`;
  }

  createKeyBlacklistToken(email: string, deviceId: string): string {
    return `blacklist-token:${email}:${deviceId}`;
  }

  createCacheKeyOtp(otp: string, email: string): string {
    return `otp-code-${otp}:${email}`;
  }
}
