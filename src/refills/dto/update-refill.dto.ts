import { IsNumberString } from 'class-validator';

export class UpdateRefillDto {
  @IsNumberString()
  quantityLiters: string;
}
