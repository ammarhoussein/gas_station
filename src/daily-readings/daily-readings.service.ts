import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDailyReadingDto } from './dto/create-daily-reading.dto';
import { UpdateDailyReadingDto } from './dto/update-daily-reading.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DailyReadingsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ===============================
  // Create daily reading
  // ===============================
  async create(dto: CreateDailyReadingDto, userId: string) {
    // 1️⃣ validation
    const tank = await this.databaseService.tank.findFirst({
      where: {
        id: dto.tankId,
        station: { owner_id: userId },
      },
    });

    if (!tank) {
      throw new NotFoundException('Tank not found');
    }

    const readingDate = new Date(dto.readingDate);
    if (isNaN(readingDate.getTime())) {
      throw new BadRequestException('Invalid readingDate format');
    }

    const existing = await this.databaseService.dailyReading.findUnique({
      where: {
        tank_id_reading_date: {
          tank_id: tank.id,
          reading_date: readingDate,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Daily reading already exists for this tank and date',
      );
    }

    const laterReading = await this.databaseService.dailyReading.findFirst({
      where: {
        tank_id: tank.id,
        reading_date: { gt: readingDate },
      },
    });

    if (laterReading) {
      throw new BadRequestException(
        'Cannot insert reading before existing future readings',
      );
    }

    const start = new Prisma.Decimal(dto.startCounter);
    const end = new Prisma.Decimal(dto.endCounter);

    if (end.lt(start)) {
      throw new BadRequestException('start counter cannot exceed end');
    }

    const consumption = end.sub(start);

    // 2️⃣ batch transaction
    await this.databaseService.$transaction([
      this.databaseService.dailyReading.create({
        data: {
          tank_id: tank.id,
          reading_date: readingDate,
          start_counter: start,
          end_counter: end,
          consumption_liters: consumption,
          created_by: userId,
        },
      }),
      this.databaseService.tank.update({
        where: { id: tank.id },
        data: {
          current_quantity_liters: {
            decrement: consumption,
          },
        },
      }),
    ]);

    return { success: true };
  }

  // ===============================
  // Queries
  // ===============================
  async findAllForUser(userId: string) {
    return this.databaseService.dailyReading.findMany({
      where: {
        tank: { station: { owner_id: userId } },
      },
      orderBy: { reading_date: 'desc' },
      include: { tank: true },
    });
  }

  async findOneForUser(id: string, userId: string) {
    const reading = await this.databaseService.dailyReading.findFirst({
      where: {
        id,
        tank: { station: { owner_id: userId } },
      },
    });

    if (!reading) {
      throw new NotFoundException('Reading not found');
    }

    return reading;
  }
async findOnefortank(tank:string,userId: string){
    const reading = await this.databaseService.dailyReading.findMany({
      where:{
        tank:{
          id:tank,
          station:{
            owner_id:userId
          }
        }
      },
      orderBy: {
        reading_date: 'desc',
      },
    })
    if (!reading) {
      throw new NotFoundException('Reading not found');
    }
    return reading;
  }

  // ===============================
  // Update reading
  // ===============================
  async updateReading(
    id: string,
    dto: UpdateDailyReadingDto,
    userId: string,
  ) {
    // 1️⃣ validation
    const reading = await this.databaseService.dailyReading.findFirst({
      where: {
        id,
        tank: { station: { owner_id: userId } },
      },
    });

    if (!reading) {
      throw new NotFoundException('Reading not found');
    }

    const laterReading = await this.databaseService.dailyReading.findFirst({
      where: {
        tank_id: reading.tank_id,
        reading_date: { gt: reading.reading_date },
      },
    });

    if (laterReading) {
      throw new BadRequestException(
        'Cannot modify reading with later readings present',
      );
    }

    const start = dto.startCounter
      ? new Prisma.Decimal(dto.startCounter)
      : reading.start_counter;

    const end = dto.endCounter
      ? new Prisma.Decimal(dto.endCounter)
      : reading.end_counter;

    if (end.lt(start)) {
      throw new BadRequestException('start counter cannot exceed end');
    }

    const oldConsumption = reading.consumption_liters;
    const newConsumption = end.sub(start);
    const diff = newConsumption.sub(oldConsumption);

    // 2️⃣ batch transaction
    await this.databaseService.$transaction([
      this.databaseService.dailyReading.update({
        where: { id },
        data: {
          start_counter: start,
          end_counter: end,
          consumption_liters: newConsumption,
        },
      }),
      this.databaseService.tank.update({
        where: { id: reading.tank_id },
        data: {
          current_quantity_liters: {
            decrement: diff,
          },
        },
      }),
    ]);

    return { success: true };
  }

  // ===============================
  // Delete reading
  // ===============================
  async removeReading(id: string, userId: string) {
    // 1️⃣ validation
    const reading = await this.databaseService.dailyReading.findFirst({
      where: {
        id,
        tank: { station: { owner_id: userId } },
      },
    });

    if (!reading) {
      throw new NotFoundException('Reading not found');
    }

    const laterReading = await this.databaseService.dailyReading.findFirst({
      where: {
        tank_id: reading.tank_id,
        reading_date: { gt: reading.reading_date },
      },
    });

    if (laterReading) {
      throw new BadRequestException(
        'Cannot delete reading with later readings present',
      );
    }

    // 2️⃣ batch transaction
    await this.databaseService.$transaction([
      this.databaseService.tank.update({
        where: { id: reading.tank_id },
        data: {
          current_quantity_liters: {
            increment: reading.consumption_liters,
          },
        },
      }),
      this.databaseService.dailyReading.delete({
        where: { id },
      }),
    ]);

    return { success: true };
  }
}
