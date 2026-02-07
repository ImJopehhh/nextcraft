import { PrismaClient } from "@prisma/client";

const getDatabaseUrl = () => {
    const sanitize = (val?: string) => val?.replace(/["']/g, "").trim() || "";

    const user = sanitize(process.env.DB_USER);
    const pass = process.env.DB_PASSWORD || "";
    const rawHost = sanitize(process.env.DB_HOST);
    const rawPort = sanitize(process.env.DB_PORT).replace(/\D/g, "");
    const name = sanitize(process.env.DB_NAME);

    const isEdge = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);

    const defLimit = isEdge ? "1" : "10";
    const defTimeout = isEdge ? "10" : "20";

    const connLimit = sanitize(process.env.DB_CONNECTION_LIMIT) || defLimit;
    const connTimeout = sanitize(process.env.DB_CONNECT_TIMEOUT) || defTimeout;

    const hostParts = rawHost.split(":");
    const fHost = hostParts[0] || "127.0.0.1";
    const fPort = hostParts[1] || rawPort || "3306";
    const fUser = user || "root";
    const fName = name || "nextcraft";

    const encodedPass = encodeURIComponent(pass.replace(/["']/g, "").trim());
    const url = `mysql://${fUser}:${encodedPass}@${fHost}:${fPort}/${fName}?connection_limit=${connLimit}&connect_timeout=${connTimeout}`;

    if (process.env.DEBUG === "true") {
        console.log(`[Database] Mode: ${isEdge ? "Standard" : "Extended"}`);
        console.log(`[Database] Config: pool=${connLimit}, timeout=${connTimeout}s`);
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
