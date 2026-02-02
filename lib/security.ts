type Attempt = {
    count: number;
    lockUntil: number | null;
};

const loginAttempts = new Map<string, Attempt>();

export function getLoginAttempt(identifier: string) {
    const attempt = loginAttempts.get(identifier);
    const now = Date.now();

    if (attempt && attempt.lockUntil && attempt.lockUntil > now) {
        return {
            locked: true,
            timeLeft: Math.ceil((attempt.lockUntil - now) / 1000) // in seconds
        };
    }

    return { locked: false, count: attempt?.count || 0 };
}

export function recordFailedAttempt(identifier: string) {
    const attempt = loginAttempts.get(identifier) || { count: 0, lockUntil: null };
    const nextCount = attempt.count + 1;
    let lockUntil = null;

    if (nextCount >= 3) {
        lockUntil = Date.now() + 60 * 1000; // 1 minute lockout
    }

    loginAttempts.set(identifier, { count: nextCount, lockUntil });
    return { locked: !!lockUntil, nextCount };
}

export function clearAttempts(identifier: string) {
    loginAttempts.delete(identifier);
}
