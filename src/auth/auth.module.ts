import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'; // استيراد الأدوات المطلوبة
import { LocalStrategy } from './strategies/local.strategy';
import { PassportAuthController } from './passoport-auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // تحويل JwtModule ليعمل بشكل ديناميكي
    JwtModule.registerAsync({
      imports: [ConfigModule], // تأكيد استيراد مودول الإعدادات
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '5d' },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController, PassportAuthController],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
