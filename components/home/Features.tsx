"use client";

import { motion } from "framer-motion";
import { Code2, Layout, Database, Rocket, Layers, Smartphone, Sparkles, ShieldCheck, Globe, Zap } from "lucide-react";

const ICON_MAP: Record<string, any> = {
    Code2, Layout, Database, Rocket, Layers, Smartphone, Sparkles, ShieldCheck, Globe, Zap
};

export default function Features({ content }: { content: any }) {
    if (!content) return null;

    // Parse logic handling: API returns object if db driver handles json or string if not.
    // We handle both safely.
    let features: any[] = [];
    try {
        features = typeof content.featuresList === 'string'
            ? JSON.parse(content.featuresList)
            : content.featuresList || [];
    } catch (e) {
        console.error("Failed to parse features list", e);
    }

    return (
        <section id="features" className="py-24 bg-[#0a1226]/50">
            <div className="container mx-auto px-6 text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-blue-500 font-bold uppercase tracking-[0.2em] text-sm mb-4">{content.featuresSubtitle}</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-6">{content.featuresTitle}</h3>
                </motion.div>
            </div>

            <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, i) => {
                    const IconComponent = ICON_MAP[feature.icon] || Zap;

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group p-8 rounded-3xl bg-blue-950/20 border border-blue-900/30 hover:bg-blue-600/10 hover:border-blue-500/50 transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <IconComponent size={24} className="text-blue-500" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-4">{feature.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                {feature.desc}
                            </p>
                            <button className="text-blue-400 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all hover:text-blue-300">
                                Lihat selengkapnya <Code2 size={16} />
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
