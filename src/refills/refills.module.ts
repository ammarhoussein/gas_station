import { Module } from '@nestjs/common';
import { RefillsService } from './refills.service';
import { RefillsController } from './refills.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[DatabaseModule,AuthModule],
  controllers: [RefillsController],
  providers: [RefillsService],
})
export class RefillsModule {}
