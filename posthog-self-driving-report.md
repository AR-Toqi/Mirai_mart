# PostHog Self-driving Setup Report

**Project:** Mirai Mart  
**Date:** 2026-08-24  
**Inbox:** https://us.posthog.com/project/573997/inbox

## Summary

PostHog Self-driving was configured for Mirai Mart — a premium e-commerce platform for educational toys and gifts. Session Replay, Error Tracking, and Conversations (Support) products were enabled; six native signal sources were wired to the inbox; a five-scout troop was tuned for this project's surfaces; and two Replay Vision scanners were armed on the checkout flow and rage-click sessions. Findings will start appearing in the Self-driving inbox at https://us.posthog.com/project/573997/inbox within ~30 minutes.

---

## AI Data Processing

**Status:** Approved (organization-level AI data processing consent was granted before this run — required for all Self-driving features).

---

## GitHub

| Item | Result |
|---|---|
| GitHub App (AR-Toqi) | **Connected during this run** |
| Integration ID | 245772 |

GitHub access is required for Self-driving to research findings in code and open draft fix PRs.

---

## Products Enabled

| Product | Result | Notes |
|---|---|---|
| Session Replay | **Already enabled** | Server-side toggle was already ON |
| Error Tracking | **Enabled** | `capture_exceptions: true` is set in `instrumentation-client.ts` — init is clean, no override |
| Support (Conversations) | **Enabled** | Tickets only arrive once an inbound channel is connected — see Follow-ups |

`posthog.init` check: clean — no `disable_session_recording` or `capture_exceptions: false` override found. Server flips take full effect.

---

## Signal Sources

| Source product | Source type | Action |
|---|---|---|
| `health_checks` | `health_issue` | **Enabled** (id: 01a033a3-a8df-7324-bbc7-3f82a2635c78) |
| `error_tracking` | `issue_created` | **Enabled** (id: 01a033a3-adc3-7d2f-a07a-d971b3acf564) |
| `error_tracking` | `issue_reopened` | **Enabled** (id: 01a033a3-b092-752c-ae39-fb2cfc985549) |
| `error_tracking` | `issue_spiking` | **Enabled** (id: 01a033a3-b325-7772-9a2a-d154a7339 1b5) |
| `session_replay` | `session_analysis_cluster` | **Enabled** (id: 01a033a3-b8e6-71a7-aaa7-96e2a2d57f5d, sample_rate: 0.1) |
| `conversations` | `ticket` | **Enabled** (id: 01a033a3-bb3b-7d81-96b0-819853272bef) — dormant until a support channel is connected |
| `signals_scout` | `cross_source_issue` | **Skipped** — ON by default; no row needed |
| `replay_vision` | *(no row)* | **Skipped** — scanners are self-authorizing via `emits_signals: true`; no source config row needed |
| `llm_analytics` | — | **Skipped** — internal only, not a user-facing responder |
| `logs` | — | **Skipped** — not a v1 responder |

---

## Connected Tools

The connected-tools step was declined. No external issue trackers, error trackers, or support desks were connected.

| Tool | Status |
|---|---|
| GitHub Issues | Not used |
| Linear | Not used |
| Jira | Not used |
| Sentry | Not used |
| Zendesk | Not used |

To connect tools later: https://us.posthog.com/project/573997/pipeline/new/source

---

## Scout Troop

**Run budget:** 100 runs/day (3 per tick) — 0 used today. Early-access announcement: *"Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more."*

### Enabled (5 scouts)

| Scout | What it watches |
|---|---|
| `signals-scout-general` | Cross-product correlations and surfaces no specialist covers |
| `signals-scout-product-analytics` | Checkout funnel, retention, and lifecycle regressions in saved flows |
| `signals-scout-web-analytics` | Per-channel session volume, attribution health, and landing-page bounce |
| `signals-scout-web-vitals` | LCP, INP, CLS, FCP per page against Google thresholds (directly affects conversion) |
| `signals-scout-health-checks` | PostHog instrumentation health: missing events, proxy gaps, outdated SDK |

### Disabled (22 scouts) — one-line reason each

| Scout | Reason |
|---|---|
| `signals-scout-error-tracking` | Covered by the native `error_tracking` source (step 4) — duplicate |
| `signals-scout-session-replay` | Covered by the native `session_replay` source (step 4) — duplicate |
| `signals-scout-feature-flags` | No feature flags in active use — enable if flags are adopted |
| `signals-scout-experiments` | No A/B experiments running — enable when experiments are created |
| `signals-scout-surveys` | No PostHog surveys in use — enable if surveys are added |
| `signals-scout-revenue-analytics` | No payment SDK (Stripe/Paddle) detected — enable if Stripe is integrated |
| `signals-scout-ai-observability` | No LLM/AI SDK or `$ai_*` events detected |
| `signals-scout-logs` | PostHog logs product not in use — enable if logs are adopted |
| `signals-scout-csp-violations` | No CSP reporting configured |
| `signals-scout-customer-analytics` | B2C store — no group/accounts analytics |
| `signals-scout-data-pipelines` | No CDP destinations or batch exports configured |
| `signals-scout-data-warehouse` | No external warehouse sources connected |
| `signals-scout-anomaly-detection` | Cross-product; no dashboard/insight history yet to baseline |
| `signals-scout-observability-gaps` | Cross-product; no saved insights yet to gap-check |
| `signals-scout-inbox-validation` | No prior inbox fixes to validate on a fresh setup |
| `signals-scout-replay-vision` | Reads trends across accumulated observations — none yet; enable after scanners have run for a few weeks |
| `signals-scout-conversations` | Conversations product just enabled; no ticket data yet |
| `signals-scout-apm` | No distributed tracing / OpenTelemetry instrumentation detected |
| `signals-scout-mcp-tool-calls` | No `$mcp_tool_call` events detected |
| `signals-scout-tasks` | Internal PostHog tasks, not directly relevant |
| `signals-scout-skills-store` | Skill hygiene scout — not relevant yet |
| `signals-scout-insight-alerts` | No configured insight alerts yet |

---

## Custom Scouts

Three custom scouts were proposed and declined by the user. They remain available as follow-ups:

| Proposed scout | Surface | Discriminator | Why built-in doesn't cover it |
|---|---|---|---|
| Checkout funnel regression | `checkout_started` → `order_completed` conversion | Completion rate regression vs rolling 14-day baseline | `signals-scout-product-analytics` only watches saved funnels; none exist yet |
| Product discovery conversion | `product_viewed` → `item_added_to_cart` by category/age | Add-to-cart rate drop per product/category | Same — no saved funnels yet |
| Search quality | `search_performed` with `resultsCount=0` spike | Zero-result share crossing threshold or search-to-cart drop | No built-in covers predictive search quality |

**Noise escape hatch:** To switch any future scout to dry-run, set `emit: false` on its config in PostHog — it will run and log findings without writing to the inbox.

**Surfaces ruled out:**
- Error bursts — covered by native `error_tracking` source (native source, not an uncovered surface)
- Session friction clusters — covered by native `session_replay` source

---

## Replay Vision Scanners

Replay Vision scanners are LLMs that watch individual session recordings on a schedule and push what they find directly to the Self-driving inbox. They are the only component in this setup that spends Replay Vision credits. Each finding arrives at half weight — corroboration from a second independent finding is required before a report is promoted to the inbox.

**No recordings exist yet** (new project). Both scanners are armed and will start working automatically the day recordings begin — no second setup needed.

| Scanner | What it watches | Query scope | Sampling rate | Monthly credits |
|---|---|---|---|---|
| **Checkout breakage** (id: 01a033a9-3255-7267-a4bb-5fd40ebe3230) | Visible breakage during checkout: frozen forms, error toasts, confirmation page failures, promo/gift-wrap failures | Sessions containing a URL with `/checkout` — the product's multi-step purchase flow | 0.5 | 0 (no recordings yet) |
| **Shopper frustration** (id: 01a033a9-45e1-7669-9d3c-60cc29a5b047) | Rage-click sessions: stuck cart drawer, unresponsive Add-to-Cart, broken variant swatches, dead promo code retries | All sessions with a `$rageclick` event | 1.0 | 0 (no recordings yet) |

Credit spend was not verified (the `creating-replay-vision-scanners` sizing skill returned 404 on this deploy). Briefs are deliberately small and bounded by sampling rate, so projected spend is a small fraction of the monthly budget at typical session volumes.

Viewing scanners: https://us.posthog.com/project/573997/replay-vision

---

## Follow-ups

- [ ] **Connect a support channel** (email / inbox / Slack) in PostHog to activate the Conversations source — tickets stay dormant until a channel is connected. Settings → Support.
- [ ] **Consider custom scouts** once data is flowing: the three proposed scouts (checkout funnel, product discovery, search quality) are the highest-value additions for Mirai Mart's e-commerce surfaces. They can be created from the inbox or by re-running this setup.
- [ ] **Enable `signals-scout-replay-vision`** after the Replay Vision scanners have accumulated a few weeks of observations — it reads aggregate trends across observations, not individual sessions.
- [ ] **Enable `signals-scout-revenue-analytics`** if Stripe or another payment SDK is integrated later.
- [ ] **Enable `signals-scout-feature-flags`** and **`signals-scout-experiments`** when feature flags or A/B tests are added to the product.
- [ ] **Enable `signals-scout-observability-gaps`** once you have saved PostHog insights — it checks event volumes against insight coverage.

---

## What Happens Next

The scout coordinator picks up fresh configs within ~30 minutes; the first scans fire on the next coordinator tick. Scout runs draw from the project's 100-run-per-day early-access budget. Findings cluster into reports in the inbox; immediately-actionable ones can start draft coding tasks automatically (at $15 per draft PR). The Replay Vision scanners scan every 5 minutes once recordings exist.

Check your inbox at: https://us.posthog.com/project/573997/inbox
