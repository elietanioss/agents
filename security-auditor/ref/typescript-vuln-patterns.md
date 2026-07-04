---
ref-name: typescript-vuln-patterns
description: TypeScript and Node.js specific vulnerabilities with exact vulnerable vs safe code patterns. Prototype pollution, mass assignment, type confusion, deserialization, ReDoS, SSRF, path traversal.
---

# TypeScript/Node.js Vulnerability Patterns

## PROTOTYPE POLLUTION

```typescript
// ❌ VULNERABLE — bracket notation
const obj = {}
obj[req.body.key] = req.body.value  // key="__proto__" pollutes globally

// ❌ VULNERABLE — Object.assign with user input
Object.assign(config, req.body)

// ❌ VULNERABLE — lodash.merge/deepmerge with user input
import merge from 'lodash/merge'
merge({}, req.body)  // body: {"__proto__": {"isAdmin": true}}

// ✅ SAFE — validate with Zod first (strips unexpected keys)
const data = Schema.parse(req.body)

// ✅ SAFE — Object.create(null) for user-key stores
const store = Object.create(null)

// ✅ SAFE — freeze prototype
Object.freeze(Object.prototype)
```

Detection: `grep -rn "Object\.assign\|merge(" src/ | grep "req\."`

## MASS ASSIGNMENT

```typescript
// ❌ VULNERABLE — Express + Prisma spread
const user = await prisma.user.create({ data: req.body })
// Attacker sends: {"email":"x","role":"admin","isAdmin":true,"balance":99999}

// ❌ VULNERABLE — Mongoose
const doc = new User(req.body)

// ✅ SAFE — explicit field selection
const user = await prisma.user.create({
  data: {
    email: req.body.email,    // only allowed fields
    name: req.body.name,
  }
})

// ✅ SAFE — Zod schema strips extra fields
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  // role NOT included — cannot be set by user
})
const data = CreateUserSchema.parse(req.body)
```

## TYPE CONFUSION

```typescript
// ❌ VULNERABLE — TypeScript type doesn't protect runtime
function getUser(id: string) { ... }
app.get('/user/:id', (req, res) => {
  // req.params.id is string at TS level but could be {"$gt": ""} in NoSQL
  return getUser(req.params.id)
})

// ❌ VULNERABLE — type assertion hiding runtime type
const config = req.body as Config  // 'as' does nothing at runtime

// ✅ SAFE — Zod validates at runtime
const { id } = z.object({ id: z.string().uuid() }).parse(req.params)
```

## NODE.JS DESERIALIZATION

```typescript
// ❌ VULNERABLE — node-serialize (deprecated, RCE)
const serialize = require('node-serialize')
serialize.unserialize(req.body.data)  // RCE via IIFE in serialized string

// ❌ VULNERABLE — class-transformer with user input
import { plainToClass } from 'class-transformer'
plainToClass(User, req.body)  // Combined with class-validator bypass → RCE

// ✅ SAFE — JSON.parse + Zod (no code execution)
const data = Schema.parse(JSON.parse(req.body))

// ✅ SAFE — never deserialize user-provided binary/complex formats
```

## REDOS

```typescript
// ❌ VULNERABLE PATTERNS (exponential backtracking)
/^(a+)+$/.test(userInput)           // nested quantifiers
/^([a-zA-Z]+)*$/.test(userInput)   // repeated groups
/(a|aa)+/.test(userInput)           // alternation with overlap

// ❌ VULNERABLE — user-controlled RegExp
new RegExp(req.query.pattern).test(input)

// ✅ SAFE — validate regex patterns before use
// Use timeout or safe-regex library
import safeRegex from 'safe-regex'
if (!safeRegex(userPattern)) throw new Error('Unsafe regex')

// ✅ SAFE — fixed patterns only, never user-constructed
const SAFE_PATTERN = /^[a-zA-Z0-9_-]{3,30}$/
```

## SSRF IN NODE.JS

```typescript
// ❌ VULNERABLE — user URL in server fetch
app.post('/proxy', async (req, res) => {
  const response = await fetch(req.body.url)  // SSRF
  res.json(await response.json())
})

// SSRF bypass payloads to test for in code:
// http://127.0.0.1, http://[::1], http://0177.0.0.1 (octal)
// http://169.254.169.254/latest/meta-data/ (AWS)
// http://metadata.google.internal (GCP)
// file:///etc/passwd, gopher://localhost:6379

// ✅ SAFE — allowlist approach
const ALLOWED_DOMAINS = ['api.stripe.com', 'api.sendgrid.com']
const url = new URL(req.body.url)
if (!ALLOWED_DOMAINS.includes(url.hostname)) throw new Error('Domain not allowed')
const response = await fetch(url.toString())

// ✅ SAFE — use DNS resolution check + private IP block
```

## PATH TRAVERSAL

```typescript
// ❌ VULNERABLE
app.get('/file', (req, res) => {
  const file = path.join('/uploads', req.query.filename)
  // filename = '../../etc/passwd' → path.join resolves it!
  res.sendFile(file)
})

// path.join('/uploads', '../../etc/passwd') === '/etc/passwd'
// path.join does NOT protect against traversal

// ✅ SAFE — use path.resolve + check prefix
const base = path.resolve('/uploads')
const file = path.resolve(base, req.query.filename)
if (!file.startsWith(base + path.sep)) {
  throw new Error('Path traversal detected')
}

// ✅ SAFE — basename only (strips all directory components)
const filename = path.basename(req.query.filename)
res.sendFile(path.join('/uploads', filename))
```

## NEXT.JS RSC SECRET LEAKAGE

```typescript
// ❌ VULNERABLE — importing server secret in shared component
// components/ProductCard.tsx (could be client or server)
import { stripe } from '@/lib/stripe'  // stripe = Stripe(process.env.STRIPE_SECRET)
// If this component is used client-side, secret leaks to bundle

// ✅ SAFE — server-only import prevents accidental client use
// lib/stripe.ts
import 'server-only'  // Throws build error if imported in client component
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// ✅ SAFE — keep secrets in Server Components / Route Handlers only
// app/api/payment/route.ts (always server)
import { stripe } from '@/lib/stripe'
```

## NEXT.JS dangerouslySetInnerHTML

```tsx
// ❌ VULNERABLE — user content without sanitization
<div dangerouslySetInnerHTML={{ __html: userPost.content }} />

// ❌ VULNERABLE — LLM output without sanitization
<div dangerouslySetInnerHTML={{ __html: aiResponse }} />

// ✅ SAFE — DOMPurify sanitization
import DOMPurify from 'isomorphic-dompurify'
const clean = DOMPurify.sanitize(userPost.content)
<div dangerouslySetInnerHTML={{ __html: clean }} />

// ✅ SAFER — avoid HTML entirely, use markdown renderer with sanitization
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
<ReactMarkdown rehypePlugins={[rehypeSanitize]}>{userPost.content}</ReactMarkdown>
```

## OWASP A10:2025 — EXCEPTIONAL CONDITIONS (FAIL-OPEN)

```typescript
// ❌ CRITICAL — empty catch allows unauthenticated access
async function checkAuth(token: string) {
  try {
    return jwt.verify(token, secret)
  } catch {
    // Silent fail — caller proceeds as if authenticated!
  }
}

// ❌ CRITICAL — catch-all returning 200
app.use((err, req, res, next) => {
  res.status(200).json({ ok: true })  // Hides ALL errors including auth failures
})

// ❌ — broad catch swallows auth errors
try {
  await requireAuth(req)
} catch (e) {
  console.log('auth error', e)
  // continues without return! falls through to handler
}

// ✅ SAFE — fail closed
async function checkAuth(token: string) {
  try {
    return jwt.verify(token, secret, { algorithms: ['HS256'] })
  } catch (err) {
    logger.error('JWT verification failed', { err: err.message })
    throw new UnauthorizedError('Invalid token')  // Always throw, never swallow
  }
}
```
