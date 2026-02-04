import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface NavLogoProps {
    scrolled: boolean;
}

export default function NavLogo({ scrolled }: NavLogoProps) {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (err) { }
        };
        fetchSettings();
    }, []);

    const siteName = settings?.siteName || "NEXTCRAFT";
    const logoUrl = settings?.siteLogo || "/assets/nextcraftlogo.jpg";

    const formatSiteName = (name: string) => {
        if (name.toUpperCase() === "NEXTCRAFT") {
            return (
                <>
                    NEXT<span className="text-blue-500">CRAFT</span>
                </>
            );
        }
        return name;
    };

    return (
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div
                className="h-10 w-10 rounded-lg overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-900/20 group-hover:border-blue-500/40 transition-all relative"
            >
                <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                />
            </div>
            <span
                className="font-black text-white tracking-tighter text-xl uppercase"
            >
                {formatSiteName(siteName)}
            </span>
        </Link>
    );
}
