import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthService } from './auth/auth.service';
import { TanksModule } from './tanks/tanks.module';
import { DailyReadingsModule } from './daily-readings/daily-readings.module';
import { RefillsModule } from './refills/refills.module';

@Module({
  imports: [AuthModule,UsersModule, DatabaseModule, TanksModule, DailyReadingsModule, RefillsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
