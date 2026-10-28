"use client";

import { useState } from "react";
import Image from "next/image";
import { Label, inputCls } from "./ui";
import type { TeamMember } from "../TeamShowcase";

export function MembersEditor({ members: initial }: { members: TeamMember[] }) {
  const [members, setMembers] = useState<TeamMember[]>(initial || []);

  const update = (idx: number, field: keyof TeamMember, value: any) => {
    setMembers((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const remove = (idx: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== idx));
  };

  const add = () => {
    setMembers((prev) => [
      ...prev,
      {
        id: `member-${Date.now()}`,
        name: "New Team Member",
        role: "Host / Producer",
        tag: "Host",
        photo: "/brand/member1.webp",
        bio: "Team member description...",
        objectPosition: "50% 15%",
        zoom: 100,
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-6">
      <input type="hidden" name="members_json" value={JSON.stringify(members)} />

      {members.map((m, idx) => {
        const currentPos = m.objectPosition || "50% 15%";
        const currentZoom = m.zoom || 100;

        // Extract Y percentage if in "50% Y%" format
        const yMatch = currentPos.match(/\d+%/g);
        const yVal = yMatch && yMatch.length > 1 ? parseInt(yMatch[1], 10) : 15;

        return (
          <div key={m.id || idx} className="flex flex-col gap-5 rounded-2xl border border-steel/20 bg-ink-3/50 p-5 shadow-sm">

            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-steel/15 pb-3">
              <span className="font-mono text-xs text-signal-bright uppercase tracking-wider font-bold">
                Team Member #{idx + 1}: {m.name || "Untitled"}
              </span>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="font-mono text-[11px] text-red-400 hover:text-red-300 uppercase tracking-widest cursor-pointer"
              >
                ✕ Remove
              </button>
            </div>

            {/* Grid Layout: Controls on Left, Live Card Preview on Right */}
            <div className="grid gap-6 lg:grid-cols-[1fr_260px]">

              {/* Left Form Inputs & Crop Controls */}
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="flex flex-col gap-1.5">
                    <Label>Full Name</Label>
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => update(idx, "name", e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Marcus Vance"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <Label>Role / Title</Label>
                    <input
                      type="text"
                      value={m.role}
                      onChange={(e) => update(idx, "role", e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Executive Host & CISO Advisor"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <Label>Badge Tag</Label>
                    <input
                      type="text"
                      value={m.tag}
                      onChange={(e) => update(idx, "tag", e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Host, Co-Host, Producer"
                    />
                  </label>
                </div>

                {/* Photo Upload Widget */}
                <PhotoUploader
                  currentPhoto={m.photo}
                  memberName={m.name}
                  onPhotoChange={(newPath) => update(idx, "photo", newPath)}
                />

                <label className="flex flex-col gap-1.5">
                  <Label hint="e.g. https://www.linkedin.com/in/username">LinkedIn Profile URL</Label>
                  <input
                    type="url"
                    value={m.linkedinUrl || ""}
                    onChange={(e) => update(idx, "linkedinUrl", e.target.value)}
                    className={inputCls}
                    placeholder="https://www.linkedin.com/in/..."
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <Label hint="Brief summary on card">Card Bio Summary</Label>
                    <textarea
                      rows={2}
                      value={m.bio}
                      onChange={(e) => update(idx, "bio", e.target.value)}
                      className={`${inputCls} resize-y`}
                      placeholder="Brief member background..."
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <Label hint="Full multi-paragraph story shown inside popup modal">Full Detailed Bio (Popup Modal)</Label>
                    <textarea
                      rows={4}
                      value={m.fullBio || ""}
                      onChange={(e) => update(idx, "fullBio", e.target.value)}
                      className={`${inputCls} resize-y`}
                      placeholder="Detailed member biography & background..."
                    />
                  </label>
                </div>

                {/* Photo Crop & Alignment Controls */}
                <div className="rounded-xl border border-steel/20 bg-ink-2/70 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-bone font-bold uppercase tracking-wider">
                      ✂️ Photo Crop & Alignment Controls
                    </span>
                    <span className="font-mono text-[10px] text-steel-dim">
                      Pos: {currentPos} | Zoom: {currentZoom}%
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label hint="Adjust vertical face focus inside card frame">Vertical Focus (Y-Axis)</Label>
                      <div className="flex gap-1.5">
                        {(["0%", "20%", "50%"] as const).map((y, pi) => (
                          <button
                            key={pi}
                            type="button"
                            onClick={() => update(idx, "objectPosition", `50% ${y}`)}
                            className="rounded border border-steel/20 bg-ink-3 px-2 py-0.5 font-mono text-[10px] text-bone hover:border-steel cursor-pointer"
                          >
                            {["Top", "Face Focus", "Center"][pi]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={yVal}
                      onChange={(e) => update(idx, "objectPosition", `50% ${e.target.value}%`)}
                      className="w-full accent-signal cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label hint="Scale image inside card frame">Photo Zoom ({currentZoom}%)</Label>
                      <button
                        type="button"
                        onClick={() => update(idx, "zoom", 100)}
                        className="rounded border border-steel/20 bg-ink-3 px-2 py-0.5 font-mono text-[10px] text-bone hover:border-steel cursor-pointer"
                      >
                        Reset (100%)
                      </button>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="180"
                      step="5"
                      value={currentZoom}
                      onChange={(e) => update(idx, "zoom", parseInt(e.target.value, 10))}
                      className="w-full accent-signal cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Real-time Live Card Crop Preview */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-steel-dim uppercase tracking-wider text-center">
                  Live Card Preview
                </span>
                <div className="relative overflow-hidden rounded-xl border border-steel/25 bg-ink-2 p-3 shadow-lg">
                  <div className="relative aspect-[16/11] w-full overflow-hidden rounded-lg bg-ink-3">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name || "Preview"}
                        fill
                        unoptimized
                        style={{
                          objectFit: "cover",
                          objectPosition: currentPos,
                          transform: `scale(${currentZoom / 100})`,
                        }}
                        className="transition-all duration-200"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-xs text-steel-dim">
                        No image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-2 right-2 rounded-full bg-ink/80 px-2 py-0.5 font-mono text-[9px] text-signal-bright uppercase border border-steel/20">
                      {m.tag || "HOST"}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="font-display text-sm text-bone font-bold truncate">{m.name || "Member Name"}</p>
                      <p className="font-mono text-[10px] text-signal-bright truncate">{m.role || "Role Title"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="self-start rounded-full border border-steel/25 bg-ink-2 px-5 py-2.5 font-mono text-xs tracking-wider text-bone uppercase hover:border-steel cursor-pointer transition-colors"
      >
        + Add Team Member
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/*  Photo Uploader — drag-and-drop or click       */
/* ────────────────────────────────────────────── */

type UploadState = "idle" | "uploading" | "done" | "error";

function PhotoUploader({
  currentPhoto,
  memberName,
  onPhotoChange,
}: {
  currentPhoto: string;
  memberName: string;
  onPhotoChange: (path: string) => void;
}) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = async (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowed.includes(file.type)) {
      setUploadError("Invalid type. Use JPEG, PNG, WebP, GIF, or AVIF.");
      setUploadState("error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("File too large — max 8 MB.");
      setUploadState("error");
      return;
    }

    setUploadState("uploading");
    setUploadError("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok || json.error) {
        setUploadError(json.error || "Upload failed.");
        setUploadState("error");
        return;
      }

      // ✅ Update photo path instantly → card preview and hidden input update immediately
      onPhotoChange(json.path);
      setUploadState("done");
      setTimeout(() => setUploadState("idle"), 3500);
    } catch {
      setUploadError("Network error — please try again.");
      setUploadState("error");
    }
  };

  const inputId = `photo-upload-${(memberName || "member").replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-baseline justify-between gap-2">
        <span className="kicker text-steel/90 font-bold">Profile Photo</span>
        <span className="font-mono text-[10px] normal-case text-steel-dim/70">JPEG · PNG · WebP · max 8 MB</span>
      </span>

      {/* Drop Zone */}
      <label
        htmlFor={inputId}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-5 text-center transition-all duration-200 ${
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
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          disabled={uploadState === "uploading"}
        />

        {uploadState === "uploading" && (
          <div className="flex flex-col items-center gap-2">
            <span
              className="block h-7 w-7 rounded-full border-2 border-signal/30 border-t-signal-bright"
              style={{ animation: "slp-spin .6s linear infinite" }}
            />
            <span className="font-mono text-[11px] text-signal-bright uppercase tracking-widest">Uploading…</span>
          </div>
        )}

        {uploadState === "done" && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">✅</span>
            <span className="font-mono text-[11px] text-emerald-400 uppercase tracking-widest">Uploaded! Preview updated.</span>
            <span className="font-mono text-[10px] text-steel-dim truncate max-w-[220px]">{currentPhoto}</span>
          </div>
        )}

        {uploadState === "error" && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">⚠️</span>
            <span className="font-mono text-[11px] text-red-400 uppercase tracking-widest">Upload failed</span>
            <span className="font-mono text-[10px] text-red-300/80 max-w-[260px]">{uploadError}</span>
            <span className="mt-1 font-mono text-[10px] text-steel-dim underline">Click to try again</span>
          </div>
        )}

        {uploadState === "idle" && (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-steel/30 bg-ink-3 text-xl">📷</div>
            <div>
              <p className="font-mono text-[12px] font-bold text-bone">Click to upload or drag & drop</p>
              <p className="font-mono text-[10px] text-steel-dim mt-0.5">Preview updates instantly after upload</p>
            </div>
            {currentPhoto && (
              <p className="font-mono text-[10px] text-steel-dim/60 truncate max-w-[220px]">Current: {currentPhoto}</p>
            )}
          </>
        )}
      </label>

      {/* Manual URL / path fallback */}
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] text-steel-dim/60 uppercase tracking-wider">— or enter URL / path manually —</span>
        <input
          type="text"
          value={currentPhoto}
          onChange={(e) => { onPhotoChange(e.target.value); setUploadState("idle"); }}
          className={inputCls}
          placeholder="/brand/photo.webp or https://..."
        />
      </div>
    </div>
  );
}
