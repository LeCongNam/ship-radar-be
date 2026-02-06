import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { JwtAuthenticationGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { FindAllCategoryDto } from '../dto/find-all-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryDashboardService } from '../services/category.dashboard.service';

@Controller('dashboard/categories')
@UseGuards(JwtAuthenticationGuard)
export class CategoryDashboardController extends BaseController {
  constructor(
    private readonly categoryDashboardService: CategoryDashboardService,
  ) {
    super();
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryDashboardService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query: FindAllCategoryDto) {
    return this.categoryDashboardService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryDashboardService.findOne(id);
    return {
      data: category,
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryDashboardService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryDashboardService.remove(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.categoryDashboardService.activate(id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.categoryDashboardService.deactivate(id);
  }
}
