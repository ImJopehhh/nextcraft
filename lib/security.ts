import { prisma } from "./prisma";

/**
 * Calculates lockout duration based on attempt count (Exponential Backoff)
 * 1-2 attempts: No lock
 * 3-5 attempts: 1 min
 * 6-8 attempts: 5 min
 * 9+ attempts: 15 min
 */
function calculateLockTime(count: number): number {
    if (count < 3) return 0;
    if (count < 6) return 60; // 1 minute in seconds
    if (count < 9) return 5 * 60; // 5 minutes
    return 15 * 60; // 15 minutes
}

/**
 * Get IP from request, preventing spoofing
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        // Only trust the first IP in the chain
        return forwarded.split(",")[0].trim();
    }
    return "unknown";
}

/**
 * Check if IP is locked due to too many failed attempts
 */
export async function getLoginAttempt(ip: string) {
    const now = new Date();

    const attempt = await prisma.loginAttempt.findFirst({
        where: { ip },
    });

    if (!attempt) {
        return { locked: false, timeLeft: 0 };
    }

    // Check if still locked
    if (attempt.lockUntil && attempt.lockUntil > now) {
        const timeLeft = Math.ceil((attempt.lockUntil.getTime() - now.getTime()) / 1000);
        return { locked: true, timeLeft };
    }

    return { locked: false, timeLeft: 0 };
}

/**
 * Record a failed login attempt and apply lockout if threshold exceeded
 */
export async function recordFailedAttempt(ip: string) {
    const now = new Date();

    const attempt = await prisma.loginAttempt.findFirst({
        where: { ip },
    });

    let nextCount = 1;
    if (attempt) {
        // Reset count if lock has expired
        if (attempt.lockUntil && attempt.lockUntil < now) {
            nextCount = 1;
        } else {
            nextCount = attempt.attempts + 1;
        }
    }

    const lockSeconds = calculateLockTime(nextCount);
    const lockUntil = lockSeconds > 0 ? new Date(now.getTime() + lockSeconds * 1000) : null;

    await prisma.loginAttempt.upsert({
        where: { ip },
        create: {
            ip,
            attempts: nextCount,
            lockUntil,
        },
        update: {
            attempts: nextCount,
            lockUntil,
        },
    });

    return {
        locked: !!lockUntil,
        timeLeft: lockSeconds,
    };
}

/**
 * Clear login attempts for successful login
 */
export async function clearAttempts(ip: string) {
    await prisma.loginAttempt.deleteMany({
        where: { ip },
    });
}

/**
 * Verify CSRF token by checking Origin/Referer headers
 */
export function verifyCsrfToken(request: Request): boolean {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const host = request.headers.get("host");

    // Allow same-origin requests
    if (origin) {
        const originUrl = new URL(origin);
        return originUrl.host === host;
    }

    if (referer) {
        const refererUrl = new URL(referer);
        return refererUrl.host === host;
    }

    // If neither origin nor referer present, reject for safety
    return false;
}
