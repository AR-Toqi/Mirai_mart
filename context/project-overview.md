# Project Overview

## About the Project

Mirai Mart is a premium, full-stack e-commerce platform specializing in curated educational toys, creative developmental items, modern home decor, digital gadgets, and themed gift combos (newborns, birthdays, tech setups). Built with Next.js 16 App Router, React 19, InsForge (PostgreSQL, Auth, Storage), and Tailwind CSS, Mirai Mart combines a vibrant design aesthetic with rich product discovery, faceted filtering, a frictionless cart and checkout flow, customer order tracking, and a dedicated admin management portal.

Every customer interaction and conversion funnel is tracked with PostHog analytics, providing actionable telemetry from product view to checkout completion.

---

## The Problem It Solves

Traditional e-commerce stores often feel cluttered, impersonal, and slow, with fragmented filtering and cumbersome checkout flows. Finding thoughtful gifts by age group, occasion, or technical specification is often tedious.

Mirai Mart solves this by offering:
- **Curated Discovery**: Instant filtering by age range (`0–1`, `1–3`, `3–5`, `5–8`, `8+ yrs`), developmental skills, and curated themes (e.g. Montessori picks, desk gadgets, gift bundles).
- **Curator Notes & Rich PDPs**: Detailed "Why We Love It" editorial insights, hover-zoom multi-angle galleries, dynamic tech spec accordions, and side-by-side product comparisons.
- **Optimized Conversion Flow**: Slide-over Cart Drawer with real-time free-shipping progress indicator ($50 threshold), gift wrapping add-ons (`+$3.99`), promo coupon validation, and streamlined multi-step checkout.
- **Comprehensive Store Management**: Robust role-based admin panel for live KPI metrics, dynamic schema-driven product/variant management, order fulfillment with carrier tracking, and marketing banner controls.

---

## Pages & Routes

```
Common Routes (app/(commonRoutes)/ - Public without login):
  Storefront (app/(commonRoutes)/(storefront)/):
    /                              → Homepage (Hero carousel, category tiles, bestsellers, trust strip)
    /category/[slug]               → Category & PLP (Faceted sidebar, age chips, price slider, sorting)
    /product/[slug]                → PDP (Image gallery, swatches, specs accordion, reviews, bundles)
    /cart                          → Full cart view & gift options
    /checkout                      → Multi-step checkout (Address, Shipping, Payment)
    /checkout/success/[orderNumber]→ Order confirmation & receipt
    /track-order                   → Standalone public order lookup by order number & email
    /compare                       → Side-by-side product spec comparison (up to 4 products)

  Auth (app/(commonRoutes)/(auth)/):
    /login                         → Authentication page / modal (Email/Password + Google OAuth)
    /register                      → Customer registration
    /callback                      → InsForge OAuth callback handler

Protected Routes (app/(protectedRoutes)/ - Session & RBAC guarded):
  Customer (app/(protectedRoutes)/account/):
    /account                       → Customer dashboard, order history & fulfillment status

  Admin Panel (app/(protectedRoutes)/admin/):
    /admin/dashboard               → Store overview, revenue/order KPIs & recent order stream
    /admin/products                → Product inventory list & stock status
    /admin/products/[id]           → Dynamic attribute product CMS & variant matrix editor
    /admin/orders                  → Fulfillment queue & multi-status filtering
    /admin/orders/[id]             → Order detail, carrier tracking assignment & RMA/refunds
    /admin/marketing               → Hero slider manager, announcement bar & coupon code CMS
```

---

## Navigation Architecture

- **Storefront Header**: Glassmorphic sticky navbar featuring the Mirai Mart logo (Sky Blue monogram + sunny yellow dot), category dropdown menus, predictive search bar with live autocomplete, Wishlist badge, slide-over Cart Drawer trigger, and User Account menu.
- **Storefront Announcement Bar**: Sunny Yellow (`#fce35f`) top alert with editable promotional messages and promo code highlights.
- **Admin Sidebar**: Dark Slate (`#191c1e`) dedicated navigation for Dashboard, Products, Inventory, Orders, Marketing/CMS, and Store Settings.

---

## Core User Flows

### 1. Storefront Discovery & Browsing
- User lands on `/` with dynamic hero slider, category tiles, and "Shop by Age" chips.
- Selecting any category or age chip navigates to `/category/[slug]` with query parameters (`?category=gift-combos&age=1-3`).
- Left filter sidebar updates product grid in real-time by price range ($10–$200), tags, and in-stock status.
- Predictive search API (`/api/search`) returns debounced autocomplete suggestions with thumbnails.

### 2. Product Evaluation (PDP)
- 60/40 split showcase: left gallery with hover zoom and thumbnail carousel; right pane with Baloo 2 title, category pill, star rating summary, discount pricing, and variant swatches.
- Interactive quantity stepper and "Why We Love It" curator card.
- Dynamic tech specs / dimensions accordion table and customer reviews breakdown.
- Side-by-side comparison tray allows adding up to 4 items and visiting `/compare` to inspect specs side by side.

### 3. Cart & Multi-Step Checkout Flow
- Clicking "Add to Cart" triggers optimistic updates in client cart state and opens the slide-over Cart Drawer.
- Free-shipping dynamic progress bar indicates progress toward the $50 threshold.
- Optional gift wrapping checkbox adds `+$3.99` and captures personalized message.
- Multi-step checkout (`/checkout`) validates address (Zod), allows selection of shipping methods, applies promo codes, and completes order creation in InsForge DB with inventory decrement.
- Redirects to `/checkout/success/[orderNumber]` with tracking link and order receipt.

### 4. Customer Account & Order Tracking
- Customer can review past orders with status pills (`Pending`, `Packed`, `Shipped`, `Delivered`, `Refunded`).
- Detailed fulfillment timeline displays carrier tracking numbers.
- Unauthenticated users can track orders directly at `/track-order` using `order_number` and `customer_email`.

### 5. Admin Management & Fulfillment
- Protected routes guarded by RBAC (`admin` and `store-manager`).
- Live KPI cards: Total Revenue ($), Today's Orders, Low Stock Alerts (< 5 items), Active Promos.
- Product CMS: Rich text editor, dynamic attribute box (switches fields based on category, e.g. age range vs gadget tech specs), multi-image upload to InsForge Storage, and variant matrix.
- Order Fulfillment: Carrier selection (FedEx, DHL, USPS), tracking number entry, printable packing slips, and one-click refund/restock handlers.
- Marketing CMS: Reorderable homepage hero slides, announcement bar text/color editor, and discount code creation.

---

## Data Architecture

### Database Tables (InsForge PostgreSQL)

- **`users` & `profiles`**: User accounts with `user_role` enum (`admin`, `store-manager`, `customer`), contact info, and addresses.
- **`categories`**: Hierarchical category tree supporting subcategories (`parent_id`).
- **`products`**: Core product entities including `title`, `slug`, `description`, `curator_notes`, `age_range`, `specs` (JSONB), `is_active`, and `is_featured`.
- **`product_variants`**: SKU, price, compare-at price, stock quantity, attribute swatches (JSONB), and image URLs (JSONB).
- **`orders` & `order_items`**: Order headers with `order_number`, customer info, totals, `order_status`, `payment_status`, carrier, and tracking number; line items snapshot price and variant details.
- **`reviews`**: Customer reviews, star ratings, and moderation flags.
- **`promotions`**: Discount codes, percentage/fixed amounts, usage limits, and expiration dates.
- **InsForge Storage (`products/` bucket)**: Public bucket for optimized media assets and product photography.

---

## Features In Scope

- Responsive storefront layout with Baloo 2 and DM Sans typography.
- InsForge Authentication (Email/Password + Google OAuth) and RBAC middleware (`/admin/*` and `/account/*`).
- PostHog telemetry initialization (browser client in root layout, server client with typed events).
- Dynamic PLP with faceted filtering (age range, price slider, tags, in-stock toggle, sorting).
- Rich PDP with multi-image gallery, variant swatching, specs accordion, curator notes, and reviews.
- Persistent Cart Drawer & Full Cart page with $50 free-shipping progress bar and gift wrap option.
- Secure multi-step checkout with Zod validation, order creation, and stock decrements.
- Customer dashboard with order fulfillment history and public `/track-order` lookup.
- Side-by-side product comparison tool (`/compare`) for up to 4 items.
- Admin dashboard with 4 KPI cards and real-time order stream.
- Admin Product CMS with dynamic category-dependent attribute fields and image uploads.
- Admin Order fulfillment workflow, carrier tracking assignment, printable packing slips, and refunds.
- Admin Marketing CMS for homepage hero slides, announcement bar, and coupon engine.

---

## Features Out of Scope

- Multi-vendor marketplace / external third-party seller accounts (Mirai Mart is a single-brand store).
- Live real-time chat with human support agents.
- Mobile native apps (iOS / Android) — web application is fully mobile-responsive.
- Complex recurring subscription billing.
- Physical point-of-sale (POS) hardware integrations.
- Multi-currency / multi-language localization (USD default for v1).

---

## PostHog Analytics Events

All telemetry adheres to the exact event contracts below:

| Event | When | Key Properties |
| --- | --- | --- |
| `product_viewed` | User views a PDP | `productId`, `title`, `category`, `price` |
| `item_added_to_cart` | User adds item to cart | `productId`, `variantId`, `price`, `quantity` |
| `cart_drawer_opened` | Cart drawer is opened | `cartTotal`, `itemCount` |
| `checkout_started` | User initiates checkout step 1 | `cartTotal`, `itemCount`, `isGuest` |
| `order_completed` | Order successfully placed | `orderNumber`, `totalAmount`, `itemCount`, `paymentMethod` |
| `product_compared` | Product added to comparison | `productIds`, `category` |
| `search_performed` | Search query submitted | `query`, `resultsCount` |

---

## Target Customer

- **Parents & Gift Buyers**: Looking for safe, educational toys categorized clearly by age (`0–1`, `1–3`, `3–5`, `5–8`, `8+ yrs`) and ready-to-gift combos.
- **Tech Enthusiasts & Lifestyle Shoppers**: Seeking curated digital gadgets and modern home decor with clear technical specs and comparison tools.
- **Store Managers & Admins**: Requiring an intuitive, dynamic dashboard to manage inventory, fulfill customer orders, print packing slips, and adjust promotions without engineering intervention.

---

## Success Criteria

- Homepage loads instantly with full visual polish, responsive typography, and clear category navigation.
- Category filtering and search provide sub-100ms UI responsiveness.
- Cart drawer updates optimistically with accurate free-shipping calculations ($50 threshold).
- Checkout creates orders reliably with atomic stock deductions and clear order receipts.
- Customer can track orders in real time via account or standalone `/track-order`.
- Admin panel accurately displays store metrics, supports dynamic product creation, and handles order fulfillment end-to-end.
- PostHog events fire accurately across all key milestones in the customer journey.
