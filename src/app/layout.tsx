import type { Metadata } from "next";
import "./globals.css";

import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Aura-Fit | Next-Gen Virtual Try-On",
  description: "High-end, responsive Virtual Try-On web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-background text-foreground tracking-tight no-scrollbar">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
