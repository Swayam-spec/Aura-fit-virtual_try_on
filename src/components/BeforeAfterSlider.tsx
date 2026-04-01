"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const BeforeAfterSlider = ({ beforeImage, afterImage }: BeforeAfterSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  // x acts as the pixel position of the slider
  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      setSliderWidth(containerRef.current.offsetWidth);
      // Initialize slider at 50%
      x.set(containerRef.current.offsetWidth / 2);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setSliderWidth(containerRef.current.offsetWidth);
        x.set(containerRef.current.offsetWidth / 2);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [x]);

  // Convert pixel position to percentage for the clipPath
  const clipPercentage = useTransform(x, [0, sliderWidth], [0, 100]);
  const clipPathObject = useTransform(clipPercentage, (val) => `inset(0 ${100 - val}% 0 0)`);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full max-w-4xl max-h-[70vh] aspect-[4/5] md:aspect-video rounded-[3rem] overflow-hidden shadow-2xl mx-auto cursor-ew-resize bg-black/5"
    >
      {/* Before Image (Base layer) */}
      {beforeImage ? (
        <img
          src={beforeImage}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
           <span className="text-foreground/40 font-semibold tracking-widest text-lg uppercase">Original Model</span>
        </div>
      )}

      {/* After Image (Clipped layer) */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: clipPathObject }}
      >
        {afterImage ? (
          <img
            src={afterImage}
            alt="After"
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-secondary/30 to-primary/30 flex items-center justify-center">
            <span className="text-primary font-bold tracking-widest text-2xl uppercase">AI Try-On Result</span>
          </div>
        )}
        {/* Label for AFTER */}
        <div className="absolute top-6 left-6 bg-background/80 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold text-primary shadow-sm border border-border">
          AI Generated
        </div>
      </motion.div>

      {/* Label for BEFORE (must be positioned relative to the base image to the right) */}
      <div className="absolute top-6 right-6 bg-background/80 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold text-foreground/80 shadow-sm border border-border pointer-events-none">
        Original
      </div>

      {/* Slider Draggable Thumb */}
      <motion.div
        className="absolute top-0 bottom-0 flex items-center justify-center w-[2px] bg-foreground/30 cursor-ew-resize z-20 hover:w-[4px] transition-all"
        style={{ x: x }}
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
      >
        <div className="w-12 h-12 rounded-full bg-background border border-border shadow-2xl flex items-center justify-center -translate-x-1/2 absolute">
          <MoveHorizontal className="w-5 h-5 text-foreground" />
        </div>
      </motion.div>
    </div>
  );
};
