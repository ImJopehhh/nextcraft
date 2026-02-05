import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

// Server Component
export default async function Home() {
  let content;
  try {
    const data: any[] = await prisma.$queryRaw`SELECT * FROM HomePageContent LIMIT 1`;
    content = data[0];
  } catch (e) {
    // Fallback if DB not ready or empty
    content = {
      heroBadge: "The Future of Digital Excellence",
      heroTitle: "Elevate Your &bDigital Potential",
      heroDescription: "NextCraft delivers premium digital solutions with cutting-edge technology to fuel your growth and transform your vision into reality.",
      heroBtnPrimary: "Mulai Sekarang",
      heroBtnSecondary: "Pelajari Fitur",
      aboutSubtitle: "About NextCraft",
      aboutTitle: "Crafting Digital Solutions That &cMatter.",
      aboutDescription: "Di NextCraft, kami percaya bahwa setiap baris kode adalah peluang untuk berinovasi. Berdiri dengan visi untuk merevolusi ekosistem digital, kami menghadirkan perpaduan sempurna antara estetika desain premium dan ketangguhan sistem backend.",
      aboutImage: "https://images.unsplash.com/photo-1522071823991-b99c223030c9"
    };
  }

  return <HomeClient content={content} />;
}
