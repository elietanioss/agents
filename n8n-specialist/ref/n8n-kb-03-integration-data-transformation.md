# Integration, Data Transformation & Error Handling

Source: core-09-workflow-automation.md Section 4 (n8n side).

## Authentication Methods
- **API Key**: n8n Credential Type "API Key" → attach as header on HTTP Request node: `Headers: {"X-API-Key": "{{$credentials.apiKey}}"}`.
- Other supported types: OAuth2 (with automatic token refresh), Basic Auth, Bearer Token, custom header/query-param schemes — always store in n8n's Credential system, never inline in node parameters or Code node strings.

## Data Transformation Nodes (in order of preference — simplest tool that solves the problem)
1. **Set Node** — simple field mapping/renaming/basic calculation. `{"values": {"fullName": "={{$json.firstName}} {{$json.lastName}}", "email": "={{$json.email.toLowerCase()}}"}}`.
2. **Function Node** — JavaScript expressions for conditional logic and calculations on a single item at a time.
3. **Code Node** — full JavaScript, npm libraries (`require('lodash')`, `require('moment')`), operates on the whole item array via `$input.all()`. Use for anything Set/Function can't express cleanly, or when you need external libraries.

Best practice ordering: try Set first, then Function, then Code — don't reach for Code Node out of habit when a Set node would be clearer and faster.

## Error Handling Strategy
Four error categories drive four different responses:
1. **Transient** (network timeout, temp unavailability) → RETRY
2. **Permanent** (invalid data, auth failure, resource not found) → DON'T RETRY, fix and re-run
3. **Rate limit** (API quota exceeded) → RETRY with backoff
4. **Critical** (data corruption, security breach) → ALERT immediately, don't auto-retry

### Node-level error handling
Every node has: `Continue On Fail` (ON passes error data downstream instead of stopping the workflow; OFF stops execution) and `Retry On Fail` with `Max Tries` (typically 3) and `Wait Between Tries` (use exponential backoff, not a fixed interval).

### Centralized Error Trigger Node
Build a dedicated error-handling workflow with an **Error Trigger Node** that catches failures from any other workflow. Inside: Code Node categorizes the error (extract details, determine severity, classify type) → Switch Node routes by type:
- Transient → wait 30s → retry original workflow → escalate if it fails again
- Permanent → log to DB, create issue-tracker ticket, notify dev team
- Rate limit → queue for later retry, implement backoff, monitor reset time
- Critical → immediate Slack `@channel` alert + PagerDuty incident + email to on-call + stop related workflows

Always log every error to a database for pattern analysis regardless of category.

### Retry best practices
- Retry-able: network errors, timeouts, 5xx responses, rate limits. Non-retryable: 4xx client errors, auth failures, validation errors — retrying these just wastes calls and hides the real bug.
- **Exponential backoff**: 1s → 2s → 4s → 8s between attempts, never a fixed interval — a fixed interval on a struggling service just adds to the load.
- Set explicit timeouts on every HTTP Request node — never let a call wait indefinitely.
- Graceful degradation: fall back to cached data or partial functionality rather than hard-failing the whole workflow.

## Security & Compliance

### Credential management
- **Never hardcode secrets** in Code/Function nodes — always `$credentials.myServiceApi.apiKey`, never a literal string.
- Use n8n's built-in credential system: encrypted at rest, access-controlled, never included in workflow JSON export.
- Environment variables for non-secret config only (`process.env.API_ENDPOINT`, `process.env.ENVIRONMENT`).
- Rotate credentials on a schedule; test new credentials before deactivating old ones; use least-privilege / read-only keys wherever the workflow doesn't need write access; separate keys per dev/staging/prod.

### Webhook security (mandatory for any production webhook)
1. HTTPS only, never HTTP.
2. **Signature verification** — compute HMAC-SHA256 over the payload with the shared webhook secret and compare to the received signature; reject on mismatch. See `n8n-kb-06-advanced-code-patterns.md` for the constant-time comparison version (prevents timing attacks) plus timestamp-based replay-attack prevention.
3. IP whitelisting where the sender's IPs are known and stable.
4. Rate limiting per webhook endpoint.
5. Input validation/sanitization on every field before it touches a database or gets re-transmitted (see below).

### Data sanitization & validation
Always validate format (e.g. email regex) AND sanitize (strip `<>` to prevent HTML injection, escape quotes, trim whitespace, cap string length) before using untrusted input in a database write, API call, or downstream notification. Do this in the Code node immediately after the trigger, not scattered through the workflow.

### Compliance quick reference
- **GDPR**: encrypt PII in transit/at rest, don't retain unnecessary personal data, implement deletion workflows, log all data access.
- **HIPAA**: BAA-compliant hosting, encrypt all PHI, strict access control, audit logs, regular security review.
- **SOC 2**: document every integration, change control process, anomaly monitoring, incident response procedure.
- **PCI DSS**: never store full card numbers — use tokenization (Stripe tokens etc.), encrypt cardholder data.

### Audit logging framework
Log: workflow executions (start/end time, duration), data access (what/who/when), data modifications (old value/new value/who), authentication events. This is required infrastructure for any workflow touching regulated data, not an optional nice-to-have.
