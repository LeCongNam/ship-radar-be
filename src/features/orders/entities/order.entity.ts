import { Order } from '../../../../generated/prisma/client';

export class OrderEntity implements Order {
  id: string;
  totalPrice: any;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  noted: string | null;
  shopId: number;

  constructor(partial: Partial<OrderEntity>) {
    Object.assign(this, partial);
  }

  orderBarcode: string;
  orderBarcodeFilter: string;
}
