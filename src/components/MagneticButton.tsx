"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const MagneticButton = ({ children, className, glow = false, ...props }: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(
        "relative rounded-full px-6 py-3 font-medium transition-colors focus:outline-none flex items-center justify-center overflow-hidden",
        glow && "shadow-[0_0_15px_rgba(138,43,226,0.3)] hover:shadow-[0_0_25px_rgba(0,191,255,0.6)]",
        className
      )}
      {...props}
    >
      {glow && (
        <span className="absolute inset-0 bg-gradient-to-r from-electric-violet to-cyber-blue opacity-0 transition-opacity hover:opacity-20 pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
