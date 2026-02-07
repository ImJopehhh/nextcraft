import { Home, Server, Users, Headphones, Trophy } from "lucide-react";

export const navItems = [
    {
        name: "Home",
        href: "/",
        icon: Home,
        hasDropdown: false
    },
    {
        name: "Server",
        href: "/server",
        icon: Server,
        hasDropdown: true,
        dropdown: [
            { name: "Server Status", href: "/server/status" },
            { name: "Server Rules", href: "/server/rules" },
            { name: "Server Map", href: "/server/map" },
            { name: "Join Server", href: "/server/join" },
            { name: "Server Stats", href: "/server/stats" },
        ]
    },
    {
        name: "Community",
        href: "/community",
        icon: Users,
        hasDropdown: true,
        dropdown: [
            { name: "Discord Server", href: "/community/discord" },
            { name: "Forums", href: "/community/forums" },
            { name: "Events", href: "/community/events" },
            { name: "Gallery", href: "/community/gallery" },
            { name: "News & Updates", href: "/community/news" },
        ]
    },
    {
        name: "Support",
        href: "/support",
        icon: Headphones,
        hasDropdown: true,
        dropdown: [
            { name: "Help Center", href: "/support/help" },
            { name: "Report Bug", href: "/support/report-bug" },
            { name: "Submit Ticket", href: "/support/ticket" },
            { name: "FAQ", href: "/support/faq" },
            { name: "Contact Us", href: "/support/contact" },
        ]
    },
    {
        name: "Leaderboard",
        href: "/leaderboard",
        icon: Trophy,
        hasDropdown: true,
        dropdown: [
            { name: "Top Players", href: "/leaderboard/top-players" },
            { name: "Top Guilds", href: "/leaderboard/top-guilds" },
            { name: "Monthly Rankings", href: "/leaderboard/monthly" },
            { name: "Hall of Fame", href: "/leaderboard/hall-of-fame" },
            { name: "Achievements", href: "/leaderboard/achievements" },
        ]
    },
];
