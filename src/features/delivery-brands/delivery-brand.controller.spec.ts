import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryBrandController } from './delivery-brand.controller';
import { DeliveryBrandService } from './delivery-brand.service';

describe('DeliveryBrandController', () => {
  let controller: DeliveryBrandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryBrandController],
      providers: [DeliveryBrandService],
    }).compile();

    controller = module.get<DeliveryBrandController>(DeliveryBrandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
