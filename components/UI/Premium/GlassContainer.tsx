"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassContainerProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function GlassContainer({ children, className = "", delay = 0 }: GlassContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={`relative bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-md overflow-hidden ${className}`}
        >
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
