import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Hardcoded on purpose (public URL + anon key, not a secret — that's what
// RLS protects). Avoids any "env var wasn't set on the host" build failure.
const SUPABASE_URL = "https://lvjatrpupssmpftutkzt.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2amF0cnB1cHNzbXBmdHV0a3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjQ0MTYsImV4cCI6MjA5Njc0MDQxNn0.K_GyXeT1R54M7FFCQgIUx1dPaG2g8vtIzJy0pNeI3kM";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}

export type FramePosition = "left" | "center" | "right";

export type Artwork = {
  id: string;
  title: string;
  image_url: string | null;
  story: string | null;
  inspiration: string | null;
  medium: string | null;
  year: number | null;
  dimensions: string | null;
  featured: boolean;
  frame_position: FramePosition | null;
  sort_order: number;
  created_at: string;
};

export type ArtworkImage = {
  id: string;
  artwork_id: string;
  url: string;
  sort_order: number;
};
