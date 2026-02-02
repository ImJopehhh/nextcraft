"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Activity,
    Database,
    ShieldCheck,
    TrendingUp,
    Clock
} from "lucide-react";

export default function AdminOverview() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(data => setUser(data.user));
    }, []);

    const stats = [
        { label: "Admin Accounts", value: "3", icon: <Users size={20} className="text-blue-500" />, trend: "+0%" },
        { label: "MySQL Status", value: "Online", icon: <Database size={20} className="text-green-500" />, trend: "100%" },
        { label: "Total Visits", value: "1,284", icon: <Activity size={20} className="text-indigo-500" />, trend: "+12%" },
        { label: "Security Level", value: "High", icon: <ShieldCheck size={20} className="text-blue-400" />, trend: "Active" },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Welcome back, <span className="text-blue-500">{user?.username || "Admin"}</span>!
                    </h1>
                    <p className="text-slate-400 mt-1 flex items-center gap-2">
                        <Clock size={14} />
                        Sistem dalam keadaan optimal. Terakhir masuk: {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div className="px-4 py-2 rounded-xl bg-blue-900/10 border border-blue-900/20 text-blue-400 text-xs font-black uppercase tracking-widest self-start md:self-center">
                    Role: {user?.role || "WEBMASTER"}
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-blue-950/20 border border-blue-900/20 p-6 rounded-3xl hover:border-blue-500/30 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                <TrendingUp size={12} className="text-green-500" />
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Placeholder */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-blue-950/20 border border-blue-900/20 p-8 rounded-3xl h-96 flex flex-col items-center justify-center text-center">
                        <Activity size={48} className="text-blue-950 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Activity Monitor</h3>
                        <p className="text-slate-500 max-w-xs">Data aktivitas akan muncul secara real-time setelah database dikonfigurasi sepenuhnya.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-950/20 border border-blue-900/20 p-6 rounded-3xl">
                        <h3 className="text-lg font-bold text-white mb-6">System Logs</h3>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-4 items-start pb-4 border-b border-blue-900/10 last:border-0">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                    <div>
                                        <p className="text-sm text-slate-300 font-medium">Successful Login Attempt</p>
                                        <p className="text-[10px] text-slate-500 uppercase mt-1">2 mins ago • IP: 192.168.x.x</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
