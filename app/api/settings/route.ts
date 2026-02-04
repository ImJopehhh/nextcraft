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

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { siteName, siteLogo, siteUrl } = body;

        // Use raw query to update to avoid type errors if client not generated
        await prisma.$executeRaw`
            UPDATE GlobalSettings 
            SET siteName=${siteName}, siteLogo=${siteLogo}, siteUrl=${siteUrl}, updatedAt=NOW()
            WHERE id=1
        `;

        return NextResponse.json({ message: "Settings updated" });
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
