import { getArtworks, getSiteAssets } from "@/lib/data";
import Experience from "@/components/Experience";

export const revalidate = 60;

export default async function HomePage() {
  const [artworks, assets] = await Promise.all([getArtworks(), getSiteAssets()]);

  return (
    <Experience
      artworks={artworks}
      heroDesktop={assets["art-hero-desktop"] ?? null}
      heroMobile={assets["art-hero-mobile"] ?? null}
      heroPeople={assets["art-hero-people"] ?? null}
    />
  );
}
