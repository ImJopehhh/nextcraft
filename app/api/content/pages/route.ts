import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyCsrfToken } from "@/lib/security";

export async function GET() {
    try {
        const pages: any[] = await prisma.$queryRaw`SELECT id, slug, title, updatedAt FROM PageContent ORDER BY slug ASC`;
        return NextResponse.json(pages);
    } catch (error) {
        console.error("Error fetching pages list:", error);
        return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
    }
}
