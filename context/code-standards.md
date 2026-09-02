# Code Standards

Implementation rules and conventions for the entire Mirai Mart project. The AI agent must follow these in every session without exception. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

The AI agent on this project operates as a senior engineer. This means:

- **Think before implementing** — understand what is being built and why before writing a single line
- **Read context files first** — never assume, always verify against `architecture.md`, `ui-tokens.md`, `ui-rules.md`, and `build-plan.md`
- **Scope is sacred** — only build what the current feature requires. Never go beyond scope even if it seems helpful
- **Every feature must be testable** — if it cannot be verified visually and interactively after implementation, it is incomplete
- **Clean over clever** — simple readable code that a junior developer can understand is always preferred over clever abstractions
- **One thing at a time** — complete one feature fully before touching the next
- **Failures are expected** — wrap Server Actions and external operations in try/catch, log failures, never let one failure crash the whole app

---

## TypeScript

- Strict mode enabled in `tsconfig.json` — no exceptions
- Never use `any` — use `unknown` and narrow the type
- Never use type assertions (`as SomeType`) unless absolutely necessary and commented why
- All function parameters and return types must be explicitly typed
- Use `type` for object shapes, cart payloads, and unions — use `interface` only for extendable component props
- All async functions must have proper error handling — never let promises float unhandled
- Use `const` by default — only use `let` when reassignment is necessary

---

## Next.js 16 Conventions

- **Main Pages Must Be Server Components**: Every page entrypoint (`app/**/page.tsx`) must strictly remain a Server Component. **Never add `"use client"` directly to a `page.tsx` file.**
- **Client Component Isolation**: If any interactive or client-side functionality is required on a main page (state, effects, event handlers, client hooks, browser APIs), create a dedicated client component in `components/` marked with `"use client"`, and import and render that component inside the Server Component `page.tsx`. Push client components down to the leaf nodes of the tree.
- **Layouts Must Be Server Components**: Never add `"use client"` to layout files (`layout.tsx`). Keep root and nested layouts server-rendered.
- **App Router only**: App Router exclusively — no Pages Router.
- **React 19**: Use React 19 APIs throughout.
- **Components are Server Components by default**: Only add `"use client"` when the specific isolated component requires:
  - `useState` or `useReducer`
  - `useEffect`
  - Browser APIs (`localStorage`, `navigator`, window resize listeners)
  - Interactive form handlers and UI triggers
  - Client state providers (Cart context, TanStack Query provider, PostHog browser client)
- **Data fetching**: Data fetching happens in Server Components — never fetch initial page data in Client Components directly.
- **Route handlers**: Route handlers live in `app/api/` — never put direct business logic or DB mutations directly in route handlers.
- **Server Actions**: Server Actions live in `actions/` — never define Server Actions inline in components.
- **Caching**: 4-Tier Targeted Strategy:
  1. **Server & ISR**: Pre-generate key static catalog routes (`generateStaticParams`) with scheduled background revalidation (`export const revalidate = 3600`).
  2. **Tag-Based Caching & Invalidation**: Wrap database queries in `unstable_cache` with descriptive tags (e.g. `['products', 'product-${slug}']`). Every mutation MUST purge these tags using `revalidateTag(...)` for granular multi-page cache eviction, complemented by `revalidatePath(...)` for route-level view refreshes.
  3. **HTTP Edge & CDN Headers**: Public read-only route handlers (e.g. `/api/search`) MUST return explicit CDN caching headers (`Cache-Control: public, s-maxage=120, stale-while-revalidate=600`).
  4. **Client-Side Server State**: Interactive repetitive fetches (like predictive search autocomplete and user profile data) MUST use `@tanstack/react-query` with an appropriate `staleTime` (e.g. 5 minutes) rather than raw uncached `fetch` in `useEffect`.
  5. **Persistence Integrity**: Browser `localStorage` only caches structural state (e.g. cart items, compare list). Dynamic pricing and stock must be re-verified on the server before mutation.
- **Documentation first**: Always read Next.js documentation before implementing any Next.js specific feature — APIs may differ from training data.

---

## File and Folder Naming

- Folders: kebab-case or route group syntax — `track-order`, `gift-combos`, `(storefront)`, `(admin)`, `(auth)`
- Component files: PascalCase — `ProductCard.tsx`, `HeroCarousel.tsx`, `CartDrawer.tsx`, `SpecsTable.tsx`
- Utility files: camelCase — `insforge-client.ts`, `posthog-client.ts`, `utils.ts`
- Type files: camelCase — `index.ts`
- Schema validation files: camelCase with suffix — `product.schema.ts`, `checkout.schema.ts`, `auth.schema.ts`
- API route files: always `route.ts` (e.g. `app/api/search/route.ts`, `app/api/upload/route.ts`)
- Server Action files: camelCase — `products.ts`, `cart.ts`, `orders.ts`, `admin.ts`
- One component per file — never export multiple components from one file
- Index files only in `components/ui/` — never barrel export from other folders

---

## Component Structure

Every component follows this exact order:

```typescript
"use client"; // only if needed for interactivity/hooks

// 1. External imports
import { useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

// 2. Internal imports
import { RatingStars } from "@/components/shared/RatingStars";
import { formatCurrency } from "@/lib/utils";
import type { ProductVariant } from "@/types";

// 3. Type definitions
type Props = {
  id: string;
  title: string;
  slug: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  variants?: ProductVariant[];
};

// 4. Component
export function ProductCard({
  id,
  title,
  slug,
  price,
  rating,
  reviewCount,
  imageUrl,
  variants,
}: Props) {
  // state
  const [isHovered, setIsHovered] = useState(false);

  // derived values
  const formattedPrice = formatCurrency(price);

  // handlers
  function handleAddToCart() {
    // cart handler logic
  }

  // return JSX
  return (
    <div
      className="group relative flex flex-col rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Component content */}
    </div>
  );
}
```

- Never use default exports for components — always named exports
- Props type defined directly above the component — not in a separate types file unless shared
- No inline styles — all styling via Tailwind classes using CSS variables from `ui-tokens.md`

---

## API Route Handlers

```typescript
// app/api/search/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "";

    if (!query.trim()) {
      return NextResponse.json({ success: true, data: [] });
    }

    const insforge = await createInsforgeServer();
    const { data, error } = await insforge
      .from("products")
      .select("id, title, slug, price, images")
      .ilike("title", `%${query}%`)
      .limit(8);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[api/search]", error);
    return NextResponse.json(
      { success: false, error: "Failed to execute search query" },
      { status: 500 },
    );
  }
}
```

- Every route handler has a try/catch
- Every route handler validates the request body/query before processing
- Errors are logged with the route path as prefix: `[api/search]`, `[api/upload]`
- Always return `{ success: boolean, data?: T, error?: string }`
- Never return raw data without the success wrapper

---

## Server Actions

```typescript
// actions/orders.ts

"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import { checkoutSchema } from "@/lib/validations/checkout.schema";
import type { CheckoutInput } from "@/types";

export async function createOrder(input: CheckoutInput) {
  try {
    const validated = checkoutSchema.parse(input);
    const insforge = await createInsforgeServer();

    // 1. Verify inventory & calculate total
    // 2. Insert order & order_items into InsForge DB
    // 3. Decrement product_variants stock

    revalidatePath("/account");
    revalidatePath("/admin/orders");

    return { success: true, orderNumber: "MM-10023" };
  } catch (error) {
    console.error("[actions/orders/createOrder]", error);
    return { success: false, error: "Failed to process order" };
  }
}
```

- Every Server Action has a try/catch
- Every Server Action returns `{ success: boolean, data?: T, error?: string }`
- Always validate input with Zod schemas from `lib/validations/`
- Always call `revalidatePath` after mutations that affect page or admin cache
- Never throw unhandled errors from Server Actions — always return `{ success: false, error }`

---

## InsForge Client Usage

```typescript
// Browser context — Client Components & Hooks only
import { insforge } from "@/lib/insforge-client";

// Server context — Server Components, Route Handlers, Server Actions
import { createInsforgeServer } from "@/lib/insforge-server";
const insforge = await createInsforgeServer();
```

- Never use the browser client in server context
- Never use the server client in browser context
- Always `await createInsforgeServer()` — it reads cookies and auth session asynchronously
- Always verify user role / user_id when querying protected customer or admin records

---

## Error Handling

- Never use empty catch blocks — always log or handle
- Console errors always include context prefix: `[actions/cart]`, `[components/ProductCard]`
- User-facing errors must be human readable via toasts or alert banners — never expose raw DB/network error messages
- API route errors return `status: 500` with generic message — never expose internal stack traces

---

## PostHog Analytics Events

All PostHog events must use these exact event names and properties. Never invent new event names without adding them here first.

| Event | When | Key Properties |
| --- | --- | --- |
| `product_viewed` | User views a Product Detail Page (PDP) | `productId`, `title`, `category`, `price` |
| `item_added_to_cart` | User clicks "Add to Cart" on card or PDP | `productId`, `variantId`, `price`, `quantity` |
| `cart_drawer_opened` | Cart slide-over drawer triggered | `cartTotal`, `itemCount` |
| `checkout_started` | User proceeds to checkout step 1 | `cartTotal`, `itemCount`, `isGuest` |
| `order_completed` | Order successfully placed on success screen | `orderNumber`, `totalAmount`, `itemCount`, `paymentMethod` |
| `product_compared` | Product added to compare tray/page | `productIds`, `category` |
| `search_performed` | Search query submitted from search bar | `query`, `resultsCount` |

Always fire PostHog client events using the helper in `lib/posthog-client.ts` and server events using `lib/posthog-server.ts`.

---

## Environment Variables

All environment variables defined in `.env.local` for development. Never hardcode any key, URL, or secret anywhere in the codebase.

| Variable | Used In | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_INSFORGE_URL` | `lib/insforge-client.ts` | InsForge PostgreSQL project URL |
| `NEXT_PUBLIC_INSFORGE_ANON_KEY` | `lib/insforge-client.ts` | InsForge public anon API key |
| `INSFORGE_SERVICE_ROLE_KEY` | `lib/insforge-server.ts` | InsForge admin/service role key (server only) |
| `NEXT_PUBLIC_POSTHOG_KEY` | `lib/posthog-client.ts` | PostHog public project token |
| `NEXT_PUBLIC_POSTHOG_HOST` | `lib/posthog-client.ts` | PostHog ingestion host URL |
| `POSTHOG_API_KEY` | `lib/posthog-server.ts` | PostHog server API key |

`NEXT_PUBLIC_` prefix means the variable is exposed to the browser. Never add `NEXT_PUBLIC_` to secret keys.

---

## E-Commerce Constants

Centralized business logic constants defined in `lib/utils.ts` or `lib/constants.ts`. Never hardcode raw numbers across components.

```typescript
// lib/constants.ts
export const FREE_SHIPPING_THRESHOLD = 50; // $50 free shipping threshold
export const GIFT_WRAP_PRICE = 3.99; // $3.99 gift wrap add-on
export const MAX_COMPARE_ITEMS = 4; // Max 4 products compared side-by-side
export const DEFAULT_PAGE_SIZE = 12; // Products per PLP page
```

---

## Import Aliases

Always use the `@/` alias — never use relative imports that go up more than one level.

```typescript
// Correct
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/ProductCard";
import { insforge } from "@/lib/insforge-client";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

// Never
import { Button } from "../../../components/ui/button";
import { ProductCard } from "../../components/storefront/ProductCard";
```

---

## Comments

- No comments explaining what obvious code does — code must be clean and self-explanatory
- Comments only for why — explaining non-obvious business rules or discount calculation formulas
- Never leave `TODO` comments in committed code

---

## Dependencies

Never install a new package without a clear reason. Before installing anything check:

1. Does `shadcn/ui` already have this component?
2. Does Next.js already provide this functionality?
3. Is there a simpler native solution?

Approved dependencies for **Mirai Mart**:

- `@insforge/ssr` / `@insforge/insforge-js` — InsForge database, auth, and storage client
- `posthog-js` — PostHog browser client
- `posthog-node` — PostHog server client
- `@tanstack/react-query` — Client caching and server state sync
- `framer-motion` — Layout animations, cart drawer, and modal transitions
- `zod` — Schema validation for forms, Server Actions, and API contracts
- `lucide-react` — Curated icon system
- `clsx` & `tailwind-merge` — Utility class merging (`cn()`)
- `tailwindcss` — Styling with Mirai Mart design tokens
- `shadcn/ui` / Radix UI primitives — Accessible UI components (Dialog, Dropdown, Slider, Accordion)

Do not install any other packages without updating this list first.
