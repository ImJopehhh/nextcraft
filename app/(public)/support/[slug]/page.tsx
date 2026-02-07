import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHero from "@/components/UI/Premium/PageHero";
import GlassContainer from "@/components/UI/Premium/GlassContainer";
import {
    HelpCircle,
    Shield,
    Zap,
    Activity,
    MessageSquare,
    Mail,
    Instagram,
    ChevronDown,
    Bug,
    ArrowRight,
    Ticket as TicketIcon,
    LifeBuoy
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SupportPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const page = await (prisma as any).pageContent.findUnique({
        where: { slug: `support-${slug}` }
    });

    if (!page) notFound();

    const content = page.content as any;

    return (
        <div className="min-h-screen pb-20">
            <PageHero
                badge={content.hero?.badge || "Support"}
                title={content.hero?.title || page.title}
                description={content.hero?.desc || page.description || ""}
            />

            <div className="container mx-auto px-6 max-w-5xl">
                {/* --- HELP HUB LAYOUT --- */}
                {slug === "help" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {content.sections?.map((section: any, i: number) => (
                            <GlassContainer key={i} className="p-8 text-center group cursor-pointer hover:border-blue-500/30 transition-all active:scale-95">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 w-fit mx-auto mb-6 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                                    {section.icon === "Activity" && <Activity size={40} className="text-blue-400" />}
                                    {section.icon === "Shield" && <Shield size={40} className="text-emerald-400" />}
                                    {section.icon === "Zap" && <Zap size={40} className="text-yellow-400" />}
                                    {!["Activity", "Shield", "Zap"].includes(section.icon) && <HelpCircle size={40} className="text-white/40" />}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{section.title}</h3>
                                <p className="text-white/30 text-sm leading-relaxed">{section.desc}</p>
                            </GlassContainer>
                        ))}
                    </div>
                )}

                {/* --- FAQ ACCORDION LAYOUT --- */}
                {slug === "faq" && (
                    <div className="max-w-3xl mx-auto space-y-4">
                        {content.faqs?.map((faq: any, i: number) => (
                            <GlassContainer key={i} className="overflow-hidden">
                                <details className="group">
                                    <summary className="p-6 flex justify-between items-center cursor-pointer list-none">
                                        <h3 className="font-bold text-white text-lg pr-4">{faq.q}</h3>
                                        <ChevronDown size={20} className="text-white/20 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="px-6 pb-6 pt-2 border-t border-white/5">
                                        <p className="text-white/50 leading-relaxed font-medium">{faq.a}</p>
                                    </div>
                                </details>
                            </GlassContainer>
                        ))}
                    </div>
                )}

                {/* --- REPORT BUG LAYOUT --- */}
                {slug === "report-bug" && (
                    <GlassContainer className="max-w-2xl mx-auto p-10">
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                            <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
                                <Bug size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Bug Report Form</h2>
                                <p className="text-white/30 text-sm">Bantu kami memperbaiki server NextCraft.</p>
                            </div>
                        </div>
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Category</label>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-red-500/50 transition-colors appearance-none">
                                        {content.form_info?.categories?.map((cat: string) => (
                                            <option key={cat} value={cat} className="bg-neutral-900">{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Urgency</label>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-red-500/50 transition-colors appearance-none">
                                        {content.form_info?.urgency?.map((urg: string) => (
                                            <option key={urg} value={urg} className="bg-neutral-900">{urg}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Description</label>
                                <textarea
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-red-500/50 transition-colors resize-none"
                                    placeholder="Jelaskan secara detail bug yang Anda temukan..."
                                />
                            </div>
                            <button type="button" className="w-full py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-600/10 active:scale-[0.98]">
                                Submit Bug Report
                            </button>
                        </form>
                    </GlassContainer>
                )}

                {/* --- TICKET LAYOUT --- */}
                {slug === "ticket" && (
                    <GlassContainer className="max-w-2xl mx-auto p-10">
                        <div className="text-center mb-10">
                            <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 w-fit mx-auto mb-6">
                                <TicketIcon size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">Open a Support Ticket</h2>
                            <p className="text-white/40">Tim staff kami akan merespon dalam waktu 1x24 jam.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {content.ticket_types?.map((type: string) => (
                                <button key={type} className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 text-left flex items-center justify-between transition-all">
                                    <span className="font-bold text-white/70 group-hover:text-blue-400 transition-colors">{type}</span>
                                    <ArrowRight size={18} className="text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                                </button>
                            ))}
                        </div>
                    </GlassContainer>
                )}

                {/* --- CONTACT LAYOUT --- */}
                {slug === "contact" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {content.channels?.map((channel: any, i: number) => (
                            <GlassContainer key={i} className="p-8 text-center group border-white/5 hover:border-blue-500/20 transition-all cursor-pointer">
                                <div className="p-5 rounded-2xl bg-white/5 mb-6 w-fit mx-auto group-hover:scale-110 transition-transform">
                                    {channel.name === "Discord" && <MessageSquare size={32} className="text-[#5865F2]" />}
                                    {channel.name === "Instagram" && <Instagram size={32} className="text-pink-500" />}
                                    {channel.name === "Email" && <Mail size={32} className="text-yellow-400" />}
                                </div>
                                <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{channel.type}</h4>
                                <h3 className="text-xl font-bold text-white mb-4">{channel.name}</h3>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono text-sm text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                                    {channel.identifier}
                                </div>
                            </GlassContainer>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
