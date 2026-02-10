
import 'dotenv/config'
import { PrismaClient, FuelKind } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from 'bcrypt';
const connectionString = process.env.DATABASE_URL;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Create the User (Owner)
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const owner = await prisma.user.upsert({
    where: { username: 'station_owner' },
    update: {},
    create: {
      username: 'station_owner',
      password_hash: hashedPassword,
      role: 'manager',
    },
  });

  // 2. Create the Gas Station linked to the owner
  const station = await prisma.gasStation.upsert({
    where: { name: 'كازية سكا-أبو علاء' },
    update: {},
    create: {
      name: 'كازية سكا-أبو علاء',
      location: 'سكا',
      owner_id: owner.id,
    },
  });

  // 3. Create 2 Gasoline Tanks for this station

  // 4. Create 2 Diesel Tanks for this station
  await prisma.tank.createMany({
    data: [
      {
        name: 'خزان مازوت 1',
        fuel_type: FuelKind.DIESEL,
        station_id: station.id,
        current_quantity_liters: 0,
      },
      {
        name: 'خزان بنزين 1',
        fuel_type: FuelKind.GASOLINE,
        station_id: station.id,
        current_quantity_liters: 0,
      },
    ],
    skipDuplicates: true,
  });
  await prisma.profits.upsert({
    where: { owner_id: owner.id},
    update: {},
    create: {
      gas_profit: '0',
      des_profit: '0',
      owner_id: owner.id
    },
  })

  console.log('✅ Seed successful: 1 Owner, 1 Station, 4 Tanks created.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
