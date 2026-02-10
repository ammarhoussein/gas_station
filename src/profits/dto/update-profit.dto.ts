import { IsNumberString, IsOptional } from 'class-validator';

export class UpdateProfitDto {
  @IsOptional()
  @IsNumberString()
  gas_profit?: string;

  @IsOptional()
  @IsNumberString()
  des_profit?: string;
}
