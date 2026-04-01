"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { MagneticButton } from "@/components/MagneticButton";
import { ArrowRight, Sparkles, Shirt, Scissors, Zap } from "lucide-react";
import { useRef } from "react";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

const STAGGER_DELAY = 0.1;

const Background3D = () => {
  return (
    <div className="absolute top-[20%] w-full h-[600px] flex items-center justify-center -z-10 pointer-events-none opacity-40 overflow-hidden" style={{ perspective: "1000px" }}>
      <motion.div
        animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="relative w-96 h-96"
        style={{ transformStyle: "preserve-3d" }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 border-[3px] border-primary/40 rounded-full"
            style={{ transform: `rotateY(${i * 22.5}deg) rotateX(${i * 15}deg)` }}
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <div
            key={`x-${i}`}
            className="absolute w-full h-full border border-secondary/60 rounded-full"
            style={{ transform: `rotateZ(${i * 45}deg) scale(1.1)` }}
          />
        ))}
      </motion.div>
    </div>
  );
};

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
    <main ref={containerRef} className="relative w-full flex flex-col items-center pt-32 px-6 overflow-hidden bg-background">
      
      {/* Deep Theme Background Blob */}
      <div className="absolute top-0 w-full h-[1200px] -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/0.25)_0%,theme(colors.secondary/0.15)_40%,theme(colors.background)_100%)]" />

      {/* 3D Animated Object */}
      <Background3D />

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center max-w-5xl mb-24 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-bold tracking-wide mb-8 shadow-sm backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>The Future of Fashion E-Commerce</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: STAGGER_DELAY, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-black tracking-tight mb-6 text-foreground"
        >
          Elevate Your{" "}
          <span className="text-primary italic font-serif font-light mr-2">
            Style
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: STAGGER_DELAY * 2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-3xl font-medium leading-relaxed"
        >
          Experience clothing like never before. High-end AI rendering meets luxury aesthetics.
          Upload a model, choose a garment, and watch digital couture unfold instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: STAGGER_DELAY * 3, ease: "easeOut" }}
        >
          <MagneticButton
            glow
            onClick={() => router.push("/workspace")}
            className="bg-primary text-black hover:bg-primary/90 text-lg px-10 py-5 shadow-xl shadow-primary/20"
          >
            Enter Studio <ArrowRight className="w-5 h-5 ml-2" />
          </MagneticButton>
        </motion.div>
      </div>

      {/* Interactive Slider Wow-Factor */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-full max-w-6xl mb-40 relative px-4 md:px-0"
      >
        <BeforeAfterSlider 
          beforeImage="/demo/vto_before.png" 
          afterImage="/demo/vto_after.png" 
        />
        <div className="absolute -bottom-16 left-0 right-0 text-center text-sm font-medium text-foreground/40 uppercase tracking-widest">
          Drag slider to compare
        </div>
      </motion.div>

      {/* Visual Stepper "How it works" */}
      <div className="w-full max-w-6xl mb-40 text-center">
        <h2 className="text-4xl font-bold mb-16 text-foreground">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          <div className="hidden md:block absolute top-[20%] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

          {[
            { icon: Shirt, title: "1. Upload Subject", desc: "Start with any high-quality portrait or full body shot." },
            { icon: Scissors, title: "2. Select Garment", desc: "Choose a top, bottom, or dress to overlay." },
            { icon: Zap, title: "3. AI Generation", desc: "Our neural engine stitches the fabric seamlessly in seconds." }
          ].map((step, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              key={step.title}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-background border border-border shadow-lg flex items-center justify-center mb-6 text-primary">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-foreground/60 leading-relaxed max-w-[250px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll-Linked Cards Section */}
      <div className="w-full bg-black/5 py-32 border-t border-border flex justify-center">
        <motion.div
          style={{ y: cardsY, rotateX: cardsRotateX, perspective: 1000 }}
          className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 px-6"
        >
          {["AI Precision", "Studio Lighting", "Fabric Physics"].map((feat, i) => (
            <motion.div
              key={feat}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -10, rotateY: 5 }}
              className="group relative p-10 rounded-[2rem] bg-background border border-border shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-2xl font-bold text-foreground mb-4 relative z-10">{feat}</h3>
              <p className="text-foreground/60 relative z-10 leading-relaxed font-light">
                Our models capture the subtlest details, creating a luxury experience that feels entirely real to your customers.
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
