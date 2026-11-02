import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import path from "path";
import { readFile } from "fs/promises";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    if (!filename) {
      return new Response("Filename required", { status: 400 });
    }

    const cleanName = path.basename(filename);

    // 1. First, check if file exists on disk (e.g. local assets in public/brand)
    try {
      const filePath = path.join(process.cwd(), "public", "brand", cleanName);
      const fileBuffer = await readFile(filePath);
      const ext = cleanName.split(".").pop()?.toLowerCase() || "jpeg";
      const mime =
        ext === "png"
          ? "image/png"
          : ext === "webp"
          ? "image/webp"
          : ext === "avif"
          ? "image/avif"
          : "image/jpeg";

      return new Response(new Uint8Array(fileBuffer), {
        headers: {
          "Content-Type": mime,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // Not on disk, proceed to database lookup
    }

    // 2. Query database for persistent media stored via CMS upload
    const row = await prisma.setting.findUnique({
      where: { key: `media:${cleanName}` },
    });

    if (row && row.value) {
      const { mime, data } = row.value as { mime: string; data: string };
      if (data) {
        const buffer = Buffer.from(data, "base64");
        return new Response(new Uint8Array(buffer), {
          headers: {
            "Content-Type": mime || "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    return new Response("Image not found", { status: 404 });
  } catch (err) {
    console.error("[media] Error serving image:", err);
    return new Response("Error serving image", { status: 500 });
  }
}

