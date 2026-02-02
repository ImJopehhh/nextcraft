"use client";

import { motion } from "framer-motion";
import { Code2, Layout, Database, Rocket, Layers, Smartphone } from "lucide-react";

const features = [
    {
        icon: <Code2 size={24} className="text-blue-500" />,
        title: "Clean Code",
        desc: "Kami menulis kode yang bersih, efisien, dan mudah dipelihara untuk jangka panjang.",
    },
    {
        icon: <Layout size={24} className="text-blue-500" />,
        title: "Modern UI/UX",
        desc: "Desain antarmuka yang memukau dan pengalaman pengguna yang intuitif.",
    },
    {
        icon: <Database size={24} className="text-blue-500" />,
        title: "Scalable Backend",
        desc: "Sistem backend yang tangguh dan siap menangani pertumbuhan traffic yang pesat.",
    },
    {
        icon: <Rocket size={24} className="text-blue-500" />,
        title: "Ultra Speed",
        desc: "Optimasi performa tingkat tinggi untuk waktu muat yang sangat singkat.",
    },
    {
        icon: <Layers size={24} className="text-blue-500" />,
        title: "Customizable",
        desc: "Solusi yang disesuaikan sepenuhnya dengan kebutuhan spesifik bisnis Anda.",
    },
    {
        icon: <Smartphone size={24} className="text-blue-500" />,
        title: "Responsive",
        desc: "Tampilan yang sempurna di semua perangkat, mulai dari ponsel hingga desktop.",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-[#0a1226]/50">
            <div className="container mx-auto px-6 text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-blue-500 font-bold uppercase tracking-[0.2em] text-sm mb-4">Core Features</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-6">Built For Excellence</h3>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Gunakan fitur tercanggih untuk mempercepat pengembangan proyek Anda dan mencapai hasil maksimal.
                    </p>
                </motion.div>
            </div>

            <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="group p-8 rounded-3xl bg-blue-950/20 border border-blue-900/30 hover:bg-blue-600/10 hover:border-blue-500/50 transition-all"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>
                        <h4 className="text-xl font-bold text-white mb-4">{feature.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            {feature.desc}
                        </p>
                        <button className="text-blue-400 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all hover:text-blue-300">
                            Lihat selengkapnya <Code2 size={16} />
                        </button>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
