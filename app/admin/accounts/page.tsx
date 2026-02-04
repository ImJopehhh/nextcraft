"use client";

import { motion } from "framer-motion";
import { Users, UserPlus, Search, Filter, MoreVertical, Shield } from "lucide-react";

export default function AccountsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Admin Accounts</h1>
                    <p className="text-slate-500 text-sm font-medium">Kelola akses dan peran administrator sistem.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm">
                    <UserPlus size={18} />
                    TAMBAH ADMIN
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#050b18]/40 border border-blue-900/10 p-6 rounded-[2rem] backdrop-blur-sm">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Total Admin</p>
                    <h3 className="text-3xl font-black text-white">1</h3>
                </div>
                <div className="bg-[#050b18]/40 border border-blue-900/10 p-6 rounded-[2rem] backdrop-blur-sm">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Webmaster</p>
                    <h3 className="text-3xl font-black text-blue-500">1</h3>
                </div>
                <div className="bg-[#050b18]/40 border border-blue-900/10 p-6 rounded-[2rem] backdrop-blur-sm">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Active Now</p>
                    <h3 className="text-3xl font-black text-green-500">1</h3>
                </div>
            </div>

            {/* Placeholder Table */}
            <div className="bg-[#050b18]/40 border border-blue-900/10 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl">
                <div className="p-6 border-b border-blue-900/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Cari admin..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Joined</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-900/10">
                            <tr className="hover:bg-white/5 transition-all group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600 p-0.5 shadow-lg shadow-blue-500/10">
                                            <img src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff" className="w-full h-full object-cover rounded-[10px]" alt="user" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">webmaster</p>
                                            <p className="text-xs font-medium text-slate-500">admin@web.next</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                                        <Shield size={12} />
                                        WEBMASTER
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="flex items-center gap-2 text-green-500 text-xs font-bold">
                                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                        Online
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-sm text-slate-400 font-medium">04 Feb 2026</td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
