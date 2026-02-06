"use client";

import { useState, useEffect } from "react";
import { Save, Info, LayoutTemplate, Type, Zap, Users, X } from "lucide-react";
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
    const [formData, setFormData] = useState<any>({
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
        featuresList: [],
        teamTitle: "",
        teamSubtitle: "",
        teamList: []
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch("/api/content/home");
            if (res.ok) {
                const data = await res.json();

                const preparedData = {
                    ...data,
                    featuresList: typeof data.featuresList === 'string' ? JSON.parse(data.featuresList) : (data.featuresList || []),
                    teamList: typeof data.teamList === 'string' ? JSON.parse(data.teamList) : (data.teamList || [])
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
            // Data is already arrays in state, API expects body which we stringify anyway
            if (!Array.isArray(formData.featuresList) || !Array.isArray(formData.teamList)) {
                throw new Error("Invalid list format");
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
            showToast("An error occurred during save", "error");
        } finally {
            setLoading(false);
        }
    };

    const updateFeature = (index: number, field: string, value: string) => {
        const newList = [...formData.featuresList];
        newList[index] = { ...newList[index], [field]: value };
        setFormData({ ...formData, featuresList: newList });
    };

    const removeFeature = (index: number) => {
        setFormData({ ...formData, featuresList: formData.featuresList.filter((_: any, i: number) => i !== index) });
    };

    const addFeature = () => {
        setFormData({
            ...formData,
            featuresList: [...formData.featuresList, { icon: "Zap", title: "New Feature", desc: "Description here" }]
        });
    };

    const updateMember = (index: number, field: string, value: string) => {
        const newList = [...formData.teamList];
        newList[index] = { ...newList[index], [field]: value };
        setFormData({ ...formData, teamList: newList });
    };

    const removeMember = (index: number) => {
        setFormData({ ...formData, teamList: formData.teamList.filter((_: any, i: number) => i !== index) });
    };

    const addMember = () => {
        setFormData({
            ...formData,
            teamList: [...formData.teamList, { name: "New Member", role: "Role", image: "https://i.pravatar.cc/150" }]
        });
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
                        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2">
                                <Zap size={18} className="text-blue-500" />
                                <h3 className="text-lg font-bold text-white">Features Section</h3>
                            </div>
                            <button
                                onClick={addFeature}
                                className="px-4 py-2 bg-blue-600/10 text-blue-500 rounded-xl text-xs font-bold hover:bg-blue-600/20 transition-all"
                            >
                                + ADD FEATURE
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
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
                            </div>

                            <div className="grid gap-4">
                                {formData.featuresList.map((feature: any, index: number) => (
                                    <div key={index} className="p-6 bg-black/20 rounded-2xl border border-white/5 relative group">
                                        <button
                                            onClick={() => removeFeature(index)}
                                            className="absolute top-4 right-4 text-red-500/50 hover:text-red-500 p-1 transition-all"
                                            title="Remove Feature"
                                        >
                                            <X size={14} />
                                        </button>
                                        <div className="grid grid-cols-3 gap-4">
                                            <InputGroup
                                                label="Icon (Lucide Name)"
                                                value={feature.icon}
                                                onChange={(v: string) => updateFeature(index, 'icon', v)}
                                            />
                                            <div className="col-span-2">
                                                <InputGroup
                                                    label="Title"
                                                    value={feature.title}
                                                    onChange={(v: string) => updateFeature(index, 'title', v)}
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <InputGroup
                                                    label="Description"
                                                    value={feature.desc}
                                                    onChange={(v: string) => updateFeature(index, 'desc', v)}
                                                    isTextArea
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="bg-[#050b18]/40 border border-blue-900/10 p-8 rounded-[2.5rem] backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2">
                                <Users size={18} className="text-blue-500" />
                                <h3 className="text-lg font-bold text-white">Team Section</h3>
                            </div>
                            <button
                                onClick={addMember}
                                className="px-4 py-2 bg-blue-600/10 text-blue-500 rounded-xl text-xs font-bold hover:bg-blue-600/20 transition-all"
                            >
                                + ADD MEMBER
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
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
                            </div>

                            <div className="grid gap-4">
                                {formData.teamList.map((member: any, index: number) => (
                                    <div key={index} className="p-6 bg-black/20 rounded-2xl border border-white/5 relative group">
                                        <button
                                            onClick={() => removeMember(index)}
                                            className="absolute top-4 right-4 text-red-500/50 hover:text-red-500 p-1 transition-all"
                                            title="Remove Member"
                                        >
                                            <X size={14} />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputGroup
                                                label="Name"
                                                value={member.name}
                                                onChange={(v: string) => updateMember(index, 'name', v)}
                                            />
                                            <InputGroup
                                                label="Role"
                                                value={member.role}
                                                onChange={(v: string) => updateMember(index, 'role', v)}
                                            />
                                            <div className="col-span-2">
                                                <InputGroup
                                                    label="Image URL"
                                                    value={member.image}
                                                    onChange={(v: string) => updateMember(index, 'image', v)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
