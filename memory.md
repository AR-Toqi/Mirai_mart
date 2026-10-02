# Memory — Admin Customer Directory & CRM (Phase 5 — Feature 17) & Review Quality Recovery

Last updated: October 2, 2026, 21:40:00 +06:00

## What was built

- **Admin Customer Directory & CRM (`app/(protectedRoutes)/admin/customers/page.tsx`)**:
  - Implemented async Server Component with streaming `<Suspense fallback={<CustomersSkeleton />}>` wrapping `<CustomersDataLoader />`.
  - Added SEO metadata for the Customers CRM route.
- **Server Actions in `actions/customers.ts`**:
  - Built `getAdminCustomersAction()` consolidating registered user profiles (`profiles`) and guest purchasers (`orders`) into a unified customer CRM dataset.
  - Built `getAdminCustomerDetailAction(customerIdOrEmail)` fetching individual customer profile, delivery addresses, and chronological order ledger with single-pass dataset resolution.
  - Added `verifyAdminAuthorization()` RBAC check protecting customer PII and financial records.
- **Customer CRM Components**:
  - `components/admin/AdminCustomersClient.tsx` (Component #51): 4 KPI summary cards (Total Customers, Active Buyers, Repeat Shoppers, Average Customer Spend), debounced multi-field search across name, email, and phone, 5 status filter tabs (`All`, `Registered`, `Guest Buyers`, `Repeat Buyers`, `Active Buyers`), bidirectional URL query sync (`?tab=`, `?sort=`, `?search=`), sort selector, avatar initials, localized ৳ formatting, and 1-click CSV customer export.
  - `components/admin/CustomerDetailModal.tsx` (Component #52): Detailed customer inspection drawer with 1-click WhatsApp chat link, direct email client trigger, phone dialer, delivery addresses grid with zone badges, chronological order ledger table with status pills, and direct deep-link into the orders queue.
  - `components/layout/AdminTopBar.tsx`: Added contextual title "Customer Directory & CRM 👥" and subtitle.
  - `types/customers.ts`: Shared TypeScript interfaces (`AdminCustomer`, `AdminCustomerDetail`, `CustomerOrderLedgerItem`, `CustomerKpiMetrics`, `AdminCustomersResponse`, `AdminCustomerDetailResponse`).
- **Edge Route Protection & Security in `proxy.ts`**:
  - Extended perimeter protection matcher to `["/account/:path*", "/admin/:path*"]`.
  - Enforced active session validation and role verification (`admin` or `store-manager`) on `/admin/*`.
- **Order Queue Deep Linking in `components/admin/AdminOrdersClient.tsx`**:
  - Added support for `?search=` query parameter on mount and in `searchParams` listener `useEffect`, automatically populating `searchQuery` and filtering orders when navigating from customer records or order numbers.
- **Shared Utilities in `lib/utils.ts`**:
  - Added `cleanPhoneNumberForWhatsApp(phone?: string | null)` standardizing phone numbers for WhatsApp API and dialers (`017...` -> `88017...`).
- **Storefront & Registry**:
  - Restored `announcement.isActive: true` in `data/storefront-content.json`.
  - Imprinted Components #51 and #52 into `context/ui-registry.md`.
  - Updated `context/progress-tracker.md` through Feature 17 and Review Recovery.

## Decisions made

- **Single-Pass Dataset Resolution**: Refactored `actions/customers.ts` to use internal `resolveCustomersDataset()` returning both aggregated customers and indexed `ordersByEmail` map, eliminating duplicate database calls.
- **Edge Perimeter Guard vs Component Guards**: Guarded `/admin/*` in `proxy.ts` to prevent unauthenticated access, while reinforcing customer data Server Actions with `verifyAdminAuthorization()` using cookie verification.
- **Bidirectional URL Query Parameter Synchronization**: Synchronized filter tabs, sort, and search in `AdminCustomersClient.tsx` using `router.replace(..., { scroll: false })` so tabs are preserved on refresh and browser Back/Forward navigation works seamlessly.
- **Deep-Link URL Contracts Across Admin**: Standardized on `/admin/orders?search=${encodeURIComponent(query)}` for navigating from customer details into specific order records, handled automatically in `AdminOrdersClient.tsx`.

## Problems solved

- **Redundant Sequential DB Calls**: Eliminated duplicate `getAdminOrdersAction()` calls in `getAdminCustomerDetailAction`, reducing modal load times.
- **Broken Search Deep Link**: Fixed `AdminOrdersClient.tsx` ignoring `searchParams.get("search")`, making links from customer order ledgers filter properly.
- **Ineffective Suspense Boundary**: Fixed `await` blocking before `<Suspense>` in `admin/customers/page.tsx` by isolating data fetching into `<CustomersDataLoader />`.
- **Divergent Phone Cleaning**: Replaced ad-hoc regex helpers across components with central `cleanPhoneNumberForWhatsApp()`.
- **Unintended Announcement Bar Inactivity**: Restored `announcement.isActive` flag in `data/storefront-content.json`.

## Current state

- Phase 5 — Feature 17 (Admin Customer Directory & CRM) is 100% complete, reviewed, recovered, and imprinted in `ui-registry.md`.
- All admin portals (`/admin`, `/admin/products`, `/admin/categories`, `/admin/customers`, `/admin/orders`, `/admin/promos`, `/admin/content`) are working and guarded.
- Storefront (`/`, `/category/[slug]`, `/product/[slug]`, `/cart`, `/checkout`, `/account`, `/track-order`) is fully operational.
- Development server running on `http://localhost:3000`.

## Next session starts with

- **Phase 5 — Feature 18: Admin Advanced Sales Analytics & Reporting (`/admin/analytics`)**:
  - Build executive sales analytics command center adhering to `build-plan.md` Item 18.
  - Metric ribbons: Gross Sales, Net Revenue, Orders Volume, Average Order Value (AOV), Return/Refund Rate, Repeat Customer Rate.
  - Interactive timeframe switching ("Today", "Last 7 Days", "Last 30 Days", "This Quarter", "Year to Date").
  - Visual charts: Revenue/Orders trend spline curve, category sales contribution donut chart, payment methods breakdown (COD vs MFS bKash/Nagad), and top-performing products leaderboard.
  - Export engine (CSV/PDF export).

## Open questions

- None. All requirements for Feature 17 and review fixes are resolved and verified.
