-- CreateEnum
CREATE TYPE "FuelKind" AS ENUM ('GASOLINE', 'DIESEL');

-- CreateTable
CREATE TABLE "GasStation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GasStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "station_id" TEXT NOT NULL,
    "fuel_type" "FuelKind" NOT NULL,
    "current_quantity_liters" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Tank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyReading" (
    "id" TEXT NOT NULL,
    "tank_id" TEXT NOT NULL,
    "reading_date" DATE NOT NULL,
    "start_counter" DECIMAL(12,2) NOT NULL,
    "end_counter" DECIMAL(12,2) NOT NULL,
    "consumption_liters" DECIMAL(12,2) NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refill" (
    "id" TEXT NOT NULL,
    "tank_id" TEXT NOT NULL,
    "quantity_liters" DECIMAL(12,2) NOT NULL,
    "refilled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "Refill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'manager',
    "work_station_id" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GasStation_name_key" ON "GasStation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tank_station_id_name_key" ON "Tank"("station_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "DailyReading_tank_id_reading_date_start_counter_end_counter_key" ON "DailyReading"("tank_id", "reading_date", "start_counter", "end_counter");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "GasStation" ADD CONSTRAINT "GasStation_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tank" ADD CONSTRAINT "Tank_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "GasStation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReading" ADD CONSTRAINT "DailyReading_tank_id_fkey" FOREIGN KEY ("tank_id") REFERENCES "Tank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReading" ADD CONSTRAINT "DailyReading_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refill" ADD CONSTRAINT "Refill_tank_id_fkey" FOREIGN KEY ("tank_id") REFERENCES "Tank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refill" ADD CONSTRAINT "Refill_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
