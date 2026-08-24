# Memory — Database Schema, Type System & Foundation Alignment

Last updated: 2026-08-24 21:11:45 +06:00

## What was built

- Resolved TypeScript re-export ambiguity in `types/index.ts` by updating `lib/db/types.ts` to import `UserRole` directly from `@/types/auth` rather than redefining an overlapping export.
- Completed Phase 1 foundations: Design system tokens (`ui-tokens.md`, `globals.css`), Storefront layout & homepage (`/`), Authentication & RBAC (`/login`, `/register`, `/account`), PostHog server/client integration, and Database Schema & Seeds (`supabase/schema.sql`, `supabase/seed.sql`, `lib/db/types.ts`).
- Updated `context/progress-tracker.md` to reflect completion of Phase 1 (Features 01 to 04).

## Decisions made

- `types/auth.ts` is the single source of truth for auth-related types (`UserRole`, `UserProfile`, `AuthUser`, `SessionState`). Database entity definitions in `lib/db/types.ts` import from `@/types/auth` to prevent type collisions in barrel re-exports (`types/index.ts`).
- All currency formatting throughout storefront, cart, and orders strictly uses Bangladeshi Taka (`৳`).
- Server Components remain the default for all page entrypoints (`app/**/page.tsx`) and layouts, isolating interactive elements into leaf Client Components in `components/`.

## Problems solved

- Fixed TypeScript compiler error `Module "./auth" has already exported a member named 'UserRole'. Consider explicitly re-exporting to resolve the ambiguity.` in `types/index.ts` by removing duplicate `export type UserRole` in `lib/db/types.ts` and importing `UserRole` from `@/types/auth`.

## Current state

- Phase 1 (Features 01-04) is 100% complete.
- Local dev server runs cleanly with zero TypeScript / ESLint export conflicts.
- Next target is Phase 2: Feature 05 (Category & Product Listing Page / PLP).

## Next session starts with

- Phase 2 / Feature 05: Category & Product Listing Page (PLP) — Full UI.
- Build category grid/list view, breadcrumbs, product sorting bar, responsive filter drawer/sidebar, and pagination/infinite load matching Figma design specifications.

## Open questions

- None.
