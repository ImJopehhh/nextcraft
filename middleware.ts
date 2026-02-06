import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes, excluding /admin/login
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const session = request.cookies.get("session")?.value;

        if (!session) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        try {
            const secret = process.env.JWT_SECRET || "";
            if (!secret && process.env.NODE_ENV === "production") {
                console.error("JWT_SECRET missing in middleware"); // Fallback logger
                return NextResponse.redirect(new URL("/admin/login", request.url));
            }
            const key = new TextEncoder().encode(secret);

            // Verify the token signature
            await jwtVerify(session, key, {
                algorithms: ["HS256"],
            });

        } catch (error) {
            // Token invalid or expired
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    // Security Headers
    const response = NextResponse.next();
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
}

export const config = {
    matcher: ["/admin/:path*"],
};
