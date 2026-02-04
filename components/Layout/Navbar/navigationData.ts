import { Home, Server, Users, Headphones, Trophy } from "lucide-react";

export const navItems = [
    {
        name: "Home",
        href: "#",
        icon: Home,
        hasDropdown: false
    },
    {
        name: "Server",
        href: "#server",
        icon: Server,
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
        icon: Users,
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
        icon: Headphones,
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
        icon: Trophy,
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
