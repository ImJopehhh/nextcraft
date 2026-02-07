"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
    badge: string;
    title: string;
    description: string;
}

const colorMap: Record<string, string> = {
    "&0": "text-[#000000]",
    "&1": "text-[#0000AA]",
    "&2": "text-[#00AA00]",
    "&3": "text-[#00AAAA]",
    "&4": "text-[#AA0000]",
    "&5": "text-[#AA00AA]",
    "&6": "text-[#FFAA00]",
    "&7": "text-[#AAAAAA]",
    "&8": "text-[#555555]",
    "&9": "text-[#5555FF]",
    "&a": "text-[#55FF55]",
    "&b": "text-[#55FFFF]",
    "&c": "text-[#FF5555]",
    "&d": "text-[#FF55FF]",
    "&e": "text-[#FFFF55]",
    "&f": "text-[#FFFFFF]",
};

const parseColors = (text: string) => {
    const parts = text.split(/(&[0-9a-f])/g);
    let currentColor = "text-white";

    return parts.map((part, i) => {
        if (colorMap[part]) {
            currentColor = colorMap[part];
            return null;
        }
        return (
            <span key={i} className={currentColor}>
                {part}
            </span>
        );
    }).filter(Boolean);
};

export default function PageHero({ badge, title, description }: PageHeroProps) {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-blue-600/5 blur-[150px] pointer-events-none -z-10" />

            <div className="absolute top-20 right-[15%] w-12 h-12 bg-white/[0.02] border border-white/5 rotate-12 backdrop-blur-sm hidden md:block" />
            <div className="absolute bottom-10 left-[10%] w-16 h-16 bg-blue-500/[0.02] border border-blue-500/5 -rotate-12 backdrop-blur-sm hidden md:block" />

            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70 mb-8 backdrop-blur-md"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest">{badge}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter drop-shadow-2xl"
                    >
                        {parseColors(title)}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        className="text-xl md:text-2xl text-white/50 leading-relaxed max-w-2xl mx-auto font-medium"
                    >
                        {description}
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
