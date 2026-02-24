import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ControllerDiscoveryService } from './controller-discovery.service';

@Module({
  imports: [DiscoveryModule],
  providers: [ControllerDiscoveryService],
    exports: [ControllerDiscoveryService],
})
export class ControllerDiscoveryModule {}
