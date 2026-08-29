# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 3 — Cart Drawer & Checkout  
**Last completed:** 09 Checkout Flow & Order Placement  
**Next:** 10 Customer Account & Order History — Full UI & Logic  

---

## Progress

### Phase 1 — Foundation & Authentication

- [x] Design System & Theme Alignment (`ui-tokens.md`, `ui-rules.md`, `ui-registry.md`, `globals.css`, `layout.tsx`)
- [x] 01 Storefront Layout & Homepage — Full UI
- [x] 02 Authentication & RBAC
- [x] 03 PostHog Initialization
- [x] 04 Database Schema & Seeds


### Phase 2 — Catalog, Discovery & PDP

- [x] 05 Category & Product Listing Page (PLP) — Full UI
- [x] 06 Dynamic Filtering & Search Logic
- [x] 07 Product Detail Page (PDP) — Full UI & Logic

### Phase 3 — Cart Drawer & Checkout

- [x] 08 Cart Drawer & Page — Full UI & Local State
- [x] 09 Checkout Flow & Order Placement

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
- Conditional Age Filtering: "Filter by Age" is displayed strictly for baby, kids, educational toys, and baby gift combo categories; hidden for non-age categories (gadgets, decor).
- Live predictive search Route Handler (`app/api/search/route.ts`) provides debounced instant autocomplete previews with thumbnail images, category pills, and `৳` pricing.
- Bidirectional URL query parameter synchronization keeps PLP filter and search state shareable and bookmarkable without full page reloads.
- Product Detail Page (PDP) implemented with 60/40 showcase layout, hover magnifying lens zoom preview, multi-variant selectors, 1-click WhatsApp order link generation with structured message, curator notes ("Why We Love It"), 5-tab technical and customer review panel, frequently bought together bundle recommendation, and sticky bottom buy bar.

---

## Notes

- Design tokens, rules, registry, and Tailwind v4 theme fully aligned with `Mirai-mart_design-system.png` and `My-account_page.png`.
- Authentication strictly integrated with InsForge SDK (`@insforge/sdk`) for customer sign-up, sign-in, and session management.
- My Account page (`/account`) fully aligned with `My-account_page.png` layout and guarded with Next.js 16 `proxy.ts`.
- InsForge CLI linked to project `Mirai_mart` (`ctxg94dh.ap-southeast`).
- Database schema migration executed: all 8 tables (`profiles`, `categories`, `products`, `product_variants`, `orders`, `order_items`, `reviews`, `promotions`) created in live PostgreSQL.
- Database seed script executed: 10 categories/subcategories, 6 products, 8 variants, 3 promotions, and 3 customer reviews seeded.
- InsForge Storage public bucket `products` created for media assets.
- Feature 06 (Dynamic Filtering & Search Logic) complete.
- Feature 07 (Product Detail Page Full UI & Logic with WhatsApp Order) complete and tested in browser.
- Feature 08 (Cart Drawer Slide-Over with Framer Motion, interactive item checkboxes, free shipping milestone progress bar, 1-click promo code application, celebratory banner, and checkout CTAs) complete and verified with 0 build errors.
- Feature 09 (Checkout Flow & Order Placement) complete and verified with 0 build errors. The `/checkout` route collects delivery details and a payment method, then places the order for the selected cart items through WhatsApp. `CartProvider` now exposes `selectedItems` on the context. Both the cart page and the checkout page build the WhatsApp order link with one shared helper, `generateWhatsAppCartOrderLink` in `lib/constants.ts`.
- Next step is Phase 4: Feature 10 — Customer Account & Order History.



