import { notFound } from "next/navigation";
import { getArtwork, getArtworkImages } from "@/lib/data";
import DetailView from "@/components/DetailView";

export const revalidate = 60;

export default async function ArtworkPage({ params }: { params: { slug: string } }) {
  const artwork = await getArtwork(params.slug);
  if (!artwork) notFound();

  const images = await getArtworkImages(artwork.id);

  return (
    <DetailView
      artwork={artwork}
      images={images}
      heroDesktop="/hero/hero-desktop.webp"
      heroMobile="/hero/hero-mobile.webp"
    />
  );
}
