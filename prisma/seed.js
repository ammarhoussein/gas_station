"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcrypt"));
const connectionString = process.env.DATABASE_URL;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const adapter = new adapter_pg_1.PrismaPg({ connectionString });
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
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
    const station = await prisma.gasStation.upsert({
        where: { name: 'كازية سكا-أبو علاء' },
        update: {},
        create: {
            name: 'كازية سكا-أبو علاء',
            location: 'سكا',
            owner_id: owner.id,
        },
    });
    await prisma.tank.createMany({
        data: [
            {
                name: 'خزان مازوت 1',
                fuel_type: client_1.FuelKind.DIESEL,
                station_id: station.id,
                current_quantity_liters: 0,
            },
            {
                name: 'خزان بنزين 1',
                fuel_type: client_1.FuelKind.GASOLINE,
                station_id: station.id,
                current_quantity_liters: 0,
            },
        ],
        skipDuplicates: true,
    });
    console.log('✅ Seed successful: 1 Owner, 1 Station, 4 Tanks created.');
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map