import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export async function initializeDatabase() {
    try {
        const adminCount = await prisma.admin.count();

        if (adminCount === 0) {
            console.log("🚀 No admin found. Initializing default Webmaster...");

            const email = process.env.INIT_ADMIN_EMAIL || "admin@web.next";
            const username = process.env.INIT_ADMIN_USERNAME || "webmaster";
            const password = process.env.INIT_ADMIN_PASSWORD || "admin123";

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
            console.log("📌 Database already has admin accounts. Skipping initialization.");
        }
    } catch (error) {
        console.error("❌ Database initialization failed:", error);
    }
}
