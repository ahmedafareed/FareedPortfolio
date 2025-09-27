# Ahmed Fareed Portfolio (Multi‑Site: Travel & Commercial)

This project is a Next.js 15 (App Router) + Supabase powered photography portfolio with an **admin panel** and **multi-site support** for two isolated content sets:

- `travel.YourDomain.com` (default / canonical)
- `commercial.YourDomain.com`

Each subdomain has its own images, categories, awards, exhibitions and settings, backed by **separate Postgres tables** (table duplication strategy) instead of row‑level tenancy.

## Stack

- Next.js 15 (App Router, TypeScript)
- Supabase (Postgres + Storage)
- Tailwind CSS
- Client-side image downscaling via `<canvas>` (no heavy server image libs)
- Middleware-based subdomain routing (`middleware.ts` sets `x-site-key` header)

## Multi-Site Strategy

We duplicate tables for the commercial site with a `commercial_` prefix:

| Travel (base)            | Commercial duplicate              |
|--------------------------|----------------------------------|
| `portfolio_images`       | `commercial_portfolio_images`    |
| `portfolio_categories`   | `commercial_portfolio_categories`|
| `awards`                 | `commercial_awards`              |
| `exhibitions`            | `commercial_exhibitions`         |
| `site_settings`          | `commercial_site_settings`       |

This keeps queries simple (no tenant conditions) and allows independent evolution of each site's content. The dynamic service layer (`supabase-service.ts`) chooses table names based on a `site` parameter (`'travel' | 'commercial'`).

## Subdomain Detection

`src/middleware.ts` inspects the `Host` header:

1. Extracts first label (subdomain) — if `commercial`, sets site = commercial, else defaults to travel.
2. Injects `x-site-key: travel|commercial` header on all downstream responses so **server components / API routes** can switch tables.
3. Redirects the bare apex domain (e.g. `example.com`) to `travel.example.com` (308) for canonical consistency.
4. Protects `/admin` + upload/hero API routes with a cookie session (`admin_session`) or HTTP Basic Auth fallback.

## Schema Duplication

Run the provided SQL once after you have your base tables:

`supabase/commercial_schema.sql`

It uses `CREATE TABLE IF NOT EXISTS commercial_* LIKE base INCLUDING ALL` then seeds an initial `site_settings` row. Apply via Supabase SQL editor or CLI.

## Environment Variables

Required:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # used only in secure server routes
ADMIN_PASSWORD=<strong-password>
```

## Admin Panel

Paths:

- Travel content: `/admin/...`
- Commercial content: `/admin/commercial/...`

Implemented sections for each site:

- Portfolio (URL add + multi-image upload with client downscaling)
- Categories
- Awards
- Exhibitions
- Settings (tagline, bio, socials, hero image reference, etc.)

### Authentication

Visit `/login` and submit password (username fixed as `admin` if used in Basic Auth). A cookie `admin_session=true` is set for subsequent requests.

## Public Pages & Site Awareness

Public server components (e.g. `about`, `contact`) read `x-site-key` via `headers()`; client components (e.g. homepage rotating grid, gallery) infer the site from `window.location.hostname`.

If you later add more subdomains, extend the prefix logic and provide matching table sets.

## Image Handling

- Upload API (`/api/admin-upload`) accepts multipart files, writes to `portfolio-images` storage bucket.
- Client downsizes images >500KB using canvas before upload (quality/scale adjustments in `commercial/portfolio` page code can be reused in travel page if desired).
- DB stores the public URL; hero & featured flags managed via `/api/admin-hero` (now site-aware with a `site` prop in body).

## Adding New Site-Specific Data

1. Create duplicated table with `commercial_` prefix matching columns.
2. Extend `table(site, base)` helper or reuse existing in `supabase-service.ts`.
3. Pass `site` param to new service method calls.
4. Update admin + public components (pattern already present).

## DNS & Deployment Checklist

1. Create `A` / `AAAA` (or CNAME if using a platform) records for: `travel`, `commercial` pointing to hosting provider.
2. Ensure apex domain either redirected at DNS/CDN layer or rely on middleware 308 redirect.
3. Deploy Next.js app (Vercel / Firebase Hosting / custom). Confirm both subdomains resolve to same deployment.
4. Run `commercial_schema.sql` against Prod database.
5. Log into each admin section and seed initial content.

## Local Development

You can simulate subdomains by editing `/etc/hosts`:

```
127.0.0.1 travel.local.test
127.0.0.1 commercial.local.test
```

Then run `pnpm dev` (or `npm run dev`) and visit `http://travel.local.test:3000` / `http://commercial.local.test:3000` (may require a proxy if platform restricts custom host headers; otherwise rely on query param approach or manual site override during dev).

## Future Improvements

- Add caching layer (e.g. simple in-memory or Next.js route segment cache) for frequently read public queries.
- Introduce soft deletes or archival for images.
- Add sorting UI + drag handle for portfolio ordering.
- RLS + single-table multi-tenancy (if number of sites grows beyond a few and schema drift must be avoided).
- Automated migration script (SQL generation) for spinning up new site prefixes.
- Enhance import tool: currently an append-only copy of travel awards/exhibitions into commercial. Consider UI diffing & selective sync.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Commercial admin writes to travel tables | Missing `site` field in API body/form | Ensure `site` appended (already implemented in commercial pages) |
| Wrong site content on public pages | Hostname detection failed locally | Use headers-based server components or set correct dev host mapping |
| Hero image not updating | Using old table name | Confirm `/api/admin-hero` payload includes `site` |

## Quick Start

1. Clone repo & install deps: `pnpm install`
2. Add `.env.local` with required Supabase + admin vars.
3. Run dev server: `pnpm dev`
4. Create base tables (if not already) & run `commercial_schema.sql` in Supabase.
5. Visit `http://localhost:3000/login` to set admin session.
6. Populate travel content, then navigate to `/admin/commercial` to populate commercial content.

---

Feel free to extend. The service abstraction handles most differences—just pass `site`.

For any questions or enhancements, open an issue or continue iterating in the codebase.
