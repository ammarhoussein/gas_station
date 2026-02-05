import { Test, TestingModule } from '@nestjs/testing';
import { RefillsController } from './refills.controller';
import { RefillsService } from './refills.service';

describe('RefillsController', () => {
  let controller: RefillsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefillsController],
      providers: [RefillsService],
    }).compile();

    controller = module.get<RefillsController>(RefillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
