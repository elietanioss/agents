# Node.js API Architecture & Security Patterns

**Source**: everything-claude-code. Reusable patterns for backend design.

## Layering Model (Repository → Service → Route)

### Architecture Layers

**Repository Layer** (data access interface):
```typescript
// repository.ts - interface, not implementation
interface DocumentRepository {
  findAll(userId: string): Promise<Document[]>
  findById(id: string): Promise<Document | null>
  create(doc: CreateDocumentInput): Promise<Document>
  update(id: string, doc: Partial<Document>): Promise<Document>
  delete(id: string): Promise<void>
}

// supabase-repository.ts - swappable implementation
export class SupabaseDocumentRepository implements DocumentRepository {
  constructor(private client: SupabaseClient) {}

  async findAll(userId: string): Promise<Document[]> {
    const { data, error } = await this.client
      .from('documents')
      .select()
      .eq('user_id', userId)
    if (error) throw error
    return data || []
  }
  // ... other methods
}
```

**Service Layer** (business logic):
```typescript
// document.service.ts
export class DocumentService {
  constructor(private repo: DocumentRepository) {}

  async createWithValidation(input: CreateDocumentInput, userId: string): Promise<Document> {
    // Business logic: validation, permissions, side effects
    if (input.title.length > 255) throw new Error('Title too long')
    return this.repo.create({ ...input, user_id: userId })
  }

  async shareDocument(docId: string, shareTo: string, userId: string): Promise<void> {
    // Business logic: check ownership, emit event
    const doc = await this.repo.findById(docId)
    if (doc?.user_id !== userId) throw new Error('Permission denied')
    // emit('document:shared', { docId, shareTo })
  }
}
```

**Route Layer** (HTTP contract):
```typescript
// routes.ts
app.get('/documents', async (req, res) => {
  const userId = req.user.id
  const docs = await documentService.findAll(userId)
  res.json({ success: true, data: docs, error: null })
})

app.post('/documents/:id/share', async (req, res) => {
  try {
    await documentService.shareDocument(req.params.id, req.body.shareTo, req.user.id)
    res.json({ success: true, data: null, error: null })
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message })
  }
})
```

## API Response Envelope (Consistent Across Routes)

```typescript
interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
  pagination?: {
    page: number
    pageSize: number
    total: number
    hasMore: boolean
  }
}

// Usage in route:
res.json({
  success: true,
  data: documents,
  error: null,
  pagination: { page: 1, pageSize: 20, total: 150, hasMore: true }
})
```

## Security Patterns Checklist

| **Vulnerability** | **Unsafe Pattern** | **Safe Pattern** |
|---|---|---|
| Hardcoded secrets | `const API_KEY = 'sk-...'` | `process.env.API_KEY!` (throw if missing at boot) |
| Shell injection | `exec(`curl ${userUrl}`)` | `execFile('curl', [userUrl])` (no shell parsing) |
| SQL injection | `query(`SELECT * FROM users WHERE id = ${id}`)` | Parameterized: `query('SELECT * FROM users WHERE id = $1', [id])` |
| XSS via innerHTML | `element.innerHTML = userInput` | `element.textContent = userInput` or DOMPurify |
| Open redirects | `res.redirect(req.query.url)` | Whitelist: `if (!ALLOWED_HOSTS.includes(new URL(url).host)) throw` |
| Plaintext password compare | `password === storedPassword` | `bcrypt.compare(password, storedPassword)` |
| Race condition (balance check) | Fetch balance, decrement, save | Use DB transaction: `SELECT balance FOR UPDATE` + decrement in single txn |
| No rate limiting | Every endpoint open | Use `express-rate-limit` or Supabase Auth rate limits |

## Startup Safety: Environment Validation

```typescript
// startup.ts - throw early if config missing
const requiredEnv = ['DATABASE_URL', 'JWT_SECRET', 'SUPABASE_KEY']

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required env: ${key}`)
  }
}

console.log('✓ All required environment variables present')
app.listen(3000)
```

## Sandbox-Mode Architecture (AI Testing Asset)

```typescript
// Enable sandbox mode for testing without real infrastructure
const SANDBOX_MODE = process.env.SANDBOX_MODE === 'true'

// Mock repository for sandbox
class MockDocumentRepository implements DocumentRepository {
  private store = new Map<string, Document>()
  async findAll() { return Array.from(this.store.values()) }
  // ...
}

// Route selection based on mode
const documentRepo = SANDBOX_MODE
  ? new MockDocumentRepository()
  : new SupabaseDocumentRepository(supabaseClient)

const documentService = new DocumentService(documentRepo)
```

**Why it matters**: Tests run in Vitest without Supabase infrastructure, catching regressions that would otherwise only surface in integration tests. Treat "sandbox vs production path inconsistency" as the #1 AI-introduced regression class.

## Error Handling & Logging

```typescript
// Structured error response
app.use((err: Error, req: Request, res: Response) => {
  console.error('Error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  })

  res.status(500).json({
    success: false,
    data: null,
    error: 'Internal server error',
    // Never leak stack traces to client
  })
})
```
