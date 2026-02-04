"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileSearch, ArrowLeft, Home } from "lucide-react";

export default function AdminNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#050b18]/40 border border-blue-900/10 p-12 rounded-[2.5rem] backdrop-blur-sm max-w-xl w-full shadow-2xl relative overflow-hidden"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600/5 blur-[60px] rounded-full" />

                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-600/20 mb-8 transform -rotate-6">
                    <FileSearch size={36} className="text-blue-500" />
                </div>

                <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
                    4<span className="text-blue-600">0</span>4
                </h1>

                <h2 className="text-xl font-bold text-white mb-2">Halaman Tidak Ditemukan</h2>
                <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">
                    Maaf, menu atau halaman yang Anda tuju di dalam Panel Admin <br />
                    tidak tersedia atau masih dalam pengembangan.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <Home size={18} />
                        KEMBALI KE DASHBOARD
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-6 py-3.5 rounded-2xl font-black text-sm transition-all border border-white/5 active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        KEMBALI KE SEBELUMNYA
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
