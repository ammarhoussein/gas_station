import { Module } from '@nestjs/common';
import { DailyReadingsService } from './daily-readings.service';
import { DailyReadingsController } from './daily-readings.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[DatabaseModule,AuthModule],
  controllers: [DailyReadingsController],
  providers: [DailyReadingsService],
})
export class DailyReadingsModule {}
