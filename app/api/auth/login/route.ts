import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getLoginAttempt, recordFailedAttempt, clearAttempts, getClientIp } from "@/lib/security";
import { loginSchema } from "@/lib/schemas";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input with Zod
        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: "Data tidak valid", errors: validation.error.issues },
                { status: 400 }
            );
        }

        const { identifier, password, rememberMe } = validation.data;
        const ip = getClientIp(req);

        // Database-backed rate limiting
        const attempt = await getLoginAttempt(ip);

        if (attempt.locked) {
            return NextResponse.json(
                {
                    message: `Terlalu banyak percobaan login. Coba lagi dalam ${attempt.timeLeft} detik.`,
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
            const { locked, timeLeft } = await recordFailedAttempt(ip);
            const message = locked ? `Terlalu banyak percobaan. Terkunci selama ${timeLeft} detik.` : "Kredensial tidak valid";
            return NextResponse.json({ message, timeLeft: locked ? timeLeft : undefined }, { status: 401 });
        }

        // Success - Clear attempts and create session
        await clearAttempts(ip);

        await createSession({
            id: admin.id,
            email: admin.email,
            username: admin.username,
            role: admin.role,
        }, rememberMe || false);

        return NextResponse.json({ message: "Login berhasil", role: admin.role });
    } catch (err) {
        console.error("Login Error:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
