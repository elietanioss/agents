# Sub-Workflows, Custom Nodes & Webhook Security

Source: core-09-workflow-automation.md Section 10.

## Sub-Workflow Patterns (build once, reuse everywhere)
Why: reusable components, cleaner main workflows, independently testable, independently updatable, modular architecture — one change to a shared sub-workflow benefits every workflow that calls it.

- **Function-style sub-workflow** — e.g. "Send Notification" takes `{recipient, message, channel, priority}`, internally Switch-routes to Email/Slack/SMS/Push, logs the notification, returns `{success, messageId, timestamp}`. Called from 20+ main workflows via `Execute Workflow` node passing those parameters. Update the notification logic once; every caller benefits immediately.
- **Data-transformation sub-workflow** — e.g. "Enrich Customer Data" takes `{customerId, basicInfo}`, runs parallel enrichment lookups (Clearbit, FullContact, Google Maps, internal DB), merges, scores, returns `{enrichedCustomer, score, confidence}`. Reused across onboarding, lead scoring, profile update, and segmentation workflows.
- **Error-handling sub-workflow** — e.g. "Handle Error" takes `{errorType, errorMessage, context, severity}`, Switch-routes by severity (Critical → PagerDuty + `@channel` Slack + email + priority DB log; High → Slack mention + email + ticket + DB log; Low → DB log + rolled into daily summary report), runs cleanup (rollback, release resources), returns `{handled, ticketId, alertsSent}`.
- **Orchestrator sub-workflow chain** — a master workflow (e.g. "Customer Onboarding Orchestrator") calls a sequence of Execute Workflow nodes (Create Account → Setup Billing → Configure Preferences → Send Welcome Communications → Create Support Profile), each independently testable, collecting results and updating a final status + firing an analytics event at the end.

## Custom Node Development
Build a custom node when: a frequently-used API has no existing node, complex logic is needed across many workflows, it's a company-specific internal integration, or a Code-node operation needs to be compiled for performance.

Structure (TypeScript, implements `INodeType`): `description` block defines `displayName`/`name`/`group`/`version`/`credentials`/`properties` (the UI form fields, with `displayOptions.show` to conditionally show fields per selected operation); `execute()` method reads `getInputData()`, iterates items, reads parameters via `getNodeParameter()`, calls `this.helpers.request()` with credentials from `this.getCredentials()`, and returns `[[...INodeExecutionData]]`.

Install: place the built node package under `~/.n8n/nodes`, `npm install n8n-workflow`, build TypeScript, restart n8n (`pm2 restart n8n`) — the node then appears in the node picker.

## Webhook Security (layered defense)
Layers, in order of importance: HTTPS only → signature verification → timestamp/replay protection → IP whitelisting → rate limiting → auth tokens.

**Signature verification with replay protection** (Code Node immediately after Webhook Trigger):
```javascript
const crypto = require('crypto');
const receivedSignature = $json.headers['x-webhook-signature'];
const timestamp = $json.headers['x-webhook-timestamp'];
const payload = JSON.stringify($json.body);
const webhookSecret = $credentials.webhookSecret.secret;

// Reject stale requests (replay-attack prevention)
const currentTimestamp = Math.floor(Date.now() / 1000);
if (currentTimestamp - parseInt(timestamp) > 300) {
  throw new Error('Webhook timestamp too old - possible replay attack');
}

const expectedSignature = crypto.createHmac('sha256', webhookSecret)
  .update(`${timestamp}.${payload}`).digest('hex');
if (receivedSignature !== expectedSignature) {
  throw new Error('Invalid webhook signature - unauthorized request');
}
return { json: $json.body };
```
For the constant-time comparison variant (prevents timing-attack signature guessing via `crypto.timingSafeEqual`), see `n8n-kb-06-advanced-code-patterns.md`.

**IP whitelisting** (Code Node): compare `$json.headers['x-forwarded-for']` against an allowlist that may include CIDR ranges; throw if not matched.

**Rate limiting** (Redis-backed): increment a per-minute counter key (`webhook:{id}:{minute}`), set TTL 60s on first increment, reject with HTTP 429 + `retryAfter` once the count exceeds the configured max-per-minute.
