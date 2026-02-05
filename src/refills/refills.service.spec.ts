import { Test, TestingModule } from '@nestjs/testing';
import { RefillsService } from './refills.service';

describe('RefillsService', () => {
  let service: RefillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefillsService],
    }).compile();

    service = module.get<RefillsService>(RefillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
