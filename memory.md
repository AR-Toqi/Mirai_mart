# Memory — Admin Multi-Variant Matrix, Custom Variants & Storefront PDP Dynamic Swatches

Last updated: September 10, 2026, 01:58:00 +06:00

## What was built

- **Attribute Option Builder & Cartesian Matrix in `components/admin/ProductForm.tsx`**:
  - Toggles for `Color`, `Size`, and `Weight` attribute axes with quick-preset chips (`COLOR_PRESETS`, `SIZE_PRESETS`, `WEIGHT_PRESETS`) and custom text tags.
  - One-click Cartesian matrix generator (`handleGenerateCombinations`) that produces all combinations while preserving existing variant prices, stock, and custom titles.
  - Bulk actions toolbar for mass price updates, mass stock updates, batch SKU generation, and clear-all with confirmation.
- **Standalone Custom Variant Builder in `components/admin/ProductForm.tsx`**:
  - Inline drawer allowing admins to manually add single/asymmetrical editions (e.g. Gift Packs, Deluxe Editions, standalone SKU bundles) with custom titles, SKUs, optional attribute tags, pricing, and stock.
  - Variant media assignment: Direct image upload (to InsForge Storage) or 1-click assignment from the product's 4 catalog photos.
- **Dynamic Storefront Swatch Selectors in `components/storefront/PDPBuyBox.tsx`**:
  - Interactive color chips with thumbnail photo preview or dynamic hex circle using canonical `getColorHex`.
  - Size buttons and Weight pills with real-time stock decoration (`line-through decoration-error` + `(Sold out)` badge) and dynamic price differential indicators.
  - 3-tier intelligent fallback matching to gracefully handle asymmetrical stock without locking user selections.
  - Fallback generic edition selector for non-structured/custom title variants.
- **Storefront PDP Gallery Synchronization in `components/storefront/PDPClient.tsx` & `components/storefront/PDPImageGallery.tsx`**:
  - Selecting a variant immediately swaps the active hero view to that variant's photo.
  - Full catalog photo preservation: thumbnails rail retains base product photos alongside variant photos in a compact 56px (`h-13 w-13 sm:h-14 sm:w-14`) rail.
  - Decoupled auto-slide: 3-second carousel runs smoothly on arrival and pauses once the customer actively clicks a variant swatch (`hasUserSelectedVariant`).
- **Database Non-Destructive Variant Persistence in `actions/admin.ts`**:
  - Replaced destructive variant delete-and-recreate logic with an atomic 3-way reconciliation: updates existing variants by ID in-place, inserts new variants, and deletes only explicitly removed variants.
  - Safeguarded `order_items(product_variant_id)` foreign keys and review purchase verification from being broken during product edits.
- **Shared Color Utilities in `lib/utils.ts`**:
  - Extracted unified `getColorHex` to eliminate code duplication across storefront and admin.
- **Client Route State Hygiene in `app/(commonRoutes)/(storefront)/product/[slug]/page.tsx`**:
  - Added `key={product.id}` to `<PDPClient>` and defensive state synchronization effect to prevent variant state staling across client-side product navigation.
- **Documentation & Design System Integrity**:
  - Registered `PDPVariantSelectors` as component #42 in `context/ui-registry.md` and updated `ProductForm` (#40) and `PDPImageGallery` (#15).
  - Updated `context/progress-tracker.md` with Multi-Variant System and Recovery milestones.

## Decisions made

- **Non-Destructive Variant Reconciliation**: Never delete and recreate all variants on update. Updating existing variants by their stable UUID ensures past completed orders in `order_items` retain their variant references (`ON DELETE SET NULL` won't be triggered unintentionally).
- **Asymmetrical Variant Fallback**: E-commerce products rarely have complete Cartesian matrices. 3-tier fallback matching (Color+Size+Weight $\rightarrow$ Color+Size $\rightarrow$ Color) prevents impossible selections and broken buy box states.
- **Interaction-Linked Gallery Auto-Slide**: Auto-sliding is pleasant when browsing, but jarring if a user explicitly chooses a specific color variant. Decoupling auto-slide via `hasUserSelectedVariant` allows auto-cycling on page load while respecting the customer's chosen swatch after click.
- **Unified Color Palette**: Maintained a centralized 40+ color-to-hex dictionary in `lib/utils.ts` to guarantee swatch color consistency between admin inputs and storefront displays.

## Problems solved

- Resolved sub-variants erroneously inheriting all cover photos by defaulting unassigned variants to `images: []`.
- Fixed `order_items` foreign key nullification during product edits by switching from blind `delete` to atomic upsert/reconciliation in `actions/admin.ts`.
- Fixed route state staling where navigating between products preserved the previous product's `selectedVariant` by mounting `<PDPClient key={product.id}>` and adding defensive state reset in `useEffect`.
- Fixed premature pausing of gallery auto-slide for all products with variants.
- Fixed DRY violation by consolidating duplicated `getColorHex` functions into `lib/utils.ts`.

## Current state

- Admin Multi-Variant Matrix, Custom Variant Drawer, and Bulk Tools are 100% complete and operational.
- Storefront Multi-Attribute Swatches (Color/Size/Weight) and Gallery Photo Binding are fully functional and responsive.
- Review passes with 0 issues across Plan Alignment, System Integrity, and Production Readiness.
- Dev server is running cleanly with 0 TypeScript errors.

## Next session starts with

- **Phase 5 — Feature 14: Admin Order Fulfillment & RMA Management**:
  - Admin Order List with status tabs (`All`, `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`, `Refunded`).
  - Order details modal/page with shipping label generation, bKash/Nagad MFS transaction ID verification, and tracking number assignment.
  - Return / Replacement request processing (RMA workflow).

## Open questions

- Confirm courier API integration details (e.g. Steadfast, Pathao, or RedX) for automatic delivery parcel booking.
- Confirm automated customer SMS/WhatsApp notification triggers upon order status changes.
