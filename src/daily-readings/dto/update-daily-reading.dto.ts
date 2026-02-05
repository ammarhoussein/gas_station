import { IsNumberString, IsOptional } from 'class-validator';

export class UpdateDailyReadingDto {
  @IsOptional()
  @IsNumberString()
  startCounter?: string;

  @IsOptional()
  @IsNumberString()
  endCounter?: string;
}
