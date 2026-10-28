"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Tilt3D } from "./Tilt3D";

type Slide = { src: string; alt: string };

interface AboutImageSlideshowProps {
  /** Slides from the DB / CMS. Falls back to the 3 original avatar images. */
  slides?: Slide[];
}

export function AboutImageSlideshow({ slides }: AboutImageSlideshowProps) {
  const activeSlides: Slide[] =
    slides && slides.length > 0
      ? slides
      : [
          { src: "/brand/about-slide-1.webp", alt: "Security Leader Avatar 1" },
          { src: "/brand/about-slide-2.webp", alt: "Security Leader Avatar 2" },
          { src: "/brand/about-slide-3.webp", alt: "Security Leader Avatar 3" },
        ];

  const [index, setIndex] = useState(0);

  // Reset index if slides change (e.g. admin removes a slide)
  useEffect(() => {
    setIndex(0);
  }, [activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % activeSlides.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const currentSlide = activeSlides[index] || activeSlides[0];

  return (
    <div className="relative flex flex-col items-center justify-center">
      <Tilt3D maxTilt={12} scale={1.03} className="relative z-10 w-full max-w-[480px]">
        <div className="preserve-3d relative flex items-center justify-center min-h-[360px] sm:min-h-[440px]">
          {/* Neon Glow Aura */}
          <div
            aria-hidden
            className="absolute h-[300px] w-[300px] sm:h-[380px] sm:w-[380px] rounded-full bg-radial from-signal/30 via-signal-bright/15 to-transparent blur-3xl opacity-80 animate-pulse-3d"
          />

          {/* Fixed Frame for Smooth Crossfade */}
          <div className="relative z-10 h-[340px] w-[300px] sm:h-[440px] sm:w-[380px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]">
            <AnimatePresence mode="sync">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full"
              >
                <Image
                  src={currentSlide.src}
                  alt={currentSlide.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 640px) 300px, 380px"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Tilt3D>

      {/* Slide Navigation Dots — only show if more than 1 slide */}
      {activeSlides.length > 1 && (
        <div className="relative z-20 mt-4 flex items-center gap-2.5">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                i === index
                  ? "w-8 bg-signal-bright shadow-[0_0_12px_rgba(130,201,30,0.8)]"
                  : "w-2.5 bg-steel/30 hover:bg-steel/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
