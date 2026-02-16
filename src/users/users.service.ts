// src/users/users.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOneByUsername(username: string) {
    return this.databaseService.user.findUnique({
      where: { username },
    });
  }

  /**
   * Change password for a user.
   * Verifies oldPassword, hashes newPassword, updates DB.
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.databaseService.user.update({
      where: { id: userId },
      data: { password_hash: hashed },
    });

    return { message: 'Password changed successfully' };
  }
}
