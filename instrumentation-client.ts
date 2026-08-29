import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!token) {
  if (process.env.NODE_ENV !== "production") {
    throw new Error(
      "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured"
    );
  }
} else {
  posthog.init(token, {
    api_host: "/ingest",
    ui_host: host,
    // Include the defaults option as required by PostHog
    defaults: "2026-01-30",
    // Capture unhandled exceptions via Error Tracking in production only
    capture_exceptions: process.env.NODE_ENV === "production",
    // Disable session recording in development to prevent console noise
    disable_session_recording: process.env.NODE_ENV === "development",
    // Turn off verbose debug logging in development console
    debug: false,
  });
}

// IMPORTANT: Never combine this approach with other client-side PostHog initialization approaches,
// especially components like a PostHogProvider. instrumentation-client.ts is the correct solution
// for initializing client-side PostHog in Next.js 15.3+ apps.
