import { Test, TestingModule } from '@nestjs/testing';
import { DailyReadingsService } from './daily-readings.service';

describe('DailyReadingsService', () => {
  let service: DailyReadingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyReadingsService],
    }).compile();

    service = module.get<DailyReadingsService>(DailyReadingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
