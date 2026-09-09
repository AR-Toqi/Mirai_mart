# Memory — Admin Product Media Management, Video Showcase, Upload Size Configuration & Storefront PDP Lightbox

Last updated: September 8, 2026, 01:34:00 +06:00

## What was built

- **Structured 4-Slot Photo Gallery Grid in `components/admin/ProductForm.tsx`**:
  - Slot 1 explicitly serves as the primary catalog cover image with dedicated "Cover (Slot 1)" star badge.
  - Slots 2–4 allow up to 4 square (1:1) product photos with dynamic action overlays: "Make Cover" (swaps photo into Slot 1) and "Delete Photo".
  - Empty slots display interactive dashed tiles (`+ Add Cover Photo` / `+ Add Photo 2..4`) that trigger file browsing or drag-and-drop.
  - Replaced hardcoded preset default with clean empty initial state `[]` so admins can test real uploads from scratch.
  - Instant storage garbage collection: Deleting an uncommitted photo immediately removes it from InsForge Storage `products/` bucket or local disk (`public/uploads/products/`).
- **Product Showcase Video Feature (Admin & Storefront)**:
  - `components/admin/ProductForm.tsx`: Added Video URL input with automatic real-time provider detection (YouTube, YouTube Shorts, Vimeo, direct MP4), colored format badge, and expandable `Test Playback` preview player.
  - `types/index.ts` & `actions/admin.ts`: Extended `Product`, `ProductFormData`, `specs` JSON, and database mutations (`createAdminProductAction`, `updateAdminProductAction`) to store and persist `videoUrl`.
  - `components/storefront/PDPClient.tsx` & `components/storefront/PDPImageGallery.tsx`: Connected video showcase to the PDP with:
    - Floating "Watch Video" pill badge on the main product image.
    - Dedicated video thumbnail tile in the thumbnails rail.
    - Full-screen Video Lightbox Modal with 16:9 responsive embed, ESC key listener, and outside-click-to-close handler.
- **Server Action Body Size Limit & Client-Side Validation**:
  - `next.config.ts`: Configured `experimental.serverActions.bodySizeLimit: "10mb"` to resolve Next.js 1 MB limit (HTTP 413 error).
  - `actions/admin.ts`: Increased `MAX_SIZE_BYTES` to 8 MB in `uploadProductMediaAction` and `uploadBannerImageAction`.
  - `components/admin/ProductForm.tsx` & `components/admin/WebsiteContentManager.tsx`: Added client-side pre-flight file size checks (8 MB cap), error handling for 413/network failures, and an `Image Upload Notice` card with dismiss button.
- **Storefront & Metric Fallback Cleanups**:
  - `actions/admin.ts`: Replaced external dummy Unsplash fallback URLs with local project SVG assets (`/images/prod-robocode.svg`, etc.) and updated `getAdminDashboardMetricsAction` to dynamically query real products and uploaded covers for Top Selling Products.
  - `actions/products.ts`: Prioritized `specs.images[0]` (real uploaded cover photo) before mock data fallbacks on the storefront.
- **Recovery & Design System Token Alignments**:
  - Replaced raw `bg-black/90` with token `bg-neutral-dark/90 backdrop-blur-md` in `PDPImageGallery.tsx`.
  - Removed artificial `images.length <= 1` lock in `handleRemoveImage`, and added publish validation in `handleSubmit` requiring at least 1 cover photo for `active` products (allowing 0 images for drafts).
  - Replaced TypeScript `any` annotations with `unknown` and type guards in `actions/admin.ts`.
- **Registry & Progress Tracking**:
  - Imprinted updated patterns for `ProductForm` (#40) and `PDPImageGallery` (#15) in `context/ui-registry.md`.
  - Updated `context/progress-tracker.md`.

## Decisions made

- **8 MB File Cap within 10 MB Next.js Envelope**: Kept client-side and action-level image validation at 8 MB to provide a safe 2 MB buffer beneath the 10 MB Server Actions body parser limit, avoiding unexpected 413 rejections caused by multipart payload overhead.
- **Cover Image Priority Chain**: Storefront resolution in `actions/products.ts` strictly prioritizes `defaultVariant.images[0]` $\rightarrow$ `specs.images[0]` (real uploaded cover) $\rightarrow$ mock image fallback $\rightarrow$ local SVG placeholder. Real admin uploads will never be overshadowed by mock data.
- **Active vs Draft Image Requirements**: Draft products (`status === "draft"`) can be saved with 0 images, but published catalog items (`status === "active"`) strictly require at least 1 cover photo to protect storefront catalog presentation.
- **Shorts & Mobile Video Standardization**: All YouTube URL variations (including `shorts/`, `youtu.be/`, `watch?v=`, and `embed/`) are normalized to `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0` for privacy and cross-browser embed stability.

## Problems solved

- Resolved `Duplicate identifier 'path'` and `Duplicate identifier 'fs'` error in `actions/admin.ts:L4` caused by duplicate mid-file imports.
- Fixed Next.js runtime crash `Error: Body exceeded 1 MB limit (statusCode: 413)` during image upload by configuring `experimental.serverActions.bodySizeLimit: "10mb"` in `next.config.ts`.
- Replaced the pre-filled dummy Unsplash Toy Train Set cover photo with a clean empty initial state, enabling real-world upload testing.
- Fixed `handleRemoveImage` blocking users from removing uploaded photos when only 1 photo was present.
- Fixed YouTube Shorts URLs failing to embed in the video showcase player.

## Current state

- Admin product creation, editing, 4-slot image management, video showcase, and InsForge Storage integration are 100% complete and verified.
- Storefront PDP image gallery with zoom, video thumbnail, and full-screen lightbox modal is fully functional.
- Zero TypeScript or lint errors.

## Next session starts with

- **Product Variants System**:
  - Developer note: *"for product variant more works to do. i will do it tomorrow."*
  - Expand and refine the Product Variant matrix in `components/admin/ProductForm.tsx`: multi-attribute variant options (e.g. Size, Color, Edition, Age Group), variant-specific image attachments, batch SKU generation, and stock management.

## Open questions

- Confirm variant attribute structure (fixed attributes like Color/Size vs arbitrary key-value pairs).
- Verify if variant-specific photo uploads should hook into the same InsForge Storage `products/catalog/` bucket.
