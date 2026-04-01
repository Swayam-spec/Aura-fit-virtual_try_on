"use client";

import { useEffect, useState } from "react";
import { Sun, Sparkles } from "lucide-react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"pearl-gold" | "alabaster-rose">("pearl-gold");

  useEffect(() => {
    const savedTheme = localStorage.getItem("aura-theme") as "pearl-gold" | "alabaster-rose" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "pearl-gold" ? "alabaster-rose" : "pearl-gold";
    setTheme(newTheme);
    localStorage.setItem("aura-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border border-border bg-black/5 hover:bg-black/10"
      title="Toggle Theme Palette"
    >
      {theme === "pearl-gold" ? (
        <>
          <Sun className="w-3.5 h-3.5 text-primary" />
          <span className="text-primary hidden sm:inline tracking-wide">Pearl Gold</span>
        </>
      ) : (
        <>
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-primary hidden sm:inline tracking-wide">Alabaster Rose</span>
        </>
      )}
    </button>
  );
};
