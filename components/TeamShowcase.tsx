"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Tilt3D } from "./Tilt3D";
import { DoodleShield, DoodleMic, DoodleSoundwave, DoodleLinkedIn } from "./DoodleIcons";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  fullBio?: string;
  linkedinUrl?: string;
  tag: string;
  objectPosition?: string;
  zoom?: number;
};

export function TeamShowcase({
  members,
  title = "Meet the Voices Behind the Podcast",
  subtitle = "LEADERSHIP & HOSTS",
}: {
  members: TeamMember[];
  title?: string;
  subtitle?: string;
}) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Close modal on Escape key press & prevent background scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedMember(null);
    };
    if (selectedMember) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMember]);

  return (
    <section className="relative overflow-hidden px-[clamp(18px,4vw,56px)] py-[clamp(50px,8vh,100px)] rule">
      
      {/* Background Ambient Glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, rgba(31,121,192,0.15), transparent 75%)",
        }}
      />

      <div className="shell relative px-0 flex flex-col gap-10 z-10">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <span className="block h-px w-10 bg-signal" />
            <span className="kicker text-signal-bright tracking-[0.28em]">{subtitle}</span>
          </div>
          <h2 className="display text-[clamp(26px,3.8vw,52px)] text-bone">{title}</h2>
          <p className="max-w-[54ch] text-[14.5px] leading-relaxed text-steel-dim">
            The security visionaries, executive hosts, and producers bringing you unfiltered industry perspectives every episode. Click any member to read their full story.
          </p>
        </div>

        {/* Compact Cyber-Holographic Team Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <Tilt3D key={member.id} maxTilt={8} scale={1.02} className="w-full">
              <div
                onClick={() => setSelectedMember(member)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedMember(member);
                }}
                className="group preserve-3d relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-steel/18 bg-ink-2/90 p-4.5 backdrop-blur-xl transition-all duration-500 hover:border-signal/60 hover:shadow-[0_20px_50px_rgba(31,121,192,0.25)] shadow-lg"
              >
                
                {/* Neon Holographic Border Glow */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(62,155,230,0.18) 0%, rgba(130,201,30,0.08) 50%, transparent 100%)",
                  }}
                />

                <div>
                  {/* Header Image */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-ink-3 border border-steel/12 shadow-inner">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      style={{
                        objectFit: "cover",
                        objectPosition: member.objectPosition || "50% 15%",
                        transform: `scale(${(member.zoom || 100) / 100})`,
                      }}
                      className="transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/30 to-transparent" />

                    {/* Live Badge Tag */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full border border-steel/20 bg-ink/85 px-3 py-1 text-[10px] font-mono tracking-[0.14em] text-bone uppercase backdrop-blur-md shadow-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal-bright animate-pulse" />
                      <span>{member.tag}</span>
                    </div>

                    {/* Member Name Overlay on Image Bottom */}
                    <div className="absolute bottom-2.5 left-3 right-3 translate-z-10">
                      <h3 className="display text-xl text-bone group-hover:text-signal-bright transition-colors drop-shadow-md">
                        {member.name}
                      </h3>
                      <p className="font-mono text-[11px] text-signal-bright font-medium tracking-wide">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Bio Description (Compact & Clean) */}
                  <div className="mt-3.5 px-1 translate-z-10">
                    <p className="line-clamp-3 text-[13px] leading-[1.65] text-steel-dim">
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* Footer Bar with View Profile CTA */}
                <div className="mt-4 flex items-center justify-between border-t border-steel/12 pt-3 px-1 translate-z-20">
                  <span className="flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.2em] text-steel-dim uppercase group-hover:text-signal-bright transition-colors">
                    <span>VIEW FULL PROFILE</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                  {member.linkedinUrl && (
                    <DoodleLinkedIn className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="#0A66C2" />
                  )}
                </div>

              </div>
            </Tilt3D>
          ))}
        </div>

      </div>

      {/* Cyber-Holographic Executive Bio Modal Popup */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6 bg-ink/85 backdrop-blur-2xl animate-fade-in"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-steel/25 border-t-2 border-t-signal-bright bg-ink-2/95 p-6 sm:p-9 shadow-[0_30px_90px_rgba(0,0,0,0.92)] text-left ring-1 ring-steel/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Ambient Glow inside Modal */}
            <div
              aria-hidden
              className="absolute top-0 right-0 h-64 w-64 rounded-full bg-signal-bright/10 blur-3xl pointer-events-none"
            />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              aria-label="Close profile"
              className="absolute top-5 right-5 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-steel/25 bg-ink-3 font-mono text-sm text-steel transition-all duration-300 hover:border-signal hover:bg-signal/20 hover:text-bone shadow-md"
            >
              ✕
            </button>

            {/* Modal Header: Avatar & Key Info */}
            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative aspect-square w-28 sm:w-36 shrink-0 overflow-hidden rounded-2xl border-2 border-steel/20 bg-ink-3 shadow-2xl ring-2 ring-signal/20">
                <Image
                  src={selectedMember.photo}
                  alt={selectedMember.name}
                  fill
                  sizes="144px"
                  style={{
                    objectFit: "cover",
                    objectPosition: selectedMember.objectPosition || "50% 15%",
                    transform: `scale(${(selectedMember.zoom || 100) / 100})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-2/80 via-transparent to-transparent" />
              </div>

              <div className="flex flex-col gap-2.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-bright/40 bg-signal/20 px-3.5 py-1 font-mono text-[10.5px] font-bold tracking-[0.16em] text-signal-bright uppercase shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-signal-bright animate-ping" />
                    {selectedMember.tag}
                  </span>
                  <span className="font-mono text-[10.5px] font-bold tracking-[0.22em] text-steel-dim uppercase">
                    SLP EXECUTIVE DOSSIER
                  </span>
                </div>

                <h2 className="display text-3xl sm:text-4xl text-bone tracking-tight">
                  {selectedMember.name}
                </h2>

                <p className="font-mono text-xs sm:text-sm text-signal-bright font-semibold tracking-wide">
                  {selectedMember.role}
                </p>

                {/* LinkedIn Profile Button */}
                {selectedMember.linkedinUrl && (
                  <a
                    href={selectedMember.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1.5 inline-flex w-fit items-center gap-2.5 rounded-full bg-[#0A66C2] px-5 py-2 font-mono text-[11px] font-bold tracking-[0.16em] text-white uppercase transition-all duration-300 hover:bg-[#004182] hover:scale-105 shadow-lg shadow-[#0A66C2]/30"
                  >
                    <DoodleLinkedIn className="h-4 w-4 fill-white" fill="#FFFFFF" />
                    <span>Connect on LinkedIn ↗</span>
                  </a>
                )}
              </div>
            </div>

            <div className="my-6 block h-px w-full bg-steel/15" />

            {/* Detailed Bio Content with Structured Layout */}
            <div className="flex flex-col gap-5">
              {(() => {
                const paragraphs = (selectedMember.fullBio || selectedMember.bio)
                  .split("\n\n")
                  .map((p) => p.trim())
                  .filter(Boolean);

                return paragraphs.map((paragraph, i) => {
                  const isFirst = i === 0;
                  const isLast = i === paragraphs.length - 1 && paragraphs.length > 1;
                  const isPodcastSpotlight =
                    isLast && (paragraph.toLowerCase().includes("podcast") || paragraph.toLowerCase().includes("on the"));

                  if (isFirst) {
                    return (
                      <div
                        key={i}
                        className="relative overflow-hidden rounded-2xl border-l-4 border-l-signal-bright border border-steel/18 bg-gradient-to-r from-signal/15 via-ink-3/80 to-ink-3 p-5 shadow-lg"
                      >
                        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold text-signal-bright uppercase tracking-[0.2em]">
                          <DoodleShield className="h-4 w-4 text-signal-bright" />
                          <span>Executive Summary</span>
                        </div>
                        <p className="text-bone text-[15px] sm:text-[16px] leading-[1.75] font-medium">
                          {paragraph}
                        </p>
                      </div>
                    );
                  }

                  if (isPodcastSpotlight) {
                    return (
                      <div
                        key={i}
                        className="relative rounded-2xl border border-signal-bright/30 bg-gradient-to-br from-signal-bright/12 via-ink-3 to-ink-3 p-5 shadow-xl"
                      >
                        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold text-signal-bright uppercase tracking-[0.22em]">
                          <DoodleSoundwave className="h-4 w-4 text-signal-bright" stroke="#82c91e" />
                          <span>On The Security Leader Podcast</span>
                        </div>
                        <p className="text-bone text-[14.5px] sm:text-[15px] leading-[1.8] font-normal">
                          {paragraph}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={i}
                      className="rounded-2xl border border-steel/12 bg-ink-3/50 p-4.5 transition-colors hover:border-steel/25"
                    >
                      <p className="text-steel-dim text-[14px] sm:text-[15px] leading-[1.82]">
                        {paragraph}
                      </p>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Bottom Footer */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-steel/15 pt-5">
              <span className="flex items-center gap-2 font-mono text-[10px] text-steel-dim uppercase tracking-widest font-semibold">
                <DoodleShield className="h-4 w-4 text-signal" />
                SECURITY LEADER PODCAST NETWORK
              </span>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="rounded-full border border-steel/25 bg-ink-3 px-6 py-2.5 font-mono text-xs font-bold text-bone uppercase tracking-wider transition-all duration-300 hover:border-signal hover:bg-signal/20 cursor-pointer shadow-md"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

