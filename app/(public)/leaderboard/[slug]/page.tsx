import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHero from "@/components/UI/Premium/PageHero";
import GlassContainer from "@/components/UI/Premium/GlassContainer";
import { Trophy, Medal, Star, Target, Crown, Calendar, ChevronRight, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const page = await (prisma as any).pageContent.findUnique({
        where: { slug: `leaderboard-${slug}` }
    });

    if (!page) notFound();

    const content = page.content as any;

    return (
        <div className="min-h-screen pb-20">
            <PageHero
                badge={content.hero?.badge || "Leaderboard"}
                title={content.hero?.title || page.title}
                description={content.hero?.desc || page.description || ""}
            />

            <div className="container mx-auto px-6 max-w-5xl">
                {/* --- TOP PLAYERS LAYOUT --- */}
                {slug === "top-players" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <Crown className="text-yellow-400" />
                                All-Time Legends
                            </h2>
                            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest">
                                Last Update: Just Now
                            </div>
                        </div>
                        {content.rankings?.map((rank: any, i: number) => (
                            <GlassContainer key={i} className="p-6 flex items-center justify-between group hover:border-yellow-500/30 transition-all cursor-pointer">
                                <div className="flex items-center gap-8">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all ${i === 0 ? "bg-yellow-500/20 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]" :
                                            i === 1 ? "bg-slate-300/20 text-slate-300" :
                                                i === 2 ? "bg-amber-700/20 text-amber-700" : "bg-white/5 text-white/20"
                                        }`}>
                                        {i === 0 ? <Trophy size={24} /> : i + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors uppercase tracking-tight">{rank.name}</h3>
                                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{rank.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-white group-hover:scale-110 transition-transform origin-right">{rank.stat}</div>
                                    <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">+2.4% vs last week</div>
                                </div>
                            </GlassContainer>
                        ))}
                    </div>
                )}

                {/* --- MONTHLY RANKINGS LAYOUT --- */}
                {slug === "monthly" && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                            {content.months?.map((m: string, i: number) => (
                                <button key={i} className={`px-6 py-2 rounded-xl font-bold whitespace-nowrap transition-all border ${i === 0 ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                                    }`}>
                                    {m}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {content.data?.map((item: any, i: number) => (
                                <GlassContainer key={i} className="p-8 group hover:bg-gradient-to-br from-blue-600/5 to-transparent transition-all">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                            <Calendar size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">{item.category}</h3>
                                    </div>
                                    <div className="flex items-end justify-between border-t border-white/5 pt-6">
                                        <div>
                                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Top Performer</p>
                                            <p className="text-lg font-black text-white">{item.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-blue-400">{item.stat}</p>
                                        </div>
                                    </div>
                                </GlassContainer>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- HALL OF FAME LAYOUT --- */}
                {slug === "hall-of-fame" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {content.legends?.map((legend: any, i: number) => (
                            <GlassContainer key={i} className="p-1 max-w-md mx-auto relative group overflow-hidden rounded-[2rem]">
                                <div className="absolute inset-x-0 -top-24 h-48 bg-600/20 blur-[100px] group-hover:bg-blue-500/30 transition-all" />
                                <div className="p-10 bg-[#0a0a0a] rounded-[1.8rem] relative z-10 border border-white/5">
                                    <div className="mb-8 relative w-fit mx-auto">
                                        <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-1 relative">
                                            <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center">
                                                <Star size={40} className="text-blue-400 group-hover:rotate-12 transition-transform" />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-lg p-1.5 shadow-lg">
                                            <Medal size={20} className="text-black" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-3xl font-black text-white tracking-tighter mb-1 uppercase">{legend.name}</h3>
                                        <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.3em] mb-6">{legend.role}</p>
                                        <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                            Inducted Year {legend.year}
                                        </div>
                                    </div>
                                </div>
                            </GlassContainer>
                        ))}
                    </div>
                )}

                {/* --- ACHIEVEMENTS LAYOUT --- */}
                {slug === "achievements" && (
                    <div className="space-y-6">
                        {content.milestones?.map((m: any, i: number) => (
                            <GlassContainer key={i} className="p-8 flex flex-col md:flex-row gap-8 items-center border-white/5 hover:border-emerald-500/30 transition-all">
                                <div className={`p-5 rounded-2xl ${m.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/20'}`}>
                                    <Award size={40} />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{m.title}</h3>
                                        {m.status === 'Completed' ? (
                                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase flex items-center gap-1">
                                                <Star size={10} fill="currentColor" /> {m.status}
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">
                                                {m.status}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-4">Target: Community Goal ({m.progress || '100%'})</p>

                                    {/* Progress Bar for Ongoing */}
                                    {m.progress && (
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-1000"
                                                style={{ width: m.progress }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-white/20 text-xs font-mono font-bold tracking-widest uppercase">{m.date}</div>
                                </div>
                            </GlassContainer>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
