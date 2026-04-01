"use client";

import { useVtoStore } from "@/store/useVtoStore";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Download, RefreshCw } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { useEffect } from "react";

export const LiveCanvas = () => {
  const store = useVtoStore();

  const handleGenerate = async () => {
    if (!store.modelImage || !store.garmentImage) return;
    
    store.setGenerationState("generating");
    store.setProgressText("Connecting to generation core...");
    
    // Animate text states to keep user engaged
    const textInterval = setInterval(() => {
      const texts = ["Analyzing fabric physics...", "Mapping body contours...", "Applying studio lighting...", "Enhancing 4K details..."];
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      store.setProgressText(randomText);
    }, 2500);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelImage: store.modelImage,
          garmentImage: store.garmentImage,
          category: store.garmentType
        })
      });

      clearInterval(textInterval);

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
      
      store.setResultImage(data.resultImage);
      store.setGenerationState("complete");
      store.setProgressText("");

    } catch (error) {
      clearInterval(textInterval);
      console.error(error);
      store.setGenerationState("idle");
      alert("Failed to generate Virtual Try-on. Check console for details.");
    }
  };

  const handleReset = () => {
    store.setGenerationState("idle");
    store.setResultImage(null);
  };

  return (
    <div className="flex flex-col h-full bg-background shadow-xl border border-border rounded-3xl p-4 md:p-8 backdrop-blur-sm relative overflow-hidden">
      
      {/* Background ambient glow based on state */}
      <AnimatePresence>
        {store.generationState === "generating" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.15)_0%,rgba(0,0,0,0)_60%)] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex-1 rounded-2xl border border-border relative overflow-hidden flex items-center justify-center bg-foreground/[0.02]">
        <AnimatePresence mode="wait">
          
          {store.generationState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex -space-x-4 relative">
                {store.modelImage ? (
                  <motion.img layoutId="model" src={store.modelImage} className="w-24 h-24 rounded-full object-cover border-4 border-background z-10 shadow-lg" />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-background bg-foreground/5 z-10 flex items-center justify-center text-xs text-foreground/40 font-medium tracking-wide">Model</div>
                )}
                {store.garmentImage ? (
                  <motion.img layoutId="garment" src={store.garmentImage} className="w-24 h-24 rounded-full object-cover border-4 border-background z-20 shadow-lg" />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-background bg-foreground/5 z-20 flex items-center justify-center text-xs text-foreground/40 font-medium tracking-wide">Garment</div>
                )}
              </div>
              
              <div className="text-center max-w-sm">
                <h2 className="text-xl font-semibold text-foreground mb-2">Ready to visualize</h2>
                <p className="text-foreground/60 text-sm">Select both a model and a garment to start the virtual try-on simulation.</p>
              </div>

              <MagneticButton
                glow
                disabled={!store.modelImage || !store.garmentImage}
                onClick={handleGenerate}
                className="bg-primary text-black font-bold tracking-wide hover:opacity-90 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                Generate Result
              </MagneticButton>
            </motion.div>
          )}

          {store.generationState === "generating" && (
            <motion.div
              key="generating"
              className="flex flex-col items-center justify-center h-full w-full absolute inset-0 z-50"
            >
              <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                {store.modelImage && <motion.img layoutId="model" src={store.modelImage} className="absolute w-20 h-20 rounded-full object-cover opacity-50 blur-sm mix-blend-screen" />}
                {store.garmentImage && <motion.img layoutId="garment" src={store.garmentImage} className="absolute w-20 h-20 rounded-full object-cover opacity-50 blur-sm mix-blend-screen" />}
                
                {/* Glowing Loading Orb */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-secondary mix-blend-screen"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                    filter: ["blur(10px)", "blur(20px)", "blur(10px)"],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary font-medium tracking-wide text-lg text-center px-4"
              >
                {store.progressText}
              </motion.div>
            </motion.div>
          )}

          {store.generationState === "complete" && store.resultImage && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Shimmer overlay effect */}
              <motion.div 
                className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-foreground/20 to-transparent -skew-x-12 w-[200%]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <img 
                src={store.resultImage} 
                alt="Result" 
                className="w-full h-full object-contain md:object-cover"
              />
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>

      {store.generationState === "complete" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/80 shadow-2xl backdrop-blur-xl border border-border rounded-full p-2 z-30"
        >
          <MagneticButton onClick={handleReset} className="bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-full px-6 text-sm font-semibold">
            <RefreshCw className="w-4 h-4" /> Start Over
          </MagneticButton>
          <MagneticButton glow className="bg-primary text-black rounded-full px-6 text-sm font-semibold">
            <Download className="w-4 h-4" /> Download HD
          </MagneticButton>
        </motion.div>
      )}

    </div>
  );
};
