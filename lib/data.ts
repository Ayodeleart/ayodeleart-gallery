import { supabase, Artwork, ArtworkImage, SiteAsset } from "./supabase";

// Every query is scoped to site = 'art' so this shares the
// portfolio_projects table with the developer portfolio without collision.

export async function getArtworks(): Promise<Artwork[]> {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("id, title, description, story, category, screenshot_url, sort_order, created_at")
    .eq("site", "art")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getArtwork(id: string): Promise<Artwork | null> {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("id, title, description, story, category, screenshot_url, sort_order, created_at")
    .eq("site", "art")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function getArtworkImages(id: string): Promise<ArtworkImage[]> {
  const { data, error } = await supabase
    .from("portfolio_project_images")
    .select("id, project_id, url, sort_order")
    .eq("project_id", id)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getSiteAssets(): Promise<Record<string, string | null>> {
  const { data, error } = await supabase
    .from("site_assets")
    .select("slot, image_url")
    .in("slot", ["art-hero-desktop", "art-hero-mobile", "art-hero-people"]);

  if (error) throw error;
  const map: Record<string, string | null> = {};
  (data ?? []).forEach((row: SiteAsset) => {
    map[row.slot] = row.image_url;
  });
  return map;
}
