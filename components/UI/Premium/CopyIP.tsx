"use client";

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CopyIPProps {
    ip: string;
}

export default function CopyIP({ ip }: CopyIPProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(ip);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group max-w-md mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

            <button
                onClick={handleCopy}
                className="relative w-full flex items-center justify-between gap-4 p-5 bg-[#0a0a0a] border border-white/10 rounded-2xl transition-all active:scale-95"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-blue-500/50 transition-colors">
                        <Terminal size={24} className="text-blue-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Server Address</p>
                        <p className="text-xl font-mono font-bold text-white tracking-tight">{ip}</p>
                    </div>
                </div>

                <div className="flex items-center justify-center p-3">
                    <AnimatePresence mode="wait">
                        {copied ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                            >
                                <Check size={28} className="text-emerald-400" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="copy"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                            >
                                <Copy size={24} className="text-white/20 group-hover:text-white transition-colors" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </button>

            <AnimatePresence>
                {copied && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-emerald-400 font-bold text-xs uppercase tracking-widest"
                    >
                        IP Copied to Clipboard!
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
