import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { CategoryDashboardController } from './controllers/category.dashboard.controller';
import { CategoryDashboardService } from './services/category.dashboard.service';
import { CategoryService } from './services/category.service';

@Module({
  controllers: [CategoryController, CategoryDashboardController],
  providers: [CategoryService, CategoryDashboardService],
})
export class CategoryModule {}
