"use client";

import { motion } from "framer-motion";
import { Globe, CircleDot } from "lucide-react";

interface StatusCardProps {
    label: string;
    value: string;
    status: "healthy" | "online" | "good" | string;
}

const statusColors: Record<string, string> = {
    healthy: "text-green-400 bg-green-400/10",
    online: "text-blue-400 bg-blue-400/10",
    good: "text-emerald-400 bg-emerald-400/10",
};

export default function StatusCard({ label, value, status }: StatusCardProps) {
    const colorClass = statusColors[status] || "text-white/70 bg-white/5";

    return (
        <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className={`p-3 rounded-full mb-4 ${colorClass}`}>
                <Globe size={24} />
            </div>
            <h3 className="text-white/50 text-sm font-medium mb-1">{label}</h3>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <CircleDot size={12} className={colorClass.split(' ')[0]} />
                </motion.div>
            </div>
        </div>
    );
}
