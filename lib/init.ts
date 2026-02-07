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
                    title: "Status Network",
                    description: "Pantau ketersediaan node game NextCraft.",
                    content: {
                        hero: {
                            badge: "Network Monitoring",
                            title: "Server &bStatus",
                            desc: "Infrastruktur kami menggunakan optimasi latensi tinggi untuk menjamin pengalaman bermain tanpa lag di seluruh region Indonesia.",
                        },
                        stats: [
                            { label: "Network Uptime", value: "99.9%", status: "healthy" },
                            { label: "Pemain Online", value: "142/500", status: "online" },
                            { label: "Ping Rata-rata", value: "12ms", status: "good" }
                        ],
                        nodes: [
                            { name: "Survival Season 2", status: "Online", load: "18%", type: "SMP - 1.21.x" },
                            { name: "Skyblock Legacy", status: "Online", load: "42%", type: "Economy - 1.20.x" },
                            { name: "Lobby Utama", status: "Online", load: "5%", type: "Proxy Hub" }
                        ]
                    }
                },
                {
                    slug: "server-rules",
                    title: "Aturan Bermain",
                    description: "Konstitusi dan etika di komunitas NextCraft.",
                    content: {
                        hero: {
                            badge: "Fair Play Policy",
                            title: "Server &cRules",
                            desc: "Komunitas yang hebat berawal dari rasa saling menghargai. Baca dan patuhi aturan kami untuk menghindari sanksi in-game.",
                        },
                        rules: [
                            { category: "Umum", items: ["Hargai seluruh staf dan sesama pemain", "Dilarang rasisme, seksisme, atau pelecehan", "Dilarang spamming atau flood chat"] },
                            { category: "Gameplay", items: ["Dilarang keras menggunakan cheat/client hack", "Dilarang melakukan eksploitasi bug/glitch", "Griefing tanpa izin dilarang (Survival)"] },
                            { category: "Promosi", items: ["Dilarang mempromosikan server lain", "Dilarang melakukan transaksi RMT ilegal", "Gunakan channel yang sesuai untuk jual beli"] }
                        ]
                    }
                },
                {
                    slug: "server-join",
                    title: "Gabung Sekarang",
                    description: "Panduan cara masuk ke dunia NextCraft.",
                    content: {
                        hero: {
                            badge: "Instant Join",
                            title: "How to &aJoin",
                            desc: "Sudah siap memulai petualangan? Berikut adalah detail server yang Anda butuhkan untuk terhubung.",
                        },
                        connection: {
                            ip: "play.nextcraft.net",
                            version: "1.20.1 - 1.21.x (Java Edition)",
                            discord: "discord.gg/nextcraft"
                        },
                        steps: [
                            { title: "Buka Minecraft", desc: "Gunakan launcher pilihan Anda (Original direkomendasikan)." },
                            { title: "Add Server", desc: "Klik Multiplayer -> Add Server, masukkan IP play.nextcraft.net." },
                            { title: "Mulai Bermain!", desc: "Double-click server NextCraft di daftar server Anda." }
                        ]
                    }
                },
                {
                    slug: "support-faq",
                    title: "Pusat Jawaban",
                    description: "Jawaban instan untuk pertanyaan umum seputar Minecraft.",
                    content: {
                        hero: {
                            badge: "Knowledge Base",
                            title: "FAQ &dSupport",
                            desc: "Bingung cara klaim lahan atau cara upgrade rank? Semua jawabannya ada di sini.",
                        },
                        faqs: [
                            { q: "Server versi berapa?", a: "Server kami mendukung versi 1.20.1 hingga versi terbaru (Java Edition)." },
                            { q: "Bagaimana cara klaim lahan (GriefPrevention)?", a: "Gunakan Golden Shovel untuk menandai area. Ketik /claim untuk info lebih lanjut." },
                            { q: "Rank donasi itu permanen?", a: "Ya, seluruh rank donasi di NextCraft bersifat permanen kecuali ditentukan lain." }
                        ]
                    }
                },
                {
                    slug: "community-events",
                    title: "Event Komunitas",
                    description: "Jadwal dan detail turnamen in-game NextCraft.",
                    content: {
                        hero: {
                            badge: "Join the Fun",
                            title: "Server &6Events",
                            desc: "Dari PvP Tournament hingga Build Battle, jangan lewatkan kesempatan memenangkan hadiah eksklusif.",
                        },
                        events: [
                            { title: "PvP Duel Master", date: "Setiap Sabtu, 20:00 WIB", prize: "Rank VIP (30 Hari)" },
                            { title: "Build Battle Season 5", date: "Minggu Depan", prize: "1.000.000 In-game Coins" }
                        ]
                    }
                },
                {
                    slug: "leaderboard-top-players",
                    title: "Pemain Terbaik",
                    description: "Hall of Fame pemain paling aktif dan berprestasi.",
                    content: {
                        hero: {
                            badge: "Hall of Fame",
                            title: "Top &ePlayers",
                            desc: "Dedikasi dan keahlian tinggi. Inilah para pemain yang mendominasi dunia NextCraft.",
                        },
                        rankings: [
                            { name: "SkyLord_99", stat: "1.240 Jam", category: "Playtime" },
                            { name: "PvPMaster", stat: "450 Kills", category: "PvP Kills" },
                            { name: "Architect", stat: "Level 120", category: "Building Level" }
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
