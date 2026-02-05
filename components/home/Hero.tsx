"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { BcodeParser } from "@/lib/bcode";

export default function Hero({ content }: { content: any }) {
    if (!content) return null;

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animae-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/20 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 backdrop-blur-sm"
                >
                    <Sparkles size={16} />
                    <span>{content.heroBadge}</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tight"
                >
                    <BcodeParser text={content.heroTitle} />
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    <BcodeParser text={content.heroDescription} />
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button className="group relative px-8 py-4 bg-blue-600 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center gap-3 overflow-hidden">
                        <span className="relative z-10">{content.heroBtnPrimary}</span>
                        <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 rounded-2xl font-bold text-slate-300 transition-all border border-slate-700/50 backdrop-blur-sm">
                        {content.heroBtnSecondary}
                    </button>
                </motion.div>

                {/* Abstract shapes */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-20 relative max-w-5xl mx-auto"
                >
                    <div className="aspect-video rounded-3xl overflow-hidden border border-blue-900/30 bg-[#0a1226]/50 backdrop-blur-sm p-4 relative">
                        <div className="absolute inset-x-0 top-0 h-10 border-b border-blue-900/20 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                        <div className="mt-10 h-full w-full rounded-xl bg-gradient-to-br from-blue-950/40 to-indigo-950/40 flex items-center justify-center">
                            <div className="w-1/2 h-1/2 border-2 border-dashed border-blue-500/20 rounded-2xl flex items-center justify-center">
                                <span className="text-blue-900/30 font-bold uppercase tracking-widest text-4xl">Dashboard Preview</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
