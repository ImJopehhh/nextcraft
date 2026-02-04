"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface NavLogoProps {
    scrolled: boolean;
}

export default function NavLogo({ scrolled }: NavLogoProps) {
    return (
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div
                className="h-10 w-10 rounded-lg overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-900/20 group-hover:border-blue-500/40 transition-all relative"
            >
                {/* Changed to Next.js Image for optimization, or keep raw img if preferred. Using img to match original behavior accurately first, but cleaner. */}
                <img
                    src="/assets/nextcraftlogo.jpg"
                    alt="NextCraft Logo"
                    className="w-full h-full object-cover"
                />
            </div>
            <span
                className="font-black text-white tracking-tighter text-xl"
            >
                NEXT<span className="text-blue-500">CRAFT</span>
            </span>
        </Link>
    );
}
