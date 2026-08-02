"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Artwork, ArtworkImage } from "@/lib/supabase";

type Props = {
  artwork: Artwork;
  images: ArtworkImage[];
  heroDesktop: string | null;
  heroMobile: string | null;
};

export default function DetailView({ artwork, images, heroDesktop, heroMobile }: Props) {
  const router = useRouter();

  // Back / [X] both return to the gallery scroll (browser history preserves
  // scroll position since this is a real route, not a client-side overlay).
  const close = () => router.back();

  return (
    <main className="relative min-h-screen bg-ink">
      <div className="fixed inset-0 -z-10">
        {heroDesktop && (
          <Image src={heroDesktop} alt="" fill className="hidden md:block object-cover blur-sm scale-105" />
        )}
        {(heroMobile ?? heroDesktop) && (
          <Image
            src={heroMobile ?? heroDesktop!}
            alt=""
            fill
            className="block md:hidden object-cover blur-sm scale-105"
          />
        )}
        <div className="absolute inset-0 bg-ink/70" />
      </div>

      <button
        onClick={close}
        aria-label="Close"
        className="fixed top-6 right-6 z-20 w-10 h-10 rounded-full border border-brass/40 text-parchment flex items-center justify-center hover:bg-brass/20 transition-colors"
      >
        ✕
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-6 pt-24 pb-32"
      >
        {artwork.category && (
          <p className="text-brass text-xs tracking-[0.3em] uppercase mb-3 font-body">
            {artwork.category}
          </p>
        )}
        <h1 className="font-display text-parchment text-4xl md:text-5xl mb-8">{artwork.title}</h1>

        {artwork.screenshot_url && (
          <div className="relative w-full aspect-[4/5] md:aspect-[16/10] mb-10 rounded-sm overflow-hidden">
            <Image src={artwork.screenshot_url} alt={artwork.title} fill className="object-cover" />
          </div>
        )}

        {artwork.description && (
          <p className="text-parchment/90 text-lg leading-relaxed mb-10 font-body">
            {artwork.description}
          </p>
        )}

        {artwork.story && (
          <div className="border-t border-brass/20 pt-8 mb-12">
            <p className="text-brass text-xs tracking-[0.3em] uppercase mb-4 font-body">
              Inspiration
            </p>
            <p className="text-parchment/80 leading-relaxed whitespace-pre-line font-body">
              {artwork.story}
            </p>
          </div>
        )}

        {images.length > 0 && (
          <div className="space-y-6">
            {images.map((img) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full aspect-[4/3] rounded-sm overflow-hidden"
              >
                <Image src={img.url} alt="" fill className="object-cover" />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
