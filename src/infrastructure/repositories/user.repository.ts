import { Injectable } from '@nestjs/common';
import { User } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  formatResponse(user: User): Omit<User, 'password'> {
    const { password, ...result } = user;
    return result;
  }
}
