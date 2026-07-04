# CORS, Security Headers, Rate Limiting & SSRF — Live Test Patterns

Source: core-04-SECURITY_AUDITOR.md (chunked 2026-07-03).

---

## CORS Misconfiguration

```bash
curl -v -X GET "https://api.example.com/api/data" -H "Origin: https://evil.com"
```
Check the response for:
- `Access-Control-Allow-Origin: *` → wildcard CORS (HIGH, CVSS 7.5)
- `Access-Control-Allow-Origin: https://evil.com` (reflected arbitrary origin) → HIGH; if paired with `Access-Control-Allow-Credentials: true` → CRITICAL (CVSS 9.1) because the attacker's page can now make authenticated cross-origin requests using the victim's cookies.
- `Access-Control-Allow-Origin: null` accepted → HIGH; `null` origin is trivially spoofable from sandboxed iframes/data URIs.

Sweep multiple malicious/edge-case origins in one pass: `https://evil.com`, `https://attacker.com`, `http://localhost:3000`, `null`, and a subdomain-confusion string like `https://api.example.com.evil.com`.

## Security Headers

Full Helmet.js baseline to check for on every response: `Content-Security-Policy`, `Strict-Transport-Security` (max-age ≥ 31536000, i.e. 1 year), `X-Frame-Options` (`DENY`/`SAMEORIGIN`), `X-Content-Type-Options: nosniff`, `Referrer-Policy` (`no-referrer` or `strict-origin-when-cross-origin`), `X-DNS-Prefetch-Control`, `X-Download-Options`, `X-Permitted-Cross-Domain-Policies`, `Permissions-Policy`. Deprecated header `X-XSS-Protection` showing up at all is a signal the header config is stale (informational, not a vulnerability itself).

Missing = HIGH (CVSS 6.5); present-but-weak (e.g. CSP with `unsafe-inline`/`script-src *`, HSTS max-age too low) = MEDIUM (CVSS 5.3).

## Rate Limiting

```bash
# Brute-force baseline: fire N requests, look for 429
for i in $(seq 1 100); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST "$API_URL" -d '{"email":"test@x.com","password":"wrong"}'
done
```
No 429 anywhere in the run = rate limiting not working on that endpoint (test auth endpoints specifically — brute force is the highest-value target).

**IP-spoofing bypass check**: retry the same flood while randomizing `X-Forwarded-For` per request. If the limiter keys strictly on that header and never hits 429, the limiter trusts a client-controlled header for its identity key — HIGH finding (CVSS 7.5). Rate limiters must key on something the client can't freely rotate (authenticated user ID, or a validated edge-proxy-set IP, never a raw client-supplied header).

## SSRF (see also security-kb-01 for payload list)

Beyond the payload sweep, the structural fix to verify is present in code:
```typescript
function isAllowedURL(urlString: string): boolean {
  const url = new URL(urlString);
  if (!['http:', 'https:'].includes(url.protocol)) return false;   // no file:/gopher:/dict:
  if (isIP(url.hostname)) return false;                             // no direct IP access
  // check against a blocklist of loopback/link-local/private ranges
  return ALLOWED_DOMAINS.includes(url.hostname);                    // allowlist, not denylist
}
```
A denylist-only approach (blocking `127.0.0.1`, `169.254.169.254` etc. by string match) is brittle — DNS rebinding and alternate IP encodings (`0x7f.0.0.1`, decimal `2130706433`, IPv6 `::ffff:127.0.0.1`) bypass naive string blocklists. Prefer an allowlist of resolvable hostnames plus protocol restriction.
