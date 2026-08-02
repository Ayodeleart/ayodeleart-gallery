import { getSupabase, Artwork, ArtworkImage } from "./supabase";

export type ArtworkWithImages = Artwork & { images: ArtworkImage[] };

// Everything here is scoped to site = 'art' so it shares the
// portfolio_projects table with the developer portfolio without collision.
export async function getArtworks(): Promise<ArtworkWithImages[]> {
  const { data, error } = await getSupabase()
    .from("portfolio_projects")
    .select(
      "id, title, description, story, category, year, dimensions, screenshot_url, sort_order, created_at, portfolio_project_images(id, project_id, url, sort_order)"
    )
    .eq("site", "art")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    ...row,
    images: (row.portfolio_project_images ?? []).sort(
      (a: ArtworkImage, b: ArtworkImage) => a.sort_order - b.sort_order
    ),
  }));
}
