import React from "react";

/**
 * Bcode Color Map
 * Based on Minecraft color codes but adapted for Tailwind CSS classes.
 */
const colorMap: Record<string, string> = {
    "0": "text-black",
    "1": "text-blue-900",
    "2": "text-green-900",
    "3": "text-cyan-900",
    "4": "text-red-900",
    "5": "text-purple-900",
    "6": "text-yellow-600",
    "7": "text-gray-400",
    "8": "text-gray-600",
    "9": "text-blue-600",
    "a": "text-green-500",
    "b": "text-cyan-500", // Aqua
    "c": "text-red-500",
    "d": "text-pink-500",
    "e": "text-yellow-400",
    "f": "text-white",
};

/**
 * Parses a string containing Bcode (e.g., "&bText") and returns a ReactNode array.
 * Supports:
 * - Colors: &0-9, &a-f
 * - Bold: &l
 * - Reset: &r (restores to default)
 */
export const BcodeParser = ({ text, className = "" }: { text: string; className?: string }) => {
    if (!text) return null;

    const parts = text.split(/(&[0-9a-flr])/g);
    let currentColor = "";
    let isBold = false;

    return (
        <span className={className}>
            {parts.map((part, index) => {
                if (part.startsWith("&")) {
                    const code = part[1];
                    if (code === "l") {
                        isBold = true;
                    } else if (code === "r") {
                        currentColor = "";
                        isBold = false;
                    } else if (colorMap[code]) {
                        currentColor = colorMap[code];
                    }
                    return null;
                }

                if (!part) return null;

                return (
                    <span
                        key={index}
                        className={`${currentColor} ${isBold ? "font-bold" : ""}`}
                    >
                        {part}
                    </span>
                );
            })}
        </span>
    );
};
