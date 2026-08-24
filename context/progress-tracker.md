# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 2 — Catalog, Discovery & PDP  
**Last completed:** 04 Database Schema & Seeds  
**Next:** 05 Category & Product Listing Page (PLP) — Full UI  

---

## Progress

### Phase 1 — Foundation & Authentication

- [x] Design System & Theme Alignment (`ui-tokens.md`, `ui-rules.md`, `ui-registry.md`, `globals.css`, `layout.tsx`)
- [x] 01 Storefront Layout & Homepage — Full UI
- [x] 02 Authentication & RBAC
- [x] 03 PostHog Initialization
- [x] 04 Database Schema & Seeds


### Phase 2 — Catalog, Discovery & PDP

- [ ] 05 Category & Product Listing Page (PLP) — Full UI
- [ ] 06 Dynamic Filtering & Search Logic
- [ ] 07 Product Detail Page (PDP) — Full UI & Logic

### Phase 3 — Cart Drawer & Checkout

- [ ] 08 Cart Drawer & Page — Full UI & Local State
- [ ] 09 Checkout Flow & Order Placement

### Phase 4 — Customer Portal & Features

- [ ] 10 Customer Account & Order History — Full UI & Logic
- [ ] 11 Product Comparison Page (`/compare`)

### Phase 5 — Admin Management Panel

- [ ] 12 Admin Layout & Dashboard — Full UI & Real Metrics
- [ ] 13 Admin Product & Inventory CMS
- [ ] 14 Admin Order Fulfillment & RMA Management
- [ ] 15 Admin Marketing & Storefront CMS

---

## Decisions Made During Build

- Design system specifications extracted directly from `context/design/Mirai-mart_design-system.png`:
  - Primary: `#0A98C3` (Main), `#71D7F6` (Light), `#BEE9FF` (Surface)
  - Secondary: `#FCE35F` (Main), `#FFE680` (Light), `#FFF3B3` (Surface)
  - Tertiary: `#007EA3` (Main), `#4CB3C9` (Light), `#B3EBFF` (Surface)
  - Neutrals: `#191C1E` (Dark), `#6E797F` (Muted), `#E7E8EB` (Border), `#F8F9FC` (Background)
  - Semantic: `#22C55E` (Success), `#EF4444` (Error), `#F59E0B` (Warning)
  - Currency: Bangladeshi Taka (`৳`), Free Shipping Threshold: `৳ 999`
  - Typography: Baloo 2 (`--font-heading`) for Headings, DM Sans (`--font-sans`) for Body & UI
- Full page UI is built with mock data first — verified visually and interactively before wiring backend logic.
- All page entrypoints (`app/**/page.tsx`) and layouts (`layout.tsx`) are strictly Server Components; interactive features are isolated into leaf Client Components in `components/`.
- Next.js 16 App Router routing hierarchy reorganized into `(commonRoutes)` (public pages, storefront, auth) and `(protectedRoutes)` (customer dashboard, admin portal).
- InsForge is used for PostgreSQL database, session authentication, RBAC, and object storage (`products/` bucket).
- Analytics tracking is powered by PostHog with both browser client (`lib/posthog-client.ts`) and server client (`lib/posthog-server.ts`).

---

## Notes

- Design tokens, rules, registry, and Tailwind v4 theme fully aligned with `Mirai-mart_design-system.png` and `My-account_page.png`.
- Authentication strictly integrated with InsForge SDK (`@insforge/sdk`) for customer sign-up, sign-in, and session management.
- My Account page (`/account`) fully aligned with `My-account_page.png` layout and guarded with Next.js 16 `proxy.ts`.
- Next step is Feature 03: PostHog Initialization.

