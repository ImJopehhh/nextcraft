import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const settings: any[] = await prisma.$queryRaw`SELECT * FROM GlobalSettings LIMIT 1`;
        return NextResponse.json(settings[0] || null);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}
