# Memory — Promotions & Coupon Codes CMS Engine, Storefront Checkout Integration & Threshold Safeguards

Last updated: September 16, 2026, 14:46:00 +06:00

## What was built

- **Admin Promotions & Coupon Codes CMS in `components/admin/AdminPromosClient.tsx`**:
  - 4 summary KPI metric cards (Total Coupons 5, Active Codes 4, Total Redemptions 498, Attention Required 1).
  - Multi-status filter tabs (`All`, `Active`, `Inactive`) with bidirectional URL query parameter synchronization (`/admin/promos?status=active`, etc.) using `router.replace(targetUrl, { scroll: false })`.
  - Debounced code search filtering by coupon code, discount title, or type.
  - Interactive table displaying coupon codes with 1-click clipboard copy and animated feedback, discount type badges (`Percentage`, `Fixed Amount`, `Free Shipping`), minimum order value thresholds, date validity ranges, redemption progress bars with warning thresholds, and active status toggle switches.
  - Delete confirmation modal with optimistic UI removal.
- **Voucher Creator & Live Interactive Preview in `components/admin/PromotionModal.tsx`**:
  - Modal supporting both Create and Edit modes.
  - Real-time voucher preview card with dashed border, dynamic discount formatting (%, ৳, or Free Shipping), and expiry countdown.
  - Granular discount rule configuration: Discount Type, Value, Minimum Order Subtotal, Usage Limit Ceiling (with 0 or blank for unlimited), and Start / Expiry dates.
  - Normalized date handling setting `starts_at` to start of day (`00:00:00.000Z`) and `expires_at` to end of day (`23:59:59.999Z`) for full-day coupon validity.
- **Server Actions in `actions/promotions.ts`**:
  - `getAdminPromotionsAction`: Queries InsForge PostgreSQL `promotions` table as single source of truth, with baseline fallback only when the database table is empty.
  - `createAdminPromotionAction` and `updateAdminPromotionAction`: Zod-validated mutation actions with code collision checks and Next.js tag/path revalidation (`revalidatePath("/admin/promos")`).
  - `toggleAdminPromotionStatusAction` and `deleteAdminPromotionAction`: Database-driven status toggling and hard deletion.
  - `validatePromoCodeAction`: Validates promo codes against database with checks for active state, date validity, usage ceiling, and cart minimum order spend.
  - `incrementPromotionUsageAction`: Atomic database usage incrementer executed upon completed order placement.
- **Zod Validation Schemas in `lib/validations/promotion.schema.ts`**:
  - `createPromotionSchema` and `updatePromotionSchema` validating code format, discount values, positive subtotal thresholds, optional usage limits (allowing 0 as unlimited), and date ordering.
- **Storefront & Checkout Promotions Integration**:
  - `components/providers/CartProvider.tsx`: Added `appliedPromo` object tracking `code`, `discountType`, `discountValue`, `minOrderValue`, and `discountAmount`; implemented `applyPromoCode` and `removePromoCode`.
  - `components/storefront/CartDrawer.tsx`: Promo code input form with `Tag` prefix icon, uppercase input, 1-click `MIRAI10` quick apply pill, active coupon badge, minimum spend threshold deficit warning card (`Add ৳ X more to activate discount`), celebratory free shipping banner, and remove action.
  - `components/storefront/CartPageClient.tsx`: Real-time coupon discount display, support for `free_shipping` coupon type, inactive warning card when subtotal is below minimum order value, and promo code quick suggestions.
  - `components/storefront/CheckoutClient.tsx`: Order summary discount line item or inactive coupon threshold callout with minimum spend notification.
  - `actions/orders.ts`: Refactored `createOrderAction` to delegate coupon validation directly to `validatePromoCodeAction` and increment usage count only when verified and applied.
- **Next.js 16 `<Suspense>` Boundary in `app/(protectedRoutes)/admin/promos/page.tsx`**:
  - Wrapped `<AdminPromosClient />` in a `<Suspense>` boundary with a skeleton loader for App Router SSR compliance with `useSearchParams()`.
- **UI Registry & Progress Tracker Updates**:
  - Registered components #46 (`AdminPromosClient`) and #47 (`PromotionModal`) in `context/ui-registry.md`.
  - Imprinted updated coupon patterns into entries #21 (`CartDrawer`), #23 (`CartPageClient`), and #24 (`CheckoutClient`).
  - Updated `context/progress-tracker.md` to reflect completion of Phase 5 — Feature 15 (Promo Codes Engine).

## Decisions made

- **Database Authority Over Baseline Seeding**: Set live database queries as the single source of truth in `getAdminPromotionsAction` and `validatePromoCodeAction` so deleted coupons never ghost reappearance upon reload.
- **Non-Destructive Inactive Threshold State**: When a customer's cart drops below a coupon's `minOrderValue`, do not discard or detach the coupon. Instead, transition it to an informative "Inactive" state with a clear spend callout (`Add ৳ X more to activate discount`), keeping it active as soon as more items are added.
- **Full-Day Expiration Cutoff**: Coupon expiration dates are normalized to `23:59:59.999Z` so vouchers remain valid throughout the entire day of expiry.
- **Delegated Checkout Validation**: Refactored checkout order creation (`createOrderAction`) to call `validatePromoCodeAction` directly instead of maintaining duplicate validation logic.

## Problems solved

- Resolved TypeScript `ZodError` issue where `max_uses` rejected `0` or empty strings as invalid numbers by handling optional/nullable integer conversion cleanly.
- Resolved Free Shipping coupon (`FREESHIP`) visibility issue where `$0` discount value caused discount lines to disappear by checking `appliedPromo.discountType === "free_shipping"`.
- Resolved phantom baseline coupon reactivation by prioritizing live database records over static mock fallbacks.
- Purged unconfigured raw Tailwind hex classes in `CartDrawer.tsx` in favor of semantic design tokens (`bg-success-surface`, `border-success/30`, `text-success`).

## Current state

- Phase 5 — Feature 15 (Promotions & Coupon Codes CMS + Storefront Integration) is 100% complete, fully verified in both Admin and Storefront.
- Cart Drawer, Cart Page, and Checkout clients are aligned with the Mirai Mart design token system and registered in `context/ui-registry.md`.
- Next.js development server is running cleanly with 0 type errors and 0 lint warnings.

## Next session starts with

- **Phase 5 — Feature 15 (Storefront CMS Refinements & Complete Phase 5)**:
  - Verify and refine Website Content manager (`/admin/content`): Hero banner 3-slide carousel CMS and top Announcement Bar promotional text customization.
  - Conduct final Phase 5 end-to-end integration audit before proceeding to final deployment preparation.

## Open questions

- Determine whether coupon codes should support single-use-per-customer restrictions linked to customer profile IDs or emails.
