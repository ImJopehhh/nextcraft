"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Globe, ImageIcon, Link as LinkIcon, Info, Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function GlobalSettingsPage() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        siteName: "",
        siteUrl: "",
        siteLogo: ""
    });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const res = await fetch("/api/settings");
        if (res.ok) {
            const data = await res.json();
            if (data) {
                setFormData({
                    siteName: data.siteName,
                    siteUrl: data.siteUrl,
                    siteLogo: data.siteLogo
                });
            }
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                showToast("Settings saved successfully!", "success");
            } else {
                showToast("Failed to save settings.", "error");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: Max 2MB
        if (file.size > 2 * 1024 * 1024) {
            showToast("File size exceeds 2MB limit.", "warning");
            return;
        }

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadData
            });

            if (res.ok) {
                const data = await res.json();
                setFormData({ ...formData, siteLogo: data.url });
                showToast("Logo uploaded successfully!", "success");
            } else {
                showToast("Upload failed. Using manual URL is an option.", "warning");
            }
        } catch (error) {
            console.error("Upload error:", error);
            showToast("Upload error occurred.", "error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Global Settings</h1>
                    <p className="text-slate-500 text-sm font-medium">Configure your website's core identity.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm disabled:opacity-50"
                >
                    <Save size={18} />
                    {loading ? "SAVING..." : "SAVE CHANGES"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#050b18]/40 border border-blue-900/10 p-8 rounded-[2.5rem] backdrop-blur-sm space-y-8">
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                <Globe size={14} className="text-blue-500" />
                                WEBSITE NAME
                            </label>
                            <input
                                type="text"
                                value={formData.siteName}
                                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-slate-700"
                                placeholder="Enter website name"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                <LinkIcon size={14} className="text-blue-500" />
                                WEBSITE URL
                            </label>
                            <input
                                type="text"
                                value={formData.siteUrl}
                                onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-slate-700"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                <ImageIcon size={14} className="text-blue-500" />
                                WEBSITE LOGO
                            </label>

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    <div className="h-24 w-24 shrink-0 bg-black/20 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <img src={formData.siteLogo || "/assets/nextcraftlogo.jpg"} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                            <Upload size={20} className="text-white" />
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full space-y-4">
                                        <div className="flex gap-2 w-full">
                                            <input
                                                type="text"
                                                value={formData.siteLogo}
                                                onChange={(e) => setFormData({ ...formData, siteLogo: e.target.value })}
                                                className="flex-1 bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium placeholder:text-slate-600"
                                                placeholder="https:// or /uploads/"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border border-blue-600/20 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                <Upload size={14} />
                                                {uploading ? "UPLOADING..." : "UPLOAD NEW LOGO"}
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                            Max size: 2MB. Supports: JPG, PNG, WEBP. <br />
                                            If upload fails, you can paste an external URL (CDN) above.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    <div className="bg-blue-600/10 border border-blue-600/20 p-8 rounded-[2.5rem] backdrop-blur-sm">
                        <div className="flex items-center gap-3 text-blue-500 mb-4">
                            <Info size={24} />
                            <h3 className="font-black tracking-tight">Information</h3>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            These settings are global and will affect the entire website appearance, including page titles and the Navbar logo.
                        </p>
                        <div className="mt-8 pt-8 border-t border-blue-500/10">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">SEO Preview</p>
                            <div className="bg-[#050b18] p-4 rounded-2xl border border-white/5">
                                <p className="text-blue-500 font-bold mb-1">{formData.siteName || "NextCraft"} - Official Website</p>
                                <p className="text-green-600/80 text-[10px] mb-2">{formData.siteUrl || "http://localhost:3000"}</p>
                                <div className="h-2 w-full bg-white/5 rounded-full mb-1" />
                                <div className="h-2 w-2/3 bg-white/5 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
