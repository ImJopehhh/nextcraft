import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { identifier, password } = await req.json();

        if (!identifier || !password) {
            return NextResponse.json(
                { message: "Credentials required" },
                { status: 400 }
            );
        }

        // Rate Limiting Logic
        const loginAttempt = await prisma.loginAttempt.findUnique({
            where: { identifier },
        });

        const now = new Date();

        if (loginAttempt && loginAttempt.lockUntil && loginAttempt.lockUntil > now) {
            const waitTime = Math.ceil((loginAttempt.lockUntil.getTime() - now.getTime()) / 60000);
            return NextResponse.json(
                { message: `Too many attempts. Try again in ${waitTime} minutes.` },
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
            return handleFailedAttempt(identifier, loginAttempt);
        }

        // Verify Password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return handleFailedAttempt(identifier, loginAttempt);
        }

        // Success - Clear attempts and create session
        if (loginAttempt) {
            await prisma.loginAttempt.update({
                where: { identifier },
                data: { count: 0, lockUntil: null },
            });
        }

        await createSession({
            id: admin.id,
            email: admin.email,
            username: admin.username,
            role: admin.role,
        });

        return NextResponse.json({ message: "Login successful", role: admin.role });
    } catch (err) {
        console.error("Login Error:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

async function handleFailedAttempt(identifier: string, attempt: any) {
    const now = new Date();
    const nextCount = (attempt?.count || 0) + 1;
    let lockUntil = null;

    if (nextCount >= 3) {
        lockUntil = new Date(now.getTime() + 3 * 60 * 1000); // 3 minutes lockout
    }

    await prisma.loginAttempt.upsert({
        where: { identifier },
        update: {
            count: nextCount,
            lastAttempt: now,
            lockUntil,
        },
        create: {
            identifier,
            count: 1,
            lastAttempt: now,
            lockUntil: null,
        },
    });

    return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
    );
}
