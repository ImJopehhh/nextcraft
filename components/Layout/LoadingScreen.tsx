"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// Keep track of loading state at the module level (persists as long as the page isn't hard-reloaded)
export default function LoadingScreen() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Check if we've already shown the loading screen in this session
        const hasShownInSession = sessionStorage.getItem("nextcraft_loaded");

        if (hasShownInSession) {
            setLoading(false);
            return;
        }

        // If not shown, start the loading animation
        setLoading(true);

        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        setLoading(false);
                        try {
                            sessionStorage.setItem("nextcraft_loaded", "true");
                        } catch (e) {
                            // Fallback if sessionStorage is full or unavailable
                        }
                    }, 400);
                    return 100;
                }
                const diff = Math.random() * 10; // Varied increment
                return Math.min(oldProgress + diff, 100);
            });
        }, 50);

        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050b18]"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative flex flex-col items-center"
                    >
                        {/* Logo placeholder - replace with actual logo */}
                        <div className="mb-8 flex items-center gap-4">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="relative h-20 w-20 overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.3)] border border-blue-500/20"
                            >
                                <img
                                    src="/assets/nextcraftlogo.jpg"
                                    alt="NextCraft Logo"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                            <h1 className="text-5xl font-black tracking-tighter text-white">
                                NEXT<span className="text-blue-500">CRAFT</span>
                            </h1>
                        </div>

                        <div className="w-64">
                            <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-widest text-blue-400/60">
                                <span>Initializing</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-900/20 backdrop-blur-sm">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                                />
                            </div>
                        </div>

                        <motion.p
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mt-6 text-sm italic text-slate-500"
                        >
                            Crafting your experience...
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
