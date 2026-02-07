import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyCsrfToken } from "@/lib/security";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    try {
        const data: any[] = await prisma.$queryRaw`SELECT * FROM PageContent WHERE slug = ${slug} LIMIT 1`;

        if (data.length === 0) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        return NextResponse.json(data[0]);
    } catch (error) {
        console.error("Error fetching page content:", error);
        return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    try {
        if (!verifyCsrfToken(req)) {
            return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, content } = body;

        // Determine public path for revalidation
        // slug format is 'category-page', e.g., 'server-status'
        const parts = slug.split('-');
        const category = parts[0];
        const pageSlug = parts.slice(1).join('-');
        const publicPath = `/${category}/${pageSlug}`;

        await prisma.$executeRaw`
            UPDATE PageContent 
            SET title=${title}, 
                description=${description}, 
                content=${typeof content === 'string' ? content : JSON.stringify(content)},
                updatedAt=NOW()
            WHERE slug=${slug}
        `;

        revalidatePath(publicPath);

        return NextResponse.json({ message: "Page updated successfully" });
    } catch (error) {
        console.error("Error updating page content:", error);
        return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
    }
}
