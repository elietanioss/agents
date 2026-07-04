# REST API Design Patterns (from everything-claude-code)

**Source**: everything-claude-code → ECC skills/api-design + mcp-server-patterns

## Naming Conventions

**Resource naming** (plural, kebab-case nouns):
```
✓ GET  /team-members          # List all team members
✓ POST /team-members          # Create new team member
✓ GET  /team-members/:id      # Get specific member
✓ PUT  /team-members/:id      # Full replace (idempotent)
✓ PATCH /team-members/:id     # Partial update
✓ DELETE /team-members/:id    # Delete member
```

**Verbs only for non-CRUD actions**:
```
✓ POST /orders/:id/cancel     # Action on resource
✓ POST /auth/login            # Non-standard endpoint
✓ POST /documents/:id/publish # Action-specific endpoint
✗ GET  /getUsers             # Wrong: Use /users instead
✗ POST /createUser           # Wrong: Use POST /users instead
```

**Nested resources for ownership**:
```
✓ GET /users/:userId/documents                 # User's documents
✓ GET /users/:userId/documents/:docId          # Specific user document
✓ POST /users/:userId/documents                # Create document for user
✗ GET /documents?userId=123                    # Less clear ownership
```

**Query parameters for filtering/sorting/pagination**:
```
✓ GET /users?status=active&sort=name&limit=20&offset=40
✓ GET /documents?category=reports&year=2024
✗ GET /users/active/sorted-by-name            # Wrong: use query params
✗ GET /documents/reports/2024                 # Ambiguous nesting
```

## HTTP Status Code Discipline

| Scenario | Code | Header/Body |
|----------|------|------------|
| Resource created | 201 | Include `Location: /resource/:id` header + resource body |
| Deleted successfully | 204 | No content, empty body |
| Duplicate/conflict | 409 | Explain conflict in error response |
| Unauthenticated | 401 | "Please provide credentials" |
| Authorized but forbidden | 403 | "You don't have permission" |
| Not found | 404 | "Resource does not exist" |
| Unprocessable entity | 422 | Validation errors in body |
| Too many requests | 429 | Include `Retry-After` header |
| Server error | 500 | Log internally, return generic message |

**Example POST Create (201 with Location)**:
```typescript
POST /team-members
{
  "name": "Alice",
  "email": "alice@example.com"
}

# Response
201 Created
Location: /team-members/123
{
  "id": "123",
  "name": "Alice",
  "email": "alice@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Example DELETE (204 No Content)**:
```
DELETE /team-members/123

# Response
204 No Content
(no body)
```

## Method Semantics

| Method | Idempotent | Cacheable | Use Case |
|--------|-----------|-----------|----------|
| GET | Yes | Yes | Retrieve data, safe read-only |
| POST | No | No | Create new resources |
| PUT | Yes | No | Full resource replacement (idempotent) |
| PATCH | No | No | Partial update (non-idempotent) |
| DELETE | Yes | No | Remove resource |

**PUT idempotent example**:
```typescript
// First request
PUT /users/123
{ name: "Alice", email: "alice@example.com" }
// Response: 200 OK

// Exact same request (retry/duplicate)
PUT /users/123
{ name: "Alice", email: "alice@example.com" }
// Response: 200 OK (same result, safe to retry)

// Server replaced entire user object with exact same data
```

**PATCH non-idempotent example**:
```typescript
PATCH /users/123
{ increment: "loginCount" }

// First request: loginCount 5 → 6
// Second request: loginCount 6 → 7 (different result!)
// NOT idempotent
```

## Request/Response Envelope

Consistent API shape across all endpoints:

```typescript
// Success response
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Alice",
    ...
  },
  "error": null,
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 150,
    "hasMore": true
  }
}

// Error response
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "Required field" }
    ]
  },
  "pagination": null
}
```

## Pagination Patterns

**Offset-based** (simple, but slow for large offsets):
```
GET /users?limit=20&offset=40
Response:
{
  "data": [...20 items...],
  "pagination": {
    "limit": 20,
    "offset": 40,
    "total": 1000,
    "hasMore": true
  }
}
```

**Keyset-based** (fast, O(1) database seek):
```
GET /users?limit=20&after=abc123
Response:
{
  "data": [...20 items...],
  "pagination": {
    "limit": 20,
    "cursor": "xyz789",  # For next page: after=xyz789
    "hasMore": true
  }
}
```

**Cursor-based (Relay-style)**:
```
GET /users?first=20&after=eyJpZCI6IjEyMyJ9
Response:
{
  "data": [...20 items...],
  "pageInfo": {
    "hasPreviousPage": true,
    "hasNextPage": true,
    "startCursor": "eyJpZCI6IjQ0MCJ9",
    "endCursor": "eyJpZCI6IjQ1OSJ9"
  }
}
```

## MCP Server Design (Modern API Surface)

MCP servers are typed RPC interfaces for AI models. Apply REST principles but with typed contracts.

### Schema-First with Zod
```typescript
import { Tool } from '@modelcontextprotocol/sdk/types'
import { z } from 'zod'

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['user', 'admin']).default('user'),
})

export const tools: Tool[] = [
  {
    name: 'create_user',
    description: 'Create a new user account',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'User name' },
        email: { type: 'string', description: 'Email address' },
        role: { type: 'string', enum: ['user', 'admin'] },
      },
      required: ['name', 'email'],
    },
  },
]
```

### Structured Errors (Model-Interpretable)
```typescript
// BAD: Stack traces leak implementation details
{
  "error": "Error at lib/utils.ts:123 in calculateTotal: Cannot read property 'items' of undefined"
}

// GOOD: Model can understand and handle
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Order must have at least one item",
    "retryable": true
  }
}
```

### Idempotent Tools (Safe for Retries)
```typescript
// BAD: Non-idempotent, creates duplicate if retried
{
  name: 'send_email',
  description: 'Send email to user'
  // If network fails mid-send, retry creates duplicate
}

// GOOD: Idempotent with idempotency key
{
  name: 'send_email',
  description: 'Send email to user',
  inputSchema: {
    idempotencyKey: z.string().uuid(),  // Retry-safe
    to: z.string().email(),
    subject: z.string(),
  }
}
```

### Rate/Cost Transparency
```typescript
const tools: Tool[] = [
  {
    name: 'analyze_document',
    description: 'Analyze document using Claude vision (costs ~500 tokens per page, rate limit 100/hour)',
    // Model knows the cost upfront
    inputSchema: {...}
  },
  {
    name: 'send_email',
    description: 'Send email via Resend (rate limit 1000/hour, free tier)',
    inputSchema: {...}
  },
]
```

### Transport Independence
Keep server logic separate from transport (stdio vs HTTP):

```typescript
// Core logic
async function createUser(name: string, email: string) {
  // No transport details here
  return db.users.create({ name, email })
}

// Stdio transport (local Claude Code)
stdio.setRequestHandler(CallToolRequestSchema, async (request) => {
  const result = await createUser(request.params.name, request.params.email)
  return { content: [{ type: 'text', text: JSON.stringify(result) }] }
})

// HTTP transport (remote)
app.post('/mcp/call_tool', async (req, res) => {
  const result = await createUser(req.body.name, req.body.email)
  res.json({ content: [{ type: 'text', text: JSON.stringify(result) }] })
})
```

## Reference
- Source: `D:\prompts\data\everything-claude-code-main\everything-claude-code-main\skills\api-design\SKILL.md`
- MCP Server Patterns: `D:\prompts\data\everything-claude-code-main\everything-claude-code-main\skills\mcp-server-patterns\SKILL.md`
- REST best practices: https://restfulapi.net/
