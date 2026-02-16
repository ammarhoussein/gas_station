// src/users/users.controller.ts
import { Controller, Patch, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PassportJwtAuthGuard } from 'src/auth/guards/passport-jwt.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(PassportJwtAuthGuard)
  @Patch('change_password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    // req.user is set by your AuthGuard: { userId, username }
    const userId = req.user?.userId;
    return this.usersService.changePassword(userId, dto.oldPassword, dto.newPassword);
  }
}
