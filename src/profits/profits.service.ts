import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfitDto } from './dto/create-profit.dto';
import { UpdateProfitDto } from './dto/update-profit.dto';
import { DatabaseService } from 'src/database/database.service';
import { error } from 'console';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfitsService {
  constructor (private readonly ds:DatabaseService){};
/*   create(createProfitDto: CreateProfitDto) {
    return 'This action adds a new profit';
  } */

  findAll(userId:string) {
    return this.ds.profits.findFirst({
      where:{
        owner_id:userId
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} profit`;
  }

  async update(userId: string, dto: UpdateProfitDto) {
    const profits=await this.findAll(userId);
    if(!profits){
      throw new NotFoundException('Profits not found');
    }
    
    await this.ds.profits.update({
      where:{id:profits.id},
        data:{
          gas_profit: dto.gas_profit ?? profits.gas_profit,
          des_profit: dto.des_profit ?? profits.des_profit,

        }
    });
    return { success: true };
  }

/*   remove(id: number) {
    return `This action removes a #${id} profit`;
  } */
}
