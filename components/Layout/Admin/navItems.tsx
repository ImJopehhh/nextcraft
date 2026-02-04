import {
    LayoutDashboard,
    Users,
    Settings,
    Globe,
    Database,
    Monitor
} from "lucide-react";
import React from "react";

export interface NavItem {
    name: string;
    icon: React.ReactNode;
    href: string;
    roles: string[];
}

export interface NavCategory {
    category: string;
    items: NavItem[];
}

export const adminNavigation: NavCategory[] = [
    {
        category: "General",
        items: [
            { name: "Overview", icon: <LayoutDashboard size={ 20} />, href: "/admin", roles: ["WEBMASTER", "DEVELOPER", "ADMIN"] },
    { name: "Admin Accounts", icon: <Users size={ 20} />, href: "/admin/accounts", roles: ["WEBMASTER", "DEVELOPER"] },
        ]
    },
{
    category: "Website Interface",
        items: [
            { name: "Global Settings", icon: <Settings size={ 20} />, href: "/admin/interface/settings", roles: ["WEBMASTER"] },
{
    name: "SEO Settings", icon: <Globe size={ 20 } />, href: "/admin / seo", roles: ["WEBMASTER", "ADMIN"] },
        ]
},
{
    category: "System",
        items: [
            { name: "Database", icon: <Database size={ 20} />, href: "/admin/database", roles: ["WEBMASTER", "DEVELOPER"] },
{
    name: "Settings", icon: <Monitor size={ 20 } />, href: "/admin / settings", roles: ["WEBMASTER"] },
        ]
}
];

export const flatNavItems = adminNavigation.flatMap(cat => cat.items);
