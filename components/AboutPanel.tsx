"use client";

import { motion, MotionValue } from "framer-motion";

type Props = {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
};

// Placeholder content — swap portrait/bio/signature/links for the real
// thing whenever you have them. Flagging this clearly since none of it was
// supplied yet.
export default function AboutPanel({ opacity, scale }: Props) {
  return (
    <motion.div
      style={{ opacity, scale }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
    >
      <div
        className="pointer-events-auto w-full max-w-md rounded-lg border border-brass/30 bg-black/35 backdrop-blur-xl px-8 py-10 text-center shadow-2xl"
        style={{ boxShadow: "0 0 80px rgba(0,0,0,0.5)" }}
      >
        <div className="mx-auto mb-6 w-24 h-24 rounded-full border border-brass/50 bg-wall/60 flex items-center justify-center overflow-hidden">
          {/* Replace with an actual portrait image when available */}
          <span className="font-display italic text-brass text-3xl">A</span>
        </div>

        <h2 className="font-display text-parchment text-2xl mb-1">Ayodele</h2>
        <p className="text-brass text-[0.65rem] tracking-[0.3em] uppercase mb-5 font-body">
          Artist &amp; Developer
        </p>

        <p className="text-parchment/80 text-sm leading-relaxed mb-6 font-body">
          Working across paint and code — this collection is a room I built to hold both.
          Every piece here started as a rough note before it became a canvas.
        </p>

        <p className="font-display italic text-parchment/60 text-lg mb-6">Ayodele</p>

        <a
          href="#collection"
          className="inline-block text-xs tracking-[0.25em] uppercase text-brass border border-brass/40 rounded-full px-6 py-3 hover:bg-brass/10 transition-colors font-body"
        >
          View the collection
        </a>
      </div>
    </motion.div>
  );
}
