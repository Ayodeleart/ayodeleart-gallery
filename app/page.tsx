import { getArtworks } from "@/lib/data";
import Experience from "@/components/Experience";

export const revalidate = 60;

// Hero backgrounds + people cutout are bundled repo assets (public/hero/),
// not DB-driven — they're static, rarely change, and load fastest served
// from the same edge as the rest of the site. Artwork images stay in
// Supabase storage since those change often via admin.
export default async function HomePage() {
  const artworks = await getArtworks();

  return (
    <Experience
      artworks={artworks}
      heroDesktop="/hero/hero-desktop.webp"
      heroMobile="/hero/hero-mobile.webp"
      heroPeople="/hero/hero-people.webp"
    />
  );
}
