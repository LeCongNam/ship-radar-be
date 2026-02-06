import { User as IUser } from '../../../../generated/prisma/client';

export class User implements IUser {
  password: string | null;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  avatar: string;
  dob: Date;
  phoneNumber: string;
  isVerifyEmail: boolean;
  isVerifyPhone: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
