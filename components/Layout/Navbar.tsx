"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown, Server, Users, Headphones, Trophy, Home } from "lucide-react";
import Link from "next/link";

const navItems = [
    {
        name: "Home",
        href: "#",
        icon: <Home size={16} />,
        hasDropdown: false
    },
    {
        name: "Server",
        href: "#server",
        icon: <Server size={16} />,
        hasDropdown: true,
        dropdown: [
            { name: "Server Status", href: "#server-status" },
            { name: "Server Rules", href: "#server-rules" },
            { name: "Server Map", href: "#server-map" },
            { name: "Join Server", href: "#join-server" },
            { name: "Server Stats", href: "#server-stats" },
        ]
    },
    {
        name: "Community",
        href: "#community",
        icon: <Users size={16} />,
        hasDropdown: true,
        dropdown: [
            { name: "Discord Server", href: "#discord" },
            { name: "Forums", href: "#forums" },
            { name: "Events", href: "#events" },
            { name: "Gallery", href: "#gallery" },
            { name: "News & Updates", href: "#news" },
        ]
    },
    {
        name: "Support",
        href: "#support",
        icon: <Headphones size={16} />,
        hasDropdown: true,
        dropdown: [
            { name: "Help Center", href: "#help" },
            { name: "Report Bug", href: "#report-bug" },
            { name: "Submit Ticket", href: "#ticket" },
            { name: "FAQ", href: "#faq" },
            { name: "Contact Us", href: "#contact" },
        ]
    },
    {
        name: "Leaderboard",
        href: "#leaderboard",
        icon: <Trophy size={16} />,
        hasDropdown: true,
        dropdown: [
            { name: "Top Players", href: "#top-players" },
            { name: "Top Guilds", href: "#top-guilds" },
            { name: "Monthly Rankings", href: "#monthly" },
            { name: "Hall of Fame", href: "#hall-of-fame" },
            { name: "Achievements", href: "#achievements" },
        ]
    },
];

export default function Navbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        if (activeDropdown) {
            document.addEventListener("click", handleClickOutside);
            return () => document.removeEventListener("click", handleClickOutside);
        }
    }, [activeDropdown]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-[#050b18]/90 backdrop-blur-xl py-3 shadow-lg shadow-black/10"
                    : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 cursor-pointer group">
                    <motion.div
                        animate={{ scale: scrolled ? 0.9 : 1 }}
                        className="h-10 w-10 rounded-lg overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-900/20 group-hover:border-blue-500/40 transition-all"
                    >
                        <img src="/assets/nextcraftlogo.jpg" alt="Logo" className="w-full h-full object-cover" />
                    </motion.div>
                    <motion.span
                        animate={{ fontSize: scrolled ? "1.125rem" : "1.25rem" }}
                        className="font-black text-white tracking-tighter"
                    >
                        NEXT<span className="text-blue-500">CRAFT</span>
                    </motion.span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => (
                        <div
                            key={item.name}
                            className="relative"
                            onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <Link
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all font-medium text-sm ${scrolled ? "text-sm" : "text-base"
                                    }`}
                                onClick={(e) => {
                                    if (item.hasDropdown) {
                                        e.preventDefault();
                                        setActiveDropdown(activeDropdown === item.name ? null : item.name);
                                    }
                                }}
                            >
                                {item.icon}
                                {item.name}
                                {item.hasDropdown && (
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform ${activeDropdown === item.name ? "rotate-180" : ""
                                            }`}
                                    />
                                )}
                            </Link>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {item.hasDropdown && activeDropdown === item.name && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 mt-2 w-56 bg-[#0a1226]/95 backdrop-blur-xl border border-blue-900/30 rounded-xl shadow-2xl overflow-hidden"
                                    >
                                        {item.dropdown?.map((subItem, idx) => (
                                            <Link
                                                key={subItem.name}
                                                href={subItem.href}
                                                className="block px-4 py-3 text-slate-400 hover:text-white hover:bg-blue-600/10 transition-all text-sm border-b border-blue-900/10 last:border-0"
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="ml-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-900/30 flex items-center gap-2"
                    >
                        Get Started
                        <ArrowRight size={16} />
                    </motion.button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-all"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-[#0a1226]/98 backdrop-blur-xl border-t border-blue-900/20 overflow-hidden"
                    >
                        <div className="flex flex-col p-4 max-h-[70vh] overflow-y-auto">
                            {navItems.map((item) => (
                                <div key={item.name} className="border-b border-blue-900/10 last:border-0">
                                    {item.hasDropdown ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    setMobileDropdown(
                                                        mobileDropdown === item.name ? null : item.name
                                                    )
                                                }
                                                className="w-full flex items-center justify-between gap-2 px-4 py-3 text-slate-300 hover:text-white font-medium"
                                            >
                                                <span className="flex items-center gap-2">
                                                    {item.icon}
                                                    {item.name}
                                                </span>
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform ${mobileDropdown === item.name ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {mobileDropdown === item.name && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="bg-blue-950/20 overflow-hidden"
                                                    >
                                                        {item.dropdown?.map((subItem) => (
                                                            <Link
                                                                key={subItem.name}
                                                                href={subItem.href}
                                                                onClick={() => setIsMobileOpen(false)}
                                                                className="block px-8 py-2.5 text-slate-400 hover:text-white text-sm"
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileOpen(false)}
                                            className="flex items-center gap-2 px-4 py-3 text-slate-300 hover:text-white font-medium"
                                        >
                                            {item.icon}
                                            {item.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                            <button
                                className="bg-blue-600 text-white w-full py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2"
                                onClick={() => setIsMobileOpen(false)}
                            >
                                Get Started
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
