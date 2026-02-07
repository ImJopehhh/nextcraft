"use client";

import { useEffect, useState } from "react";
import {
    Clock,
    User,
    Network,
    ShieldCheck,
    Search,
    RefreshCcw,
    Calendar
} from "lucide-react";
import GlassContainer from "@/components/UI/Premium/GlassContainer";
import { motion } from "framer-motion";

export default function SystemLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchLogs = () => {
        setLoading(true);
        fetch("/api/system/logs")
            .then(res => res.json())
            .then(data => {
                setLogs(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ip.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <ShieldCheck className="text-blue-500" size={32} />
                        System Security Logs
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic text-sm">Monitoring and auditing administrator access events.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by user or IP..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-blue-950/20 border border-blue-900/20 rounded-2xl pl-12 pr-6 py-3 text-white outline-none focus:border-blue-500/50 transition-all w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={fetchLogs}
                        className="p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:shadow-blue-500/20"
                    >
                        <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            <GlassContainer className="p-0 border-white/5 bg-[#050b18]/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">Administrator</th>
                                <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">Network Address</th>
                                <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">Event Timestamp</th>
                                <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-8 py-6 bg-white/[0.01]" />
                                    </tr>
                                ))
                            ) : filteredLogs.length > 0 ? (
                                filteredLogs.map((log, i) => (
                                    <motion.tr
                                        key={log.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                                    <User size={16} className="text-blue-400" />
                                                </div>
                                                <span className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{log.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-black/20 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                                                <Network size={14} className="text-blue-500/50" />
                                                {log.ip}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                <Calendar size={14} className="text-slate-600" />
                                                {new Date(log.createdAt).toLocaleDateString()}
                                                <Clock size={14} className="ml-2 text-slate-600" />
                                                {new Date(log.createdAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">SUCCESSFUL LOGIN</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-slate-500 font-bold uppercase tracking-[0.2em] italic">
                                        No security logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassContainer>
        </div>
    );
}
