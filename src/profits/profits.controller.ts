import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { ProfitsService } from './profits.service';
import { CreateProfitDto } from './dto/create-profit.dto';
import { UpdateProfitDto } from './dto/update-profit.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('profits')
export class ProfitsController {
  constructor(private readonly profitsService: ProfitsService) {}

/*   @Post()
   create(@Body() createProfitDto: CreateProfitDto) {
    return this.profitsService.create(createProfitDto);
  } */ 

  @Get()
  findAll(@Request() req) {
    return this.profitsService.findAll(req.user.userId);
  }

/*   @Get(':id')
  findOne(@Request() req) {
    return this.profitsService.findOne(+id);
  } */

  @Patch()
  update(@Body() dto: UpdateProfitDto,
      @Request() req) {
    return this.profitsService.update(req.user.userId, dto);
  }

/*   @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profitsService.remove(+id);
  } */
}
