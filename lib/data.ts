import { getSupabase, Artwork, ArtworkImage } from "./supabase";

export type ArtworkWithImages = Artwork & { images: ArtworkImage[] };

export async function getArtworks(): Promise<ArtworkWithImages[]> {
  const { data, error } = await getSupabase()
    .from("artworks")
    .select(
      "id, title, image_url, story, inspiration, medium, year, dimensions, featured, frame_position, sort_order, created_at, artwork_images(id, artwork_id, url, sort_order)"
    )
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    ...row,
    images: (row.artwork_images ?? []).sort(
      (a: ArtworkImage, b: ArtworkImage) => a.sort_order - b.sort_order
    ),
  }));
}
