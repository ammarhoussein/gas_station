import { Injectable ,BadRequestException,ForbiddenException,} from '@nestjs/common';
import { CreateTankDto } from './dto/create-tank.dto';
import { UpdateTankDto } from './dto/update-tank.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class TanksService {
  constructor(private readonly databaseService : DatabaseService ){}
  
  async create(dto: CreateTankDto, userId: string) {
    const station = await this.databaseService.gasStation.findUnique({
      where: { id: dto.stationId },
    });

    if (!station || station.owner_id !== userId) {
      throw new ForbiddenException(
        'You do not own this station',
      );
    }

    return this.databaseService.tank.create({
      data: {
        station_id: dto.stationId,
        name:dto.name,
        fuel_type: dto.fuelType,
        current_quantity_liters: new Prisma.Decimal(
          dto.initialQuantityLiters,
        ),
      },
    });
  }

  findAll() {
    return this.databaseService.tank.findMany();
  }
  
  async findAllForUser(userId: string) {
  return this.databaseService.tank.findMany({
    where: {
      station: {
        owner_id: userId,
      },
    },
  });
  }

  async findOne(id: string, userId: string) {
    const tank = await this.databaseService.tank.findUnique({
      where: { id },
      include: {
        station: true,
      },
    });

    if (!tank || tank.station.owner_id !== userId) {
      throw new ForbiddenException();
    }

    return tank;
  }


  async update(id: string, dto: UpdateTankDto, userId: string) {
    const tank = await this.databaseService.tank.findUnique({
      where: { id },
      include: { station: true },
    });
  
    if (!tank || tank.station.owner_id !== userId) {
      throw new ForbiddenException();
    }
  }


  async remove(id: string, userId: string) {
    const tank = await this.databaseService.tank.findUnique({
      where: { id },
      include: {
        station: true,
        refills: true,
        readings: true,
      },
    });
  
    if (!tank || tank.station.owner_id !== userId) {
      throw new ForbiddenException();
    }
  
    if (
      tank.refills.length > 0 ||
      tank.readings.length > 0
    ) {
      throw new BadRequestException(
        'Cannot delete tank with historical records',
      );
    }
  
    return this.databaseService.tank.delete({
      where: { id },
    });
  }

}
/* async getRemainingQuantity(tankId: string) {
  // 1. Get the latest refill
  const lastRefill = await this.prisma.refill.findFirst({
    where: { tank_id: tankId },
    orderBy: { refilled_at: 'desc' },
  });

  const refillDate = lastRefill?.refilled_at || new Date(0);
  const baseQuantity = lastRefill?.quantity_liters || 0;

  // 2. Sum consumption since that refill
  const aggregate = await this.prisma.dailyReading.aggregate({
    _sum: { consumption_liters: true },
    where: {
      tank_id: tankId,
      reading_date: { gt: refillDate },
    },
  });

  const totalConsumed = aggregate._sum.consumption_liters || 0;

  // 3. Return the result
  return Number(baseQuantity) - Number(totalConsumed);
} */


/* async createRefill(dto: CreateRefillDto) {
  return this.prisma.$transaction(async (tx) => {
    // 1. Update the Tank balance (Add)
    await tx.tank.update({
      where: { id: dto.tank_id },
      data: {
        current_quantity_liters: { increment: dto.quantity_liters }
      }
    });

    // 2. Create the refill log
    return tx.refill.create({ data: dto });
  });
} */


/* async createReading(dto: CreateReadingDto) {
  const consumption = dto.end_counter - dto.start_counter;

  return this.prisma.$transaction(async (tx) => {
    // 1. Update the Tank balance (Subtract)
    const updatedTank = await tx.tank.update({
      where: { id: dto.tank_id },
      data: {
        current_quantity_liters: { decrement: consumption }
      }
    });

    // 2. Create the reading record
    return tx.dailyReading.create({
      data: { ...dto, consumption_liters: consumption }
    });
  });
} */
