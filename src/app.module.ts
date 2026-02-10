import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthService } from './auth/auth.service';
import { TanksModule } from './tanks/tanks.module';
import { DailyReadingsModule } from './daily-readings/daily-readings.module';
import { RefillsModule } from './refills/refills.module';
import { ProfitsModule } from './profits/profits.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // يجعله متاحاً في كل مكان دون إعادة استيراده
    }),
    AuthModule,
    UsersModule, 
    DatabaseModule, 
    TanksModule, 
    DailyReadingsModule, 
    RefillsModule, ProfitsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
