"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Team", href: "#team" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-[#050b18]/80 backdrop-blur-md py-4 border-b border-blue-900/30"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-900/20">
                        <img src="/assets/nextcraftlogo.jpg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter">
                        NEXT<span className="text-blue-500">CRAFT</span>
                    </span>
                </motion.div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link, index) => (
                        <motion.a
                            key={link.name}
                            href={link.href}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-slate-400 hover:text-blue-400 transition-colors font-medium text-sm tracking-wide"
                        >
                            {link.name}
                        </motion.a>
                    ))}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2"
                    >
                        Get Started
                        <ArrowRight size={16} />
                    </motion.button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#0a1226] border-b border-blue-900/30 overflow-hidden"
                    >
                        <div className="flex flex-col gap-4 p-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-slate-300 hover:text-blue-400 font-medium py-2"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <button className="bg-blue-600 text-white w-full py-3 rounded-xl font-bold mt-2">
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
