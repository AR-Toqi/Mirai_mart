# UI Registry

A centralized inventory of all reusable components, layouts, design tokens, and UI patterns for Mirai Mart. Every component must strictly adhere to the designated design tokens from `context/design/Mirai-mart_design-system.png` and architecture rules to prevent visual and structural drift across development sessions.

---

## Design System & Tokens

### 1. Typography

- **Headings & Display**: `Baloo 2` (`font-heading`, weights: 500 Medium, 600 SemiBold, 700 Bold) — friendly, playful, modern geometry.
  - Display LG: 48px / line-height: 56px / 700
  - Headline LG: 32px / line-height: 40px / 600
  - Headline MD: 24px / line-height: 32px / 600
  - Headline SM: 20px / line-height: 28px / 500
- **Body, Inputs & Specs**: `DM Sans` (`font-sans`, weights: 400 Regular, 500 Medium, 700 Bold) — clean, highly legible neutral sans-serif.
  - Body LG: 18px / line-height: 28px / 400
  - Body MD: 16px / line-height: 24px / 400
  - Body SM: 14px / line-height: 20px / 400
  - Label MD: 14px / line-height: 16px / 700
  - Label SM: 12px / line-height: 16px / 500

### 2. Core Color Palette

| Token | CSS Variable / Hex | Usage |
| --- | --- | --- |
| **Primary (Main)** | `var(--color-primary)` / `#0A98C3` | Primary buttons, active pill chips, brand marks, links |
| **Primary Light** | `var(--color-primary-light)` / `#71D7F6` | Secondary accents, interactive hover highlights |
| **Primary Surface** | `var(--color-primary-surface)` / `#BEE9FF` | Secondary button bg, cart button bg, Best Seller badge bg |
| **Secondary (Accent)** | `var(--color-secondary)` / `#FCE35F` | Accent button, announcement bar, brand logo dot, -20% badge |
| **Secondary Light** | `var(--color-secondary-light)` / `#FFE680` | Soft promotional banners |
| **Tertiary (Main)** | `var(--color-tertiary)` / `#007EA3` | Secondary button text, Exclusive badge text |
| **Tertiary Surface** | `var(--color-tertiary-surface)` / `#B3EBFF` | Exclusive badge background |
| **Neutral Dark** | `var(--color-neutral-dark)` / `#191C1E` | Main headings, dark text, admin sidebar shell |
| **Neutral Muted** | `var(--color-neutral-muted)` / `#6E797F` | Secondary text, category tags, placeholders, specs |
| **Neutral Border** | `var(--color-neutral-border)` / `#E7E8EB` | Card borders, dividers, form input outlines |
| **Neutral Canvas** | `var(--color-neutral-bg)` / `#F8F9FC` | Storefront main canvas background |
| **Card Surface** | `var(--color-surface)` / `#FFFFFF` | Elevated cards, PDP panels, modals, drawers |
| **Success** | `var(--color-success)` / `#22C55E` | In-stock badges, New badge, free-shipping unlocked |
| **Error / Danger** | `var(--color-error)` / `#EF4444` | Sale badge, error alerts, out of stock |
| **Warning** | `var(--color-warning)` / `#F59E0B` | -20% badge, low stock alert (< 5 items) |

### 3. Surface & Geometry Rules

- **Cards & Modals**: `16px` border-radius (`rounded-xl`), subtle drop shadow (`shadow-sm` hover: `shadow-md`), `border border-neutral-border`.
- **Buttons & Inputs**: `8px` border-radius (`rounded-md`).
- **Pill Badges & Chips**: Fully rounded pill shapes (`rounded-full px-3 py-1`).

---

## Component Registry

### Layout Components (`components/layout/`)

#### 1. `AnnouncementBar.tsx`
- **Path**: `components/layout/AnnouncementBar.tsx`
- **Purpose**: Top promotional banner displaying free shipping thresholds (`৳ 999`), promo coupon codes, and store notices.
- **Visuals**: Light warm Secondary Surface (`#FFF3B3` / `bg-secondary-surface`) background, neutral dark (`#191C1E`) bold text, navigation arrows, and delivery truck icon.
- **Props**:
  ```typescript
  type Props = {
    message?: string;
    promoCode?: string;
    isActive?: boolean;
  };
  ```

#### 2. `Header.tsx`

File: `components/layout/Header.tsx`  
Last updated: August 25, 2026

| Property | Class |
| --- | --- |
| Background | `bg-white/95 backdrop-blur-md` (sticky header), `bg-surface` (search input container), `bg-neutral-bg/60` (dropdown strip) |
| Border | `border-b border-neutral-border` (`#E7E8EB`), `border border-neutral-border/50` (thumbnails) |
| Border radius | `rounded-full` (search bar container & submit button), `rounded-2xl` (predictive search dropdown), `rounded-lg` (result thumbnail) |
| Text — primary | `font-heading font-bold text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs text-neutral-muted` (`#6E797F`), `text-[10px]` uppercase tags |
| Spacing | `h-20` header height, `px-4 sm:px-6 lg:px-8` horizontal layout, `pl-5 pr-1.5 py-1.5` search bar |
| Hover state | `hover:bg-tertiary` (search button), `hover:bg-neutral-bg/60` (suggested items), `hover:text-primary` (nav icons) |
| Shadow | `shadow-xs` search input, `shadow-xl` autocomplete dropdown |
| Accent usage | `bg-primary text-white` search button, `bg-primary-surface text-primary` category tag, `bg-secondary-surface text-secondary-dark` badge |

**Pattern notes:**
- Streamlined full-width search bar without embedded category dropdown selector.
- Predictive search flyout features debounced suggestions, product thumbnail preview, category pill, discount badge, and `৳` price formatting.
- Cart counter uses `rounded-full bg-primary text-white text-[10px] font-bold`.

---

#### 3. `AdminSidebar.tsx`
- **Path**: `components/layout/AdminSidebar.tsx`
- **Purpose**: Left navigation sidebar for admin management panel.
- **Visuals**: Dark Slate (`#191C1E`) solid surface, active route indicator in Primary Blue (`#0A98C3`).
- **Props**:
  ```typescript
  type Props = {
    currentPath: string;
    pendingOrderCount?: number;
    lowStockCount?: number;
  };
  ```

---

#### 4. `CategoryNavBar.tsx`

File: `components/layout/CategoryNavBar.tsx`  
Last updated: August 25, 2026

| Property | Class |
| --- | --- |
| Background | `bg-white` (sticky bar), `bg-surface` (dropdowns & drawer), `bg-neutral-bg/60` (mega-menu footer) |
| Border | `border-b border-neutral-border` (`#E7E8EB`), `border border-neutral-border` (cards & drawers) |
| Border radius | `rounded-2xl` (`16px`) for hover subcategory cards & mega-menu, `rounded-xl` for category links, `rounded-full` for Deals Zone pill |
| Text — primary | `font-heading font-bold text-xs uppercase tracking-wider text-primary` (dropdown header), `font-bold text-xs text-neutral-dark` (links) |
| Text — secondary | `font-sans text-[10px] sm:text-xs text-neutral-muted` (`#6E797F`) |
| Spacing | `py-2` sticky bar padding, `p-4` subcategory flyout padding, `p-6` mega-menu padding |
| Hover state | `hover:bg-primary-surface/40` (subcategories), `hover:bg-tertiary` (menu trigger), `hover:bg-secondary-light` (deals button) |
| Shadow | `shadow-2xs` sticky bar, `shadow-xl` hover dropdown, `shadow-2xl` mega-menu panel |
| Accent usage | `bg-primary text-white` for Categories trigger, `bg-secondary text-neutral-dark` for Deals Zone pill button |

**Pattern notes:**
- Hover dropdown cards use a 160ms exit timeout to ensure smooth pointer navigation without accidental dismissal.
- Mega-menu displays a 4-column structured grid of all main departments with a Deals Zone callout strip.
- Mobile drawer incorporates collapsible accordions with animated chevron indicators.

---

#### 5. `CategoryCircles.tsx`

File: `components/storefront/CategoryCircles.tsx`  
Last updated: August 25, 2026

| Property | Class |
| --- | --- |
| Background | `bg-white` (circular icon container) |
| Border | `border border-neutral-border` (`#E7E8EB`) |
| Border radius | `rounded-full` (`w-18 h-18 sm:w-22 sm:h-22`) |
| Text — primary | `font-sans font-semibold text-[13px] text-neutral-dark` (`#191C1E`) |
| Text — secondary | `group-hover:text-primary` (`#0A98C3`) |
| Spacing | `py-2` section padding, `p-3.5` inner circle padding, `gap-4 sm:gap-8` grid gap |
| Hover state | `group-hover:scale-108 group-hover:shadow-md group-hover:border-primary/40` |
| Shadow | `shadow-xs` initial, `group-hover:shadow-md` |
| Accent usage | `group-hover:border-primary/40` |

**Pattern notes:**
- Exclusively displays the 5 main store departments: *Baby & Kids, Gift Combos, Digital Gadgets, Home Decor, Deals Zone*.
- Grid is centered (`max-w-4xl mx-auto`) with responsive `grid-cols-3 sm:grid-cols-5`.

---

#### 6. `Footer.tsx`
- **Path**: `components/layout/Footer.tsx`
- **Purpose**: Multi-column sitemap, newsletter signup with 8px radius input, trust icons, and payment badges.
- **Visuals**: Neutral dark surface (`bg-neutral-dark text-white`), clean typography.

---

### Storefront Components (`components/storefront/`)

#### 5. `HeroCarousel.tsx`
- **Path**: `components/storefront/HeroCarousel.tsx`
- **Purpose**: Dynamic homepage hero slider with autoplay, manual indicator dots, Baloo 2 Display headlines, and dual CTA buttons.
- **Visuals**: 24px radius container (`rounded-2xl`), rich gradient overlay, smooth slide transitions.

#### 6. `ProductCard.tsx`
- **Path**: `components/storefront/ProductCard.tsx`
- **Last updated**: 2026-08-29

| Property | Class / Token |
| :--- | :--- |
| **Card Background** | `bg-surface` (`#FFFFFF`), image container `bg-neutral-bg/60` |
| **Card Border** | `border border-neutral-border` (`#E7E8EB`) |
| **Border Radius** | Card: `rounded-2xl` (`16px`), Image & CTA button: `rounded-xl` (`12px`), Wishlist: `rounded-full` |
| **Text — Primary** | Title: `font-heading font-semibold text-[15px] text-neutral-dark`, Price: `font-sans font-bold text-[17px] text-neutral-dark` |
| **Text — Secondary** | Category & Strikethrough: `font-sans text-[12px] text-neutral-muted` |
| **Spacing** | Card: `p-3.5`, Content: `pt-3`, Category/Reviews: `mt-1`, Price: `mt-2.5`, Button: `mt-3` |
| **Interactive States** | Card: `hover:shadow-md`, Title: `hover:text-primary`, CTA: `bg-secondary hover:bg-secondary-light active:scale-[0.98] transition-all duration-150 ease-out` |
| **Shadow** | Card: `hover:shadow-md`, CTA: `shadow-xs hover:shadow-sm` |
| **Accent Usage** | Action CTA: `bg-secondary` (`#FCE35F`), Star Rating: `fill-amber-400 text-amber-400`, Wishlist: `text-rose-500` |

**Pattern notes:**
- Always place the **Category Name** and **RatingStars** on the same row with `flex items-center justify-between gap-2`.
- The **Add to Cart** action button spans the full width of the card bottom (`w-full h-9 rounded-xl`) with a snappy 150ms `ease-out` slide transition revealing the cart icon on hover.
- Props:
  ```typescript
  type Props = {
    product: Product;
    className?: string;
  };
  ```

#### 7. `ProductBadge.tsx`
- **Path**: `components/storefront/ProductBadge.tsx`
- **Purpose**: Reusable pill badges matching the design system:
  - `New`: `bg-success-light text-success` (`#DCFCE7` / `#22C55E`)
  - `Sale`: `bg-error-light text-error` (`#FEE2E2` / `#EF4444`)
  - `-20%`: `bg-warning-light text-warning` (`#FEF3C7` / `#F59E0B`)
  - `Best Seller`: `bg-primary-surface text-primary` (`#BEE9FF` / `#0A98C3`)
  - `Exclusive`: `bg-tertiary-surface text-tertiary` (`#B3EBFF` / `#007EA3`)
- **Props**:
  ```typescript
  type BadgeVariant = "new" | "sale" | "discount" | "bestseller" | "exclusive";
  type Props = {
    variant: BadgeVariant;
    label?: string;
    className?: string;
  };
  ```

#### 8. `Button.tsx`
- **Path**: `components/ui/Button.tsx`
- **Purpose**: Core button component supporting all 4 design system variants:
  - `primary`: `bg-primary text-white`
  - `secondary`: `bg-primary-surface text-tertiary`
  - `accent`: `bg-secondary text-neutral-dark`
  - `outline`: `bg-transparent border border-primary text-primary`
- **Props**:
  ```typescript
  type ButtonVariant = "primary" | "secondary" | "accent" | "outline";
  type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: "sm" | "md" | "lg";
  };
  ```

#### 9. `AlertBanner.tsx`
- **Path**: `components/ui/AlertBanner.tsx`
- **Purpose**: Feedback and notification banner:
  - `success`: "Your item has been added to cart!" (`#22C55E`)
  - `error`: "Something went wrong. Please try again." (`#EF4444`)
  - `warning`: "Limited stock! Only 5 items left." (`#F59E0B`)
  - `info`: "Free shipping on orders over ৳ 999." (`#0A98C3`)
- **Props**:
  ```typescript
  type AlertType = "success" | "error" | "warning" | "info";
  type Props = {
    type: AlertType;
    message: string;
    onClose?: () => void;
  };
  ```

#### 10. `CategoryHeader`
File: `components/storefront/CategoryHeader.tsx`  
Last updated: August 24, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-primary-surface/40` and `bg-secondary-surface/40` (ambient glow) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-neutral-border/60` (divider) |
| Border radius | `rounded-2xl` (`16px`) container, `rounded-full` for subcategory pill chips |
| Text — primary | `font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs text-neutral-muted` (`#6E797F`), breadcrumb links |
| Spacing | `p-5 sm:p-7` container padding, `gap-1.5` breadcrumb gap, `gap-2` chip gap |
| Hover state | `hover:text-primary` for breadcrumbs, `hover:bg-primary-surface/40` for inactive chips |
| Shadow | `shadow-xs` container & active chip |
| Accent usage | `bg-primary text-white` for active subcategory chip |

**Pattern notes:**
- Category header banner uses `rounded-2xl` with decorative ambient glow blurs in background.
- Subcategory navigation uses horizontal scrolling `rounded-full` pill chips.

---

#### 11. `FilterSidebar`
File: `components/storefront/FilterSidebar.tsx`  
Last updated: August 24, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg` (inputs & quick buttons), `bg-neutral-dark/40` (mobile backdrop) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-primary` (active age chip) |
| Border radius | `rounded-2xl` (`16px`) desktop container, `rounded-xl` (`12px`) age buttons & mobile CTA, `rounded-lg` inputs |
| Text — primary | `font-heading font-bold text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs uppercase tracking-wider text-neutral-muted` (section titles), `text-[10px]` subtext |
| Spacing | `p-5` desktop padding, `p-6` mobile drawer padding, `space-y-6` facet section gap |
| Hover state | `hover:border-primary/40`, `hover:text-primary` |
| Shadow | `shadow-xs` desktop card & mobile CTA, `shadow-2xl` mobile drawer |
| Accent usage | `bg-primary` apply button & quick price chips, `bg-primary-surface/60` active age chip, `accent-primary` for range slider & checkboxes |

**Pattern notes:**
- Desktop sidebar sticks to top viewport (`sticky top-24`).
- Age options use a 2-column grid of `rounded-xl` interactive cards.
- Dual price range inputs accept direct numeric input or quick price presets.

---

#### 12. `ProductToolbar`
File: `components/storefront/ProductToolbar.tsx`  
Last updated: August 24, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg` (selectors & toggle group) |
| Border | `border border-neutral-border` (`#E7E8EB`) |
| Border radius | `rounded-2xl` (`16px`) container, `rounded-xl` (`12px`) select inputs, `rounded-full` active filter badges |
| Text — primary | `font-bold text-neutral-dark` (`#191C1E`) count highlight |
| Text — secondary | `font-sans text-xs sm:text-sm text-neutral-muted` (`#6E797F`) |
| Spacing | `px-4 py-3 sm:px-5` container padding, `gap-3` toolbar items gap |
| Hover state | `hover:text-neutral-dark`, `hover:text-error` for chip dismiss `✕` |
| Shadow | `shadow-xs` |
| Accent usage | `text-primary` for active view switcher icon, `bg-primary-surface text-tertiary` for active filter badges, `bg-secondary-surface text-neutral-dark` for tag badges |

**Pattern notes:**
- Active filters automatically populate dismissable pill chips below the toolbar.
- View mode switcher toggles between 3-column Grid and single-column List views.

---

#### 13. `ProductListRow`
File: `components/storefront/ProductListRow.tsx`  
Last updated: August 24, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg/60` (thumbnail image area) |
| Border | `border border-neutral-border` (`#E7E8EB`) |
| Border radius | `rounded-2xl` (`16px`) card, `rounded-xl` (`12px`) image and add-to-cart button |
| Text — primary | `font-heading font-bold text-base sm:text-lg text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs text-neutral-muted` (`#6E797F`), `text-success` (delivery eligibility) |
| Spacing | `p-4` card padding, `gap-4` horizontal item gap |
| Hover state | `hover:shadow-md`, `hover:text-primary` title link, `hover:bg-tertiary` cart button |
| Shadow | `shadow-xs` initial, `hover:shadow-md` on hover |
| Accent usage | `bg-primary text-white` Add to Cart button, `bg-primary-surface/40 text-tertiary` age badge |

**Pattern notes:**
- Used when user selects List View mode in toolbar.
- Separates right-side pricing and CTA with vertical divider on desktop.

---

#### 14. `PLPClient`
File: `components/storefront/PLPClient.tsx`  
Last updated: August 24, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`) for empty state card |
| Border | `border border-neutral-border` (`#E7E8EB`) |
| Border radius | `rounded-2xl` (`16px`) empty state card, `rounded-xl` (`12px`) pagination buttons |
| Text — primary | `font-heading font-bold text-xl text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs sm:text-sm text-neutral-muted` (`#6E797F`) |
| Spacing | `space-y-6 sm:space-y-8` layout gap, `p-10 sm:p-14` empty state padding |
| Hover state | `hover:border-primary`, `hover:bg-neutral-bg` for pagination pills |
| Shadow | `shadow-xs` |
| Accent usage | `bg-primary text-white` for active page pill and empty state CTA |

#### 14. `PLPClient`
File: `components/storefront/PLPClient.tsx`  
Last updated: August 24, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`) for empty state card |
| Border | `border border-neutral-border` (`#E7E8EB`) |
| Border radius | `rounded-2xl` (`16px`) empty state card, `rounded-xl` (`12px`) pagination buttons |
| Text — primary | `font-heading font-bold text-xl text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs sm:text-sm text-neutral-muted` (`#6E797F`) |
| Spacing | `space-y-6 sm:space-y-8` layout gap, `p-10 sm:p-14` empty state padding |
| Hover state | `hover:border-primary`, `hover:bg-neutral-bg` for pagination pills |
| Shadow | `shadow-xs` |
| Accent usage | `bg-primary text-white` for active page pill and empty state CTA |

**Pattern notes:**
- Client orchestrator component combining FilterSidebar, ProductToolbar, ProductCard grid, and ProductListRow list.
- Renders empty state card with reset action when no products match active filters.

---

#### 15. `PDPImageGallery`
File: `components/storefront/PDPImageGallery.tsx`  
Last updated: August 30, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-surface/90 backdrop-blur-md` (floating controls), `bg-neutral-dark/70` (image counter badge) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-primary` (active thumbnail) |
| Border radius | `rounded-2xl` (`16px`) main container, `rounded-xl` (`12px`) thumbnail buttons, `rounded-full` controls |
| Text — primary | `font-sans text-xs text-white` (zoom indicator), `text-[11px] font-bold text-white` (image counter badge) |
| Text — secondary | `text-neutral-muted` (`#6E797F`), `text-error` (wishlisted) |
| Spacing | `aspect-square w-full` stage, `h-20 w-20` thumbnail size, `gap-3` thumbnail rail |
| Hover state | `scale-160` pan zoom on hover, `hover:scale-110` floating buttons & arrow navigators |
| Shadow | `shadow-xs` container & active thumbnail |
| Accent usage | `border-primary ring-2 ring-primary/20` for active thumbnail, `bg-primary-surface text-primary` badge |

**Pattern notes:**
- Main viewport includes cursor-following pan zoom magnifier without layout shift.
- Floating quick buttons provide instant Wishlist heart state and Share URL copy action.
- Left/Right arrow controls and floating `X / Y` photo counter badge for seamless multi-image browsing.
- Multi-image gallery with thumbnail navigation displaying all available product and variant images.
- Auto-advances active image every 3 seconds (`3000ms`) with smooth transitions; automatically pauses when hovering or zooming.

---

#### 16. `PDPBuyBox`
File: `components/storefront/PDPBuyBox.tsx`  
Last updated: August 29, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`) price card, `bg-secondary-surface/30` (curator card), `bg-primary-surface/30` (delivery bar) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-secondary/40` (curator card) |
| Border radius | `rounded-2xl` (`16px`) price box, `rounded-xl` (`12px`) curator card & variant chips, `rounded-md` (`8px`) buttons |
| Text — primary | `font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs text-neutral-muted` (`#6E797F`), `text-success` (in-stock) |
| Spacing | `p-4 sm:p-5` price card, `gap-2.5` CTA button grid, `p-3.5` delivery bar |
| Hover state | `hover:bg-tertiary` (Add to Cart), `hover:bg-secondary-light` (Buy Now), `hover:bg-[#20bd5a]` (WhatsApp) |
| Shadow | `shadow-xs` on cards and CTA buttons |
| Accent usage | `bg-primary` Add to Cart, `bg-secondary` Buy Now, `bg-[#25D366]` WhatsApp Order, `bg-warning-light text-warning` savings pill |

**Pattern notes:**
- Triple Action CTAs: Add to Cart (Sky Blue), Buy Now (Sunny Yellow), and 1-Click WhatsApp Order (Emerald Green).
- WhatsApp button pre-fills structured order details (Product, Variant, SKU, Quantity, Price, URL).
- Curator card presents editorial "Why We Love It" commentary.

---

#### 17. `PDPTabs`
File: `components/storefront/PDPTabs.tsx`  
Last updated: September 3, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`) card, `bg-neutral-bg/60` (tab bar & spec alternating rows), `bg-neutral-bg/40` (features & ratings background), `bg-neutral-bg/30` (empty reviews card) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-b-2 border-primary` (active tab), `border-dashed border-neutral-border` (empty reviews state) |
| Border radius | `rounded-2xl` (`16px`) container, `rounded-xl` (`12px`) review & specs cards, `rounded-lg` in-box items |
| Text — primary | `font-heading font-bold text-lg sm:text-xl text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs sm:text-sm text-neutral-muted` (`#6E797F`) |
| Spacing | `px-6 sm:px-8 py-4` tab buttons, `p-6 sm:p-8` content padding, `gap-3.5` spec rows, `space-y-4` review list |
| Hover state | `hover:text-neutral-dark hover:bg-surface/50` tab items, `hover:text-primary` helpful button, `hover:border-primary/30` review cards |
| Shadow | `shadow-xs` container, `shadow-2xs` individual review cards |
| Accent usage | `text-primary` active tab label & specs icons, `bg-secondary` 5-star rating distribution bar, `bg-success-light text-success` Verified Buyer badge |

**Pattern notes:**
- Streamlined 2-tab layout: **Product Description** (About, Features & Highlights, In the Box, Specifications) and **Customer Reviews** (Rating Score Breakdown, Star Bars, Verified Testimonials, Helpful Votes).
- Embeds `WriteReviewForm` above the rating score breakdown with purchase gating and optimistic real-time review list updates via `handleReviewSubmitted`.
- Computes dynamic live average rating score and 1–5 star histogram distribution from `reviewList`.
- Features dashed empty state card with `MessageSquareQuote` when product has 0 verified customer reviews.

---

#### 18. `PDPFrequentlyBoughtTogether`
File: `components/storefront/PDPFrequentlyBoughtTogether.tsx`  
Last updated: August 29, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg/60` (bundle summary card) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-primary/40` (selected card) |
| Border radius | `rounded-2xl` (`16px`) container, `rounded-xl` (`12px`) item cards & summary box, `rounded-md` checkbox |
| Text — primary | `font-heading font-bold text-lg sm:text-xl text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs text-neutral-muted` (`#6E797F`), `text-success` (bundle savings) |
| Spacing | `p-6 sm:p-8` container padding, `p-3` item card padding, `h-20 w-20 sm:h-24 sm:w-24` thumbnail size |
| Hover state | `hover:bg-tertiary` bundle CTA |
| Shadow | `shadow-xs` container, `shadow-2xs` item cards |
| Accent usage | `bg-primary` checkbox and CTA button, `bg-secondary-surface` 10% bundle savings tag |

**Pattern notes:**
- Dynamic bundle discount calculation (10% bundle discount when all combo items selected).
- Checkboxes permit toggling complementary items while preserving main product.

---

#### 19. `PDPStickyBar`
File: `components/storefront/PDPStickyBar.tsx`  
Last updated: August 29, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface/95 backdrop-blur-md` |
| Border | `border-t border-neutral-border` (`#E7E8EB`) |
| Border radius | `rounded-lg` (`8px`) mini thumbnail, `rounded-md` action buttons |
| Text — primary | `font-heading font-bold text-sm text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs text-primary font-bold` |
| Spacing | `px-4 py-3` bar padding, `h-12 w-12` mini thumbnail |
| Hover state | `hover:bg-tertiary` (Add to Cart), `hover:bg-[#20bd5a]` (WhatsApp) |
| Shadow | `shadow-lg` floating elevation |
| Accent usage | `bg-[#25D366]` WhatsApp icon pill, `bg-primary` Add to Cart |

**Pattern notes:**
- Floats at the bottom viewport when user scrolls past 450px.
- Provides immediate 1-click WhatsApp order and Add to Cart access from any scroll position.

---

### Cart & Checkout Components (`components/storefront/`)

#### 20. `FreeShippingBar`
File: `components/storefront/FreeShippingBar.tsx`  
Last updated: August 29, 2026

| Property | Class |
| --- | --- |
| Background | `bg-primary-surface/40` (in progress), `bg-success-surface` (unlocked) |
| Border | `border border-primary/20` (in progress), `border-success/30` (unlocked) |
| Border radius | `rounded-xl` (`12px`) container, `rounded-full` progress track |
| Text — primary | `font-heading font-bold text-xs sm:text-sm text-success` / `text-primary` |
| Text — secondary | `font-sans text-xs text-neutral-dark`, `text-[10px] text-neutral-muted` |
| Track / Fill | `bg-neutral-border/80` track; gradient `from-primary to-primary-light` (progress) & `from-success to-emerald-500` (unlocked) |
| Props | `show?: boolean` (default `true` for future admin toggle), `compact?: boolean` |

---

#### 21. `CartDrawer`
File: `components/storefront/CartDrawer.tsx`  
Last updated: August 29, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-dark/40 backdrop-blur-xs` (backdrop overlay) |
| Border | `border-l border-neutral-border` (`#E7E8EB`), `border-t border-neutral-border` (footer summary) |
| Border radius | `rounded-l-3xl` panel, `rounded-full` close icon, `rounded-2xl` item cards, `rounded-xl` checkout CTAs |
| Text — primary | `font-heading font-bold text-2xl text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs text-neutral-muted` (`#6E797F`), `text-success font-semibold` (free shipping milestone) |
| Animation | Framer Motion `AnimatePresence` with spring slide-in (`damping: 28, stiffness: 260`) and fade overlay |
| Shadow | `shadow-2xl` drawer panel, `shadow-xs` CTA buttons |
| CTAs | `bg-primary text-white` Proceed to Checkout (with lock icon), `text-primary` View Cart |

**Pattern notes:**
- Framer Motion `AnimatePresence` handles entry/exit transitions for both the darkened backdrop and sliding drawer panel.
- Product list supports interactive selection checkboxes with live subtotal and discount recalculations.
- Features dynamic free-shipping progress track with vehicle milestone indicator, 1-click coupon application card (`MIRAI10`), celebratory banner, and quick quantity stepper controls.

---

#### 22. `CartItemRow`
File: `components/storefront/CartItemRow.tsx`  
Last updated: August 29, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg` (thumbnail container) |
| Border | `border border-neutral-border` (`#E7E8EB`), `hover:border-neutral-border/80` |
| Border radius | `rounded-xl` (`12px`) card container, `rounded-lg` (`8px`) image thumbnail |
| Text — primary | `font-heading font-bold text-sm sm:text-base text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-[11px] text-neutral-muted`, `bg-primary-surface/40 text-tertiary` (variant badge) |
| Stepper | `QuantityStepper` (compact: `size="sm"`, page: `size="md"`) |
| Delete Action | `Trash2` icon with `hover:text-error hover:bg-error-surface` |

---

#### 23. `CartPageClient` (Full Cart Page)
File: `components/storefront/CartPageClient.tsx`  
Last updated: August 29, 2026

| Property | Class |
| --- | --- |
| Background | `bg-neutral-bg` (canvas), `bg-surface` (cards & sticky summary), `bg-secondary-surface/20` (gift wrap card) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-secondary/40` (gift wrap card) |
| Border radius | `rounded-2xl` (`16px`) for cards and summary container, `rounded-md` (`8px`) for inputs and CTAs |
| Text — primary | `font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-neutral-dark` |
| Text — secondary | `font-sans text-xs sm:text-sm text-neutral-muted` |
| Promo Input | Monospace uppercase code input with instant validation and quick suggestion pills (`MIRAI10`, `WELCOME50`, `FREESHIP`) |
| WhatsApp CTA | `bg-[#25D366] text-white` Order Entire Bag via WhatsApp with prefilled multi-item list |
| Trust Bar | Genuine Quality, 30-Day Easy Returns, Cash on Delivery nationwide |

#### 24. `CheckoutClient`
File: `components/storefront/CheckoutClient.tsx`  
Last updated: August 30, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (cards), `bg-neutral-bg` (body/trust strip), `bg-success-surface` (security badge), `bg-primary-surface/30` (active delivery zone) |
| Border | `border border-neutral-border/80` (cards), `border border-neutral-border/90` (pill inputs), `border-primary` (active delivery zone) |
| Border radius | `rounded-3xl` (cards), `rounded-full` (inputs, zone buttons, CTAs), `rounded-2xl` (thumbnails, trust badge container), `rounded-md` (quantity stepper) |
| Text — primary | `font-heading font-bold text-xl sm:text-2xl text-neutral-dark` |
| Text — secondary | `font-sans text-xs sm:text-sm text-neutral-muted` |
| Spacing | `p-6 sm:p-8` (card container padding), `space-y-4` (form rows), `px-5 py-3` (input padding) |
| Hover state | `hover:bg-secondary-light` (primary CTA), `hover:bg-tertiary` (links/back), `hover:bg-neutral-bg` (zone & stepper buttons) |
| Shadow | `shadow-xs` (cards), `shadow-md` (Place Order CTA) |
| Accent usage | `bg-secondary` (`#FCE35F`) for Place Order CTA, `text-primary` (`#0A98C3`) for grand totals & prices, `text-success` (`#22C55E`) for security lock |

**Pattern notes:**
- **Layout Partition**: 2-Column desktop grid (`lg:grid-cols-12`) with Billing Details on the left (`lg:col-span-6`) and Order Details + Payment Verification on the right (`lg:col-span-6`).
- **Billing Inputs**: Uses `rounded-full` pill inputs with clear required asterisks (`<span className="text-red-500 font-bold">*</span>`).
- **Delivery Zone Selector**: Segmented pill cards directly providing Inside Dhaka (৳80) and Outside Dhaka (৳120) with live free shipping evaluation at ৳ 3,000 threshold.
- **Order Details**: Clean inline table format with thumbnail, `[-] qty [+]` quantity stepper, line subtotals, and `✕` remove button.

#### 25. `CheckoutPaymentMethod`
File: `components/storefront/CheckoutPaymentMethod.tsx`  
Last updated: August 30, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (card body), `bg-primary` (header instructions banner), `bg-tertiary` (amount tag), `bg-[#FDF2F7]` (active bKash tab), `bg-[#FFF8EE]` (active Nagad tab) |
| Border | `border border-neutral-border` (card), `border-[#E2136E]` (bKash tab), `border-[#F7941D]` (Nagad tab) |
| Border radius | `rounded-2xl` (container & switcher tabs), `rounded-full` (inputs & badges), `rounded-lg` (copy button) |
| Text — primary | `font-heading font-bold text-lg sm:text-xl text-white` (header), `font-mono font-bold text-base sm:text-lg text-neutral-dark` (MFS numbers) |
| Text — secondary | `font-sans text-xs sm:text-sm text-white/90` (header instructions), `text-xs text-neutral-muted` (hints) |
| Spacing | `px-5 py-4` (banner padding), `p-5 sm:p-6` (body padding), `space-y-5` (card flow) |
| Hover state | `hover:bg-neutral-bg/60` (inactive tabs), `hover:bg-surface` (copy button) |
| Shadow | `shadow-xs` (card), `shadow-2xs` (badges) |
| Accent usage | Official bKash brand pink (`#E2136E`) and Nagad orange (`#F7941D`) vector SVGs, `bg-primary` (`#0A98C3`) header banner |

**Pattern notes:**
- **Official Logos**: 100% authentic vector SVGs embedded (`BkashLogo` with origami multi-facet bird and wordmark; `NagadLogo` with dual-color swirl and Bengali wordmark).
- **Payment Mode Toggle**: Radio cards for Cash on Delivery (Advance Delivery Charge Only) vs Full Payment with dynamic amount badge updates.
- **Copy Utility**: 1-click clipboard copy for MFS numbers with temporary checkmark and `"Copied"` confirmation.

### Auth & Customer Account Components

#### 20. `LoginForm`
File: `components/auth/LoginForm.tsx`  
Last updated: August 24, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-error-surface` (error banner) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-error/20` |
| Border radius | `rounded-2xl` (`16px`) for card container, `rounded-md` (`8px`) for inputs and buttons |
| Text — primary | `font-heading font-bold text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs text-neutral-muted` (`#6E797F`) |
| Spacing | `p-6 sm:p-8` container padding, `space-y-4` form gap, `px-3.5 py-2.5` input padding |
| Hover state | `hover:bg-tertiary` for primary button, `hover:bg-neutral-bg` for OAuth button |
| Shadow | `shadow-sm` |
| Accent usage | `bg-primary` (`#0A98C3`) submit button, `text-primary` for inline links |

**Pattern notes:**
- Authentication card containers always use `rounded-2xl` and `border-neutral-border`.
- All form inputs use `rounded-md` with `focus:ring-2 focus:ring-primary/20 focus:border-primary`.

---

#### 21. `RegisterForm` (Multi-Step & OTP Verification)
File: `components/auth/RegisterForm.tsx`  
Last updated: August 24, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-primary-surface` (OTP icon container) |
| Border | `border border-neutral-border` (`#E7E8EB`) |
| Border radius | `rounded-2xl` (`16px`), `rounded-md` (`8px`) |
| Text — primary | `font-heading font-bold text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs text-neutral-muted` (`#6E797F`) |
| Spacing | `p-6 sm:p-8` container padding, `py-3` OTP input padding |
| Hover state | `hover:bg-tertiary` for submit, `hover:underline` for resend |
| Shadow | `shadow-sm`, `shadow-xs` on buttons |
| Accent usage | `bg-primary` for action buttons, `font-mono tracking-[0.5em]` for 6-digit OTP code |

**Pattern notes:**
- Seamlessly transitions from Registration to OTP Verification Screen upon InsForge `requireEmailVerification`.
- OTP code input uses monospace bold centered font with wide tracking (`tracking-[0.5em]`).

---

#### 22. `AccountDashboardClient` (Customer Portal)
File: `components/account/AccountDashboardClient.tsx`  
Last updated: September 2, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`) for cards, `bg-[#e8f6fa]` (promo banner), `bg-neutral-bg` (canvas) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-[#cbe8f2]` (banner) |
| Border radius | `rounded-2xl` (`16px`) for primary cards & banner, `rounded-xl` (`12px`) for nested items |
| Text — primary | `font-heading font-bold text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs text-neutral-muted` (`#6E797F`) |
| Spacing | `p-5` card padding, `gap-4 sm:gap-6` grid spacing, `py-3.5` list row padding |
| Hover state | `hover:bg-neutral-bg/50` for order rows, `hover:underline` for action links |
| Shadow | `shadow-xs` on cards |
| Accent usage | `bg-[#1b6b93]` initials avatar, `bg-primary-surface/50 text-primary` for active navigation tab |

**Pattern notes:**
- Active tab state is bidirectionally synchronized with URL search parameter `?tab=` (`dashboard`, `orders`, `wishlist`, `reviews`, `addresses`, `payments`, `profile`, `password`, `notifications`).
- Uses Next.js App Router `useSearchParams()`, `usePathname()`, and `router.replace(url, { scroll: false })` with Suspense boundary in `app/(protectedRoutes)/account/page.tsx`.
- Default `"dashboard"` tab omits query string for clean `/account` root URL; browser back/forward navigation is handled via `useEffect` listener on `searchParams`.

---

#### 26. `OrderTrackingTimeline` (Fulfillment Progression Stepper)
File: `components/storefront/OrderTrackingTimeline.tsx`  
Last updated: September 1, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-primary-surface` (active ring/courier badge), `bg-neutral-bg` (estimated delivery pill) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-error/30` (cancelled banner) |
| Border radius | `rounded-2xl` (`16px`) container, `rounded-xl` (`12px`) cards & badges, `rounded-full` milestone nodes |
| Text — primary | `font-heading font-bold text-neutral-dark` (`#191C1E`), `text-primary` (`#0A98C3`) |
| Text — secondary | `font-sans text-xs text-neutral-muted` (`#6E797F`), `text-success` (`#22C55E`) |
| Spacing | `p-5 sm:p-7` container padding, `mt-8 pt-2` stepper layout |
| Hover state | `hover:text-neutral-dark` for 1-click tracking number copy |
| Shadow | `shadow-xs` container, `ring-4 ring-primary-surface` active pulse |
| Accent usage | `bg-success` for completed nodes, `bg-primary` for active node, `bg-error-surface` for cancelled orders |

**Pattern notes:**
- Adaptive responsive layout: Desktop horizontal connector line stepper and Mobile compact vertical timeline.
- Dynamic delivery estimates calculated automatically from order date and delivery zone (Inside Dhaka 1–2 days vs Outside Dhaka 2–4 days).
- Includes Consignment tracking number clipboard copy and Steadfast/Pathao courier identification.

---

#### 27. `TrackOrderClient` (Public Order Lookup Portal)
File: `components/storefront/TrackOrderClient.tsx`  
Last updated: September 1, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg` (inputs & FAQ cards), `bg-primary-surface` (hero pill) |
| Border | `border border-neutral-border` (`#E7E8EB`), `focus:border-primary` |
| Border radius | `rounded-3xl` (`24px`) search card, `rounded-xl` (`12px`) inputs & submit button |
| Text — primary | `font-heading font-extrabold text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs text-neutral-muted` (`#6E797F`), `font-mono` for order numbers |
| Spacing | `p-6 sm:p-8` search container, `gap-4` grid layout |
| Hover state | `hover:bg-tertiary` submit button, `hover:bg-[#20bd5a]` WhatsApp CTA |
| Shadow | `shadow-sm` search card, `shadow-xs` submit button |
| Accent usage | `bg-primary` for lookup CTA, `bg-[#25D366]` for WhatsApp help |

**Pattern notes:**
- Self-service public tracking lookup requiring Order Number + Phone/Email to protect customer privacy.
- Displays full order breakdown, live milestone tracker, FAQ accordion, and 1-tap WhatsApp support deep link.

---

#### 28. `OrderSuccessClient` (Celebratory Confirmation & Official Invoice Receipt)
File: `components/storefront/OrderSuccessClient.tsx`  
Last updated: September 1, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-success-surface` (success icon & advance badge), `bg-neutral-bg` (order ID box & due badge), `bg-secondary-surface/40` (gift wrap banner & ambient glow) |
| Border | `border border-success/30` (celebration card), `border border-neutral-border` (`#E7E8EB`), `border-neutral-border/60` (dividers) |
| Border radius | `rounded-3xl` (`24px`) celebration banner, `rounded-2xl` (`16px`) order chip, items summary & info cards, `rounded-xl` (`12px`) action CTAs |
| Text — primary | `font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-neutral-dark` (`#191C1E`), `font-mono font-extrabold text-primary` (order ID) |
| Text — secondary | `font-sans text-xs sm:text-sm text-neutral-muted` (`#6E797F`), `font-bold text-success` (free delivery / verified badge) |
| Spacing | `p-6 sm:p-10` celebration banner padding, `p-5 sm:p-7` summary card, `p-5` info cards, `gap-3.5` CTAs gap |
| Hover state | `hover:bg-tertiary` (Continue Shopping), `hover:bg-neutral-bg` (Track Order & Print Receipt), `hover:bg-[#20bd5a]` (WhatsApp) |
| Shadow | `shadow-sm` celebration card, `shadow-xs` itemized receipt & CTA buttons, `shadow-2xs` print receipt pill |
| Accent usage | `bg-primary` (`#0A98C3`) Continue Shopping CTA, `text-success` (`#22C55E`) checkmark, `bg-[#25D366]` WhatsApp CTA, `text-secondary` bounce sparkle |

**Pattern notes:**
- Full dual-mode layout: Rich interactive screen presentation with celebratory glows and structured clean PDF/print invoice layout (`print:hidden`, `print:block`).
- Integrated 1-click order number copy, instant printable receipt, live milestone stepper, advance vs doorstep COD balance breakdown, and prefilled WhatsApp support link.

---

#### 29. `QuantityStepper` (Compact & Standard Stepper)
File: `components/shared/QuantityStepper.tsx`  
Last updated: September 1, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`) container |
| Border | `border border-neutral-border` (`#E7E8EB`) |
| Border radius | `rounded-md` (`8px`) |
| Text — primary | `font-sans font-bold text-neutral-dark` (`#191C1E`) |
| Text — secondary | `disabled:opacity-30 disabled:hover:bg-transparent` |
| Spacing | `h-7 w-7` / `w-7` (compact `sm`), `h-9 w-9` / `w-9` (standard `md`) |
| Hover state | `hover:bg-neutral-bg` (plus / minus buttons) |
| Shadow | `shadow-2xs` |
| Accent usage | None (clean neutral design system controls) |

**Pattern notes:**
- Standardized numeric quantity incrementor used across Cart Drawer (`size="sm"`), Full Cart Page (`size="md"`), and Checkout Review (`size="sm"`).

#### 30. `CompareDock` (Floating Product Comparison Bar)
File: `components/shared/CompareDock.tsx`  
Last updated: September 1, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface/95 backdrop-blur-md` |
| Border | `border border-neutral-border` (`#E7E8EB`), dashed border on empty slots |
| Border radius | `rounded-2xl` (`16px`) dock container, `rounded-xl` (`12px`) thumbnail slots & CTA button |
| Text — primary | `font-heading font-bold text-sm text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-[11px] text-neutral-muted` (`#6E797F`) |
| Spacing | `p-3 sm:p-4` dock padding, `w-11 h-11 sm:w-12 sm:h-12` slot thumbnails |
| Hover state | `hover:bg-secondary-light` (CTA), `hover:bg-error-surface hover:text-error` (trash) |
| Shadow | `shadow-xl` floating dock elevation, `shadow-xs` CTA |
| Accent usage | `bg-secondary` (`#FCE35F`) for Compare Now button, `bg-primary-surface text-primary` scale icon |

**Pattern notes:**
- Persistent floating dock at bottom viewport when comparison queue has items.
- Displays slot progression up to 4 items with interactive remove `✕` overlays.

---

#### 31. `CompareClient` (Side-by-Side Product Comparison Matrix)
File: `components/storefront/CompareClient.tsx`  
Last updated: September 1, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg/40` (header row), `bg-secondary-surface/30` (highlighted difference rows) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-dashed` (empty slot card) |
| Border radius | `rounded-3xl` (`24px`) matrix table container, `rounded-2xl` (`16px`) thumbnails & empty slot |
| Text — primary | `font-heading font-extrabold text-2xl sm:text-3xl text-neutral-dark`, `font-bold text-lg sm:text-xl` (prices) |
| Text — secondary | `font-sans text-xs text-neutral-muted`, `text-primary font-bold text-[11px]` (category pills) |
| Spacing | `p-4 sm:p-5` matrix cell padding, `min-w-[220px]` product column width |
| Hover state | `hover:bg-tertiary` (Add to Cart), `hover:bg-[#20bd5a]` (WhatsApp), `hover:border-primary/60` (empty slot) |
| Shadow | `shadow-sm` matrix table, `shadow-xs` CTA buttons |
| Accent usage | `bg-primary` for Add to Cart, `bg-[#25D366]` for WhatsApp direct order, `bg-secondary-surface` for active spec diffs |

**Pattern notes:**
- Dynamic specification row generation extracting all unique JSONB keys from `products.specs`.
- Features "Highlight Differences" filter toggle and built-in interactive Product Picker Modal.

---

#### 32. `OrderDetailModal` (Customer Order Detail & Live Timeline Drawer)
File: `components/account/OrderDetailModal.tsx`  
Last updated: September 1, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg/40` (header/footer), `bg-primary-surface` (icon container) |
| Border | `border border-neutral-border` (`#E7E8EB`) |
| Border radius | `rounded-3xl` (`24px`) modal window, `rounded-2xl` (`16px`) inner section cards, `rounded-xl` (`12px`) CTAs |
| Text — primary | `font-heading font-extrabold text-lg text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs text-neutral-muted` (`#6E797F`), `font-bold text-success` (discounts & advance paid) |
| Spacing | `p-5 sm:p-6` modal padding, `space-y-6` content flow |
| Hover state | `hover:bg-neutral-bg` (close & copy triggers), `hover:text-primary` |
| Shadow | `shadow-2xl` modal backdrop elevation, `shadow-2xs` inner cards |
| Accent usage | Embeds `OrderTrackingTimeline`, `text-primary` for totals, `bg-[#25D366]` for WhatsApp help |

**Pattern notes:**
- Reuses `OrderTrackingTimeline.tsx` with dynamic delivery estimates, carrier consignment details, and `PaymentStatus | "partial"` support for cash-on-delivery advance payments.
- Itemized product breakdown with financial accounting (Subtotal, Zone Delivery Fee, Advance Paid, Cash Due on Doorstep).

#### 33. `AccountDashboardClient` (Customer Account Management Portal)
File: `components/account/AccountDashboardClient.tsx`  
Last updated: September 2, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-primary-surface/50` (active navigation link), `bg-neutral-bg` (hover/tab containers), `bg-error-surface` (logout hover) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-dashed` (empty state and add address triggers) |
| Border radius | `rounded-2xl` (`16px`) cards/containers, `rounded-xl` (`12px`) inputs & sub-cards, `rounded-lg` (`8px`) menu buttons, `rounded-full` avatars & chips |
| Text — primary | `font-heading font-bold text-2xl sm:text-3xl text-neutral-dark` (`#191C1E`), `text-[15px]` headings |
| Text — secondary | `font-sans text-xs text-neutral-muted` (`#6E797F`), `font-semibold text-primary` link buttons |
| Spacing | `p-4 sm:p-5 lg:p-6` panel padding, `gap-4 sm:gap-6` card grids, `space-y-6` view layout |
| Hover state | `hover:bg-neutral-bg` (nav items), `hover:text-primary` (breadcrumbs & actions), `hover:bg-error-surface hover:text-error` (logout) |
| Shadow | `shadow-xs` cards and stat containers |
| Accent usage | `bg-primary-surface text-primary` for active tabs & KPI icons, `bg-[#1b6b93]` avatar badge, `bg-secondary` for primary CTAs |

**Pattern notes:**
- Multi-tab unified customer control center (Dashboard KPI overview, Orders history with live tracking trigger, Wishlist, Reviews, Addresses, Payment methods, Profile & Security).
- Integrates seamlessly with `OrderDetailModal.tsx` and database order mapping via `mapOrderRecordToCustomerOrder`.
- Follows token conventions: `rounded-2xl` for primary card surfaces and `rounded-lg` for interactive menu items.

---

#### 34. `WriteReviewForm` (Customer Verified Review Gating & Submission)
File: `components/storefront/WriteReviewForm.tsx`  
Last updated: September 3, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-primary-surface/30` (header toggle), `bg-primary-surface/20` (sign-in prompt), `bg-warning-surface` (purchase prompt), `bg-success-light/30` (already-reviewed card) |
| Border | `border border-primary/30` (active form card), `border border-primary/25` (sign-in prompt), `border border-warning/40` (purchase prompt), `border border-success/30` (already-reviewed card), `border border-neutral-border` (`#E7E8EB`) |
| Border radius | `rounded-2xl` (`16px`) for gating prompt cards, `rounded-xl` (`12px`) outer form card, inputs, textarea & CTAs, `rounded-lg` secondary button, `rounded-full` pill badges & star wrappers |
| Text — primary | `font-heading font-bold text-neutral-dark` (`#191C1E`) |
| Text — secondary | `font-sans text-xs sm:text-sm text-neutral-muted` (`#6E797F`), `text-success` (`#22C55E`) Verified Buyer badge |
| Spacing | `p-5 sm:p-6` card padding (`p-6 sm:p-7` sign-in card), `space-y-5` form rows, `gap-3` star picker |
| Hover state | `hover:bg-tertiary active:scale-95` (sign-in & CTAs), `hover:bg-primary-light` (publish button), `hover:scale-110` (rating stars) |
| Shadow | `shadow-2xs` card containers, `shadow-xs` buttons & badge icons |
| Accent usage | `text-secondary` (`#FCE35F`) for interactive rating stars, `bg-primary` for publish CTA & lock icon, `bg-success-light text-success` for Verified Buyer badge, `bg-warning text-white` for purchase prompt badge |

**Pattern notes:**
- Strict verification gating: dynamically renders 4 distinct visual states based on customer auth and order history:
  1. **Unauthenticated**: Centered `bg-primary-surface/20` card with lock badge prompting sign-in.
  2. **Non-buyer**: Alert `bg-warning-surface` card explaining genuine purchase requirement with "Purchase Now" and "Check My Orders" actions.
  3. **Already Reviewed**: Celebratory `bg-success-light/30` card displaying their existing rating, title, and feedback quote.
  4. **Eligible Verified Buyer**: Expandable accordion card (`rounded-xl border-primary/30`) with live star selector (1–5) and headline/body inputs.
- Integrates with PostHog `review_submitted` and triggers revalidation upon submission.

---

## Component Usage Rules

1. **Named Exports Only**: Always use named exports (`export function ComponentName()`), never default exports.
2. **Dedicated Props Type**: Always define `type Props = { ... }` directly above the component declaration.
3. **No Hardcoded Hex Colors**: Use Tailwind utility classes with Mirai Mart design tokens (e.g. `bg-primary`, `bg-secondary`, `text-neutral-dark`, `border-neutral-border`).
4. **Currency Format**: Always format currency using Bangladeshi Taka (`৳ [amount]`).
5. **Server vs Client Boundary**: Components requiring hooks (`useState`, `useEffect`) or browser event listeners must declare `"use client"` at the top. Pure presentation components remain Server Components.



