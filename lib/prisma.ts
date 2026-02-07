import { PrismaClient } from "@prisma/client";

const getDatabaseUrl = () => {
    // Aggressive cleaning function
    const sanitize = (val?: string) => val?.replace(/["']/g, "").trim() || "";

    const user = sanitize(process.env.DB_USER);
    const pass = process.env.DB_PASSWORD || ""; // Password can have spaces, only remove quotes
    const rawHost = sanitize(process.env.DB_HOST);
    const rawPort = sanitize(process.env.DB_PORT).replace(/\D/g, "");
    const name = sanitize(process.env.DB_NAME);

    // Ultra-defensive: parse host if it contains a port
    const hostParts = rawHost.split(":");
    const fHost = hostParts[0] || "127.0.0.1";
    const fPort = hostParts[1] || rawPort || "3306";
    const fUser = user || "root";
    const fName = name || "nextcraft";

    // Build URL with explicit encoding
    const encodedPass = encodeURIComponent(pass.replace(/["']/g, "").trim());
    const url = `mysql://${fUser}:${encodedPass}@${fHost}:${fPort}/${fName}?connection_limit=1&connect_timeout=10`;

    const isDebug = process.env.DEBUG === "true";

    if (isDebug) {
        console.log("----------------------------------------");
        console.log("🚀 PRISMA: Constructing Database Connection");
        console.log(`📡 Target: ${fHost}:${fPort}`);
        console.log(`👤 User: ${fUser}`);
        console.log(`📂 Database: ${fName}`);
        console.log("✅ Connection string constructed and sanitized.");
        console.log("----------------------------------------");
    }

    return url;
};

const databaseUrl = getDatabaseUrl();
process.env.DATABASE_URL = databaseUrl;

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const isDebug = process.env.DEBUG === "true";

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasources: {
            db: {
                url: databaseUrl,
            },
        },
        log: isDebug ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
