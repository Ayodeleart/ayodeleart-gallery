"use client";

import { useEffect, useRef, useState } from "react";
import { motion, MotionValue } from "framer-motion";

type Slot = { xCenter: number; yBottom: number; widthFrac: number };

type Props = {
  src: string;
  imgW: number; // dimensions of the BACKGROUND photo this layer sits on top of
  imgH: number;
  visibilityClass: string;
  slot: Slot;
  aspect: number; // people image's own width/height
  opacity: MotionValue<number>;
  parallaxY: MotionValue<number>; // independent subtle foreground drift
};

// Genuinely separate depth layer from the background/frames — computes its
// own cover-mapping against the same viewport so it lines up with the photo
// at rest, but carries its own independent motion instead of living inside
// whatever transform the background group has.
export default function PeopleLayer({ src, imgW, imgH, visibilityClass, slot, aspect, opacity, parallaxY }: Props) {
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
      setRect({ scale, offsetX: (cw - imgW * scale) / 2, offsetY: (ch - imgH * scale) / 2 });
    }
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [imgW, imgH]);

  const width = slot.widthFrac * imgW * rect.scale;
  const height = width / aspect;
  const left = rect.offsetX + slot.xCenter * imgW * rect.scale - width / 2;
  const top = rect.offsetY + slot.yBottom * imgH * rect.scale - height;

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${visibilityClass}`}>
      <motion.img
        src={src}
        alt=""
        style={{ position: "absolute", left, top, width, height, opacity, y: parallaxY }}
      />
    </div>
  );
}
