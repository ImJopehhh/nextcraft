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

        // Initialize Multi-Page Content (Server & Support)
        try {
            const pagesToSeed = [
                {
                    slug: "server-status",
                    title: "Status Server",
                    description: "Pantau status real-time infrastruktur NextCraft.",
                    content: {
                        hero: {
                            badge: "Real-time Monitoring",
                            title: "Server &bStatus",
                            desc: "Infrastruktur kami dipantau 24/7 untuk memastikan performa maksimal dan latensi rendah bagi seluruh pengguna.",
                        },
                        stats: [
                            { label: "Global Uptime", value: "99.9%", status: "healthy" },
                            { label: "Active Nodes", value: "12", status: "online" },
                            { label: "Latensi Rata-rata", value: "15ms", status: "good" }
                        ],
                        nodes: [
                            { name: "Node Java (Utama)", status: "Online", load: "12%", type: "High Performance" },
                            { name: "Node Database", status: "Online", load: "5%", type: "Ultra Secure" },
                            { name: "Node Storage", status: "Online", load: "28%", type: "Scalable" }
                        ]
                    }
                },
                {
                    slug: "server-rules",
                    title: "Peraturan Server",
                    description: "Panduan etika dan aturan bermain di ekosistem NextCraft.",
                    content: {
                        hero: {
                            badge: "Fair Play Policy",
                            title: "Server &cRules",
                            desc: "Kami menjunjung tinggi sportivitas dan rasa hormat. Pastikan Anda memahami aturan kami sebelum memulai perjalanan.",
                        },
                        rules: [
                            { category: "General", items: ["Respect all players", "No offensive language", "No spamming in chat"] },
                            { category: "Gameplay", items: ["No hacking or cheating", "No exploiting bugs", "Fair trade only"] },
                            { category: "Security", items: ["Keep your account safe", "Report suspicious activity", "No advertising other servers"] }
                        ]
                    }
                },
                {
                    slug: "support-faq",
                    title: "Pertanyaan Umum (FAQ)",
                    description: "Jawaban cepat untuk pertanyaan yang paling sering diajukan.",
                    content: {
                        hero: {
                            badge: "Knowledge Base",
                            title: "Frequently Asked &dQuestions",
                            desc: "Temukan solusi instan untuk kendala Anda melalui koleksi tanya jawab yang telah kami siapkan.",
                        },
                        faqs: [
                            { q: "Bagaimana cara bergabung ke server?", a: "Anda dapat melihat panduan lengkap di halaman Join Server. Pastikan versi client Anda sesuai." },
                            { q: "Lupa password akun?", a: "Gunakan fitur reset password di halaman login atau hubungi tim support kami melalui tiket." },
                            { q: "Apakah server ini gratis?", a: "Ya, kami menyediakan akses gratis dengan fitur opsional untuk mendukung pengembangan server." }
                        ]
                    }
                },
                {
                    slug: "server-stats",
                    title: "Statistik Server",
                    description: "Analisis mendalam performa dan populasi NextCraft.",
                    content: {
                        hero: {
                            badge: "Deep Analytics",
                            title: "Server &eStats",
                            desc: "Data tidak pernah berbohong. Lihat bagaimana komunitas kami tumbuh dan berkembang setiap harinya.",
                        },
                        charts: [
                            { label: "Pemain Unik", value: "12,450", growth: "+15%" },
                            { label: "Total Proyek", value: "892", growth: "+5%" },
                            { label: "Waktu Bermain Rata-rata", value: "4.5 jam/hari", growth: "+10%" }
                        ]
                    }
                },
                {
                    slug: "support-help",
                    title: "Help Center",
                    description: "Pusat bantuan dan panduan teknis NextCraft.",
                    content: {
                        hero: {
                            badge: "Support Hub",
                            title: "Help &aCenter",
                            desc: "Butuh bantuan? Tim ahli kami siap membantu Anda menyelesaikan setiap kendala teknis maupun non-teknis.",
                        },
                        categories: [
                            { title: "Mulai Bermain", icon: "Rocket", links: ["Instalasi Client", "Koneksi ke Server", "Membuat Akun"] },
                            { title: "Keamanan Akun", icon: "Shield", links: ["Ganti Password", "Two-Factor Auth", "Pemulihan Akun"] },
                            { title: "Donasi & Rank", icon: "Gem", links: ["Cara Donasi", "Benefit Rank", "Metode Pembayaran"] }
                        ]
                    }
                }
            ];

            for (const page of pagesToSeed) {
                const exists: any[] = await prisma.$queryRaw`SELECT id FROM PageContent WHERE slug = ${page.slug} LIMIT 1`;

                if (exists.length === 0) {
                    console.log(`📄 Seeding page: ${page.slug}...`);
                    await (prisma as any).pageContent.create({
                        data: page
                    });
                }
            }
        } catch (pageError) {
            console.error("⚠️ Multi-Page Content initialization failed:", pageError);
        }

        console.log("✅ Database ready");
    } catch (error) {
        console.error("❌ Database initialization failed:", error);
    }
}
