import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { execSync } from "child_process";

/**
 * Ensures all database tables exist.
 * In development: auto-creates tables from schema
 * In production: throws error with helpful message
 */
async function ensureTablesExist() {
    try {
        // Try to query Admin table to check if it exists
        await prisma.$queryRaw`SELECT 1 FROM Admin LIMIT 1`;
    } catch (error) {
        const isDevelopment = process.env.NODE_ENV !== 'production';

        if (isDevelopment) {
            console.log("📦 Database tables not found. Auto-creating from schema...");

            try {
                // Use Prisma db push to sync schema without migrations
                execSync('npx prisma db push --accept-data-loss --skip-generate', {
                    stdio: 'inherit',
                    cwd: process.cwd()
                });

                console.log("✅ Database schema synchronized successfully!");
            } catch (pushError) {
                console.error("❌ Failed to create database tables:", pushError);
                throw pushError;
            }
        } else {
            console.error("❌ Database tables not found!");
            console.error("📋 Please run: npx prisma migrate deploy");
            throw new Error("Database not initialized. Run migrations first.");
        }
    }
}

export async function initializeDatabase() {
    try {
        // First, ensure all tables exist
        await ensureTablesExist();

        // Then check if we need to create default admin
        const adminCount = await prisma.admin.count();

        if (adminCount === 0) {
            console.log("🚀 No admin found. Initializing default Webmaster...");

            const email = "admin@next.craft";
            const username = "webmaster";
            const password = "admin123";

            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.admin.create({
                data: {
                    email,
                    username,
                    password: hashedPassword,
                    role: "WEBMASTER",
                },
            });

            console.log(`✅ Default Webmaster created: ${username} (${email})`);
        } else {
            console.log("📌 Database already has admin accounts. Skipping admin initialization.");
        }

        // Initialize Global Settings using raw query to bypass type errors if client not regenerated
        try {
            const settingsCheck: any[] = await prisma.$queryRaw`SELECT id FROM GlobalSettings LIMIT 1`;
            if (settingsCheck.length === 0) {
                console.log("🛠️ Initializing default Global Settings (Raw)...");
                const siteName = "NextCraft";
                const siteLogo = "/assets/nextcraftlogo.jpg";
                const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

                await prisma.$executeRaw`
                    INSERT INTO GlobalSettings (id, siteName, siteLogo, siteUrl, updatedAt) 
                    VALUES (1, ${siteName}, ${siteLogo}, ${siteUrl}, NOW())
                `;
                console.log("✅ Global Settings initialized.");
            }
        } catch (settingsError) {
            console.error("⚠️ Global Settings initialization check failed:", settingsError);
        }
    } catch (error) {
        console.error("❌ Database initialization failed:", error);
    }
}
