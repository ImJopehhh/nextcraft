import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes, excluding /admin/login
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        // Try to get session using the helper
        // Note: getSession needs a way to access cookies which it does via next/headers
        // However, in edge middleware, next/headers works differently.
        // Let's manually check the cookie for simplicity in middleware.
        const session = request.cookies.get("session")?.value;

        if (!session) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
