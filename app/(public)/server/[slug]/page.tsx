import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHero from "@/components/UI/Premium/PageHero";
import GlassContainer from "@/components/UI/Premium/GlassContainer";
import StatusCard from "@/components/UI/Premium/StatusCard";
import { Server, Activity, HardDrive } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ServerPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const page = await (prisma as any).pageContent.findUnique({
        where: { slug: `server-${slug}` }
    });

    if (!page) notFound();

    const content = page.content as any;

    return (
        <div className="min-h-screen pb-20">
            <PageHero
                badge={content.hero?.badge || "NextCraft Server"}
                title={content.hero?.title || page.title}
                description={content.hero?.desc || page.description || ""}
            />

            <div className="container mx-auto px-6">
                {/* Status Page Layout */}
                {slug === "status" && (
                    <div className="space-y-12">
                        <GlassContainer className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                            {content.stats?.map((stat: any, i: number) => (
                                <StatusCard key={i} {...stat} />
                            ))}
                        </GlassContainer>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {content.nodes?.map((node: any, i: number) => (
                                <GlassContainer key={i} className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                                            {node.name.includes("Main") ? <Server className="text-blue-400" /> : <HardDrive className="text-white/40" />}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">{node.name}</h4>
                                            <p className="text-white/40 text-xs uppercase tracking-wider">{node.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-white/40 text-xs mb-1">Load</p>
                                            <p className="text-xl font-mono text-white">{node.load}</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                                            {node.status}
                                        </span>
                                    </div>
                                </GlassContainer>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rules Page Layout */}
                {slug === "rules" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {content.rules?.map((ruleSet: any, i: number) => (
                            <GlassContainer key={i} className="p-8 h-fit">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                    {ruleSet.category}
                                </h3>
                                <ul className="space-y-4">
                                    {ruleSet.items.map((item: string, j: number) => (
                                        <li key={j} className="flex gap-3 text-white/70 leading-relaxed group">
                                            <span className="text-blue-500/50 group-hover:text-blue-500 transition-colors mt-1">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </GlassContainer>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
