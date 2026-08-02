# Ayodeleart

Art portfolio. Hero → scroll → swipeable gallery → detail view, all sharing one
continuous background. Data lives in the shared "Commission works" Supabase
project, in `portfolio_projects` (filtered to `site = 'art'`) so it can
eventually merge with the developer portfolio's admin.

## Structure

- `app/page.tsx` + `components/Experience.tsx` — hero and scroll-linked gallery
- `app/gallery/[slug]/page.tsx` + `components/DetailView.tsx` — artwork detail
- `app/admin/upload/page.tsx` + `app/api/artworks/route.ts` — standalone upload
  page for this site (separate from the dev portfolio's admin for now, as
  planned — merge later)

## Setup

1. `cp .env.example .env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API
   - `SUPABASE_SERVICE_ROLE_KEY` — Project Settings → API (keep secret, server-only)
   - `ADMIN_UPLOAD_KEY` — any long random string, used to gate `/admin/upload`
2. `npm install`
3. `npm run dev`

## Still needed

- Upload the three hero assets (desktop background, mobile background,
  transparent people cutout) into the `octopusfur-media` bucket, folder
  `ayodeleart/`, and set their URLs in the `site_assets` table under slots
  `art-hero-desktop`, `art-hero-mobile`, `art-hero-people`.
- Deploy (Vercel is the easiest path for Next.js) and set the same env vars
  there.
