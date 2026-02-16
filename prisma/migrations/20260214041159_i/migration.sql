/*
  Warnings:

  - You are about to drop the column `work_station_id` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "work_station_id";

-- CreateTable
CREATE TABLE "Profits" (
    "id" TEXT NOT NULL,
    "balance" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "gas_profit" TEXT NOT NULL,
    "des_profit" TEXT NOT NULL,

    CONSTRAINT "Profits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profits_owner_id_key" ON "Profits"("owner_id");

-- AddForeignKey
ALTER TABLE "Profits" ADD CONSTRAINT "Profits_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
