import { Injectable } from '@nestjs/common';
import { User } from '../../../../generated/prisma/client';
import { UserRepository } from '../../../infrastructure/repositories';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly _userRepo: UserRepository) {}

  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  findAll() {
    return `This action returns all customer`;
  }

  async getProfile(user: User) {
    const userProfile = (await this._userRepo.findOneBy({
      id: user.id,
    })) as User;

    return this._userRepo.formatResponse(userProfile);
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
