# Remediation Reference — Before/After Fix Patterns

Source: core-05-SECURITY_REMEDIATION.md (chunked 2026-07-03). This is a companion to backend-specialist's implementation work: security-auditor uses these before/after pairs to write the "fix" field in a finding, not to apply the fix itself (this agent is read-only).

---

## SQL Injection → Parameterized / ORM

```typescript
// VULNERABLE
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
// FIX: parameterized
const query = 'SELECT * FROM users WHERE email = $1';
await db.query(query, [userEmail]);
// FIX: ORM (type-safe, injection-proof by construction)
await prisma.user.findUnique({ where: { email } });
// FIX: Supabase query builder (auto-parameterized)
await supabase.from('users').select('*').eq('email', email).single();
```
Always pair the query fix with a Zod input-validation layer at the boundary — the parameterization prevents injection, the schema prevents garbage/oversized input from reaching the query at all.

## XSS → Escaping / CSP / Sanitization

- Template engines: prefer auto-escaping engines (EJS `<%= %>`, Handlebars) over manual string interpolation into HTML.
- React: `dangerouslySetInnerHTML` is the single highest-risk primitive in the framework — if HTML must be rendered from user content, sanitize with DOMPurify and restrict `ALLOWED_TAGS`/`ALLOWED_ATTR` to the minimum needed (e.g. `['b','i','em','strong','a']`, `['href']`).
- CSP: build `script-src` from nonces (`'nonce-${res.locals.cspNonce}'`) generated fresh per request, not `'unsafe-inline'`. A CSP with `unsafe-inline` provides no real XSS mitigation.

## JWT Hardening

- Secret must be ≥32 bytes, generated with `crypto.randomBytes(32)`, stored only in env vars — reject startup if `JWT_SECRET.length < 32`.
- Always pass `algorithms: ['HS256']` (or `['RS256']`) explicitly to `jwt.verify()` — never let the algorithm be read from the token's own header, which is exactly what enables the RS256→HS256 confusion attack.
- Never put passwords, SSNs, credit card numbers, or API keys in a JWT payload — a JWT payload is base64, not encrypted; anyone holding the token can read every claim.
- Short-lived access tokens (15 min) + rotating refresh tokens (7 day) with a `jwtid` (jti) per token so individual tokens can be revoked/tracked.

## Access Control → Ownership Validation + RBAC Middleware

```typescript
// FIX pattern: explicit ownership check before returning/mutating a resource
if (requestedUserId !== authenticatedUserId && userRole !== 'admin') {
  return res.status(403).json({ error: 'Forbidden' });
}
```
Centralize this as a `verifyResourceOwnership(userId, resourceType, resourceId)` utility reused across every resource-scoped route, rather than re-implementing the check ad hoc per endpoint (ad hoc checks are exactly how one route gets missed).

## RLS Strengthening

- Prefer `EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = projects.team_id AND team_members.user_id = auth.uid())` over `team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())` — same semantics, but EXISTS plans better and is easier to index correctly (`CREATE INDEX ... ON team_members(user_id, team_id) WHERE is_active = true`).
- Add `deleted_at IS NULL AND is_active = true` conditions directly into the RLS policy, not just into application-level queries — RLS is the last line of defense and must not assume the caller filtered soft-deletes correctly.
- Separate policies per role (`admins_select_all` vs `users_select_own`) rather than one policy with a complex OR — easier to audit, easier to reason about which policy fired.

## CORS Fix

```typescript
const ALLOWED_ORIGINS = ['https://app.yourdomain.com', 'https://admin.yourdomain.com'];
app.use(cors({
  origin: (origin, cb) => (!origin || ALLOWED_ORIGINS.includes(origin)) ? cb(null, true) : cb(new Error('Not allowed by CORS')),
  credentials: true,
}));
```
Store the allowlist in an env var (`ALLOWED_ORIGINS`), never hardcode per-environment, and log every CORS rejection — a spike in rejections from an unfamiliar origin is itself a signal worth alerting on.

## Prototype Pollution Fix

```typescript
const BLOCKED_KEYS = ['__proto__', 'constructor', 'prototype'];
function safeMerge(target: any, source: any): any {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (BLOCKED_KEYS.includes(key)) continue;
    result[key] = (typeof source[key] === 'object' && source[key] !== null)
      ? safeMerge(result[key] || {}, source[key]) : source[key];
  }
  return result;
}
```
Also: `Object.freeze()` shared config objects, and use `Object.create(null)` for pure data maps built from user input so there's no prototype chain to pollute in the first place.

## Fix Verification Discipline
Every fix needs an automated regression test that (a) replays the original malicious payload and asserts it's now rejected/neutralized, and (b) confirms legitimate functionality still works. A fix without a regression test is not considered done — it will silently regress on the next refactor.
