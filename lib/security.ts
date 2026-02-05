type Attempt = {
    count: number;
    lockUntil: number | null;
    lastFailure: number;
};

const loginAttempts = new Map<string, Attempt>();

/**
 * Calculates lockout duration based on attempt count (Exponential Backoff)
 * 1-2 attempts: No lock
 * 3-5 attempts: 1 min
 * 6-8 attempts: 5 min
 * 9+ attempts: 15 min
 */
function calculateLockTime(count: number): number {
    if (count < 3) return 0;
    if (count < 6) return 60 * 1000; // 1 minute
    if (count < 9) return 5 * 60 * 1000; // 5 minutes
    return 15 * 60 * 1000; // 15 minutes
}

export function getLoginAttempt(identifier: string, ip: string) {
    const now = Date.now();

    // Check by ID and by IP
    const idAttempt = loginAttempts.get(`id:${identifier}`);
    const ipAttempt = loginAttempts.get(`ip:${ip}`);

    const activeAttempt = (idAttempt?.lockUntil && idAttempt.lockUntil > now) ? idAttempt :
        (ipAttempt?.lockUntil && ipAttempt.lockUntil > now) ? ipAttempt : null;

    if (activeAttempt && activeAttempt.lockUntil) {
        return {
            locked: true,
            timeLeft: Math.ceil((activeAttempt.lockUntil - now) / 1000)
        };
    }

    return {
        locked: false,
        count: (idAttempt?.count || 0) + (ipAttempt?.count || 0)
    };
}

export function recordFailedAttempt(identifier: string, ip: string) {
    const now = Date.now();

    const updateAttempt = (key: string) => {
        const attempt = loginAttempts.get(key) || { count: 0, lockUntil: null, lastFailure: 0 };
        const nextCount = attempt.count + 1;
        const lockDuration = calculateLockTime(nextCount);
        const lockUntil = lockDuration > 0 ? now + lockDuration : null;

        loginAttempts.set(key, {
            count: nextCount,
            lockUntil,
            lastFailure: now
        });
        return { locked: !!lockUntil, lockDuration };
    };

    const idResult = updateAttempt(`id:${identifier}`);
    const ipResult = updateAttempt(`ip:${ip}`);

    const locked = idResult.locked || ipResult.locked;
    const maxLock = Math.max(idResult.lockDuration, ipResult.lockDuration);

    return {
        locked,
        timeLeft: Math.ceil(maxLock / 1000)
    };
}

export function clearAttempts(identifier: string, ip: string) {
    loginAttempts.delete(`id:${identifier}`);
    loginAttempts.delete(`ip:${ip}`);
}
