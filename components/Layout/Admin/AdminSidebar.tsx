"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut } from "lucide-react";
import { adminNavigation } from "./navItems";

interface AdminSidebarProps {
    isSidebarOpen: boolean;
    user: any;
    onLinkClick?: () => void;
    isMobile?: boolean;
}

export default function AdminSidebar({ isSidebarOpen, user, onLinkClick, isMobile = false }: AdminSidebarProps) {
    const pathname = usePathname();
    const [settings, setSettings] = useState({ siteName: "NextCraft", siteLogo: "/assets/nextcraftlogo.jpg" });
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.siteName) {
                        setSettings({
                            siteName: data.siteName,
                            siteLogo: data.siteLogo || "/assets/nextcraftlogo.jpg"
                        });
                    }
                }
            } catch (e) {
                console.error("Failed to load settings", e);
            }
        };
        fetchSettings();

        // Initialize all categories as open
        const initialOpenState: Record<string, boolean> = {};
        adminNavigation.forEach(cat => {
            initialOpenState[cat.category] = true;
        });
        setOpenCategories(initialOpenState);
    }, []);

    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    return (
        <div className="flex flex-col h-full bg-[#050b18] border-r border-blue-900/20 text-white w-full">
            {/* Header */}
            <div className="p-6 flex items-center gap-3 border-b border-blue-900/10">
                <div className="h-9 w-9 shrink-0 rounded-lg overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/10">
                    <img src={settings.siteLogo} alt="Logo" className="w-full h-full object-cover" />
                </div>
                {(isSidebarOpen || isMobile) && (
                    <span className="text-lg font-black text-white tracking-tighter uppercase truncate">{settings.siteName}</span>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {adminNavigation.map((cat) => (
                    <div key={cat.category}>
                        {/* Category Header */}
                        {(isSidebarOpen || isMobile) ? (
                            <button
                                onClick={() => toggleCategory(cat.category)}
                                className="w-full flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-widest mb-3 hover:text-blue-400 transition-colors"
                            >
                                {cat.category}
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-300 ${openCategories[cat.category] ? "rotate-180" : ""}`}
                                />
                            </button>
                        ) : (
                            <div className="h-px bg-white/5 mb-3 mx-2" />
                        )}

                        {/* Items */}
                        <AnimatePresence initial={false}>
                            {(openCategories[cat.category] || !isSidebarOpen && !isMobile) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden space-y-1"
                                >
                                    {cat.items.map((item) => {
                                        const isActive = pathname === item.href;
                                        const hasAccess = !user || item.roles.includes(user.role);
                                        if (!hasAccess) return null;

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={onLinkClick}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${isActive
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                    }`}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute inset-0 bg-blue-600 z-0"
                                                        initial={false}
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                    />
                                                )}
                                                <div className="relative z-10 shrink-0">
                                                    {item.icon}
                                                </div>
                                                {(isSidebarOpen || isMobile) && (
                                                    <span className="relative z-10 font-bold text-sm tracking-tight">{item.name}</span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Footer / User Info */}
            <div className="p-4 border-t border-blue-900/10">
                <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 ${isSidebarOpen || isMobile ? "" : "justify-center"}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 shrink-0" />
                    {(isSidebarOpen || isMobile) && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{user?.username || "Admin"}</p>
                            <p className="text-[10px] font-medium text-slate-500 truncate">{user?.role || "GUEST"}</p>
                        </div>
                    )}
                    {(isSidebarOpen || isMobile) && (
                        <button className="text-slate-500 hover:text-red-400 transition-colors">
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
