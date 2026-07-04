# Testing KB 05 — Security Testing (API + OWASP)

## SECTION 11: API TESTING WITH SECURITY FOCUS

**Pattern 34: Comprehensive API Security Test Suite**
```typescript
describe('User API Comprehensive Testing', () => {
  describe('Security Testing', () => {
    test('should reject requests without authentication', async () => {
      const response = await fetch(`${baseURL}/users`, { method: 'GET' })
      expect(response.status).toBe(401)
    })

    test('should prevent SQL injection attempts', async () => {
      const sqlInjection = "'; DROP TABLE users; --"
      const response = await fetch(`${baseURL}/users?search=${encodeURIComponent(sqlInjection)}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      expect(response.status).not.toBe(500) // must not crash / leak stack trace
    })

    test('should enforce rate limiting', async () => {
      const requests = Array(100).fill(null).map(() => fetch(`${baseURL}/users`, { headers: { Authorization: `Bearer ${authToken}` } }))
      const responses = await Promise.all(requests)
      expect(responses.some(r => r.status === 429)).toBe(true)
    })
  })

  describe('Performance Testing', () => {
    test('should respond within 200ms SLA', async () => {
      const start = performance.now()
      await fetch(`${baseURL}/users`, { headers: { Authorization: `Bearer ${authToken}` } })
      expect(performance.now() - start).toBeLessThan(200)
    })
  })
})
```

**Pattern 35: OWASP API Security Top 10 Tests**
```typescript
describe('OWASP API Security Top 10', () => {
  // API1:2023 - Broken Object Level Authorization
  test('API1: prevent BOLA attacks', async () => {
    const userAToken = await getTokenForUser('userA')
    const response = await fetch(`${baseURL}/resources/user-b-resource`, { headers: { Authorization: `Bearer ${userAToken}` } })
    expect(response.status).toBe(403)
  })

  // API3:2023 - Broken Object Property Level Authorization
  test('API3: should not expose sensitive properties', async () => {
    const response = await fetch(`${baseURL}/users/me`, { headers: { Authorization: `Bearer ${authToken}` } })
    const user = await response.json()
    expect(user.password).toBeUndefined()
    expect(user.passwordHash).toBeUndefined()
  })

  // API4:2023 - Unrestricted Resource Consumption
  test('API4: should limit resource consumption', async () => {
    const response = await fetch(`${baseURL}/users?limit=10000`, { headers: { Authorization: `Bearer ${authToken}` } })
    const data = await response.json()
    expect(data.items.length).toBeLessThanOrEqual(100) // server enforces its own cap regardless of requested limit
  })
})
```

---

## SECTION 19: SECURITY TESTING PATTERNS (OWASP Top 10)

**Pattern 49: SQL Injection Testing** — parametrized payload sweep across a `SQL_INJECTION_PAYLOADS` array (`' OR '1'='1`, `'; DROP TABLE users; --`, UNION-based, stacked queries, `xp_cmdshell`, blind boolean, error-based `EXTRACTVALUE`). For every payload: response must not be 500, must not leak `SQL`/`syntax error`/`ORA-`/`mysql` strings in the body.

**Pattern 50: XSS Prevention Testing** — payload sweep (`<script>alert()`, `onerror=`, `javascript:` scheme, `<svg onload>`, template-literal injection, `<iframe src=javascript:>`, mutation-XSS via `<details ontoggle>`/`<math><mtext>` polyglot). Submit through a real form field, reload the page where it's rendered, assert the raw payload markers are absent from `page.content()`, and assert no `dialog` event fired (proves script never executed, not just that markup looks escaped).

**Pattern 51: CSRF Protection Testing** — three cases: request with no CSRF token → 403; request with an invalid token value → 403; request with a freshly fetched valid token (`GET /api/csrf-token` then echo it in `X-CSRF-Token`) → 200. Missing the negative cases (only testing the happy path) is a common false-pass.

**Pattern 52: Authentication & Authorization Testing**
- Rate-limit login attempts: fire 10 rapid wrong-password logins, assert `429` appears somewhere in the response codes.
- Password reset token expiry: request a reset token, then submit a known-expired test token — expect `400`.
- Protected routes reject unauthenticated requests: sweep a list of protected endpoints (`/api/user/profile`, `/api/admin/users`, `/api/billing/invoices`, `/api/settings/team`) — all must return `401` with no auth header.
- Privilege escalation check: login as a regular user, sweep admin endpoints (`/api/admin/users`, `/api/admin/settings`, `/api/admin/billing`) — all must return `403`, never `200` or `401` (401 would mean the auth layer isn't even distinguishing role, which is its own bug).

**Pattern 53: Header Security Testing**
```typescript
test('response includes all security headers', async ({ request }) => {
  const headers = (await request.get('/')).headers()
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['x-frame-options']).toMatch(/DENY|SAMEORIGIN/)
  expect(headers['strict-transport-security']).toContain('max-age=')
  expect(headers['content-security-policy']).toBeDefined()
  // Should NOT expose server info
  expect(headers['x-powered-by']).toBeUndefined()
  expect(headers['server']).not.toContain('Express')
})

test('CSP blocks inline scripts', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    const script = document.createElement('script')
    script.textContent = 'window.__injected = true'
    document.body.appendChild(script)
  })
  const injected = await page.evaluate(() => (window as any).__injected)
  expect(injected).toBeUndefined() // CSP should have blocked the inline script from executing
})
```

**Test-hallucination red flags (apply to every security/test claim before reporting done):**
1. "Tests pass" without pasted output → always show the actual run output.
2. "All requirements met" without enumerating them → list each requirement, cross-check in code.
3. "Implementation complete" with any failing test → run tests first, no exceptions.
4. Skipping/summarizing error output before diagnosing it → read the full error first.
5. Ignoring build warnings as "cosmetic" → address or explicitly document suppression rationale.
6. Silently retrying after a failure instead of reporting it → report → root-cause → then retry.
7. "Probably works" / "should be" / "likely" language → verify with evidence; never make probabilistic completion claims.
