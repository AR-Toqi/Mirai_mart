# Architecture

## Stack

| Layer | Tool | Purpose |
| --- | --- | --- |
| **Framework** | Next.js 16 (App Router) + React 19 | Full-stack framework with Server Actions, Server Components, and Streaming |
| **Backend & Database** | InsForge | Hosted PostgreSQL database, Auth, Storage, and Realtime sync |
| **State & Cache** | TanStack Query v5 + Context API | Server state caching, optimistic cart updates, and interactive filters |
| **Validation** | Zod | End-to-end type validation for Server Actions, API contracts, and form schemas |
| **Micro-Interactions** | Framer Motion | Cart drawer transitions, layout animations, and modal overlays |
| **Styling** | Tailwind CSS + Shadcn ui (Radix UI Primitives), | Accessible UI primitives with Mirai Mart design tokens

 |
| **Typography** | Baloo 2 + DM Sans | Baloo 2 (Headings), DM Sans (Body & UI text)

 |
| **Language** | TypeScript (Strict) | End-to-end type safety throughout frontend, actions, and schema |
| **Analytics & Telemetry** | PostHog | Product analytics, user session tracking, engagement metrics |

---

## Folder Structure

```
/
├── AGENTS.md
├── context/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── ui-tokens.md
│   ├── ui-rules.md
│   ├── ui-registry.md
│   ├── code-standards.md
│   ├── library-docs.md
│   ├── build-plan.md
│   └── progress-tracker.md
├── app/
│   ├── layout.tsx                                → Root HTML, TanStack Query provider, Cart context
│   ├── globals.css                               → Tailwind directives, design tokens, typography imports
│   ├── (commonRoutes)/                           → Public route group (accessible without login)
│   │   ├── (storefront)/
│   │   │   ├── layout.tsx                        → Storefront shell: Announcement bar, Header, Category bar, Footer
│   │   │   ├── page.tsx                          → Homepage (Screen 1)
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx                  → Category & PLP with dynamic filters (Screen 2)
│   │   │   ├── product/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx                  → PDP with gallery, swatches, and specs (Screen 3)
│   │   │   ├── cart/
│   │   │   │   └── page.tsx                      → Full Cart & gift options (Screen 4)
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx                      → Multi-step checkout flow (Screen 5)
│   │   │   │   └── success/
│   │   │   │       └── [orderNumber]/
│   │   │   │           └── page.tsx              → Order confirmation page
│   │   │   ├── track-order/
│   │   │   │   └── page.tsx                      → Public standalone order tracking
│   │   │   └── compare/
│   │   │       └── page.tsx                      → Product spec comparison page
│   │   └── (auth)/
│   │       ├── layout.tsx                        → Clean centered auth layout shell
│   │       ├── login/
│   │       │   └── page.tsx                      → Login form (Email/Password + Google OAuth)
│   │       ├── register/
│   │       │   └── page.tsx                      → Customer registration
│   │       └── callback/
│   │           └── page.tsx                      → InsForge OAuth callback handler
│   ├── (protectedRoutes)/                        → Protected route group (auth session & RBAC guarded)
│   │   ├── layout.tsx                            → Auth session guard & redirect handler
│   │   ├── account/
│   │   │   └── page.tsx                          → Customer dashboard & order history (Screen 6)
│   │   ├── register/
│   │   │   └── page.tsx                          → Customer registration
│   │   └── callback/
│   │       └── page.tsx                          → InsForge OAuth callback handler
│   └── api/
│       ├── search/
│       │   └── route.ts                          → Predictive search with autocomplete
│       ├── webhooks/
│       │   └── route.ts                          → Payment & carrier update webhooks
│       └── upload/
│           └── route.ts                          → InsForge storage direct upload handler
├── actions/
│   ├── products.ts                               → Catalog queries, variant selection, reviews
│   ├── cart.ts                                   → Price recalculation, stock checks, promo application
│   ├── orders.ts                                 → Order placement, guest checkout, tracking
│   ├── account.ts                                → Profile updates, address management
│   └── admin.ts                                  → Product CMS, order fulfillment, RMA, banner CMS
├── components/
│   ├── ui/                                       → Reusable Radix UI / shadcn primitives (Button, Dialog, Accordion, Slider)
│   ├── layout/
│   │   ├── AnnouncementBar.tsx                   → Top promo bar with #fce35f background
│   │   ├── Header.tsx                            → Glassmorphic sticky header with search & badges
│   │   ├── AdminSidebar.tsx                      → Dark slate sidebar navigation
│   │   └── Footer.tsx                            → Multi-column sitemap & payment icons
│   ├── storefront/
│   │   ├── HeroCarousel.tsx                      → Dynamic homepage hero slider
│   │   ├── CategoryTiles.tsx                     → 6-category visual grid including Gift Combos
│   │   ├── AgeFilterBar.tsx                      → Pill-shaped age switcher (0-1, 1-3, 3-5, 5-8, 8+)
│   │   ├── ProductCard.tsx                       → Standard product card (hover video/image, pill tags)
│   │   ├── FilterSidebar.tsx                     → Faceted PLP filter panel
│   │   ├── ImageGallery.tsx                      → PDP image viewer with hover zoom & 360 view
│   │   ├── VariantSelector.tsx                   → Color/Size swatch buttons
│   │   ├── SpecsTable.tsx                        → Dynamic gadget & material spec accordion
│   │   ├── CartDrawer.tsx                        → Slide-over cart drawer with free-shipping bar
│   │   └── CheckoutStepper.tsx                   → Multi-step checkout form container
│   ├── admin/
│   │   ├── MetricCard.tsx                        → KPI summary cards with trend badges
│   │   ├── OrderStatusPill.tsx                   → Status badge with tokenized colors
│   │   ├── DynamicAttributeForm.tsx              → Category-dependent form field switcher
│   │   └── HeroSliderManager.tsx                 → Drag-and-drop banner reorder UI
│   └── shared/
│       ├── MiraiMartLogo.tsx                     → Isometric M mark with sunny yellow dot
│       ├── QuantityStepper.tsx                   → Reusable item quantity counter
│       └── RatingStars.tsx                       → Star display with verified review count
├── lib/
│   ├── insforge-client.ts                        → InsForge browser client instance
│   ├── insforge-server.ts                        → InsForge server client (cookies & auth context)
│   ├── posthog-client.ts                         → PostHog browser client (NEXT_PUBLIC_POSTHOG_KEY/HOST)
│   ├── posthog-server.ts                         → PostHog server client (flushAt: 1, flushInterval: 0)
│   ├── validations/
│   │   ├── product.schema.ts                     → Zod schema for products and dynamic specs
│   │   ├── checkout.schema.ts                    → Zod schema for address, shipping, and payment
│   │   └── auth.schema.ts                        → Zod schema for credentials and profiles
│   └── utils.ts                                  → cn() class merger, currency formatters, slugifiers
└── types/
    └── index.ts                                  → Database schema models, cart types, and role enums

```

---

## System Boundaries

| Folder | Owns |
| --- | --- |
| `app/` | Routing, Server Component page entrypoints (strictly server-rendered; never `"use client"`), metadata, and Route Handlers. No direct SQL or raw mutation logic. |
| `actions/` | Next.js Server Actions for all database mutations and data fetching. Validates input with Zod. |
| `components/` | Visual presentation and user interaction. Strictly consumes props or hooks; no direct database calls. |
| `lib/` | Third-party SDK initializations (InsForge client/server), Zod schemas, and utility functions. |
| `types/` | Shared TypeScript types, Enums (`user_role`, `order_status`, `payment_status`), and data contracts. |

---

## Data Flow

### Catalog Browsing & Filtering

```
User selects filter / category chip
        ↓
URL query params update (?category=gift-combos&age=1-3)
        ↓
Server Component in app/(commonRoutes)/(storefront)/category/[slug]/page.tsx
        ↓
Server Action in actions/products.ts
        ↓
InsForge DB query (filtered by category, price, attributes)
        ↓
Server Component renders updated product grid

```

### Cart & Checkout Flow

```
User adds item to cart
        ↓
Client-side Cart Context updates optimistically & syncs to localStorage
        ↓
User proceeds to /checkout
        ↓
Server Action actions/orders.ts validates payload against Zod schema
        ↓
InsForge DB transaction:
  1. Validates stock in `product_variants`
  2. Inserts record into `orders`
  3. Inserts line items into `order_items`
  4. Decrements `stock_quantity` in `product_variants`
        ↓
Cart is cleared → User redirected to /checkout/success/[orderNumber]

```

### Admin Product CMS Operations

```
Admin edits product & uploads images
        ↓
Image files sent to InsForge Storage (`products/` bucket)
        ↓
Form submitted to Server Action in actions/admin.ts
        ↓
Zod schema validates dynamic attributes based on category
        ↓
InsForge DB upserts `products` and `product_variants`
        ↓
revalidatePath('/category/[slug]') and revalidatePath('/admin/products') triggered

```

---

## InsForge Database Schema

### `users`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key, generated by auth system |
| `email` | varchar(255) | Unique, indexed |
| `password_hash` | varchar(255) | Nullable if created via Google OAuth |
| `role` | text | Enum: `'admin' | 'store-manager' | 'customer'`, default `'customer'` |
| `created_at` | timestamptz | Defaults to `NOW()` |
| `updated_at` | timestamptz | Defaults to `NOW()` |

### `profiles`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key, references `users(id)` ON DELETE CASCADE |
| `first_name` | varchar(100) | Customer first name |
| `last_name` | varchar(100) | Customer last name |
| `phone` | varchar(30) | Optional contact phone number |
| `avatar_url` | text | Profile avatar image link |
| `addresses` | jsonb | Array of saved shipping/billing address objects |
| `created_at` | timestamptz | Defaults to `NOW()` |
| `updated_at` | timestamptz | Defaults to `NOW()` |

### `categories`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `name` | varchar(100) | Category name (e.g., "Gift Combos", "Educational Toys") |
| `slug` | varchar(120) | Unique URL slug |
| `description` | text | Short description for PLP headers |
| `image_url` | text | Banner / tile thumbnail image |
| `parent_id` | uuid | Nullable foreign key referencing `categories(id)` for subcategories |
| `created_at` | timestamptz | Defaults to `NOW()` |

### `products`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `category_id` | uuid | References `categories(id)` ON DELETE SET NULL |
| `title` | varchar(255) | Product title |
| `slug` | varchar(280) | Unique URL slug |
| `description` | text | Full markdown or rich text description |
| `curator_notes` | text | "Why we love it" brand commentary |
| `age_range` | varchar(50) | Target age (e.g., `"0-1"`, `"1-3"`, `"3-5"`, `"5-8"`, `"8+"`) |
| `specs` | jsonb | Dynamic attributes (battery, connectivity, material, dimensions) |
| `is_active` | boolean | Controls public visibility, default `true` |
| `is_featured` | boolean | Highlighted in carousels, default `false` |
| `created_at` | timestamptz | Defaults to `NOW()` |
| `updated_at` | timestamptz | Defaults to `NOW()` |

### `product_variants`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `product_id` | uuid | References `products(id)` ON DELETE CASCADE |
| `sku` | varchar(100) | Unique stock keeping unit |
| `title` | varchar(150) | Variant label (e.g., "Deluxe 96pc - Natural Wood") |
| `price` | numeric(10, 2) | Current selling price |
| `compare_at_price` | numeric(10, 2) | Strikethrough original price |
| `cost_price` | numeric(10, 2) | Internal unit cost for admin reporting |
| `stock_quantity` | integer | Current inventory count, default `0` |
| `attributes` | jsonb | Swatch details: `{"color": "Natural", "size": "Deluxe"}` |
| `images` | jsonb | Array of image URLs for this variant |
| `created_at` | timestamptz | Defaults to `NOW()` |
| `updated_at` | timestamptz | Defaults to `NOW()` |

### `orders`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `order_number` | varchar(50) | Unique tracking code (e.g., `"MM-10492"`) |
| `user_id` | uuid | References `users(id)`, nullable for guest checkouts |
| `customer_email` | varchar(255) | Customer contact email |
| `shipping_address` | jsonb | Full shipping details (name, street, city, state, zip, phone) |
| `billing_address` | jsonb | Billing address details |
| `subtotal` | numeric(10, 2) | Total before tax and shipping |
| `tax` | numeric(10, 2) | Estimated tax amount |
| `shipping_fee` | numeric(10, 2) | Delivery cost |
| `total_amount` | numeric(10, 2) | Final billed amount |
| `status` | text | Enum: `'pending' | 'packed' | 'shipped' | 'delivered' | 'refunded' | 'cancelled'` |
| `payment_status` | text | Enum: `'unpaid' | 'paid' | 'refunded' | 'failed'` |
| `tracking_number` | varchar(100) | Shipping carrier tracking code |
| `carrier` | varchar(100) | Carrier name (FedEx, DHL, USPS) |
| `gift_options` | jsonb | `{"is_gift": true, "wrap_fee": 3.99, "message": "Happy Birthday!"}` |
| `created_at` | timestamptz | Defaults to `NOW()` |
| `updated_at` | timestamptz | Defaults to `NOW()` |

### `order_items`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `order_id` | uuid | References `orders(id)` ON DELETE CASCADE |
| `product_variant_id` | uuid | References `product_variants(id)` ON DELETE SET NULL |
| `product_title` | varchar(255) | Snapshot of product title at purchase |
| `variant_title` | varchar(150) | Snapshot of variant title at purchase |
| `unit_price` | numeric(10, 2) | Unit price at time of order |
| `quantity` | integer | Quantity ordered |
| `total_price` | numeric(10, 2) | `unit_price * quantity` |

### `reviews`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `product_id` | uuid | References `products(id)` ON DELETE CASCADE |
| `user_id` | uuid | References `users(id)` ON DELETE SET NULL |
| `rating` | integer | 1 to 5 integer rating |
| `title` | varchar(150) | Short review headline |
| `comment` | text | Review body text |
| `images` | jsonb | Array of customer review photo links |
| `is_verified_purchase` | boolean | Set to true if reviewer has a delivered order |
| `is_approved` | boolean | Moderation flag, default `false` |
| `created_at` | timestamptz | Defaults to `NOW()` |

### `promotions`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `code` | varchar(50) | Unique coupon code (e.g., `"MIRAI10"`) |
| `discount_type` | varchar(20) | `'percentage'`, `'fixed_amount'`, or `'free_shipping'` |
| `discount_value` | numeric(10, 2) | Numerical value for the discount |
| `min_order_value` | numeric(10, 2) | Minimum cart subtotal required |
| `max_uses` | integer | Optional maximum usage threshold |
| `used_count` | integer | Total times redeemed, default `0` |
| `starts_at` | timestamptz | Optional start date |
| `expires_at` | timestamptz | Optional expiration timestamp |
| `is_active` | boolean | Promotion toggle, default `true` |
| `created_at` | timestamptz | Defaults to `NOW()` |

---

## InsForge Storage Buckets

| Bucket | Path | Access Policy |
| --- | --- | --- |
| `products` | `products/{category}/{product_id}/*` | Public read access; write restricted to `admin` and `store-manager` |
| `reviews` | `reviews/{product_id}/{user_id}/*` | Public read access; write restricted to authenticated users |
| `brand` | `brand/cms/*` | Public read access; write restricted to `admin` |

---

## Authentication & Role-Based Access Control

* **Provider**: InsForge Auth (Email/Password & Google OAuth)
* **Roles**:
* `customer`: Storefront access, checkout, own order history, and reviews.
* `store-manager`: Full access to product catalog, stock updates, and order fulfillment.
* `admin`: Super-admin access including staff administration, financial settings, and CMS controls.


* **Protected Route Guards**:
* `/account/*`: Authenticated users (`customer`, `store-manager`, `admin`)
* `/admin/*`: Restricted to `admin` and `store-manager`
* `/admin/settings/staff`: Restricted exclusively to `admin`



---

## InsForge Client Initialization Pattern

```typescript
// lib/insforge-client.ts (Client Components)
import { createBrowserClient } from "@insforge/ssr";

export const insforge = createBrowserClient(
  process.env.NEXT_PUBLIC_INSFORGE_URL!,
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!
);

// lib/insforge-server.ts (Server Components & Server Actions)
import { createServerClient } from "@insforge/ssr";
import { cookies } from "next/headers";

export const createInsforgeServer = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_INSFORGE_URL!,
    process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
};

```

---

## Architectural Invariants

* Server Actions never contain React UI code; UI components never query the database directly.
* Server-side mutations and queries MUST use `createInsforgeServer()`.
* Primary CTA buttons must use Sky Blue (`#006689`), accent badges/banners must use Sunny Yellow (`#fce35f`), and display headings must use **Baloo 2**.


* Buttons and inputs have an 8px corner radius (`rounded-md`); cards and modals have a 16px corner radius (`rounded-2xl`).


* Every cart calculation must be verified server-side in Server Actions before final order insertion.
* Guest orders must always store `customer_email` and allow tracking via `/track-order` without requiring account creation.