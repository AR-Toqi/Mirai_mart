# Memory — Storefront Layout, Hero Banner Polish & InsForge BaaS Storage Fix

Last updated: September 5, 2026 00:13:00 +06:00

## What was built

- **InsForge Storage Upload Type Fix (`actions/admin.ts`)**:
  - Resolved TypeScript error `Property 'path' does not exist on type '{ url: string; key: string; size: number; uploadedAt: string; bucket: string; mimeType?: string; }'`.
  - Handled native InsForge `@insforge/sdk` return structure (`uploadData.url` directly, fallback via `insforge.storage.from("products").getPublicUrl(uploadData.key)`).
  - Synchronized documentation in `context/library-docs.md`.
- **Hero Banner Polish (`components/storefront/HeroBanner.tsx`)**:
  - Removed hover chevron arrow navigation buttons (`opacity-0 group-hover:opacity-100`) and removed unused `ChevronLeftIcon`, `ChevronRightIcon`, and `prevSlide` callback.
  - Reduced desktop banner height from `~590px–600px` down to `420px` (`h-[280px] sm:h-[360px] lg:h-[420px]`).
  - Updated Next.js image `sizes` attribute from `1280px` to `1440px`.
  - Standardized component pattern documented in `context/ui-registry.md`.
- **Storefront Desktop Container Expansion (`app/globals.css`)**:
  - Defined `--container-7xl: 1440px;` in the Tailwind v4 `@theme` block.
  - Added `.max-w-7xl { max-width: 1440px; }` ensuring Header, CategoryNavBar, AnnouncementBar, Storefront Homepage, and Footer span `1440px` on desktop.
  - Admin layout remains strictly isolated at `max-w-[1600px]` in `app/(protectedRoutes)/admin/layout.tsx`.
  - Documented in `context/ui-tokens.md`, `context/ui-rules.md`, and `context/progress-tracker.md`.

## Decisions made

- **1440px Storefront Canvas**: Standardized all storefront containers to `1440px` (`--container-7xl: 1440px` / `.max-w-7xl`), while preserving `max-w-[1600px]` for the Admin Panel.
- **Controlled Hero Banner Height**: Standardized hero banner to `h-[280px] sm:h-[360px] lg:h-[420px]` instead of loose aspect ratios so that the trust value strip and featured products remain visible above the fold on desktop viewports.
- **Clean Banner Navigation**: Auto-play runs every 3 seconds (pauses on mouse enter) and manual navigation uses the 3 bottom pill dots; no hover arrows appear on the banner.
- **InsForge Storage SDK Pattern**: Always use `data.url` and `data.key` on storage upload responses; `data.path` is a legacy Supabase convention not supported by InsForge.

## Problems solved

- Corrected TypeScript compilation failure on `uploadData?.path` in server action `uploadBannerImageAction`.
- Fixed oversized hero banner height taking over the entire initial viewport on 1440px displays.

## Current state

- Storefront homepage, Hero Banner, 1440px container, and Website Content CMS fully functional and verified.
- Dev server running cleanly with no build or lint errors.
- Phase 5 — Feature 12 (Admin Layout & Dashboard) is complete.

## Next session starts with

- **Phase 5 — Feature 13 (Admin Product & Inventory CMS)**:
  - Implement full product catalog table in `/admin/products` with category & stock level filters.
  - Build Add/Edit Product form with dynamic category attributes and variant matrix.
  - Wire media upload dropzone to InsForge Storage (`products/` bucket) using the verified `data.url` / `data.key` pattern.

## Open questions

- None.
