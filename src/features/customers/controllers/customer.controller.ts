import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import express from 'express';
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { JwtAuthenticationGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerService } from '../services/customer.service';

@Controller('customers')
@UseGuards(JwtAuthenticationGuard)
export class CustomerController extends BaseController {
  constructor(private readonly customerService: CustomerService) {
    super();
  }

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get('profile')
  findOne(@Req() request: express.Request) {
    const user = this.getUserInfo(request);

    if (!user) {
      throw new Error('User not found');
    }

    return this.customerService.getProfile(user);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
