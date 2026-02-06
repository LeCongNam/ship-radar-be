import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { customAlphabet } from 'nanoid';

@Injectable()
export class ProductHelperService {
  createProductCode() {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // Create a NanoID generator with the custom alphabet and a desired length (e.g., 10 characters)
    const generateId = customAlphabet(alphabet, 8);
    const randomCode = generateId();

    const prefixDate = dayjs().format('DDMMYY');

    return `PRD${prefixDate}${randomCode}`;
  }
}
