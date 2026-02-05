import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getLoginAttempt, recordFailedAttempt, clearAttempts } from "@/lib/security";

export async function POST(req: Request) {
    try {
        const { identifier, password, rememberMe } = await req.json();
        const ip = req.headers.get("x-forwarded-for") || "unknown";

        if (!identifier || !password) {
            return NextResponse.json(
                { message: "Credentials required" },
                { status: 400 }
            );
        }

        // In-Memory Rate Limiting Logic (IP + Identifier)
        const attempt = getLoginAttempt(identifier, ip);

        if (attempt.locked) {
            return NextResponse.json(
                {
                    message: `Too many attempts. Try again in ${attempt.timeLeft} seconds.`,
                    timeLeft: attempt.timeLeft
                },
                { status: 429 }
            );
        }

        // Find Admin
        const admin = await prisma.admin.findFirst({
            where: {
                OR: [{ email: identifier }, { username: identifier }],
            },
        });

        // Timing Attack Protection: Always perform a bcrypt comparison
        const passwordToCompare = admin ? admin.password : "$2a$10$NotRealPasswordForTimingAttackOnlyJustSomeRandomHashToTakeTime";
        const isPasswordValid = await bcrypt.compare(password, passwordToCompare);

        if (!admin || !isPasswordValid) {
            const { locked, timeLeft } = recordFailedAttempt(identifier, ip);
            const message = locked ? `Too many attempts. Locked for ${timeLeft}s.` : "Invalid credentials";
            return NextResponse.json({ message, timeLeft: locked ? timeLeft : undefined }, { status: 401 });
        }

        // Success - Clear attempts and create session
        clearAttempts(identifier, ip);

        await createSession({
            id: admin.id,
            email: admin.email,
            username: admin.username,
            role: admin.role,
        }, rememberMe);

        return NextResponse.json({ message: "Login successful", role: admin.role });
    } catch (err) {
        console.error("Login Error:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
