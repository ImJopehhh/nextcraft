import { PrismaClient } from "@prisma/client";

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

console.log("----------------------------------------");
console.log("🔍 DEBUG: Database Connection Info");
console.log(`DB_HOST: '${DB_HOST}'`);
console.log(`DB_PORT: '${DB_PORT}'`);
console.log(`DB_USER: '${DB_USER}'`);
console.log(`DB_NAME: '${DB_NAME}'`);
console.log(`DB_PASSWORD length: ${DB_PASSWORD?.length}`);

const encodedPassword = encodeURIComponent(DB_PASSWORD || '');
console.log(`Encoded Password substring: ${encodedPassword.substring(0, 5)}...`);

const databaseUrl = `mysql://${DB_USER}:${encodedPassword}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// Mask password for logging
const logSafeUrl = databaseUrl.replace(encodedPassword, '****');
console.log(`Generated DATABASE_URL: ${logSafeUrl}`);
console.log("----------------------------------------");

process.env.DATABASE_URL = databaseUrl;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["query"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
