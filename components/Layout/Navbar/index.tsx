"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import NavLogo from "./NavLogo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
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
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled
                    ? "bg-[#050b18]/90 backdrop-blur-xl shadow-lg shadow-black/10"
                    : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <NavLogo scrolled={scrolled} />

                {/* Desktop Navigation */}
                <DesktopMenu />

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-all"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle mobile menu"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
        </nav>
    );
}
