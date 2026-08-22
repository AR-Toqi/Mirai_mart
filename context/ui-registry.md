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
- **Path**: `components/layout/Header.tsx`
- **Purpose**: Main storefront sticky navigation bar with search, category dropdown, cart trigger, and account avatar.
- **Visuals**: Glassmorphic frosted backdrop (`backdrop-blur-md bg-white/90 border-b border-neutral-border`).
- **Props**:
  ```typescript
  type Props = {
    cartItemCount?: number;
    user?: { id: string; name?: string; avatarUrl?: string } | null;
  };
  ```

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

#### 4. `Footer.tsx`
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

#### 10. `CartDrawer.tsx`
- **Path**: `components/storefront/CartDrawer.tsx`
- **Purpose**: Slide-over cart drawer with free-shipping dynamic progress bar (`৳ 999` threshold), line item quantity steppers, gift wrap toggle, and checkout CTA.

---

## Component Usage Rules

1. **Named Exports Only**: Always use named exports (`export function ComponentName()`), never default exports.
2. **Dedicated Props Type**: Always define `type Props = { ... }` directly above the component declaration.
3. **No Hardcoded Hex Colors**: Use Tailwind utility classes with Mirai Mart design tokens (e.g. `bg-primary`, `bg-secondary`, `text-neutral-dark`, `border-neutral-border`).
4. **Currency Format**: Always format currency using Bangladeshi Taka (`৳ [amount]`).
5. **Server vs Client Boundary**: Components requiring hooks (`useState`, `useEffect`) or browser event listeners must declare `"use client"` at the top. Pure presentation components remain Server Components.
