"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Team({ content }: { content: any }) {
    if (!content) return null;

    let team: any[] = [];
    try {
        team = typeof content.teamList === 'string'
            ? JSON.parse(content.teamList)
            : content.teamList || [];
    } catch (e) {
        console.error("Failed to parse team list", e);
    }

    return (
        <section id="team" className="py-24 bg-[#050b18]">
            <div className="container mx-auto px-6 text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-blue-500 font-bold uppercase tracking-[0.2em] text-sm mb-4">{content.teamSubtitle}</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-6">{content.teamTitle}</h3>
                </motion.div>
            </div>

            <div className="container mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="group relative overflow-hidden rounded-3xl bg-blue-950/20 border border-blue-900/30 p-4 hover:border-blue-500/40 transition-all"
                    >
                        <div className="h-64 rounded-2xl overflow-hidden mb-6 relative">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                            />
                            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                <a href="#" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 shadow-xl"><Github size={18} /></a>
                                <a href="#" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 shadow-xl"><Linkedin size={18} /></a>
                                <a href="#" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 shadow-xl"><Twitter size={18} /></a>
                            </div>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
                        <p className="text-blue-500 text-sm font-semibold">{member.role}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
