"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Label, inputCls } from "./ui";

export interface SlideItem {
  src: string;
  alt: string;
}

const DEFAULT_SLIDES: SlideItem[] = [
  { src: "/brand/about-slide-1.webp", alt: "Security Leader Character 1" },
  { src: "/brand/about-slide-2.webp", alt: "Security Leader Character 2" },
  { src: "/brand/about-slide-3.webp", alt: "Security Leader Character 3" },
];

export function SlideshowEditor({ initialSlides }: { initialSlides: SlideItem[] }) {
  const [slides, setSlides] = useState<SlideItem[]>(
    initialSlides && initialSlides.length > 0 ? initialSlides : DEFAULT_SLIDES
  );
  const [previewIndex, setPreviewIndex] = useState(0);

  // Auto-cycle through slides in the preview box
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setPreviewIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Keep previewIndex in bounds
  useEffect(() => {
    if (previewIndex >= slides.length) {
      setPreviewIndex(0);
    }
  }, [slides.length, previewIndex]);

  const update = (idx: number, field: keyof SlideItem, value: string) => {
    setSlides((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const remove = (idx: number) => {
    setSlides((prev) => prev.filter((_, i) => i !== idx));
  };

  const move = (idx: number, dir: -1 | 1) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    setSlides((prev) => {
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const add = () => {
    const nextIdx = slides.length + 1;
    setSlides((prev) => [
      ...prev,
      {
        src: "/brand/about-slide-1.webp",
        alt: `Security Leader Character ${nextIdx}`,
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hidden input storing the slides JSON for form submission */}
      <input type="hidden" name="slideshow_json" value={JSON.stringify(slides)} />

      {/* Top Banner & Live Preview */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col justify-center gap-2 rounded-2xl border border-steel/20 bg-ink-3/40 p-5">
          <span className="font-mono text-xs uppercase tracking-wider text-signal-bright font-bold">
            Rotating Studio & Masthead Images
          </span>
          <p className="text-sm text-steel-dim leading-relaxed">
            These images rotate in the 3D Audio Recording Showcase on the Homepage and the masthead on the About page.
            You can upload replacement images, change their display order, or add/remove slides. Changes apply immediately upon saving.
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="font-mono text-xs text-bone">
              Total Slides: <strong className="text-signal-bright">{slides.length}</strong>
            </span>
            <span className="text-steel-dim/50">·</span>
            <span className="font-mono text-xs text-bone">
              Rotation Speed: <span className="text-steel-dim">~3.6s per slide</span>
            </span>
          </div>
        </div>

        {/* Live Mini Preview Box */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-steel/20 bg-ink-2/60 p-4">
          <div className="flex w-full items-center justify-between border-b border-steel/15 pb-2 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-steel-dim font-bold">
              Live Preview
            </span>
            <span className="font-mono text-[10px] text-signal-bright">
              Slide {slides.length > 0 ? previewIndex + 1 : 0} of {slides.length}
            </span>
          </div>

          <div className="relative h-[180px] w-full max-w-[200px] flex items-center justify-center overflow-hidden rounded-xl bg-ink-3/70 p-2">
            {slides.length > 0 && slides[previewIndex]?.src ? (
              <Image
                src={slides[previewIndex].src}
                alt={slides[previewIndex].alt || "Preview slide"}
                fill
                className="object-contain transition-all duration-500"
                sizes="200px"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-xs text-steel-dim">
                No slides available
              </div>
            )}
          </div>

          {/* Dots */}
          {slides.length > 1 && (
            <div className="mt-3 flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPreviewIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === previewIndex ? "w-6 bg-signal-bright" : "w-2 bg-steel/30 hover:bg-steel/60"
                  }`}
                  aria-label={`Preview slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Slide Items List */}
      <div className="flex flex-col gap-5">
        {slides.map((slide, idx) => (
          <SlideRow
            key={idx}
            slide={slide}
            idx={idx}
            total={slides.length}
            onUpdate={update}
            onRemove={remove}
            onMove={move}
          />
        ))}
      </div>

      {/* Add New Slide Button */}
      <button
        type="button"
        onClick={add}
        className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-steel/30 py-4 font-mono text-xs uppercase tracking-widest text-steel hover:border-signal/60 hover:bg-signal/5 hover:text-bone transition-all duration-200 cursor-pointer"
      >
        + Add New Slide Picture
      </button>
    </div>
  );
}

function SlideRow({
  slide,
  idx,
  total,
  onUpdate,
  onRemove,
  onMove,
}: {
  slide: SlideItem;
  idx: number;
  total: number;
  onUpdate: (idx: number, field: keyof SlideItem, value: string) => void;
  onRemove: (idx: number) => void;
  onMove: (idx: number, dir: -1 | 1) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-steel/20 bg-ink-3/50 p-5 shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-steel/15 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-signal-bright uppercase tracking-wider font-bold">
            Slide #{idx + 1}
          </span>
          {slide.alt && (
            <span className="text-xs text-steel-dim truncate max-w-[200px] sm:max-w-none">
              — {slide.alt}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Move Up */}
          <button
            type="button"
            disabled={idx === 0}
            onClick={() => onMove(idx, -1)}
            title="Move Up"
            className="rounded px-2 py-1 font-mono text-xs text-steel hover:text-bone disabled:opacity-30 disabled:hover:text-steel cursor-pointer"
          >
            ↑
          </button>
          {/* Move Down */}
          <button
            type="button"
            disabled={idx === total - 1}
            onClick={() => onMove(idx, 1)}
            title="Move Down"
            className="rounded px-2 py-1 font-mono text-xs text-steel hover:text-bone disabled:opacity-30 disabled:hover:text-steel cursor-pointer"
          >
            ↓
          </button>
          {/* Remove */}
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="font-mono text-[11px] text-red-400 hover:text-red-300 uppercase tracking-widest cursor-pointer ml-2"
          >
            ✕ Remove
          </button>
        </div>
      </div>

      {/* Grid: Controls & Uploader on Left, Thumbnail on Right */}
      <div className="grid gap-6 lg:grid-cols-[1fr_200px] items-center">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <Label hint="Accessible description of the character or illustration">
              Alt Text / Title
            </Label>
            <input
              type="text"
              value={slide.alt}
              onChange={(e) => onUpdate(idx, "alt", e.target.value)}
              placeholder="e.g. Security Leader Host Character 1"
              className={inputCls}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <Label hint="Direct image path or URL — or upload a new photo below">
              Image URL / Path
            </Label>
            <input
              type="text"
              value={slide.src}
              onChange={(e) => onUpdate(idx, "src", e.target.value)}
              placeholder="/brand/about-slide-1.webp"
              className={inputCls}
            />
          </label>

          {/* Quick File Upload / Replace Zone */}
          <SlidePhotoUpload
            slideIndex={idx}
            onPhotoUploaded={(newPath) => onUpdate(idx, "src", newPath)}
          />
        </div>

        {/* Thumbnail Preview */}
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="font-mono text-[10px] uppercase text-steel-dim">
            Slide Thumbnail
          </span>
          <div className="relative h-[180px] w-[180px] rounded-xl border border-steel/20 bg-ink-2/60 p-2 overflow-hidden flex items-center justify-center">
            {slide.src ? (
              <Image
                src={slide.src}
                alt={slide.alt || `Slide ${idx + 1}`}
                fill
                className="object-contain"
                sizes="180px"
              />
            ) : (
              <span className="text-xs text-steel-dim">No image set</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlidePhotoUpload({
  slideIndex,
  onPhotoUploaded,
}: {
  slideIndex: number;
  onPhotoUploaded: (url: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    setUploadState("uploading");
    setUploadError(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("prefix", "slide");

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok || json.error) {
        setUploadError(json.error || "Upload failed.");
        setUploadState("error");
        return;
      }

      onPhotoUploaded(json.path);
      setUploadState("done");
      setTimeout(() => setUploadState("idle"), 3500);
    } catch {
      setUploadError("Network error — please try again.");
      setUploadState("error");
    }
  };

  const inputId = `slide-upload-${slideIndex}`;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-all duration-200 ${
          isDragOver
            ? "border-signal-bright bg-signal/10 scale-[1.01]"
            : uploadState === "done"
            ? "border-emerald-500/60 bg-emerald-500/10"
            : uploadState === "error"
            ? "border-red-500/60 bg-red-500/10"
            : "border-steel/30 bg-ink-2/60 hover:border-signal/60 hover:bg-signal/5"
        }`}
      >
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
          disabled={uploadState === "uploading"}
        />

        {uploadState === "uploading" && (
          <div className="flex items-center gap-2">
            <span
              className="block h-5 w-5 rounded-full border-2 border-signal/30 border-t-signal-bright animate-spin"
            />
            <span className="font-mono text-[11px] text-signal-bright uppercase tracking-widest">
              Uploading picture…
            </span>
          </div>
        )}

        {uploadState === "done" && (
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="font-mono text-sm">✓</span>
            <span className="font-mono text-[11px] uppercase tracking-widest">
              Picture replaced successfully!
            </span>
          </div>
        )}

        {uploadState === "error" && (
          <div className="flex flex-col items-center gap-1">
            <span className="font-mono text-[11px] text-red-400">
              ✕ {uploadError || "Upload failed"}
            </span>
            <span className="font-mono text-[10px] text-steel-dim underline">Click to retry</span>
          </div>
        )}

        {uploadState === "idle" && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-mono text-xs text-signal-bright font-bold">
              📁 Replace Image:
            </span>
            <span className="text-xs text-bone">
              Drop new picture here or <span className="text-signal-bright underline">browse</span>
            </span>
            <span className="font-mono text-[10px] text-steel-dim">
              (PNG · WebP · JPEG · AVIF)
            </span>
          </div>
        )}
      </label>
    </div>
  );
}

