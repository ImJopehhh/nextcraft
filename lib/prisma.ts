import { PrismaClient } from "@prisma/client";

const getDatabaseUrl = () => {
    // Aggressive cleaning function
    const sanitize = (val?: string) => val?.replace(/["']/g, "").trim() || "";

    const user = sanitize(process.env.DB_USER);
    const pass = process.env.DB_PASSWORD || "";
    const rawHost = sanitize(process.env.DB_HOST);
    const rawPort = sanitize(process.env.DB_PORT).replace(/\D/g, "");
    const name = sanitize(process.env.DB_NAME);

    // Environment Detection
    const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);

    // Connection Strategy Defaults
    // - Serverless: Low limit (1) to avoid exhaustion across many parallel functions
    // - Real Server: Higher limit (10) for efficient persistent connection reuse
    const defaultLimit = isServerless ? "1" : "10";
    const defaultTimeout = isServerless ? "10" : "20";

    // Overrides
    const connLimit = sanitize(process.env.DB_CONNECTION_LIMIT) || defaultLimit;
    const connTimeout = sanitize(process.env.DB_CONNECT_TIMEOUT) || defaultTimeout;

    // Ultra-defensive: parse host if it contains a port
    const hostParts = rawHost.split(":");
    const fHost = hostParts[0] || "127.0.0.1";
    const fPort = hostParts[1] || rawPort || "3306";
    const fUser = user || "root";
    const fName = name || "nextcraft";

    // Build URL with environment-specific parameters
    const encodedPass = encodeURIComponent(pass.replace(/["']/g, "").trim());
    const url = `mysql://${fUser}:${encodedPass}@${fHost}:${fPort}/${fName}?connection_limit=${connLimit}&connect_timeout=${connTimeout}`;

    const isDebug = process.env.DEBUG === "true";

    if (isDebug) {
        console.log("----------------------------------------");
        console.log(`🚀 PRISMA: Environment [${isServerless ? "SERVERLESS" : "TRADITIONAL"}]`);
        console.log(`📡 Target: ${fHost}:${fPort}`);
        console.log(`⚙️ Pool: limit=${connLimit}, timeout=${connTimeout}s`);
        console.log("✅ Connection string adaptive configuration applied.");
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
