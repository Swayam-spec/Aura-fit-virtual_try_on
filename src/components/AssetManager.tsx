"use client";

import { useVtoStore } from "@/store/useVtoStore";
import { Upload, Image as ImageIcon, Shirt, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "./MagneticButton";
import { useState } from "react";

export const AssetManager = () => {
  const store = useVtoStore();
  const [activeTab, setActiveTab] = useState<"model" | "garment">("model");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "model" | "garment") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to Base64 to support API uploads
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      if (type === "model") store.setModelImage(base64String);
      else store.setGarmentImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleMockUpload = (type: "model" | "garment") => {
    // Uses the custom generated AI demo assets
    const url = type === "model" ? "/demo/vto_before.png" : "/demo/vto_garment.png";
    
    if (type === "model") store.setModelImage(url);
    else store.setGarmentImage(url);
  };

  return (
    <div className="flex flex-col h-full bg-background shadow-xl border border-border rounded-3xl p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-8 bg-foreground/5 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab("model")}
          className={cn(
            "flex-1 py-2 text-sm font-semibold rounded-xl transition-all",
            activeTab === "model" ? "bg-background text-foreground shadow-sm" : "text-foreground/50 hover:text-foreground"
          )}
        >
          Model
        </button>
        <button
          onClick={() => setActiveTab("garment")}
          className={cn(
            "flex-1 py-2 text-sm font-semibold rounded-xl transition-all",
            activeTab === "garment" ? "bg-background text-foreground shadow-sm" : "text-foreground/50 hover:text-foreground"
          )}
        >
          Garment
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
        {activeTab === "model" && (
          <div className="space-y-6 flex flex-col items-center">
            
            <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center w-full relative group">
              <Upload className="w-8 h-8 text-foreground/50 mb-4" />
              <h3 className="text-foreground font-medium mb-1">Upload Model Image</h3>
              <p className="text-foreground/40 text-sm mb-6 max-w-[200px]">Select a clear, full-body portrait from your device.</p>
              
              <label className="cursor-pointer relative overflow-hidden group/btn bg-primary text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-primary/50 transition-all hover:-translate-y-0.5 w-full flex justify-center items-center">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "model")} 
                  className="hidden" 
                />
                Browse Computer
              </label>

              <button 
                onClick={(e) => { e.preventDefault(); handleMockUpload("model"); }}
                className="mt-4 text-primary text-xs font-semibold px-4 py-1.5 rounded-full border border-primary/30 hover:bg-primary/10 transition-colors"
              >
                Try Demo Model
              </button>
            </div>

            {store.modelImage && (
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-border group bg-foreground/5 shadow-inner">
                <img src={store.modelImage} alt="Model" className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                  <button onClick={() => store.setModelImage(null)} className="text-xs font-bold tracking-wide px-5 py-2.5 bg-red-500/90 hover:bg-red-500 text-white rounded-full transition-colors shadow-lg">Remove</button>
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
                      isSelected ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground/50 hover:bg-foreground/5"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center w-full relative group">
              <Upload className="w-8 h-8 text-foreground/50 mb-4" />
              <h3 className="text-foreground font-medium mb-1">Upload Garment</h3>
              <p className="text-foreground/40 text-sm mb-6 max-w-[200px]">Select the clothing item you want to visualize.</p>

              <label className="cursor-pointer relative overflow-hidden group/btn bg-secondary text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-secondary/50 transition-all hover:-translate-y-0.5 w-full flex justify-center items-center">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "garment")} 
                  className="hidden" 
                />
                Browse Computer
              </label>

              <button 
                onClick={(e) => { e.preventDefault(); handleMockUpload("garment"); }}
                className="mt-4 text-secondary text-xs font-semibold px-4 py-1.5 rounded-full border border-secondary/30 hover:bg-secondary/10 transition-colors"
              >
                Try Demo Garment
              </button>
            </div>

            {store.garmentImage && (
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-border group bg-foreground/5 shadow-inner">
                <img src={store.garmentImage} alt="Garment" className="object-contain w-full h-full p-4 drop-shadow-xl" />
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                  <button onClick={() => store.setGarmentImage(null)} className="text-xs font-bold tracking-wide px-5 py-2.5 bg-red-500/90 hover:bg-red-500 text-white rounded-full transition-colors shadow-lg">Remove</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-border space-y-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">HD Upscaling</span>
          <div className={cn("w-10 h-5 rounded-full relative transition-colors", store.hdUpscale ? "bg-primary" : "bg-foreground/20")}>
            <div className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background transition-transform", store.hdUpscale && "translate-x-5")} />
          </div>
          <input type="checkbox" className="hidden" checked={store.hdUpscale} onChange={(e) => store.setHdUpscale(e.target.checked)} />
        </label>
        
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">Preserve Background</span>
          <div className={cn("w-10 h-5 rounded-full relative transition-colors", store.preserveBackground ? "bg-secondary" : "bg-foreground/20")}>
            <div className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background transition-transform", store.preserveBackground && "translate-x-5")} />
          </div>
          <input type="checkbox" className="hidden" checked={store.preserveBackground} onChange={(e) => store.setPreserveBackground(e.target.checked)} />
        </label>
      </div>

    </div>
  );
};
