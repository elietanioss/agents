# Error Handling & Resilience

Source: core-09-workflow-automation.md Section 4 (Pattern 4.3), Section 5.1 (webhook security overlaps with n8n-kb-05), Advanced Error Handling & Resilience (Enhancement v2.0).

## Error categories (classify before deciding retry vs stop)
1. **Transient** — network timeouts, temporary unavailability → RETRY.
2. **Permanent** — invalid data, auth failure, 404 → DON'T RETRY, fix and re-run manually.
3. **Rate limit** — 429 → RETRY with backoff (see `n8n-kb-07-http-api-nodes.md`).
4. **Critical** — data corruption, security breach → ALERT immediately, don't auto-retry.

## Node-level handling
Every node exposed to an external call should set:
- `Continue On Fail`: ON lets the workflow keep going with error data attached to the item instead of halting the whole execution — use for non-critical enrichment steps.
- `Retry On Fail`: ON, `Max Tries: 3`, exponential wait between tries.

## Centralized Error Trigger workflow
Build one dedicated error-handling workflow per environment:
```
Error Trigger Node (catches failures from any workflow)
→ Code Node: categorize error (extract details, severity, type)
→ Switch by error type:
   Transient      → wait 30s → retry original workflow → escalate if still failing
   Permanent      → log to DB → create ticket → notify dev team
   Rate limit     → queue for later retry, respect backoff
   Critical       → immediate Slack @channel + PagerDuty + email, stop related workflows
→ Database: log all errors for trend analysis
```
This is the single most reused sub-workflow pattern — call it from every production workflow rather than reimplementing error routing per-workflow.

## Circuit breaker (protect against cascading failures from a flaky external service)
Track per-service state (`CLOSED` / `OPEN` / `HALF_OPEN`) in `$getWorkflowStaticData('global')` (or Redis for multi-instance):
```javascript
const CIRCUIT_KEY = 'circuit_' + service
const FAILURE_THRESHOLD = 5
const RESET_TIMEOUT_MS = 60000
const staticData = $getWorkflowStaticData('global')
const circuit = staticData[CIRCUIT_KEY] || { failures: 0, state: 'CLOSED', lastFailure: 0 }

if (circuit.state === 'OPEN') {
  const elapsed = Date.now() - circuit.lastFailure
  if (elapsed < RESET_TIMEOUT_MS) return [{ json: { circuitBreaker: true, state: 'OPEN' } }] // fail fast
  circuit.state = 'HALF_OPEN' // timeout elapsed, allow one test request
}
// on success: circuit.failures = 0; circuit.state = 'CLOSED'
// on failure: circuit.failures++; if (circuit.failures >= FAILURE_THRESHOLD) circuit.state = 'OPEN'
```
Prevents a workflow from hammering a service that's already down, and auto-recovers once it comes back.

## Dead Letter Queue (DLQ)
Never silently drop a failed item — route it to a DLQ entry instead:
```javascript
const dlqEntry = {
  id: `dlq_${Date.now()}_${Math.random().toString(36).slice(2,9)}`,
  timestamp: new Date().toISOString(),
  workflow: $workflow.name, executionId: $execution.id,
  error, originalPayload: item.json.originalData || item.json,
  retryCount: (item.json.retryCount || 0) + 1, maxRetries: 3,
  priority: classifyError(error), // CRITICAL (401/403) / HIGH (timeout/ECONNRESET) / MEDIUM / LOW (validation)
}
```
Route to a `dlq_entries` DB table; alert on CRITICAL priority immediately, roll LOW into a daily digest.

## Exponential backoff with jitter
```javascript
const exponentialDelay = Math.min(1000 * Math.pow(2, retryCount), 60000)
const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1) // ±25%
const finalDelay = Math.max(0, Math.round(exponentialDelay + jitter))
```
Jitter matters once you have many parallel executions retrying the same failing service — without it they all retry in lockstep and re-trigger the same overload (thundering herd).

## Saga pattern (multi-step transactions needing rollback)
For sequences where a later step failing must undo earlier committed steps (payment → inventory reservation → shipping label → order): store `{sagaId, steps: [], compensations: []}` in workflow state, and on any step's failure execute the compensation chain in reverse order (void label → release inventory → refund payment) via dedicated compensation sub-workflows. Store saga state in DB/Redis so it survives an orchestrator crash mid-saga.

## Retry-ability matrix
| Retry | Don't retry |
|-------|-------------|
| Network errors, timeouts, 5xx, 429 | 4xx client errors, auth failures, validation errors |

## Best practices checklist
- Identify retry-able vs non-retry-able before wiring retry logic — retrying a validation error just wastes attempts.
- Always set a reasonable per-node timeout; don't let a hung call block the whole execution.
- Log every error with enough context to debug without re-running (payload, node, execution ID).
- Graceful degradation: fall back to cached data rather than a hard failure when the primary source is down.
