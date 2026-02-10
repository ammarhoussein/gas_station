import { Module } from '@nestjs/common';
import { ProfitsService } from './profits.service';
import { ProfitsController } from './profits.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[DatabaseModule,AuthModule],
  controllers: [ProfitsController],
  providers: [ProfitsService],
})
export class ProfitsModule {}
