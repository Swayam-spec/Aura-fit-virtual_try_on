import os
from huggingface_hub import snapshot_download

# Configuration
CACHE_DIR = "D:/aura-fit-models"
os.makedirs(CACHE_DIR, exist_ok=True)

# List of required model repositories
MODELS = [
    "runwayml/stable-diffusion-inpainting",
    "openai/clip-vit-large-patch14"
]

print(f"🚀 Starting robust weight download to {CACHE_DIR}...")

for model in MODELS:
    print(f"📥 Downloading {model}...")
    try:
        path = snapshot_download(
            repo_id=model,
            cache_dir=CACHE_DIR,
            local_files_only=False,
            resume_download=True
        )
        print(f"✅ Successfully downloaded {model} to {path}")
    except Exception as e:
        print(f"❌ Error downloading {model}: {e}")

print("✨ All downloads complete! You can now start the ML backend.")
