"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Lock, Home } from "lucide-react";
import Link from "next/link";

export default function AdminForbidden() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/5 border border-red-500/10 p-12 rounded-[2.5rem] backdrop-blur-xl max-w-lg"
            >
                <div className="relative inline-flex mb-8">
                    <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
                    <div className="relative w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <ShieldAlert size={48} className="text-red-500" />
                        <Lock size={20} className="absolute bottom-2 right-2 text-red-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-white mb-4">Akses Ditolak</h1>
                <p className="text-slate-400 leading-relaxed mb-10">
                    Rank akun Anda tidak memiliki izin yang cukup untuk mengakses halaman ini.
                    Silakan hubungi Webmaster jika Anda merasa ini adalah kesalahan.
                </p>

                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black transition-all hover:bg-slate-200 active:scale-95"
                >
                    <Home size={18} />
                    Kembali ke Beranda Admin
                </Link>
            </motion.div>
        </div>
    );
}
