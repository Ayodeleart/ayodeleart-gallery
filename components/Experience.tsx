"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import type { ArtworkWithImages } from "@/lib/data";
import GalleryBackground from "./GalleryBackground";
import PeopleLayer from "./PeopleLayer";

type Props = {
  artworks: ArtworkWithImages[];
  heroDesktop: string;
  heroMobile: string;
  heroPeople: string;
};

// Coordinates measured directly from the reference photos (fractions of the
// original pixel dimensions) — where the two blank canvases actually sit.
const DESKTOP_IMG = { w: 1672, h: 941 };
const MOBILE_IMG = { w: 1024, h: 1536 };
const PEOPLE_IMG = { w: 1024, h: 1536 };

const DESKTOP_FRAMES = [
  { x0: 0.023, y0: 0.16, x1: 0.229, y1: 0.676 }, // left wall
  { x0: 0.759, y0: 0.171, x1: 0.96, y1: 0.685 }, // right wall
];
// New mobile photo has four side frames plus a spotlit center back wall.
// Using the inner-left/inner-right frames (clearest, most head-on) and the
// middle back-wall spotlight as the center slot.
const MOBILE_FRAMES = [
  { x0: 0.155, y0: 0.32, x1: 0.204, y1: 0.482 }, // inner-left
  { x0: 0.785, y0: 0.322, x1: 0.836, y1: 0.491 }, // inner-right
  { x0: 0.441, y0: 0.352, x1: 0.548, y1: 0.476 }, // center back wall
];

// Where the wall meets the floor in each photo (measured directly from the
// images) — the people cutout's feet get pinned exactly here, not wherever
// flexbox happened to land it.
const DESKTOP_PEOPLE = { xCenter: 0.5, yBottom: 0.68, widthFrac: 0.5 };
const MOBILE_PEOPLE = { xCenter: 0.5, yBottom: 0.56, widthFrac: 0.62 };

export default function Experience({ artworks, heroDesktop, heroMobile, heroPeople }: Props) {
  const pinRef = useRef<HTMLDivElement>(null); // spans hero + gallery, sticky photo lives inside
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dragState = useRef({ startX: 0, startScroll: 0, moved: 0 });
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });

  // Foreground (title, framed artwork, people) fades out over the first
  // ~40% of the pinned scroll range. The photo/environment is never
  // touched — no shared scale group. People are their own depth layer with
  // a small independent drift, distinct from the environment's own (zero)
  // motion, which is what actually reads as parallax/depth rather than
  // everything moving together.
  const foregroundOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const peopleParallaxY = useTransform(scrollYProgress, [0, 1], [0, 26]);

  const selected = artworks.find((a) => a.id === selectedId) || null;
  const leftArt = artworks.find((a) => a.frame_position === "left") ?? null;
  const rightArt = artworks.find((a) => a.frame_position === "right") ?? null;
  const centerArt = artworks.find((a) => a.frame_position === "center") ?? null;
  const framedArt = [leftArt, rightArt, centerArt];
  const framedUrls = framedArt.map((a) => a?.image_url ?? null);

  const onFrameSelect = (i: number) => {
    const art = framedArt[i];
    if (art) setSelectedId(art.id);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    dragState.current = { startX: e.clientX, startScroll: track.scrollLeft, moved: 0 };
    track.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track || e.buttons === 0) return;
    const d = dragState.current;
    const delta = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(delta));
    track.scrollLeft = d.startScroll - delta;
  };

  return (
    <main>
      {/* Hero + gallery pinned region: the photo sticks to the top of the
          viewport for the entire height of this wrapper, so it stays behind
          both the fading hero content AND the gallery cards that scroll over
          it afterwards. No hero background color, no overlay — this IS the
          page. */}
      <div ref={pinRef} className="relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Environment layer: photo + frames, rigid, no transform */}
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

          {/* Foreground actor layer: independent from the environment above,
              anchored to the measured floor line, with its own subtle drift */}
          <PeopleLayer
            src={heroPeople}
            imgW={DESKTOP_IMG.w}
            imgH={DESKTOP_IMG.h}
            visibilityClass="hidden md:block"
            slot={DESKTOP_PEOPLE}
            aspect={PEOPLE_IMG.w / PEOPLE_IMG.h}
            opacity={foregroundOpacity}
            parallaxY={peopleParallaxY}
          />
          <PeopleLayer
            src={heroPeople}
            imgW={MOBILE_IMG.w}
            imgH={MOBILE_IMG.h}
            visibilityClass="block md:hidden"
            slot={MOBILE_PEOPLE}
            aspect={PEOPLE_IMG.w / PEOPLE_IMG.h}
            opacity={foregroundOpacity}
            parallaxY={peopleParallaxY}
          />
        </div>

        {/* Hero foreground: title + scroll hint only now. The people cutout
            lives inside GalleryBackground so it can be pinned to the actual
            floor line and scale together with the room's zoom. */}
        <div className="absolute inset-x-0 top-0 h-screen flex flex-col items-center justify-between pointer-events-none z-10">
          <motion.h1
            style={{ opacity: foregroundOpacity }}
            className="font-display italic text-parchment text-3xl md:text-5xl tracking-wide mt-10 text-center px-6 drop-shadow-lg"
          >
            Ayodele<span className="text-brass not-italic">art</span>
          </motion.h1>

          <motion.p
            style={{ opacity: foregroundOpacity }}
            className="text-parchment/80 text-xs tracking-[0.3em] uppercase mb-8 font-body drop-shadow"
          >
            Scroll to step inside
          </motion.p>
        </div>

        {/* Gallery cards: starts exactly one viewport down, scrolls up over
            the still-pinned photo behind it. */}
        <section className="relative z-10 pt-[100vh] pb-32">
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
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
                {art.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" draggable={false} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                  {art.medium && (
                    <p className="text-brass text-[0.65rem] tracking-[0.25em] uppercase mb-1 font-body">
                      {art.medium}
                    </p>
                  )}
                  <h2 className="font-display text-parchment text-xl md:text-2xl">{art.title}</h2>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selected && <ArtworkOverlay artwork={selected} onClose={() => setSelectedId(null)} />}
      </AnimatePresence>
    </main>
  );
}

function ArtworkOverlay({ artwork, onClose }: { artwork: ArtworkWithImages; onClose: () => void }) {
  return (
    <>
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
            {artwork.medium && (
              <p className="text-brass text-xs tracking-[0.3em] uppercase mb-2 font-body">{artwork.medium}</p>
            )}
            <h1 className="font-display text-parchment text-3xl md:text-4xl mb-1">{artwork.title}</h1>
            <p className="text-parchment/60 text-sm mb-6 font-body">
              {[artwork.year, artwork.dimensions].filter(Boolean).join(" · ")}
            </p>

            {artwork.image_url && (
              <div className="relative w-full aspect-[4/5] md:aspect-[16/10] mb-8 rounded-sm overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover" />
              </div>
            )}

            {artwork.inspiration && (
              <div className="border-t border-brass/20 pt-6 mb-8">
                <p className="text-brass text-xs tracking-[0.3em] uppercase mb-3 font-body">Inspiration</p>
                <p className="text-parchment/80 leading-relaxed whitespace-pre-line font-body">
                  {artwork.inspiration}
                </p>
              </div>
            )}

            {artwork.story && (
              <div className="border-t border-brass/20 pt-6 mb-10">
                <p className="text-brass text-xs tracking-[0.3em] uppercase mb-3 font-body">Story</p>
                <p className="text-parchment/80 leading-relaxed whitespace-pre-line font-body">{artwork.story}</p>
              </div>
            )}

            {artwork.images.length > 0 && (
              <div className="space-y-5">
                {artwork.images.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={img.id} src={img.url} alt="" className="w-full rounded-sm object-cover" />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
