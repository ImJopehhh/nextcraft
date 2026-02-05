"use client";

import { useState, useEffect } from "react";
import { Save, Info, LayoutTemplate, Type, Zap, Users } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { BcodeParser } from "@/lib/bcode";

// -- Components moved OUTSIDE to prevent re-creation and focus loss --

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/10">
        <Icon size={18} className="text-blue-500" />
        <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
);

const InputGroup = ({ label, value, onChange, placeholder, isTextArea = false }: any) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
        {isTextArea ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium text-sm min-h-[100px]"
                placeholder={placeholder}
            />
        ) : (
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm"
                placeholder={placeholder}
            />
        )}
    </div>
);

export default function HomePageEditor() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        heroBadge: "",
        heroTitle: "",
        heroDescription: "",
        heroBtnPrimary: "",
        heroBtnSecondary: "",
        aboutSubtitle: "",
        aboutTitle: "",
        aboutDescription: "",
        aboutImage: "",
        featuresTitle: "",
        featuresSubtitle: "",
        featuresList: "", // JSON string
        teamTitle: "",
        teamSubtitle: "",
        teamList: "" // JSON string
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch("/api/content/home");
            if (res.ok) {
                const data = await res.json();
                // Ensure arrays are stringified for editing (simple approach) or handle as objects
                // API returns parsed JSON for headers but our form expects strings for now or we build array editors
                // For simplicity/robustness, let's keep them as JSON strings in the edit box unless we build a complex list editor
                // But the DB returns object/array.

                // Correction: The API returns the raw object from DB. If featuresList is JSON type in prisma, 
                // it comes as object. We need to stringify it for the text area editor.

                const preparedData = {
                    ...data,
                    featuresList: typeof data.featuresList === 'object' ? JSON.stringify(data.featuresList, null, 2) : data.featuresList,
                    teamList: typeof data.teamList === 'object' ? JSON.stringify(data.teamList, null, 2) : data.teamList
                };

                setFormData(preparedData);
            }
        } catch (e) {
            showToast("Failed to load content", "error");
        } finally {
            setFetching(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Validate JSON
            try {
                JSON.parse(formData.featuresList);
                JSON.parse(formData.teamList);
            } catch (jsonErr) {
                showToast("Invalid JSON in Features or Team list", "error");
                setLoading(false);
                return;
            }

            const res = await fetch("/api/content/home", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                showToast("Content updated successfully!", "success");
            } else {
                showToast("Failed to update content", "error");
            }
        } catch (error) {
            showToast("An error occurred", "error");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center text-slate-500">Loading editor...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Home Page Editor</h1>
                    <p className="text-slate-500 text-sm font-medium">Customize your landing page content and styles.</p>
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
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero Section */}
                    <div className="bg-[#050b18]/40 border border-blue-900/10 p-8 rounded-[2.5rem] backdrop-blur-sm">
                        <SectionHeader icon={LayoutTemplate} title="Hero Section" />
                        <div className="space-y-6">
                            <InputGroup
                                label="Badge Text"
                                value={formData.heroBadge}
                                onChange={(v: string) => setFormData({ ...formData, heroBadge: v })}
                            />

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Hero Title (Supports Bcode)
                                </label>
                                <input
                                    type="text"
                                    value={formData.heroTitle}
                                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm"
                                />
                                <div className="text-xs bg-black/40 p-3 rounded-lg border border-white/5">
                                    Preview: <BcodeParser text={formData.heroTitle} className="text-lg" />
                                </div>
                            </div>

                            <InputGroup
                                label="Description"
                                value={formData.heroDescription}
                                onChange={(v: string) => setFormData({ ...formData, heroDescription: v })}
                                isTextArea
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup
                                    label="Primary Button"
                                    value={formData.heroBtnPrimary}
                                    onChange={(v: string) => setFormData({ ...formData, heroBtnPrimary: v })}
                                />
                                <InputGroup
                                    label="Secondary Button"
                                    value={formData.heroBtnSecondary}
                                    onChange={(v: string) => setFormData({ ...formData, heroBtnSecondary: v })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-[#050b18]/40 border border-blue-900/10 p-8 rounded-[2.5rem] backdrop-blur-sm">
                        <SectionHeader icon={Info} title="About Section" />
                        <div className="space-y-6">
                            <InputGroup
                                label="Subtitle"
                                value={formData.aboutSubtitle}
                                onChange={(v: string) => setFormData({ ...formData, aboutSubtitle: v })}
                            />

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    About Title (Supports Bcode)
                                </label>
                                <input
                                    type="text"
                                    value={formData.aboutTitle}
                                    onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm"
                                />
                                <div className="text-xs bg-black/40 p-3 rounded-lg border border-white/5">
                                    Preview: <BcodeParser text={formData.aboutTitle} className="text-lg" />
                                </div>
                            </div>

                            <InputGroup
                                label="Description"
                                value={formData.aboutDescription}
                                onChange={(v: string) => setFormData({ ...formData, aboutDescription: v })}
                                isTextArea
                            />

                            <InputGroup
                                label="Image URL"
                                value={formData.aboutImage}
                                onChange={(v: string) => setFormData({ ...formData, aboutImage: v })}
                            />
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="bg-[#050b18]/40 border border-blue-900/10 p-8 rounded-[2.5rem] backdrop-blur-sm">
                        <SectionHeader icon={Zap} title="Features Section" />
                        <div className="space-y-6">
                            <InputGroup
                                label="Subtitle"
                                value={formData.featuresSubtitle}
                                onChange={(v: string) => setFormData({ ...formData, featuresSubtitle: v })}
                            />
                            <InputGroup
                                label="Title"
                                value={formData.featuresTitle}
                                onChange={(v: string) => setFormData({ ...formData, featuresTitle: v })}
                            />
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Features List (JSON)</label>
                                <textarea
                                    value={formData.featuresList}
                                    onChange={(e) => setFormData({ ...formData, featuresList: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white font-mono text-xs min-h-[150px]"
                                    placeholder='[{"title": "...", "desc": "...", "icon": "Zap"}]'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="bg-[#050b18]/40 border border-blue-900/10 p-8 rounded-[2.5rem] backdrop-blur-sm">
                        <SectionHeader icon={Users} title="Team Section" />
                        <div className="space-y-6">
                            <InputGroup
                                label="Subtitle"
                                value={formData.teamSubtitle}
                                onChange={(v: string) => setFormData({ ...formData, teamSubtitle: v })}
                            />
                            <InputGroup
                                label="Title"
                                value={formData.teamTitle}
                                onChange={(v: string) => setFormData({ ...formData, teamTitle: v })}
                            />
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Team List (JSON)</label>
                                <textarea
                                    value={formData.teamList}
                                    onChange={(e) => setFormData({ ...formData, teamList: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white font-mono text-xs min-h-[150px]"
                                    placeholder='[{"name": "...", "role": "...", "image": "..."}]'
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-blue-600/10 border border-blue-600/20 p-8 rounded-[2.5rem] backdrop-blur-sm sticky top-6">
                        <div className="flex items-center gap-3 text-blue-500 mb-6">
                            <Type size={24} />
                            <h3 className="font-black tracking-tight">Bcode Guide</h3>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-slate-400 mb-4">Use these codes to color your text:</p>

                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                <span className="text-blue-500">&b Aqua</span>
                                <span className="text-red-500">&c Red</span>
                                <span className="text-green-500">&a Green</span>
                                <span className="text-yellow-400">&e Yellow</span>
                                <span className="text-pink-500">&d Pink</span>
                                <span className="text-yellow-600">&6 Gold</span>
                                <span className="font-bold text-white">&l Bold</span>
                                <span className="text-gray-400">&r Reset</span>
                            </div>

                            <div className="mt-6 pt-6 border-t border-blue-500/20">
                                <p className="text-xs text-slate-500">
                                    Example: <br />
                                    <span className="text-white font-mono bg-black/30 px-2 py-1 rounded">Hello &bWorld</span>
                                    <br />becomes<br />
                                    <span>Hello <span className="text-cyan-500">World</span></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
