import { IsDateString, IsNumberString, IsUUID } from 'class-validator';

export class CreateDailyReadingDto {
  @IsUUID()
  tankId: string;

  @IsDateString()
  readingDate: string;

  @IsNumberString()
  startCounter: string;

  @IsNumberString()
  endCounter: string;
}
