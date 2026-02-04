"use client";

import React from "react";
import { Menu, LogOut } from "lucide-react";

interface AdminHeaderProps {
    activePage: string;
    user: any;
    onToggleSidebar: () => void;
    onToggleMobile: () => void;
    onLogout: () => void;
}

export default function AdminHeader({ activePage, user, onToggleSidebar, onToggleMobile, onLogout }: AdminHeaderProps) {
    return (
        <div className="p-4 md:p-6 sticky top-0 z-40">
            <header className="h-16 bg-[#050b18]/80 backdrop-blur-xl border border-blue-900/20 rounded-2xl flex items-center justify-between px-4 md:px-6 shadow-2xl">
                <div className="flex items-center gap-3 md:gap-4">
                    {/* Mobile Hamburger */}
                    <button
                        onClick={onToggleMobile}
                        className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-400 flex md:hidden"
                    >
                        <Menu size={20} />
                    </button>
                    {/* Desktop Toggle */}
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-400 hidden md:flex"
                    >
                        <Menu size={18} />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-blue-600 rounded-full hidden sm:block" />
                        <h2 className="text-base md:text-lg font-black text-white tracking-tight">{activePage}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Profile Box */}
                    <div className="flex items-center gap-2 md:gap-3 bg-white/5 border border-white/10 rounded-xl pl-3 md:pl-4 pr-1 py-1 group hover:border-blue-500/30 transition-all">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-black text-white leading-none capitalize">{user?.username || "Admin"}</span>
                            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">{user?.role || "Manager"}</span>
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-blue-600 p-0.5 shadow-lg shadow-blue-500/20 relative">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.username || "A"}&background=2563eb&color=fff`}
                                className="w-full h-full object-cover rounded-[6px]"
                                alt="User"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#050b18] rounded-full" />
                        </div>
                        <button
                            onClick={onLogout}
                            className="h-8 w-8 rounded-lg bg-red-500/10 hover:bg-red-500 flex items-center justify-center text-red-500 hover:text-white transition-all ml-1"
                            title="Logout"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
}
