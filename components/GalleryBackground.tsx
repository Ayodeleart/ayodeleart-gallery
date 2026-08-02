"use client";

import { useEffect, useRef, useState } from "react";
import { motion, MotionValue } from "framer-motion";

type FrameSlot = {
  // fractions (0-1) of the *original* photo's pixel dimensions
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

type Props = {
  src: string;
  imgW: number;
  imgH: number;
  visibilityClass: string; // e.g. "hidden md:block" or "block md:hidden"
  frames: FrameSlot[];
  framedArtworkUrls: (string | null)[];
  frameOpacity: MotionValue<number>;
  onSelectFrame: (index: number) => void;
};

// Replicates the browser's object-fit:cover math in JS so overlay elements
// (the artwork composited into each blank canvas) line up with the actual
// photo content pixel-for-pixel, at any viewport size.
export default function GalleryBackground({
  src,
  imgW,
  imgH,
  visibilityClass,
  frames,
  framedArtworkUrls,
  frameOpacity,
  onSelectFrame,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState({ scale: 1, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    function recalc() {
      const el = containerRef.current;
      if (!el) return;
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (!cw || !ch) return;
      const scale = Math.max(cw / imgW, ch / imgH);
      const renderedW = imgW * scale;
      const renderedH = imgH * scale;
      setRect({ scale, offsetX: (cw - renderedW) / 2, offsetY: (ch - renderedH) / 2 });
    }
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [imgW, imgH]);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${visibilityClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {frames.map((f, i) => {
        const left = rect.offsetX + f.x0 * imgW * rect.scale;
        const top = rect.offsetY + f.y0 * imgH * rect.scale;
        const width = (f.x1 - f.x0) * imgW * rect.scale;
        const height = (f.y1 - f.y0) * imgH * rect.scale;
        const artUrl = framedArtworkUrls[i];

        return (
          <motion.button
            key={i}
            aria-label="View artwork"
            onClick={() => artUrl && onSelectFrame(i)}
            style={{
              position: "absolute",
              left,
              top,
              width,
              height,
              opacity: frameOpacity,
              cursor: artUrl ? "pointer" : "default",
            }}
            className="overflow-hidden"
          >
            {artUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={artUrl} alt="" className="w-full h-full object-cover" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
