# Memory — Slide-Over Cart Drawer, TanStack Query State & ProductCard Refinements

Last updated: August 29, 2026 13:51:00 +06:00

## What was built

- **Framer Motion Slide-Over Cart Drawer (`components/storefront/CartDrawer.tsx`)**:
  - Implemented animated slide-in and backdrop fade using `framer-motion` (`AnimatePresence`, spring physics `damping: 28, stiffness: 260`).
  - Free shipping progress bar (`৳ 999` threshold) with dynamic live calculations and milestone messages.
  - Interactive item selection checkboxes with selective checkout calculations.
  - Product line items with image thumbnails, `Baloo 2` typography, quantity steppers, and trash delete icon.
  - Coupon card (`MIRAI10`) with 1-click apply and applied status feedback.
  - Summary breakdown (Subtotal, Discount, Shipping, Total) and free shipping celebration banner.
  - "Proceed to Checkout" and "View Cart" CTA buttons (trust badges excluded per design direction).
  - Mounted globally inside `<CartProvider>` in `app/layout.tsx`.
- **TanStack Query v5 + Context Hybrid State Management**:
  - Installed `@tanstack/react-query` and created `components/providers/QueryProvider.tsx`.
  - Wrapped `QueryProvider` around `AuthProvider` and `CartProvider` in `app/layout.tsx`.
  - Integrated `useQuery` in `CartProvider.tsx` to fetch `profiles.active_cart` from InsForge PostgreSQL on login and merge with guest cart items.
  - Integrated `useMutation` in `CartProvider.tsx` to debounce (700ms) and sync active cart changes to InsForge database asynchronously.
  - Updated `ProfileRecord` in `lib/db/types.ts` with `active_cart?: Record<string, unknown> | null`.
- **ProductCard Visual Refinement (`components/storefront/ProductCard.tsx`)**:
  - Placed Category Name and Rating Stars (`RatingStars`) side-by-side on the same row (`flex items-center justify-between gap-2`).
  - Positioned Price row cleanly above the CTA.
  - Implemented full-width action button (`w-full mt-3 h-9 rounded-xl bg-secondary`) at the bottom of the card.
  - Implemented snappy 150ms `ease-out` slide/fade hover animation transitioning from `Add to Cart` to `[🛒 Add to Cart]`.
- **Performance & Error Resolutions**:
  - Added `priority` property to `/images/promo-summer.svg` in `components/storefront/PromoBanner.tsx` to optimize LCP.
  - Disabled PostHog session recording in development in `instrumentation-client.ts` to silence recorder console traces.
- **Skill Runs & Verification**:
  - Ran `/review` verifying Plan Alignment, System Integrity, and Production Readiness (0 issues found across all 3 layers).
  - Ran `/imprint` capturing `ProductCard` and `CartDrawer` visual patterns into `context/ui-registry.md`.
  - Ran `next build` with 0 TypeScript/ESLint/bundling errors.

## Decisions made

- **Hybrid State Architecture**:
  - **React Context API + `localStorage`** owns client-side UI responsiveness, stepper clicks, and guest shopping persistence (0ms latency).
  - **TanStack Query v5** owns asynchronous cloud synchronization with `profiles.active_cart` in InsForge PostgreSQL.
- **On-Login Merge Strategy**: When an unauthenticated user with local items logs in, local items are merged with remote items by `uniqueId` (preserving higher quantities up to `maxStock`) and persisted.
- **ProductCard Bottom CTA**: Switched to a full-width bottom button with snappy 150ms `ease-out` hover animation.

## Problems solved

- Fixed PostHog development session recorder error by adding `disable_session_recording: process.env.NODE_ENV === "development"` and setting `debug: false` in `instrumentation-client.ts`.
- Resolved Next.js LCP browser warning by setting `priority` on the above-the-fold promo image.
- Corrected InsForge database call signature from `insforge.from` to `insforge.database.from` for database operations.

## Current state

- Slide-over Cart Drawer, Cart State synchronization, and ProductCard micro-interactions are 100% complete and tested.
- Production build passes cleanly with 0 errors.

## Next session starts with

- **Phase 3 — Feature 08/09: Dedicated Cart Page & Checkout Flow**:
  - Polish full Cart Page (`app/(commonRoutes)/(storefront)/cart/page.tsx`) with full table layout, gift wrap options, and order notes.
  - Proceed to **Phase 3 — Feature 09: Checkout Flow & Order Placement** (`app/(commonRoutes)/(storefront)/checkout/page.tsx`).

## Open questions

- None.
