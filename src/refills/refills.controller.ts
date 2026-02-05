import { Controller, Get, Post, Body, Patch, Param, Delete , UseGuards , Request, Query } from '@nestjs/common';
import { RefillsService } from './refills.service';
import { CreateRefillDto } from './dto/create-refill.dto';
import { UpdateRefillDto } from './dto/update-refill.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Prisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('refills')
export class RefillsController {
  constructor(private readonly refillsService: RefillsService) {}

  @Post()
  create(
    @Body() dto: CreateRefillDto,
    @Request() req,
  ) {
    return this.refillsService.createRefill(
      dto,
      req.user.userId,
    );
  }

  
  @Get()
  findAll(@Query('tank') tank:string ,@Request() req) {
    if(tank){
      return this.refillsService.findfortank(tank,req.user.userId);
    }
    return this.refillsService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.refillsService.findOneForUser(id, req.user.userId);
  }


  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRefillDto: UpdateRefillDto,
    @Request() req,
  ) {
    return this.refillsService.updateRefill(
      id,
      updateRefillDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Request() req) {
    return this.refillsService.remove(id,req.user.userId);
  }
}
