import { IsString, IsNumber, Min } from 'class-validator';
import { FuelKind } from '@prisma/client';
export class CreateTankDto {
  @IsString()
  stationId: string;

  @IsString()
  fuelType: FuelKind;

  @IsString()
  name:string

  @IsNumber()
  @Min(0)
  initialQuantityLiters: number;
}
