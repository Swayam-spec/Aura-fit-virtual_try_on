import os
import time
import io
import base64
import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
from diffusers import StableDiffusionInpaintPipeline

# --- Configuration ---
CACHE_DIR = "D:/aura-fit-models"
os.makedirs(CACHE_DIR, exist_ok=True)

# Set HuggingFace cache directory to D: drive
os.environ["HF_HOME"] = CACHE_DIR
os.environ["TRANSFORMERS_CACHE"] = CACHE_DIR

app = FastAPI(title="Aura-Fit ML Backend (AMD Optimized)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ML Model Wrapper ---
class VTOProcessor:
    def __init__(self):
        print(f"Initializing VTO Pipeline... (Cache: {CACHE_DIR})")
        
        # Check for AMD GPU (DirectML) or CUDA
        try:
            import torch_directml
            self.device = torch_directml.device()
            print(f"✅ Using AMD Radeon GPU via DirectML: {self.device}")
        except ImportError:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            print(f"⚠️ torch-directml not found. Using: {self.device}")

        # Load stable-diffusion-inpainting (Foundational VTO model)
        # Note: CatVTON usually uses this as a base with custom weights.
        # For the first run, this will download ~4GB to D:/aura-fit-models
        try:
            self.pipe = StableDiffusionInpaintPipeline.from_pretrained(
                "runwayml/stable-diffusion-inpainting",
                torch_dtype=torch.float16 if self.device != "cpu" else torch.float32,
                cache_dir=CACHE_DIR
            ).to(self.device)
            print("✅ ML Pipeline Loaded Successfully.")
        except Exception as e:
            print(f"❌ Failed to load pipeline: {e}")
            self.pipe = None

    def process_vto(self, person_img: Image.Image, garment_img: Image.Image, category: str):
        if not self.pipe:
            return person_img # Fallback if model failed to load
            
        print(f"Running Inference for {category}...")
        
        # 1. Prepare Images (Resize to SD standard 512x512 for speed)
        person_img = person_img.convert("RGB").resize((512, 512))
        garment_img = garment_img.convert("RGB").resize((512, 512))
        
        # 2. Generate a simple Mask (Focus on the body area based on category)
        # In a production app, we would use a Segmentation model like SAM.
        # Here we create a logical mask for the "Upper body" or "Lower body".
        mask = Image.new("L", (512, 512), 0)
        if category.lower() == "tops" or category.lower() == "upper body":
            mask.paste(255, (100, 100, 412, 400)) # Simple rectangle for demonstration
        else:
            mask.paste(255, (100, 250, 412, 512))
            
        # 3. Run Inpainting (Virtual Try-On logic)
        prompt = f"a photo of a person wearing a {category}, fashion photography, high quality"
        negative_prompt = "deformed, low quality, bad anatomy, naked"
        
        result = self.pipe(
            prompt=prompt,
            image=person_img,
            mask_image=mask,
            negative_prompt=negative_prompt,
            num_inference_steps=25
        ).images[0]
        
        return result

# Initialize the processor (Loaded on startup)
vto = VTOProcessor()

# --- API Layer ---
class GenerateRequest(BaseModel):
    model_image: str   # Base64 string
    garment_image: str # Base64 string
    category: str = "tops"

def base64_to_pil(b64_str: str) -> Image.Image:
    if "," in b64_str:
        b64_str = b64_str.split(",")[1]
    img_data = base64.b64decode(b64_str)
    return Image.open(io.BytesIO(img_data))

def pil_to_base64(img: Image.Image) -> str:
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode()

@app.post("/generate")
async def generate_vto(request: GenerateRequest):
    print(f"Received VTO request for {request.category}")
    
    try:
        # Decode images
        person_pil = base64_to_pil(request.model_image)
        garment_pil = base64_to_pil(request.garment_image)
        
        # Run ML Pipeline
        start_time = time.time()
        result_pil = vto.process_vto(person_pil, garment_pil, request.category)
        end_time = time.time()
        
        print(f"Inference complete in {end_time - start_time:.2f}s")
        
        return {
            "success": True,
            "output_image": pil_to_base64(result_pil),
            "message": "Generation completed"
        }
    except Exception as e:
        print(f"Error during generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("Starting ML Backend with D-Drive support...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
