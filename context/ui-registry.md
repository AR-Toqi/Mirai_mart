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
- **Storefront Desktop Container**: `1440px` max-width (`max-w-7xl` / `--container-7xl: 1440px`), centered with `mx-auto px-4 sm:px-6 lg:px-8`.

---

## Component Registry

### Layout Components (`components/layout/`)

#### 1. `AnnouncementBar.tsx`
- **Path**: `components/layout/AnnouncementBar.tsx`
- **Last updated**: September 17, 2026
- **Purpose**: Top promotional banner displaying dynamic free shipping thresholds, promo coupon codes, and rotating store notices.
- **Visuals**: Sunny Yellow Secondary (`bg-secondary`, `#FCE35F`) background with subtle bottom border (`border-secondary/40`), neutral dark (`#191C1E`) typography, delivery truck icon, high-contrast dark promo badge (`bg-neutral-dark text-secondary px-2 py-0.5 rounded-md`), and interactive carousel navigation buttons.
- **Props**:
  ```typescript
  type Props = {
    announcement?: StorefrontContentConfig["announcement"];
  };
  ```
- **Pattern notes**:
  - Automatically hidden if `announcement.isActive === false`.
  - Primary promotional slide renders custom CMS text alongside a high-contrast coupon code badge pill.
  - Automatically rotates across announcement slides every 5 seconds; automatically pauses on mouse hover.

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

#### 5. `HeroBanner.tsx` (Full-Width Background 3-Slide Carousel & Trust Strip)

File: `components/storefront/HeroBanner.tsx`  
Last updated: September 5, 2026

| Property | Class |
| --- | --- |
| Background | `bg-neutral-dark` (banner container shell), `bg-surface` (trust value strip), `bg-primary` (primary CTA button), `bg-white/95` (secondary CTA button), `bg-primary-surface` (trust icon badges), `bg-neutral-dark/40 backdrop-blur-md` (indicator pill) |
| Border | `border border-neutral-border` (`#E7E8EB`, banner frame & trust strip), `border border-white/20` (dots pill), `border border-neutral-border` (secondary CTA button) |
| Border radius | `rounded-3xl` (`24px`, main banner container), `rounded-2xl` (`16px`, trust value strip), `rounded-xl` (`12px`, CTA buttons & trust icon badges), `rounded-full` (dots & indicator pill) |
| Text — primary | `font-sans font-semibold text-sm sm:text-base text-white` (primary CTA), `font-sans font-medium text-sm sm:text-base text-neutral-dark` (secondary CTA), `font-sans font-bold text-xs text-neutral-dark` (trust perk headings) |
| Text — secondary | `text-[11px] text-neutral-muted` (`#6E797F`, trust perk descriptions) |
| Spacing | `h-[280px] sm:h-[360px] lg:h-[420px]` (responsive banner height), `space-y-6` (vertical section stack), `px-6 sm:px-8 py-3 sm:py-3.5` (button padding), `gap-3.5` (button gap), `p-5` (trust strip padding), `gap-4` (trust grid gap) |
| Hover state | `hover:bg-tertiary hover:shadow-xl` (primary CTA), `hover:bg-white hover:shadow-xl` (secondary CTA), `active:scale-98` (button press micro-interaction), `hover:bg-white` (inactive dot hover) |
| Shadow | `shadow-sm` (banner container), `shadow-lg hover:shadow-xl` (CTA buttons), `shadow-2xs` (trust strip), `shadow-xs` (indicator pill) |
| Accent usage | `bg-primary text-white` for primary CTA button & active slide dot, `bg-primary-surface text-primary` for trust perk icon badges |

**Pattern notes:**
- **Standard Height**: Standardized to `h-[280px] sm:h-[360px] lg:h-[420px]` across mobile, tablet, and desktop (1440px container) to preserve optimal above-the-fold visibility for product rails.
- **Clean Interface**: No hover arrow navigation buttons. Autoplay runs on a 3-second interval and pauses on mouse enter (`setIsPaused(true)`). Manual navigation is driven by the 3 bottom-centered pill dots.
- **CTA Actions**: Vertically and horizontally centered overlay (`absolute inset-0 flex items-center justify-center pointer-events-none`) with interactive buttons wrapped in `pointer-events-auto`.
- **Integrated Trust Value Strip**: Standard 3-perk grid below banner (`Free Shipping`, `Easy Returns`, `Secure Payment`) reinforces customer confidence using `bg-primary-surface text-primary` token badges.

**Props:**
```typescript
type Props = {
  content?: StorefrontContentConfig["hero"];
};
```

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
Last updated: September 10, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-surface/90 backdrop-blur-md` (floating controls), `bg-neutral-dark/85 backdrop-blur-md` (watch video button), `bg-neutral-dark/90 backdrop-blur-md` (video modal backdrop), `bg-neutral-dark` (video player frame) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-primary` (active thumbnail ring), `border-white/20` (video pill badge), `border-white/10` (lightbox modal) |
| Border radius | `rounded-2xl` (`16px`) main stage container & video modal, `rounded-xl` (`12px`) thumbnail buttons & video tile, `rounded-full` controls & watch video badge |
| Text — primary | `font-sans text-xs text-white` (zoom & watch video), `text-[11px] font-bold text-white` (image counter badge) |
| Text — secondary | `text-neutral-muted` (`#6E797F`), `text-error` (wishlisted) |
| Spacing | `aspect-square w-full max-h-[540px] max-w-[580px]` stage, `h-13 w-13 sm:h-14 sm:w-14` (56px) compact thumbnail rail, `gap-2.5 sm:gap-3` thumbnail gap, `max-w-4xl aspect-video` modal player |
| Hover state | `scale-160` pan zoom on hover, `hover:scale-110` floating buttons & arrow navigators, `hover:scale-105 active:scale-95` watch video trigger |
| Shadow | `shadow-xs` container & active thumbnail, `shadow-2xl` video lightbox modal |
| Accent usage | `border-primary ring-2 ring-primary/25 scale-102` for active thumbnail, `bg-primary text-white` play icon on video thumbnail, `bg-primary-surface text-primary` badge |

**Pattern notes:**
- Main viewport includes cursor-following pan zoom magnifier without layout shift.
- Floating quick buttons provide instant Wishlist heart state, Share URL copy action, and full-screen "Watch Video" trigger button.
- Thumbnails rail features compact 56px (`h-13 w-13 sm:h-14 sm:w-14`) tiles with smooth horizontal overflow scrolling, preserving base product photos alongside variant photos.
- Thumbnails rail seamlessly incorporates a dedicated video thumbnail tile (with play badge) whenever `videoUrl` is provided.
- Full-screen Video Lightbox Modal opens on click with smooth entrance animation (`animate-in fade-in duration-200`), ESC key listener, outside click to close, and responsive 16:9 iframe/video embeds (supporting YouTube, YouTube Shorts, Vimeo, and direct MP4).
- Variant Synchronization: Instantly switches the active main viewport to the chosen variant's photo upon selection.
- Decoupled Auto-Slide: Auto-advances active image every 3 seconds (`3000ms`); seamlessly pauses on hover, zoom, or when a user interactively selects a variant.

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

#### 21. `CartDrawer` (Slide-Over Cart Drawer & Quick Promo Engine)
File: `components/storefront/CartDrawer.tsx`  
Last updated: September 16, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-dark/40 backdrop-blur-xs` (backdrop overlay), `bg-success-surface` (active coupon card & celebratory banner), `bg-warning-surface` (inactive coupon card), `bg-primary-surface/30` (quick suggestion pill) |
| Border | `border-l border-neutral-border` (`#E7E8EB`), `border-t border-neutral-border` (footer summary), `border border-neutral-border` (item cards & inputs), `border-success/30` (active coupon & free shipping banner), `border-warning/30` (inactive coupon) |
| Border radius | `rounded-l-3xl` drawer panel, `rounded-2xl` item cards, `rounded-xl` coupon cards, free shipping banner, inputs & checkout CTAs, `rounded-lg` stepper & suggestion pills, `rounded-full` close icon & progress bar |
| Text — primary | `font-heading font-bold text-2xl text-neutral-dark` (`#191C1E`), `font-sans font-bold text-sm sm:text-base text-neutral-dark` (prices) |
| Text — secondary | `font-sans text-xs sm:text-sm text-neutral-muted` (`#6E797F`), `text-success font-semibold` (free shipping milestone & discount), `text-warning-foreground` (inactive coupon header) |
| Spacing | `px-6 pt-6 pb-4` header padding, `px-6 py-2` items scroll area, `px-6 pt-4 pb-6` footer summary, `gap-3.5` card layout |
| Hover state | `hover:bg-neutral-bg` (close & stepper buttons), `hover:bg-tertiary` (Checkout CTA), `hover:bg-primary-surface/40` (View Cart), `hover:text-error hover:bg-error-surface` (trash icon & coupon remove) |
| Animation | Framer Motion `AnimatePresence` with spring slide-in (`damping: 28, stiffness: 260`) and fade overlay |
| Shadow | `shadow-2xl` drawer panel, `shadow-xs` CTAs, `shadow-2xs` item cards & apply button |
| Accent usage | `bg-primary text-white` (Proceed to Checkout with lock icon & active item checkboxes), `bg-primary-surface text-primary` (empty cart icon), `text-success` (unlocked free delivery) |

**Pattern notes:**
- Framer Motion `AnimatePresence` handles spring slide-in and backdrop fade with locked body scroll and ESC key dismissal.
- Dedicated promo code input form with `Tag` prefix icon, uppercase formatting, inline error/success feedback, and 1-click `MIRAI10` quick apply pill.
- Supports dual coupon presentation: Active state (`bg-success-surface border-success/30 text-success`) with discount calculation and Inactive state (`bg-warning-surface border-warning/30 text-warning-foreground`) alerting customer to spend threshold deficit.
- Dynamic free shipping progress track with milestone truck indicator and celebratory alert banner upon unlock.

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
Last updated: September 16, 2026

| Property | Class |
| --- | --- |
| Background | `bg-neutral-bg` (canvas), `bg-surface` (cards, items & sticky summary), `bg-secondary-surface/20` (gift wrap card), `bg-success-surface` (active coupon badge), `bg-warning-surface` (inactive coupon spend warning), `bg-neutral-bg/60` (trust strip) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-secondary/40` (gift wrap card), `border-success/20` (active coupon), `border-warning/30` (inactive coupon) |
| Border radius | `rounded-2xl` (`16px`) for cards, gift card & summary container, `rounded-xl` (`12px`) for gift message input & trust strip, `rounded-lg` (`8px`) for coupon badges, `rounded-md` (`8px`) for inputs and CTAs, `rounded-full` quick suggestion pills |
| Text — primary | `font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-neutral-dark` (headings), `font-sans font-bold text-base` (grand total) |
| Text — secondary | `font-sans text-xs sm:text-sm text-neutral-muted`, `text-success` (free shipping, active discount & coupon tags), `text-warning-foreground` (inactive coupon warning) |
| Spacing | `py-8 sm:py-12` page padding, `gap-8` 2-column grid layout, `p-5 sm:p-6` cards padding, `space-y-3.5` list items, `space-y-3` cost breakdown |
| Hover state | `hover:bg-tertiary` (primary CTA), `hover:bg-secondary-light` (gift combos CTA), `hover:bg-[#20bd5a]` (WhatsApp), `hover:text-error hover:bg-error-surface` (clear cart & delete actions), `hover:text-primary` (breadcrumbs & product titles) |
| Shadow | `shadow-sm` (sticky order summary), `shadow-xs` (cards & CTAs), `shadow-2xs` (gift wrap card) |
| Accent usage | `bg-primary text-white` (Proceed to Checkout CTA), `bg-secondary text-neutral-dark` (Gift Combos CTA), `bg-[#25D366] text-white` (1-Click WhatsApp Order), `bg-primary-surface/60 text-tertiary` (quick coupon pills) |

**Pattern notes:**
- Comprehensive 2-column storefront cart experience (8 cols line items & gift options, 4 cols sticky order summary).
- Active coupon banner displays code in uppercase with `Tag` icon, `text-success`, dynamic discount or "(Free Delivery)" label, and 1-click `✕` remove button.
- Inactive coupon state gracefully alerts users when subtotal drops below `minOrderValue` (`bg-warning-surface text-warning-foreground`) prompting `(Add ৳ X more)` without silently dropping user's coupon choice.
- Luxury gift wrapping card (`bg-secondary-surface/20 border-secondary/40`) with animated accordion textarea (250 char limit counter) and embossed Mirai Mart note reminder.
- Direct WhatsApp multi-item bag export link with pre-formatted product list, gift options, coupon code, delivery fee, and grand total.

---

#### 24. `CheckoutClient`
File: `components/storefront/CheckoutClient.tsx`  
Last updated: September 16, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (cards), `bg-neutral-bg` (body/trust strip), `bg-success-surface` (security badge), `bg-primary-surface/30` (active delivery zone), `bg-warning-surface/50` (inactive coupon banner) |
| Border | `border border-neutral-border/80` (cards), `border border-neutral-border/90` (pill inputs), `border-primary` (active delivery zone), `border-warning/20` (inactive coupon callout) |
| Border radius | `rounded-3xl` (cards), `rounded-full` (inputs, zone buttons, CTAs), `rounded-2xl` (thumbnails, trust badge container), `rounded-lg` (inactive coupon pill), `rounded-md` (quantity stepper) |
| Text — primary | `font-heading font-bold text-xl sm:text-2xl text-neutral-dark` |
| Text — secondary | `font-sans text-xs sm:text-sm text-neutral-muted`, `text-success font-bold` (applied discount), `text-warning-foreground font-semibold` (inactive coupon) |
| Spacing | `p-6 sm:p-8` (card container padding), `space-y-4` (form rows), `px-5 py-3` (input padding) |
| Hover state | `hover:bg-secondary-light` (primary CTA), `hover:bg-tertiary` (links/back), `hover:bg-neutral-bg` (zone & stepper buttons) |
| Shadow | `shadow-xs` (cards), `shadow-md` (Place Order CTA) |
| Accent usage | `bg-secondary` (`#FCE35F`) for Place Order CTA, `text-primary` (`#0A98C3`) for grand totals & prices, `text-success` (`#22C55E`) for security lock |

**Pattern notes:**
- **Layout Partition**: 2-Column desktop grid (`lg:grid-cols-12`) with Billing Details on the left (`lg:col-span-6`) and Order Details + Payment Verification on the right (`lg:col-span-6`).
- **Billing Inputs**: Uses `rounded-full` pill inputs with clear required asterisks (`<span className="text-red-500 font-bold">*</span>`).
- **Delivery Zone Selector**: Segmented pill cards directly providing Inside Dhaka (৳80) and Outside Dhaka (৳120) with live free shipping evaluation at ৳ 3,000 threshold.
- **Order Details**: Clean inline table format with thumbnail, `[-] qty [+]` quantity stepper, line subtotals, and `✕` remove button.
- **Coupon Synchronization**: Displays active coupon discount line item or amber warning callout (`bg-warning-surface/50 border-warning/20`) when subtotal is below minimum spend threshold.

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

#### 31. `MiraiMartLogo` (Brand Logo & Monogram Vector Mark)
File: `components/shared/MiraiMartLogo.tsx`  
Last updated: September 6, 2026

| Property | Class / Value |
| --- | --- |
| Fill — primary monogram | `#0A98C3` (`--color-primary`) |
| Fill — highlight facets | `#71D7F6` (`--color-primary-light`), `#BEE9FF` (`--color-primary-surface`) |
| Fill — shadow facets | `#087A9C` (deep primary) |
| Fill — brand accent dot | `#FCE35F` (`--color-secondary`), `#FFE680` border stroke |
| Typography (`variant="full"`) | `font-heading font-bold text-xl tracking-tight text-neutral-dark`, `text-primary` ("Mart") |
| Sizing | `size` prop (default `28`), `h-7 w-auto aspect-square` |
| Variants | `mark` (isometric 3D M vector + yellow dot), `full` (vector + typography), `image` (`/mirai-mart_logo.png`) |

**Pattern notes:**
- Official reusable vector logo mark matching `architecture.md` specification.
- Used in Admin screens, Navigation headers, and Brand identity lockups.

---

#### 32. `CompareClient` (Side-by-Side Product Comparison Matrix)
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

#### 35. `AdminSidebar` (Admin Navigation Shell & Bottom Actions)
File: `components/layout/AdminSidebar.tsx`  
Last updated: September 4, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-primary/10` (active link), `hover:bg-neutral-bg` (hover state) |
| Border | `border-r border-neutral-border` (`#E7E8EB`), `border-b border-neutral-border/50` (header divider), `border-t border-neutral-border/60` (bottom action bar) |
| Border radius | `rounded-xl` (`12px`) for navigation items, Visit Store link, and Sign Out button |
| Text — primary | `text-primary font-semibold` (active tab), `text-neutral-dark font-medium` (links) |
| Text — secondary | `text-neutral-muted` (inactive icons & labels), `text-error` (sign out button) |
| Spacing | `w-64` fixed sidebar width, `h-20` brand header height, `p-4` navigation padding, `space-y-1.5` link stack |
| Hover state | `hover:bg-neutral-bg hover:text-neutral-dark` (nav links), `hover:bg-error-surface` (sign out) |
| Shadow | `shadow-2xs` active tab indicator |
| Accent usage | `text-primary` active indicator & Visit Store icon, `text-error` for Sign Out action |

**Pattern notes:**
- Exact match to `Admin_Dashboard.png`: brand logo, active Dashboard pill, Products, Categories, Customers, Analytics, Promo Codes, Website Content, and Settings.
- Replaced "Help & Support" with dedicated "Visit Store" (`/`) external link and authenticated "Sign Out" button.

---

#### 36. `AdminTopBar` (Admin Header & Notification Strip)
File: `components/layout/AdminTopBar.tsx`  
Last updated: September 4, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-surface` (dropdown flyouts) |
| Border | `border-b border-neutral-border` (`#E7E8EB`), `border border-neutral-border` (pills & cards) |
| Border radius | `rounded-xl` (date picker & notification trigger), `rounded-full` (admin profile pill & avatar), `rounded-2xl` (flyout modals) |
| Text — primary | `font-heading font-bold text-2xl text-neutral-dark` (greeting) |
| Text — secondary | `text-xs text-neutral-muted` (subtext & timestamps), `text-success` (verified badge) |
| Spacing | `h-20` top bar height, `px-6` horizontal padding, `gap-3 sm:gap-4` right controls |
| Hover state | `hover:bg-neutral-bg` (dropdown items & control buttons) |
| Shadow | `shadow-2xs` interactive pills, `shadow-xl` dropdown menus |
| Accent usage | `bg-error text-white` unread notification count badge (`3`), `text-primary` date icon |

**Pattern notes:**
- Features "Dashboard 👋" headline, interactive Date Range selector (`May 12 – May 18, 2024`), Notification Bell flyout, and Admin Avatar Profile pill.

---

#### 37. `AdminDashboardClient` (Storefront KPIs, Analytics Curves & Paginated Feeds)
File: `components/admin/AdminDashboardClient.tsx`  
Last updated: September 4, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-primary-surface`, `bg-success-surface`, `bg-secondary-surface`, `bg-warning-surface`, `bg-tertiary-surface` (KPI icon containers), `bg-neutral-bg` (canvas) |
| Border | `border border-neutral-border` (`#E7E8EB`) for all cards and table rows |
| Border radius | `rounded-2xl` (`16px`) for KPI cards, chart containers, tables, and gauges, `rounded-xl` for inner badges & inputs |
| Text — primary | `font-sans font-bold text-2xl text-neutral-dark` (KPI figures), `font-heading font-bold text-lg text-neutral-dark` (card headers) |
| Text — secondary | `text-xs font-medium text-neutral-muted`, `text-success font-semibold` (growth percentages) |
| Spacing | `gap-4 sm:gap-6` card grids, `p-5 to p-6` card padding, `py-3` table rows |
| Hover state | `hover:shadow-md transition-shadow` (cards), `hover:bg-neutral-bg/60` (table rows) |
| Shadow | `shadow-xs hover:shadow-md` cards, `shadow-2xs` quick actions |
| Accent usage | `var(--color-primary)` (Sales Overview spline curve & Website channel), `var(--color-success)` (Delivered status & Facebook channel), `var(--color-tertiary)` (Revenue & Instagram channel), `var(--color-warning)` (In Stock / Others channel) |

**Pattern notes:**
- Admin dashboard layout: 5 top KPI cards (Total Sales, Orders, Customers, Products, Total Revenue), broad full-width Sales Overview interactive analytics canvas (12 cols) with timeframe switcher tabs (7 Days, 30 Days, 12 Months), KPI metrics ribbon, spline curves with soft area gradient fill and floating interactive tooltips; followed by a balanced 3-card operational grid (Top Selling Products 4 cols, Sales by Channel 4 cols, Inventory Summary 4 cols), and Website Content quick card. (Recent Orders and New Customers removed per UI correction).

---

#### 38. `WebsiteContentManager` (Storefront Hero Banner & Top Announcement CMS)
File: `components/admin/WebsiteContentManager.tsx`  
Last updated: September 4, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-secondary` (announcement preview), `bg-neutral-dark` (hero preview container) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border border-primary/50` (selected preset) |
| Border radius | `rounded-2xl` (`16px`) section containers & preview cards, `rounded-xl` (`12px`) inputs & action buttons, `rounded-full` active toggle |
| Text — primary | `font-heading font-bold text-2xl text-neutral-dark`, `font-heading font-bold text-2xl sm:text-3xl text-white` (hero preview headline) |
| Text — secondary | `text-xs text-neutral-muted`, `text-white/80` (hero preview subtext) |
| Spacing | `space-y-6 sm:space-y-8` sections, `p-6` panel padding, `gap-4` form grids |
| Hover state | `hover:bg-tertiary` (save CTA), `hover:bg-neutral-bg` (preview CTA) |
| Shadow | `shadow-xs` containers, `shadow-inner` announcement preview |
| Accent usage | `bg-secondary text-neutral-dark` for announcement bar, `bg-primary text-white` for Publish CTA & primary hero button |

**Pattern notes:**
- Dedicated tab requested by developer to control storefront hero banner image/headlines, custom image design uploads, button visibility toggles, and the top announcement promotional bar.
- Includes a dedicated drag-and-drop custom image upload dropzone specifying recommended dimensions (`1200 × 800 px` or 16:9 / 4:3) and maximum file size (`up to 5 MB`) with client-side & server-side validation.
- Features tactile iOS-style switchbars (`Active` vs `Disabled`) for both Primary and Secondary Hero CTA buttons, instantly updating the live preview and storefront.
- Supports 4 curated preset image selectors plus custom image URL inputs, file-backed persistence (`data/storefront-content.json`), and triggers Next.js path cache revalidation on save.

---

#### 39. `AdminProductsClient`, `AdminProductFilters` & `AdminProductTable` (Product Catalog CMS & Data Grid)
File: `components/admin/AdminProductsClient.tsx`, `components/admin/AdminProductFilters.tsx`, `components/admin/AdminProductTable.tsx`  
Last updated: September 6, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg` (canvas & table hover) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-b border-neutral-border/80` (rows) |
| Border radius | `rounded-2xl` (`16px`) table container & search box, `rounded-xl` (`12px`) action buttons & inputs, `rounded-full` status badges |
| Text — primary | `font-heading font-bold text-2xl sm:text-3xl text-neutral-dark`, `font-sans font-bold text-sm sm:text-base` (pricing) |
| Text — secondary | `font-sans text-xs sm:text-sm text-neutral-muted`, `font-mono text-xs` (SKU badges) |
| Status badges | `bg-success-light text-success` (Active), `bg-neutral-muted/15 text-neutral-muted` (Draft) |
| Stock indicators | `text-error font-bold` (0 Out of Stock), `text-warning font-bold` (1-5 Low Stock), `text-neutral-dark font-bold` (In Stock) |
| Action buttons | `bg-primary hover:opacity-95 text-white` (+ Add New Product), `hover:text-primary` (Edit pencil), `hover:bg-error-surface text-error` (Delete) |
| Props | `filters`, `onFilterChange`, `onResetFilters`, `products`, `onToggleStatus`, `onDeleteClick` |

**Pattern notes:**
- Modeled directly after `Product_screen.jpeg` with responsive search bar, category dropdown, filter drawer toggle, and stock/badge/price filters.
- Supports optimistic Active/Draft status toggling, optimistic deletion with confirmation modal, and client-side pagination.
- Currency formatted with Bangladeshi Taka symbol (`৳ [amount]`).

---

#### 40. `ProductForm` (Add New & Edit Product Form with Sticky Live Preview)
File: `components/admin/ProductForm.tsx`  
Last updated: September 10, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg` (canvas), `bg-primary-surface/40` (preview badges & info callouts), `bg-primary-surface/30` (active dropzone drag-over), `bg-primary-surface/15` (option builder drawer), `bg-primary-surface/20` (custom variant drawer), `bg-error-surface` (error notices), `bg-neutral-dark` (video preview box) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-2 border-dashed border-neutral-border/80` (dropzone & empty photo slots), `border-primary` (dropzone active drag & Slot 1 Cover ring), `border-primary/30` (variant drawer panels), `border-error/30` (upload error banner) |
| Border radius | `rounded-2xl` (`16px`) form section cards, option builder, dropzone, structured photo slots, sticky preview card & video preview box, `rounded-xl` (`12px`) inputs & action buttons, `rounded-full` badge pills & format badges |
| Text — primary | `font-heading font-bold text-2xl text-neutral-dark` (title), `font-heading font-bold text-lg` (section headers), `font-heading font-semibold text-xs text-error` (upload error title) |
| Text — secondary | `font-sans text-xs text-neutral-muted`, `font-mono text-xs text-neutral-muted` (SKU preview), `font-sans text-xs text-neutral-dark/80` (error message body) |
| Spacing | 2-column layout (approx 68% form left, 32% sticky preview right), `p-5 sm:p-6` card padding, `space-y-5 to space-y-6`, `grid-cols-2 sm:grid-cols-4 gap-3.5` (4-slot photo gallery grid) |
| Hover state | `hover:opacity-95` (Publish Product), `hover:bg-neutral-bg` (Save Draft & presets), `hover:border-primary/50` (dropzone idle hover), `hover:border-primary/70` (empty photo slot hover) |
| Shadow | `shadow-xs` (cards), `shadow-sm` (sticky preview), `shadow-2xs` (buttons & badges) |
| Accent usage | `bg-primary text-white` (Publish CTA, active tab indicator, Cover Slot 1 badge), `bg-secondary` (curator sparkles & video icon container), `text-primary` (live preview price & titles) |

**Pattern notes:**
- Exact match to `add-new_screen.png`: Section anchor bar (`Basic Info`, `Media`, `Pricing`, `Inventory`, `Variants`, `SEO & Additional`), dynamic category attributes, and variant matrix.
- Structured 4-Slot Photo Gallery Grid: Slot 1 serves as the primary catalog cover image. Hovering populated slots provides "Make Cover" and "Delete Photo" action buttons. Empty slots show interactive dashed tiles (`+ Add Cover Photo` / `+ Add Photo 2..4`).
- Attribute Option Builder: Expandable drawer with interactive toggles for `Color`, `Size`, and `Weight` axes, preset value chips, and custom text inputs. Generates a complete Cartesian matrix combinations list while preserving existing variant prices, stock, and custom titles.
- Bulk Variant Toolbar: 1-click bulk price setting, bulk stock setting, bulk auto-SKU generation, and clear all with confirmation.
- Standalone Custom Variant Drawer: Inline form allowing manual addition of single/asymmetrical editions (Title, SKU, optional Color/Size/Weight tags, Price, Stock) without regenerating the matrix.
- Variant Media Assignment: Per-variant media support with direct InsForge upload or 1-click assignment from the 4 primary product catalog photos.
- Video Showcase Section: Accepts YouTube (including Shorts), Vimeo, and direct MP4 URLs. Automatically detects video provider, displays colored badge pill, and features expandable `Test Playback` inline player.
- Storage Management: Immediate deletion of temporary uncommitted photos from InsForge Storage/local disk on remove, and complete garbage collection of deleted images on product save or archival.
- Dual mode (`mode="create"` vs `mode="edit"`) with non-destructive atomic variant reconciliation preserving foreign key linkages in historical order items.

---

#### 41. `MiraiMartLogo` (Official Reusable Brand Logo Component)
File: `components/shared/MiraiMartLogo.tsx`  
Last updated: September 6, 2026

| Property | Class |
| --- | --- |
| Background | Transparent SVG / Next.js Image wrapper |
| Colors | Primary `#0A98C3`, Primary Light `#71D7F6`, Primary Shadow `#087A9C`, Sunny Yellow Dot `#FCE35F` |
| Variants | `"mark"` (Isometric 3D "M" monogram with yellow dot), `"full"` (Mark + "MiraiMart" typographic lockup), `"image"` (Raster PNG `/mirai-mart_logo.png`) |
| Props | `variant?: "mark" | "full" | "image"`, `className?: string`, `size?: number`, `priority?: boolean` |

---

#### 42. `PDPVariantSelectors` (Interactive Storefront Multi-Attribute Swatches)
File: `components/storefront/PDPBuyBox.tsx` & `lib/utils.ts`  
Last updated: September 10, 2026

| Property | Class |
| --- | --- |
| Color Swatch Chips | `rounded-xl border px-3 py-2 text-xs flex items-center gap-2`, active: `border-primary bg-primary-surface/40 font-bold text-primary ring-2 ring-primary/20 shadow-xs`, idle: `border-neutral-border bg-surface text-neutral-dark hover:border-primary/40 hover:bg-neutral-bg/50` |
| Swatch Color Circle | `h-4 w-4 rounded-full border border-black/15 shadow-2xs` dynamically filled via unified `getColorHex` in `lib/utils.ts` |
| Swatch Thumbnail Image | `h-6 w-6 overflow-hidden rounded-md border border-neutral-border/80 relative` (Next.js Image `fill`, `sizes="24px"`) |
| Size Buttons | `min-w-[44px] h-10 px-3.5 rounded-xl border text-xs font-bold`, active: `bg-neutral-dark text-white border-neutral-dark shadow-xs`, idle: `bg-surface border-neutral-border text-neutral-dark hover:border-primary/50 hover:bg-neutral-bg` |
| Weight Buttons | `h-10 px-3.5 rounded-xl border text-xs font-bold`, active: `bg-primary text-white border-primary shadow-xs`, idle: `bg-surface border-neutral-border text-neutral-dark hover:border-primary/50 hover:bg-neutral-bg` |
| Out of Stock State | `opacity-50 line-through decoration-error`, with red `(Sold out)` helper badge |

**Pattern notes:**
- Automatically identifies active attribute axes (`color`, `size`, `weight`) and renders corresponding distinct selectors.
- Employs 3-tier intelligent fallback matching to gracefully handle asymmetrical stock without locking user selections.
- Seamlessly falls back to generic edition button pills if custom non-attribute variants are passed.
- Single source of truth for color palette hex mapping maintained in `lib/utils.ts`.
- Gallery interaction decoupled from initial page load via `hasUserSelectedVariant` flag.

---

#### 43. `AdminOrdersClient` (Fulfillment Management, 7 Metric Cards & Orders Data Table)
File: `components/admin/AdminOrdersClient.tsx`  
Last updated: September 14, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg` (canvas, table hover, & inputs), `bg-primary-surface`, `bg-warning-surface`, `bg-tertiary-surface`, `bg-secondary-surface`, `bg-success-surface`, `bg-error-surface` (KPI icon circles) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-b border-neutral-border` (table rows) |
| Border radius | `rounded-2xl` (`16px`) for metric cards & table container, `rounded-xl` (`12px`) for search, filter popover, action buttons & tabs, `rounded-full` for status badges |
| Text — primary | `font-heading font-bold text-3xl text-neutral-dark` (title), `font-heading font-bold text-2xl` (metrics), `font-sans font-bold text-xs text-neutral-dark` (pricing) |
| Text — secondary | `font-sans text-xs text-neutral-muted`, `font-mono text-xs text-primary` (order numbers) |
| Spacing | `p-4 sm:p-5` toolbar padding, `px-3 py-1.5` status tabs, `space-y-6` vertical stack |
| Hover state | `hover:text-neutral-dark hover:bg-neutral-bg` (inactive status tabs), `hover:bg-neutral-bg` (filter & export triggers), `hover:text-primary` (order actions) |
| Shadow | `shadow-xs` for metric cards, table container, and active status tab button |
| Accent usage | `bg-primary text-white shadow-xs` (active status tab pill & bulk action), `text-primary` (order links), official SVG brand vectors (Bkash `#E2136E`, Nagad `#ED1C24`) |
| Status badges | `bg-warning-surface text-warning-foreground border border-warning/30` (Pending), `bg-primary-surface/40 text-primary border border-primary/20` (Processing), `bg-secondary-surface text-secondary-foreground border border-secondary/40` (Shipped), `bg-success-surface text-success border border-success/30` (Delivered), `bg-error-surface text-error border border-error/30` (Cancelled), `bg-error-light text-error-foreground border border-error/20` (Refunded) |

**Pattern notes:**
- Exact match to `order_screen.png` with 7 summary metric cards, status tabs (`All (342)`, `Pending (28)`, `Processing (47)`, `Shipped (86)`, `Delivered (151)`, `Cancelled (18)`, `Refunded (12)`), instant search, multi-selection checkboxes, customer details, product thumbnails with count pills, Bangladeshi Taka pricing, authentic payment badges (Cash on Delivery, Bkash, Nagad, Card), and pagination.
- **URL Status Synchronization**: Status filter tabs are bidirectionally synchronized with the URL query parameter `?status=` (`pending`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded`) using `router.replace(targetUrl, { scroll: false })`. "All" tab omits the query parameter for a clean `/admin/orders` route. Automatically handles initial direct link navigation, bookmarking, and browser Back/Forward navigation with `<Suspense>` boundary in `app/(protectedRoutes)/admin/orders/page.tsx`.
- **Pagination Lifecycle Reset**: Switching status tabs or traversing browser history via Back/Forward buttons automatically resets `currentPage = 1` inside `handleStatusTabChange` and the `searchParams` listener, ensuring operators never encounter out-of-range empty table views.
- Includes floating bulk action bar when items are selected and 1-click CSV order data export.

---

#### 44. `AdminOrderDetailModal` (Order Inspection, Fulfillment Logistics & RMA Processing)
File: `components/admin/AdminOrderDetailModal.tsx`  
Last updated: September 14, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg/60` (header & nested cards), `bg-neutral-dark/60` (backdrop) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-b border-neutral-border/60` |
| Border radius | `rounded-2xl` (`16px`) modal container & info cards, `rounded-xl` (`12px`) inputs & action buttons, `rounded-full` status badges |
| Text — primary | `font-heading font-bold text-xl text-neutral-dark` (header), `font-bold text-sm text-neutral-dark` (customer & financial totals) |
| Text — secondary | `font-sans text-xs text-neutral-muted`, `font-mono text-xs` (tracking & SKUs) |
| Accents | `bg-primary text-white` (save tracking & active status), `text-error` (COD due balance), `bg-error text-white` (refund confirmation) |

**Pattern notes:**
- Comprehensive fulfillment workspace: Quick 1-click status switcher, customer contact links, complete COD cash ledger, carrier selector (Pathao, Steadfast, RedX, etc.) with consignment tracking assignment, and RMA refund processing with inventory restock.

---

#### 45. `AdminPackingSlipModal` (Printable A4 Customer Invoice & Packaging Slip)
File: `components/admin/AdminPackingSlipModal.tsx`  
Last updated: September 14, 2026

| Property | Class |
| --- | --- |
| Background | `bg-white` (A4 printable paper body), `bg-neutral-bg/60` (admin preview controls) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-dashed` (signature line) |
| Border radius | `rounded-2xl` (`16px`) preview shell, `rounded-xl` (`12px`) line items table & customer box |
| Typography | `font-heading font-extrabold uppercase` (Invoice headline), `font-mono font-bold` (Order ID & barcode tracking) |
| Print styles | `print:p-0 print:space-y-4 print:hidden` (clean printer layout with CSS print media support) |

**Pattern notes:**
- Formats customer orders into a print-ready A4 official invoice with Mirai Mart branding, customer shipping details, courier tracking barcode, itemized table, financial ledger, authorized dispatcher signature line, and 1-click browser printing trigger (`window.print()`).

#### 46. `AdminPromosClient` (Promotions & Coupon Codes CMS Data Grid & Filter Bar)
File: `components/admin/AdminPromosClient.tsx`  
Last updated: September 16, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg` (toolbar & tabs), `bg-neutral-dark/60` (delete backdrop) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-b border-neutral-border/60` (table rows) |
| Border radius | `rounded-2xl` (`16px`) table container & KPI cards, `rounded-xl` (`12px`) inputs & buttons |
| Text — primary | `font-heading font-bold text-2xl text-neutral-dark`, `font-bold text-xs text-neutral-dark` |
| Text — secondary | `font-sans text-xs text-neutral-muted`, `text-[10px]` uppercase metadata |
| Status / Accents | `bg-primary-surface text-primary` (Total KPI), `bg-success-surface text-success` (Active KPI), `bg-secondary-surface text-secondary-foreground` (Redemptions KPI), `bg-warning-surface text-warning-foreground` (Attention Required KPI), `bg-error-surface text-error` (Expired & Delete) |

**Pattern notes:**
- Full CMS dashboard for store vouchers and coupon codes. Features 4 KPI metric cards, bidirectional URL query parameter synchronization (`?status=active|inactive`), debounced code search, 1-click clipboard copy with animated check feedback, toggle switch for live active status, redemption usage progress gauge with warning colors, and deletion confirmation modal.

---

#### 47. `PromotionModal` (Coupon Creator & Live Interactive Voucher Preview)
File: `components/admin/PromotionModal.tsx`  
Last updated: September 16, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-linear-to-br from-primary-surface/40 via-surface to-secondary-surface/30` (Voucher preview), `bg-neutral-dark/60` (modal backdrop) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-2 border-dashed border-primary/40` (Voucher card frame) |
| Border radius | `rounded-2xl` (`16px`) modal container & voucher card, `rounded-xl` (`12px`) inputs & action buttons |
| Text — primary | `font-heading font-bold text-2xl text-neutral-dark`, `font-heading font-bold text-2xl sm:text-3xl text-primary` (discount amount) |
| Text — secondary | `font-sans text-xs text-neutral-muted`, `font-bold text-xs` labels |
| Focus | `focus:outline-none ring-2 ring-primary/20 border-primary` |

**Pattern notes:**
- Create and edit promotional vouchers with real-time live preview rendering. Supports 3 discount models (Percentage with % cap check, Fixed Amount with ৳ currency formatting, and Free Shipping), minimum subtotal threshold, optional usage ceiling cap, date range constraints (start and expiry), and live active status switch. Validated server-side via Zod schema (`promotion.schema.ts`).

#### 48. `WebsiteContentManager` (Homepage Hero Carousel & Announcement Bar CMS)
File: `components/admin/WebsiteContentManager.tsx`  
Last updated: September 17, 2026

| Property | Class |
| --- | --- |
| Background | `bg-surface` (`#FFFFFF`), `bg-neutral-bg` (canvas, drag zone hover, inputs), `bg-neutral-dark` (live preview shell), `bg-primary` (save CTA & active slide dot), `bg-secondary` (announcement preview) |
| Border | `border border-neutral-border` (`#E7E8EB`), `border-2 border-dashed border-neutral-border` (upload dropzone) |
| Border radius | `rounded-2xl` (`16px`) content sections, dropzone & preview frames, `rounded-xl` (`12px`) inputs, buttons & slide cards |
| Text — primary | `font-heading font-bold text-2xl text-neutral-dark`, `font-bold text-xs text-neutral-dark` |
| Text — secondary | `font-sans text-xs text-neutral-muted`, `text-[11px] font-medium text-neutral-muted` |
| Status / Accents | `bg-primary/10 text-primary border-primary/20` (CMS badge), `bg-success-surface text-success border-success/30` (Save notification), `bg-error-surface text-error border-error/30` (Upload error) |

**Pattern notes:**
- Full management console for storefront visual highlights.
- 3-Slide background carousel controller: individual slide configuration, live aspect-ratio preview, 3-second auto-play preview, centered CTA button controls with active/disabled switchbars, drag-and-drop 5MB image uploader, and preset photography gallery.
- Announcement Bar manager: live preview, active/disabled visibility switch, announcement message input, and promo highlight code badge input.
- Automatically revalidates storefront routes (`revalidatePath("/")`, `revalidatePath("/admin/content")`).

---

## Component Usage Rules

1. **Named Exports Only**: Always use named exports (`export function ComponentName()`), never default exports.
2. **Dedicated Props Type**: Always define `type Props = { ... }` directly above the component declaration.
3. **No Hardcoded Hex Colors**: Use Tailwind utility classes with Mirai Mart design tokens (e.g. `bg-primary`, `bg-secondary`, `text-neutral-dark`, `border-neutral-border`).
4. **Currency Format**: Always format currency using Bangladeshi Taka (`৳ [amount]`).
5. **Server vs Client Boundary**: Components requiring hooks (`useState`, `useEffect`) or browser event listeners must declare `"use client"` at the top. Pure presentation components remain Server Components.



