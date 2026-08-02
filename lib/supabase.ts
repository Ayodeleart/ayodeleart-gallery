import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Artwork = {
  id: string;
  title: string;
  description: string;
  story: string | null;
  category: string | null;
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
