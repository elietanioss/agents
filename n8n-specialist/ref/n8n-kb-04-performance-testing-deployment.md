# Performance, Testing, Deployment & Monitoring

Source: core-09-workflow-automation.md Sections 6-8 (n8n side).

## Cost & Efficiency Optimization
n8n's cost model is fixed hosting + unlimited executions, so optimization targets resource efficiency and speed rather than task count — but the same design habits also make workflows faster and more reliable:

1. **Filter early** — put the Filter/IF node immediately after the trigger, before expensive downstream actions, not after. Filtering 100 items down to 20 before three expensive actions saves ~3x the work vs filtering last.
2. **Batch processing** — use `Split In Batches` to group items (e.g. batches of 10-100) instead of processing/calling APIs one item at a time; can cut API call counts by 90%+.
3. **Cache lookups** — fetch reference/lookup data once (e.g. "get all customers") and match against the cached set in a Code node, instead of one API call per loop iteration (99% reduction in calls for large loops).
4. **Async patterns** — respond to the trigger immediately, queue the real work for a background workflow, notify on completion — don't make the caller wait on the full pipeline.
5. **Off-peak scheduling** — run non-urgent batch jobs (reports, syncs, maintenance) via Cron Trigger at low-traffic hours.

## Execution Speed Optimization
- **Parallelize independent nodes** — connecting multiple nodes to the same parent runs them concurrently; four 10s sequential steps (40s) become ~21s in parallel (with a merge). Don't chain steps that don't actually depend on each other.
- **`Promise.all` in Code nodes** — batch independent async calls together instead of awaiting them one at a time in a loop.
- **Minimize node count** — five chained Set nodes each adding one field is ~3-4x slower than one Set node adding all fields at once. Consolidate.
- **Prefer one Code node over several Function nodes** for a related sequence of transforms — avoids per-node data-passing overhead.
- **Connection pooling** for DB credentials (`connectionLimit`, `connectTimeout`, `acquireTimeout`) — don't open a fresh connection per query.
- Rough benchmarks: 10-step workflow 5-15s, DB query 0.5-1s, Code execution 0.1-0.5s, batch of 100 items 10-30s — if a workflow is well outside these ranges, look for a serial-chain-of-Set-nodes or missing-parallelization bug first.

## Resource Management
For large datasets in a Code node, avoid loading everything into memory at once (`await fetchMillionRecords()` then `.map()`); instead stream or use `Split In Batches` so memory is freed after each batch. Configure execution timeouts in `n8n settings.json` and set per-workflow timeout overrides for known-slow workflows; put hard limits on resource-hungry operations to prevent one runaway workflow from exhausting the instance.

## Testing Approach
Use environment variables for all environment-specific config so the same workflow JSON runs unchanged across dev/staging/prod. In Code nodes, read config via `process.env.X`, never hardcode an environment-specific URL or ID. Maintain a testing checklist per workflow: sample/edge-case data prepared, each node validated independently before the full run, error paths deliberately triggered and confirmed to route correctly, rollback plan documented before first production activation.

## Safe Deployment
Run three separate n8n instances (dev/staging/production) rather than testing directly in prod. Deployment checklist:
- **Pre-deployment**: workflow tested in dev, all steps validated, error handling confirmed, docs updated, team notified, rollback plan ready.
- **Deployment**: back up current production workflow JSON, update credentials if needed, activate, verify trigger is live, test with sample data, monitor first executions closely.
- **Post-deployment**: monitor 24h, check error rates, verify all integrations, collect feedback, document issues, update the runbook.
- **Rollback**: deactivate new version, reactivate previous, verify it's healthy, notify team, investigate root cause, document.

**Gradual rollout via feature flag**: hash a stable customer identifier to a percentage bucket in a Code node, route via IF/Switch to old vs new workflow branch, and increase the rollout percentage over successive weeks (10% → 25% → 50% → 100%) rather than flipping 100% at once.

## Comprehensive Monitoring
What to monitor: execution success/failure rate, execution duration, error types/frequency, and (business-level) throughput. Build a dedicated monitoring workflow on a schedule (e.g. every 5 minutes) that queries recent execution data and computes: total/successful/failed/running counts, average and p95 duration, error rate %, top N recurring errors, items processed per minute, and an overall health classification (HEALTHY / DEGRADED / WARNING / CRITICAL based on error-rate thresholds). See `n8n-kb-06-advanced-code-patterns.md` for the concrete metrics-aggregation and alerting-rules-engine Code node implementations (with alert deduplication/cooldown so the same condition doesn't spam repeatedly).

Recommended dashboard content: execution trend sparkline (1h/6h/24h), current health status, top errors, throughput trend. Maintenance discipline: keep a documentation template per workflow (purpose, business value, trigger, steps, data flow, dependencies, error handling, performance targets, monitoring, testing, rollback plan, troubleshooting, change log) and a runbook for on-call response.
