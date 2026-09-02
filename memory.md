# Memory — Customer Order History Live Data Integration & Account Portal

Last updated: September 2, 2026 20:45:40 +06:00

## What was built

- **Server-Side Customer Orders Fetcher (`actions/orders.ts` & `app/(protectedRoutes)/account/page.tsx`)**:
  - Added `getCustomerOrdersAction(userId?, customerEmail?)` querying InsForge PostgreSQL `orders` joined with `order_items` ordered by `created_at` descending.
  - Converted `AccountPage` into an async Server Component querying live orders via `createInsforgeServer()` and passing `initialOrders` into `AccountDashboardClient`.
  - Zero client-side loading flashes or hydration mismatch.
- **Relational-to-UI Order Mapper (`lib/mappers/order.mapper.ts`)**:
  - Created `mapOrderRecordToCustomerOrder` and `formatOrderDate` translating database columns into the strongly-typed `CustomerOrder` interface.
  - Handles bKash/Nagad/COD payment labeling, transaction ID extraction from order notes, advance vs due calculations, and address field mapping.
  - Resolved `Property 'address' does not exist on type 'AddressRecord'` TypeScript error by prioritizing `addressLine1` with safe fallbacks.
- **Client Account Dashboard Integration (`components/account/AccountDashboardClient.tsx`)**:
  - Updated `AccountDashboardClientProps` to receive `initialOrders?: CustomerOrder[]`.
  - Wired live order counts on the tab badges and recent orders list in the Dashboard overview tab.
  - Added a responsive 0-orders empty state card with a "Start Shopping" button linking directly to the storefront catalog.
  - Preserved fallback demo orders for non-authenticated preview modes while respecting authentic empty states for logged-in accounts.
- **UI Registry & Progress Tracker Updates**:
  - Imprinted `AccountDashboardClient` entry #33 into `context/ui-registry.md`.
  - Updated `context/progress-tracker.md`.

## Decisions made

- **Server Component Initial Fetch**: Data fetching executed in `account/page.tsx` adhering to Next.js 16 App Router best practices and `context/code-standards.md`, allowing instant server-rendered HTML and seamless revalidation on checkout via `revalidatePath("/account")`.
- **Pure Storefront Scope**: Excluded admin dashboard functionality per user request, strictly completing customer-facing order lifecycle features.
- **Dual Empty State Handling**: Differentiated between "no orders matching search/filter" and "no orders placed yet" with distinct messaging and actions.

## Problems solved

- Resolved disconnect between orders placed during checkout and the customer account view: authenticated users now see their genuine PostgreSQL order records in `/account` and `/account?tab=orders`.
- Fixed TypeScript compile error in `lib/mappers/order.mapper.ts` where `AddressRecord` expects `addressLine1` instead of `address`.

## Current state

- Customer Account Portal (`/account`), Order Detail Modal, Fulfillment Timeline, and Order History are fully wired to live InsForge PostgreSQL database records.
- Imprinted in `context/ui-registry.md`.
- Zero TypeScript errors. Dev server running cleanly.

## Next session starts with

- **Product Detail Page Live Reviews & Bundles**:
  - Connect verified customer reviews and "Frequently Bought Together" bundles on `/product/[slug]`.
- **Product Comparison Page**:
  - Refine `/compare` dynamic specification matrix.

## Open questions

- None.
