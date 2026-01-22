# ShipRadar Backend

Backend API cho hệ thống quản lý vận chuyển ShipRadar được xây dựng với NestJS, Prisma và MySQL.

## Mục lục

- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt](#cài-đặt)
- [Hướng dẫn phát triển](#hướng-dẫn-phát-triển)
  - [Tạo Repository mới](#tạo-repository-mới)
  - [Tạo Module mới](#tạo-module-mới)
  - [Tổ chức Controllers và Services](#tổ-chức-controllers-và-services)
  - [Tạo DTOs](#tạo-dtos)
- [Quy tắc và Best Practices](#quy-tắc-và-best-practices)

## Công nghệ sử dụng

- **NestJS** - Framework backend
- **Prisma** - ORM
- **MySQL** - Database
- **TypeScript** - Ngôn ngữ lập trình
- **class-validator** - Validation
- **JWT** - Authentication

## Cấu trúc dự án

```
shipradar-be/
├── prisma/
│   ├── schema.prisma          # Prisma schema
│   └── seed.ts                # Database seeding
├── src/
│   ├── features/              # Các module chức năng
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── auth.dashboard.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.dashboard.service.ts
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   └── auth.module.ts
│   │   ├── category/
│   │   ├── product/
│   │   ├── delivery-brand/
│   │   ├── order-item/
│   │   ├── shipping/
│   │   ├── role/
│   │   └── permission/
│   ├── infrastructure/
│   │   ├── repositories/      # Repository pattern
│   │   │   ├── base.repository.ts
│   │   │   ├── base-repository.interface.ts
│   │   │   ├── category.repository.ts
│   │   │   ├── product.repository.ts
│   │   │   └── ...
│   │   ├── constants/
│   │   ├── exceptions/
│   │   └── shared/
│   ├── lib/
│   │   └── prisma.ts          # Prisma client instance
│   └── main.ts
└── package.json
```

## Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd shipradar-be
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` và cấu hình các biến môi trường:

```env
DATABASE_URL="mysql://user:password@localhost:3306/shipradar"
JWT_SECRET="your-secret-key"
PORT=3000
```

### 4. Chạy Prisma migrations

```bash
npm run prisma:db:push
```

### 5. Seed database (optional)

```bash
npm run prisma:seed
```

## Chạy ứng dụng

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Watch mode
npm run start
```

## Hướng dẫn phát triển

### Tạo Repository mới

Khi thêm model mới vào Prisma schema, bạn cần tạo repository tương ứng.

#### Bước 1: Thêm model vào Prisma schema

```prisma
// prisma/schema.prisma
model Example {
  id        Int      @id @default(autoincrement())
  name      String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Bước 2: Tạo repository file

```typescript
// src/infrastructure/repositories/example.repository.ts
import { Injectable } from '@nestjs/common';
import { Example } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class ExampleRepository extends BaseRepository<Example> {
  constructor() {
    super(prisma.example);
  }

  // Thêm các custom methods nếu cần
  async findActiveExamples(): Promise<Example[]> {
    return this.findMany({
      where: { isActive: true },
    });
  }
}
```

#### Bước 3: Export repository

```typescript
// src/infrastructure/repositories/index.ts
export * from './base.repository';
export * from './example.repository';
// ... other repositories
```

#### Bước 4: Register vào RepositoryModule

```typescript
// src/infrastructure/repositories/repository.module.ts
import { ExampleRepository } from './example.repository';

const providers = [
  // ... existing repositories
  ExampleRepository,
];
```

### Tạo Module mới

Sử dụng pattern chuẩn để tạo module mới với controllers và services riêng biệt.

#### Cấu trúc thư mục Module

```
src/features/example/
├── controllers/
│   ├── example.controller.ts          # API cho user/public
│   └── example.dashboard.controller.ts # API cho admin dashboard
├── services/
│   ├── example.service.ts
│   └── example.dashboard.service.ts
├── dto/
│   ├── create-example.dto.ts
│   └── update-example.dto.ts
├── entities/
│   └── example.entity.ts
└── example.module.ts
```

### Tổ chức Controllers và Services

#### Public Controller (User API)

```typescript
// src/features/example/controllers/example.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ExampleService } from '../services/example.service';
import { CreateExampleDto } from '../dto/create-example.dto';
import { UpdateExampleDto } from '../dto/update-example.dto';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  create(@Body() createExampleDto: CreateExampleDto) {
    return this.exampleService.create(createExampleDto);
  }

  @Get()
  findAll(@Query('isActive') isActive?: string) {
    const filter = isActive !== undefined ? isActive === 'true' : undefined;
    return this.exampleService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
    return this.exampleService.update(+id, updateExampleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exampleService.remove(+id);
  }
}
```

#### Dashboard Controller (Admin API)

**QUAN TRỌNG**: Dashboard controllers phải sử dụng DTO cho query parameters và truyền trực tiếp DTO object vào service.

```typescript
// src/features/example/controllers/example.dashboard.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { ExampleDashboardService } from '../services/example.dashboard.service';
import { CreateExampleDto } from '../dto/create-example.dto';
import { UpdateExampleDto } from '../dto/update-example.dto';
import { GetListExampleDashboardDto } from '../dto/get-list.dto';

@Controller('dashboard/example')
export class ExampleDashboardController extends BaseController {
  constructor(
    private readonly exampleDashboardService: ExampleDashboardService,
  ) {
    super();
  }

  @Get()
  getList(@Query() query: GetListExampleDashboardDto) {
    return this.exampleDashboardService.getList(query);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.exampleDashboardService.getById(id);
  }

  @Post()
  create(@Body() createExampleDto: CreateExampleDto) {
    return this.exampleDashboardService.create(createExampleDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
    return this.exampleDashboardService.update(id, updateExampleDto);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string) {
    return this.exampleDashboardService.toggleActive(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.exampleDashboardService.delete(id);
  }
}
```

#### Public Service

```typescript
// src/features/example/services/example.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ExampleRepository } from '../../../infrastructure/repositories';
import { CreateExampleDto } from '../dto/create-example.dto';
import { UpdateExampleDto } from '../dto/update-example.dto';

@Injectable()
export class ExampleService {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async create(createExampleDto: CreateExampleDto) {
    return this.exampleRepository.create(createExampleDto);
  }

  async findAll(isActive?: boolean) {
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.exampleRepository.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const example = await this.exampleRepository.findUnique({
      where: { id },
    });

    if (!example) {
      throw new NotFoundException(`Example with ID ${id} not found`);
    }

    return example;
  }

  async update(id: number, updateExampleDto: UpdateExampleDto) {
    await this.findOne(id);

    return this.exampleRepository.update(id, updateExampleDto);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.exampleRepository.delete(id);
  }
}
```

#### Dashboard Service

**QUAN TRỌNG**: Service nhận toàn bộ DTO object và destructure các properties cần dùng.

```typescript
// src/features/example/services/example.dashboard.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ExampleRepository } from '../../../infrastructure/repositories';
import { CreateExampleDto } from '../dto/create-example.dto';
import { UpdateExampleDto } from '../dto/update-example.dto';
import { GetListExampleDashboardDto } from '../dto/get-list.dto';

@Injectable()
export class ExampleDashboardService {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async getList(query: GetListExampleDashboardDto) {
    const { page = 1, pageSize = 10, search } = query;

    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        // Thêm các field khác để search
      ];
    }

    const [data, total] = await this.exampleRepository.findAndCount({
      where,
      skip,
      take: pageSize,
      include: {
        // Include relations nếu cần
        // category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getById(id: string) {
    const example = await this.exampleRepository.findUnique({
      where: { id },
      include: {
        // Include relations nếu cần
      },
    });

    if (!example) {
      throw new NotFoundException(`Example with ID ${id} not found`);
    }

    return example;
  }

  async create(createExampleDto: CreateExampleDto) {
    // Check logic before create if needed
    return this.exampleRepository.create(createExampleDto);
  }

  async update(id: string, updateExampleDto: UpdateExampleDto) {
    // Check if exists
    const existing = await this.exampleRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Example with ID ${id} not found`);
    }

    return this.exampleRepository.update(id, updateExampleDto);
  }

  async delete(id: string) {
    // Check if exists
    const existing = await this.exampleRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Example with ID ${id} not found`);
    }

    // Check business logic before delete
    // Ví dụ: không xóa nếu có quan hệ

    return this.exampleRepository.delete(id);
  }

  async toggleActive(id: string) {
    const existing = await this.exampleRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Example with ID ${id} not found`);
    }

    return this.exampleRepository.update(id, {
      isActive: !existing.isActive,
    });
  }
}
```

#### Module Configuration

```typescript
// src/features/example/example.module.ts
import { Module } from '@nestjs/common';
import { ExampleController } from './controllers/example.controller';
import { ExampleDashboardController } from './controllers/example.dashboard.controller';
import { ExampleService } from './services/example.service';
import { ExampleDashboardService } from './services/example.dashboard.service';

@Module({
  controllers: [ExampleController, ExampleDashboardController],
  providers: [ExampleService, ExampleDashboardService],
  exports: [ExampleService, ExampleDashboardService], // Nếu cần dùng ở module khác
})
export class ExampleModule {}
```

### Tạo DTOs

DTOs (Data Transfer Objects) dùng để validate input data.

#### Create DTO

```typescript
// src/features/example/dto/create-example.dto.ts
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateExampleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

#### Update DTO

```typescript
// src/features/example/dto/update-example.dto.ts
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateExampleDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

#### GetList DTO (Pagination)

**QUAN TRỌNG**: Tất cả các GetList DTOs cho Dashboard phải kế thừa từ `PaginationDto` để đảm bảo tính nhất quán.

```typescript
// src/features/example/dto/get-list.dto.ts
import { PaginationDto } from '../../../infrastructure/dto';

export class GetListExampleDashboardDto extends PaginationDto {
  // Có thể thêm các filter fields tùy chỉnh nếu cần
  // @IsOptional()
  // @Type(() => Boolean)
  // @IsBoolean()
  // isActive?: boolean;
}
```

**Base PaginationDto** (đã có sẵn trong `src/infrastructure/dto/base-list.dto.ts`):

```typescript
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  pageSize: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  get skip() {
    return (this.page - 1) * this.pageSize;
  }
}
```

**Lưu ý**: 
- Sử dụng `pageSize` thay vì `limit`
- `PaginationDto` có getter `skip()` để tính toán offset
- Max `pageSize` là 1000

## Quy tắc và Best Practices

### 1. Tổ chức Code

- **Mỗi module** phải có cấu trúc thư mục rõ ràng: `controllers/`, `services/`, `dto/`
- **Public API** route: `/resource-name`
- **Dashboard API** route: `/dashboard/resource-name`
- **Tách biệt logic** giữa public và dashboard services
- **Dashboard Controllers**: 
  - Phải extend `BaseController`
  - Sử dụng DTO object cho query parameters, không dùng `@Query('field')` riêng lẻ
  - Truyền toàn bộ DTO object vào service method
  - Ví dụ: `getList(@Query() query: GetListDto)` → `service.getList(query)`
- **Dashboard Services**:
  - Nhận toàn bộ DTO object làm parameter
  - Destructure các properties cần dùng từ DTO: `const { page, pageSize, search } = query`
  - Sử dụng `findAndCount()` của repository để lấy data và count cùng lúc
  - Response format: `{ data, total, page, pageSize, totalPages }`
- **GetList DTOs**: 
  - Tất cả DTOs cho pagination phải kế thừa từ `PaginationDto` 
  - Import từ: `src/infrastructure/dto` hoặc `src/infrastructure/dto/base-list.dto.ts`
  - Sử dụng tên pattern: `GetList[Resource]DashboardDto` (ví dụ: `GetListShopDashboardDto`)
  - Chỉ thêm custom filter fields nếu cần, không override `page`, `pageSize`, `search`

### 2. Repository Pattern

- Sử dụng `BaseRepository` để kế thừa các phương thức cơ bản
- Chỉ thêm custom methods khi cần thiết
- Không gọi Prisma trực tiếp trong services, luôn đi qua repository

### 3. BaseRepository Methods

BaseRepository cung cấp các methods sau:

```typescript
// Query methods
findAll(): Promise<T[]>
findMany(args?: any): Promise<T[]>
findOne(args: any): Promise<T | null>
findUnique(args: any): Promise<T | null>
findFirst(args?: any): Promise<T | null>
findById(id: any): Promise<T | null>
findOneBy(filter: Partial<T>): Promise<T | null>
count(args?: any): Promise<number>

// Mutation methods
create(data: Partial<T>): Promise<T>
update(id: any, data: any): Promise<T>
updateById(id: any, data: any): Promise<T>
delete(id: any): Promise<T>
softDelete(id: any): Promise<T>

// Utility
getModel(): PrismaModelDelegate<T>
```

### 4. Validation

- Luôn sử dụng class-validator decorators trong DTOs
- Validate tất cả input từ client
- Sử dụng `@IsOptional()` cho các field không bắt buộc
- **Dashboard FindAll**: Phải tạo FindAll DTO kế thừa từ `PaginationDto` và sử dụng `@Query()` với DTO thay vì `@Query('field')` riêng lẻ
- **Type Conversion**: Sử dụng `@Type()` từ `class-transformer` để tự động convert query parameters (string → number, boolean)

### 5. Error Handling

- Throw `NotFoundException` khi không tìm thấy resource
- Throw `BadRequestException` cho validation errors
- Sử dụng try-catch cho async operations

### 6. API Response

**Đơn giản (Public API):**

```json
{
  "id": 1,
  "name": "Example",
  "isActive": true
}
```

**Với Pagination (Dashboard API):**

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### 7. Naming Convention

- **Files**: kebab-case (`example-service.ts`)
- **Classes**: PascalCase (`ExampleService`)
- **Methods/Variables**: camelCase (`findAll`, `exampleData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_LIMIT`)

### 8. Git Workflow

```bash
# Tạo branch mới
git checkout -b feature/example-module

# Commit changes
git add .
git commit -m "feat: add example module with CRUD operations"

# Push và tạo Pull Request
git push origin feature/example-module
```

### 9. Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## Scripts hữu ích

```bash
# Prisma
npm run prisma:generate      # Generate Prisma Client
npm run prisma:db:push       # Push schema to database
npm run prisma:studio        # Open Prisma Studio
npm run prisma:seed          # Seed database

# Development
npm run start:dev            # Start with watch mode
npm run build                # Build production
npm run format               # Format code with Prettier
npm run lint                 # Lint code with ESLint
```

## Modules có sẵn

- **Auth** - Authentication & Authorization
- **Category** - Quản lý danh mục sản phẩm
- **Product** - Quản lý sản phẩm
- **Delivery Brand** - Quản lý đơn vị vận chuyển
- **Order Item** - Quản lý chi tiết đơn hàng
- **Shipping** - Quản lý vận chuyển
- **Role** - Quản lý vai trò
- **Permission** - Quản lý quyền

## API Documentation

Sau khi chạy server, truy cập:

- Swagger: `http://localhost:3000/api/docs` (nếu đã cấu hình)
- Postman Collection: Xem file `postman_collection.json`

### Shop Dashboard API

#### 1. Lấy danh sách Shops

```http
GET /dashboard/shops
```

**Query Parameters:**

| Parameter | Type   | Required | Default | Description                              |
| --------- | ------ | -------- | ------- | ---------------------------------------- |
| page      | number | No       | 1       | Số trang hiện tại                        |
| pageSize  | number | No       | 10      | Số lượng items mỗi trang (max: 1000)    |
| search    | string | No       | -       | Tìm kiếm theo name, email, phone, address |

**Response:**

```json
{
  "data": [
    {
      "id": "shop-001",
      "name": "Shop ABC",
      "ownerId": 1,
      "address": "123 Street Name",
      "phone": "0123456789",
      "email": "shop@example.com",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "owner": {
        "id": 1,
        "email": "owner@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe"
      }
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

#### 2. Lấy thông tin Shop theo ID

```http
GET /dashboard/shops/:id
```

**Parameters:**

- `id` (string, required) - Shop ID

**Response:**

```json
{
  "id": "shop-001",
  "name": "Shop ABC",
  "ownerId": 1,
  "address": "123 Street Name",
  "phone": "0123456789",
  "email": "shop@example.com",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "owner": {
    "id": 1,
    "email": "owner@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "phoneNumber": "0987654321"
  },
  "orders": [
    {
      "id": 1,
      "totalPrice": "100000.00",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3. Lấy thống kê Shop

```http
GET /dashboard/shops/:id/statistics
```

**Parameters:**

- `id` (string, required) - Shop ID

**Response:**

```json
{
  "shopId": "shop-001",
  "shopName": "Shop ABC",
  "totalOrders": 150,
  "totalRevenue": 15000000,
  "ordersByStatus": {
    "pending": 10,
    "processing": 25,
    "completed": 100,
    "cancelled": 15
  },
  "isActive": true
}
```

#### 4. Tạo Shop mới

```http
POST /dashboard/shops
```

**Request Body:**

```json
{
  "id": "shop-001",
  "name": "Shop ABC",
  "ownerId": 1,
  "address": "123 Street Name",
  "phone": "0123456789",
  "email": "shop@example.com"
}
```

**Validation:**

- `id` (string, required) - Shop ID duy nhất
- `name` (string, required, max: 255) - Tên shop
- `ownerId` (number, required) - ID của owner
- `address` (string, optional) - Địa chỉ shop
- `phone` (string, optional) - Số điện thoại
- `email` (string, optional, email format) - Email shop

**Response:**

```json
{
  "id": "shop-001",
  "name": "Shop ABC",
  "ownerId": 1,
  "address": "123 Street Name",
  "phone": "0123456789",
  "email": "shop@example.com",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 5. Cập nhật Shop

```http
PUT /dashboard/shops/:id
```

**Parameters:**

- `id` (string, required) - Shop ID

**Request Body:**

```json
{
  "name": "Shop ABC Updated",
  "address": "456 New Street",
  "phone": "0987654321",
  "email": "newshop@example.com",
  "isActive": true
}
```

**Note:** Không thể cập nhật `id` và `ownerId`

**Response:**

```json
{
  "id": "shop-001",
  "name": "Shop ABC Updated",
  "ownerId": 1,
  "address": "456 New Street",
  "phone": "0987654321",
  "email": "newshop@example.com",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

#### 6. Bật/Tắt trạng thái Shop

```http
PATCH /dashboard/shops/:id/toggle-active
```

**Parameters:**

- `id` (string, required) - Shop ID

**Response:**

```json
{
  "id": "shop-001",
  "name": "Shop ABC",
  "ownerId": 1,
  "address": "123 Street Name",
  "phone": "0123456789",
  "email": "shop@example.com",
  "isActive": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

#### 7. Xóa Shop

```http
DELETE /dashboard/shops/:id
```

**Parameters:**

- `id` (string, required) - Shop ID

**Response:**

```json
{
  "id": "shop-001",
  "name": "Shop ABC",
  "ownerId": 1,
  "address": "123 Street Name",
  "phone": "0123456789",
  "email": "shop@example.com",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**

```json
{
  "statusCode": 400,
  "message": "Cannot delete shop with existing orders. Please deactivate instead.",
  "error": "Bad Request"
}
```

**Note:** Không thể xóa shop nếu còn đơn hàng. Trong trường hợp này, hãy sử dụng chức năng deactivate (toggle-active)

## Database Schema

Xem chi tiết schema tại `prisma/schema.prisma`

## Troubleshooting

### Lỗi kết nối database

```bash
# Kiểm tra DATABASE_URL trong .env
# Đảm bảo MySQL đang chạy
```

### Lỗi Prisma Client

```bash
npm run prisma:generate
```

### Port đã được sử dụng

```bash
# Thay đổi PORT trong .env hoặc kill process
lsof -ti:3000 | xargs kill -9
```

## Contributing

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## License

[MIT](LICENSE)
