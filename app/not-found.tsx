"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050b18] flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-600/5 rounded-full blur-[120px]" />

            <div className="text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="relative">
                        <h1 className="text-[12rem] md:text-[15rem] font-black text-white/5 leading-none select-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <AlertTriangle size={80} className="text-blue-500 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                >
                    Oops! Halaman Tidak Ditemukan
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-400 max-w-md mx-auto mb-10 text-lg"
                >
                    Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan ke area terlarang.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    >
                        <Home size={20} />
                        Kembali ke Beranda
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 px-8 py-4 rounded-2xl font-bold transition-all border border-slate-700/50 backdrop-blur-sm"
                    >
                        <ArrowLeft size={20} />
                        Halaman Sebelumnya
                    </button>
                </motion.div>
            </div>

            {/* Decorative grains */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] grayscale bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
        </div>
    );
}
