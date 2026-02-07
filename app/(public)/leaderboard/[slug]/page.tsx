import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHero from "@/components/UI/Premium/PageHero";
import GlassContainer from "@/components/UI/Premium/GlassContainer";
import { Trophy, Medal, Star, Swords, Clock, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const page = await (prisma as any).pageContent.findUnique({
        where: { slug: `leaderboard-${slug}` }
    });

    if (!page) notFound();

    const content = page.content as any;

    const getIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'pvp kills': return <Swords size={20} className="text-red-400" />;
            case 'playtime': return <Clock size={20} className="text-blue-400" />;
            default: return <Star size={20} className="text-yellow-400" />;
        }
    };

    return (
        <div className="min-h-screen pb-20">
            <PageHero
                badge={content.hero?.badge || "Leaderboard"}
                title={content.hero?.title || page.title}
                description={content.hero?.desc || page.description || ""}
            />

            <div className="container mx-auto px-6 max-w-4xl">
                {/* Rankings Page Layout */}
                {slug === "top-players" && (
                    <GlassContainer className="overflow-hidden border-white/5">
                        <div className="grid grid-cols-1 divide-y divide-white/5">
                            {content.rankings?.map((entry: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 flex items-center justify-center relative">
                                            {i === 0 && <Trophy className="absolute -top-3 -left-3 text-yellow-400 -rotate-12" size={24} />}
                                            <span className={`text-2xl font-black ${i === 0 ? 'text-yellow-400' :
                                                    i === 1 ? 'text-gray-400' :
                                                        i === 2 ? 'text-amber-600' : 'text-white/20'
                                                }`}>
                                                {i + 1}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                                                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 opacity-50" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-lg">{entry.name}</h4>
                                                <div className="flex items-center gap-2 text-white/30 text-xs uppercase font-bold tracking-widest mt-1">
                                                    {getIcon(entry.category)}
                                                    {entry.category}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-mono font-black text-white group-hover:text-blue-400 transition-colors">{entry.stat}</p>
                                        <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Current Score</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassContainer>
                )}

                {/* Empty State / Coming Soon */}
                {!content.rankings && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/20">
                            <Star size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Leaderboard Sedang Disiapkan</h3>
                        <p className="text-white/40">Statistik in-game sedang disinkronisasi. Mohon tunggu beberapa saat.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
