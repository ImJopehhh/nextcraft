"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

export default function GuestLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}
