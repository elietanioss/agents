# n8n Workflow Design Pattern Library

Source: core-09-workflow-automation.md Section 3 (n8n implementations only — Zapier equivalents dropped per agent scope).

## Linear Sequential
`Trigger → Process Node (HTTP Request/DB Query/API Call) → Transform Node (Set/Function/Code) → Output Node (Email/Slack/DB Insert)`. Each node passes data via `$json`; use expressions for mapping `{{ $json.fieldName }}`. Set node for simple transforms, Code node for complex logic.

## Conditional Branching
`Trigger → IF Node → TRUE/FALSE branches → optional Merge Node → Final Actions`. IF node supports String/Number/Boolean/Date conditions with AND/OR logic and expressions (`{{ $json.score > 70 }}`). For 3+ paths use a **Switch Node** with named routes + a fallback route for unexpected values — never leave a switch without a fallback.

## Parallel Processing
n8n auto-parallelizes when multiple nodes connect to the same parent with no interdependency. `Trigger → Split (implicit, connect multiple branches) → Branch A/B/C (independent) → Merge Node → Final processing`. Merge modes: NoOp (just combine), by Index (pair by position), by Key (combine on matching field). Use for multi-channel notification fan-out (Email + Slack + Discord + Telegram + SMS simultaneously).

## Multi-Stage Processing Pipeline
`Validate → Enrich → Transform → Store → Distribute → Finalize`, with an error branch at every stage:
1. **Validation** — Function node checks required fields, IF node gates on validity, false branch → error handler (log, notify, stop).
2. **Enrichment** — parallel HTTP Request lookups (e.g. Clearbit for company data, geolocation API), Set node merges enriched fields into original.
3. **Transformation** — Code node for business logic, scoring, rule application, destination formatting.
4. **Storage** — DB insert/update, IF-gated on success with a dedicated DB error handler.
5. **Distribution** — parallel split (update CRM, send to analytics, notify team), then merge.
6. **Finalization** — log completion status.

## Event-Driven Architecture
Multiple Webhook Trigger nodes (one per event source: customer/order/support/system events) → Merge Node combines all sources → Switch Node routes by event type to a dedicated **sub-workflow per event type** (called via Execute Workflow Node, event data passed as parameters) → Event Logger Node records everything. This is the standard shape for a "many entry points, few handler types" system.

## Data Aggregation
Parallel source nodes (HTTP Request APIs, PostgreSQL query, Google Sheets, second API) → Merge Node → Code Node (combine arrays, dedupe, calculate totals/averages, group by category) → Set Node (structure result) → Split In Batches if large → process each batch → report/store. For scheduled aggregation, drive the whole thing off a Cron Trigger (e.g. daily 9 AM marketing analytics rollup across GA/Facebook Ads/Google Ads/Mailchimp/LinkedIn).

## Orchestrator Pattern (Master-Worker)
Main workflow: Trigger → Code Node (orchestration logic: analyze request, determine needed sub-workflows, prepare parameters) → parallel **Execute Workflow** nodes calling specialized sub-workflows (each a "worker" with its own start node, logic, and typed return object) → Merge Results Node → Code Node (combine, validate completion, summarize) → log + respond. Benefits: modular reusable components, independent dev/test, easier maintenance, scalable architecture. See `n8n-kb-05` for the sub-workflow-as-function pattern in depth.

## Circuit Breaker Pattern
Protects against cascading failures when calling a flaky external service. Track circuit state (CLOSED/OPEN/HALF_OPEN) in `$getWorkflowStaticData('global')` (or Redis for cross-execution state at scale) with a failure counter and last-failure timestamp:
- **CLOSED** (normal) — execute the call; on failure increment counter; if count exceeds threshold (e.g. 5) → flip to OPEN and record timestamp.
- **OPEN** (tripped) — fail fast, don't call the service, return cached data or an error; once the recovery timeout (e.g. 60s) has elapsed, flip to HALF_OPEN.
- **HALF_OPEN** (testing) — allow exactly one test request through; success → reset to CLOSED; failure → back to OPEN with a fresh timer.

See `n8n-kb-06-advanced-code-patterns.md` for the concrete Code Node implementation.

## Queue-Based Pattern (high throughput / controlled concurrency)
Producer workflow: high-volume webhook → validate → `Redis LPUSH` to a job queue → return acknowledgment fast (don't make the caller wait). Consumer workflow(s): scheduled or looping trigger → `Redis BRPOP` (blocking pop with timeout) → process by job type → store result → on error push to a **Dead Letter Queue** (`LPUSH job_queue_dlq`) + notify admin → decrement active-job counter. A separate monitoring workflow polls queue length and DLQ length on a schedule and alerts if backlog or failures accumulate.

## Saga Pattern (distributed transactions with rollback)
For multi-step processes where a later step failing must undo earlier steps. Each step wraps its action in try/success/error: on success, record the step AND its compensation action (e.g. after "create payment intent" succeeds, store `{name: "refund_payment", paymentId}`); on error, walk backward executing the compensation chain in reverse order (void shipping label → release inventory → refund payment), then stop. Store saga state (steps completed, compensations pending) in a database/Redis keyed by a `sagaId` so the saga can be recovered if the orchestrator crashes mid-flight. Build each compensation as its own small sub-workflow (Refund Payment, Release Inventory, Void Shipping Label) so they're independently testable and reusable.
