"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "@/components/Layout/Admin/AdminSidebar";
import AdminHeader from "@/components/Layout/Admin/AdminHeader";
import { flatNavItems } from "@/components/Layout/Admin/navItems";

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
    const activePage = flatNavItems.find(item => item.href === pathname)?.name || "Dashboard";

    // If we are on the login page, don't show the dashboard layout
    if (pathname === "/admin/login") return <>{children}</>;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex">
            {/* Desktop Sidebar */}
            <motion.aside
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="fixed left-0 top-0 bottom-0 bg-[#050b18] border-r border-blue-900/10 z-50 hidden md:flex flex-col overflow-hidden"
            >
                <AdminSidebar isSidebarOpen={isSidebarOpen} user={user} />
            </motion.aside>

            {/* Mobile Sidebar Overlay + Drawer */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#050b18] border-r border-blue-900/20 z-[70] md:hidden flex flex-col shadow-2xl"
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <AdminSidebar isSidebarOpen={true} user={user} onLinkClick={() => setIsMobileOpen(false)} isMobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-[260px]" : "md:ml-[80px]"}`}>
                <AdminHeader
                    activePage={activePage}
                    user={user}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onToggleMobile={() => setIsMobileOpen(true)}
                    onLogout={handleLogout}
                />

                <div className="px-4 md:px-8 pb-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
