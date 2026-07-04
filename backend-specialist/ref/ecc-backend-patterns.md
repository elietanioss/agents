# Backend Patterns (from everything-claude-code)

**Source**: everything-claude-code → ECC skills/backend-patterns, security-reviewer agent

## Layered Architecture

Structure your backend for testability and maintainability:

```
Repository Layer (Data Access)
├─ Interface: IUserRepository
├─ Supabase implementation (swappable)
└─ Methods: findAll, findById, create, update, delete

Service Layer (Business Logic)
├─ No SQL or data access details
├─ Orchestrates repositories
└─ Validation, error handling

Route/Controller Layer (HTTP)
├─ Maps requests to services
├─ Error handling
└─ Response formatting
```

**Example Pattern**:
```typescript
// Repository: Data access only
interface IUserRepository {
  findAll(): Promise<User[]>
  findById(id: string): Promise<User | null>
  create(data: CreateUserInput): Promise<User>
  update(id: string, data: UpdateUserInput): Promise<User>
  delete(id: string): Promise<void>
}

class SupabaseUserRepository implements IUserRepository {
  async findAll() {
    return supabase.from('users').select('*')
  }
}

// Service: Business logic
class UserService {
  constructor(private repo: IUserRepository) {}
  
  async registerUser(email: string, password: string) {
    // Validation, hashing, business logic
    const hashedPassword = await bcrypt.hash(password, 10)
    return this.repo.create({ email, password: hashedPassword })
  }
}

// Route: HTTP interface
app.post('/api/users', async (req, res) => {
  try {
    const user = await userService.registerUser(req.body.email, req.body.password)
    res.status(201).json({ data: user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
```

## Consistent API Envelope

Use the same shape for all endpoints:

```typescript
// Success
{
  "success": true,
  "data": { /* resource */ },
  "error": null,
  "pagination": { /* if applicable */ }
}

// Error
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [{ "field": "email", "message": "Required field" }]
  },
  "pagination": null
}
```

## Security Patterns with Fixes

| Issue | BAD | FIX |
|-------|-----|-----|
| **Hardcoded secrets** | `const API_KEY = "sk-123..."` | `const API_KEY = process.env.API_KEY` |
| **Shell injection** | `exec('aws s3 ls ' + userInput)` | `execFile('aws', ['s3', 'ls', userInput])` |
| **SQL injection** | `` SELECT * FROM users WHERE id = ${id} `` | Parameterized: `SELECT * FROM users WHERE id = $1` |
| **XSS in DOM** | `el.innerHTML = userInput` | `el.textContent = userInput` or use DOMPurify |
| **Open redirect** | `res.redirect(req.query.url)` | Whitelist: `if (ALLOWED_ORIGINS.includes(url))` |
| **Plaintext password** | `if (user.password === input)` | `bcrypt.compare(input, user.password)` |
| **Race condition** | Balance check then deduct (2 queries) | `FOR UPDATE` in transaction |
| **No rate limiting** | Accept all requests | `express-rate-limit` middleware |

**Example: Race Condition Fix**
```typescript
// BAD: Race condition
const balance = await db.query('SELECT balance FROM accounts WHERE id = $1', [id])
if (balance < amount) throw new Error('Insufficient funds')
await db.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, id])

// GOOD: Transaction with FOR UPDATE
const result = await db.transaction(async (trx) => {
  const account = await trx('accounts')
    .where('id', id)
    .forUpdate() // Lock the row
  
  if (account.balance < amount) throw new Error('Insufficient funds')
  
  return await trx('accounts')
    .where('id', id)
    .update({ balance: account.balance - amount })
})
```

## Sandbox-Mode Architecture (AI Testing Asset)

Keep your API routes testable without infrastructure:

```typescript
// Environment flag
const SANDBOX_MODE = process.env.SANDBOX_MODE === 'true'

// Route with sandbox fallback
app.post('/api/documents/search', async (req, res) => {
  if (SANDBOX_MODE) {
    // Mock data for testing
    return res.json({ results: MOCK_DOCUMENTS })
  }
  
  // Real Supabase query
  const results = await supabase
    .from('documents')
    .select('*')
    .textSearch('content', req.body.query)
  
  res.json({ results })
})
```

**Test setup with vitest**:
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    env: {
      SANDBOX_MODE: 'true',
      // Don't load real Supabase keys in tests
    }
  }
})

// __tests__/documents.test.ts
it('should search documents', async () => {
  const response = await POST('/api/documents/search', {
    query: 'test'
  })
  expect(response.results).toHaveLength(3)
  // No Supabase connection needed!
})
```

## Startup Secret Validation

Fail fast at boot, not at first use:

```typescript
// BAD: Runtime error when first call to service fails
const apiKey = process.env.API_KEY // undefined, caught later

// GOOD: Fail at startup
async function bootstrap() {
  const requiredEnvVars = ['API_KEY', 'DATABASE_URL', 'JWT_SECRET']
  const missing = requiredEnvVars.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`)
  }
  
  // All secrets present, safe to proceed
  return app.listen(3000)
}

bootstrap().catch((error) => {
  console.error(error)
  process.exit(1)
})
```

## Testing Patterns

### AI Blind Spot: Sandbox Path Inconsistency
The model might write code that passes tests but fails in production:

```typescript
// BAD: Different code paths
async function getUser(id: string) {
  if (SANDBOX_MODE) {
    return MOCK_USERS.find(u => u.id === id) // Sandbox path
  }
  return supabase.from('users').select().eq('id', id).single() // Prod path
}

// TEST passes (uses MOCK_USERS)
// PROD fails (different query structure)

// FIX: Use same code path everywhere
async function getUser(id: string) {
  const result = await getRepository().findById(id)
  return result
}
```

### Mandatory Edge Cases
Always test:
- `null` / `undefined` inputs
- Empty arrays / empty strings
- Invalid types
- Boundary values (min/max)
- Error paths (network failure, DB timeout)
- Concurrent operations
- Large data (10k+ items)
- Special characters (Unicode, emoji, SQL chars)

## Reference
- Source: `D:\prompts\data\everything-claude-code-main\everything-claude-code-main\skills\backend-patterns\SKILL.md`
- ECC agents: security-reviewer.md, ai-regression-testing/SKILL.md
