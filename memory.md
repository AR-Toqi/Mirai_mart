# Memory — Admin Product & Inventory CMS (Add/Edit Product, Live Preview & InsForge BaaS Integration)

Last updated: September 7, 2026 01:44:00 +06:00

## What was built

- **Product Catalog Management Suite (`components/admin/`)**:
  - `AdminProductFilters.tsx`: Responsive search bar with clear button, category dropdown, filter drawer toggle, and direct navigation links to `/admin/products/add-new`.
  - `AdminProductTable.tsx`: Multi-column catalog grid matching `Product_screen.jpeg` with thumbnail preview, title/badge, SKU, category, stock color-coding (`text-error`, `text-warning`, `text-neutral-dark`), formatted price in `৳`, interactive Active/Draft status toggle pills, edit button linking to `/admin/products/[id]`, and delete trigger.
  - `AdminProductsClient.tsx`: Client coordinator with optimistic Active/Draft toggling, optimistic deletion with confirmation modal, multi-criteria filtering (query, category, status, stock levels, price bounds, badge), and client-side pagination.
  - `ProductForm.tsx`: Comprehensive 2-column product editor matching `add-new_screen.png`:
    - Left column (approx. 68%): Section anchor navigation bar (`Basic Info`, `Media`, `Pricing`, `Inventory`, `Variants`, `SEO & Additional`), title with auto-slug generation, short description character counter (`0/160`), rich text description formatting toolbar, curator editorial notes ("Why We Love It"), dynamic category attributes (Age Range for Toys, Tech Specs for Gadgets), native drag-and-drop file upload dropzone with progress spinner and 4 testing photo presets, pricing with compare-at and cost price, inventory with SKU auto-generator, and variant matrix builder.
    - Right column (approx. 32% sticky): Real-time Live Product Preview card with dynamic photo display, active badge overlay, formatted `৳` pricing with strikethrough and savings pill, star rating preview, stock indicators, and delivery perks.
- **Server Component Admin Pages**:
  - `app/(protectedRoutes)/admin/products/page.tsx`: Server Component entrypoint querying products via `getAdminProductsAction` and rendering `AdminProductsClient`.
  - `app/(protectedRoutes)/admin/products/add-new/page.tsx`: Dedicated create route rendering `ProductForm` in `mode="create"` with active categories from InsForge DB.
  - `app/(protectedRoutes)/admin/products/[id]/page.tsx`: Dedicated edit route fetching product by ID and rendering `ProductForm` in `mode="edit"` with full pre-population and not-found fallback.
- **InsForge Server Actions (`actions/admin.ts`)**:
  - `getAdminProductsAction`: Fetches products joining `categories` and `product_variants`, merging with baseline catalog items.
  - `getAdminCategoriesAction`: Queries active categories from InsForge DB with fallback defaults.
  - `getAdminProductByIdAction`: Retrieves single product, specs, and variants from DB or baseline catalog.
  - `createAdminProductAction`: Validates and atomically inserts records into `products` and `product_variants`.
  - `updateAdminProductAction`: Atomically updates product details, primary variant, and synchronizes sub-variants.
  - `uploadProductMediaAction`: Uploads image files to InsForge Storage `products/` bucket with public URL extraction and persistent local filesystem fallback in `public/uploads/products/`.
  - `toggleAdminProductStatusAction` & `deleteAdminProductAction`: Performs atomic status updates and deletions.
- **Brand Identity Asset**:
  - `components/shared/MiraiMartLogo.tsx`: Reusable official logo supporting vector monogram mark (Isometric 3D "M" in primary `#0A98C3` with sunny yellow accent dot `#FCE35F`), full typographic lockup, and raster PNG.
- **Documentation & Consistency Artifacts**:
  - Imprinted components #39 (`AdminProductsClient`/`Table`/`Filters`), #40 (`ProductForm`), and #41 (`MiraiMartLogo`) in `context/ui-registry.md`.
  - Updated `context/progress-tracker.md` marking Phase 5 — Feature 13 complete.

## Decisions made

- **PostgREST Nested Join Type Defense**: Always defensively extract relation objects using `Array.isArray(rel) ? rel[0] : rel` when querying relations like `categories (id, name, slug)` to prevent TypeScript array inference errors and ensure runtime resilience.
- **Multi-Tier Tag & Path Invalidation**: All admin mutation actions call both `revalidatePath(...)` and `revalidateTag("products")` (plus item-specific `revalidateTag("product-[slug]")`) so that Next.js `unstable_cache` catalog queries across the storefront are immediately purged.
- **Dual-Mode Baseline Transition**: If an admin edits a baseline mock product (`prod-001` through `prod-012`), `updateAdminProductAction` automatically converts and persists it into InsForge PostgreSQL so it permanently becomes a live database entity.
- **Sub-Variant Sync Isolation**: When updating a multi-variant product, the primary variant (`is_default = true`) is updated specifically, while non-default variants are synchronized with `payload.variants` to prevent variant flattening.

## Problems solved

- Resolved TypeScript error `Property 'name' does not exist on type '{ id: any; name: any; slug: any; }[]'` in `actions/admin.ts:L1214`.
- Added missing native drag-and-drop file upload dropzone in `ProductForm.tsx` communicating with InsForge Storage `products/` bucket.
- Wired missing anchor scroll target `id="section-additional"` on the Category & Dynamic Attributes card in `ProductForm.tsx`.
- Ensured tag-based cache eviction (`revalidateTag("products")`) across all admin product mutations.
- Resolved sub-variant overwriting in `updateAdminProductAction`.

## Current state

- Phase 5 — Feature 13 (Admin Product & Inventory CMS) is 100% complete, reviewed, recovered, imprinted, and verified.
- Dev server running smoothly with zero compiler or lint errors.
- Table filtering, search, pagination, status toggling, deletion, product creation, product editing, media uploads, and real-time live preview are fully functional.

## Next session starts with

- **Phase 5 — Feature 14 (Admin Order Fulfillment & RMA Management)**:
  - Build Order Management data grid in `/admin/orders` with multi-criteria filtering: Status (`Pending`, `Packed`, `Shipped`, `Delivered`, `Refunded`), Date Range, and Payment Status.
  - Build Order Fulfillment Detail Drawer / Page (`/admin/orders/[id]`) with customer profile, items, tracking number input, carrier dropdown (FedEx, DHL, RedX, Pathao), and printable packing slip / invoice.
  - Implement Returns & RMA processing actions (`actions/admin.ts`).

## Open questions

- None.
