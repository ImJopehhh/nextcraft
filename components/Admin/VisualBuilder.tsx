"use client";

import { Plus, Trash2, GripVertical, Type, Layout, List as ListIcon, Info, Shield, Globe } from "lucide-react";
import { BcodeParser } from "@/lib/bcode";

interface VisualBuilderProps {
    content: any;
    onChange: (newContent: any) => void;
}

export default function VisualBuilder({ content, onChange }: VisualBuilderProps) {

    const updateHero = (field: string, value: string) => {
        onChange({
            ...content,
            hero: { ...content.hero, [field]: value }
        });
    };

    const updateArrayItem = (key: string, index: number, field: string, value: any) => {
        const newList = [...content[key]];
        newList[index] = { ...newList[index], [field]: value };
        onChange({ ...content, [key]: newList });
    };

    const removeArrayItem = (key: string, index: number) => {
        onChange({ ...content, [key]: content[key].filter((_: any, i: number) => i !== index) });
    };

    const addArrayItem = (key: string, template: any) => {
        onChange({ ...content, [key]: [...(content[key] || []), template] });
    };

    const updateSimpleArrayItem = (key: string, index: number, value: string) => {
        const newList = [...content[key]];
        newList[index] = value;
        onChange({ ...content, [key]: newList });
    };

    const addSimpleArrayItem = (key: string) => {
        onChange({ ...content, [key]: [...(content[key] || []), "New Item"] });
    };

    const renderHeroEditor = () => {
        if (!content.hero) return null;
        return (
            <div className="bg-blue-900/10 border border-blue-900/20 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Layout size={18} className="text-blue-500" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Hero Section</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Badge</label>
                        <input
                            type="text"
                            value={content.hero.badge || ""}
                            onChange={(e) => updateHero("badge", e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-white text-sm focus:border-blue-500/50 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Title (supports Bcode)</label>
                        <input
                            type="text"
                            value={content.hero.title || ""}
                            onChange={(e) => updateHero("title", e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-white text-sm focus:border-blue-500/50 outline-none font-bold"
                        />
                        <div className="text-[10px] text-slate-500 mt-1 pl-1">
                            Preview: <BcodeParser text={content.hero.title || ""} />
                        </div>
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Description</label>
                    <textarea
                        value={content.hero.desc || ""}
                        onChange={(e) => updateHero("desc", e.target.value)}
                        className="w-full h-24 bg-black/40 border border-white/5 rounded-xl p-3 text-white text-sm focus:border-blue-500/50 outline-none resize-none"
                    />
                </div>
            </div>
        );
    };

    const renderListEditor = (key: string, label: string, fields: { key: string, label: string, type?: string }[]) => {
        const list = content[key];
        if (!list || !Array.isArray(list)) return null;

        const template = fields.reduce((acc, f) => ({ ...acc, [f.key]: f.type === 'number' ? 0 : "" }), {});

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ListIcon size={18} className="text-emerald-500" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">{label}</h3>
                    </div>
                    <button
                        onClick={() => addArrayItem(key, template)}
                        className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {list.map((item: any, i: number) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 relative group">
                            <button
                                onClick={() => removeArrayItem(key, i)}
                                className="absolute -top-2 -right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <Trash2 size={12} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {fields.map((field) => (
                                    <div key={field.key} className="space-y-1">
                                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">{field.label}</label>
                                        <input
                                            type={field.type === 'number' ? 'number' : 'text'}
                                            value={item[field.key] || ""}
                                            onChange={(e) => updateArrayItem(key, i, field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                                            className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-white text-xs focus:border-blue-500/30 outline-none font-medium"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSimpleListEditor = (key: string, label: string) => {
        const list = content[key];
        if (!list || !Array.isArray(list)) return null;

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Type size={18} className="text-purple-500" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">{label}</h3>
                    </div>
                    <button
                        onClick={() => addSimpleArrayItem(key)}
                        className="p-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-all"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {list.map((item: string, i: number) => (
                        <div key={i} className="flex items-center bg-white/5 border border-white/5 rounded-xl px-3 py-2 group">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => updateSimpleArrayItem(key, i, e.target.value)}
                                className="bg-transparent border-none outline-none text-white text-xs font-bold w-24"
                            />
                            <button
                                onClick={() => removeArrayItem(key, i)}
                                className="ml-2 text-slate-500 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-10">
            {renderHeroEditor()}

            {/* Server Sections */}
            {renderListEditor("stats", "Server Stats", [{ key: "label", label: "Label" }, { key: "value", label: "Value" }, { key: "status", label: "Status" }])}
            {renderListEditor("nodes", "Network Nodes", [{ key: "name", label: "Node Name" }, { key: "status", label: "Status" }, { key: "load", label: "Load" }, { key: "type", label: "Type" }])}

            {/* Rules Section (with items support) */}
            {content.rules && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="text-blue-500" size={18} />
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Rule Categories</h3>
                        </div>
                        <button
                            onClick={() => addArrayItem("rules", { category: "New Category", items: ["New Rule"] })}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    {content.rules.map((rule: any, i: number) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <input
                                    value={rule.category || ""}
                                    onChange={(e) => updateArrayItem("rules", i, "category", e.target.value)}
                                    className="bg-transparent border-none outline-none text-white font-black text-lg w-full"
                                    placeholder="Category Name"
                                />
                                <button onClick={() => removeArrayItem("rules", i)} className="text-red-500/40 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {rule.items?.map((item: string, j: number) => (
                                    <div key={j} className="flex items-center bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 text-xs text-slate-300">
                                        <input
                                            value={item}
                                            onChange={(e) => {
                                                const newItems = [...rule.items];
                                                newItems[j] = e.target.value;
                                                updateArrayItem("rules", i, "items", newItems);
                                            }}
                                            className="bg-transparent border-none outline-none w-32 font-medium"
                                        />
                                        <button onClick={() => {
                                            updateArrayItem("rules", i, "items", rule.items.filter((_: any, idx: number) => idx !== j));
                                        }} className="ml-2 hover:text-red-500"><Trash2 size={10} /></button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => updateArrayItem("rules", i, "items", [...(rule.items || []), "New Rule"])}
                                    className="px-3 py-1.5 rounded-xl border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/10"
                                >
                                    + ADD RULE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Connection Section */}
            {content.connection && (
                <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe size={18} className="text-blue-400" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Connection Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['ip', 'version', 'discord'].map(f => (
                            <div key={f} className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{f}</label>
                                <input
                                    value={content.connection[f] || ""}
                                    onChange={(e) => onChange({ ...content, connection: { ...content.connection, [f]: e.target.value } })}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-white text-sm focus:border-blue-500/50 outline-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Support Form Info */}
            {content.form_info && (
                <div className="space-y-6">
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Bug Report Form Settings</h4>
                        <div className="space-y-6">
                            {renderSimpleListEditor("urgency", "Urgency Levels")}
                            {renderSimpleListEditor("categories", "Bug Categories")}
                        </div>
                    </div>
                </div>
            )}

            {/* Community Sections */}
            {renderListEditor("threads", "Trending Threads", [{ key: "title", label: "Title" }, { key: "author", label: "Author" }, { key: "replies", label: "Replies", type: "number" }, { key: "category", label: "Category" }])}
            {renderListEditor("events", "Events List", [{ key: "title", label: "Event Title" }, { key: "date", label: "Date" }, { key: "prize", label: "Prize Pool" }])}
            {renderListEditor("images", "Gallery Images", [{ key: "title", label: "Title" }, { key: "user", label: "Contributor" }, { key: "url", label: "Image URL" }])}
            {renderListEditor("updates", "Update Logs", [{ key: "title", label: "Title" }, { key: "date", label: "Date" }, { key: "type", label: "Type" }])}

            {/* Support Sections */}
            {renderListEditor("sections", "Help Hub Sections", [{ key: "title", label: "Title" }, { key: "desc", label: "Description" }, { key: "icon", label: "Lucide Icon Name" }])}
            {renderListEditor("faqs", "FAQ Items", [{ key: "q", label: "Question" }, { key: "a", label: "Answer" }])}
            {renderListEditor("channels", "Contact Channels", [{ key: "name", label: "Platform" }, { key: "identifier", label: "Contact Info" }, { key: "type", label: "Type" }])}
            {renderSimpleListEditor("ticket_types", "Support Ticket Types")}

            {/* Leaderboard Sections */}
            {renderListEditor("rankings", "Global Rankings", [{ key: "name", label: "Player" }, { key: "stat", label: "Stat Value" }, { key: "category", label: "Category" }])}
            {renderSimpleListEditor("months", "Active Season Months")}
            {renderListEditor("data", "Monthly Leaderboard", [{ key: "name", label: "Player" }, { key: "stat", label: "Stat" }, { key: "category", label: "Category" }])}
            {renderListEditor("legends", "Hall of Fame Legends", [{ key: "name", label: "Name" }, { key: "role", label: "Role/Title" }, { key: "year", label: "Induction Year" }])}
            {renderListEditor("milestones", "Network Milestones", [{ key: "title", label: "Title" }, { key: "status", label: "Status" }, { key: "date", label: "Date" }, { key: "progress", label: "Progress %" }])}

            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3 text-blue-400">
                <Info size={18} className="shrink-0" />
                <p className="text-[10px] font-medium leading-relaxed uppercase tracking-wider">
                    Visual Editor mempermudah pengisian konten. Gunakan tab <span className="font-black text-white">SOURCE</span> untuk struktur JSON yang lebih kompleks atau modifikasi mendalam.
                </p>
            </div>
        </div>
    );
}
