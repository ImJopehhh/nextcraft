import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHero from "@/components/UI/Premium/PageHero";
import GlassContainer from "@/components/UI/Premium/GlassContainer";
import { Calendar, Users, Camera, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CommunityPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const page = await (prisma as any).pageContent.findUnique({
        where: { slug: `community-${slug}` }
    });

    if (!page) notFound();

    const content = page.content as any;

    return (
        <div className="min-h-screen pb-20">
            <PageHero
                badge={content.hero?.badge || "Community"}
                title={content.hero?.title || page.title}
                description={content.hero?.desc || page.description || ""}
            />

            <div className="container mx-auto px-6 max-w-5xl">
                {/* Events Page Layout */}
                {slug === "events" && (
                    <div className="space-y-8">
                        {content.events?.map((event: any, i: number) => (
                            <GlassContainer key={i} className="p-8 flex flex-col md:flex-row gap-8 items-center bg-gradient-to-r from-blue-600/5 to-transparent">
                                <div className="p-6 rounded-3xl bg-blue-600/10 text-blue-400">
                                    <Calendar size={48} />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-3">
                                        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest">Upcoming</span>
                                        <span className="text-white/40 text-xs flex items-center gap-2"><Calendar size={14} /> {event.date}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                                    <p className="text-white/50 mb-6">Hadiah Utama: <span className="text-emerald-400 font-bold">{event.prize}</span></p>
                                    <button className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                                        Lihat Detail Event
                                    </button>
                                </div>
                            </GlassContainer>
                        ))}
                    </div>
                )}

                {/* Generic Community Grid */}
                {!content.events && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <GlassContainer className="p-8 text-center group cursor-pointer hover:border-blue-500/30 transition-all">
                            <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <MessageSquare size={32} />
                            </div>
                            <h4 className="text-white font-bold mb-2">Discord Server</h4>
                            <p className="text-white/40 text-sm">Bergabunglah dengan 5.000+ member lainnya.</p>
                        </GlassContainer>

                        <GlassContainer className="p-8 text-center group cursor-pointer hover:border-emerald-500/30 transition-all">
                            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Camera size={32} />
                            </div>
                            <h4 className="text-white font-bold mb-2">Gallery</h4>
                            <p className="text-white/40 text-sm">Lihat screenshot momen terbaik di server.</p>
                        </GlassContainer>

                        <GlassContainer className="p-8 text-center group cursor-pointer hover:border-purple-500/30 transition-all">
                            <div className="p-4 rounded-full bg-purple-500/10 text-purple-400 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Users size={32} />
                            </div>
                            <h4 className="text-white font-bold mb-2">Staff Team</h4>
                            <p className="text-white/40 text-sm">Kenali tim yang mengelola NextCraft.</p>
                        </GlassContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
