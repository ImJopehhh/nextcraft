"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Search, Filter, MoreVertical, Shield, Trash2, Edit, X, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export default function AccountsPage() {
    const { showToast } = useToast();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "ADMIN"
    });

    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editMode ? `/api/admin/users/${currentUser.id}` : "/api/admin/users";
            const method = editMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchUsers();
                resetForm();
                showToast(editMode ? "Admin updated successfully!" : "New admin created!", "success");
            } else {
                showToast("Operation failed. Please check your data.", "error");
            }
        } catch (error) {
            console.error("Error saving user", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this admin?")) return;

        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchUsers();
                showToast("Admin deleted successfully", "success");
            } else {
                showToast("Failed to delete admin", "error");
            }
        } catch (error) {
            showToast("An error occurred while deleting", "error");
            console.error("Error deleting user", error);
        }
    };

    const openEdit = (user: any) => {
        setEditMode(true);
        setCurrentUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: "", // Leave empty to keep unchanged
            role: user.role
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({ username: "", email: "", password: "", role: "ADMIN" });
        setEditMode(false);
        setCurrentUser(null);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Admin Accounts</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage system administrators access and roles.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm"
                >
                    <UserPlus size={18} />
                    ADD NEW ADMIN
                </button>
            </div>

            <div className="bg-[#050b18]/40 border border-blue-900/10 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl">
                <div className="p-6 border-b border-blue-900/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search admin..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Joined</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-900/10">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-600 p-0.5 shadow-lg shadow-blue-500/10">
                                                <img src={`https://ui-avatars.com/api/?name=${user.username}&background=2563eb&color=fff`} className="w-full h-full object-cover rounded-[10px]" alt="user" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{user.username}</p>
                                                <p className="text-xs font-medium text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest 
                                            ${user.role === 'WEBMASTER' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' :
                                                user.role === 'DEVELOPER' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                                            <Shield size={12} />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-400 font-medium">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(user)} className="p-2 hover:bg-blue-500/20 rounded-lg text-slate-500 hover:text-blue-500 transition-all">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-slate-500 hover:text-red-500 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0b1121] border border-blue-900/20 rounded-3xl p-8 w-full max-w-lg relative z-[101] shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-white">{editMode ? "Edit Admin" : "Add New Admin"}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
                                    <input
                                        type="text" required value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                                    <input
                                        type="email" required value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password {editMode && "(Leave empty to keep)"}</label>
                                    <input
                                        type="password" required={!editMode} value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                                    >
                                        <option value="ADMIN" className="bg-[#0b1121]">ADMIN</option>
                                        <option value="DEVELOPER" className="bg-[#0b1121]">DEVELOPER</option>
                                        <option value="WEBMASTER" className="bg-[#0b1121]">WEBMASTER</option>
                                    </select>
                                </div>

                                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-4 transition-all">
                                    {loading ? "SAVING..." : "SAVE CHANGES"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
