# UI Tokens

Design tokens for Mirai Mart. All colors, typography, spacing, shadows, border radii, and component values extracted directly from the approved design system image (`context/design/Mirai-mart_design-system.png`). Use these exact token values throughout the codebase — never hardcode raw hex values or use unconfigured Tailwind color scales.

---

## How to Use

This project uses **Tailwind CSS v4**. All design tokens are defined using the `@theme` directive in `app/globals.css`.

Tailwind v4 automatically generates utility classes from `@theme` variables:

- `--color-primary` → `bg-primary`, `text-primary`, `border-primary`
- `--color-primary-light` → `bg-primary-light`, `text-primary-light`
- `--color-primary-surface` → `bg-primary-surface`, `text-primary-surface`
- `--color-secondary` → `bg-secondary`, `text-secondary`, `border-secondary`
- `--color-tertiary` → `bg-tertiary`, `text-tertiary`, `border-tertiary`
- `--color-neutral-dark` → `text-neutral-dark`, `bg-neutral-dark`
- `--color-neutral-muted` → `text-neutral-muted`
- `--color-neutral-border` → `border-neutral-border`
- `--color-neutral-bg` → `bg-neutral-bg`

```tsx
// Correct — uses generated utility classes from @theme
className="bg-surface text-neutral-dark border-neutral-border rounded-xl shadow-sm"

// Also correct — references CSS variable directly
style={{ color: 'var(--color-primary)' }}

// Never — hardcoded arbitrary hex values
className="bg-[#0A98C3] text-[#191C1E]"

// Never — generic unconfigured Tailwind default colors
className="bg-purple-500 text-gray-600"
```

---

## globals.css — Complete Token Definition

```css
@import "tailwindcss";

@theme {
  /* Typography */
  --font-heading: "Baloo 2", cursive, sans-serif;
  --font-sans: "DM Sans", sans-serif;

  /* Brand Primary */
  --color-primary: #0a98c3;
  --color-primary-light: #71d7f6;
  --color-primary-surface: #bee9ff;
  --color-primary-foreground: #ffffff;

  /* Brand Secondary */
  --color-secondary: #fce35f;
  --color-secondary-light: #ffe680;
  --color-secondary-surface: #fff3b3;
  --color-secondary-foreground: #191c1e;

  /* Brand Tertiary */
  --color-tertiary: #007ea3;
  --color-tertiary-light: #4cb3c9;
  --color-tertiary-surface: #b3ebff;
  --color-tertiary-foreground: #ffffff;

  /* Neutrals */
  --color-neutral-dark: #191c1e;
  --color-neutral-muted: #6e797f;
  --color-neutral-border: #e7e8eb;
  --color-neutral-bg: #f8f9fc;
  --color-surface: #ffffff;

  /* Semantic Feedback */
  --color-success: #22c55e;
  --color-success-light: #dcfce7;
  --color-success-surface: #f0fdf4;
  --color-success-foreground: #15803d;

  --color-error: #ef4444;
  --color-error-light: #fee2e2;
  --color-error-surface: #fef2f2;
  --color-error-foreground: #b91c1c;

  --color-warning: #f59e0b;
  --color-warning-light: #fef3c7;
  --color-warning-surface: #fffbeb;
  --color-warning-foreground: #b45309;

  /* Admin Theme Tokens */
  --color-admin-sidebar: #191c1e;
  --color-admin-sidebar-hover: #262a2d;
  --color-admin-sidebar-active: #0a98c3;
  --color-admin-card: #ffffff;

  /* Border Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0px 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0px 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0px 8px 24px rgba(0, 0, 0, 0.10);
  --shadow-xl: 0px 20px 40px rgba(0, 0, 0, 0.12);

  /* Spacing Grid (8px Base) */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-12: 48px;
  --spacing-16: 64px;
}
```

---

## Color Tokens Breakdown

### Brand Primary (`#0A98C3`)
| Token Class | Variable | Hex Value | Usage |
| --- | --- | --- | --- |
| `bg-primary` / `text-primary` | `--color-primary` | `#0A98C3` | Primary buttons, active highlights, icons |
| `bg-primary-light` | `--color-primary-light` | `#71D7F6` | Secondary accents, interactive hover highlights |
| `bg-primary-surface` | `--color-primary-surface` | `#BEE9FF` | Secondary button background, cart icon button bg, Best Seller badge bg |

### Brand Secondary (`#FCE35F`)
| Token Class | Variable | Hex Value | Usage |
| --- | --- | --- | --- |
| `bg-secondary` / `text-secondary` | `--color-secondary` | `#FCE35F` | Accent buttons, announcement bar, brand logo dot, -20% badges |
| `bg-secondary-light` | `--color-secondary-light` | `#FFE680` | Subtle promo banner backgrounds |
| `bg-secondary-surface` | `--color-secondary-surface` | `#FFF3B3` | Light warm alert containers, soft promo chips |

### Brand Tertiary (`#007EA3`)
| Token Class | Variable | Hex Value | Usage |
| --- | --- | --- | --- |
| `bg-tertiary` / `text-tertiary` | `--color-tertiary` | `#007EA3` | Secondary button text, Exclusive badge text, deep accents |
| `bg-tertiary-light` | `--color-tertiary-light` | `#4CB3C9` | Tech spec accents, secondary graph indicators |
| `bg-tertiary-surface` | `--color-tertiary-surface` | `#B3EBFF` | Exclusive badge background, info pill tints |

### Neutrals
| Token Class | Variable | Hex Value | Usage |
| --- | --- | --- | --- |
| `text-neutral-dark` / `bg-neutral-dark` | `--color-neutral-dark` | `#191C1E` | Primary headlines, main body text, accent button text, admin sidebar |
| `text-neutral-muted` | `--color-neutral-muted` | `#6E797F` | Subtitles, categories, placeholders, metadata |
| `border-neutral-border` | `--color-neutral-border` | `#E7E8EB` | Input borders, card borders, dividers |
| `bg-neutral-bg` | `--color-neutral-bg` | `#F8F9FC` | Storefront main canvas background |
| `bg-surface` | `--color-surface` | `#FFFFFF` | Cards, panels, modals, dropdowns |

### Semantic Feedback
| Token Class | Variable | Hex Value | Usage |
| --- | --- | --- | --- |
| `bg-success` / `text-success` | `--color-success` | `#22C55E` | In-stock indicator, success alerts, New badge |
| `bg-error` / `text-error` | `--color-error` | `#EF4444` | Out of stock, error alerts, Sale badge |
| `bg-warning` / `text-warning` | `--color-warning` | `#F59E0B` | Low stock warning, limited edition alert |

---

## Typography Scale

Strict dual font pairing: **Baloo 2** for Headings and **DM Sans** for Body & UI.

| Style | Font | Size | Weight | Line Height | Example / Purpose |
| --- | --- | --- | --- | --- | --- |
| **Display LG** | `Baloo 2` | `48px` | `700` (Bold) | `56px` | Hero headlines ("Play, Live & Discover") |
| **Headline LG** | `Baloo 2` | `32px` | `600` (SemiBold) | `40px` | Main section titles ("Future of Play") |
| **Headline MD** | `Baloo 2` | `24px` | `600` (SemiBold) | `32px` | Category titles, modal headers ("Smart & Fun Toys") |
| **Headline SM** | `Baloo 2` | `20px` | `500` (Medium) | `28px` | Card headers, subsections ("Educational & Creative") |
| **Body LG** | `DM Sans` | `18px` | `400` (Regular) | `28px` | Featured paragraph copy, lead intro text |
| **Body MD** | `DM Sans` | `16px` | `400` (Regular) | `24px` | Standard body descriptions, product descriptions |
| **Body SM** | `DM Sans` | `14px` | `400` (Regular) | `20px` | Secondary text, specifications, reviews |
| **Label MD** | `DM Sans` | `14px` | `700` (Bold) | `16px` | Navigation links, category labels ("ALL CATEGORIES") |
| **Label SM** | `DM Sans` | `12px` | `500` (Medium) | `16px` | Minor tags, metadata, timestamps ("New Arrival") |

---

## Spacing & Grid System (8px Grid)

| Token | Pixels | Tailwind Equivalent |
| --- | --- | --- |
| `1` | `4px` | `p-1`, `gap-1`, `m-1` |
| `2` | `8px` | `p-2`, `gap-2`, `m-2` |
| `3` | `12px` | `p-3`, `gap-3`, `m-3` |
| `4` | `16px` | `p-4`, `gap-4`, `m-4` |
| `6` | `24px` | `p-6`, `gap-6`, `m-6` |
| `8` | `32px` | `p-8`, `gap-8`, `m-8` |
| `12` | `48px` | `p-12`, `gap-12`, `m-12` |
| `16` | `64px` | `p-16`, `gap-16`, `m-16` |

---

## Border Radii

| Token | Value | Tailwind Class | Usage |
| --- | --- | --- | --- |
| `sm` | `4px` | `rounded-sm` | Small badges, sub-tags |
| `md` | `8px` | `rounded-md` | Buttons, text inputs, dropdowns |
| `lg` | `12px` | `rounded-lg` | Inner media cards, alert banners |
| `xl` | `16px` | `rounded-xl` | Product cards, filter sidebar panels |
| `2xl` | `24px` | `rounded-2xl` | Hero containers, prominent feature cards |
| `full` | `9999px` | `rounded-full` | Badges, chips, floating icons |

---

## Shadows

| Name | CSS Value | Class | Usage |
| --- | --- | --- | --- |
| **Shadow Sm** | `0px 1px 2px rgba(0, 0, 0, 0.05)` | `shadow-sm` | Subtle elevation on cards and inputs |
| **Shadow Md** | `0px 4px 12px rgba(0, 0, 0, 0.08)` | `shadow-md` | Card hover state, dropdown menus |
| **Shadow Lg** | `0px 8px 24px rgba(0, 0, 0, 0.10)` | `shadow-lg` | Modals, flyout panels, cart drawer |
| **Shadow Xl** | `0px 20px 40px rgba(0, 0, 0, 0.12)` | `shadow-xl` | Floating dialogue boxes, hero visual popups |

---

## Component Tokens

### Buttons

```tsx
// 1. Primary Button
className="bg-primary text-white hover:opacity-90 font-sans font-medium px-5 py-2.5 rounded-md transition-colors"

// 2. Secondary Button
className="bg-primary-surface text-tertiary hover:opacity-90 font-sans font-medium px-5 py-2.5 rounded-md transition-colors"

// 3. Accent Button
className="bg-secondary text-neutral-dark hover:opacity-90 font-sans font-bold px-5 py-2.5 rounded-md transition-colors"

// 4. Outline Button
className="bg-transparent border border-primary text-primary hover:bg-primary/5 font-sans font-medium px-5 py-2.5 rounded-md transition-colors"
```

### Badges

| Badge Variant | Background Class | Text Class |
| --- | --- | --- |
| **New** | `bg-success-light` (`#DCFCE7`) | `text-success font-bold` (`#22C55E`) |
| **Sale** | `bg-error-light` (`#FEE2E2`) | `text-error font-bold` (`#EF4444`) |
| **-20%** | `bg-warning-light` (`#FEF3C7`) | `text-warning font-bold` (`#F59E0B`) |
| **Best Seller** | `bg-primary-surface` (`#BEE9FF`) | `text-primary font-bold` (`#0A98C3`) |
| **Exclusive** | `bg-tertiary-surface` (`#B3EBFF`) | `text-tertiary font-bold` (`#007EA3`) |

### Form Inputs

```
Background: #FFFFFF or #F8F9FC
Border: 1px solid #E7E8EB (border-neutral-border)
Border Radius: 8px (rounded-md)
Padding: 10px 14px (px-3.5 py-2.5)
Text: #191C1E (text-neutral-dark)
Placeholder: #6E797F (text-neutral-muted)
Focus: outline-none ring-2 ring-primary/20 border-primary
```

### Alerts & Feedback Banners

- **Success**: `bg-success-surface border border-success/30 text-neutral-dark` with `#22C55E` icon.
- **Error**: `bg-error-surface border border-error/30 text-neutral-dark` with `#EF4444` icon.
- **Warning**: `bg-warning-surface border border-warning/30 text-neutral-dark` with `#F59E0B` icon.
- **Info / Shipping**: `bg-primary-surface/30 border border-primary/30 text-neutral-dark` with `#0A98C3` icon ("Free shipping on orders over ৳ 999.").

### Currency & Local Pricing
- Currency Symbol: **`৳`** (Bangladeshi Taka)
- Default format: `৳ 1,450`
- Free Shipping Threshold: **`৳ 999`**
