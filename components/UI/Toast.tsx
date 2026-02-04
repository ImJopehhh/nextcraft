"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Bell, X } from "lucide-react";
import { ToastType } from "@/context/ToastContext";

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

const toastConfig = {
    success: {
        icon: <CheckCircle2 size={20} />,
        bg: "bg-[#064e3b]/80",
        border: "border-emerald-500/20",
        text: "text-emerald-400",
        shadow: "shadow-emerald-500/10"
    },
    warning: {
        icon: <AlertTriangle size={20} />,
        bg: "bg-[#451a03]/80",
        border: "border-orange-500/20",
        text: "text-orange-400",
        shadow: "shadow-orange-500/10"
    },
    error: {
        icon: <XCircle size={20} />,
        bg: "bg-[#450a0a]/80",
        border: "border-red-500/20",
        text: "text-red-400",
        shadow: "shadow-red-500/10"
    },
    alert: {
        icon: <Bell size={20} />,
        bg: "bg-[#1e1b4b]/80",
        border: "border-blue-500/20",
        text: "text-blue-400",
        shadow: "shadow-blue-500/10"
    }
};

export default function Toast({ message, type, onClose }: ToastProps) {
    const config = toastConfig[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl border ${config.border} ${config.bg} backdrop-blur-xl ${config.shadow} shadow-2xl min-w-[320px] max-w-md border-white/5`}
        >
            <div className={`${config.text} shrink-0`}>
                {config.icon}
            </div>

            <p className="text-sm font-bold text-white flex-1 leading-tight tracking-tight">
                {message}
            </p>

            <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all ml-2"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
}
