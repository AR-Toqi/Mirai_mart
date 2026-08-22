# Library Docs

Project-specific usage patterns for every third-party library in Mirai Mart. This file covers how each library is configured, initialized, and consumed within this specific e-commerce project — rules, patterns, and constraints.

Read the relevant section before implementing any feature that touches these libraries.

---

## Before Using Any Library

Before implementing any feature that uses a third-party library:

1. **Check AGENTS.md** at the project root — it lists every skill and MCP tool configured for this project.
2. **Check if an MCP server is configured** for that library (e.g. documentation lookup or schema verification). If available, use it before falling back to general knowledge.
3. **Read this file** for project-specific patterns and invariants that override general library documentation.

The order of authority is:

```
MCP server (real-time docs) → Skills via AGENTS.md → This file (project rules) → General training knowledge
```

Never rely on general training knowledge alone for third-party APIs — Next.js 16, React 19, and cloud SDK APIs evolve rapidly.

---

## InsForge

### Client vs Server SDKs

Two separate instances — never mix browser and server contexts:

```typescript
// lib/insforge-client.ts — browser context only (Client Components & Hooks)
import { createBrowserClient } from "@insforge/ssr";

export const insforge = createBrowserClient(
  process.env.NEXT_PUBLIC_INSFORGE_URL!,
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
);
```

```typescript
// lib/insforge-server.ts — server context only (Server Components, Route Handlers, Server Actions)
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
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
};
```

**Rules:**

- **Browser client**: Used only in Client Components for client-side auth state, realtime stock listeners, or public data triggers.
- **Server client**: Used in Server Components, API routes, and Server Actions. Always `await createInsforgeServer()` to read cookies asynchronously.
- Never use the browser client inside Server Actions, Route Handlers, or Server Components.
- Never use the server client inside Client Components.

---

### Authentication & RBAC

#### 1. Email & Password Authentication

```typescript
// Client-side or Server Action sign-in with Email & Password
import { insforge } from "@/lib/insforge-client";

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await insforge.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}

// Sign-up with Email, Password & metadata
export async function signUpWithEmail(email: string, password: string, fullName: string) {
  const { data, error } = await insforge.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}
```

#### 2. Google OAuth Authentication

```typescript
// Client-side Google OAuth trigger
import { insforge } from "@/lib/insforge-client";

export async function signInWithGoogle() {
  const { data, error } = await insforge.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/callback`,
    },
  });

  if (error) throw error;
  if (data?.url) {
    window.location.href = data.url;
  }
}
```

#### 3. OAuth Callback Handler (`app/(auth)/callback/page.tsx`)

```typescript
// Handling OAuth code exchange server-side
import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  if (code) {
    const insforge = await createInsforgeServer();
    const { error } = await insforge.auth.exchangeCodeForSession(code);

    if (!error) {
      redirect("/account");
    }
  }

  redirect("/login?error=oauth_failed");
}
```

#### 4. Server-Side User & RBAC Verification

```typescript
// Get current authenticated user in Server Component / Server Action
const insforge = await createInsforgeServer();
const {
  data: { user },
  error,
} = await insforge.auth.getUser();

if (error || !user) {
  redirect("/login");
}

// Fetch user profile and role
const { data: profile } = await insforge
  .from("profiles")
  .select("id, role, full_name, email")
  .eq("id", user.id)
  .single();

// Enforce admin access
if (profile?.role !== "admin" && profile?.role !== "store-manager") {
  redirect("/");
}
```

---

### Database Queries

```typescript
// 1. Fetching catalog products with variants and categories
const insforge = await createInsforgeServer();
const { data: products, error } = await insforge
  .from("products")
  .select(`
    id,
    title,
    slug,
    description,
    curator_notes,
    age_range,
    specs,
    is_featured,
    categories (id, name, slug),
    product_variants (id, sku, price, compare_at_price, stock_quantity, attributes, images)
  `)
  .eq("is_active", true)
  .order("created_at", { ascending: false });

// 2. Inserting an order header & line items in Server Action
const { data: order, error: orderError } = await insforge
  .from("orders")
  .insert({
    user_id: user?.id ?? null,
    order_number: `MM-${Date.now().toString().slice(-6)}`,
    customer_email: checkoutData.email,
    shipping_address: checkoutData.address,
    subtotal: checkoutData.subtotal,
    shipping_fee: checkoutData.shippingFee,
    total_amount: checkoutData.totalAmount,
    status: "pending",
    payment_status: "paid",
  })
  .select()
  .single();

// 3. Decrement stock atomically on checkout
const { error: stockError } = await insforge
  .from("product_variants")
  .update({ stock_quantity: newStock })
  .eq("id", variantId);
```

**Rules:**

- Always handle errors explicitly — check `if (error) throw error;`.
- Use `.single()` when expecting exactly one record.
- When querying customer data, always filter by `user_id` (`.eq("user_id", user.id)`).
- Never construct raw SQL strings — use InsForge's query builder methods with parameterized input.

---

### Storage (Product Media)

```typescript
// Upload product image to InsForge Storage 'products' bucket
const insforge = await createInsforgeServer();
const { data, error } = await insforge.storage
  .from("products")
  .upload(`${categorySlug}/${Date.now()}-${file.name}`, fileBuffer, {
    contentType: file.type,
    upsert: false,
  });

if (error) throw error;

// Retrieve public image URL
const { data: publicData } = insforge.storage
  .from("products")
  .getPublicUrl(data.path);

const imageUrl = publicData.publicUrl;
```

**Rules:**

- Storage bucket name for store media is strictly `products`.
- Always generate the public URL with `.getPublicUrl()` and persist it into `product_variants.images` JSONB or `products.specs`.
- Upload files directly as `Buffer` or `ArrayBuffer` in Server Actions / API routes — never write files to temporary server disk.

---

## PostHog Analytics

### Client Setup (Browser)

```typescript
// lib/posthog-client.ts
import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false, // Manual pageview capture in App Router
      autocapture: false,
    });
  }
}

export { posthog };
```

### Server Setup (Server Actions & Route Handlers)

```typescript
// lib/posthog-server.ts
import { PostHog } from "posthog-node";

export const createPostHogServer = () => {
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    flushAt: 1, // Flush immediately
    flushInterval: 0, // No delay batching for short-lived server invocations
  });
};

// Dispatch server event
export async function trackServerEvent(
  distinctId: string,
  event: string,
  properties: Record<string, unknown>,
) {
  const client = createPostHogServer();
  client.capture({
    distinctId,
    event,
    properties,
  });
  await client.shutdown(); // Mandatory: prevents lost events in short-lived serverless runtimes
}
```

### Approved Event Catalogue

| Event | When to Trigger | Key Properties |
| --- | --- | --- |
| `product_viewed` | User views a Product Detail Page (PDP) | `productId`, `title`, `category`, `price` |
| `item_added_to_cart` | User clicks "Add to Cart" | `productId`, `variantId`, `price`, `quantity` |
| `cart_drawer_opened` | Slide-over cart drawer opened | `cartTotal`, `itemCount` |
| `checkout_started` | User initiates checkout Step 1 | `cartTotal`, `itemCount`, `isGuest` |
| `order_completed` | Order successfully placed | `orderNumber`, `totalAmount`, `itemCount`, `paymentMethod` |
| `product_compared` | Product added to compare matrix | `productIds`, `category` |
| `search_performed` | Predictive search executed | `query`, `resultsCount` |

**Rules:**

- Always call `await client.shutdown()` in server-side functions.
- Call `posthog.identify(userId)` upon login and `posthog.reset()` upon logout on the client.
- Do not invent custom event names outside the approved catalogue without updating `context/code-standards.md`.

---

## TanStack Query v5

**Purpose**: Client-side query caching and synchronization for predictive search, reviews pagination, and real-time inventory checks.

```typescript
// components/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

**Rules:**

- Initial page data is fetched in Server Components and passed down as `initialData` or props — never fetch initial page render data purely via `useQuery`.
- Wrap `QueryClient` in `useState` inside client provider to avoid state leakages across SSR requests.

---

## Zod Validation

**Purpose**: Type-safe validation contracts for all Server Actions, API routes, dynamic specs, and checkout forms.

```typescript
// lib/validations/checkout.schema.ts
import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  addressLine1: z.string().min(5, "Street address required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  country: z.string().default("US"),
});

export const checkoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  shippingMethod: z.enum(["standard", "express"]),
  isGiftWrapped: z.boolean().default(false),
  giftMessage: z.string().max(250).optional(),
  promoCode: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
```

**Rules:**

- Validate every Server Action input with `schema.parse(input)` or `schema.safeParse(input)`.
- Never trust client payloads (e.g. cart totals or discounted prices) — calculate prices server-side from `product_variants` DB rows.

---

## Framer Motion

**Purpose**: Slide-over Cart Drawer, modal overlays, mobile menu toggles, and hero transitions.

```typescript
"use client";

import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer({ isOpen, onClose, children }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white p-6 shadow-2xl"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Rules:**

- Framer Motion components must only be used in Client Components (`"use client"`).
- Keep animations lightweight (e.g. spring transitions on overlays and drawers); avoid animating expensive layout reflow properties.

---

## Radix UI / Shadcn Primitives

**Approved Primitives**:
- `Accordion`: PDP Tech Specs table, Shipping Policy, and FAQ items.
- `Slider`: Dual-handle PLP price filter ($10 – $200).
- `Dialog` & `Sheet`: Quick view modals and Cart Drawer containers.
- `DropdownMenu`: Storefront category menus, sort selectors, and admin action menus.

**Rules:**

- Never build custom unaccessible dropdowns or accordions from scratch when Radix primitives are available.
- Always apply Mirai Mart design tokens (`rounded-2xl`, `border-border`, `font-sans`) to Radix components.

---

## Lucide React Icons

- Import icons as named imports: `import { ShoppingBag, Star, Truck, ShieldCheck, ChevronRight } from "lucide-react"`.
- Use consistent icon sizing: `className="w-4 h-4"` (16px) for inline text badges, `className="w-5 h-5"` (20px) for buttons, and `className="w-6 h-6"` (24px) for trust badges.
- Always specify accessible labels or `aria-hidden="true"` when icons accompany text.
