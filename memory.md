# Memory — Checkout Flow Overhaul, Delivery Zones & Official MFS Logos

Last updated: August 30, 2026 00:25:00 +06:00

## What was built

- **Checkout Page & Form Architecture (`components/storefront/CheckoutClient.tsx`)**:
  - Re-architected into a 2-Column responsive grid (`lg:grid-cols-12`):
    - **Left Column (`lg:col-span-6`)**: Streamlined **Billing Details** form (Full Name, Mobile Number, Delivery Zone Selector, Full Address, Optional Email, and Optional Special Delivery Instructions) + Trust Assurance Badge Strip.
    - **Right Column (`lg:col-span-6`)**: **Order Details** table (with line items, `✕` remove button, thumbnail, `[-] [ qty ] [+]` stepper, and calculations breakdown), **Payment Method Verification** card, Terms agreement, and Place Order CTA.
  - Implemented Place Order CTA in brand secondary yellow pill (`rounded-full bg-secondary hover:bg-secondary-light font-bold py-4 px-6 text-neutral-dark shadow-md`).
  - Added 1-Click WhatsApp direct checkout shortcut with auto-encoded order summary.
- **Official Vector SVG Brand Logos (`components/storefront/CheckoutPaymentMethod.tsx`)**:
  - Embedded 100% authentic vector SVGs for **bKash** (`BkashLogo` with multi-facet origami bird and wordmark) and **Nagad** (`NagadLogo` with swirl emblem and Bengali typography).
  - Integrated 1-click clipboard copy utility with temporary checkmark and `"Copied"` confirmation.
  - Cash on Delivery (advance shipping fee) vs Full Payment mode selector with dynamic amount badge updates.
- **Free Shipping Threshold & Delivery Zone Rates**:
  - Centralized `FREE_SHIPPING_THRESHOLD = 3000` (`৳ 3,000`) in `lib/constants.ts`.
  - Updated live threshold calculations and promo copy across `AnnouncementBar.tsx`, `HeroBanner.tsx`, `PDPBuyBox.tsx`, `PDPTabs.tsx`, `CartDrawer.tsx`, and `CartProvider.tsx`.
  - Configured standardized delivery rates: Inside Dhaka (`৳ 80`) and Outside Dhaka (`৳ 120`), both eligible for `FREE` shipping on orders &ge; ৳ 3,000.
- **Schema & Type Compatibility (`lib/validations/checkout.schema.ts`, `actions/orders.ts`)**:
  - Updated `checkoutCartItemSchema` to use `.nullish()` for `variantId`, `variantTitle`, `sku`, and `compareAtPrice` to resolve TypeScript type assignment errors.
  - Made `city` optional with default fallback in `checkoutFormSchema` to allow simplified address entry without requiring district/thana dropdowns.
  - Normalized optional variant fields in `actions/orders.ts`.
- **Documentation & Registry**:
  - Updated `context/ui-registry.md` entries #24 (`CheckoutClient`) and #25 (`CheckoutPaymentMethod`) with complete imprint specifications.
  - Updated `context/ui-tokens.md`, `context/ui-rules.md`, and `context/progress-tracker.md`.

## Decisions made

- **Layout Partition**: Partitioned checkout into Left (Billing Details) and Right (Order Details + Payment Method + CTA) to match customer mental model and streamline the final purchase decision on the right side.
- **Simplified Address Capture**: Removed multi-level District and Thana dropdowns in favor of a clear 2-zone selector (Inside Dhaka ৳80 vs Outside Dhaka ৳120) paired with a freeform full address field, reducing checkout friction.
- **Brand SVG Assets**: Directly embedded official vector SVGs in `CheckoutPaymentMethod.tsx` for crisp rendering across all screen densities without external image dependency.

## Problems solved

- Resolved TypeScript type incompatibility between cart items (`compareAtPrice: number | null | undefined`) and server action schema by introducing `.nullish()` in `checkoutCartItemSchema`.
- Replaced basic geometric SVG approximations with official, authentic bKash and Nagad brand vector paths.
- Aligned all sitewide free delivery thresholds from ৳ 999 to ৳ 3,000.

## Current state

- Checkout flow, order placement server action, payment verification, and delivery zone calculations are 100% operational and verified.
- Product Detail Page (PDP) image gallery features 4 distinct multi-angle views with a 3-second auto-cycle carousel timer (pauses on user hover/zoom) and synchronized thumbnail rail.
- Production build and development server running cleanly with 0 errors.

## Next session starts with

- **Phase 3 — Feature 10: Order Success & Order Tracking Confirmation Page**:
  - Polish `/checkout/success/[orderNumber]` with order summary receipt, MFS verification status, invoice download preview, and tracking milestones.
  - Wire customer portal order history views in `app/(protectedRoutes)/account/orders/page.tsx`.

## Open questions

- None.
