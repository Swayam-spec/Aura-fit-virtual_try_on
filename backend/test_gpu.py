import torch
import torch_directml

def check_gpu():
    print("Checking for AMD GPU via DirectML...")
    try:
        dml = torch_directml.device()
        print(f"DirectML Device: {dml}")
        
        # Test a small tensor operation
        x = torch.tensor([1.0, 2.0]).to(dml)
        y = x * 2
        print(f"Test Operation Result: {y}")
        print("✅ AMD GPU (DirectML) is working correctly!")
    except Exception as e:
        print(f"❌ DirectML Setup Failed: {e}")
        print("Falling back to CPU check...")
        print(f"Torch Version: {torch.__version__}")
        print(f"CUDA Available: {torch.cuda.is_available()}")

if __name__ == "__main__":
    check_gpu()
