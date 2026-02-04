"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Globe, ImageIcon, Link as LinkIcon, Info } from "lucide-react";

export default function GlobalSettingsPage() {
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Global Settings</h1>
                    <p className="text-slate-500 text-sm font-medium">Konfigurasi dasar identitas website Anda.</p>
                </div>
                <button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm"
                    disabled={loading}
                >
                    <Save size={18} />
                    SIMPAN PERUBAHAN
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#050b18]/40 border border-blue-900/10 p-8 rounded-[2.5rem] backdrop-blur-sm space-y-8">
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                <Globe size={14} className="text-blue-500" />
                                NAMA WEBSITE
                            </label>
                            <input
                                type="text"
                                defaultValue="NextCraft"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-slate-700"
                                placeholder="Masukkan nama website"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                <LinkIcon size={14} className="text-blue-500" />
                                URL WEBSITE
                            </label>
                            <input
                                type="text"
                                defaultValue="http://localhost:3000"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-slate-700"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                <ImageIcon size={14} className="text-blue-500" />
                                LOGO WEBSITE (URL)
                            </label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    defaultValue="/assets/nextcraftlogo.jpg"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-slate-700"
                                    placeholder="/assets/logo.png"
                                />
                                <div className="h-14 w-14 rounded-2xl bg-blue-600/10 border border-blue-600/20 p-1 shrink-0 overflow-hidden">
                                    <img src="/assets/nextcraftlogo.jpg" className="w-full h-full object-cover rounded-xl" alt="Preview" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    <div className="bg-blue-600/10 border border-blue-600/20 p-8 rounded-[2.5rem] backdrop-blur-sm">
                        <div className="flex items-center gap-3 text-blue-500 mb-4">
                            <Info size={24} />
                            <h3 className="font-black tracking-tight">Informasi</h3>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            Pengaturan ini bersifat global dan akan mempengaruhi seluruh tampilan website, termasuk judul halaman dan logo di Navbar.
                        </p>
                        <div className="mt-8 pt-8 border-t border-blue-500/10">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Preview SEO</p>
                            <div className="bg-[#050b18] p-4 rounded-2xl border border-white/5">
                                <p className="text-blue-500 font-bold mb-1">NextCraft - Official Website</p>
                                <p className="text-green-600/80 text-[10px] mb-2">http://localhost:3000</p>
                                <div className="h-2 w-full bg-white/5 rounded-full mb-1" />
                                <div className="h-2 w-2/3 bg-white/5 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
