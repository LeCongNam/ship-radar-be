import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    const now = Date.now();

    const newHeader = structuredClone(headers);
    const newBody = structuredClone(body);
    // Ẩn các trường nhạy cảm như token, password trong log

    const safeHeaders = this._hideSensitiveFields(newHeader);
    const safeBody = this._hideSensitiveFields(newBody);

    // Log thông tin Request khi vừa đến
    this.logger.log(
      `[REQUEST] ${method} ${url} | Headers: ${JSON.stringify(safeHeaders)} | Body: ${JSON.stringify(safeBody)}`,
    );

    // Bạn có thể tùy chọn log chi tiết hơn
    // this.logger.debug(`Headers: ${JSON.stringify(headers)}`);
    // if (Object.keys(body).length > 0) {
    //   this.logger.debug(`Body: ${JSON.stringify(body)}`);
    // }

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;

        // Log thông tin Response và thời gian xử lý
        this.logger.log(
          `[RESPONSE] ${method} ${url} ${response.statusCode} - ${delay}ms`,
        );
      }),
    );
  }

  private _hideSensitiveFields(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    const sensitiveFields = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
    ];
    const clone = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      if (sensitiveFields.includes(key.toLowerCase())) {
        clone[key] = '***HIDDEN***';
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        clone[key] = this._hideSensitiveFields(obj[key]);
      } else {
        clone[key] = obj[key];
      }
    }
    return clone;
  }
}
