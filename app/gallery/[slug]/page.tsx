import { notFound } from "next/navigation";
import { getArtwork, getArtworkImages, getSiteAssets } from "@/lib/data";
import DetailView from "@/components/DetailView";

export const revalidate = 60;

export default async function ArtworkPage({ params }: { params: { slug: string } }) {
  const artwork = await getArtwork(params.slug);
  if (!artwork) notFound();

  const [images, assets] = await Promise.all([
    getArtworkImages(artwork.id),
    getSiteAssets(),
  ]);

  return (
    <DetailView
      artwork={artwork}
      images={images}
      heroDesktop={assets["art-hero-desktop"] ?? null}
      heroMobile={assets["art-hero-mobile"] ?? null}
    />
  );
}
