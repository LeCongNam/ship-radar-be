import { HttpException } from '@nestjs/common';

export class HttpExceptionCustom extends HttpException {
  constructor(message: string, status: number) {
    super(message, status);
  }
}
