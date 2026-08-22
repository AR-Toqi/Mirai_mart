# UI Rules

Concise rules for building the Mirai Mart UI. These rules cover the most critical patterns, layout constraints, token usages, and styling standards directly derived from `context/design/Mirai-mart_design-system.png` to keep the entire application visually consistent, delightful, and aligned across all development sessions.

---

## Typography

Always import **Baloo 2** (Headings) and **DM Sans** (Body/UI) via `next/font/google` in the root layout (`app/layout.tsx`).

```typescript
import { Baloo_2, DM_Sans } from "next/font/google";

export const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});
```

- Headings (`h1`, `h2`, `h3`, hero titles, section headlines) use `font-heading` (`Baloo 2`).
  - **Display LG**: `text-[48px] leading-[56px] font-bold` (700)
  - **Headline LG**: `text-[32px] leading-[40px] font-semibold` (600)
  - **Headline MD**: `text-[24px] leading-[32px] font-semibold` (600)
  - **Headline SM**: `text-[20px] leading-[28px] font-medium` (500)
- Body text, specs, buttons, navigation, and inputs use `font-sans` (`DM Sans`).
  - **Body LG**: `text-[18px] leading-[28px] font-normal` (400)
  - **Body MD**: `text-[16px] leading-[24px] font-normal` (400)
  - **Body SM**: `text-[14px] leading-[20px] font-normal` (400)
  - **Label MD**: `text-[14px] leading-[16px] font-bold` (700)
  - **Label SM**: `text-[12px] leading-[16px] font-medium` (500)
- Never use browser default serif or unstyled sans-serif fonts.

---

## Layout & Containers

- **Storefront Max-Width**: `1440px` (`max-w-7xl` or `1440px`), centered (`mx-auto`).
- **Main Storefront Padding**: `px-4 sm:px-6 lg:px-8`.
- **Vertical Spacing Between Homepage Sections**: `py-12 lg:py-16` (48px – 64px gap).
- **Storefront Header**: Height `72px`, glassmorphic sticky header (`sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-neutral-border`).
- **Top Announcement Bar**: Height `36px`, sticky top above header (`bg-secondary text-neutral-dark text-xs font-semibold`).
- **Admin Layout**: Fixed Dark Slate sidebar (`w-64 bg-neutral-dark text-white`) + top bar with breadcrumbs and user avatar.

---

## Cards & Surfaces

Every product rail, category tile, filter box, and account section lives in a tokenized card:

```
background: #FFFFFF (bg-surface)
border: 1px solid #E7E8EB (border-neutral-border)
border-radius: 16px (rounded-xl)
padding: 16px to 24px (p-4 to p-6)
box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05) (shadow-sm hover:shadow-md)
```

- Keep storefront surfaces clean white (`bg-surface`) on a cool background canvas (`bg-neutral-bg` `#F8F9FC`).
- Color goes inside cards via pill badges, product photography, price tags, and buttons.

---

## Color Tokens & Palette

| Token | Class / CSS Variable | Hex Value | Intended Usage |
| --- | --- | --- | --- |
| **Primary** | `bg-primary` / `text-primary` | `#0A98C3` | Primary buttons, active pill chips, brand marks, links |
| **Primary Light** | `bg-primary-light` | `#71D7F6` | Interactive hover highlights, secondary accents |
| **Primary Surface** | `bg-primary-surface` | `#BEE9FF` | Secondary button bg, cart icon button bg, Best Seller badge |
| **Secondary (Accent)** | `bg-secondary` / `text-secondary` | `#FCE35F` | Accent button, announcement bar, brand dot, -20% badge |
| **Secondary Light** | `bg-secondary-light` | `#FFE680` | Warm promo banners, highlighted alerts |
| **Tertiary** | `bg-tertiary` / `text-tertiary` | `#007EA3` | Secondary button text, Exclusive badge text, deep accents |
| **Tertiary Surface** | `bg-tertiary-surface` | `#B3EBFF` | Exclusive badge background |
| **Neutral Dark** | `text-neutral-dark` / `bg-neutral-dark` | `#191C1E` | Primary headlines, main body text, admin sidebar shell |
| **Neutral Muted** | `text-neutral-muted` | `#6E797F` | Subtitles, category tags, placeholders, specs |
| **Neutral Border** | `border-neutral-border` | `#E7E8EB` | Card borders, dividers, input outlines |
| **Neutral Background** | `bg-neutral-bg` | `#F8F9FC` | Storefront main canvas background |
| **Card Surface** | `bg-surface` | `#FFFFFF` | Product cards, PDP panels, modals, drawers |
| **Success** | `bg-success` / `text-success` | `#22C55E` | In-stock indicator, New badge, success feedback |
| **Error / Danger** | `bg-error` / `text-error` | `#EF4444` | Out of stock, Sale badge, error alerts |
| **Warning** | `bg-warning` / `text-warning` | `#F59E0B` | Low stock alert (< 5 items), -20% badge |

---

## Buttons

1. **Primary Button:**
   - Background: `bg-primary` (`#0A98C3`), Text: `text-white`, Radius: `rounded-md` (`8px`), Padding: `px-5 py-2.5`, Font: `font-sans font-medium`.
   - Hover: `hover:opacity-95`.

2. **Secondary Button:**
   - Background: `bg-primary-surface` (`#BEE9FF`), Text: `text-tertiary` (`#007EA3`), Radius: `rounded-md` (`8px`), Padding: `px-5 py-2.5`, Font: `font-sans font-medium`.

3. **Accent Button:**
   - Background: `bg-secondary` (`#FCE35F`), Text: `text-neutral-dark` (`#191C1E`), Radius: `rounded-md` (`8px`), Padding: `px-5 py-2.5`, Font: `font-sans font-bold`.

4. **Outline Button:**
   - Background: `bg-transparent`, Border: `border border-primary` (`#0A98C3`), Text: `text-primary` (`#0A98C3`), Radius: `rounded-md` (`8px`), Padding: `px-5 py-2.5`, Font: `font-sans font-medium`.

---

## Badges

All status badges use rounded pill geometry (`rounded-full px-3 py-1 text-xs font-bold`):

- **New**: `bg-success-light` (`#DCFCE7`) + `text-success` (`#22C55E`)
- **Sale**: `bg-error-light` (`#FEE2E2`) + `text-error` (`#EF4444`)
- **-20%**: `bg-warning-light` (`#FEF3C7`) + `text-warning` (`#F59E0B`)
- **Best Seller**: `bg-primary-surface` (`#BEE9FF`) + `text-primary` (`#0A98C3`)
- **Exclusive**: `bg-tertiary-surface` (`#B3EBFF`) + `text-tertiary` (`#007EA3`)

---

## Form Inputs & Selectors

```
Background: #FFFFFF or #F8F9FC
Border: 1px solid #E7E8EB (border-neutral-border)
Border Radius: 8px (rounded-md)
Padding: 10px 14px (px-3.5 py-2.5)
Text: #191C1E (text-neutral-dark)
Placeholder: #6E797F (text-neutral-muted)
Focus: outline-none ring-2 ring-primary/20 border-primary
```

---

## Product Card Pattern

- Container: `bg-surface border border-neutral-border rounded-xl shadow-sm hover:shadow-md transition-shadow p-4`
- Image Container: `rounded-lg overflow-hidden relative` with floating Wishlist button (top-left) and Badge (top-right).
- Title: `font-heading font-semibold text-lg text-neutral-dark` (`Baloo 2`).
- Subtitle / Category: `text-xs font-sans text-neutral-muted` ("Creative • Educational").
- Price: `text-base font-bold font-sans text-neutral-dark` with Bangladeshi Taka (`৳ 1,450`).
- Add to Cart: Mini icon button `bg-primary-surface text-primary p-2 rounded-md hover:bg-primary-light transition-colors`.

---

## Free-Shipping Dynamic Progress Bar

Inline progress bar displayed at top of the Cart Drawer:

```
Height: 6px
Border Radius: 9999px (rounded-full)
Track Background: #E7E8EB (border-neutral-border)
Fill Background: #0A98C3 (Primary)
Completed Background (৳ 999+): #22C55E (Success)
```

- When `subtotal < ৳ 999`: Text reads *"Add ৳[remaining] more for Free Delivery!"* with Primary fill.
- When `subtotal >= ৳ 999`: Text reads *"🎉 Free shipping on orders over ৳ 999 unlocked!"* with Success fill.

---

## Do Nots

- **Never use hardcoded arbitrary hex colors** outside defined tokens — always use `bg-primary`, `bg-secondary`, `text-neutral-dark`, etc.
- **Never use browser default unstyled typography** — always use `font-heading` (`Baloo 2`) for titles and `font-sans` (`DM Sans`) for body/UI.
- **Never use raw Tailwind default scale colors** (e.g. `bg-blue-600`, `text-gray-900`) — use tokenized semantic classes.
- **Never cause Layout Shift (CLS) on images** — always specify explicit `width`, `height`, or `fill` with `sizes` on `next/image`.
- **Never use hardcoded USD currency `$`** — storefront currency is strictly Bangladeshi Taka **`৳`**.
