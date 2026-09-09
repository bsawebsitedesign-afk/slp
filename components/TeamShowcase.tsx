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

      {/* Cyber-Holographic Full Profile Modal Popup */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-ink/80 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl border border-steel/25 bg-ink-2/95 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-left ring-1 ring-steel/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              aria-label="Close modal"
              className="absolute top-5 right-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-steel/25 bg-ink-3 font-mono text-sm text-steel transition-colors hover:border-signal hover:bg-signal/20 hover:text-bone"
            >
              ✕
            </button>

            {/* Modal Header: Avatar & Key Info */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative aspect-square w-28 sm:w-36 shrink-0 overflow-hidden rounded-2xl border border-steel/20 bg-ink-3 shadow-xl">
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
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/15 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-signal-bright uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal-bright animate-ping" />
                    {selectedMember.tag}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-steel-dim uppercase">
                    SLP LEADERSHIP
                  </span>
                </div>

                <h2 className="display text-2xl sm:text-3xl text-bone">
                  {selectedMember.name}
                </h2>

                <p className="font-mono text-xs text-signal-bright font-medium tracking-wide">
                  {selectedMember.role}
                </p>

                {/* LinkedIn Profile Button */}
                {selectedMember.linkedinUrl && (
                  <a
                    href={selectedMember.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-[#0A66C2]/40 bg-[#0A66C2]/15 px-4 py-1.5 font-mono text-[11px] tracking-[0.14em] text-bone uppercase transition-all duration-300 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:shadow-lg hover:shadow-[#0A66C2]/30"
                  >
                    <DoodleLinkedIn className="h-4 w-4" fill="#0A66C2" />
                    <span>Connect on LinkedIn ↗</span>
                  </a>
                )}
              </div>
            </div>

            <div className="my-6 block h-px w-full bg-steel/15" />

            {/* Detailed Bio Content */}
            <div className="flex flex-col gap-4 text-steel-dim text-sm sm:text-[15px] leading-relaxed">
              {(selectedMember.fullBio || selectedMember.bio)
                .split("\n\n")
                .map((paragraph, i) => (
                  <p key={i} className="text-steel-dim leading-[1.8]">
                    {paragraph}
                  </p>
                ))}
            </div>

            {/* Modal Bottom Bar */}
            <div className="mt-8 flex items-center justify-between border-t border-steel/15 pt-4">
              <span className="flex items-center gap-2 font-mono text-[10px] text-steel-dim uppercase tracking-widest">
                <DoodleShield className="h-4 w-4 text-signal" />
                SECURITY LEADER PODCAST
              </span>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="rounded-full border border-steel/25 px-5 py-2 font-mono text-xs text-bone uppercase tracking-wider transition-colors hover:border-steel hover:bg-ink-3 cursor-pointer"
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

