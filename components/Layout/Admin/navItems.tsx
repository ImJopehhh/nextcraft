import {
    LayoutDashboard,
    Users,
    Settings,
    Globe,
    Database,
    Monitor
} from "lucide-react";
import React from "react";

export interface NavSubItem {
    name: string;
    href: string;
}

export interface NavItem {
    name: string;
    icon: React.ReactNode;
    href: string;
    roles: string[];
    subItems?: NavSubItem[];
}

export interface NavCategory {
    category: string;
    items: NavItem[];
}

export const adminNavigation: NavCategory[] = [
    {
        category: "General",
        items: [
            { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/admin", roles: ["WEBMASTER", "DEVELOPER", "ADMIN"] },
            { name: "Admin Accounts", icon: <Users size={20} />, href: "/admin/accounts", roles: ["WEBMASTER", "DEVELOPER"] },
        ]
    },
    {
        category: "Website Interface",
        items: [
            { name: "Global Settings", icon: <Settings size={20} />, href: "/admin/interface/settings", roles: ["WEBMASTER"] },
            { name: "SEO Settings", icon: <Globe size={20} />, href: "/admin/seo", roles: ["WEBMASTER", "ADMIN"] },
            { name: "Home Page", icon: <LayoutDashboard size={20} />, href: "/admin/interface/home", roles: ["WEBMASTER", "DEVELOPER"] },
            {
                name: "Server Pages",
                icon: <Monitor size={20} />,
                href: "#",
                roles: ["WEBMASTER", "DEVELOPER"],
                subItems: [
                    { name: "Status Network", href: "/admin/interface/server/server-status" },
                    { name: "Aturan Bermain", href: "/admin/interface/server/server-rules" },
                    { name: "Gabung Sekarang", href: "/admin/interface/server/server-join" },
                    { name: "Statistik Server", href: "/admin/interface/server/server-stats" },
                ]
            },
            {
                name: "Community Pages",
                icon: <Users size={20} />,
                href: "#",
                roles: ["WEBMASTER", "DEVELOPER"],
                subItems: [
                    { name: "Forum Diskusi", href: "/admin/interface/community/community-forums" },
                    { name: "Event Komunitas", href: "/admin/interface/community/community-events" },
                    { name: "Galeri Foto", href: "/admin/interface/community/community-gallery" },
                    { name: "Berita & Update", href: "/admin/interface/community/community-news" },
                ]
            },
            {
                name: "Support Pages",
                icon: <Monitor size={20} />,
                href: "#",
                roles: ["WEBMASTER", "DEVELOPER"],
                subItems: [
                    { name: "Pusat Bantuan", href: "/admin/interface/support/support-help" },
                    { name: "Pusat Jawaban", href: "/admin/interface/support/support-faq" },
                    { name: "Lapor Bug", href: "/admin/interface/support/support-report-bug" },
                    { name: "Kirim Tiket", href: "/admin/interface/support/support-ticket" },
                    { name: "Hubungi Kami", href: "/admin/interface/support/support-contact" },
                ]
            },
            {
                name: "Leaderboard Pages",
                icon: <Monitor size={20} />,
                href: "#",
                roles: ["WEBMASTER", "DEVELOPER"],
                subItems: [
                    { name: "Pemain Terbaik", href: "/admin/interface/leaderboard/leaderboard-top-players" },
                    { name: "Ranking Bulanan", href: "/admin/interface/leaderboard/leaderboard-monthly" },
                    { name: "Hall of Fame", href: "/admin/interface/leaderboard/leaderboard-hall-of-fame" },
                    { name: "Global Achievements", href: "/admin/interface/leaderboard/leaderboard-achievements" },
                ]
            },
        ]
    },
    {
        category: "System",
        items: [
            { name: "System Log", icon: <Database size={20} />, href: "/admin/system/logs", roles: ["WEBMASTER", "DEVELOPER"] },
            { name: "Database", icon: <Database size={20} />, href: "/admin/database", roles: ["WEBMASTER", "DEVELOPER"] },
            {
                name: "Settings", icon: <Monitor size={20} />, href: "/admin/settings", roles: ["WEBMASTER"]
            },
        ]
    }
];

export const flatNavItems = adminNavigation.flatMap(cat => cat.items);
