import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
@Injectable()
export class UsersService {
    constructor(private readonly databaseService : DatabaseService ){}
    
    async findOneByUsername(username: string) {
    return this.databaseService.user.findUnique({
      where:{
        username,
      }
    });
  }
}
