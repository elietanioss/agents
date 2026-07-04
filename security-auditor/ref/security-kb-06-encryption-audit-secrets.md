# Encryption, Audit Logging & Secrets Configuration

Source: core-02-BACKEND_SPECIALIST.md (chunked 2026-07-03) — security-relevant slice only. This backend monolith was ~90% duplicate of content already covered by `auth-code-review.md`, `supabase-security.md`, and `nextjs-security.md` (JWT issuance/refresh, CORS, security headers, error handling). Only the genuinely non-duplicate security material — encryption, audit logging, and secrets/env schema — is kept here. See DROPPED section at the end for what was intentionally not carried over and why.

---

## Password Hashing (bcrypt) — verification checklist

```typescript
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
await bcrypt.hash(password, SALT_ROUNDS);
await bcrypt.compare(password, hash);
```
Audit for: (1) salt rounds ≥ 10 (12 recommended), (2) automatic rehash-on-login when `bcrypt.getRounds(hash) !== SALT_ROUNDS` (lets you raise cost over time without a forced password reset), (3) password length validated (≥8 chars) *before* hashing, (4) plaintext password never logged, even at debug level.

## Field-Level Encryption

**Postgres pgcrypto** (symmetric, key passed at query time):
```sql
INSERT INTO patients (ssn_encrypted) VALUES (pgp_sym_encrypt($1, $2));
SELECT pgp_sym_decrypt(ssn_encrypted, $2) AS ssn FROM patients WHERE id = $1;
```
Audit risk: the encryption key travels through the query parameter list on every call — verify it's sourced from env/secret-manager, never hardcoded, and that connection logs don't capture bound parameter values.

**Application-level AES-256-CBC** (Node crypto):
```typescript
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
// store iv.toString('hex') + ':' + encrypted — IV must be unique per encryption, never reused
```
Audit for: fresh random IV per encrypt call (a reused IV with CBC leaks structural information across records), and that `ENCRYPTION_KEY` is exactly 32 bytes (64 hex chars) sourced from env, not derived from a weak passphrase without a KDF.

## Audit / Security-Event Logging

Minimum viable security event log schema: `type` (enum: `FAILED_LOGIN`, `SUCCESSFUL_LOGIN`, `PASSWORD_RESET`, `PERMISSION_DENIED`, `SUSPICIOUS_ACTIVITY`, `RATE_LIMIT_EXCEEDED`, `TOKEN_REUSE_DETECTED`, `UNAUTHORIZED_ACCESS_ATTEMPT`), `userId`, `ip`, `userAgent`, `severity`, `details`, `created_at`. Persist to a queryable store (not just stdout/Winston files) so compliance/incident-response can search it — HIPAA and SOC2 both expect a durable, queryable audit trail, not just rotating log files.

Audit for the *absence* of specific events, not just their presence: `TOKEN_REUSE_DETECTED` (a refresh token used twice = strong signal of theft — the whole token family should be revoked, not just the one token) is the single highest-value event type teams most often forget to implement.

## Secrets & Environment Configuration

Validate the entire environment schema at boot, fail closed if anything required is missing or malformed — don't let a missing secret surface as a mysterious runtime error three requests later:
```typescript
const configSchema = z.object({
  JWT_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().length(64),          // 32 bytes hex
  BCRYPT_SALT_ROUNDS: z.coerce.number().min(10).max(14).default(12),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),    // never expose to client bundle
  // ...
});
configSchema.parse(process.env);  // process.exit(1) on ZodError at startup
```
Audit checklist derived from this pattern:
- [ ] Every secret has a minimum-length/format constraint enforced at startup, not just documented in `.env.example`.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (or equivalent admin key) never appears in a `NEXT_PUBLIC_*` variable or client bundle.
- [ ] `.env.example` documents every variable with a placeholder, never a real value.
- [ ] Secrets rotation is operationally possible (config is read once at boot behind an abstraction, not scattered `process.env.X` calls that would each need updating).

## DROPPED from this monolith (do not re-add without reason)

Duplicate of existing ref files, not carried forward: JWT issuance/refresh/middleware patterns (→ `auth-code-review.md`), RLS policy examples for user/team/public/RBAC patterns (→ `supabase-security.md`, and live-test versions in `security-kb-02-auth-jwt-rls.md`), CORS Express/Next.js config (→ `nextjs-security.md`, `security-kb-03-network-config-testing.md`), Helmet.js security headers (→ `security-kb-03-network-config-testing.md`).

Out of security-auditor's scope entirely (backend-specialist's domain, not security): connection pooling, rate-limiter implementation internals (beyond the bypass-testing already in security-kb-03), commercial use cases, production deployment checklist, advanced API design patterns, microservices patterns, advanced database patterns, observability patterns, resilience patterns, activation triggers, and inter-agent handoff sections. None of these are security-relevant; they belong to backend-specialist's own KB, not this agent's.
