"use client";

import { useEffect, useRef, useState } from "react";
import { motion, MotionValue } from "framer-motion";

type FrameSlot = { x0: number; y0: number; x1: number; y1: number };

type Props = {
  src: string;
  imgW: number;
  imgH: number;
  visibilityClass: string;
  frames: FrameSlot[];
  framedArtworkUrls: (string | null)[];
  frameOpacity: MotionValue<number>;
  onSelectFrame: (index: number) => void;
};

// The environment layer only: the photo and the artwork composited into its
// frames. These move together as one rigid unit because the frames are
// painted onto specific pixels of this exact photo — anything else (people,
// About panel, cards) is a separate depth layer with its own motion.
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
      setRect({
        scale,
        offsetX: (cw - imgW * scale) / 2,
        offsetY: (ch - imgH * scale) / 2,
      });
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
            type="button"
            aria-label="View artwork"
            onClick={() => artUrl && onSelectFrame(i)}
            style={{ position: "absolute", left, top, width, height, opacity: frameOpacity }}
            className="overflow-hidden bg-transparent border-none p-0 appearance-none"
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
