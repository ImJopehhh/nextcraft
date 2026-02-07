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
        await prisma.$queryRaw`SELECT 1 FROM Admin LIMIT 1`;
    } catch (error) {
        const isDevelopment = process.env.NODE_ENV !== 'production';

        if (isDevelopment) {
            console.log("📦 Database tables not found. Auto-creating from schema...");

            try {
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
        await ensureTablesExist();

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

        try {
            let tableExists = true;
            try {
                await prisma.$queryRaw`SELECT 1 FROM HomePageContent LIMIT 1`;
            } catch (e: any) {
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

        try {
            const pagesToSeed = [
                {
                    slug: "server-status",
                    title: "Status Network",
                    description: "Pantau ketersediaan node game NextCraft.",
                    content: {
                        hero: { badge: "Network Monitoring", title: "Server &bStatus", desc: "Infrastruktur kami menggunakan optimasi latensi tinggi untuk pengalaman bermain tanpa lag." },
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
                        hero: { badge: "Fair Play Policy", title: "Server &cRules", desc: "Komunitas yang hebat berawal dari rasa saling menghargai. Baca dan patuhi aturan kami." },
                        rules: [
                            { category: "Umum", items: ["Hargai staf dan sesama pemain", "Dilarang rasisme/pelecehan", "Dilarang spamming/flood chat"] },
                            { category: "Gameplay", items: ["Dilarang cheat/hack client", "Dilarang eksploitasi bug/glitch", "Griefing dilarang di Survival"] }
                        ]
                    }
                },
                {
                    slug: "server-join",
                    title: "Gabung Sekarang",
                    description: "Panduan cara masuk ke dunia NextCraft.",
                    content: {
                        hero: { badge: "Instant Join", title: "How to &aJoin", desc: "Siap memulai petualangan? Gunakan detail di bawah untuk terhubung ke network kami." },
                        connection: { ip: "play.nextcraft.net", version: "1.20.1 - 1.21.x (Java Edition)", discord: "discord.gg/nextcraft" },
                        steps: [
                            { title: "Buka Minecraft", desc: "Gunakan launcher Original atau pilihan Anda." },
                            { title: "Add Server", desc: "Klik Multiplayer -> Add Server, gunakan IP play.nextcraft.net." },
                            { title: "Mulai Bermain!", desc: "Double-click NextCraft dan selamat bertualang!" }
                        ]
                    }
                },
                {
                    slug: "server-stats",
                    title: "Statistik Server",
                    description: "Analisis performa dan populasi global.",
                    content: {
                        hero: { badge: "Data Analytics", title: "Server &eStats", desc: "Transparansi data adalah prioritas kami. Lihat pertumbuhan komunitas NextCraft." },
                        stats: [
                            { label: "Total Pemain Unik", value: "12,452", status: "growing" },
                            { label: "Peak Online", value: "482", status: "active" },
                            { label: "Total Waktu Bermain", value: "85k Jam", status: "high" }
                        ]
                    }
                },
                {
                    slug: "community-forums",
                    title: "Forum Diskusi",
                    description: "Pusat diskusi strategi dan interaksi pemain.",
                    content: {
                        hero: { badge: "Discussion Hub", title: "Server &9Forums", desc: "Berbagi strategi, berdiskusi tentang update terbaru, atau sekadar menyapa pemain lain." },
                        threads: [
                            { title: "Guide: Cara Cepat Kaya di Skyblock", author: "RichPlayer", replies: 142, category: "Guides" },
                            { title: "Saran: Tambahkan Minigames Bedwars?", author: "Gamer99", replies: 85, category: "Suggestions" },
                            { title: "Open Recruitment Staff Helper", author: "Admin", replies: 210, category: "News" }
                        ]
                    }
                },
                {
                    slug: "community-events",
                    title: "Event Komunitas",
                    description: "Jadwal turnamen dan aktivitas seru in-game.",
                    content: {
                        hero: { badge: "Join the Fun", title: "Server &6Events", desc: "Menangkan hadiah eksklusif melalui berbagai turnamen dan tantangan mingguan." },
                        events: [
                            { title: "PvP Duel Master", date: "Sabtu, 20:00 WIB", prize: "Rank VIP (30 Hari)" },
                            { title: "Build Battle Season 5", date: "Minggu, 19:00 WIB", prize: "1jt In-game Coins" }
                        ]
                    }
                },
                {
                    slug: "community-gallery",
                    title: "Galeri Foto",
                    description: "Kumpulan momen terbaik dan karya pemain.",
                    content: {
                        hero: { badge: "Visual Showcase", title: "Server &dGallery", desc: "Abadikan dan pamerkan keindahan bangunan atau keseruan petualangan Anda." },
                        images: [
                            { title: "Pusat Kota Survival", user: "Architect", url: "#" },
                            { title: "Kemenangan PvP Tournament", user: "Warrior", url: "#" },
                            { title: "Skyblock Mega Base", user: "KingBlock", url: "#" }
                        ]
                    }
                },
                {
                    slug: "community-news",
                    title: "Berita & Update",
                    description: "Catatan perubahan dan pengumuman resmi.",
                    content: {
                        hero: { badge: "Stay Updated", title: "News &cUpdates", desc: "Jangan lewatkan info terbaru mengenai patch, reset season, dan fitur baru." },
                        updates: [
                            { title: "Patch Notes v2.1: New World Expansion", date: "07 Feb 2026", type: "Update" },
                            { title: "Reset Survival Season 2", date: "01 Feb 2026", type: "Announcement" },
                            { title: "New Anticheat Implementation", date: "25 Jan 2026", type: "Security" }
                        ]
                    }
                },
                {
                    slug: "support-help",
                    title: "Pusat Bantuan",
                    description: "Hub navigasi untuk segala jenis bantuan.",
                    content: {
                        hero: { badge: "Support Hub", title: "How can we &bhelp?", desc: "Pilih kategori bantuan di bawah untuk solusi cepat atau hubungi tim staf kami." },
                        sections: [
                            { title: "Masalah Teknis", desc: "Kendala lag, login, atau crash.", icon: "Activity" },
                            { title: "Donasi & Rank", desc: "Pertanyaan seputar pembelian dan rank.", icon: "Shield" },
                            { title: "Keamanan Akun", desc: "Password, 2FA, dan pemulihan akun.", icon: "Zap" }
                        ]
                    }
                },
                {
                    slug: "support-faq",
                    title: "Pusat Jawaban",
                    description: "Tanya jawab instan kendala umum.",
                    content: {
                        hero: { badge: "Knowledge Base", title: "FAQ &dSupport", desc: "Temukan jawaban instan untuk pertanyaan yang paling sering diajukan." },
                        faqs: [
                            { q: "Server versi berapa?", a: "Support Java Edition 1.20.1 hingga versi terbaru (Native 1.21)." },
                            { q: "Bagaimana cara donasi?", a: "Gunakan command /buy di in-game atau kunjungi web Store kami." },
                            { q: "Staff bisa membantu urusan in-game?", a: "Staff hanya membantu kendala teknis dan moderasi, bukan memberi item/uang." }
                        ]
                    }
                },
                {
                    slug: "support-report-bug",
                    title: "Lapor Bug",
                    description: "Bantu kami meningkatkan kualitas server.",
                    content: {
                        hero: { badge: "Bug Hunter", title: "Report &cBug", desc: "Menemukan keanehan atau error? Laporkan di sini untuk mendapat reward in-game." },
                        form_info: { urgency: ["Low", "Medium", "High", "Critical"], categories: ["Survival", "Skyblock", "Web", "Lobby", "Other"] }
                    }
                },
                {
                    slug: "support-ticket",
                    title: "Kirim Tiket",
                    description: "Bantuan personal dari tim staf.",
                    content: {
                        hero: { badge: "Private Channel", title: "Open &aTicket", desc: "Butuh bantuan mendalam? Buka tiket untuk berdiskusi langsung dengan tim kami." },
                        ticket_types: ["Account Recovery", "Payment Issue", "Staff Complaint", "Player Report", "General Help"]
                    }
                },
                {
                    slug: "support-contact",
                    title: "Hubungi Kami",
                    description: "Saluran komunikasi resmi NextCraft.",
                    content: {
                        hero: { badge: "Official Links", title: "Contact &9Us", desc: "Hubungi kami melalui berbagai platform media sosial resmi kami." },
                        channels: [
                            { name: "Discord", identifier: "discord.gg/nextcraft", type: "Instant" },
                            { name: "Instagram", identifier: "@nextcraft_official", type: "Social" },
                            { name: "Email", identifier: "support@nextcraft.net", type: "Professional" }
                        ]
                    }
                },
                {
                    slug: "leaderboard-top-players",
                    title: "Pemain Terbaik",
                    description: "Ranking global pemain paling aktif.",
                    content: {
                        hero: { badge: "Hall of Fame", title: "Top &ePlayers", desc: "Dedikasi tinggi melahirkan legenda. Berikut adalah pemain terbaik musim ini." },
                        rankings: [
                            { name: "SkyLord_99", stat: "1.240 Jam", category: "Playtime" },
                            { name: "PvPMaster", stat: "450 Kills", category: "PvP Kills" },
                            { name: "Architect", stat: "Level 120", category: "Building Level" }
                        ]
                    }
                },
                {
                    slug: "leaderboard-monthly",
                    title: "Ranking Bulanan",
                    description: "Prestasi terbaru pemain di bulan ini.",
                    content: {
                        hero: { badge: "Seasonal Grind", title: "Monthly &aRankings", desc: "Pantau persaingan di bulan ini untuk memenangkan hadiah akhir bulan." },
                        months: ["Februari 2026", "Januari 2026", "Desember 2025"],
                        data: [
                            { name: "RookieOfTheMonth", stat: "Level 42", category: "Survival Progress" },
                            { name: "Merchant", stat: "500jt Coins", category: "Economy" }
                        ]
                    }
                },
                {
                    slug: "leaderboard-hall-of-fame",
                    title: "Hall of Fame",
                    description: "Legenda abadi NextCraft Network.",
                    content: {
                        hero: { badge: "Eternal Legends", title: "Hall of &6Fame", desc: "Menghormati pemain yang telah memberikan kontribusi luar biasa bagi sejarah server." },
                        legends: [
                            { name: "FounderName", role: "Original Founder", year: "2023" },
                            { name: "MegaBuilder", role: "City of Light Architect", year: "2024" }
                        ]
                    }
                },
                {
                    slug: "leaderboard-achievements",
                    title: "Global Achievements",
                    description: "Pencapaian luar biasa komunitas.",
                    content: {
                        hero: { badge: "Global Milestones", title: "Global &dAchievements", desc: "Setiap langkah besar komunitas kami dirayakan di sini." },
                        milestones: [
                            { title: "First 10k Players", status: "Completed", date: "Jan 2025" },
                            { title: "Server 1 Year Anniversary", status: "Completed", date: "Feb 2025" },
                            { title: "World Limit Reached", status: "Ongoing", progress: "85%" }
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
