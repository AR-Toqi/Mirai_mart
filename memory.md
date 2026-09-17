# Memory — Admin Category Management CMS & Dynamic Storefront Sync (Phase 5 Feature 16)

Last updated: September 18, 2026, 01:27:00 +06:00

## What was built

- **Category Server Actions in `actions/categories.ts`**:
  - Implemented `getAdminCategoriesAction`, `getStorefrontCategoriesAction`, `getCategoryBySlugAction`, `createAdminCategoryAction`, `updateAdminCategoryAction`, `deleteAdminCategoryAction`, and `toggleAdminCategoryStatusAction`.
  - Integrated PostgreSQL queries with InsForge SDK, calculating live product counts and parent-child hierarchical relations.
  - Added automated multi-tier cache invalidation (`revalidatePath` on `/`, `/category/[slug]`, `/admin/categories`).
- **Validation Schema in `lib/validations/categories.schema.ts`**:
  - Created Zod schemas `createCategorySchema` and `updateCategorySchema` with slug sanitization, display order formatting, and support for absolute URLs or relative image paths.
- **Admin Category Management UI in `components/admin/AdminCategoriesClient.tsx`**:
  - 4 KPI summary cards (Total Categories, Parent Departments, Subcategories, Active on Storefront).
  - Search toolbar with debounced keyword filter and category type tabs (`all`, `parents`, `subcategories`, `active`, `draft`).
  - Hierarchical tree table with expandable/collapsible parent rows, product count badges, and optimistic active/draft status toggle switch.
  - Strict deletion guard modal blocking deletion of categories with existing subcategories or assigned products.
- **Category Creation & Edit Modal in `components/admin/CategoryModal.tsx`**:
  - Real-time auto-slug generator with manual override.
  - Strict 2-level hierarchy enforcement (only top-level categories appear as parent options; categories with children cannot become subcategories).
  - 5MB image upload dropzone wired to `uploadProductMediaAction` with fallback URL input.
- **Storefront Dynamic Category Synchronization**:
  - `components/layout/CategoryNavBar.tsx`: Refactored to accept dynamic database categories with subcategory accordion drawers.
  - `components/storefront/CategoryCircles.tsx`: Refactored to render live active top-level categories with Lucide `Folder` fallback icon.
  - `components/storefront/CategoryHeader.tsx`: Added dynamic `parentDept` breadcrumbs support.
  - `app/(commonRoutes)/(storefront)/layout.tsx` & `category/[slug]/page.tsx`: Integrated live database queries, removing all hardcoded fallbacks (`DEFAULT_ADMIN_CATEGORIES`, `NAV_DEPARTMENTS`, `CATEGORY_CIRCLES`, `CATEGORIES_META`).
- **UI Registry & Progress Tracker Updates**:
  - Imprinted Component #49 (`AdminCategoriesClient`) and Component #50 (`CategoryModal`) in `context/ui-registry.md`.
  - Synchronized Component #4 (`CategoryNavBar`), Component #5 (`CategoryCircles`), and Component #10 (`CategoryHeader`) in `context/ui-registry.md`.
  - Updated `context/progress-tracker.md` marking Feature 16 complete.

## Decisions made

- **Strict 2-Level Taxonomy**: Locked category hierarchy to 2 tiers (Top-Level Parent -> Subcategory). Prevented arbitrary recursive nesting to keep mobile navigation clean and predictable.
- **Zero Mock Fallbacks**: Completely eliminated all hardcoded mock category arrays across both admin and storefront surfaces. The live InsForge PostgreSQL database is now the single source of truth.
- **Deletion Safety Guard**: Hard-blocked deletion of parent categories with child subcategories or categories with linked products, enforcing re-assignment before deletion.
- **Draft Privacy Shield**: Inactive categories are hidden from navigation and guarded against direct URL access on storefront routes.

## Problems solved

- **Broken Category Modal Upload**: Replaced non-existent `/api/upload` route with direct delegation to `uploadProductMediaAction` in `actions/admin.ts`.
- **Image URL Validation**: Relaxed Zod schema to accept relative public asset paths (`/uploads/...`, `/images/...`) alongside external HTTPS URLs.
- **Client Prop Sync on Mutation**: Added `useEffect` listeners in `AdminCategoriesClient.tsx` for `initialCategories`, `initialParents`, and `initialMetrics`, plus optimistic deletion handling for instant table updates.
- **Tailwind Token Alignment**: Replaced non-token `bg-secondary-dark` with design system token `bg-secondary` in `CategoryNavBar.tsx`.
- **Storefront Category Typing**: Aligned `CategoryMeta` and `SubCategory` TypeScript interfaces in `app/(commonRoutes)/(storefront)/category/[slug]/page.tsx`.

## Current state

- Phase 1 through Phase 5 (Features 1–16) are 100% complete and verified.
- Category CMS is fully operational in `/admin/categories` and synchronized with live storefront routes (`/`, `/category/[slug]`).
- Next.js development server is running smoothly on `http://localhost:3000`.

## Next session starts with

- **Phase 5 — Feature 17: Admin Customer Directory & CRM (`/admin/customers`)**:
  - Create server actions in `actions/customers.ts` (or `actions/admin.ts`) querying InsForge PostgreSQL `profiles` and joined `orders` table to compute customer lifetime value, order counts, and last activity timestamps.
  - Build `components/admin/AdminCustomersClient.tsx` with KPI metric cards (Total Customers, Active Buyers, VIP Customers, Repeat Purchase Rate), debounced search, status filter tabs, and responsive data table.
  - Build `components/admin/CustomerDetailModal.tsx` for viewing individual customer profile, shipping addresses, full order ledger, and customer support contact links.

## Open questions

- Confirm threshold definition for VIP customer classification (e.g. Total spend ≥ ৳ 10,000 or ≥ 5 completed orders).
