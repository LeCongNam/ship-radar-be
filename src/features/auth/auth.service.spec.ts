import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../categories/services/category.service';
import { AuthService } from './services/auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, CategoryService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return mock value when calling login', async () => {
    const mockValue = {
      data: {
        user: {
          id: 1,
          email: 'test@example.com',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          firstName: 'Test',
          lastName: 'User',
          username: 'testuser',
          bio: null,
          avatar: null,
          phone: null,
          dob: null,
          phoneNumber: null,
          isVerifyEmail: false,
          isVerifyPhone: false,
        },
        token: { accessToken: 'access-token', refreshToken: 'refresh-token' },
      },
    };

    jest.spyOn(service, 'login').mockResolvedValue(mockValue);

    const result = await service.login(
      { email: 'test@example.com', password: 'password' },
      {
        deviceId: 'device1',
        deviceType: 'mobile',
        osVersion: null,
      },
    );

    expect(result).toEqual(mockValue);
  });
});
