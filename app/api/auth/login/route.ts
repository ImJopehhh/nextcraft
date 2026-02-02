import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getLoginAttempt, recordFailedAttempt, clearAttempts } from "@/lib/security";

export async function POST(req: Request) {
    try {
        const { identifier, password, rememberMe } = await req.json();

        if (!identifier || !password) {
            return NextResponse.json(
                { message: "Credentials required" },
                { status: 400 }
            );
        }

        // In-Memory Rate Limiting Logic
        const attempt = getLoginAttempt(identifier);

        if (attempt.locked) {
            return NextResponse.json(
                { message: `Too many attempts. Try again in ${attempt.timeLeft} seconds.` },
                { status: 429 }
            );
        }

        // Find Admin
        const admin = await prisma.admin.findFirst({
            where: {
                OR: [{ email: identifier }, { username: identifier }],
            },
        });

        if (!admin) {
            recordFailedAttempt(identifier);
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Verify Password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            const { locked } = recordFailedAttempt(identifier);
            const message = locked ? "Too many attempts. Locked for 1 minute." : "Invalid credentials";
            return NextResponse.json({ message }, { status: 401 });
        }

        // Success - Clear attempts and create session
        clearAttempts(identifier);

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
