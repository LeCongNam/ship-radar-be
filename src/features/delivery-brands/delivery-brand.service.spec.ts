import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryBrandService } from './delivery-brand.service';

describe('DeliveryBrandService', () => {
  let service: DeliveryBrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryBrandService],
    }).compile();

    service = module.get<DeliveryBrandService>(DeliveryBrandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
