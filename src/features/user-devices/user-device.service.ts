import { Injectable } from '@nestjs/common';
import { CreateUserDeviceDto } from './dto/create-user-device.dto';
import { UpdateUserDeviceDto } from './dto/update-user-device.dto';

@Injectable()
export class UserDeviceService {
  create(createUserDeviceDto: CreateUserDeviceDto) {
    return 'This action adds a new userDevice';
  }

  findAll() {
    return `This action returns all userDevice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userDevice`;
  }

  update(id: number, updateUserDeviceDto: UpdateUserDeviceDto) {
    return `This action updates a #${id} userDevice`;
  }

  remove(id: number) {
    return `This action removes a #${id} userDevice`;
  }
}
