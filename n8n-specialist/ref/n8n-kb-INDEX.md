# n8n Knowledge Base — Index

Load this first. Each chunk below is flat in `C:\Users\User\.claude\agents\n8n-specialist\ref\`. Load a chunk on demand when the task touches its topic — don't load all of them by default.

| Chunk | Load this when… |
|---|---|
| `n8n-kb-01-platform-discovery.md` | Deciding n8n vs Zapier, or running the 95%-confidence discovery protocol before designing a workflow |
| `n8n-kb-02-workflow-design-patterns.md` | Choosing an overall workflow shape (condensed overview — see also kb-10 below for the full pattern catalog) |
| `n8n-kb-03-integration-data-transformation.md` | Wiring an integration and shaping the data between systems (condensed overview — see also kb-07/kb-09) |
| `n8n-kb-04-performance-testing-deployment.md` | Condensed overview of perf/test/deploy — see also kb-12 for full depth |
| `n8n-kb-05-sub-workflows-custom-nodes.md` | Building reusable sub-workflows, a custom node, or hardening webhook security (signature verification, replay protection, IP allowlisting) |
| `n8n-kb-06-triggers.md` | Choosing/wiring a trigger — webhook vs cron vs polling, multi-trigger event routers, real-time vs batch |
| `n8n-kb-07-http-api-nodes.md` | HTTP Request node auth (API key/OAuth2/JWT/custom), rate-limit handling, parallelizing HTTP-heavy workflows |
| `n8n-kb-08-error-handling.md` | Error classification, centralized Error Trigger workflow, circuit breaker, DLQ, exponential backoff+jitter, saga/rollback |
| `n8n-kb-09-data-transform.md` | Set vs Function vs Code node choice, batch transforms, data aggregation from multiple sources, input validation/sanitization |
| `n8n-kb-10-common-workflow-patterns.md` | Full pattern catalog: linear, conditional, parallel, multi-stage pipeline, event-driven router, aggregation, orchestrator, circuit breaker, queue-based, saga — with a "which pattern for which situation" table |
| `n8n-kb-11-integrations.md` | Multi-platform fan-out (hub-and-spoke, event-driven microservices), credential rotation, webhook security layering, compliance (GDPR/HIPAA/SOC2/PCI), audit logging shape |
| `n8n-kb-12-performance-deployment-monitoring.md` | Speed/resource optimization, scale-up signals, blue-green/canary deployment, monitoring & alerting (with cooldown-based dedupe), maintenance cadence, testing levels |

## Other ref files
- `n8n-catalog.csv` — 479 real-world workflow templates. Query BEFORE building any workflow to find a reusable pattern instead of starting from scratch.
- `n8n-integrations.md` — 188 supported integrations, quick lookup.
- `n8n-workflow-builder.md` — 6-phase validation methodology + MCP tool call reference for the workflow-builder tooling.

Note: kb-01 through kb-05 are earlier condensed distillations from the original monolith; kb-06 through kb-12 are the full topic chunks written when the monolith (`core-09-workflow-automation.md`, 180KB) was retired. Between them, no substantive content from the original file was dropped except duplicated Zapier-specific walkthroughs (kept only as brief comparison context — this agent builds n8n).
