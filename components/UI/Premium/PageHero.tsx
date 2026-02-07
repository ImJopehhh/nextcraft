"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
    badge: string;
    title: string;
    description: string;
}

const colorMap: Record<string, string> = {
    "&b": "text-[#55FFFF]", // Cyan / Aqua
    "&c": "text-[#FF5555]", // Red
    "&d": "text-[#FF55FF]", // Pink / Magenta
    "&e": "text-[#FFFF55]", // Yellow
    "&a": "text-[#55FF55]", // Green
    "&9": "text-[#5555FF]", // Blue
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
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-500/10 blur-[120px] pointer-events-none -z-10" />

            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-white/70 mb-6"
                    >
                        {badge}
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
                    >
                        {parseColors(title)}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto"
                    >
                        {description}
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
