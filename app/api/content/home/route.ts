import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Use raw query to avoid Prisma Client sync issues in dev
        const data: any[] = await prisma.$queryRaw`SELECT * FROM HomePageContent LIMIT 1`;

        let content = data[0];

        if (!content) {
            // Return defaults if db is empty (though init script should handle this)
            content = {
                heroBadge: "The Future of Digital Excellence",
                heroTitle: "Elevate Your &bDigital Potential",
                heroDescription: "NextCraft delivers premium digital solutions with cutting-edge technology to fuel your growth and transform your vision into reality.",
                heroBtnPrimary: "Mulai Sekarang",
                heroBtnSecondary: "Pelajari Fitur",
                aboutSubtitle: "About NextCraft",
                aboutTitle: "Crafting Digital Solutions That &cMatter.",
                aboutDescription: "Di NextCraft, kami percaya bahwa setiap baris kode adalah peluang untuk berinovasi. Berdiri dengan visi untuk merevolusi ekosistem digital, kami menghadirkan perpaduan sempurna antara estetika desain premium dan ketangguhan sistem backend.",
                aboutImage: "https://images.unsplash.com/photo-1522071823991-b99c223030c9-b99c223030c9",
                featuresTitle: "Why Choose Us",
                featuresSubtitle: "Our Features",
                featuresList: '[{"icon": "Zap", "title": "Fast Performance", "desc": "Optimized for speed."}, {"icon": "ShieldCheck", "title": "Secure", "desc": "Enterprise-grade security."}, {"icon": "Globe", "title": "Scalable", "desc": "Ready to grow."}]',
                teamTitle: "Meet Our Team",
                teamSubtitle: "Expertise",
                teamList: '[{"name": "Alex Admin", "role": "CEO", "image": "https://i.pravatar.cc/150?u=a"}, {"name": "Sarah Dev", "role": "CTO", "image": "https://i.pravatar.cc/150?u=s"}]'
            };
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error("Error fetching home content:", error);
        return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const {
            heroBadge, heroTitle, heroDescription, heroBtnPrimary, heroBtnSecondary,
            aboutSubtitle, aboutTitle, aboutDescription, aboutImage,
            featuresTitle, featuresSubtitle, featuresList,
            teamTitle, teamSubtitle, teamList
        } = body;

        // Ensure JSON strings for lists if passed as objects (though form passes string, robust API handles both)
        // Raw SQL needs string for JSON column if using simple parameterization, or specific handling.
        // Prisma raw usually handles JSON if passed as object but let's be safe with string if column is JSON.
        // Actually for MySQL JSON column, we pass the value.

        let fList = featuresList;
        let tList = teamList;

        if (typeof featuresList === 'string') {
            try { JSON.parse(featuresList); } catch (e) { /* invalid json */ }
        } else {
            fList = JSON.stringify(featuresList);
        }

        if (typeof teamList === 'string') {
            try { JSON.parse(teamList); } catch (e) { /* invalid json */ }
        } else {
            tList = JSON.stringify(teamList);
        }


        // Upsert logic using Raw SQL
        // Check if exists
        const check: any[] = await prisma.$queryRaw`SELECT id FROM HomePageContent LIMIT 1`;

        if (check.length > 0) {
            await prisma.$executeRaw`
                UPDATE HomePageContent 
                SET heroBadge=${heroBadge}, 
                    heroTitle=${heroTitle}, 
                    heroDescription=${heroDescription}, 
                    heroBtnPrimary=${heroBtnPrimary}, 
                    heroBtnSecondary=${heroBtnSecondary},
                    aboutSubtitle=${aboutSubtitle},
                    aboutTitle=${aboutTitle},
                    aboutDescription=${aboutDescription},
                    aboutImage=${aboutImage},
                    featuresTitle=${featuresTitle},
                    featuresSubtitle=${featuresSubtitle},
                    featuresList=${fList},
                    teamTitle=${teamTitle},
                    teamSubtitle=${teamSubtitle},
                    teamList=${tList},
                    updatedAt=NOW()
                WHERE id=${check[0].id}
            `;
        } else {
            await prisma.$executeRaw`
                INSERT INTO HomePageContent (
                    heroBadge, heroTitle, heroDescription, heroBtnPrimary, heroBtnSecondary,
                    aboutSubtitle, aboutTitle, aboutDescription, aboutImage,
                    featuresTitle, featuresSubtitle, featuresList,
                    teamTitle, teamSubtitle, teamList,
                    updatedAt
                ) VALUES (
                    ${heroBadge}, ${heroTitle}, ${heroDescription}, ${heroBtnPrimary}, ${heroBtnSecondary},
                    ${aboutSubtitle}, ${aboutTitle}, ${aboutDescription}, ${aboutImage},
                    ${featuresTitle}, ${featuresSubtitle}, ${fList},
                    ${teamTitle}, ${teamSubtitle}, ${tList},
                    NOW()
                )
            `;
        }

        return NextResponse.json({ message: "Content updated successfully" });
    } catch (error) {
        console.error("Error updating home content:", error);
        return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
    }
}
