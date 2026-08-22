# UI Registry

A centralized inventory of all reusable components, layouts, design tokens, and UI patterns for Mirai Mart. Every component must strictly adhere to the designated design tokens and architecture rules to prevent visual and structural drift across development sessions.

---

## Design System & Tokens

### 1. Typography

- **Headings & Display**: `Baloo 2` (`font-heading`, weights: 600 SemiBold, 700 Bold, 800 ExtraBold) — friendly, playful, modern geometry.
- **Body, Inputs & Specs**: `DM Sans` (`font-sans`, weights: 400 Regular, 500 Medium, 700 Bold) — clean, highly legible neutral sans-serif.

### 2. Core Color Palette

| Token | CSS Variable / Hex | Usage |
| --- | --- | --- |
| **Sky Blue (Primary)** | `var(--primary)` / `#0284c7` | Primary buttons, active pill chips, brand marks, links |
| **Sunny Yellow (Accent)** | `var(--accent)` / `#fce35f` | Announcement bar background, brand dot, promo badges, discount chips |
| **Dark Slate (Admin Shell)** | `var(--admin-sidebar)` / `#191c1e` | Admin sidebar navigation, dark surface panels |
| **Background (Light)** | `var(--background)` / `#f8fafc` | Storefront main canvas background |
| **Card Surface** | `var(--card)` / `#ffffff` | Elevated cards, PDP panels, modals, drawers |
| **Border & Dividers** | `var(--border)` / `#e2e8f0` | Subtle 1px dividers, card outlines, form inputs |
| **Text Primary** | `var(--foreground)` / `#0f172a` | Main headings, product titles, dark body copy |
| **Text Muted** | `var(--muted-foreground)` / `#64748b` | Breadcrumbs, curator notes, secondary metadata |
| **Success (Stock / Active)** | `var(--success)` / `#10b981` | In-stock badges, free-shipping unlocked, order success |
| **Warning (Low Stock / Pending)**| `var(--warning)` / `#f59e0b` | Low stock alert (< 5 items), pending fulfillment |
| **Danger (Error / Refunded)** | `var(--destructive)` / `#ef4444` | Form errors, out-of-stock badges, order cancellations |

### 3. Surface & Geometry Rules

- **Cards & Modals**: `16px` border-radius (`rounded-2xl`), subtle drop shadow (`shadow-sm` hover: `shadow-md`), `border border-border/60`.
- **Buttons & Pills**: Fully rounded pill shapes (`rounded-full`) or smooth `10px` radius (`rounded-xl`).
- **Inputs & Dropdowns**: `8px` to `10px` radius (`rounded-lg` / `rounded-xl`), `border-border focus:ring-2 focus:ring-primary/20`.

---

## Component Registry

### Layout Components (`components/layout/`)

#### 1. `AnnouncementBar.tsx`
- **Path**: `components/layout/AnnouncementBar.tsx`
- **Purpose**: Top promotional banner displaying free shipping thresholds, promo coupon codes, and store notices.
- **Visuals**: Sunny Yellow (`#fce35f`) background, dark slate text, optional dismiss button or marquee scroll.
- **Props**:
  ```typescript
  type Props = {
    message?: string;
    promoCode?: string;
    isActive?: boolean;
    backgroundColor?: string;
  };
  ```

#### 2. `Header.tsx`
- **Path**: `components/layout/Header.tsx`
- **Purpose**: Main storefront sticky navigation bar with search, category dropdown, cart trigger, and account avatar.
- **Visuals**: Glassmorphic frosted backdrop (`backdrop-blur-md bg-white/80 border-b border-border/40`).
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
- **Visuals**: Dark Slate (`#191c1e`) solid surface, active route indicator in Sky Blue with subtle glow.
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
- **Visuals**: Neutral slate surface (`bg-slate-900 text-white`), clean typography.

---

### Storefront Components (`components/storefront/`)

#### 5. `HeroCarousel.tsx`
- **Path**: `components/storefront/HeroCarousel.tsx`
- **Purpose**: Dynamic homepage hero slider with autoplay, manual indicator dots, Baloo 2 headlines, and dual CTA buttons.
- **Visuals**: 16px radius card (`rounded-2xl`), rich gradient overlay, smooth slide transitions.
- **Props**:
  ```typescript
  type Slide = {
    id: string;
    title: string;
    subtitle: string;
    ctaPrimaryText: string;
    ctaPrimaryLink: string;
    ctaSecondaryText?: string;
    ctaSecondaryLink?: string;
    imageUrl: string;
    badgeText?: string;
  };
  type Props = {
    slides: Slide[];
    autoPlayInterval?: number;
  };
  ```

#### 6. `CategoryTiles.tsx`
- **Path**: `components/storefront/CategoryTiles.tsx`
- **Purpose**: 6-card visual grid showcasing primary categories (Educational Toys, Cars & Vehicles, Unique Toys, Home Decor, Digital Gadgets, Gift Combos).
- **Visuals**: 16px radius cards with hover zoom image effect and pill tag overlays.
- **Props**:
  ```typescript
  type CategoryTile = {
    id: string;
    title: string;
    slug: string;
    itemCount: number;
    imageUrl: string;
    featuredTag?: string;
  };
  type Props = {
    categories: CategoryTile[];
  };
  ```

#### 7. `AgeFilterBar.tsx`
- **Path**: `components/storefront/AgeFilterBar.tsx`
- **Purpose**: Horizontal pill strip for quick age filtering (`0–1 yr`, `1–3 yrs`, `3–5 yrs`, `5–8 yrs`, `8+ yrs`).
- **Visuals**: Pill chips (`rounded-full px-4 py-2`), active state in Sky Blue fill (`bg-primary text-white`).
- **Props**:
  ```typescript
  type Props = {
    selectedAge?: string | null;
    onSelectAge: (age: string | null) => void;
  };
  ```

#### 8. `ProductCard.tsx`
- **Path**: `components/storefront/ProductCard.tsx`
- **Purpose**: Standard e-commerce product card used across homepage rails, category grids, and recommendation carousels.
- **Visuals**: 16px radius card, hover zoom image, Baloo 2 title, discount badge, star rating, price, and Sky Blue "Add to Cart" button.
- **Props**:
  ```typescript
  type Props = {
    id: string;
    title: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    secondaryImageUrl?: string;
    badge?: "Bestseller" | "New" | "Sale" | "Curator's Pick";
    ageRange?: string;
    isOutOfStock?: boolean;
    onAddToCart?: () => void;
  };
  ```

#### 9. `FilterSidebar.tsx`
- **Path**: `components/storefront/FilterSidebar.tsx`
- **Purpose**: Faceted PLP filter sidebar (280px width) with multi-select age checkboxes, dual-handle price slider ($10–$200), style tags, and In-Stock toggle.
- **Visuals**: 16px radius card container, collapsible accordion sections.
- **Props**:
  ```typescript
  type FilterValues = {
    categories: string[];
    ageRanges: string[];
    priceRange: [number, number];
    inStockOnly: boolean;
    tags: string[];
  };
  type Props = {
    filters: FilterValues;
    onChange: (updated: Partial<FilterValues>) => void;
    onReset: () => void;
  };
  ```

#### 10. `ImageGallery.tsx`
- **Path**: `components/storefront/ImageGallery.tsx`
- **Purpose**: Product Detail Page (PDP) multi-image showcase with thumbnail carousel, hover zoom lens, and 360° asset indicator badge.
- **Props**:
  ```typescript
  type Props = {
    images: { url: string; alt: string }[];
    has360View?: boolean;
  };
  ```

#### 11. `VariantSelector.tsx`
- **Path**: `components/storefront/VariantSelector.tsx`
- **Purpose**: Interactive color swatches, size buttons, and combo bundle options on PDP.
- **Props**:
  ```typescript
  type VariantOption = {
    id: string;
    name: string; // e.g. "Color", "Size"
    values: { label: string; value: string; inStock: boolean; hexColor?: string }[];
  };
  type Props = {
    options: VariantOption[];
    selectedVariants: Record<string, string>;
    onSelect: (optionName: string, value: string) => void;
  };
  ```

#### 12. `SpecsTable.tsx`
- **Path**: `components/storefront/SpecsTable.tsx`
- **Purpose**: Collapsible accordion table rendering dynamic JSONB product specs (dimensions, battery life, materials, safety certifications).
- **Props**:
  ```typescript
  type Props = {
    specs: Record<string, string | number>;
    dimensions?: string;
    materials?: string[];
    safetyCertifications?: string[];
  };
  ```

#### 13. `CartDrawer.tsx`
- **Path**: `components/storefront/CartDrawer.tsx`
- **Purpose**: Slide-over cart drawer with free-shipping dynamic progress bar ($50 threshold), line item quantity steppers, gift wrap toggle (`+$3.99`), and checkout CTA.
- **Visuals**: Framer Motion smooth slide-in from right, backdrop blur overlay.
- **Props**:
  ```typescript
  type CartItem = {
    id: string;
    variantId: string;
    title: string;
    variantTitle?: string;
    price: number;
    quantity: number;
    imageUrl: string;
  };
  type Props = {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    subtotal: number;
    isGiftWrapped: boolean;
    onToggleGiftWrap: (wrapped: boolean) => void;
  };
  ```

#### 14. `CheckoutStepper.tsx`
- **Path**: `components/storefront/CheckoutStepper.tsx`
- **Purpose**: Multi-step checkout navigation container (Step 1: Contact & Address, Step 2: Shipping Method, Step 3: Payment).
- **Props**:
  ```typescript
  type Props = {
    currentStep: 1 | 2 | 3;
    stepsCompleted: number[];
  };
  ```

---

### Admin Panel Components (`components/admin/`)

#### 15. `MetricCard.tsx`
- **Path**: `components/admin/MetricCard.tsx`
- **Purpose**: Admin dashboard KPI card showing key metrics (Revenue, Orders Today, Low Stock, Active Promotions) with trend percentage badge.
- **Props**:
  ```typescript
  type Props = {
    title: string;
    value: string | number;
    changePercentage?: number;
    trend?: "up" | "down" | "neutral";
    icon: React.ComponentType<{ className?: string }>;
    alert?: boolean;
  };
  ```

#### 16. `OrderStatusPill.tsx`
- **Path**: `components/admin/OrderStatusPill.tsx`
- **Purpose**: Visual badge for order status and payment status across admin lists and customer order history.
- **Props**:
  ```typescript
  type OrderStatus = "pending" | "packed" | "shipped" | "delivered" | "refunded";
  type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
  type Props = {
    status: OrderStatus | PaymentStatus;
    type?: "order" | "payment";
  };
  ```

#### 17. `DynamicAttributeForm.tsx`
- **Path**: `components/admin/DynamicAttributeForm.tsx`
- **Purpose**: Dynamic category-dependent attribute switcher on product CMS (e.g. selecting "Gift Combos" reveals occasion and recipient inputs; selecting "Gadgets" reveals tech specs).
- **Props**:
  ```typescript
  type Props = {
    categorySlug: string;
    values: Record<string, unknown>;
    onChange: (values: Record<string, unknown>) => void;
  };
  ```

#### 18. `HeroSliderManager.tsx`
- **Path**: `components/admin/HeroSliderManager.tsx`
- **Purpose**: Drag-and-drop reorderable list of homepage hero slides with inline headline, subtext, and image uploaders.
- **Props**:
  ```typescript
  type Props = {
    initialSlides: Slide[];
    onSave: (slides: Slide[]) => Promise<void>;
  };
  ```

---

### Shared UI Primitives (`components/shared/` & `components/ui/`)

#### 19. `MiraiMartLogo.tsx`
- **Path**: `components/shared/MiraiMartLogo.tsx`
- **Purpose**: Scalable SVG/React brand logo featuring isometric Sky Blue "M" monogram with sunny yellow accent dot.
- **Props**:
  ```typescript
  type Props = {
    size?: "sm" | "md" | "lg";
    showText?: boolean;
    className?: string;
  };
  ```

#### 20. `QuantityStepper.tsx`
- **Path**: `components/shared/QuantityStepper.tsx`
- **Purpose**: Compact plus/minus stepper for PDP and cart line items with min/max stock limits.
- **Props**:
  ```typescript
  type Props = {
    value: number;
    min?: number;
    max?: number;
    onChange: (newValue: number) => void;
    disabled?: boolean;
    size?: "sm" | "md";
  };
  ```

#### 21. `RatingStars.tsx`
- **Path**: `components/shared/RatingStars.tsx`
- **Purpose**: Visual star rating (filled, half-filled, outlined) with optional numerical score and review count badge.
- **Props**:
  ```typescript
  type Props = {
    rating: number; // e.g. 4.8
    reviewCount?: number;
    size?: "sm" | "md" | "lg";
    showCount?: boolean;
  };
  ```

---

## Component Usage Rules

1. **Named Exports Only**: Always use named exports (`export function ComponentName()`), never default exports.
2. **Dedicated Props Type**: Always define `type Props = { ... }` directly above the component declaration.
3. **No Hardcoded Hex Colors**: Use Tailwind utility classes with Mirai Mart design tokens (e.g. `bg-primary`, `bg-accent`, `text-muted-foreground`) or CSS variables.
4. **Server vs Client Boundary**: Components requiring hooks (`useState`, `useEffect`) or browser event listeners must declare `"use client"` at the top. Pure presentation components remain Server Components.
5. **No Layout Shifts**: Always provide `width`, `height`, and `alt` tags when using `next/image` in product cards and galleries.
