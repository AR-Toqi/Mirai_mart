# Memory — Authentication, OTP Verification & Customer Account Portal

Last updated: 2026-08-24 00:41:00 +06:00

## What was built

- Configured `@insforge/sdk` in `lib/insforge-client.ts` connecting to InsForge BaaS (`NEXT_PUBLIC_INSFORGE_URL`).
- Built `components/providers/AuthProvider.tsx` providing real session authentication (`signInWithPassword`, `signUpWithEmail`, `verifyEmailOtp`, `resendOtp`, `signInWithGoogle`, `signOut`) and cookie synchronization.
- Created Next.js 16 `proxy.ts` edge perimeter route guard for `/account/*`.
- Built `components/auth/LoginForm.tsx` with Zod validation, password toggle, and Google OAuth.
- Built `components/auth/RegisterForm.tsx` with multi-step registration and 6-digit email OTP verification screen.
- Built `components/account/AccountDashboardClient.tsx` strictly matching `context/design/My-account_page.png` 1:1 (User initials avatar, sidebar navigation, 4 KPI cards, Recent Orders list with status pills in `৳`, Exclusive Member Benefits banner, Saved Addresses, Payment Methods, and Trust Strip).
- Configured `images.remotePatterns` in `next.config.ts` for `images.unsplash.com` and `**.insforge.app`, and added responsive `sizes` across all `<Image fill />` elements.
- Synchronized `context/progress-tracker.md` and `context/ui-registry.md`.

## Decisions made

- Focused strictly on customer authentication and the customer portal for Phase 1. Admin/manager CMS workflows will be implemented in Phase 5.
- Email/Password sign-ups require 6-digit OTP code verification via `insforge.auth.verifyEmail({ email, otp })` before granting session tokens.
- Google OAuth creates verified accounts instantly without requiring OTP code verification.
- Currency is strictly formatted in Bangladeshi Taka (`৳`).

## Problems solved

- Eliminated mock login fallbacks in `AuthProvider.tsx` so unregistered emails cannot log in.
- Fixed unauthenticated access to `/account` using both Next.js 16 `proxy.ts` cookie checks and in-component client guards.
- Added the OTP verification screen to handle InsForge email verification requirements.
- Whitelisted remote image hostnames and added responsive `sizes` props, fixing runtime image warnings.

## Current state

- Phase 1 / Feature 01 (Storefront Layout & Homepage UI) and Feature 02 (Authentication & Customer Account Portal) are 100% complete and verified.
- `next build` passes with 0 TypeScript and 0 ESLint errors.

## Next session starts with

- Phase 1 / Feature 03: PostHog Initialization (Create `lib/posthog-client.ts`, `lib/posthog-server.ts`, initialize analytics provider in `app/layout.tsx`, and track `posthog.identify` / `posthog.reset` on login/logout).

## Open questions

- None.
