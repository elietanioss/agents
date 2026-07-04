# Triggers

Source: core-09-workflow-automation.md (trigger mechanism content, Sections 2-3, 9).

## Trigger types
- **Webhook** — instant, event-driven; preferred over polling (no delay, no wasted executions checking for nothing). Secure with signature verification (see `n8n-kb-05-sub-workflows-custom-nodes.md` webhook security section).
- **Cron / Schedule** — recurring jobs (cleanup, reports, aggregation). Use cron expressions; common slots: nightly `0 2 * * *`, hourly, every-15-minutes for near-real-time batch.
- **App-native trigger** — polling-based (checks every 1-15 min) when a service has no webhook support; slower and burns executions checking for nothing — prefer webhook when the app offers one.
- **Manual** — testing/debugging only, not production.
- **Multiple triggers into one workflow** — Merge Node combines several Trigger nodes (e.g. Customer/Order/Support/System webhooks) feeding into a Switch Node that routes by event type to per-domain sub-workflows. This is the standard shape for an "event router" hub.

## Discovery before building
Never design a workflow below 95% confidence on requirements (see `n8n-kb-01-platform-discovery.md` for the full scoring model) — trigger mechanism alone is worth 10% of that confidence score, so nail down the exact event, payload shape, and frequency before wiring nodes.

## Real-time vs batch trigger choice
- **Real-time**: urgent notifications, payments, anything the user is waiting on synchronously.
- **Batch/scheduled**: high volume, cost-sensitive, non-urgent (nightly reports, cleanup).
- **Hybrid** (most efficient at scale): real-time trigger just enqueues + acks instantly; a separate Schedule-triggered workflow drains the queue every N minutes and does bulk processing. Example: 1000 individual events collapse into 50-100 batched emails instead of 1000 individual sends — same responsiveness to the user, far fewer downstream calls.

## Event-driven multi-trigger architecture
```
Webhook Trigger 1 (Customer Events) ┐
Webhook Trigger 2 (Order Events)    ├→ Merge → Switch (route by event type) → per-domain sub-workflow
Webhook Trigger 3 (Support Events)  ┘                                      → Event Logger (database)
```
Each route calls a specialized sub-workflow via Execute Workflow, keeping the router itself thin.
