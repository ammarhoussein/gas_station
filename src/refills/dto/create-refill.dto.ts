import { Prisma } from "@prisma/client";
export class CreateRefillDto {
    tankId: string;
    quantity_liters: string;
}
