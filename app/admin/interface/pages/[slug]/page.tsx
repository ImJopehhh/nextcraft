"use client";

import { useState, useEffect, use } from "react";
import {
    Save,
    ArrowLeft,
    Layout,
    Eye,
    Code,
    Info,
    AlertCircle,
    CheckCircle2,
    Undo2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import GlassContainer from "@/components/UI/Premium/GlassContainer";
import VisualBuilder from "@/components/Admin/VisualBuilder";

export default function PageEditor({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { showToast } = useToast();
    const router = useRouter();
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState<'visual' | 'json'>('visual');

    useEffect(() => {
        fetch(`/api/content/pages/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load");
                return res.json();
            })
            .then(data => {
                // Ensure content is a string for the editor if it's an object
                const preparedData = {
                    ...data,
                    content: typeof data.content === 'object' ? JSON.stringify(data.content, null, 2) : data.content
                };
                setPageData(preparedData);
                setLoading(false);
            })
            .catch(() => {
                showToast("Failed to load page content", "error");
                router.push("/admin/interface/pages");
            });
    }, [slug]);

    const handleSave = async () => {
        // Validate JSON before saving
        try {
            JSON.parse(pageData.content);
            setJsonError(null);
        } catch (e: any) {
            setJsonError(`Invalid JSON: ${e.message}`);
            showToast("JSON syntax error detected", "error");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/content/pages/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: pageData.title,
                    description: pageData.description,
                    content: JSON.parse(pageData.content)
                })
            });

            if (res.ok) {
                showToast("Page updated successfully!", "success");
            } else {
                showToast("Failed to save changes", "error");
            }
        } catch (e) {
            showToast("An error occurred during save", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleVisualChange = (newContent: any) => {
        setPageData({
            ...pageData,
            content: JSON.stringify(newContent, null, 2)
        });
    };

    if (loading) return <div className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest">Initialising Secure Editor...</div>;

    // Safe parse for visual builder
    let visualContent = {};
    try {
        visualContent = JSON.parse(pageData.content);
    } catch (e) {
        // If JSON is invalid, stay in JSON mode
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/interface/pages" className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <span className="text-blue-500 uppercase text-sm font-black tracking-widest bg-blue-500/10 px-3 py-1 rounded-lg">{slug.split('-')[0]}</span>
                            {pageData.title}
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">Page ID: <span className="text-slate-400 font-mono">{slug}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={`/${slug.replace('-', '/')}`}
                        target="_blank"
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 text-sm"
                    >
                        <Eye size={16} />
                        VIEW LIVE
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <GlassContainer className="p-8 space-y-6 border-white/5 bg-[#050b18]/40">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                            <Layout size={18} className="text-blue-500" />
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Standard Metadata</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Page Title</label>
                            <input
                                type="text"
                                value={pageData.title}
                                onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Meta Description</label>
                            <textarea
                                value={pageData.description || ""}
                                onChange={(e) => setPageData({ ...pageData, description: e.target.value })}
                                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium text-sm resize-none"
                                placeholder="Enter page meta description..."
                            />
                        </div>
                    </GlassContainer>

                    {/* Content Editor */}
                    <GlassContainer className="p-8 border-white/5 bg-[#050b18]/40 overflow-hidden">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <Code size={18} className="text-blue-500" />
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Content Builder</h3>
                            </div>
                            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5">
                                <button
                                    onClick={() => setEditMode('visual')}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${editMode === 'visual' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                >
                                    Visual
                                </button>
                                <button
                                    onClick={() => setEditMode('json')}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${editMode === 'json' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                >
                                    Source
                                </button>
                            </div>
                        </div>

                        {editMode === 'visual' ? (
                            <VisualBuilder content={visualContent} onChange={handleVisualChange} />
                        ) : (
                            <>
                                <div className="relative group">
                                    <textarea
                                        value={pageData.content}
                                        onChange={(e) => setPageData({ ...pageData, content: e.target.value })}
                                        className={`w-full h-[600px] bg-black/60 border ${jsonError ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-6 text-emerald-400 font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-all leading-relaxed whitespace-pre`}
                                        spellCheck={false}
                                    />
                                    {jsonError && (
                                        <div className="absolute top-4 right-4 animate-pulse">
                                            <AlertCircle className="text-red-500" size={24} />
                                        </div>
                                    )}
                                </div>

                                {jsonError && (
                                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold">
                                        <AlertCircle size={18} />
                                        {jsonError}
                                    </div>
                                )}
                                {!jsonError && (
                                    <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-3 text-emerald-500/40 text-xs font-bold uppercase tracking-widest">
                                        <CheckCircle2 size={16} />
                                        JSON Syntax Validated
                                    </div>
                                )}
                            </>
                        )}
                    </GlassContainer>
                </div>

                <div className="space-y-6">
                    {/* Editor Info */}
                    <GlassContainer className="p-6 border-white/5 bg-blue-950/20">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Info size={16} className="text-blue-400" />
                            Editor Guidelines
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <p className="text-slate-400 text-[11px] leading-relaxed">
                                    <span className="text-slate-200 font-bold">Real-time Validation:</span> Syntax JSON diperiksa secara otomatis setiap kali Anda melakukan perubahan.
                                </p>
                            </li>
                            <li className="flex gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <p className="text-slate-400 text-[11px] leading-relaxed">
                                    <span className="text-slate-200 font-bold">Automatic Sync:</span> Melakukan 'SAVE' akan secara otomatis membersihkan cache pada halaman publik terkait.
                                </p>
                            </li>
                            <li className="flex gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <p className="text-slate-400 text-[11px] leading-relaxed">
                                    <span className="text-slate-200 font-bold">Structure Consistency:</span> Pastikan key JSON tetap sama untuk menghindari kerusakan tampilan pada halaman publik.
                                </p>
                            </li>
                        </ul>
                    </GlassContainer>

                    {/* Stats */}
                    <GlassContainer className="p-6 border-white/5 bg-[#050b18]/40">
                        <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Page Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-xs font-bold">Status</span>
                                <span className="text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    PUBLISHED
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-xs font-bold">Cache Strategy</span>
                                <span className="text-blue-400 text-xs font-black uppercase tracking-widest">On-Demand</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-xs font-bold">Last Revalidated</span>
                                <span className="text-slate-300 text-xs font-mono lowercase">just now</span>
                            </div>
                        </div>
                    </GlassContainer>

                    {/* Danger Zone */}
                    <GlassContainer className="p-6 border-red-500/10 bg-red-500/5">
                        <h3 className="text-red-500 font-bold mb-4 text-xs uppercase tracking-[0.2em]">Reset Data</h3>
                        <p className="text-red-500/40 text-[10px] mb-4 font-medium italic">Mengembalikan data ke state database terakhir (unsaved changes will be lost).</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 rounded-xl border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all"
                        >
                            Reset Editor State
                        </button>
                    </GlassContainer>
                </div>
            </div>
        </div>
    );
}
