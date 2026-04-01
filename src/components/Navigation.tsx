"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sparkles, LayoutDashboard, Shirt, Image as ImageIcon, CreditCard } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const Navigation = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Sparkles },
    { href: "/workspace", label: "Workspace", icon: LayoutDashboard },
    { href: "/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto backdrop-blur-md bg-primary/20 shadow-md border border-primary/30 rounded-full px-5 py-2">
        <Shirt className="w-5 h-5 text-primary" />
        <span className="font-extrabold text-lg tracking-wider text-primary">
          AURA-FIT
        </span>
      </div>

      <div className="flex items-center gap-2 pointer-events-auto backdrop-blur-md bg-primary/10 shadow-md border border-primary/20 rounded-full p-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                isActive
                  ? "bg-primary text-black shadow-md"
                  : "text-foreground/70 hover:text-primary hover:bg-primary/10"
              )}
            >
              <Icon className="w-4 h-4 text-inherit" />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2 pointer-events-auto backdrop-blur-md bg-primary/10 border border-primary/20 shadow-md rounded-full p-1">
        <ThemeToggle />
      </div>
    </nav>
  );
};
