# Performance, Deployment & Monitoring

Source: core-09-workflow-automation.md Sections 6-8 + Monitoring & Observability (Enhancement v2.0). n8n-specific content only (Zapier task-optimization content dropped — not applicable to this agent).

## Speed optimization
- **Parallelize independent nodes** instead of chaining — 3 independent 10s branches cost ~11s total in parallel vs ~30s sequential.
- **Minimize node count** for tightly related steps — one Set node setting 5 fields beats 5 chained Set nodes (~3-4x faster; each hop has overhead).
- **Batch process large datasets** with `Split in Batches` (e.g. size 100) rather than looping item-by-item — bounds memory and enables bulk API calls.
- **Connection pooling** for DB credentials (`connectionLimit`) avoids a fresh connection per query.
- **Cache frequently-read reference data** (customer list, product catalog) in Redis with a short expiry, refreshed on its own schedule, instead of re-fetching on every workflow run.

## Resource management
- **Execution timeout**: set per-workflow override for anything expected to run long; don't rely on the 5-minute default for genuinely long batch jobs, but don't leave it uncapped either.
- **Concurrency limits**: cap `productionLimit` in queue mode so a burst of triggers doesn't exhaust server resources — excess executions queue instead of all firing at once.
- **Streaming over full-load** for very large datasets in Code nodes — process incrementally rather than loading everything into memory at once.
- **Efficient queries**: select only needed fields, filter server-side, `LIMIT` — never `SELECT *` on a table you're about to filter/paginate in-workflow anyway.

## Scale-up signals (n8n)
Execution queue growing, workflows timing out, CPU/memory consistently >80%, slow DB queries, multiple workflows stuck waiting → upgrade server resources, add worker nodes (distributed execution), optimize the specific slow workflows, add queue management, tune the DB.

## Deployment strategy
- **Three-environment split**: dev (test data, can break) → staging (prod-like anonymized data, final validation) → production (real data, 24/7 monitoring). Promote via workflow JSON export/import, swapping credentials per environment.
- **Blue-green**: new version deployed but inactive (green) alongside current (blue); switch traffic by activating green + deactivating blue; instant rollback by reversing.
- **Canary**: route a small % of traffic to the new version via a Code node random/hash split, ramp gradually (10% → 25% → 50% → 100%) while monitoring; roll back to 0% canary on any regression.
- **Deployment checklist**: tested in dev; error handling confirmed; docs updated; rollback plan ready; backup current prod config before deploying; monitor first executions closely; watch error rates for 24h post-deploy.

## Monitoring & observability
- **Execution monitoring workflow** (schedule every 15 min): query recent executions, compute success rate, alert if it drops below threshold (e.g. 95%), export metrics to Prometheus/Grafana if used.
- **Performance monitoring**: compute p50/p95/p99 execution duration hourly; flag workflows over a slow-threshold (e.g. 30s) for investigation.
- **Synthetic health check**: schedule-triggered test event through the pipeline every 5 min, measure end-to-end latency, alert if it exceeds an SLA or fails outright — catches silent breakage before real traffic hits it.
- **Dashboard metrics worth tracking**: total executions (24h/7d/30d), success rate, error count/type, avg duration, slowest workflows (top 10), most error-prone workflows, CPU/memory/queue depth/webhook latency (infra dashboard).

### Alerting rules engine (Code Node, dedupe with cooldown)
```javascript
const RULES = [
  { name: 'high_error_rate', condition: () => parseFloat(metrics.errorRate) > 5, severity: 'CRITICAL', cooldown: 300000 },
  { name: 'slow_execution', condition: () => metrics.p95DurationMs > 30000, severity: 'WARNING', cooldown: 600000 },
  { name: 'zero_throughput', condition: () => metrics.totalExecutions === 0 && isBusinessHours(), severity: 'CRITICAL', cooldown: 600000 },
]
// track staticData[`alert_${rule.name}`] timestamp; only re-fire after cooldown elapses
// Route CRITICAL -> Slack #ops-critical + PagerDuty; WARNING -> Slack #ops-alerts
```
The cooldown-per-rule pattern is the key idea — without it a sustained problem re-fires the same alert every monitoring cycle and drowns the channel.

## Maintenance cadence
Daily: review error notifications, check execution health. Weekly: review slow workflows, failed executions, expiring credentials, audit logs. Monthly: optimization review, security audit, cost analysis, doc updates. Quarterly: architecture review, DR test, credential rotation. Annual: full system audit, requirements review.

## Testing before production
Levels: unit (individual node/transform logic) → integration (cross-system connections) → end-to-end (full workflow) → performance/load → user acceptance. At minimum: manually execute and inspect data at each node, test every conditional branch (not just the happy path), simulate failures to verify retry/error routing actually fires, validate with production-shaped sample data before flipping the trigger live.
