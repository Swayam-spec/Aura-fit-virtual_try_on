"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { MagneticButton } from "@/components/MagneticButton";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";

const STAGGER_DELAY = 0.1;

export default function Home() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const cardsY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const cardsRotateX = useTransform(scrollYProgress, [0, 1], [0, 20]);

  return (
    <main ref={containerRef} className="relative w-full min-h-[150vh] flex flex-col items-center pt-40 px-6 overflow-hidden">
      {/* 3D Background Gradient */}
      <div className="absolute top-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,rgba(138,43,226,0.15)_0%,rgba(0,0,0,0)_50%)]" />

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center max-w-4xl max-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-electric-violet/30 bg-electric-violet/10 text-electric-violet text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen Virtual Try-On</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: STAGGER_DELAY, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6"
        >
          See Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-violet to-cyber-blue">
            Aura
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: STAGGER_DELAY * 2, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl"
        >
          Experience clothing like never before. High-end AI rendering meets immersive reality.
          Upload a model, choose a garment, and watch the magic unfold.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: STAGGER_DELAY * 3, ease: "easeOut" }}
        >
          <MagneticButton
            glow
            onClick={() => router.push("/workspace")}
            className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-4"
          >
            Enter Workspace <ArrowRight className="w-5 h-5 ml-2" />
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll-Linked Cards Section */}
      <motion.div
        style={{ y: cardsY, rotateX: cardsRotateX, perspective: 1000 }}
        className="mt-32 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 pb-32"
      >
        {["AI Precision", "Studio Lighting", "Fabric Physics"].map((feat, i) => (
          <motion.div
            key={feat}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            whileHover={{ y: -10, rotateY: 5 }}
            className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{feat}</h3>
            <p className="text-white/50 relative z-10">
              Our models capture the subtlest details, creating a luxury experience that feels entirely real.
            </p>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
