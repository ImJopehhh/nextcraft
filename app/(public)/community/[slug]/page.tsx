import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHero from "@/components/UI/Premium/PageHero";
import GlassContainer from "@/components/UI/Premium/GlassContainer";
import { Calendar, Users, Camera, MessageSquare, Newspaper, ArrowRight, TrendingUp } from "lucide-react";

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

            <div className="container mx-auto px-6 max-w-6xl">
                {/* --- FORUMS LAYOUT --- */}
                {slug === "forums" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <TrendingUp className="text-blue-500" />
                                Trending Discussions
                            </h2>
                            <button className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                                Visit Full Forum
                            </button>
                        </div>
                        {content.threads?.map((thread: any, i: number) => (
                            <GlassContainer key={i} className="p-6 flex items-center gap-6 hover:bg-white/[0.03] transition-all cursor-pointer group border-white/5 hover:border-blue-500/30">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-blue-500/50 transition-colors">
                                    <MessageSquare size={24} className="text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest">{thread.category}</span>
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{thread.title}</h3>
                                    </div>
                                    <p className="text-white/30 text-sm">Posted by <span className="text-white/60 font-medium">{thread.author}</span> • {thread.replies} replies</p>
                                </div>
                                <ArrowRight size={20} className="text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                            </GlassContainer>
                        ))}
                    </div>
                )}

                {/* --- EVENTS LAYOUT --- */}
                {slug === "events" && (
                    <div className="space-y-8 max-w-5xl mx-auto">
                        {content.events?.map((event: any, i: number) => (
                            <GlassContainer key={i} className="p-8 flex flex-col md:flex-row gap-8 items-center bg-gradient-to-r from-blue-600/5 to-transparent hover:border-blue-500/20 transition-all">
                                <div className="p-6 rounded-3xl bg-blue-600/10 text-blue-400 shadow-inner">
                                    <Calendar size={48} />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-3">
                                        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest">Upcoming</span>
                                        <span className="text-white/40 text-xs flex items-center gap-2 font-mono"><Calendar size={14} /> {event.date}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                                    <p className="text-white/50 mb-6 font-medium">Hadiah Utama: <span className="text-emerald-400 font-black">{event.prize}</span></p>
                                    <button className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all active:scale-95">
                                        Lihat Detail Event
                                    </button>
                                </div>
                            </GlassContainer>
                        ))}
                    </div>
                )}

                {/* --- GALLERY LAYOUT --- */}
                {slug === "gallery" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {content.images?.map((img: any, i: number) => (
                            <GlassContainer key={i} className="overflow-hidden group p-2 pb-6 border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                                <div className="aspect-video bg-white/5 rounded-2xl mb-6 relative overflow-hidden shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-40 group-hover:opacity-60 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Camera size={40} className="text-white/10 group-hover:scale-125 transition-transform duration-700 ease-out" />
                                    </div>
                                </div>
                                <div className="px-4">
                                    <h4 className="text-white font-bold text-lg mb-1 group-hover:text-purple-400 transition-colors">{img.title}</h4>
                                    <p className="text-white/30 text-sm italic font-medium">Captured by {img.user}</p>
                                </div>
                            </GlassContainer>
                        ))}
                    </div>
                )}

                {/* --- NEWS LAYOUT --- */}
                {slug === "news" && (
                    <div className="max-w-4xl mx-auto">
                        <div className="relative border-l border-white/5 pl-10 space-y-16 py-4">
                            {content.updates?.map((update: any, i: number) => (
                                <div key={i} className="relative group">
                                    <div className={`absolute -left-[51px] top-6 w-5 h-5 rounded-full border-4 border-[#0a0a0a] transition-all group-hover:scale-125 ${update.type === 'Update' ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' :
                                            update.type === 'Security' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                        }`} />
                                    <div className="mb-4 flex items-center gap-4">
                                        <span className="text-white/20 text-xs font-mono font-bold tracking-widest uppercase">{update.date}</span>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${update.type === 'Update' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                update.type === 'Security' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                            }`}>{update.type}</span>
                                    </div>
                                    <GlassContainer className="p-10 hover:border-white/10 transition-all border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                                        <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{update.title}</h3>
                                        <p className="text-white/40 text-base leading-relaxed mb-8 font-medium">Kami baru saja mengimplementasikan serangkaian optimasi performa inti untuk meningkatkan FPS dan mengurangi latency koneksi di seluruh network NextCraft.</p>
                                        <button className="flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors px-6 py-2 rounded-xl bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30">
                                            Read Complete Changelog <ArrowRight size={18} />
                                        </button>
                                    </GlassContainer>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
