import { createClient } from "@supabase/supabase-js";

// Server-only. Never import this from a client component —
// it holds the service role key and bypasses RLS.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export const ART_BUCKET = "octopusfur-media";
export const ART_FOLDER = "ayodeleart";
