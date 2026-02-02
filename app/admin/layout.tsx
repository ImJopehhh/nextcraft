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
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
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

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    };

    // Helper to get active page name
    const activePage = navItems.find(item => item.href === pathname)?.name || "Dashboard";

    // If we are on the login page, don't show the dashboard layout
    if (pathname === "/admin/login") return <>{children}</>;

    // Sidebar content component to avoid duplication
    const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
        <>
            <div className="p-6 flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-lg overflow-hidden border border-blue-500/20">
                    <img src="/assets/nextcraftlogo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-lg font-black text-white tracking-tighter">NEXT<span className="text-blue-500">CRAFT</span></span>
            </div>

            <nav className="flex-1 px-3 mt-4 space-y-1">
                {navItems.map((item) => {
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
                            <span className="font-bold text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

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
        </>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex">
            {/* Desktop Sidebar */}
            <motion.aside
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="fixed left-0 top-0 bottom-0 bg-[#050b18] border-r border-blue-900/10 z-50 hidden md:flex flex-col"
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-lg overflow-hidden border border-blue-500/20">
                        <img src="/assets/nextcraftlogo.jpg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    {isSidebarOpen && (
                        <span className="text-lg font-black text-white tracking-tighter">NEXT<span className="text-blue-500">CRAFT</span></span>
                    )}
                </div>

                <nav className="flex-1 px-3 mt-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const hasAccess = !user || item.roles.includes(user.role);
                        if (!hasAccess) return null;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                                    }`}
                            >
                                <div className={`${isActive ? "text-white" : "group-hover:text-blue-400"}`}>
                                    {item.icon}
                                </div>
                                {isSidebarOpen && (
                                    <span className="font-bold text-sm">{item.name}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <div className={`bg-blue-900/10 border border-blue-900/20 rounded-2xl p-4 transition-all ${!isSidebarOpen && "opacity-0 invisible"}`}>
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
            </motion.aside>

            {/* Mobile Sidebar Overlay + Drawer */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                        />
                        {/* Mobile Drawer */}
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#050b18] border-r border-blue-900/20 z-[70] md:hidden flex flex-col shadow-2xl"
                        >
                            {/* Close Button */}
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <SidebarContent onLinkClick={() => setIsMobileOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-[260px]" : "md:ml-[80px]"}`}>
                {/* Header - "Kotak Panjang" Style */}
                <div className="p-4 md:p-6 sticky top-0 z-40">
                    <header className="h-16 bg-[#050b18]/80 backdrop-blur-xl border border-blue-900/20 rounded-2xl flex items-center justify-between px-4 md:px-6 shadow-2xl">
                        <div className="flex items-center gap-3 md:gap-4">
                            {/* Mobile Hamburger */}
                            <button
                                onClick={() => setIsMobileOpen(true)}
                                className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-400 flex md:hidden"
                            >
                                <Menu size={20} />
                            </button>
                            {/* Desktop Toggle */}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
                                    onClick={handleLogout}
                                    className="h-8 w-8 rounded-lg bg-red-500/10 hover:bg-red-500 flex items-center justify-center text-red-500 hover:text-white transition-all ml-1"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    </header>
                </div>

                <div className="px-4 md:px-8 pb-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
