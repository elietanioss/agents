# Testing KB 03 — Schema, RLS, and Rate-Limit Testing

## SECTION 5: SCHEMA VALIDATION TESTING (Zod)

**Pattern 19: Schema Validation Test Suite**
```typescript
describe('User Schema', () => {
  describe('userSchema (full validation)', () => {
    it('should accept valid user data', () => {
      const result = userSchema.safeParse({ id: '123e4567-e89b-12d3-a456-426614174000', email: 'test@example.com', name: 'John Doe', role: 'user', createdAt: new Date() })
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = userSchema.safeParse({ id: '123', email: 'invalid-email', name: 'John Doe' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email')
        expect(result.error.issues[0].message).toContain('Invalid email')
      }
    })
  })

  describe('createUserSchema', () => {
    it('should require email and name', () => {
      const result = createUserSchema.safeParse({})
      expect(result.success).toBe(false)
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        expect(errors.email).toBeDefined()
        expect(errors.name).toBeDefined()
      }
    })
  })

  describe('updateUserSchema', () => {
    it('should allow partial updates', () => {
      const result = updateUserSchema.safeParse({ name: 'Jane Doe' })
      expect(result.success).toBe(true)
    })
  })
})
```

**Pattern 20: API Endpoint Schema Testing**
```typescript
// app/api/users/__tests__/route.test.ts
import { POST } from '../route'
import { NextRequest } from 'next/server'

describe('POST /api/users', () => {
  it('validates request body with Zod', async () => {
    const request = new NextRequest('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid-email', name: 'J' }),
    })
    const response = await POST(request)
    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.errors.email).toBeDefined()
    expect(data.errors.name).toBeDefined()
  })

  it('accepts valid request', async () => {
    const validBody = { email: 'test@example.com', name: 'John Doe' }
    const request = new NextRequest('http://localhost:3000/api/users', { method: 'POST', body: JSON.stringify(validBody) })
    const response = await POST(request)
    const data = await response.json()
    expect(response.status).toBe(201)
    expect(data.id).toBeDefined()
  })
})
```

---

## SECTION 6: RLS POLICY TESTING

### 6.1 Row-Level Security Testing

**Pattern 21: RLS Policy Test (raw SQL)**
```sql
-- Test 1: Users can only read their own data
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-123"}';
SELECT * FROM users WHERE id = 'user-123'; -- Should return 1 row
SELECT * FROM users WHERE id = 'user-456'; -- Should return 0 rows
ROLLBACK;

-- Test 2: Users cannot update other users' data
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-123"}';
UPDATE users SET name = 'New Name' WHERE id = 'user-123'; -- succeeds, 1 row
UPDATE users SET name = 'Hacked' WHERE id = 'user-456';   -- fails, 0 rows
ROLLBACK;

-- Test 3: Admin role can access all data
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "admin-123", "role": "admin"}';
SELECT COUNT(*) FROM users;
ROLLBACK;
```

**Pattern 22: RLS Testing with Node.js / Supabase**
```typescript
import { createClient } from '@supabase/supabase-js'

const adminClient = createClient(supabaseUrl, supabaseServiceKey) // service role, bypasses RLS

describe('RLS Policies', () => {
  it('user can only read their own projects', async () => {
    const user1Client = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${user1Token}` } },
    })
    await adminClient.from('projects').insert([
      { name: 'User 1 Project', user_id: user1Id },
      { name: 'User 2 Project', user_id: user2Id },
    ])
    const { data, error } = await user1Client.from('projects').select('*')
    expect(error).toBeNull()
    expect(data).toHaveLength(1)
    expect(data![0].name).toBe('User 1 Project')
  })

  it('user cannot update other users projects', async () => {
    const { data: project } = await adminClient.from('projects').insert({ name: 'User 2 Project', user_id: user2Id }).select().single()
    const { data } = await user1Client.from('projects').update({ name: 'Hacked' }).eq('id', project!.id).select()
    expect(data).toHaveLength(0) // No rows affected — RLS blocked the write
  })
})
```
**Rule:** every RLS policy needs a positive test (owner can access) AND a negative test (non-owner is blocked) — one without the other proves nothing.

---

## SECTION 7: RATE LIMITING TESTING

**Pattern 23: Rate Limit Test Suite**
```typescript
describe('Rate Limiting', () => {
  it('should block after max requests', async () => {
    const identifier = 'test-user-1'
    for (let i = 0; i < 100; i++) {
      const { success } = await apiRateLimit.limit(identifier)
      expect(success).toBe(true)
    }
    const { success, remaining, reset } = await apiRateLimit.limit(identifier)
    expect(success).toBe(false)
    expect(remaining).toBe(0)
    expect(reset).toBeGreaterThan(Date.now())
  })

  it('auth rate limit is stricter than API limit', async () => {
    for (let i = 0; i < 5; i++) {
      const { success } = await authRateLimit.limit('test-user-3')
      expect(success).toBe(true)
    }
    const { success } = await authRateLimit.limit('test-user-3')
    expect(success).toBe(false) // 6th request fails
  })

  it('different identifiers have separate limits', async () => {
    for (let i = 0; i < 100; i++) await apiRateLimit.limit('user-1')
    expect((await apiRateLimit.limit('user-1')).success).toBe(false)
    expect((await apiRateLimit.limit('user-2')).success).toBe(true) // separate bucket
  })
})
```

**Pattern 24: Rate Limit Integration Test (Playwright)**
```typescript
test('API blocks after 100 requests', async ({ request }) => {
  for (let i = 0; i < 100; i++) {
    expect((await request.get('/api/users')).status()).toBe(200)
  }
  const blockedResponse = await request.get('/api/users')
  expect(blockedResponse.status()).toBe(429)
  expect((await blockedResponse.json()).error).toContain('Rate limit exceeded')
})

test('rate limit headers are present', async ({ request }) => {
  const response = await request.get('/api/users')
  expect(response.headers()['x-ratelimit-limit']).toBeDefined()
  expect(response.headers()['x-ratelimit-remaining']).toBeDefined()
  expect(response.headers()['x-ratelimit-reset']).toBeDefined()
})
```
