import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log(
      '🚀 ~ TransformResponseInterceptor ~ intercept ~ request:',
      request.query,
      { depth: null },
    );
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // nếu data đã được format sẵn (có data, statusCode, metadata) thì bỏ qua
        if (data && 'data' in data && 'metadata' in data) {
          if (!('statusCode' in data)) {
            data.statusCode = response.statusCode;
          }

          return data;
        }

        const res: Record<string, any> = {
          data: null,
          metadata: {
            timestamp: new Date().toISOString(),
            path: request.url,
          },
          statusCode: response.statusCode,
        };

        // nếu data có dạng phân trang {data, total, page, pageSize}
        if (typeof data === 'object' && data !== null) {
          if ('data' in data) {
            res.data = data.data;
          } else {
            res.data = data;
          }

          if ('total' in data) res.metadata.total = data.total;
          if ('page' in data) {
            res.metadata.page = data.page;
          } else {
            res.metadata.page = Number(request?.query?.page) || null;
          }
          if ('pageSize' in data) {
            res.metadata.pageSize = data?.pageSize;
          } else {
            res.metadata.pageSize = Number(request?.query?.pageSize) || null;
          }

          if ('total' in data && 'pageSize' in data)
            res.metadata.totalPages = Math.ceil(data.total / data.pageSize);
        } else {
          res.data = data;
        }

        return res;
      }),
    );
  }
}
