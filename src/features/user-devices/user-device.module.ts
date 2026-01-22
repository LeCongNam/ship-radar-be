import { Module } from '@nestjs/common';
import { UserDeviceService } from './user-device.service';
import { UserDeviceController } from './user-device.controller';

@Module({
  controllers: [UserDeviceController],
  providers: [UserDeviceService],
})
export class UserDeviceModule {}
