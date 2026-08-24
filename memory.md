# Memory — Live Backend Setup & Category PLP Full UI

Last updated: 2026-08-24 22:16:00 +06:00

## What was built

- Authenticated and linked InsForge CLI to project `Mirai_mart` (`ctxg94dh.ap-southeast`).
- Executed database migrations on live InsForge PostgreSQL: created all 8 tables (`profiles`, `categories`, `products`, `product_variants`, `orders`, `order_items`, `reviews`, `promotions`), seeded 10 categories/subcategories, 6 products, 8 variants, 3 promotions, 3 reviews, and created public storage bucket `products`.
- Secured `scripts/seed-db.mjs` to read `DATABASE_URL` dynamically from `.env.local` without hardcoded credentials.
- Completed **Phase 2 — Feature 05: Category & Product Listing Page (PLP) — Full UI**:
  - `app/(commonRoutes)/(storefront)/category/[slug]/page.tsx` — Server Component with dynamic SEO metadata generation supporting all parent and subcategory slugs.
  - `components/storefront/CategoryHeader.tsx` — Category header banner with breadcrumb navigation, Baloo 2 headline, description, and horizontal subcategory pill chip navigation.
  - `components/storefront/FilterSidebar.tsx` — Faceted filter sidebar with 5 age range chips (`0–1`, `1–3`, `3–5`, `5–8`, `8+`), dual price range slider in `৳`, theme tag checkboxes, in-stock toggle, and responsive mobile slide-over drawer.
  - `components/storefront/ProductToolbar.tsx` — Results counter, dismissable active filter tags with `✕` triggers, sort dropdown selector, and Grid/List view mode switcher.
  - `components/storefront/ProductListRow.tsx` — Horizontal card layout for list-mode browsing with thumbnail, ratings, price in `৳`, and cart button.
  - `components/storefront/PLPClient.tsx` — Leaf client orchestrator managing active filters, sorting pipeline, view mode, empty state, and 12-item pagination.
  - `lib/mock-data.ts` — Expanded with rich category metadata and 18 products across all categories and age brackets.
- Updated `context/ui-registry.md` via `/imprint` and checked off Feature 05 in `context/progress-tracker.md`.

## Decisions made

- `app/(commonRoutes)/(storefront)/category/[slug]/page.tsx` remains strictly a Server Component per Next.js 16 conventions, isolating client reactivity into leaf component `PLPClient.tsx`.
- All PLP pricing, sliders, and promotional limits strictly adhere to Bangladeshi Taka (`৳`).
- List view is supported alongside Grid view with responsive layout toggling.

## Problems solved

- Fixed PostgreSQL UUID hex formatting in `supabase/seed.sql` by replacing non-hex prefixes with valid hex digits (`a111...`, `b111...`, `d011...`, `e111...`).
- Fixed subcategory insert column ordering in `supabase/seed.sql` to match insert value positions.
- Provisioned live InsForge PostgreSQL database and verified table record counts.

## Current state

- Phase 1 (Features 01–04) and Phase 2 Feature 05 (PLP Full UI) are 100% complete and tested.
- Dev server is running with 0 TypeScript compiler / linting errors (`npx tsc --noEmit` exits with code 0).
- Next target is Phase 2 — Feature 06: Dynamic Filtering & Search Logic.

## Next session starts with

- **Phase 2 — Feature 06: Dynamic Filtering & Search Logic**
- Create Server Action in `actions/products.ts` to query `products` and `product_variants` tables with dynamic filtering clauses (category slug, age range overlap, price min/max, sort orders).
- Implement predictive search route handler in `app/api/search/route.ts` with debounce handling and thumbnail previews.
- Sync client-side URL query parameters (`?category=gift-combos&age=1-3&sort=price_asc`) with active filters.

## Open questions

- None.
