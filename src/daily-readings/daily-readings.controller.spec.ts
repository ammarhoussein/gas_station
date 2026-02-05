import { Test, TestingModule } from '@nestjs/testing';
import { DailyReadingsController } from './daily-readings.controller';
import { DailyReadingsService } from './daily-readings.service';

describe('DailyReadingsController', () => {
  let controller: DailyReadingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyReadingsController],
      providers: [DailyReadingsService],
    }).compile();

    controller = module.get<DailyReadingsController>(DailyReadingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
