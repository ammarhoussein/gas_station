import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRefillDto } from './dto/create-refill.dto';
import { UpdateRefillDto } from './dto/update-refill.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RefillsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ===============================
  // Create refill
  // ===============================
  async createRefill(dto: CreateRefillDto, userId: string) {
    // 1️⃣ validation OUTSIDE transaction
    const tank = await this.databaseService.tank.findFirst({
      where: {
        id: dto.tankId,
        station: { owner_id: userId },
      },
    });

    if (!tank) {
      throw new ForbiddenException('You do not have access to this tank');
    }

    const qty = new Prisma.Decimal(dto.quantity_liters);

    // 2️⃣ batch transaction (NO callback)
    await this.databaseService.$transaction([
      this.databaseService.refill.create({
        data: {
          tank_id: dto.tankId,
          quantity_liters: qty,
          created_by: userId,
        },
      }),
      this.databaseService.tank.update({
        where: { id: dto.tankId },
        data: {
          current_quantity_liters: {
            increment: qty,
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
    return this.databaseService.refill.findMany({
      where: {
        tank: {
          station: { owner_id: userId },
        },
      },
      orderBy: { refilled_at: 'desc' },
      include: {
        tank: {
          select: {
            id: true,
            name: true,
            fuel_type: true,
          },
        },
      },
    });
  }

  async findOneForUser(refillId: string, userId: string) {
    const refill = await this.databaseService.refill.findFirst({
      where: {
        id: refillId,
        tank: { station: { owner_id: userId } },
      },
      include: { tank: true },
    });

    if (!refill) {
      throw new NotFoundException('Refill not found');
    }

    return refill;
  }
  async findfortank(tank:string,userId:string){
    const refill= await this.databaseService.refill.findFirst({
      where:{
        tank:{
          id:tank,
          station:{
            owner_id:userId
          }
        }
      },
    })
    if (!refill) {
      throw new NotFoundException('Reading not found');
    }
    return refill;
  }

  // ===============================
  // Update refill
  // ===============================
  async updateRefill(
    refillId: string,
    dto: UpdateRefillDto,
    userId: string,
  ) {
    // 1️⃣ validation OUTSIDE transaction
    const refill = await this.databaseService.refill.findFirst({
      where: {
        id: refillId,
        tank: { station: { owner_id: userId } },
      },
    });

    if (!refill) {
      throw new NotFoundException('Refill not found');
    }

    const latestRefill = await this.databaseService.refill.findFirst({
      where: { tank_id: refill.tank_id },
      orderBy: { refilled_at: 'desc' },
    });

    if (latestRefill?.id !== refill.id) {
      throw new BadRequestException(
        'Only the latest refill can be modified',
      );
    }

    const readingAfter = await this.databaseService.dailyReading.findFirst({
      where: {
        tank_id: refill.tank_id,
        reading_date: { gt: refill.refilled_at },
      },
    });

    if (readingAfter) {
      throw new BadRequestException(
        'Cannot modify refill after daily readings exist',
      );
    }

    const oldQty = refill.quantity_liters;
    const newQty = new Prisma.Decimal(dto.quantityLiters);
    const diff = newQty.sub(oldQty);

    // 2️⃣ batch transaction
    await this.databaseService.$transaction([
      this.databaseService.refill.update({
        where: { id: refillId },
        data: { quantity_liters: newQty },
      }),
      this.databaseService.tank.update({
        where: { id: refill.tank_id },
        data: {
          current_quantity_liters: {
            increment: diff,
          },
        },
      }),
    ]);

    return { success: true };
  }

  // ===============================
  // Delete refill
  // ===============================
  async remove(id: string, userId: string) {
    // 1️⃣ validation
    const refill = await this.databaseService.refill.findFirst({
      where: {
        id,
        tank: { station: { owner_id: userId } },
      },
    });

    if (!refill) {
      throw new NotFoundException('Refill not found');
    }

    const latestRefill = await this.databaseService.refill.findFirst({
      where: { tank_id: refill.tank_id },
      orderBy: { refilled_at: 'desc' },
    });

    if (latestRefill?.id !== refill.id) {
      throw new BadRequestException(
        'Only the latest refill can be modified',
      );
    }

    const readingAfter = await this.databaseService.dailyReading.findFirst({
      where: {
        tank_id: refill.tank_id,
        reading_date: { gt: refill.refilled_at },
      },
    });

    if (readingAfter) {
      throw new BadRequestException(
        'Cannot delete refill after daily readings exist',
      );
    }

    // 2️⃣ batch transaction
    await this.databaseService.$transaction([
      this.databaseService.refill.delete({
        where: { id },
      }),
      this.databaseService.tank.update({
        where: { id: refill.tank_id },
        data: {
          current_quantity_liters: {
            decrement: refill.quantity_liters,
          },
        },
      }),
    ]);

    return { success: true };
  }
}
