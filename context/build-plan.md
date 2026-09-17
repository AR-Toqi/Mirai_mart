# Mirai Mart — Full-Stack E-Commerce Build Plan

## Core Principle

Full page UI built with mock data first — verified visually before any logic is written. Then functionality is built and wired to the UI step by step. Every feature must be visible and testable before moving to the next. No invisible backend phases.

---

## Phase 1 — Foundation & Authentication

### 01 Storefront Layout & Homepage — Full UI

Build the complete homepage UI with mock data.

**UI:**

* Announcement bar — Sunny Yellow (`#fce35f`) with text "Free shipping on orders over $50 • Use code MIRAI10 for 10% off"


* Glassmorphic Navbar — Mirai Mart logo (Sky Blue monogram + yellow dot), category dropdown ("Gift Combos", "Toys", "Gadgets", "Decor"), Search input, Wishlist badge, Cart drawer trigger, and Account avatar


* Hero section — wide 16px radius carousel card, headline in Baloo 2 ("Play, Live & Discover the Future"), subtext, and dual pill CTAs ("Explore Collection" and "View Gift Guides")


* Category tiles grid — 6 cards: Educational Toys, Cars & Vehicles, Unique Toys, Home Decor, Digital Gadgets, Gift Combos
* "Shop by Age" filter strip — pill chips: `0–1 yr`, `1–3 yrs`, `3–5 yrs`, `5–8 yrs`, `8+ yrs`
* Bestsellers product rail — 4-column card grid with hover badges, rating stars, Baloo 2 titles, prices, and "Add to Cart" buttons


* Curated collections split banner — "Montessori Picks" & "Desk Gadgets"
* Trust strip — Safety Certified, Fast Delivery, 30-Day Returns, Curated Quality
* Footer — sitemap, newsletter signup with 8px radius input, and payment badges



**Logic:**

* Account button → `/login` if unauthenticated, `/account` if authenticated
* Category tiles & Age chips → navigate to `/category/[slug]` with query parameters

---

### 02 Authentication & RBAC

InsForge Authentication — Email/Password, Google OAuth, and Role-Based Access Control.

**UI:**

* Login & Register modal / standalone page (`/login`, `/register`)
* Role badge in user profile navigation: `admin`, `store-manager`, `customer`

**Logic:**

* InsForge Auth integration (Email/Password + Google OAuth)
* Session management via JWT and cookies
* RBAC Middleware protecting:
* `/account/*` (Customer, Store Manager, Admin)
* `/admin/*` (Strictly `admin` and `store-manager`)
* `/admin/settings/staff` (Strictly `admin`)


* After customer login → redirect to `/account` or return URL; after admin login → redirect to `/admin/dashboard`

---

### 03 PostHog Initialization

Set up PostHog before any events fire. Must be done before any agent features.

**Logic:**

* Create `lib/posthog-client.ts` — PostHog browser client, initialized with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
* Create `lib/posthog-server.ts` — PostHog server client with `flushAt: 1` and `flushInterval: 0`
* Initialize PostHog in root app layout (`app/layout.tsx`) — wraps entire app
* `posthog.identify()` called after successful login with user ID
* `posthog.reset()` called on logout

---

### 04 Database Schema & Seeds

Execute the InsForge SQL schema migration and seed data.

**Logic:**

* Create `users` table with `user_role` enum (`admin`, `store-manager`, `customer`)
* Create `profiles` table linked via foreign key
* Create `categories` table with hierarchical `parent_id` support
* Create `products` table (including `curator_notes`, `age_range`, `specs` JSONB, `is_active`, `is_featured`)
* Create `product_variants` table (`sku`, `price`, `stock_quantity`, `attributes` JSONB, `images` JSONB)
* Create `orders` and `order_items` tables with `order_status` and `payment_status` enums
* Create `reviews` and `promotions` tables
* Create `products` public storage bucket in InsForge for media assets
* Execute initial seed script for categories (including **Gift Combos** and subcategories `newborn-babies`, `birthday-babies`, `home-decor-gifts`, `gadget-bundles`)

---

## Phase 2 — Catalog, Discovery & PDP

### 05 Category & Product Listing Page (PLP) — Full UI

Build the complete PLP UI with mock data.

**UI:**

* Category header banner with Baloo 2 title, breadcrumbs, and subcategory pill chips


* Left Filter Sidebar (280px, 16px radius card):


* Age Range multi-select (`0-1`, `1-3`, `3-5`, `5-8`, `8+`)
* Developmental Skills / Style tags
* Dual-handle price slider ($10 – $200)
* In Stock only toggle


* Product Grid toolbar: item count, active filter tags with dismiss `x`, Grid/List view switcher, and Sort dropdown
* 3x3 Product Cards: high-res image, "Bestseller" / "New" pill badges, star ratings, price, and Sky Blue "Add to Cart" button


* Pagination controls with active pill indicator

---

### 06 Dynamic Filtering & Search Logic

Wire PLP and Search to real InsForge DB data.

**Logic:**

* Server Action in `lib/actions/product.actions.ts` to query `products` and `product_variants` with dynamic SQL clauses:
* Category / Subcategory slug matching
* Age range array overlap
* Price range min/max bounds
* Sort order (price asc/desc, newest, rating)


* Predictive search API (`/api/search`) with thumbnail previews and debounce handling
* Client-side URL query param sync (`?category=gift-combos&age=1-3&sort=price_asc`)

---

### 07 Product Detail Page (PDP) — Full UI & Logic

Build the complete PDP UI and wire to real InsForge DB product data.

**UI:**

* Breadcrumb navigation: Home > Category > Subcategory > Product Title
* 60/40 Split Showcase:
* Left: Multi-image gallery viewer with hover zoom, 360° asset badge, and thumbnail carousel
* Right: Category pill, Baloo 2 product title, rating summary, pricing with discount badge, variant swatch selectors (size, color, bundle), stock indicator, quantity stepper, and "Why We Love It" curator card




* Accordion section: Tech Specs / Dimensions table, Shipping & 30-Day Returns policy
* "Frequently Bought Together" bundle card with one-click multi-item add
* Verified Customer Reviews list and rating breakdown

**Logic:**

* Server Component fetches product by slug from `products` joining `product_variants`, `categories`, and approved `reviews`
* Variant selector switches active SKU, real-time price, stock status, and image gallery
* "Notify Me When Back in Stock" email capture action for out-of-stock SKUs

---

## Phase 3 — Cart Drawer & Checkout

### 08 Cart Drawer & Page — Full UI & Local State

Build the Cart Drawer and Full Cart page UI with optimistic local state.

**UI:**

* Free-shipping dynamic progress bar ($50 threshold) with Sky Blue fill


* Line items list: thumbnail, variant label, live quantity stepper, remove icon, and "Save for Later"
* Gift wrap toggle card (`+$3.99`) with gift message text area
* Order summary card (16px radius): Subtotal, Estimated Tax, Shipping, Promo code input with "Apply" button, Total amount, and Sky Blue "Proceed to Checkout" button



**Logic:**

* Persistent Client-side Cart state (Zustand / React Context + `localStorage`)
* Real-time calculations: Subtotal, automatic discount rules, and free-shipping progress
* Gift option state persistence into cart object payload

---

### 09 Checkout Flow & Order Placement

Build the multi-step checkout UI and wire order generation to InsForge DB.

**UI:**

* Minimal secure checkout layout with padlock icon and progress stepper
* Step 1: Contact info & Shipping Address form (Zod validated)
* Step 2: Shipping Method radio cards (Standard Free vs Express $9.99)
* Step 3: Payment method accordion (Card fields, Mock Payment trigger)
* Sticky order summary sidebar with item thumbnails and total breakdown
* Order Confirmation screen (`/checkout/success/[orderNumber]`) with tracking link and order receipt

**Logic:**

* Server Action in `lib/actions/order.actions.ts`:
* Validates cart items, variant pricing, and stock levels against `product_variants`
* Creates record in `orders` with unique `order_number`
* Inserts all line items into `order_items`
* Decrements `stock_quantity` in `product_variants`
* Clears client-side cart upon successful creation


* Supports both Guest Checkout (via `customer_email`) and Authenticated Checkout

---

## Phase 4 — Customer Portal & Features

### 10 Customer Account & Order History — Full UI & Logic

Build the customer account portal and wire to real user data.

**UI:**

* Account dashboard: User greeting, member status pill, quick metrics (Active Orders, Saved Items)
* Orders list tab: Order cards with status pills (`Pending`, `Packed`, `Shipped`, `Delivered`, `Refunded`), item thumbnails, tracking numbers, and "Buy Again" button
* Order detail modal / page with fulfillment timeline
* Saved addresses and profile settings form

**Logic:**

* Server Component fetches orders where `user_id = current_user.id`
* Standalone public order tracking page (`/track-order`) querying by `order_number` and `customer_email`
* Profile update Server Action writing to `profiles` table

---

### 11 Product Comparison Page (`/compare`)

Build the side-by-side spec comparison tool for gadgets and home decor.

**UI:**

* Sticky header row with 2–4 selected product cards (image, title, price, "Add to Cart", remove `x`)
* Comparison table with alternating row highlights for specs: Battery Life, Connectivity, Dimensions, Materials, Suitability, Warranty

**Logic:**

* Comparison state stored in Client-side state (max 4 items)
* Dynamic attribute extractor parsing `products.specs` JSONB keys and rendering aligned comparison rows

---

## Phase 5 — Admin Management Panel

### 12 Admin Layout & Dashboard — Full UI & Real Metrics

Build the protected admin dashboard layout and wire real metrics.

**UI:**

* Dark Slate (`#191c1e`) sidebar navigation: Dashboard, Products, Inventory, Orders, Marketing/CMS, Store Settings


* 4 Top KPI cards: Total Revenue ($), Orders Today (count), Low Stock Alerts (count), Active Promotions
* Recent Orders Feed: table with order ID, customer name, date, total, payment status badge, fulfillment status pill
* Actionable Alerts widget: low stock warnings (< 5 items)

**Logic:**

* Server Component queries:
* `orders` table for total revenue sum and today's order count
* `product_variants` table where `stock_quantity <= 5`
* `orders` table ordered by `created_at` descending (limit 10)


* Role protection guard ensuring only `admin` and `store-manager` access

---

### 13 Admin Product & Inventory CMS

Build the complete Product Management and dynamic schema editor.

**UI:**

* Product list table with category filters, stock level badges, status toggles (`Active` / `Draft`), and search
* Add/Edit Product Form:
* General: Title, Slug, Rich text description, Curator notes ("Why we love it")
* Dynamic Attributes Box: Selecting "Gift Combos" or "Educational Toys" reveals category-specific fields (Age Range, Occasion, Tech Specs JSON)
* Variants Matrix: Add multiple SKUs, prices, compare-at prices, stock counts, and image uploads
* Media dropzone: drag-and-drop file upload to InsForge Storage



**Logic:**

* Server Actions in `lib/actions/admin.actions.ts`:
* Upload image files to InsForge Storage `products/` bucket and retrieve public URLs
* Insert / Update records in `products` and `product_variants` in a single transaction
* Bulk stock update and product archiving



---

### 14 Admin Order Fulfillment & RMA Management

Build the Order Processing and Returns workflow.

**UI:**

* Order management table with multi-criteria filtering: Status (`Pending`, `Packed`, `Shipped`, `Delivered`, `Refunded`), Date Range, Payment Status
* Order Fulfillment Detail Drawer / Page:
* Customer profile, shipping address, order items with warehouse bin notes
* Fulfillment actions: Carrier dropdown (FedEx, DHL, USPS), Tracking Number input, "Mark as Shipped" button
* Printable Packing Slip / Invoice view
* Returns / Refund handler: "Issue Full Refund", "Issue Store Credit", "Restock Items"



**Logic:**

* Server Action updates `orders.status`, `orders.tracking_number`, and `orders.carrier`
* Refund Server Action updates `orders.status = 'refunded'` and restores inventory in `product_variants`

---

### 15 Admin Marketing & Storefront CMS

Build the banner manager and coupon code engine.

**UI:**

* Hero Slider Manager: Drag-and-drop reorderable list of the 3 homepage slides with image swap, Baloo 2 headline editor, subtext, and CTA link pickers


* Top Announcement Bar Manager: On/Off switch, color picker (defaults to `#fce35f` Sunny Yellow), and editable text box


* Coupon Codes Manager: Create discount codes (`percentage`, `fixed_amount`, `free_shipping`), usage limits, and expiration dates

**Logic:**

* Storefront CMS settings stored in a JSON configuration table in InsForge
* Homepage reads CMS config dynamically with revalidation (`revalidatePath('/')`)
* Coupon validation Server Action applying active promotion rules to checkout totals

---

### 16 Admin Category Management CMS (`/admin/categories`)

Build the complete Category & Subcategory taxonomy manager.

**UI:**
* Category Data Grid & Tree view: Name, Slug, Parent Category hierarchy pill, Icon/Thumbnail, linked active product count badge, Display Order, Active/Draft status toggle, and Edit/Delete actions
* Add/Edit Category Modal: Name, Auto-generated Slug (editable), Description, Parent Category dropdown (hierarchical nesting), Icon Picker, Thumbnail upload, Display Order, and Status switch
* Delete Guard: Confirmation modal with dependency check preventing deletion of categories containing active products

**Logic:**
* Server Actions in `actions/admin.ts` for category CRUD (`createAdminCategoryAction`, `updateAdminCategoryAction`, `deleteAdminCategoryAction`, `toggleAdminCategoryStatusAction`)
* Direct mutation against InsForge PostgreSQL `categories` table with `parent_id` foreign keys
* Storefront cache revalidation for Category Navigation, Megamenu, and PLPs (`revalidatePath('/')`, `revalidatePath('/category/[slug]')`)

---

### 17 Admin Customer Directory & CRM (`/admin/customers`)

Build the customer account directory and customer profile viewer.

**UI:**
* Customers Data Table: Avatar/Initials, Full Name, Email, Phone, Role badge (`customer`, `admin`, `store-manager`), Total Orders count, Lifetime Spend (LTV in ৳), Registered date, and Action trigger
* Search & Filters: Search by name, email, or phone; filter by Role or Order Activity status
* Customer Detail Drawer / Modal: Full profile card, contact info, default and saved shipping addresses, chronological order history table with status badges and totals, and quick actions

**Logic:**
* Server Actions querying InsForge `profiles` table joined with aggregated metrics from `orders` (`total_orders`, `lifetime_value`, `last_order_date`)
* Role-based access control protecting customer data
* Export customer list to CSV

---

### 18 Admin Advanced Sales Analytics & Reporting (`/admin/analytics`)

Build the dedicated analytical command center for executive sales reporting and business intelligence.

**UI:**
* Metric Ribbons: Gross Sales, Net Revenue, Orders Volume, Average Order Value (AOV), Return/Refund Rate, and Repeat Customer Rate with period-over-period percentage growth indicators
* Timeframe Selector: Preset tabs ("Today", "Last 7 Days", "Last 30 Days", "This Quarter", "Year to Date") + custom date range picker
* Interactive Visualizations:
  * Sales & Orders Trend spline curve with hover data points and comparison period overlay
  * Category Contribution breakdown (Donut / Bar chart showing sales by department: Toys, Gadgets, Gift Combos, Decor)
  * Payment Methods & Fulfillment Breakdown (MFS bKash/Nagad vs Cash on Delivery)
  * Top Performing Products Leaderboard with volume, revenue, and inventory conversion
* Export Engine: Download PDF/CSV report of analytical summary

**Logic:**
* Server Actions in `actions/admin.ts` aggregating metrics across `orders`, `order_items`, and `products`
* Time-bucketed aggregation for daily, weekly, and monthly intervals
* High-performance queries with caching

---

## Feature Summary Count

| Phase | Description | Features |
| --- | --- | --- |
| **Phase 1 — Foundation & Authentication** | Homepage UI, InsForge Auth + RBAC, PostHog Initialization, Database Migrations & Seeds | 4 |
| **Phase 2 — Catalog, Discovery & PDP** | PLP UI, Dynamic Multi-Filter Search, Rich PDP & Variant Logic | 3 |
| **Phase 3 — Cart Drawer & Checkout** | Cart Drawer & Free Shipping Bar, Multi-Step Checkout & Orders | 2 |
| **Phase 4 — Customer Portal & Features** | Customer Account & Tracking, Spec Comparison Page | 2 |
| **Phase 5 — Admin Management Panel** | Admin Dashboard & KPIs, Product/Variant CMS, Orders/Fulfillment, Marketing CMS, Category CMS, Customer CRM, Sales Analytics | 7 |
| **Total** |  | **18** |