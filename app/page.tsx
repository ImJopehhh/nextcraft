"use client";

import LoadingScreen from "@/components/home/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import AboutUs from "@/components/home/AboutUs";
import Features from "@/components/home/Features";
import Team from "@/components/home/Team";
import Footer from "@/components/Footer";
import { motion, useScroll, useSpring } from "framer-motion";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative bg-[#050b18] min-h-screen selection:bg-blue-500/30 selection:text-blue-200">
      <LoadingScreen />

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      <div className="flex flex-col">
        <Hero />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <AboutUs />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Features />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Team />
        </motion.div>

        <Footer />
      </div>

      {/* Ambient background noise/texture could be added here if needed */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] grayscale bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
    </main>
  );
}
