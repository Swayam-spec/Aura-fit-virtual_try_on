import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import sharp from "sharp";

// ─── Fashn.ai Virtual Try-On API ────────────────────────────────────────────
const FASHN_API_KEY = process.env.FASHN_API_KEY;
const FASHN_BASE    = "https://api.fashn.ai/v1";

// Map our category IDs to Fashn.ai's expected category strings
function toFashnCategory(cat: string): string {
  const c = (cat || "tops").toLowerCase();
  if (c === "bottoms" || c === "lower body") return "bottoms";
  if (c === "dresses" || c === "full body" || c === "one-piece") return "one-piece";
  return "tops"; // default
}

async function runFashnAI(
  modelImage: string,
  garmentImage: string,
  category: string
): Promise<string | null> {
  if (!FASHN_API_KEY) return null;

  // 1. Start the prediction
  const startRes = await fetch(`${FASHN_BASE}/run`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${FASHN_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_name: "tryon-v1.6",
      inputs: {
        model_image:   modelImage,
        garment_image: garmentImage,
        category:      toFashnCategory(category),
        return_base64: true,        // get result as base64 to avoid hosting
      },
    }),
  });

  if (!startRes.ok) {
    const err = await startRes.text();
    console.error("Fashn.ai start error:", err);
    return null;
  }

  const { id: predictionId } = await startRes.json();
  if (!predictionId) return null;

  console.log(`Fashn.ai prediction started: ${predictionId}`);

  // 2. Poll until done (max 120 s)
  const statusUrl = `${FASHN_BASE}/status/${predictionId}`;
  const deadline  = Date.now() + 120_000;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 3000));

    const statusRes = await fetch(statusUrl, {
      headers: { Authorization: `Bearer ${FASHN_API_KEY}` },
    });

    if (!statusRes.ok) continue;

    const status = await statusRes.json();
    console.log(`Fashn.ai status: ${status.status}`);

    if (status.status === "completed" && status.output) {
      // output can be a URL or base64 string depending on return_base64 flag
      const out = Array.isArray(status.output) ? status.output[0] : status.output;
      if (typeof out === "string" && out.startsWith("data:")) return out;
      if (typeof out === "string" && out.startsWith("http")) {
        // fetch and convert to base64
        const imgRes = await fetch(out);
        const buf    = Buffer.from(await imgRes.arrayBuffer());
        return "data:image/jpeg;base64," + buf.toString("base64");
      }
      return out;
    }

    if (status.status === "failed") {
      console.error("Fashn.ai generation failed:", status.error);
      return null;
    }
  }

  console.error("Fashn.ai timed out after 120s");
  return null;
}

// Helper: decode base64 data URI or URL to a Buffer
async function imageToBuffer(src: string): Promise<Buffer> {
  if (src.startsWith("data:")) {
    // Base64 data URI
    const base64Data = src.split(",")[1];
    return Buffer.from(base64Data, "base64");
  } else if (src.startsWith("http") || src.startsWith("/")) {
    // URL or relative path - fetch it
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = src.startsWith("/") ? `${base}${src}` : src;
    const res = await fetch(url);
    return Buffer.from(await res.arrayBuffer());
  }
  throw new Error("Unsupported image source format");
}

// Core image compositing using Sharp - places garment on model image
async function compositeGarmentOnModel(
  modelBuf: Buffer,
  garmentBuf: Buffer,
  category: string
): Promise<Buffer> {
  // Get model dimensions
  const modelMeta = await sharp(modelBuf).metadata();
  const mW = modelMeta.width || 512;
  const mH = modelMeta.height || 768;

  // Determine placement region based on category
  let garmentLeft: number;
  let garmentTop: number;
  let garmentWidth: number;
  let garmentHeight: number;

  const cat = (category || "tops").toLowerCase();

  if (cat === "bottoms" || cat === "lower body") {
    // Lower half of body
    garmentLeft  = Math.round(mW * 0.15);
    garmentTop   = Math.round(mH * 0.48);
    garmentWidth  = Math.round(mW * 0.70);
    garmentHeight = Math.round(mH * 0.50);
  } else if (cat === "dresses" || cat === "full body") {
    // Full body region
    garmentLeft  = Math.round(mW * 0.12);
    garmentTop   = Math.round(mH * 0.12);
    garmentWidth  = Math.round(mW * 0.76);
    garmentHeight = Math.round(mH * 0.80);
  } else {
    // Tops - upper body (default)
    garmentLeft  = Math.round(mW * 0.15);
    garmentTop   = Math.round(mH * 0.12);
    garmentWidth  = Math.round(mW * 0.70);
    garmentHeight = Math.round(mH * 0.45);
  }

  // Resize garment to the placement box, maintaining aspect ratio
  const resizedGarment = await sharp(garmentBuf)
    .resize(garmentWidth, garmentHeight, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Composite the garment on top of the model with "over" blend
  const result = await sharp(modelBuf)
    .composite([
      {
        input: resizedGarment,
        left: garmentLeft,
        top: garmentTop,
        blend: "over",
      },
    ])
    .jpeg({ quality: 95 })
    .toBuffer();

  return result;
}

export async function POST(request: Request) {
  try {
    const { modelImage, garmentImage, category } = await request.json();

    if (!modelImage || !garmentImage) {
      return NextResponse.json({ error: "Missing required images" }, { status: 400 });
    }

    // 1. Save Assets to Database
    const modelAsset = await prisma.asset.create({
      data: { url: modelImage.substring(0, 500), type: "MODEL" },
    });
    const garmentAsset = await prisma.asset.create({
      data: { url: garmentImage.substring(0, 500), type: "GARMENT" },
    });

    let resultImage = "";

    // ── Priority 1: Fashn.ai Cloud VTO (best quality - produces real try-on) ──
    if (FASHN_API_KEY) {
      console.log("Using Fashn.ai API for VTO generation...");
      const fashnResult = await runFashnAI(modelImage, garmentImage, category || "tops");
      if (fashnResult) {
        resultImage = fashnResult;
        console.log("✅ Fashn.ai generation successful");
      } else {
        console.warn("⚠️ Fashn.ai failed, trying local ML server...");
      }
    }

    // ── Priority 2: Local Python ML server (CatVTON) ─────────────────────────
    if (!resultImage) {
      try {
        const response = await fetch("http://localhost:8000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model_image:   modelImage,
            garment_image: garmentImage,
            category:      category || "tops",
          }),
          signal: AbortSignal.timeout(60000),
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.success && data?.output_image) {
            resultImage = data.output_image;
            console.log("✅ Local ML server generation successful");
          }
        }
      } catch (mlErr: any) {
        console.warn("⚠️ Local ML server unavailable:", mlErr.message);
      }
    }

    // ── Priority 3: Sharp compositing fallback (basic, always works) ──────────
    if (!resultImage) {
      console.log(`📐 Using Sharp compositing fallback for category: ${category}`);
      const modelBuf     = await imageToBuffer(modelImage);
      const garmentBuf   = await imageToBuffer(garmentImage);
      const compositeBuf = await compositeGarmentOnModel(modelBuf, garmentBuf, category || "tops");
      resultImage = "data:image/jpeg;base64," + compositeBuf.toString("base64");
    }

    // 2. Save Generation Result to Database
    await prisma.generation.create({
      data: {
        resultUrl: resultImage.substring(0, 500),
        modelId:   modelAsset.id,
        garmentId: garmentAsset.id,
      },
    });

    return NextResponse.json({ resultImage });
  } catch (err) {
    console.error("Generate API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

