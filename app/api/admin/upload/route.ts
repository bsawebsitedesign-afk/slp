import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: NextRequest) {
  // Must be an authenticated admin
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, AVIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Max size is 8 MB." },
        { status: 400 }
      );
    }

    const prefix = ((form.get("prefix") as string | null) || "member").replace(/[^a-z0-9_-]/gi, "");
    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const slug = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 40);
    const filename = `${prefix}-${slug}-${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      const brandDir = path.join(process.cwd(), "public", "brand");
      await mkdir(brandDir, { recursive: true });
      await writeFile(path.join(brandDir, filename), buffer);
      return NextResponse.json({ path: `/brand/${filename}` });
    } catch (fsErr) {
      // In serverless environments (like Vercel production) where the local filesystem is read-only,
      // fallback to self-contained base64 Data URI so uploads work out-of-the-box.
      console.warn("[upload] Filesystem write failed, falling back to base64 Data URI:", fsErr);
      const mime = file.type || "image/jpeg";
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${mime};base64,${base64}`;
      return NextResponse.json({ path: dataUrl });
    }
  } catch (err) {
    console.error("[upload] Error:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
