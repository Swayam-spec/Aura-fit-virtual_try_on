"use client";

import { useVtoStore } from "@/store/useVtoStore";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Download, RefreshCw } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { useEffect } from "react";

export const LiveCanvas = () => {
  const store = useVtoStore();

  const handleGenerate = () => {
    if (!store.modelImage || !store.garmentImage) return;
    
    store.setGenerationState("generating");
    store.setProgressText("Analyzing fabric physics...");
    
    // Simulate generation process
    setTimeout(() => store.setProgressText("Matching lighting & perspective..."), 2000);
    setTimeout(() => store.setProgressText("Applying HD upscaling..."), 4000);
    
    setTimeout(() => {
      // Set to the model image for mock result and change state
      store.setResultImage("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&result=true");
      store.setGenerationState("complete");
      store.setProgressText("");
    }, 6000);
  };

  const handleReset = () => {
    store.setGenerationState("idle");
    store.setResultImage(null);
  };

  return (
    <div className="flex flex-col h-full bg-black/40 border border-white/10 rounded-3xl p-4 md:p-8 backdrop-blur-sm relative overflow-hidden">
      
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

      <div className="flex-1 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center bg-white/[0.01]">
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
                  <motion.img layoutId="model" src={store.modelImage} className="w-24 h-24 rounded-full object-cover border-4 border-black z-10" />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-black bg-white/5 z-10 flex items-center justify-center text-xs text-white/30">Model</div>
                )}
                {store.garmentImage ? (
                  <motion.img layoutId="garment" src={store.garmentImage} className="w-24 h-24 rounded-full object-cover border-4 border-black z-20" />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-black bg-white/5 z-20 flex items-center justify-center text-xs text-white/30">Garment</div>
                )}
              </div>
              
              <div className="text-center max-w-sm">
                <h2 className="text-xl font-medium text-white mb-2">Ready to visualize</h2>
                <p className="text-white/40 text-sm">Select both a model and a garment to start the virtual try-on simulation.</p>
              </div>

              <MagneticButton
                glow
                disabled={!store.modelImage || !store.garmentImage}
                onClick={handleGenerate}
                className="bg-white text-black hover:bg-gray-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-electric-violet to-cyber-blue mix-blend-screen"
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
                className="text-cyber-blue font-medium tracking-wide text-lg"
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
                className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 w-[200%]"
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-2 z-30"
        >
          <MagneticButton onClick={handleReset} className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 text-sm">
            <RefreshCw className="w-4 h-4" /> Start Over
          </MagneticButton>
          <MagneticButton glow className="bg-white text-black rounded-full px-6 text-sm">
            <Download className="w-4 h-4" /> Download HD
          </MagneticButton>
        </motion.div>
      )}

    </div>
  );
};
