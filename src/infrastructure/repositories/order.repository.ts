import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { customAlphabet } from 'nanoid';
import { Order } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(prisma.order);
  }

  createOrderBarcode(): string {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // Create a NanoID generator with the custom alphabet and a desired length (e.g., 10 characters)
    const generateId = customAlphabet(alphabet, 8);
    const randomCode = generateId();

    const prefixDate = dayjs().format('DDMMYY');

    return `ORD${prefixDate}${randomCode}`;
  }

  getFourLastDigitsOfOrderBarcode(orderBarcode: string): string {
    return orderBarcode.slice(-4);
  }
}
