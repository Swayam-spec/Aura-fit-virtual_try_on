"use client";

import { useVtoStore } from "@/store/useVtoStore";
import { Upload, Image as ImageIcon, Shirt, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "./MagneticButton";
import { useState } from "react";

export const AssetManager = () => {
  const store = useVtoStore();
  const [activeTab, setActiveTab] = useState<"model" | "garment">("model");

  const handleMockUpload = (type: "model" | "garment") => {
    // In a real app, this would use an input type="file"
    const url = type === "model" 
      ? "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
      : "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80";
    
    if (type === "model") store.setModelImage(url);
    else store.setGarmentImage(url);
  };

  return (
    <div className="flex flex-col h-full bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab("model")}
          className={cn(
            "flex-1 py-3 text-sm font-medium rounded-2xl transition-all",
            activeTab === "model" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
          )}
        >
          Model
        </button>
        <button
          onClick={() => setActiveTab("garment")}
          className={cn(
            "flex-1 py-3 text-sm font-medium rounded-2xl transition-all",
            activeTab === "garment" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
          )}
        >
          Garment
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
        {activeTab === "model" && (
          <div className="space-y-6">
            <div 
              onClick={() => handleMockUpload("model")}
              className="border-2 border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-electric-violet/50 hover:bg-electric-violet/5 transition-all group"
            >
              <Upload className="w-8 h-8 text-white/50 group-hover:text-electric-violet mb-4" />
              <h3 className="text-white font-medium mb-1">Upload Model Image</h3>
              <p className="text-white/40 text-sm">Drag and drop or click to browse</p>
            </div>

            {store.modelImage && (
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 group">
                <img src={store.modelImage} alt="Model" className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button onClick={() => store.setModelImage(null)} className="text-xs font-medium px-4 py-2 bg-red-500/80 text-white rounded-full">Remove</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "garment" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "tops", icon: Shirt, label: "Tops" },
                { id: "bottoms", icon: Scissors, label: "Bottoms" },
                { id: "dresses", icon: ImageIcon, label: "Dresses" },
              ].map((type) => {
                const Icon = type.icon;
                const isSelected = store.garmentType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => store.setGarmentType(type.id as typeof store.garmentType)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                      isSelected ? "border-electric-violet bg-electric-violet/10 text-electric-violet" : "border-white/10 text-white/50 hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>

            <div 
              onClick={() => handleMockUpload("garment")}
              className="border-2 border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cyber-blue/50 hover:bg-cyber-blue/5 transition-all group"
            >
              <Upload className="w-8 h-8 text-white/50 group-hover:text-cyber-blue mb-4" />
              <h3 className="text-white font-medium mb-1">Upload Garment</h3>
              <p className="text-white/40 text-sm">Select the item to try on</p>
            </div>

            {store.garmentImage && (
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 group bg-white/5">
                <img src={store.garmentImage} alt="Garment" className="object-contain w-full h-full p-4" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button onClick={() => store.setGarmentImage(null)} className="text-xs font-medium px-4 py-2 bg-red-500/80 text-white rounded-full">Remove</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">HD Upscaling</span>
          <div className={cn("w-10 h-5 rounded-full relative transition-colors", store.hdUpscale ? "bg-electric-violet" : "bg-white/20")}>
            <div className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform", store.hdUpscale && "translate-x-5")} />
          </div>
          <input type="checkbox" className="hidden" checked={store.hdUpscale} onChange={(e) => store.setHdUpscale(e.target.checked)} />
        </label>
        
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Preserve Background</span>
          <div className={cn("w-10 h-5 rounded-full relative transition-colors", store.preserveBackground ? "bg-cyber-blue" : "bg-white/20")}>
            <div className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform", store.preserveBackground && "translate-x-5")} />
          </div>
          <input type="checkbox" className="hidden" checked={store.preserveBackground} onChange={(e) => store.setPreserveBackground(e.target.checked)} />
        </label>
      </div>

    </div>
  );
};
