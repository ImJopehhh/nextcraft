import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Generate a random secret on every server start to make sessions volatile
const VOLATILE_SECRET = process.env.NODE_ENV === "production"
    ? Math.random().toString(36).substring(2) + Date.now().toString(36)
    : "dev_volatile_secret_2026"; // Consistent in dev for hot-reloading stability

export type JWTPayload = {
    id: string;
    email: string;
    username: string;
    role: string;
};

export async function createSession(payload: JWTPayload, rememberMe: boolean = false) {
    const expiresIn = (rememberMe ? "7d" : "1d") as jwt.SignOptions["expiresIn"];
    const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24;

    const token = jwt.sign(payload, VOLATILE_SECRET, { expiresIn });

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
        return jwt.verify(token, VOLATILE_SECRET) as JWTPayload;
    } catch (err) {
        return null;
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}
