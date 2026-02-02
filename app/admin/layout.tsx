"use client";

import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Users,
    Settings,
    Globe,
    Database,
    LogOut,
    Menu,
    X,
    ChevronRight,
    UserCircle
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/admin", roles: ["WEBMASTER", "DEVELOPER", "ADMIN"] },
    { name: "Admin Accounts", icon: <Users size={20} />, href: "/admin/accounts", roles: ["WEBMASTER", "DEVELOPER"] },
    { name: "Database", icon: <Database size={20} />, href: "/admin/database", roles: ["WEBMASTER", "DEVELOPER"] },
    { name: "SEO Settings", icon: <Globe size={20} />, href: "/admin/seo", roles: ["WEBMASTER", "ADMIN"] },
    { name: "Settings", icon: <Settings size={20} />, href: "/admin/settings", roles: ["WEBMASTER"] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // In a real app, we'd fetch the user session from an API or pass it from a server component
        // For this UI demo, we'll try to get basic info if possible or use placeholders
        // getSession() is async and server-side, so we'd normally use a context or fetch.
        const checkSession = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (err) { }
        };
        checkSession();
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    };

    // If we are on the login page, don't show the dashboard layout
    if (pathname === "/admin/login") return <>{children}</>;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex">
            {/* Sidebar */}
            <motion.aside
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="fixed left-0 top-0 bottom-0 bg-[#050b18] border-r border-blue-900/20 z-40 hidden md:flex flex-col"
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-blue-900/30">
                        <img src="/assets/nextcraftlogo.jpg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    {isSidebarOpen && (
                        <span className="text-xl font-black text-white tracking-tighter">NEXT<span className="text-blue-500">CP</span></span>
                    )}
                </div>

                <nav className="flex-1 px-4 mt-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const hasAccess = !user || item.roles.includes(user.role);
                        if (!hasAccess) return null;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-slate-500 hover:bg-blue-900/10 hover:text-slate-200"
                                    }`}
                            >
                                <div className={`${isActive ? "text-white" : "group-hover:text-blue-400"}`}>
                                    {item.icon}
                                </div>
                                {isSidebarOpen && (
                                    <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                                )}
                                {isSidebarOpen && isActive && (
                                    <ChevronRight size={16} className="ml-auto opacity-50" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-blue-900/10 mb-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-semibold text-sm"
                    >
                        <div className="shrink-0"><X size={20} /></div>
                        {isSidebarOpen && <span>Keluar Panel</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-[280px]" : "md:ml-[80px]"}`}>
                {/* Header */}
                <header className="h-20 bg-[#050b18]/50 backdrop-blur-md border-b border-blue-900/10 flex items-center justify-between px-8 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-blue-900/10 rounded-xl transition-all text-slate-400"
                    >
                        {isSidebarOpen ? <Menu size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-bold text-white leading-none capitalize">{user?.username || "Admin"}</span>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">{user?.role || "Manager"}</span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-900/20 border border-blue-500/20 flex items-center justify-center text-blue-400 overflow-hidden">
                            <UserCircle size={28} />
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
