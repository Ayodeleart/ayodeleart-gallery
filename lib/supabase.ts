import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Hardcoded on purpose, matching the same pattern used in the developer
// portfolio's repo: this is the public project URL and the anon key, not a
// secret (it's exactly what RLS exists to protect against). Baking it in
// removes an entire class of "env var wasn't set on the host" build
// failures, like the one that broke the first deploy.
const SUPABASE_URL = "https://lvjatrpupssmpftutkzt.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2amF0cnB1cHNzbXBmdHV0a3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjQ0MTYsImV4cCI6MjA5Njc0MDQxNn0.K_GyXeT1R54M7FFCQgIUx1dPaG2g8vtIzJy0pNeI3kM";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}

export type Artwork = {
  id: string;
  title: string;
  description: string;
  story: string | null;
  category: string | null;
  year: number | null;
  dimensions: string | null;
  screenshot_url: string | null;
  sort_order: number;
  created_at: string;
};

export type ArtworkImage = {
  id: string;
  project_id: string;
  url: string;
  sort_order: number;
};

export type SiteAsset = {
  slot: string;
  image_url: string | null;
};
