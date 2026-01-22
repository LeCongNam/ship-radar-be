import { Injectable } from '@nestjs/common';
import { CreateDeliveryBrandDto } from './dto/create-delivery-brand.dto';
import { UpdateDeliveryBrandDto } from './dto/update-delivery-brand.dto';

@Injectable()
export class DeliveryBrandService {
  create(createDeliveryBrandDto: CreateDeliveryBrandDto) {
    return 'This action adds a new deliveryBrand';
  }

  findAll() {
    return `This action returns all deliveryBrand`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deliveryBrand`;
  }

  update(id: number, updateDeliveryBrandDto: UpdateDeliveryBrandDto) {
    return `This action updates a #${id} deliveryBrand`;
  }

  remove(id: number) {
    return `This action removes a #${id} deliveryBrand`;
  }
}
