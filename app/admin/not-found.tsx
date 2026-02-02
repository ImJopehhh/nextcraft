"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function AdminNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                    <FileQuestion size={48} className="text-blue-500" />
                </div>

                <h1 className="text-4xl font-bold text-white tracking-tight">Halaman Tidak Ditemukan</h1>
                <p className="text-slate-400 max-w-md mx-auto">
                    Maaf, halaman yang Anda cari di dalam Admin Control Panel tidak tersedia atau telah dipindahkan.
                </p>

                <div className="flex justify-center pt-4">
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        Kembali ke Dashboard
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
