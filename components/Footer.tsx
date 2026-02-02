"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="pt-24 pb-12 bg-[#050b18] border-t border-blue-900/20">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center font-bold text-white">N</div>
                            <span className="text-xl font-black text-white tracking-tighter">NEXT<span className="text-blue-500">CRAFT</span></span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                            Membangun masa depan digital dengan inovasi tanpa batas. Kami solusi terbaik untuk kebutuhan bisnis modern Anda.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-blue-950/40 border border-blue-900/30 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all"><Github size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-blue-950/40 border border-blue-900/30 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all"><Twitter size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-blue-950/40 border border-blue-900/30 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all"><Linkedin size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-blue-950/40 border border-blue-900/30 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all"><Instagram size={18} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            {["Home", "About Us", "Services", "Portfolio", "Contact"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-slate-500 hover:text-blue-400 text-sm transition-all">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Services</h4>
                        <ul className="space-y-4">
                            {["Web Development", "UI/UX Design", "Mobile Apps", "Cloud Solutions", "Maintenance"].map((service) => (
                                <li key={service}>
                                    <a href="#" className="text-slate-500 hover:text-blue-400 text-sm transition-all">{service}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Contact Info</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-slate-500 text-sm">
                                <MapPin size={18} className="text-blue-500 shrink-0" />
                                <span>Jl. Inovasi Digital No. 123, Jakarta, Indonesia</span>
                            </li>
                            <li className="flex gap-3 text-slate-500 text-sm">
                                <Phone size={18} className="text-blue-500 shrink-0" />
                                <span>+62 123 4567 890</span>
                            </li>
                            <li className="flex gap-3 text-slate-500 text-sm">
                                <Mail size={18} className="text-blue-500 shrink-0" />
                                <span>hello@nextcraft.id</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-blue-900/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-xs">
                    <p>© 2026 NextCraft. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
