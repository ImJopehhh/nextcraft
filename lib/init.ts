import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { execSync } from "child_process";
import pkg from "../package.json";

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

const banner = `
\x1b[94m   _   _              _     \x1b[97m  _____              __  _   
\x1b[94m  | \\ | |            | |    \x1b[97m/ ____|             / _ | |  
\x1b[94m  |  \\| |  ___ __  __| |_   \x1b[97m| |     _ __  __ _  | |_| |_ 
\x1b[94m  | . \` | / _ \\\\ \\/ /| __|  \x1b[97m| |    | '__|/ _\` | |  _| __|
\x1b[94m  | |\\  ||  __/ >  < | |_   \x1b[97m| |____| |  | (_| | | | | |_ 
\x1b[94m  |_| \\_| \\___|/_/\\_\\ \\__|  \x1b[97m \\_____|_|   \\__,_| |_|  \\__|
\x1b[0m
\x1b[1;94mNext\x1b[97mCraft\x1b[0m \x1b[1;32mv${pkg.version} Activated!\x1b[0m
`;

export async function initializeDatabase() {
    console.log(banner);
    console.log("📡 Connecting to database...");

    try {
        // First, ensure all tables exist
        await ensureTablesExist();

        // Then check if we need to create default admin
        const adminCount = await prisma.admin.count();

        if (adminCount === 0) {
            console.log(" No admin found. Initializing default Webmaster...");

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

        // Initialize HomePage Content
        try {
            let tableExists = true;
            try {
                await prisma.$queryRaw`SELECT 1 FROM HomePageContent LIMIT 1`;
            } catch (e: any) {
                // MySQL error code 1146 means table doesn't exist
                if (e.message?.includes("1146") || e.code === "P2010" || e.message?.includes("doesn't exist")) {
                    tableExists = false;
                } else {
                    throw e;
                }
            }

            if (!tableExists) {
                console.log("🛠️ Table 'HomePageContent' missing. Creating via Raw SQL...");
                await prisma.$executeRawUnsafe(`
                    CREATE TABLE IF NOT EXISTS HomePageContent (
                        id INT PRIMARY KEY DEFAULT 1,
                        heroBadge VARCHAR(191) NOT NULL DEFAULT 'The Future of Digital Excellence',
                        heroTitle VARCHAR(191) NOT NULL DEFAULT 'Elevate Your &bDigital Potential',
                        heroDescription TEXT NOT NULL,
                        heroBtnPrimary VARCHAR(191) NOT NULL DEFAULT 'Mulai Sekarang',
                        heroBtnSecondary VARCHAR(191) NOT NULL DEFAULT 'Pelajari Fitur',
                        aboutSubtitle VARCHAR(191) NOT NULL DEFAULT 'About NextCraft',
                        aboutTitle VARCHAR(191) NOT NULL DEFAULT 'Crafting Digital Solutions That &cMatter.',
                        aboutDescription TEXT NOT NULL,
                        aboutImage VARCHAR(191) NOT NULL DEFAULT 'https://images.unsplash.com/photo-1522071823991-b99c223030c9',
                        featuresTitle VARCHAR(191) NOT NULL DEFAULT 'Why Choose Us',
                        featuresSubtitle VARCHAR(191) NOT NULL DEFAULT 'Our Features',
                        featuresList JSON NOT NULL,
                        teamTitle VARCHAR(191) NOT NULL DEFAULT 'Meet Our Team',
                        teamSubtitle VARCHAR(191) NOT NULL DEFAULT 'Expertise',
                        teamList JSON NOT NULL,
                        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
                    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
                `);
                console.log("✅ Table 'HomePageContent' created.");
            }

            const homeCheck: any[] = await prisma.$queryRaw`SELECT id FROM HomePageContent LIMIT 1`;
            if (homeCheck.length === 0) {
                console.log("🏠 Initializing default Home Page Content...");

                await prisma.$executeRaw`
                    INSERT INTO HomePageContent (
                        id, 
                        heroBadge, heroTitle, heroDescription, heroBtnPrimary, heroBtnSecondary,
                        aboutSubtitle, aboutTitle, aboutDescription, aboutImage,
                        featuresTitle, featuresSubtitle, featuresList,
                        teamTitle, teamSubtitle, teamList,
                        updatedAt
                    ) VALUES (
                        1, 
                        'The Future of Digital Excellence', 
                        'Elevate Your &bDigital Potential', 
                        'NextCraft delivers premium digital solutions with cutting-edge technology to fuel your growth and transform your vision into reality.',
                        'Mulai Sekarang', 'Pelajari Fitur',
                        'About NextCraft', 'Crafting Digital Solutions That &cMatter.', 
                        'Di NextCraft, kami percaya bahwa setiap baris kode adalah peluang untuk berinovasi. Berdiri dengan visi untuk merevolusi ekosistem digital, kami menghadirkan perpaduan sempurna antara estetika desain premium dan ketangguhan sistem backend.',
                        'https://images.unsplash.com/photo-1522071823991-b99c223030c9',
                        'Why Choose Us', 'Our Features',
                        '[{"icon": "Zap", "title": "Fast Performance", "desc": "Optimized for speed and efficiency."}, {"icon": "ShieldCheck", "title": "Secure", "desc": "Enterprise-grade security standards."}, {"icon": "Globe", "title": "Scalable", "desc": "Ready to grow with your business."}]',
                        'Meet Our Team', 'Expertise',
                        '[{"name": "Alex Admin", "role": "CEO", "image": "https://i.pravatar.cc/150?u=a"}, {"name": "Sarah Dev", "role": "CTO", "image": "https://i.pravatar.cc/150?u=s"}]',
                        NOW()
                    )
                `;
                console.log("✅ Home Page Content initialized.");
            }
        } catch (homeError) {
            console.error("⚠️ Home Page Content initialization failed:", homeError);
        }

        console.log("✅ Database ready");
    } catch (error) {
        console.error("❌ Database initialization failed:", error);
    }
}
