# UI Rules

Concise rules for building the Mirai Mart UI. These rules cover the most critical patterns, layout constraints, token usages, and styling standards to keep the entire application visually consistent, delightful, and aligned across all development sessions.

---

## Typography

Always import **Baloo 2** (Headings) and **DM Sans** (Body/UI) via `next/font/google` in the root layout (`app/layout.tsx`).

```typescript
import { Baloo_2, DM_Sans } from "next/font/google";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});
```

- Apply `--font-heading` and `--font-sans` variable classes to `<html>` / `<body>` in root layout.
- Headings (`h1`, `h2`, `h3`, hero titles, product card names) use `font-heading font-bold` (`Baloo 2`).
- Body text, specs, buttons, navigation, and inputs use `font-sans` (`DM Sans`).
- Never use browser default serif or sans-serif fonts.

---

## Layout & Containers

- **Storefront Max-Width**: `1440px` (`max-w-7xl` or `1440px`), centered (`mx-auto`).
- **Main Storefront Padding**: `px-4 sm:px-6 lg:px-8`.
- **Vertical Spacing Between Homepage Sections**: `py-12 lg:py-16` (48px – 64px gap).
- **Storefront Header**: Height `72px`, glassmorphic sticky header (`sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-border/40`).
- **Top Announcement Bar**: Height `36px`, sticky top above header (`bg-[#fce35f] text-slate-900 text-xs font-semibold`).
- **Admin Layout**: Fixed Dark Slate sidebar (`w-64 bg-[#191c1e] text-white`) + top bar with breadcrumbs and user avatar.

---

## Cards & Surfaces

Every product rail, category tile, filter box, and account section lives in a tokenized card:

```
background: #FFFFFF (or var(--card))
border: 1px solid #E2E8F0 (or var(--border))
border-radius: 16px (rounded-2xl)
padding: 16px to 24px (p-4 to p-6)
box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05) (shadow-sm hover:shadow-md)
```

- Never use dark or saturated colored card backgrounds on storefront — keep surfaces clean white (`#FFFFFF`).
- Color goes inside cards via pill badges, product photography, price tags, and buttons.

---

## Color Tokens & Palette

| Token | Class / CSS Variable | Hex Value | Intended Usage |
| --- | --- | --- | --- |
| **Primary (Sky Blue)** | `bg-primary` / `text-primary` | `#0284C7` | Primary buttons, active pill chips, brand marks, links |
| **Accent (Sunny Yellow)** | `bg-accent` / `text-accent-foreground` | `#FCE35F` | Announcement bar, brand dot, promo badges, discount highlights |
| **Admin Slate** | `bg-[#191c1e]` | `#191C1E` | Admin sidebar navigation & dark utility bars |
| **Canvas Background** | `bg-background` | `#F8FAFC` | Main storefront page canvas |
| **Card Surface** | `bg-card` | `#FFFFFF` | Product cards, PDP panels, modals, drawers |
| **Border & Outline** | `border-border` | `#E2E8F0` | Card borders, dividers, input outlines |
| **Text Foreground** | `text-foreground` | `#0F172A` | Primary headlines and body copy |
| **Text Muted** | `text-muted-foreground` | `#64748B` | Labels, curator notes, secondary specs |
| **Success / Stock** | `bg-emerald-500` / `text-emerald-600` | `#10B981` | In-stock indicator, free-shipping unlocked |
| **Warning / Low Stock**| `bg-amber-500` / `text-amber-600` | `#F59E0B` | Low stock alert (< 5 items), pending fulfillment |
| **Destructive** | `bg-red-500` / `text-red-600` | `#EF4444` | Out of stock, error toasts, refund status |

---

## Buttons

**Primary Button (Sky Blue):**
```css
background: #0284c7;
color: #ffffff;
border-radius: 9999px; /* or rounded-xl for rectangular buttons */
padding: 10px 20px;
font-family: var(--font-sans);
font-size: 14px;
font-weight: 600;
transition: background 0.15s ease;
```
*Hover state*: `bg-sky-700` (`#0369a1`).

**Secondary / Outlined Button:**
```css
background: #ffffff;
border: 1px solid #e2e8f0;
color: #0f172a;
border-radius: 9999px;
padding: 10px 20px;
font-size: 14px;
font-weight: 500;
```
*Hover state*: `bg-slate-50 border-slate-300`.

**Accent Button (Sunny Yellow):**
```css
background: #fce35f;
color: #0f172a;
border-radius: 9999px;
padding: 10px 20px;
font-weight: 700;
```

---

## Badges & Age Chips

All badges and chips use pill geometry (`rounded-full`):

- **Age Filter Chips**: `rounded-full px-4 py-2 text-sm font-medium border border-border bg-white text-slate-700 hover:border-primary`. When active: `bg-primary text-white border-primary shadow-sm`.
- **Product Pill Badges**:
  - `Bestseller`: `bg-[#fce35f] text-slate-900 text-xs font-bold px-2.5 py-0.5 rounded-full`
  - `New`: `bg-sky-100 text-sky-700 text-xs font-bold px-2.5 py-0.5 rounded-full`
  - `Sale`: `bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full`
  - `Curator's Pick`: `bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full`

---

## Form Inputs & Selectors

```
background: #FFFFFF
border: 1px solid #E2E8F0
border-radius: 10px (rounded-xl)
padding: 10px 14px
font-size: 14px
color: #0F172A
placeholder: #94A3B8
focus: outline-none ring-2 ring-primary/20 border-primary
```

---

## Free-Shipping Dynamic Progress Bar

Inline progress bar displayed at top of the Cart Drawer:

```
height: 6px
border-radius: 9999px (rounded-full)
track background: #E2E8F0
fill background: #0284C7 (Sky Blue)
completed background ($50+): #10B981 (Emerald)
```

- When `subtotal < $50`: Text reads *"Add $[remaining] more for Free Delivery!"* with Sky Blue fill.
- When `subtotal >= $50`: Text reads *"🎉 You've unlocked Free Delivery!"* with Emerald fill.

---

## Tables & Lists (Admin & Compare)

- Clean white rows separated by `border-b border-border/80`.
- Column header row: `text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-slate-50/60 p-3`.
- Row hover: `hover:bg-slate-50/80 transition-colors`.
- Action buttons: subtle icons with tooltips (`lucide-react`).

---

## Empty States

Every list, search result, cart drawer, and order feed must have an informative empty state:
- Clean SVG icon (e.g. `ShoppingBag`, `SearchX`, `PackageOpen` from `lucide-react`) in `text-muted-foreground`.
- Friendly Baloo 2 title (e.g. "Your cart is empty!").
- Short explanatory body text in DM Sans.
- Primary CTA button directing the user to explore products or categories.

---

## Do Nots

- **Never use `"use client"` directly in `page.tsx` or `layout.tsx`** — all main pages must remain Server Components. Isolate interactive logic into leaf Client Components in `components/`.
- **Never use hardcoded arbitrary hex colors** outside defined tokens — always use `bg-primary`, `bg-accent`, `text-muted-foreground`, etc.
- **Never use browser default unstyled typography** — always use `font-heading` (`Baloo 2`) for titles and `font-sans` (`DM Sans`) for body/UI.
- **Never cause Layout Shift (CLS) on images** — always specify explicit `width`, `height`, or `fill` with `sizes` on `next/image`.
- **Never show raw database or system error strings** to users — always present clean, human-readable feedback.
- **Never nest more than 2 levels of border radius** inside a single card container.
- **Never use default unstyled scrollbars or browser select dropdowns** where rich custom UI is specified.
