import { Controller, Get, Post, Body, Patch, Param, Delete,Request,UseGuards, Query } from '@nestjs/common';
import { DailyReadingsService } from './daily-readings.service';
import { CreateDailyReadingDto } from './dto/create-daily-reading.dto';
import { UpdateDailyReadingDto } from './dto/update-daily-reading.dto';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('daily_readings')
export class DailyReadingsController {
  constructor(private readonly service: DailyReadingsService) {}

  @Post()
  create(@Body() dto: CreateDailyReadingDto, @Request() req) {
    return this.service.create(dto, req.user.userId);
  }

  @Get()
  findAll(@Query('tank') tank: string,@Request() req) {
    if(!tank){
      return this.service.findAllForUser(req.user.userId);

    }
    return this.service.findOnefortank(tank, req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOneForUser(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDailyReadingDto,
    @Request() req,
  ) {
    return this.service.updateReading(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.removeReading(id, req.user.userId);
  }
}
