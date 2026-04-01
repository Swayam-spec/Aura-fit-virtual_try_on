"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";

const TIER_DATA = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for casual users wanting to try the technology.",
    features: ["15 AI Try-Ons per month", "Standard Definition", "Community Gallery Access"],
    popular: false,
  },
  {
    name: "Aura Pro",
    price: "$19/mo",
    description: "For fashion enthusiasts and creators looking for premium quality.",
    features: [
      "100 AI Try-Ons per month",
      "HD Upscaling (4K)",
      "Background Preservation",
      "Priority API Processing",
      "Commercial Usage Rights"
    ],
    popular: true,
  },
  {
    name: "Brand & Enterprise",
    price: "$99/mo",
    description: "High-volume generation tailored for e-commerce integration.",
    features: [
      "Unlimited AI Try-Ons",
      "Custom Studio Environments",
      "API Access for Developers",
      "Dedicated Account Manager",
      "White-label exports"
    ],
    popular: false,
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-6">
      <div className="text-center mb-16 max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">Choose Your <span className="text-primary">Aura</span></h1>
        <p className="text-foreground/60 text-lg">
          Whether you're shopping for the weekend or styling a complete e-commerce catalog, we have a plan for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {TIER_DATA.map((tier, idx) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className={`relative p-8 rounded-[2rem] border backdrop-blur-lg flex flex-col ${
              tier.popular 
                ? "bg-primary/5 border-primary shadow-[0_0_40px_rgba(212,175,55,0.1)]" 
                : "bg-foreground/[0.02] border-border"
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black px-4 py-1 rounded-full text-sm font-bold tracking-wider">
                MOST POPULAR
              </div>
            )}
            
            <h2 className="text-2xl font-semibold mb-2">{tier.name}</h2>
            <div className="text-4xl font-bold text-primary mb-4">{tier.price}</div>
            <p className="text-foreground/60 mb-8 h-12">{tier.description}</p>
            
            <ul className="space-y-4 mb-10 flex-1">
              {tier.features.map(feat => (
                <li key={feat} className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5 rounded-full p-1 bg-primary/20 text-primary">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-foreground/80">{feat}</span>
                </li>
              ))}
            </ul>

            <MagneticButton glow={tier.popular} className={`w-full py-4 rounded-2xl ${tier.popular ? 'bg-primary text-black' : 'bg-foreground/5 text-foreground hover:bg-foreground/10'}`}>
              Get {tier.name}
            </MagneticButton>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
