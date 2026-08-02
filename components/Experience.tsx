"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import type { ArtworkWithImages } from "@/lib/data";
import GalleryBackground from "./GalleryBackground";

type Props = {
  artworks: ArtworkWithImages[];
  heroDesktop: string;
  heroMobile: string;
  heroPeople: string;
};

// Coordinates measured directly from the reference photos (fractions of the
// original pixel dimensions) — where the two blank canvases actually sit.
const DESKTOP_IMG = { w: 1672, h: 941 };
const MOBILE_IMG = { w: 941, h: 1672 };

const DESKTOP_FRAMES = [
  { x0: 0.023, y0: 0.16, x1: 0.229, y1: 0.676 }, // left wall
  { x0: 0.759, y0: 0.171, x1: 0.96, y1: 0.685 }, // right wall
];

const MOBILE_FRAMES = [
  { x0: 0.037, y0: 0.222, x1: 0.179, y1: 0.55 }, // left
  { x0: 0.82, y0: 0.221, x1: 0.963, y1: 0.602 }, // right
];

export default function Experience({ artworks, heroDesktop, heroMobile, heroPeople }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dragState = useRef({ startX: 0, startScroll: 0, dragging: false, moved: 0 });
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  // Only the foreground (people + composited frame artwork + title) fades.
  // The photo itself never dims, tints, or blurs during this transition.
  const foregroundOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const peopleY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  // Subtle continuous push-in across the whole page — "camera moves deeper".
  const { scrollYProgress: pageProgress } = useScroll();
  const bgScale = useTransform(pageProgress, [0, 1], [1, 1.06]);

  const selected = artworks.find((a) => a.id === selectedId) || null;
  const framedArt = [artworks[0] ?? null, artworks[1] ?? null];
  const framedUrls = framedArt.map((a) => a?.screenshot_url ?? null);

  const onFrameSelect = (i: number) => {
    const art = framedArt[i];
    if (art) setSelectedId(art.id);
  };

  // Pointer-drag-to-scroll for the gallery row (mouse on desktop; touch
  // still gets native scroll-snap swipe for free).
  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    dragState.current = { startX: e.clientX, startScroll: track.scrollLeft, dragging: true, moved: 0 };
    track.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const track = trackRef.current;
    const d = dragState.current;
    if (!track || !d.dragging) return;
    const delta = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(delta));
    track.scrollLeft = d.startScroll - delta;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragState.current.dragging = false;
  };

  return (
    <main className="bg-black">
      {/* The photo — always fully visible, never covered by any overlay. */}
      <motion.div className="fixed inset-0 -z-10" style={{ scale: bgScale }}>
        <GalleryBackground
          src={heroDesktop}
          imgW={DESKTOP_IMG.w}
          imgH={DESKTOP_IMG.h}
          visibilityClass="hidden md:block"
          frames={DESKTOP_FRAMES}
          framedArtworkUrls={framedUrls}
          frameOpacity={foregroundOpacity}
          onSelectFrame={onFrameSelect}
        />
        <GalleryBackground
          src={heroMobile}
          imgW={MOBILE_IMG.w}
          imgH={MOBILE_IMG.h}
          visibilityClass="block md:hidden"
          frames={MOBILE_FRAMES}
          framedArtworkUrls={framedUrls}
          frameOpacity={foregroundOpacity}
          onSelectFrame={onFrameSelect}
        />
      </motion.div>

      {/* Hero runway */}
      <div ref={scrollRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-between overflow-hidden pointer-events-none">
          <motion.h1
            style={{ opacity: foregroundOpacity }}
            className="font-display italic text-parchment text-3xl md:text-5xl tracking-wide mt-10 text-center px-6 drop-shadow-lg"
          >
            Ayodele<span className="text-brass not-italic">art</span>
          </motion.h1>

          <motion.div
            style={{ opacity: foregroundOpacity, y: peopleY }}
            className="relative w-full max-w-3xl aspect-[3/2] mb-2 pointer-events-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroPeople} alt="" className="absolute inset-0 w-full h-full object-contain object-bottom" />
          </motion.div>

          <motion.p
            style={{ opacity: foregroundOpacity }}
            className="text-parchment/80 text-xs tracking-[0.3em] uppercase mb-8 font-body drop-shadow"
          >
            Scroll to step inside
          </motion.p>
        </div>
      </div>

      {/* Gallery — same photo continues behind, unobstructed */}
      <section className="relative pb-32 pt-6">
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="flex gap-5 md:gap-8 overflow-x-auto snap-x snap-mandatory px-6 md:px-[max(1.5rem,calc(50%-36rem))] pb-4 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: "none" }}
        >
          {artworks.map((art) => (
            <motion.div
              key={art.id}
              layoutId={`card-${art.id}`}
              onClick={() => {
                if (dragState.current.moved < 6) setSelectedId(art.id);
              }}
              className="group relative shrink-0 snap-center w-[78vw] md:w-[22rem] aspect-[3/4] md:aspect-[4/5] rounded-sm overflow-hidden shadow-2xl cursor-pointer"
            >
              {art.screenshot_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={art.screenshot_url} alt={art.title} className="w-full h-full object-cover" draggable={false} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                {art.category && (
                  <p className="text-brass text-[0.65rem] tracking-[0.25em] uppercase mb-1 font-body">
                    {art.category}
                  </p>
                )}
                <h2 className="font-display text-parchment text-xl md:text-2xl">{art.title}</h2>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <ArtworkOverlay artwork={selected} onClose={() => setSelectedId(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}

function ArtworkOverlay({ artwork, onClose }: { artwork: ArtworkWithImages; onClose: () => void }) {
  return (
    <>
      {/* Invisible click-catcher to close — no visual scrim over the photo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <motion.div
        layoutId={`card-${artwork.id}`}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 pointer-events-none"
      >
        <div
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-black/40 backdrop-blur-md rounded-lg pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="sticky top-4 float-right mr-4 z-10 w-10 h-10 rounded-full border border-brass/40 text-parchment bg-black/40 flex items-center justify-center hover:bg-brass/20 transition-colors"
          >
            ✕
          </button>

          <div className="p-6 md:p-10 clear-both">
            {artwork.category && (
              <p className="text-brass text-xs tracking-[0.3em] uppercase mb-2 font-body">
                {artwork.category}
              </p>
            )}
            <h1 className="font-display text-parchment text-3xl md:text-4xl mb-1">{artwork.title}</h1>
            <p className="text-parchment/60 text-sm mb-6 font-body">
              {[artwork.year, artwork.dimensions].filter(Boolean).join(" · ")}
            </p>

            {artwork.screenshot_url && (
              <div className="relative w-full aspect-[4/5] md:aspect-[16/10] mb-8 rounded-sm overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={artwork.screenshot_url} alt={artwork.title} className="w-full h-full object-cover" />
              </div>
            )}

            {artwork.description && (
              <p className="text-parchment/90 leading-relaxed mb-8 font-body">{artwork.description}</p>
            )}

            {artwork.story && (
              <div className="border-t border-brass/20 pt-6 mb-10">
                <p className="text-brass text-xs tracking-[0.3em] uppercase mb-3 font-body">Inspiration</p>
                <p className="text-parchment/80 leading-relaxed whitespace-pre-line font-body">
                  {artwork.story}
                </p>
              </div>
            )}

            {artwork.images.length > 0 && (
              <div className="space-y-5">
                {artwork.images.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.id}
                    src={img.url}
                    alt=""
                    className="w-full rounded-sm object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
