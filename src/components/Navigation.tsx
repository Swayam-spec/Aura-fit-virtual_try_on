"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sparkles, LayoutDashboard, Shirt } from "lucide-react";

export const Navigation = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Sparkles },
    { href: "/workspace", label: "Workspace", icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto backdrop-blur-md bg-black/40 border border-white/10 rounded-full px-5 py-2">
        <Shirt className="w-5 h-5 text-electric-violet" />
        <span className="font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-electric-violet to-cyber-blue">
          AURA-FIT
        </span>
      </div>

      <div className="flex items-center gap-2 pointer-events-auto backdrop-blur-md bg-black/40 border border-white/10 rounded-full p-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
