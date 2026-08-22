# UI Tokens

Design tokens for Mirai Mart. All colors, typography, spacing, and component values extracted from the approved e-commerce design system. Use these exact token values throughout the codebase — never hardcode raw hex values or use unconfigured Tailwind color scales in components.

---

## How to Use

This project uses **Tailwind CSS v4**. All design tokens are defined using the `@theme` directive in `app/globals.css`. No `tailwind.config.ts` needed for colors or tokens.

Tailwind v4 automatically generates utility classes from `@theme` variables:

- `--color-primary` → `bg-primary`, `text-primary`, `border-primary`
- `--color-accent` → `bg-accent`, `text-accent`, `border-accent`
- `--color-surface` → `bg-surface`, `text-surface`, `border-surface`

```tsx
// Correct — uses generated utility classes from @theme
className="bg-surface text-text-primary border-border rounded-2xl shadow-sm"

// Also correct — references CSS variable directly
style={{ color: 'var(--color-primary)' }}

// Never — hardcoded arbitrary hex values
className="bg-[#FCE35F] text-[#0284C7]"

// Never — generic Tailwind default colors
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

  /* Surfaces & Canvas */
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-secondary: #f1f5f9;
  --color-surface-tertiary: #e2e8f0;
  --color-surface-muted: #f8fafc;
  --color-surface-dark: #191c1e;

  /* Borders & Dividers */
  --color-border: #e2e8f0;
  --color-border-light: #f1f5f9;
  --color-border-muted: #cbd5e1;
  --color-border-dark: #334155;

  /* Text & Content */
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #64748b;
  --color-text-light: #94a3b8;
  --color-text-white: #ffffff;

  /* Brand Primary — Sky Blue */
  --color-primary: #0284c7;
  --color-primary-dark: #0369a1;
  --color-primary-light: #e0f2fe;
  --color-primary-muted: #f0f9ff;
  --color-primary-foreground: #ffffff;

  /* Brand Accent — Sunny Yellow */
  --color-accent: #fce35f;
  --color-accent-dark: #facc15;
  --color-accent-light: #fef9c3;
  --color-accent-muted: #fffbeb;
  --color-accent-foreground: #0f172a;

  /* Semantic Feedback — Success & In-Stock */
  --color-success: #10b981;
  --color-success-dark: #059669;
  --color-success-light: #d1fae5;
  --color-success-muted: #ecfdf5;
  --color-success-foreground: #065f46;

  /* Semantic Feedback — Warning & Low Stock */
  --color-warning: #f59e0b;
  --color-warning-dark: #d97706;
  --color-warning-light: #fef3c7;
  --color-warning-muted: #fffbeb;
  --color-warning-foreground: #92400e;

  /* Semantic Feedback — Destructive & Out-of-Stock */
  --color-destructive: #ef4444;
  --color-destructive-dark: #dc2626;
  --color-destructive-light: #fee2e2;
  --color-destructive-muted: #fef2f2;
  --color-destructive-foreground: #991b1b;

  /* Admin Theme Tokens */
  --color-admin-sidebar: #191c1e;
  --color-admin-sidebar-hover: #26292c;
  --color-admin-sidebar-active: #0284c7;
  --color-admin-card: #ffffff;

  /* Border Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;
}
```

---

## Color Usage Guide

### Page Layout

| Element | Token Class | Hex Value |
| --- | --- | --- |
| Page Canvas | `bg-background` | `#F8FAFC` |
| Main Cards / Drawers | `bg-surface` | `#FFFFFF` |
| Secondary Panels / Dropdowns | `bg-surface-secondary` | `#F1F5F9` |
| Default Border | `border-border` | `#E2E8F0` |
| Announcement Bar | `bg-accent` | `#FCE35F` |
| Admin Navigation Shell | `bg-admin-sidebar` | `#191C1E` |

### Typography

| Element | Token Class | Hex Value |
| --- | --- | --- |
| Headings, Baloo 2 titles | `text-text-primary` | `#0F172A` |
| Body copy, descriptions | `text-text-secondary` | `#475569` |
| Curator notes, timestamps, labels | `text-text-muted` | `#64748B` |
| Placeholders, disabled text | `text-text-light` | `#94A3B8` |
| Inverted text on Sky Blue buttons | `text-primary-foreground` | `#FFFFFF` |
| Text on Sunny Yellow banners | `text-accent-foreground` | `#0F172A` |

### Brand Sky Blue (`--primary`)

Used for: Primary CTAs, active age filter chips, category highlights, links, search focus rings.

| Element | Token Class |
| --- | --- |
| Primary Button background | `bg-primary` (hover: `bg-primary-dark`) |
| Primary Button text | `text-primary-foreground` |
| Light badge background | `bg-primary-light` |
| Subtle hover background | `bg-primary-muted` |
| Active Pill border | `border-primary` |

### Brand Sunny Yellow (`--accent`)

Used for: Top announcement promo bar, brand logo dot, bestseller pill badges, discount percentage tags.

| Element | Token Class |
| --- | --- |
| Announcement bar background | `bg-accent` |
| Announcement bar text | `text-accent-foreground` |
| Bestseller badge background | `bg-accent` |
| Promo discount banner | `bg-accent-light text-accent-foreground` |

---

## Product Badges & Chips

### Product Pill Badges

| Badge Type | Background Class | Text Class |
| --- | --- | --- |
| **Bestseller** | `bg-accent` | `text-accent-foreground font-bold` |
| **New** | `bg-primary-light` | `text-primary font-bold` |
| **Sale / Discount** | `bg-destructive-light` | `text-destructive font-bold` |
| **Curator's Pick** | `bg-success-light` | `text-success-foreground font-bold` |

### Age Range Chips

| State | Container Style |
| --- | --- |
| **Inactive / Default** | `bg-surface border border-border text-text-secondary hover:border-primary` |
| **Active / Selected** | `bg-primary text-primary-foreground border-primary shadow-sm` |

### Order & Payment Status Badges

| Status | Background Token | Text Token |
| --- | --- | --- |
| **Pending / Processing** | `bg-warning-light` | `text-warning-foreground` |
| **Packed / In Transit** | `bg-primary-light` | `text-primary` |
| **Delivered / Paid** | `bg-success-light` | `text-success-foreground` |
| **Refunded / Cancelled** | `bg-destructive-light` | `text-destructive-foreground` |

---

## Typography Hierarchy

| Element | Font Family | Size | Weight | Line Height | Color Token |
| --- | --- | --- | --- | --- | --- |
| **Hero Headline** | `Baloo 2` | `44px` / `3.5rem` | 800 ExtraBold | `1.1` | `text-text-primary` |
| **Section Title** | `Baloo 2` | `28px` / `1.75rem` | 700 Bold | `1.2` | `text-text-primary` |
| **Product Card Title** | `Baloo 2` | `18px` / `1.125rem` | 600 SemiBold | `1.3` | `text-text-primary` |
| **Price (Large PDP)** | `DM Sans` | `24px` / `1.5rem` | 700 Bold | `1.2` | `text-primary` |
| **Price (Card)** | `DM Sans` | `16px` / `1rem` | 700 Bold | `1.2` | `text-text-primary` |
| **Body Copy** | `DM Sans` | `14px` / `0.875rem` | 400 Regular | `1.5` | `text-text-secondary` |
| **Button Label** | `DM Sans` | `14px` / `0.875rem` | 600 SemiBold | `1.2` | `text-primary-foreground` |
| **Badge / Pill Tag** | `DM Sans` | `12px` / `0.75rem` | 700 Bold | `1.0` | Variant specific |
| **Muted Specs / Meta** | `DM Sans` | `12px` / `0.75rem` | 400 Regular | `1.4` | `text-text-muted` |

---

## Component Tokens

### Cards

```
background: bg-surface
border: 1px solid var(--border)
border-radius: 16px (rounded-2xl)
padding: 16px to 24px (p-4 to p-6)
box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)
```

### Buttons

**Primary Button (Sky Blue):**
```
background: bg-primary (hover: bg-primary-dark)
text: text-primary-foreground
border-radius: rounded-full (or rounded-xl)
padding: px-5 py-2.5
font-weight: font-semibold
```

**Secondary Button (Outlined):**
```
background: bg-surface (hover: bg-surface-secondary)
border: border border-border
text: text-text-primary
border-radius: rounded-full
padding: px-5 py-2.5
```

**Accent Action (Sunny Yellow):**
```
background: bg-accent (hover: bg-accent-dark)
text: text-accent-foreground
border-radius: rounded-full
padding: px-5 py-2.5
font-weight: font-bold
```

### Form Inputs

```
background: bg-surface
border: border border-border
border-radius: rounded-xl
padding: px-3.5 py-2.5
text: text-text-primary
placeholder: text-text-light
focus: outline-none ring-2 ring-primary/20 border-primary
```

### Free-Shipping Progress Bar

```
Track: bg-border (height: 6px, rounded-full)
Progress fill: bg-primary (transition-all duration-300)
Unlocked fill ($50+): bg-success
```

---

## Invariants

- **Zero Arbitrary Colors**: Never use unlisted hex values directly in JSX components — always use configured `@theme` tokens.
- **Dual Font Pairing**: Headings must strictly use `var(--font-heading)` (`Baloo 2`); body and data tables must strictly use `var(--font-sans)` (`DM Sans`).
- **Surface Elevation**: Storefront cards must stay clean white (`bg-surface`) to keep focus on product imagery.
- **Accessible Contrast**: Sunny Yellow backgrounds (`bg-accent`) must always pair with dark text (`text-accent-foreground` / `#0F172A`).
- **Standard Border**: Default border is strictly `border-border` (`#E2E8F0`) across all cards, modals, and input fields.
