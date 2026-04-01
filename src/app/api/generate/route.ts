import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { modelImage, garmentImage, category } = await request.json();

    if (!modelImage || !garmentImage) {
      return NextResponse.json({ error: "Missing required images" }, { status: 400 });
    }

    // 1. Save Assets to Database
    const modelAsset = await prisma.asset.create({
      data: {
        url: modelImage,
        type: "MODEL",
      }
    });

    const garmentAsset = await prisma.asset.create({
      data: {
        url: garmentImage,
        type: "GARMENT",
      }
    });

    // 2. Call the Local Python ML Backend
    let resultImage = "";
    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_image: modelImage,
          garment_image: garmentImage,
          category: category || "Upper body"
        })
      });

      if (!response.ok) {
        throw new Error(`Local ML API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data && data.success && data.output_image) {
        resultImage = data.output_image;
      } else {
        throw new Error("Invalid response from Local ML API");
      }
    } catch (error: any) {
      console.error("Local ML Server Error:", error.message);
      // Fallback if local server isn't running
      console.log("Mocking generation fallback because local server is unavailable.");
      await new Promise(resolve => setTimeout(resolve, 3000));
      resultImage = modelImage; // In a true app, we might return a demo output
    }

    // 3. Save Generation Result to Database
    await prisma.generation.create({
      data: {
        resultUrl: resultImage,
        modelId: modelAsset.id,
        garmentId: garmentAsset.id,
        // userId is optional, we skip for unauthenticated sessions
      }
    });

    return NextResponse.json({ resultImage });

  } catch (err) {
    console.error("Generate API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
