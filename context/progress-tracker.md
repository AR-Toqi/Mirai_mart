# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 4 — Customer Portal & Features (Complete) / Phase 5 — Admin Management Panel  
**Last completed:** 10 Customer Order History & Tracking Modal, 11 Product Comparison Page (`/compare`)  
**Next:** Phase 5 — Feature 12 (Admin Layout & Dashboard — Full UI & Real Metrics)  

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

- [x] 10 Order Success, Live Order Tracking (`/track-order`) & Customer Order History
- [x] 11 Product Comparison Page (`/compare`)

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
  - Currency: Bangladeshi Taka (`৳`), Free Shipping Threshold: `৳ 3,000`
  - Delivery Zones: Inside Dhaka (`৳ 80`), Outside Dhaka (`৳ 120`)
- Full page UI is built with mock data first — verified visually and interactively before wiring backend logic.
- All page entrypoints (`app/**/page.tsx`) and layouts (`layout.tsx`) are strictly Server Components; interactive features are isolated into leaf Client Components in `components/`.
- Next.js 16 App Router routing hierarchy reorganized into `(commonRoutes)` (public pages, storefront, auth) and `(protectedRoutes)` (customer dashboard, admin portal).
- InsForge is used for PostgreSQL database, session authentication, RBAC, and object storage (`products/` bucket).
- Analytics tracking is powered by PostHog with both browser client (`lib/posthog-client.ts`) and server client (`lib/posthog-server.ts`).
- Conditional Age Filtering: "Filter by Age" is displayed strictly for baby, kids, educational toys, and baby gift combo categories; hidden for non-age categories (gadgets, decor).
- Live predictive search Route Handler (`app/api/search/route.ts`) provides debounced instant autocomplete previews with thumbnail images, category pills, and `৳` pricing.
- Bidirectional URL query parameter synchronization keeps PLP filter and search state shareable and bookmarkable without full page reloads.
- Product Detail Page (PDP) implemented with 60/40 showcase layout, hover magnifying lens zoom preview, multi-variant selectors, 1-click WhatsApp order link generation with structured message, curator notes ("Why We Love It"), 5-tab technical and customer review panel, frequently bought together bundle recommendation, and sticky bottom buy bar.
- Checkout flow re-architected into a responsive 2-column layout (Left: Billing Details & Trust Badges; Right: Order Details Table, MFS Payment Verification & Place Order CTA).
- Simplified delivery zone model (Inside Dhaka ৳80 vs Outside Dhaka ৳120) with free shipping auto-applied on orders >= ৳3,000.
- Embedded 100% authentic bKash & Nagad vector SVG brand logos with 1-click account copy.

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
- Feature 07 (Product Detail Page Full UI & Logic with WhatsApp Order) refined.
- Feature 08 (Cart Drawer Slide-Over with Framer Motion) complete.
- Feature 09 (Checkout Flow & Order Placement) complete and verified with 0 build errors.
- Customer Account Portal (`/account`) updated with bidirectional URL query parameter synchronization (`?tab=orders`, `?tab=wishlist`, etc.), `<Suspense>` boundary wrapping, and browser history (Back/Forward) navigation.
- Aligned `PaymentStatus | "partial"` across `OrderTrackingTimeline` and `OrderDetailModal` for full compatibility with Cash on Delivery advance deposit accounting.
- Next step is Phase 4: Feature 10 — Order Success, Live Order Tracking & Public Track Order Page (`/track-order`).
- Implemented 4-Tier Caching Architecture:
  1. Next.js 16 ISR (`revalidate = 3600`) and `generateStaticParams` for Product Detail Pages (`/product/[slug]`) and Category Pages (`/category/[slug]`), plus Homepage ISR (`revalidate = 1800`).
  2. Tag-based and path invalidation via `unstable_cache` & `revalidateTag` (`product-${slug}`, `products`) alongside React 19 `cache()` request deduplication and `revalidatePath` in `actions/orders.ts` and `actions/products.ts`.
  3. Edge / CDN caching headers (`Cache-Control: public, s-maxage=120, stale-while-revalidate=600`) on `/api/search`.
  4. Client-side predictive search refactored to `@tanstack/react-query` (`useQuery`) with 5-min `staleTime` and query-key deduplication.
  5. Caching standards and architecture formally codified in `context/code-standards.md` and `context/architecture.md`.



