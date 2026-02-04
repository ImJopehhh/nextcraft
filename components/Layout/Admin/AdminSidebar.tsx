"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { adminNavigation } from "./navItems";

interface AdminSidebarProps {
    isSidebarOpen: boolean;
    user: any;
    onLinkClick?: () => void;
    isMobile?: boolean;
}

export default function AdminSidebar({ isSidebarOpen, user, onLinkClick, isMobile = false }: AdminSidebarProps) {
    const pathname = usePathname();

    const renderNavItems = (items: any[]) => {
        return items.map((item) => {
            const isActive = pathname === item.href;
            const hasAccess = !user || item.roles.includes(user.role);
            if (!hasAccess) return null;

            return (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={onLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                        }`}
                >
                    <div className={`${isActive ? "text-white" : "group-hover:text-blue-400"}`}>
                        {item.icon}
                    </div>
                    {(isSidebarOpen || isMobile) && (
                        <span className="font-bold text-sm tracking-tight">{item.name}</span>
                    )}
                </Link>
            );
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-lg overflow-hidden border border-blue-500/20">
                    <img src="/assets/nextcraftlogo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                {(isSidebarOpen || isMobile) && (
                    <span className="text-lg font-black text-white tracking-tighter">NEXT<span className="text-blue-500">CRAFT</span></span>
                )}
            </div>

            <nav className="flex-1 px-3 mt-4 space-y-6 overflow-y-auto no-scrollbar">
                {adminNavigation.map((category) => {
                    const visibleItems = category.items.filter(item => !user || item.roles.includes(user.role));
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={category.category} className="space-y-1">
                            {(isSidebarOpen || isMobile) && (
                                <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">
                                    {category.category}
                                </p>
                            )}
                            {renderNavItems(category.items)}
                        </div>
                    );
                })}
            </nav>

            {(isSidebarOpen || isMobile) && (
                <div className="p-4 mt-auto">
                    <div className="bg-blue-900/10 border border-blue-900/20 rounded-2xl p-4 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                                NC
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-white truncate">NextCraft v1.0</p>
                                <p className="text-[10px] text-slate-500 font-medium">Standard Edition</p>
                            </div>
                        </div>
                        <div className="h-1 bg-blue-900/20 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-blue-600 rounded-full" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
