import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET;
const key = new TextEncoder().encode(SECRET_KEY);

if (!SECRET_KEY && process.env.NODE_ENV === "production") {
    throw new Error("FATAL: JWT_SECRET is not defined in production environment.");
}

export type JWTPayload = {
    id: string;
    email: string;
    username: string;
    role: string;
    [key: string]: any;
};

export async function createSession(payload: JWTPayload, rememberMe: boolean = false) {
    const expirationTime = rememberMe ? "7d" : "1d";
    const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24;

    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expirationTime)
        .sign(key);

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: maxAge,
        path: "/",
    });
}

export async function getSession(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ["HS256"],
        });
        return payload as JWTPayload;
    } catch (err) {
        return null;
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}
