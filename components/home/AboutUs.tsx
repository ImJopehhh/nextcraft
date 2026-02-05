"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe } from "lucide-react";
import { BcodeParser } from "@/lib/bcode";

export default function AboutUs({ content }: { content: any }) {
    if (!content) return null;

    const stats = [
        { icon: <Zap className="text-blue-500" />, label: "Fast Performance", value: "99.9%" },
        { icon: <ShieldCheck className="text-blue-500" />, label: "Security First", value: "Enterprise" },
        { icon: <Globe className="text-blue-500" />, label: "Global Reach", value: "50+ Countries" },
    ];

    return (
        <section id="about" className="py-24 relative overflow-hidden bg-[#050b18]">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-blue-500 font-bold uppercase tracking-[0.2em] text-sm mb-4">{content.aboutSubtitle}</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                            <BcodeParser text={content.aboutTitle} />
                        </h3>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            <BcodeParser text={content.aboutDescription} />
                        </p>

                        <div className="grid sm:grid-cols-3 gap-6 mb-10">
                            {stats.map((stat, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-blue-900/10 border border-blue-900/20">
                                    <div className="mb-2">{stat.icon}</div>
                                    <div className="text-xl font-bold text-white">{stat.value}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <button className="px-8 py-3.5 rounded-xl border border-blue-500/30 text-blue-400 font-bold hover:bg-blue-500 hover:text-white transition-all">
                            Lihat selengkapnya
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden border border-blue-500/20 shadow-2xl shadow-blue-900/20">
                            <img
                                src={content.aboutImage}
                                alt="Our Team Working"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
