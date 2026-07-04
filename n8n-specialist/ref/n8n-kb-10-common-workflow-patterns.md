# Common Workflow Patterns

Source: core-09-workflow-automation.md Section 3 (Patterns 3.1-3.10), condensed to n8n implementations (Zapier equivalents dropped — this agent builds n8n; see `n8n-kb-01-platform-discovery.md` for when a client asks "why not Zapier").

## 1. Linear sequential
`Trigger → Process (HTTP/DB/API) → Transform (Set/Function/Code) → Output (Email/Slack/DB) → Complete`. Each node passes data via `$json`; use expressions (`{{$json.field}}`) for mapping.

## 2. Conditional branching
`Trigger → IF Node → TRUE/FALSE branches → optional Merge → Final Actions`. For 3+ paths use Switch Node instead of nested IFs. Example (lead routing): Switch on lead score → high/medium/low routes, each assigning to a different team + notification channel, with a Fallback route for unexpected values.

## 3. Parallel processing
n8n auto-parallelizes when multiple nodes connect to the same parent with no interdependency — no special config needed, just wire them side by side and Merge afterward (NoOp / by-index / by-key). Use for independent notification fan-out (Email + Slack + Discord + SMS all firing off one trigger) or independent multi-source lookups.

## 4. Multi-stage pipeline
`Validate → Enrich → Transform → Store → Distribute → Finalize`, each stage with its own error branch feeding a shared error handler. Good default shape for anything ingesting external data before it's trustworthy enough to act on (enrichment via Clearbit/geolocation lookups, business-rule scoring in a Code node, DB insert with success/fail branch, parallel distribution to CRM/analytics/Slack, then a completion log).

## 5. Event-driven / multi-trigger router
See `n8n-kb-06-triggers.md` — multiple Webhook Triggers → Merge → Switch by event type → per-domain sub-workflow → Event Logger.

## 6. Data aggregation
See `n8n-kb-09-data-transform.md` — parallel source pulls → Merge → Code node aggregation → structured output → store + report. Common for daily marketing-channel rollups (GA + Facebook Ads + Google Ads + Mailchimp + LinkedIn → one dashboard update + Slack summary + exec email).

## 7. Orchestrator (master-worker)
A master workflow analyzes the incoming request, then fires parallel `Execute Workflow` calls to specialized sub-workflows (Customer, Billing, Notification, Analytics), each independently testable and each returning a `{success, ...ids}` shape. Master Merges results, validates completion, and logs. This is the pattern to reach for once a single workflow's node count balloons past ~15-20 and distinct responsibilities are tangled together — split them into callable sub-workflows.

## 8. Circuit breaker
See `n8n-kb-08-error-handling.md`.

## 9. Queue-based (high throughput, controlled concurrency)
Producer workflow validates and `LPUSH`es to a Redis queue, then returns an immediate ack (fast response, decoupled from processing). Separate consumer workflow(s) `BRPOP` and process, pushing failures to a `_dlq` queue. A monitoring workflow checks queue depth/DLQ length on a schedule and alerts on backlog. Zapier has no true queue primitive — Digest/Storage simulate it poorly; this is a genuine n8n-only capability worth calling out when a client is deciding between platforms for high-volume work.

## 10. Saga (distributed transaction with rollback)
See `n8n-kb-08-error-handling.md` for the compensation-chain implementation.

## Choosing a pattern
| Situation | Pattern |
|---|---|
| Each step depends on the last, low complexity | Linear |
| Different actions per condition | Conditional branching (IF/Switch) |
| Independent work that can run concurrently | Parallel |
| External data needs cleaning before it's trusted | Multi-stage pipeline |
| Several unrelated event sources feeding one system | Event-driven router |
| Combining reads from several systems into one view | Data aggregation |
| Workflow outgrowing a single canvas / tangled responsibilities | Orchestrator + sub-workflows |
| Calling a service that sometimes goes down | Circuit breaker |
| Very high volume, need backpressure | Queue-based |
| Multi-step transaction that must be fully undoable | Saga |
