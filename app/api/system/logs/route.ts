import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const logs: any[] = await prisma.$queryRaw`
            SELECT * FROM LoginLog 
            ORDER BY createdAt DESC 
            LIMIT 100
        `;

        return NextResponse.json(logs);
    } catch (error) {
        console.error("Error fetching login logs:", error);
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}
