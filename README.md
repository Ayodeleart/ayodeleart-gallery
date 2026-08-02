# Ayodeleart

Art portfolio. Hero → scroll → swipeable gallery → detail view, all sharing one
continuous background. Data lives in the shared "Commission works" Supabase
project, in `portfolio_projects` (filtered to `site = 'art'`).

**Admin lives elsewhere on purpose**: content is managed from
`/admin/ayodeleart` in the [Portfolio](https://github.com/Ayodeleart/Portfolio)
repo (same login as the developer portfolio's admin), not from this repo.
This repo is read-only — it just displays whatever's in the database.

## Structure

- `app/page.tsx` + `components/Experience.tsx` — hero and scroll-linked gallery
- `app/gallery/[slug]/page.tsx` + `components/DetailView.tsx` — artwork detail
- `public/hero/` — the hero background (desktop/mobile) and people cutout.
  These are bundled repo assets, not database-driven, since they're static
  and load fastest served from the same edge as the rest of the site.
- `lib/supabase.ts` — public anon-key client only. No service role key or
  write access lives in this repo at all.

## Setup

```
npm install
npm run dev
```

No environment variables required — the Supabase URL and anon key are
hardcoded (same pattern as the Portfolio repo), since they're public by
design; RLS is what actually protects the data.

## Deploying

Any Next.js host (Vercel is the natural fit) — no env var setup needed for
this repo specifically.
