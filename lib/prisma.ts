import { PrismaClient } from "@prisma/client";

const clean = (val?: string) => val?.replace(/["']/g, "").trim() || "";

const user = clean(process.env.DB_USER);
const pass = process.env.DB_PASSWORD; // Keep full password, but ensure it's defined
const host = clean(process.env.DB_HOST);
const port = clean(process.env.DB_PORT);
const name = clean(process.env.DB_NAME);

console.log("----------------------------------------");
console.log("🔍 DEBUG: Database Connection Info (Sanitized)");
console.log(`DB_HOST: '${host}'`);
console.log(`DB_PORT: '${port}'`);
console.log(`DB_USER: '${user}'`);
console.log(`DB_NAME: '${name}'`);
console.log(`DB_PASSWORD length: ${pass?.length}`);

const encodedPassword = encodeURIComponent(pass || '');
const databaseUrl = `mysql://${user}:${encodedPassword}@${host}:${port}/${name}`;

// Mask password for logging
const logSafeUrl = databaseUrl.replace(encodedPassword, '****');
console.log(`Generated DATABASE_URL: ${logSafeUrl}`);
console.log("----------------------------------------");

process.env.DATABASE_URL = databaseUrl;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasources: {
            db: {
                url: databaseUrl,
            },
        },
        log: ["query"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
