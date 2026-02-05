import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { TanksService } from './tanks.service';
import { CreateTankDto } from './dto/create-tank.dto';
import { UpdateTankDto } from './dto/update-tank.dto';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('tanks')
export class TanksController {
  constructor(private readonly tanksService: TanksService) {}

  @Post()
  create(@Body() createTankDto: CreateTankDto, @Request() request) {
    return this.tanksService.create(createTankDto,request.user.userId);
  }

  
  @Get()
  findAll(@Request() request) {
    return this.tanksService.findAllForUser(request.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
  return this.tanksService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTankDto: UpdateTankDto,@Request() req) {
    return this.tanksService.update(id, updateTankDto,req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Request() req) {
    return this.tanksService.remove(id,req.user.userId);
  }
}
