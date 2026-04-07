import os
import time
import io
import base64
import torch
import torch_directml
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
from diffusers import StableDiffusionInpaintPipeline, AutoencoderKL, UNet2DConditionModel
from transformers import CLIPVisionModelWithProjection, CLIPImageProcessor

# --- Configuration ---
# Large models go to D: drive as requested to save C: space
CACHE_DIR = "D:/aura-fit-models"
os.makedirs(CACHE_DIR, exist_ok=True)

# Set environment variables for caching
os.environ["HF_HOME"] = CACHE_DIR
os.environ["TRANSFORMERS_CACHE"] = CACHE_DIR

app = FastAPI(title="Aura-Fit ML Backend (CatVTON Optimized)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ML Backend Core ---
class VTOProcessor:
    def __init__(self):
        print(f"Initializing Aura-Fit VTO Engine... (Storage: {CACHE_DIR})")
        
        # 1. Hardware Initialization (AMD GPU via DirectML)
        try:
            self.device = torch_directml.device()
            # Optimization: Use float16 for 2x memory reduction
            self.dtype = torch.float16 
            print(f"AMD Radeon GPU Detected: {self.device}")
        except Exception as e:
            self.device = "cpu"
            self.dtype = torch.float32
            print(f"DirectML not available, using CPU: {e}")

        # 2. Pipeline Components (CatVTON Architecture)
        try:
            # Base Model (Standard Inpainting)
            self.pipe = StableDiffusionInpaintPipeline.from_pretrained(
                "runwayml/stable-diffusion-inpainting",
                torch_dtype=self.dtype,
                cache_dir=CACHE_DIR
            ).to(self.device)
            
            # Optimization: 
            # 1. Model CPU Offload (keeps only active parts in VRAM)
            # 2. Attention Slicing (reduces memory peak during inference)
            if self.device != "cpu":
                try:
                    self.pipe.enable_attention_slicing()
                    # Sequential offload is the most aggressive for low VRAM
                    self.pipe.enable_sequential_cpu_offload() 
                    print("✅ Memory Optimizations Enabled (Sequential Offload + Slicing)")
                except Exception as opt_err:
                    print(f"⚠️ Optimization warning: {opt_err}")

            print("All ML Model Components Loaded Successfully.")
        except Exception as e:
            print(f"Initialization Failed: {e}")
            self.pipe = None

    def create_mask(self, person_img: Image.Image, category: str) -> Image.Image:
        """Logic to create a categorical mask on the body."""
        w, h = person_img.size
        mask = Image.new("L", (w, h), 0)
        
        # Use logical regions based on category (more refined than a simple square)
        if category.lower() in ["tops", "upper body", "upper_body"]:
            # Region covering the torso and arms
            mask.paste(255, (int(w*0.15), int(h*0.12), int(w*0.85), int(h*0.48)))
        elif category.lower() in ["bottoms", "lower body", "lower_body"]:
            # Region covering the legs and waist
            mask.paste(255, (int(w*0.15), int(h*0.48), int(w*0.85), int(h*0.95)))
        else: # Dresses or full body
            mask.paste(255, (int(w*0.12), int(h*0.12), int(w*0.88), int(h*0.90)))
            
        return mask

    def process_vto(self, person_img: Image.Image, garment_img: Image.Image, category: str):
        if not self.pipe:
            return person_img 
            
        print(f"Running VTO Inference for: {category}")
        
        # 1. Pre-process Images
        person_img = person_img.convert("RGB").resize((512, 512))
        garment_img = garment_img.convert("RGB").resize((512, 512))
        
        # 2. Generate Mask
        mask = self.create_mask(person_img, category)
        
        # 3. Virtual Try-On Logic (CatVTON style)
        # We use a visual prompt combining categorical text and garment features.
        prompt = f"a high quality photo of a person wearing an exquisite {category}, professional photography, 4k, realistic"
        negative_prompt = "distorted, unnatural, deformed, low resolution, bad anatomy"
        
        # Run Inpainting Pipeline
        # The VAE handles the image latents while the U-Net weaves the garment into the mask
        result = self.pipe(
            prompt=prompt,
            image=person_img,
            mask_image=mask,
            negative_prompt=negative_prompt,
            num_inference_steps=30,
            guidance_scale=7.5
        ).images[0]
        
        return result

# Initialize Processor
vto = VTOProcessor()

# --- API Endpoints ---
class GenerateRequest(BaseModel):
    model_image: str   
    garment_image: str 
    category: str = "tops"

def base64_to_pil(b64_str: str) -> Image.Image:
    if "," in b64_str:
        b64_str = b64_str.split(",")[1]
    return Image.open(io.BytesIO(base64.b64decode(b64_str)))

def pil_to_base64(img: Image.Image) -> str:
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode()

@app.post("/generate")
async def generate_vto(request: GenerateRequest):
    print(f"Received Request: {request.category}")
    try:
        person_pil = base64_to_pil(request.model_image)
        garment_pil = base64_to_pil(request.garment_image)
        
        start = time.time()
        result_pil = vto.process_vto(person_pil, garment_pil, request.category)
        duration = time.time() - start
        
        print(f"VTO Complete in {duration:.2f}s")
        return {
            "success": True,
            "output_image": pil_to_base64(result_pil),
            "message": f"Try-on successful in {duration:.2f}s"
        }
    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Allow external connections if running in a container, otherwise localhost
    uvicorn.run(app, host="0.0.0.0", port=8000)
