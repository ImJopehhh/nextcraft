"use client";

import { useEffect, useState } from "react";
import {
    Monitor,
    ChevronRight,
    Search,
    Filter,
    Server,
    Users,
    LifeBuoy,
    Trophy,
    Clock,
    Layout
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import GlassContainer from "@/components/UI/Premium/GlassContainer";

export default function PagesManagementHub() {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch("/api/content/pages")
            .then(res => res.json())
            .then(data => {
                setPages(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const categories = [
        { id: "server", name: "Server", icon: Server, color: "text-blue-400" },
        { id: "community", name: "Community", icon: Users, color: "text-purple-400" },
        { id: "support", name: "Support", icon: LifeBuoy, color: "text-emerald-400" },
        { id: "leaderboard", name: "Leaderboard", icon: Trophy, color: "text-yellow-400" }
    ];

    const filteredPages = pages.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPagesByCategory = (catId: string) => {
        return filteredPages.filter(p => p.slug.startsWith(catId));
    };

    if (loading) return <div className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest">Initialising Database Access...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Content Management</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage all dynamic sub-pages across the NextCraft portal.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search pages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-blue-950/20 border border-blue-900/20 rounded-2xl pl-12 pr-6 py-3 text-white outline-none focus:border-blue-500/50 transition-all w-full md:w-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {categories.map((cat) => {
                    const catPages = getPagesByCategory(cat.id);
                    if (catPages.length === 0 && searchQuery) return null;

                    return (
                        <div key={cat.id} className="space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                                <cat.icon size={20} className={cat.color} />
                                <h2 className="text-xl font-black text-white uppercase tracking-wider">{cat.name} Network</h2>
                                <span className="ml-auto bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                    {catPages.length} Pages
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {catPages.map((page, i) => (
                                    <Link key={page.id} href={`/admin/interface/${cat.id}/${page.slug}`}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bg-[#050b18]/40 border border-blue-900/10 p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group relative overflow-hidden h-full flex flex-col justify-between"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight size={20} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:bg-blue-600/10 group-hover:border-blue-600/20 transition-all">
                                                        <Layout size={18} className="text-white/20 group-hover:text-blue-400" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{page.slug.split('-').slice(1).join(' ')}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight line-clamp-1">{page.title}</h3>
                                                <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">
                                                    Manage the layout, SEO metadata, and dynamic data for this section.
                                                </p>
                                            </div>

                                            <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                                    <Clock size={12} />
                                                    Updated {new Date(page.updatedAt).toLocaleDateString()}
                                                </div>
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
