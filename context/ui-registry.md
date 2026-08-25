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
- **Purpose**: Standard e-commerce product card matching the design system image.
- **Visuals**: 16px radius card (`rounded-xl`), border `#E7E8EB`, image with `12px` radius (`rounded-lg`), Baloo 2 title, category subtitle ("Creative • Educational"), Bangladeshi Taka price (`৳ 1,450`), and vibrant secondary yellow `bg-secondary` shopping cart icon button with neutral dark icon.
- **Props**:
  ```typescript
  type Props = {
    id: string;
    title: string;
    slug: string;
    price: number; // in BDT
    compareAtPrice?: number;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    badge?: "New" | "Sale" | "-20%" | "Best Seller" | "Exclusive";
    categoryName?: string;
    isOutOfStock?: boolean;
    onAddToCart?: () => void;
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

**Pattern notes:**
- Client orchestrator component combining FilterSidebar, ProductToolbar, ProductCard grid, and ProductListRow list.
- Renders empty state card with reset action when no products match active filters.

---

### Auth & Customer Account Components

#### 11. `LoginForm`
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

#### 12. `RegisterForm` (Multi-Step & OTP Verification)
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

#### 13. `AccountDashboardClient` (Customer Portal)
File: `components/account/AccountDashboardClient.tsx`  
Last updated: August 24, 2026

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
- Strictly matches `context/design/My-account_page.png`.
- Grouped sidebar navigation with `ACCOUNT`, `SETTINGS`, and `SUPPORT` sections.
- Order status badges use color tokens: `Delivered` (`#e6f8ee`/`#15803d`), `Shipped` (`bg-primary-surface text-primary`), `In Transit` (`#fef3c7`/`#b45309`), `Cancelled` (`#fee2e2`/`#b91c1c`).
- All monetary values formatted in Bangladeshi Taka (`৳`).

---



## Component Usage Rules

1. **Named Exports Only**: Always use named exports (`export function ComponentName()`), never default exports.
2. **Dedicated Props Type**: Always define `type Props = { ... }` directly above the component declaration.
3. **No Hardcoded Hex Colors**: Use Tailwind utility classes with Mirai Mart design tokens (e.g. `bg-primary`, `bg-secondary`, `text-neutral-dark`, `border-neutral-border`).
4. **Currency Format**: Always format currency using Bangladeshi Taka (`৳ [amount]`).
5. **Server vs Client Boundary**: Components requiring hooks (`useState`, `useEffect`) or browser event listeners must declare `"use client"` at the top. Pure presentation components remain Server Components.
