"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Artwork } from "@/lib/supabase";

type Props = {
  artworks: Artwork[];
  heroDesktop: string | null;
  heroMobile: string | null;
  heroPeople: string | null;
};

export default function Experience({ artworks, heroDesktop, heroMobile, heroPeople }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Progress through the pinned hero zone (0 = top of page, 1 = gallery fully in)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  const peopleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const peopleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroTitleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const bgBrightness = useTransform(scrollYProgress, [0, 1], [1, 0.55]);

  return (
    <main className="bg-ink">
      {/* Pinned background — shared by hero and gallery, only ever moves via scale/brightness */}
      <motion.div
        className="fixed inset-0 -z-10"
        style={{ scale: bgScale, filter: useTransform(bgBrightness, (b) => `brightness(${b})`) }}
      >
        {heroDesktop && (
          <Image
            src={heroDesktop}
            alt=""
            fill
            priority
            className="hidden md:block object-cover"
          />
        )}
        {(heroMobile ?? heroDesktop) && (
          <Image
            src={heroMobile ?? heroDesktop!}
            alt=""
            fill
            priority
            className="block md:hidden object-cover"
          />
        )}
        {!heroDesktop && !heroMobile && <div className="w-full h-full bg-wall" />}
        <div className="absolute inset-0 bg-ink/20" />
      </motion.div>

      {/* Scroll runway for the pin effect: 200vh tall, hero content sticks inside it */}
      <div ref={scrollRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-end overflow-hidden">
          <motion.h1
            style={{ opacity: heroTitleOpacity }}
            className="font-display italic text-parchment text-4xl md:text-6xl tracking-wide mb-10 md:mb-14 text-center px-6"
          >
            Ayodele<span className="text-brass not-italic">art</span>
          </motion.h1>

          {heroPeople && (
            <motion.div
              style={{ opacity: peopleOpacity, y: peopleY }}
              className="relative w-full max-w-3xl aspect-[3/2] mb-0"
            >
              <Image src={heroPeople} alt="" fill className="object-contain object-bottom" />
            </motion.div>
          )}

          <motion.p
            style={{ opacity: heroTitleOpacity }}
            className="text-parchment/70 text-sm tracking-[0.3em] uppercase mb-8 font-body"
          >
            Scroll to step inside
          </motion.p>
        </div>
      </div>

      {/* Gallery — same background continues behind these cards */}
      <section className="relative pb-32 pt-4">
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <p className="text-brass text-xs tracking-[0.3em] uppercase font-body">The collection</p>
        </div>

        <div className="flex gap-5 md:gap-8 overflow-x-auto snap-x snap-mandatory px-6 md:px-[max(1.5rem,calc(50%-36rem))] pb-6 scrollbar-none">
          {artworks.length === 0 && (
            <p className="text-parchment/60 font-body py-24">
              No pieces yet — add one from the admin.
            </p>
          )}
          {artworks.map((art) => (
            <Link
              key={art.id}
              href={`/gallery/${art.id}`}
              className="group relative shrink-0 snap-center w-[72vw] md:w-[22rem] aspect-[3/4] md:aspect-[4/5] rounded-sm overflow-hidden border border-brass/20"
            >
              {art.screenshot_url ? (
                <Image
                  src={art.screenshot_url}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-wall" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                {art.category && (
                  <p className="text-brass text-[0.65rem] tracking-[0.25em] uppercase mb-1 font-body">
                    {art.category}
                  </p>
                )}
                <h2 className="font-display text-parchment text-xl md:text-2xl">{art.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
