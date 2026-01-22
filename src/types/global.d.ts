export {};

declare global {
  type TokenPayload = {
    userId: number;
    email: string;
  };

  type ResponseDetail<T> = {
    data: T;
    metadata: {
      timestamp: string;
      path: string;
    };
    statusCode: number;
  };

  type PaginatedResult<T> = {
    data: T[];
    metadata: {
      timestamp: string;
      path: string;
      total: null | number;
      page: null | number;
      pageSize: null | number;
      totalPages: null | number;
    };
    statusCode: number;
  };
}
