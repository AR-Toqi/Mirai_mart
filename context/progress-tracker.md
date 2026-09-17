# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 5 — Admin Management Panel (In Progress: Extended Operations)  
**Last completed:** Phase 5 — Feature 15 (Admin Marketing & Storefront CMS)  
**Next:** Phase 5 — Feature 16 (Admin Category Management CMS)  

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

- [x] 12 Admin Layout & Dashboard — Full UI & Real Metrics
- [x] 13 Admin Product & Inventory CMS
- [x] 14 Admin Order Fulfillment & RMA Management
- [x] 15 Admin Marketing & Storefront CMS
- [ ] 16 Admin Category Management CMS
- [ ] 17 Admin Customer Directory & CRM
- [ ] 18 Admin Advanced Sales Analytics & Reporting

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
- Storefront Desktop Container Max-Width set to `1440px` (`--container-7xl: 1440px` / `.max-w-7xl`) across Header, Navigation, Main, and Footer while Admin Panel retains `max-w-[1600px]`.
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
- Implemented Customer Order History Live Data Integration:
  1. Created `getCustomerOrdersAction` in `actions/orders.ts` querying InsForge PostgreSQL `orders` and `order_items` joined.
  2. Implemented `mapOrderRecordToCustomerOrder` in `lib/mappers/order.mapper.ts` transforming database records into the typed `CustomerOrder` interface with formatted timestamps and localized currency.
  3. Refactored `app/(protectedRoutes)/account/page.tsx` into an async Server Component that fetches user orders via `createInsforgeServer()` with zero client-side loading flashes.
  4. Wired `AccountDashboardClient.tsx` with live `orders` state, responsive filter counters, active/delivered/cancelled chip filtering, order search, and an encouraging 0-orders empty state with a "Start Shopping" CTA.
- Implemented Product Detail Page Live Reviews (Verified Purchase Only) & Curated Bundles:
  1. Strict Purchase Verification: built `checkReviewEligibilityAction` and `submitProductReviewAction` in `actions/reviews.ts` querying customer orders in `orders` and `order_items`. Gating guarantees that only genuine buyers can submit a review.
  2. Created `WriteReviewForm.tsx` (imprinted #34 in `ui-registry.md`) with 5-star interactive picker, purchase status banners (guest prompt, non-buyer notice, already-reviewed summary, eligible active form), and PostHog telemetry.
  3. Updated `PDPTabs.tsx` and `PDPClient.tsx` to dynamically calculate average star rating and distribution from database reviews, with immediate optimistic display on review publishing.
- Implemented Phase 5 — Feature 12 (Admin Layout & Dashboard — Full UI & Real Metrics):
  1. Built `AdminSidebar.tsx` adhering to `Admin_Dashboard.png` design with active Dashboard tab, navigation links (Products, Categories, Customers, Analytics, Promo Codes, Settings), dedicated "Website Content" tab for controlling storefront banners, and bottom "Visit Store" and "Sign Out" actions.
  2. Implemented `AdminTopBar.tsx` featuring "Dashboard 👋", interactive date range selector, notification bell with unread badge count (3), and admin user profile card (`AR Toqi`, `ADMIN`).
  3. Built `AdminDashboardClient.tsx` featuring 5 KPI cards (Total Sales ৳245,680, Orders 1,248, Customers 3,842, Products 342, Total Revenue ৳298,420), interactive 7-day Sales Overview SVG curve with hover tooltip, Top Selling Products ranking, Sales by Channel donut chart, Recent Orders table with pagination, New Customers feed with pagination, Inventory Summary donut gauge (68% In Stock), and Storefront Highlights quick card.
  4. Built Server Actions in `actions/admin.ts` (`getAdminDashboardMetricsAction`, `getAdminStorefrontContentAction`, `updateAdminStorefrontContentAction`) querying InsForge PostgreSQL tables (`orders`, `profiles`, `products`, `product_variants`) with realistic baseline blending.
  5. Built dedicated Website Content manager page at `/admin/content` allowing live customization of Hero Banner image, Baloo 2 headlines, and Top Announcement Bar.
- Implemented 3-Slide Full-Width Background Carousel with 3-Second Auto-Play:
  1. Re-architected `HeroBanner.tsx` into a full-width background image carousel (`aspect-[16/7] sm:aspect-[21/9]`) with smooth cross-fade transitions across 3 functional slides.
  2. Implemented 3-second (`3000ms`) auto-advance timer with hover-pause functionality, interactive indicator dots, and left/right manual chevron controls.
  3. Removed all hero titles (`h1`) and subtitles (`p`) as requested, creating a clean full-bleed presentation for custom graphic designs.
  4. Centered the primary and secondary CTA buttons in the exact middle of the banner overlay (`items-center justify-center`).
  5. Enhanced `WebsiteContentManager.tsx` and `actions/admin.ts` to manage all 3 slides independently with custom 5MB image uploads, preset pickers, and middle-aligned button toggle switchbars.
  6. Verified in browser subagent: auto-advance every 3 seconds across Slide 1, Slide 2, and Slide 3, clean full-width background rendering, centered buttons, and admin tab switching confirmed.
- Created `components/shared/MiraiMartLogo.tsx`:
  1. Implemented official reusable brand logo component supporting vector monogram mark (Isometric 3D "M" in primary `#0A98C3` with sunny yellow accent dot `#FCE35F`), full typographic lockup, and official raster image (`/mirai-mart_logo.png`).
  2. Resolved missing module import error in `AdminProductFilters.tsx`.
  3. Registered component #41 in `context/ui-registry.md`.
- Implemented Phase 5 — Feature 13 (Admin Product & Inventory CMS — Catalog Data Grid, Add & Edit Product):
  1. Built `AdminProductTable.tsx`, `AdminProductFilters.tsx`, and `AdminProductsClient.tsx` matching `Product_screen.jpeg`: responsive search bar, category dropdown, filter drawer toggle, stock status pills (`In Stock`, `Low Stock`, `Out of Stock`), active/draft toggle switch, and pagination.
  2. Built `ProductForm.tsx` matching `add-new_screen.png`: 2-column layout with section anchor navigation bar (`Basic Info`, `Media`, `Pricing`, `Inventory`, `Variants`, `SEO`), dynamic category attributes (Age Range for Toys, Tech Specs for Gadgets), sample photography presets, variant matrix, and sticky real-time Live Product Preview card with dynamic price calculation and delivery indicators.
  3. Built Server Actions in `actions/admin.ts`: `getAdminProductsAction`, `getAdminCategoriesAction`, `getAdminProductByIdAction`, `createAdminProductAction`, `updateAdminProductAction`, `uploadProductMediaAction`, `toggleAdminProductStatusAction`, and `deleteAdminProductAction` with atomic InsForge PostgreSQL persistence, sub-variant synchronization, and multi-tier cache invalidation (`revalidatePath` + `revalidateTag`).
  4. Implemented Server Component routes: `/admin/products/add-new` (create mode) and `/admin/products/[id]` (edit mode supporting both live DB records and baseline items).
  5. Built native drag-and-drop file upload dropzone in `ProductForm.tsx` uploading to InsForge Storage `products/` bucket with local fallback, and wired smooth anchor scrolling across all sections.
  6. Imprinted components #39, #40, and #41 in `context/ui-registry.md`.
- Implemented Admin Multi-Variant Management System & Storefront Swatch Selectors:
  1. Automated Attribute Option Builder: Built Cartesian matrix generator in `ProductForm.tsx` supporting Color, Size, and Weight axes with presets, chip toggles, and price/stock inheritance.
  2. Standalone Custom Variants: Built inline drawer in `ProductForm.tsx` enabling manual creation of one-off editions (e.g. Gift Packs, Deluxe Editions) and asymmetrical inventory with dedicated SKUs, prices, stock, and photos.
  3. Storefront Dynamic Swatches: Built interactive color swatches (with photo or hex preview), size chips, and weight chips in `PDPBuyBox.tsx` with intelligent fallback matching, real-time stock indicators, and price updates.
  4. Gallery Photo Binding: Connected variant selection in `PDPClient.tsx` to `PDPImageGallery.tsx`, immediately jumping the main image stage to the chosen variant photo while keeping all catalog images accessible.
- Implemented Phase 5 — Feature 14 (Admin Order Fulfillment & RMA Management):
  1. Built `AdminOrdersClient.tsx` following `order_screen.png` with 7 summary metric cards (Total Orders 342, Pending 28, Processing 47, Shipped 86, Delivered 151, Cancelled 18, Refunded 12), multi-status filter tabs, debounced search, multi-selection checkboxes, product thumbnails with count badges, authentic payment icons (Cash on Delivery, Bkash, Nagad, Card), and pagination.
  2. Built `AdminOrderDetailModal.tsx` for complete fulfillment logistics: 1-click status switcher, customer contact links, delivery zone indicators, financial COD ledger, courier selection (Pathao, Steadfast, RedX, etc.) with consignment tracking assignment, and RMA refund processing.
  3. Built `AdminPackingSlipModal.tsx` formatting orders into an official A4 printable packaging slip and customer invoice with Mirai Mart branding, tracking barcode, line items table, and authorized dispatcher signature.
  4. Built Server Actions in `actions/admin.ts`: `getAdminOrdersAction`, `updateAdminOrderStatusAction`, `updateAdminOrderTrackingAction`, `bulkUpdateAdminOrderStatusAction`, and `processAdminOrderRefundAction`.
  5. Updated `AdminSidebar.tsx` to include Orders navigation with `ShoppingCart` icon and enhanced `AdminTopBar.tsx` with dynamic global search bar on `/admin/orders`.
  6. Imprinted components #43, #44, and #45 in `context/ui-registry.md`.
  7. Implemented URL Status Query Parameter Synchronization for `AdminOrdersClient.tsx`:
     - Synchronized status tabs with `?status=` parameter using `router.replace(targetUrl, { scroll: false })`.
     - Preserves clean `/admin/orders` route when "All" tab is active.
     - Automatically parses status from URL on direct navigation or bookmarking (`?status=pending`, `?status=delivered`, etc.).
     - Listens to `searchParams` via `useEffect` to respond smoothly to browser Back/Forward navigation.
     - Wrapped `<AdminOrdersClient />` in a `<Suspense>` boundary with pulse loading skeleton in `app/(protectedRoutes)/admin/orders/page.tsx`.
     - Verified with browser subagent across all status transitions, URL updates, and direct link navigation.
     - Resolved edge case: added `setCurrentPage(1)` inside the `searchParams` `useEffect` listener to prevent out-of-range pagination empty states when navigating via browser Back/Forward buttons.
- Admin Dashboard UI Correction:
  1. Removed the "New Customers" widget and its state from `AdminDashboardClient.tsx`.
  2. Removed the "Recent Orders" table and its pagination state from the dashboard.
  3. Re-architected "Sales Overview" into a broad, full-width 12-column interactive analytics canvas:
     - Multi-timeframe switching tabs ("7 Days", "30 Days", "12 Months") with responsive dataset updates.
     - Top metrics ribbon displaying Period Revenue (+growth %), Daily Average, Peak Day & amount, and Orders Volume.
     - Vector spline curves with soft gradient area fill underneath the curve.
     - Interactive hover guide with vertical crosshair, concentric glowing nodes, and high-contrast tooltip card showing date, current amount, previous amount, and growth delta.
  4. Formed a balanced 3-column operational row underneath (Top Selling Products 4 cols, Sales by Channel 4 cols, Inventory Summary 4 cols).
  5. Verified layout, interactive tabs, tooltips, and responsiveness via browser subagent.
  6. Updated `context/ui-registry.md` and `context/progress-tracker.md`.
- Codebase Quality & Review Issue Recovery:
  1. Purged unconfigured raw Tailwind color classes across `AdminDashboardClient.tsx`, `AdminOrdersClient.tsx`, and `AdminOrderDetailModal.tsx`, standardizing all status badges and KPI card icons on Mirai Mart design tokens (`bg-primary-surface text-primary`, `bg-warning-surface text-warning-foreground`, `bg-success-surface text-success`, `bg-error-surface text-error`, `bg-secondary-surface text-secondary-foreground`, etc.).
  2. Refactored SVG chart styles in `AdminDashboardClient.tsx` to utilize CSS variable tokens (`var(--color-primary)`, `var(--color-neutral-border)`, `var(--color-neutral-muted)`, `var(--color-neutral-dark)`, `var(--color-surface)`, `var(--color-success)`, `var(--color-error)`).
  3. Removed unused Lucide icon imports (`ChevronDown`, `Calendar`, `Activity`) in `AdminDashboardClient.tsx`.
  4. Added explicit error feedback handling in `AdminOrderDetailModal.tsx` for RMA refund processing.
  5. Added safe clipboard API error handling and rejection guard in `AdminOrdersClient.tsx`.
  6. Refactored `AdminDashboardMetrics` in `actions/admin.ts` to make legacy dashboard properties optional.
  7. Updated `context/ui-registry.md` and `context/progress-tracker.md`.
- Implemented Promotions & Coupon Codes CMS + Review Recovery (Phase 5 — Feature 15):
  1. Built `AdminPromosClient.tsx` matching Mirai Mart design system: 4 KPI summary cards (Total Coupons 5, Active Codes 4, Total Redemptions 498, Attention Required 1), bidirectional URL query parameter synchronization (`?status=active|inactive`), debounced code search, 1-click clipboard copy, active status switch, redemption progress bar with warning colors, and deletion modal.
  2. Built `PromotionModal.tsx` with live voucher preview card, 3 discount models (Percentage, Fixed Amount, Free Shipping), subtotal thresholds, optional usage ceilings, and date constraints.
  3. Created type-safe Zod schema validation in `lib/validations/promotion.schema.ts` (`createPromotionSchema`, `updatePromotionSchema`) and wired into `actions/promotions.ts`.
  4. Unified Storefront & Checkout Validation: Refactored `createOrderAction` in `actions/orders.ts` to delegate to `validatePromoCodeAction`, eliminating code duplication.
  5. Guarded Usage Counter: Ensured `incrementPromotionUsageAction` only executes when the promotion is validated and actually applied.
  6. Resolved Free Shipping Coupon Visibility Bug: Updated `CartPageClient.tsx`, `CartDrawer.tsx`, and `CheckoutClient.tsx` so `FREESHIP` coupons are visible and removable.
  7. Threshold State Integrity: Extended `AppliedPromo` to store `minOrderValue` and enforce threshold checks in `CartProvider.tsx`.
  8. Added custom promo code input form with "Apply" button inside `CartDrawer.tsx`.
  9. Wrapped `AdminPromosClient` in a `<Suspense>` boundary in `app/(protectedRoutes)/admin/promos/page.tsx`.
  10. Imprinted components #46 and #47 in `context/ui-registry.md` and verified end-to-end via browser subagent.
  11. Targeted Recovery across 6 Core Files (`actions/orders.ts`, `actions/promotions.ts`, `lib/validations/promotion.schema.ts`, `CartProvider.tsx`, `CartDrawer.tsx`, `CartPageClient.tsx`):
      - `actions/orders.ts`: Imported missing types `OrderRecord` and `OrderItemRecord` from `@/lib/db/types`, sanitized `appliedPromoCode` against empty/whitespace strings.
      - `lib/validations/promotion.schema.ts`: Fixed `max_uses` schema to accept 0 as unlimited without validation error, added date regex and expiration-after-start date refinement to `updatePromotionSchema`, exported `CreatePromotionInput` and `UpdatePromotionInput` (`z.input`).
      - `actions/promotions.ts`: Directly used input types for actions, added baseline promotion fallback upserting in `updateAdminPromotionAction` and `toggleAdminPromotionStatusAction`, added null-safe `used_count` comparison.
      - `CartProvider.tsx`: Added missing `setGiftMessage` and `removePromoCode` to `CartContextType` interface, fixed `selectedItemIds` hydration empty array edge case.
      - `CartDrawer.tsx`: Replaced hardcoded raw hex classes with semantic design tokens (`bg-success-surface border-success/30 text-success`).
      - `CartPageClient.tsx`: Restored complete type safety and verified coupon removal/discount application.
      - Tested and verified end-to-end via browser subagent recording `recover_verify_1789546791309.webp`.
  12. Review Quality Recovery (Failure Mode 1 Targeted Fixes):
      - `actions/promotions.ts`: Set database query results as single source of truth in `getAdminPromotionsAction` so deleted baseline promotions never re-appear on reload.
      - `actions/promotions.ts`: In `validatePromoCodeAction`, only fell back to baseline promotions when the database is unreachable, preventing deleted baseline coupons from validating on checkout.
      - `actions/promotions.ts`: Added uniqueness check in `updateAdminPromotionAction` preventing rename collisions with existing promo codes.
      - `actions/promotions.ts`: Added null-safe property access `(record.min_order_value ?? 0).toLocaleString()`.
      - `components/admin/PromotionModal.tsx`: Fixed date expiration cutoff to end-of-day (`23:59:59.999Z`) and starts_at to start-of-day (`00:00:00.000Z`) so coupons remain valid through the entire expiration day.
      - `components/admin/AdminPromosClient.tsx`: Added null-safe property access `(p.used_count ?? 0).toLocaleString()`.
      - `components/storefront/CartDrawer.tsx`, `CartPageClient.tsx`, `CheckoutClient.tsx`: Added informative amber warning banner when cart subtotal drops below minimum order spend threshold (`Add ৳ [amount] more to activate`), eliminating customer confusion.
- Implemented Website Content Manager Refinements & Complete Phase 5:
  1. Hero Banner 3-Slide Carousel CMS verified: 3-slide tab switcher, live aspect-ratio preview, 3-second auto-play with pause-on-hover, drag-and-drop custom banner image uploader (5MB limit), curated preset photo gallery, direct URL input, and centered CTA button toggle controls in `/admin/content`.
  2. Top Announcement Bar CMS verified & refined: active/hidden toggle switch, custom promotional message input, and promo code highlight badge input with live preview in `WebsiteContentManager.tsx`.
  3. Refined `AnnouncementBar.tsx` on the storefront to mirror the CMS preview with high-contrast dark promo badge styling (`bg-neutral-dark text-secondary px-2 py-0.5 rounded-md text-[11px] font-bold`) and added a 5-second auto-rotation timer with hover-pause functionality.
  4. Registered Component #48 (`WebsiteContentManager`) and updated Component #1 (`AnnouncementBar`) in `context/ui-registry.md`.
  5. Phase 5 (all 15 build-plan features across Phase 1 to Phase 5) is now 100% complete.

