"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { navItems } from "./navigationData";

export default function DesktopMenu() {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        if (activeDropdown) {
            document.addEventListener("click", handleClickOutside);
            return () => document.removeEventListener("click", handleClickOutside);
        }
    }, [activeDropdown]);

    return (
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
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all font-medium text-sm"
                        onClick={(e) => {
                            if (item.hasDropdown) {
                                e.preventDefault();
                                setActiveDropdown(activeDropdown === item.name ? null : item.name);
                            }
                        }}
                    >
                        <item.icon size={16} />
                        {item.name}
                        {item.hasDropdown && (
                            <ChevronDown
                                size={14}
                                className={`transition-transform ${activeDropdown === item.name ? "rotate-180" : ""}`}
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
                                {item.dropdown?.map((subItem) => (
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
    );
}
