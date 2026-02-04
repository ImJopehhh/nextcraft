"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { navItems } from "./navigationData";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

    return (
        <AnimatePresence>
            {isOpen && (
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
                                                <item.icon size={16} />
                                                {item.name}
                                            </span>
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform ${mobileDropdown === item.name ? "rotate-180" : ""}`}
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
                                                            onClick={onClose}
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
                                        onClick={onClose}
                                        className="flex items-center gap-2 px-4 py-3 text-slate-300 hover:text-white font-medium"
                                    >
                                        <item.icon size={16} />
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                        <button
                            className="bg-blue-600 text-white w-full py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2"
                            onClick={onClose}
                        >
                            Get Started
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
