import {
  Controller,
  Req,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import express from 'express';
import { User } from '../../../generated/prisma/client';
import { TransformResponseInterceptor } from '../decorators/transform-response.interceptor';

@Controller()
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true, // Tự động đoán kiểu dữ liệu (số/chuỗi)
    },
  }),
)
@UseInterceptors(TransformResponseInterceptor)
export class BaseController {
  getDeviceInfo(@Req() req: express.Request): DeviceInfo {
    return {
      deviceId: (req.headers['x-device-id'] as unknown as string) || null,
      deviceType: (req.headers['x-device-type'] as unknown as string) || null,
      osVersion: (req.headers['x-os-version'] as unknown as string) || null,
    };
  }

  getUserInfo(@Req() req: express.Request): User | null {
    return (req?.['user'] as User) || null;
  }

  getHeader(@Req() req: express.Request, headerName: string): string | null {
    return (req.headers[headerName.toLowerCase()] as unknown as string) || null;
  }
}

export type DeviceInfo = {
  deviceId: string | null;
  deviceType: string | null;
  osVersion: string | null;
};
