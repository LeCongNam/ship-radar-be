export class User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  username: string;
  bio?: string;
  avatar?: string;
  dob?: Date;
  phoneNumber?: string;
  isVerifyEmail: boolean;
  isVerifyPhone: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
