import { IsEnum } from 'class-validator';
import * as orderStateFactory from '../patterns/order-state.factory';

export enum ORDER_STATUS {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  PACKING = 'PACKING',
}

export class UpdateStatusDashboardDto {
  @IsEnum(ORDER_STATUS, { message: 'Invalid order status' })
  status: orderStateFactory.StatusName;
}
