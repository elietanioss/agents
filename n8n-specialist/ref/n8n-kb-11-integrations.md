# Advanced Integration & Multi-Platform Patterns

Source: core-09-workflow-automation.md Section 9 (Patterns 9.1-9.2) + Section 5 (security/compliance) + credential rotation (Enhancement v2.0).

## Hub-and-spoke architecture
Best default shape when one event needs to fan out to several downstream platforms (Marketing, CRM, Support, Analytics):
```
Webhook Trigger (central hub) → Validate & Enrich → Store in central DB (source of truth)
  → Parallel Distribution: Marketing API / CRM API / Support API / Analytics API
  → Merge results → retry any failed spoke individually → update sync status → respond to caller
```
Benefits: one source of truth, independent spoke failures don't cascade, adding a new downstream platform is just one more spoke, not a rewrite.

## Event-driven microservices
Each platform gets a dedicated handler sub-workflow (Customer/Order/Support/Analytics), and a thin Master Event Router parses the incoming event type and forwards to the right handler via webhook call. Each handler workflow owns its own downstream updates and can publish a follow-on event (e.g. "Customer Updated") for other handlers to react to. Favor this over one giant workflow once ownership boundaries matter (different teams touch different handlers).

## Real-time vs batch — hybrid pattern
See `n8n-kb-06-triggers.md` for the trigger-side framing. Implementation: real-time trigger enqueues + acks instantly; a Schedule-triggered batch workflow drains the queue every N minutes doing bulk API calls (1 call for 100 items instead of 100 calls). Use for anything where per-event synchronous processing would be either too slow for the user or needlessly expensive at volume (notification batching, nightly reconciliation).

## Credential security (non-negotiable)
- **Never hardcode secrets** — always `$credentials.x.y`, never a literal API key string in a Code node.
- **Environment variables** for non-secret config (`process.env.API_ENDPOINT`), separate from the credential system.
- **Rotate regularly** — set expiry reminders, test new credentials before deactivating old ones, use separate keys per environment (dev/staging/prod).
- **Least privilege** — read-only keys wherever the workflow doesn't need write access.
- **Automated rotation workflow** — Schedule Trigger (every 12h) checks token expiry via `this.helpers.getCredentials(...)`, refreshes if `<24h` remaining, alerts to `#ops-alerts` on refresh failure. Worth building once you have several OAuth2-based integrations, since manual rotation is where outages come from.

## Webhook security layers (defense in depth, apply in this order)
1. HTTPS only.
2. Signature verification (HMAC-SHA256) — see `n8n-kb-05-sub-workflows-custom-nodes.md` for the Code node implementation, including the constant-time-comparison variant (`crypto.timingSafeEqual`) that prevents timing-attack signature guessing.
3. Timestamp/replay protection — reject requests where `now - timestamp > 300s`.
4. IP whitelisting where the caller's IPs are known/stable.
5. Rate limiting (Redis-backed per-minute counter, reject with 429 past threshold).

## Compliance quick-reference
| Framework | Must-do |
|---|---|
| GDPR | Encrypt PII in transit/rest, implement deletion workflows, log all data access, 7-year retention on deletion logs |
| HIPAA | BAA-compliant hosting, encrypt all PHI, 6-year audit log retention, log every PHI access (who/what/when/purpose/result) |
| SOC 2 | Document all integrations, change control, anomaly monitoring, incident response process |
| PCI DSS | Never store full card numbers — tokenize (Stripe tokens etc.), encrypt cardholder data |

## Audit logging shape
Centralize into a reusable "Logging Sub-Workflow" called from every production workflow at key events (data_access, data_modify, auth, error, security). Fan out writes in parallel to Postgres (queryable), Elasticsearch (search/analysis), and S3 (long-term archive) so no single store has to serve every use case. Minimum fields: `timestamp, workflow_id, execution_id, event_type, actor, resource_type, resource_id, action, old_value, new_value, ip_address, environment, result, error_message`.
