# HTTP Request & API Nodes

Source: core-09-workflow-automation.md Section 4 (Pattern 4.1) + Section 9.3 (rate limits).

## Authentication methods (HTTP Request node)
| Method | n8n setup |
|--------|-----------|
| API Key | Credential type "API Key"; attach as header `"X-API-Key": "{{$credentials.apiKey}}"` |
| OAuth 2.0 | Credential type OAuth2 — Client ID/Secret, Auth URL, Token URL, Scopes; n8n auto-refreshes tokens |
| Basic Auth | Credential type Basic Auth (username/password), auto-encoded to Base64 |
| JWT | Generate in a Code node with `jsonwebtoken`, sign with secret, attach to headers manually |
| Custom (AWS Signature, etc.) | Full flexibility via Code node for custom signing schemes |

## Rate limit handling
Six layered strategies, escalate as volume grows:
1. **Throttling with delay** — fixed `Wait` between requests (100ms delay ≈ 10 req/sec, safe for most 10-20 req/sec limits).
2. **Batch requests** — collapse N individual calls into one batch call when the API supports it (e.g. Salesforce bulk create: 100 individual calls → 5 batch calls, ~95% call reduction).
3. **Token bucket** — Redis-backed counter (`rate_limit:{api}`), decrement on use, refill on a schedule; block/queue when empty.
4. **Retry with exponential backoff** — 1s, 2s, 4s, 8s, 16s; give up and queue/alert after ~5 attempts. Add jitter (±25%) to avoid thundering-herd when many executions retry simultaneously.
5. **Queue-based limiting** — push to a queue, a single worker pulls one at a time at a fixed interval matching the rate limit (10 req/sec → 100ms between pulls).
6. **Distributed rate limiting** — for multiple n8n instances sharing one external API quota, track the counter in Redis keyed by `{api}:{currentMinute}` so instances don't independently blow past the limit.

Always parse rate-limit response headers when present and prefer them over guessing:
```
X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After
```
If `Retry-After` exists, wait exactly that long; else compute from `X-RateLimit-Reset`; else fall back to exponential backoff.

## Performance for HTTP-heavy workflows
- Parallelize independent HTTP Request nodes (multiple nodes off one parent execute concurrently) instead of chaining sequentially — a 4-branch fan-out of 10s calls costs ~11s total instead of 40s.
- Use `Split in Batches` for large item sets so memory doesn't balloon and so batch endpoints can be used instead of one call per item.
- Add connection pooling for database credentials (`connectionLimit`) to avoid a fresh connection per query.

See `n8n-kb-03-integration-data-transformation.md` for broader integration patterns and `n8n-kb-08-error-handling.md` for retry/circuit-breaker code.
