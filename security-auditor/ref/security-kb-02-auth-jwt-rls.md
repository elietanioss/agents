# Authentication, JWT & RLS Live-Test Patterns

Source: core-04-SECURITY_AUDITOR.md (chunked 2026-07-03). Complements `auth-code-review.md` (static JWT/OAuth/session patterns) and `supabase-security.md` (static RLS patterns) with live-exploitation test scripts.

---

## JWT Attack Classes

### Secret brute force
Try a wordlist against `jwt.verify()`: `secret`, `password`, `123456`, `admin`, `jwt_secret`, `your-256-bit-secret`, `supersecret`, `change-me`, `development`, `test`, `secretkey`, `qwerty`. Any successful verify = CRITICAL — the attacker can now forge any role.

### Algorithm confusion (RS256 → HS256)
If the server issues RS256 (asymmetric) but the verify call doesn't pin the algorithm, an attacker can take the RS256 **public key** (often exposed) and use it as an HMAC secret to self-sign an HS256 token:
```typescript
const maliciousToken = jwt.sign({...decoded.payload, role: "admin"}, publicKey, { algorithm: 'HS256' });
```
If the server accepts it → CRITICAL, CVSS 9.8. Fix: `jwt.verify(token, key, { algorithms: ['RS256'] })` — never let the algorithm be inferred from the token header.

### `alg: none` acceptance
Some libraries historically accepted `{"alg":"none"}` and skipped signature verification entirely — token becomes `base64(header).base64(payload).` (empty signature). Test by crafting one with an elevated `role` claim; any 200 response = CRITICAL.

### Expiration & rotation checks
- Access tokens should be short-lived (15 min) with refresh-token rotation; test that an expired access token is actually rejected (don't assume).
- On logout, refresh tokens must be revoked server-side (deleted from `refresh_tokens` table), not just cleared client-side.
- On login, regenerate the session/token family — reusing the pre-auth session ID is session fixation (CVSS 8.1).

## Row-Level Security (RLS) Bypass Testing

### Direct SQL probe (fastest signal)
```sql
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-a-id"}';
SELECT * FROM posts WHERE id = 'post-2';        -- owned by user-b; expect 0 rows
SELECT * FROM posts WHERE id = 'post-1' OR '1'='1';  -- expect only post-1, not all rows
UPDATE posts SET title = 'Hacked' WHERE id = 'post-2';  -- expect 0 rows updated
RESET role;
```
Any leakage here means the policy's `USING`/`WITH CHECK` clause is missing or wrong — this is a direct database-level finding, independent of the API layer.

### Application-level probe (Supabase JS client)
Log in as User A (team 1) and User B (team 2) with separate clients; have A create a resource scoped to team 1, then have B `.select()`/`.update()` that resource ID directly. Any success is a CRITICAL RLS policy bypass — team/tenant isolation failure (CVSS ~9.1 read, 9.8 write).

### RLS testing helper function (Postgres)
A `test_rls_policy(user_id, table_name)` PL/pgSQL function that sets the JWT claim context and attempts SELECT/INSERT/UPDATE/DELETE inside exception-guarded blocks, returning a `(can_select, can_insert, can_update, can_delete)` tuple — useful for scripting RLS regression checks across many tables at once rather than testing one policy at a time by hand.

### Why RLS bypasses happen (root causes to check for)
- Policy relies on `user_metadata` (user-editable in Supabase) instead of a `SECURITY DEFINER` function or a table row — attacker can self-elevate.
- `IN (subquery)` policies instead of `EXISTS (...)` — functionally similar but EXISTS is easier to reason about and index correctly; a subtle join error in an `IN` policy can silently widen access.
- Missing `WITH CHECK` on UPDATE policies — `USING` alone only restricts which rows are visible to update, not what values they can be updated *to*.
- No policy at all on a table with RLS *enabled* defaults to deny — but a table with RLS **not enabled** is wide open; always confirm `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` ran.

## API Authorization Bypass Checklist
Test all of: missing Authorization header, malformed/invalid token, expired token, token issued for a different application/audience, Authorization header without the `Bearer` prefix, and SQL-injection-shaped strings inside the Authorization header itself. Expected: 401 in every case; any 200 is a finding.
