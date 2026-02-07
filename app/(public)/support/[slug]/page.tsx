import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHero from "@/components/UI/Premium/PageHero";
import GlassContainer from "@/components/UI/Premium/GlassContainer";
import { HelpCircle, ChevronRight, MessageSquare, Bug, Mail } from "lucide-react";

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
                badge={content.hero?.badge || "Support Center"}
                title={content.hero?.title || page.title}
                description={content.hero?.desc || page.description || ""}
            />

            <div className="container mx-auto px-6 max-w-4xl">
                {/* FAQ Page Layout */}
                {slug === "faq" && (
                    <div className="space-y-4">
                        {content.faqs?.map((faq: any, i: number) => (
                            <GlassContainer key={i} className="p-6">
                                <details className="group cursor-pointer">
                                    <summary className="list-none flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-white group-open:text-blue-400 transition-colors pr-8">
                                            {faq.q}
                                        </h3>
                                        <ChevronRight size={20} className="text-white/20 group-open:rotate-90 group-open:text-blue-400 transition-transform" />
                                    </summary>
                                    <div className="mt-4 pt-4 border-t border-white/5 text-white/50 leading-relaxed bg-white/[0.01] -mx-6 px-6 -mb-6 pb-6">
                                        {faq.a}
                                    </div>
                                </details>
                            </GlassContainer>
                        ))}
                    </div>
                )}

                {/* Generic Support Grid */}
                {!content.faqs && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GlassContainer className="p-8 text-center hover:bg-white/[0.05] transition-colors cursor-pointer group">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <MessageSquare className="text-blue-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Live Support</h3>
                            <p className="text-white/40 mb-6">Hubungi tim kami langsung</p>
                            <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors">
                                Mulai Chat
                            </button>
                        </GlassContainer>

                        <GlassContainer className="p-8 text-center hover:bg-white/[0.05] transition-colors cursor-pointer group">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Bug className="text-purple-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Report Bug</h3>
                            <p className="text-white/40 mb-6">Bantu kami berkembang</p>
                            <button className="w-full py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/10">
                                Kirim Laporan
                            </button>
                        </GlassContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
