"use client";

import { useEffect, useRef, useState } from "react";
import { motion, MotionValue } from "framer-motion";

type FrameSlot = { x0: number; y0: number; x1: number; y1: number };
// Where the people group stands: xCenter/yBottom are fractions of the
// original photo; widthFrac controls how large they render (as a fraction
// of the photo's width) — this is what lets us pin their feet to the actual
// floor line instead of floating at an arbitrary flexbox position.
type PeopleSlot = { xCenter: number; yBottom: number; widthFrac: number };

type Props = {
  src: string;
  imgW: number;
  imgH: number;
  visibilityClass: string;
  frames: FrameSlot[];
  framedArtworkUrls: (string | null)[];
  frameOpacity: MotionValue<number>;
  onSelectFrame: (index: number) => void;
  peopleSrc?: string;
  peopleSlot?: PeopleSlot;
  peopleAspect?: number; // width / height of the people image
  peopleOpacity?: MotionValue<number>;
};

// Replicates the browser's object-fit:cover math in JS so both the artwork
// composited into each blank canvas AND the people cutout line up with the
// photo's actual content pixel-for-pixel, at any viewport size.
export default function GalleryBackground({
  src,
  imgW,
  imgH,
  visibilityClass,
  frames,
  framedArtworkUrls,
  frameOpacity,
  onSelectFrame,
  peopleSrc,
  peopleSlot,
  peopleAspect = 1024 / 1536,
  peopleOpacity,
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

  let peopleBox: { left: number; top: number; width: number; height: number } | null = null;
  if (peopleSlot) {
    const width = peopleSlot.widthFrac * imgW * rect.scale;
    const height = width / peopleAspect;
    const left = rect.offsetX + peopleSlot.xCenter * imgW * rect.scale - width / 2;
    const top = rect.offsetY + peopleSlot.yBottom * imgH * rect.scale - height;
    peopleBox = { left, top, width, height };
  }

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

      {peopleSrc && peopleBox && (
        <motion.img
          src={peopleSrc}
          alt=""
          style={{
            position: "absolute",
            left: peopleBox.left,
            top: peopleBox.top,
            width: peopleBox.width,
            height: peopleBox.height,
            opacity: peopleOpacity,
          }}
        />
      )}
    </div>
  );
}
