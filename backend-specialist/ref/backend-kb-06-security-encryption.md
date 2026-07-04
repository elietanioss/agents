## ERROR HANDLING

### Pattern 1: Global Error Handler (Next.js)

**File:** `lib/errors/handler.ts`

```typescript
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export function handleError(error: unknown) {
  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      },
      { status: 400 }
    )
  }
  
  // Custom application errors
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    )
  }
  
  // Unknown errors (don't leak details in production)
  console.error('Unexpected error:', error)
  
  return NextResponse.json(
    {
      error: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : String(error)
    },
    { status: 500 }
  )
}
```

**Usage in API Route:**

```typescript
import { NextRequest } from 'next/server'
import { handleError, AppError } from '@/lib/errors/handler'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Business logic...
    
    if (!someCondition) {
      throw new AppError('Resource not found', 404)
    }
    
    // Success response...
    
  } catch (error) {
    return handleError(error)
  }
}
```

---


---

## ENCRYPTION PATTERNS

### Pattern 1: Password Hashing (bcrypt)

**File:** `lib/auth/password.ts`

```typescript
import bcrypt from 'bcrypt'

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12')

// Hash password for storage
export async function hashPassword(password: string): Promise<string> {
  // Validate password length
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }
  
  const startTime = Date.now()
  const hash = await bcrypt.hash(password, SALT_ROUNDS)
  const duration = Date.now() - startTime
  
  console.log(`Password hashed in ${duration}ms with ${SALT_ROUNDS} rounds`)
  
  return hash
}

// Verify password during login
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const startTime = Date.now()
  const isValid = await bcrypt.compare(password, hash)
  const duration = Date.now() - startTime
  
  console.log(`Password verified in ${duration}ms, result: ${isValid}`)
  
  return isValid
}

// Check if hash needs rehashing (if SALT_ROUNDS changed)
export function needsRehash(hash: string): boolean {
  const rounds = bcrypt.getRounds(hash)
  return rounds !== SALT_ROUNDS
}
```

**Usage in Signup:**

```typescript
import { hashPassword } from '@/lib/auth/password'
import { supabase } from '@/lib/db/supabase'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  // Validate password length
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    )
  }
  
  // Hash password
  const password_hash = await hashPassword(password)
  
  // Store ONLY the hash (NEVER store plain password)
  const { data, error } = await supabase
    .from('users')
    .insert({
      email,
      password_hash // Store hash, not password
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ user: data })
}
```

**Usage in Login with Automatic Rehashing:**

```typescript
import { verifyPassword, needsRehash, hashPassword } from '@/lib/auth/password'
import { supabase } from '@/lib/db/supabase'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  // Fetch user
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  
  // Verify password
  const isValid = await verifyPassword(password, user.password_hash)
  
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  
  // Check if rehashing needed (e.g., if SALT_ROUNDS increased)
  if (needsRehash(user.password_hash)) {
    const newHash = await hashPassword(password)
    
    await supabase
      .from('users')
      .update({ password_hash: newHash })
      .eq('id', user.id)
    
    console.log(`Rehashed password for user ${user.id}`)
  }
  
  // Generate tokens and return...
}
```

**Password Security Best Practices:**

```
✅ DO:
- Use bcrypt with 10-14 salt rounds (12 recommended)
- Store ONLY password hashes (never plain text)
- Hash passwords on server-side only
- Implement rate limiting on login endpoints
- Enforce password strength requirements

❌ DON'T:
- NEVER use MD5 or SHA1 for passwords
- NEVER use SHA256 without salt
- NEVER use reversible encryption for passwords
- NEVER store passwords in plain text
- NEVER use custom hashing algorithms
```

### Pattern 2: Field-Level Encryption (pgcrypto)

**Database Setup:**

```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table with encrypted fields
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  
  -- Encrypted fields (store as BYTEA)
  ssn_encrypted BYTEA,
  medical_history_encrypted BYTEA,
  credit_card_encrypted BYTEA,
  
  encryption_key_id TEXT,
  encrypted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Encrypt data: pgp_sym_encrypt(data, key)
-- Decrypt data: pgp_sym_decrypt(encrypted_data, key)
```

**Trigger Function for Automatic Encryption:**

```sql
CREATE OR REPLACE FUNCTION encrypt_sensitive_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Encrypt SSN if provided in plain text
  IF NEW.ssn_plain IS NOT NULL THEN
    NEW.ssn_encrypted := pgp_sym_encrypt(
      NEW.ssn_plain,
      current_setting('app.encryption_key')
    );
    NEW.ssn_plain := NULL; -- Clear plain text
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_patient_insert
BEFORE INSERT OR UPDATE ON patients
FOR EACH ROW
EXECUTE FUNCTION encrypt_sensitive_data();
```

**Node.js Implementation:**

**File:** `lib/db/encryption.ts`

```typescript
import pool from '@/lib/db/pool'

const ENCRYPTION_KEY = process.env.DATABASE_ENCRYPTION_KEY!

export async function createPatient(data: {
  name: string
  ssn: string
  medicalHistory: string
}) {
  const query = `
    INSERT INTO patients (
      name,
      ssn_encrypted,
      medical_history_encrypted
    )
    VALUES (
      $1,
      pgp_sym_encrypt($2, $3),
      pgp_sym_encrypt($4, $3)
    )
    RETURNING id, name, encrypted_at
  `
  
  const result = await pool.query(query, [
    data.name,
    data.ssn,
    ENCRYPTION_KEY,
    data.medicalHistory
  ])
  
  return result.rows[0]
}

export async function getPatient(id: string) {
  const query = `
    SELECT
      id,
      name,
      pgp_sym_decrypt(ssn_encrypted, $2) AS ssn,
      pgp_sym_decrypt(medical_history_encrypted, $2) AS medical_history,
      encrypted_at
    FROM patients
    WHERE id = $1
  `
  
  const result = await pool.query(query, [id, ENCRYPTION_KEY])
  return result.rows[0]
}

export async function findPatientBySSN(ssn: string) {
  // Encrypt search term to compare with encrypted field
  const query = `
    SELECT
      id,
      name,
      encrypted_at
    FROM patients
    WHERE ssn_encrypted = pgp_sym_encrypt($1, $2)
  `
  
  const result = await pool.query(query, [ssn, ENCRYPTION_KEY])
  return result.rows[0]
}
```

### Pattern 3: AES-256-CBC Encryption (Alternative)

**File:** `lib/security/encryption.ts`

```typescript
import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex') // 32 bytes
const IV_LENGTH = 16

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  // Return IV + encrypted data
  return iv.toString('hex') + ':' + encrypted
}

export function decrypt(encryptedData: string): string {
  const [ivHex, encrypted] = encryptedData.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}
```

**Usage:**

```typescript
import { encrypt, decrypt } from '@/lib/security/encryption'

// Store encrypted SSN
const encryptedSSN = encrypt('123-45-6789')
await db.query('INSERT INTO users (ssn_encrypted) VALUES ($1)', [encryptedSSN])

// Retrieve and decrypt
const { ssn_encrypted } = await db.query('SELECT ssn_encrypted FROM users WHERE id = $1', [userId])
const ssn = decrypt(ssn_encrypted)
```

---


---

## COMPLETE ERROR HANDLING (ALL 11 PATTERNS)

### Pattern 2: Centralized Error Middleware

```typescript
// lib/errors/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { logger } from '@/lib/utils/logger'

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public isOperational: boolean = true,
    public details?: any
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', true, details)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR', true)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Permission denied') {
    super(message, 403, 'AUTHORIZATION_ERROR', true)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND', true)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT', true)
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number) {
    super('Rate limit exceeded', 429, 'RATE_LIMIT', true, { retryAfter })
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 500, 'DATABASE_ERROR', true, { originalError: originalError?.message })
  }
}
```

### Pattern 3: Environment-Based Error Detail

```typescript
// lib/errors/sanitizer.ts
const isProduction = process.env.NODE_ENV === 'production'

// Patterns that should NEVER be exposed
const sensitivePatterns = [
  /password/i,
  /secret/i,
  /api[_-]?key/i,
  /token/i,
  /authorization/i,
  /credentials/i,
  /connection.*string/i,
  /database.*url/i
]

export function sanitizeError(error: Error): { message: string; stack?: string } {
  let message = error.message

  // Check for sensitive data in error message
  for (const pattern of sensitivePatterns) {
    if (pattern.test(message)) {
      message = 'An error occurred while processing your request'
      break
    }
  }

  // Production: hide internal details
  if (isProduction) {
    return { message }
  }

  // Development: include stack trace
  return {
    message,
    stack: error.stack
  }
}

export function formatErrorResponse(error: unknown): {
  error: string
  code?: string
  details?: any
  stack?: string
  requestId?: string
} {
  // Known operational errors
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      details: isProduction ? undefined : error.details
    }
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    return {
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    }
  }

  // Unknown errors
  const sanitized = sanitizeError(error as Error)

  return {
    error: isProduction ? 'Internal server error' : sanitized.message,
    code: 'INTERNAL_ERROR',
    stack: sanitized.stack
  }
}
```

### Pattern 4: Async Error Wrapper

```typescript
// lib/errors/async-wrapper.ts
import { NextRequest, NextResponse } from 'next/server'
import { formatErrorResponse } from './sanitizer'
import { logger } from '@/lib/utils/logger'

type AsyncHandler = (
  request: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>

export function asyncHandler(handler: AsyncHandler): AsyncHandler {
  return async (request, context) => {
    try {
      return await handler(request, context)
    } catch (error) {
      const requestId = request.headers.get('x-request-id') || crypto.randomUUID()

      logger.error('Request failed', {
        requestId,
        method: request.method,
        path: request.nextUrl.pathname,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })

      const errorResponse = formatErrorResponse(error)
      errorResponse.requestId = requestId

      const statusCode = error instanceof AppError ? error.statusCode : 500

      return NextResponse.json(errorResponse, {
        status: statusCode,
        headers: {
          'X-Request-ID': requestId
        }
      })
    }
  }
}

// Usage in API route
export const GET = asyncHandler(async (request) => {
  // Your logic here - errors are automatically caught
  const data = await fetchData()

  if (!data) {
    throw new NotFoundError('Data')
  }

  return NextResponse.json(data)
})
```

### Pattern 5: Unhandled Promise Rejection Handler

```typescript
// lib/errors/global-handlers.ts
import { logger } from '@/lib/utils/logger'

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
    type: 'unhandledRejection'
  })

  // In production, you might want to gracefully shutdown
  // process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', {
    message: error.message,
    stack: error.stack,
    type: 'uncaughtException'
  })

  // MUST exit after uncaughtException - state is corrupted
  process.exit(1)
})

// Handle SIGTERM (graceful shutdown)
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, starting graceful shutdown')

  // Close database connections, finish requests, etc.
  gracefulShutdown()
})

async function gracefulShutdown() {
  // Close database pool
  await pool.end()
  logger.info('Database pool closed')

  // Close Redis connections
  await redis.quit()
  logger.info('Redis connection closed')

  process.exit(0)
}
```

### Pattern 6: 404 Not Found Handler

```typescript
// app/api/[...not-found]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/utils/logger'

export async function GET(request: NextRequest) {
  return handleNotFound(request)
}

export async function POST(request: NextRequest) {
  return handleNotFound(request)
}

export async function PUT(request: NextRequest) {
  return handleNotFound(request)
}

export async function DELETE(request: NextRequest) {
  return handleNotFound(request)
}

function handleNotFound(request: NextRequest) {
  logger.warn('API endpoint not found', {
    method: request.method,
    path: request.nextUrl.pathname,
    ip: request.headers.get('x-forwarded-for')
  })

  return NextResponse.json(
    {
      error: 'Endpoint not found',
      code: 'NOT_FOUND',
      path: request.nextUrl.pathname
    },
    { status: 404 }
  )
}
```

### Pattern 7: Validation Error Handler (Zod Integration)

```typescript
// lib/validation/handler.ts
import { z, ZodError, ZodSchema } from 'zod'
import { NextRequest } from 'next/server'
import { ValidationError } from '@/lib/errors/middleware'

export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json()
    return schema.parse(body)
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }))

      throw new ValidationError('Validation failed', details)
    }

    if (error instanceof SyntaxError) {
      throw new ValidationError('Invalid JSON body')
    }

    throw error
  }
}

// Usage
const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2).max(100)
})

export const POST = asyncHandler(async (request) => {
  const data = await validateRequest(request, userSchema)
  // data is fully typed as { email: string, password: string, name: string }
})
```

### Pattern 8: Database Error Handler (PostgreSQL Error Codes)

```typescript
// lib/errors/database.ts
import { DatabaseError } from '@/lib/errors/middleware'
import { logger } from '@/lib/utils/logger'

// PostgreSQL error codes
// https://www.postgresql.org/docs/current/errcodes-appendix.html
const PG_ERROR_CODES: Record<string, { message: string; status: number }> = {
  '23505': { message: 'Record already exists', status: 409 }, // unique_violation
  '23503': { message: 'Related record not found', status: 400 }, // foreign_key_violation
  '23502': { message: 'Required field missing', status: 400 }, // not_null_violation
  '23514': { message: 'Value out of allowed range', status: 400 }, // check_violation
  '42501': { message: 'Permission denied', status: 403 }, // insufficient_privilege
  '42P01': { message: 'Database configuration error', status: 500 }, // undefined_table
  '53300': { message: 'Too many database connections', status: 503 }, // too_many_connections
  '57014': { message: 'Query cancelled due to timeout', status: 504 }, // query_canceled
  '40001': { message: 'Transaction conflict, please retry', status: 409 }, // serialization_failure
  '40P01': { message: 'Transaction deadlock detected', status: 409 }, // deadlock_detected
}

export function handleDatabaseError(error: any): never {
  const code = error.code
  const constraint = error.constraint

  logger.error('Database error', {
    code,
    constraint,
    message: error.message,
    detail: error.detail,
    table: error.table,
    column: error.column
  })

  // Known PostgreSQL error
  if (code && PG_ERROR_CODES[code]) {
    const { message, status } = PG_ERROR_CODES[code]

    // Add constraint info for unique violations
    if (code === '23505' && constraint) {
      throw new AppError(
        `${message}: ${constraint.replace(/_/g, ' ')}`,
        status,
        'DATABASE_CONSTRAINT'
      )
    }

    throw new AppError(message, status, 'DATABASE_ERROR')
  }

  // Connection errors
  if (error.code === 'ECONNREFUSED') {
    throw new AppError('Database unavailable', 503, 'DATABASE_UNAVAILABLE')
  }

  if (error.code === 'ETIMEDOUT') {
    throw new AppError('Database timeout', 504, 'DATABASE_TIMEOUT')
  }

  // Unknown database error
  throw new DatabaseError('Database operation failed', error)
}

// Usage wrapper
export async function withDatabaseError<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    handleDatabaseError(error)
  }
}
```

### Pattern 9: Request ID Tracking (AsyncLocalStorage)

```typescript
// lib/context/request-context.ts
import { AsyncLocalStorage } from 'async_hooks'

interface RequestContext {
  requestId: string
  userId?: string
  startTime: number
  path: string
  method: string
}

export const requestContext = new AsyncLocalStorage<RequestContext>()

// Middleware to set context
export function middleware(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID()
  const userId = request.headers.get('x-user-id') || undefined

  const context: RequestContext = {
    requestId,
    userId,
    startTime: Date.now(),
    path: request.nextUrl.pathname,
    method: request.method
  }

  // Run rest of request in context
  return requestContext.run(context, () => {
    const response = NextResponse.next()
    response.headers.set('X-Request-ID', requestId)
    return response
  })
}

// Get current context anywhere
export function getRequestContext(): RequestContext | undefined {
  return requestContext.getStore()
}

// Use in logger automatically
export function createContextLogger() {
  return {
    info: (message: string, meta?: any) => {
      const ctx = getRequestContext()
      logger.info(message, { ...meta, ...ctx })
    },
    error: (message: string, meta?: any) => {
      const ctx = getRequestContext()
      logger.error(message, { ...meta, ...ctx })
    }
    // ... other levels
  }
}
```

### Pattern 10: Graceful Shutdown Handler

```typescript
// lib/shutdown/graceful.ts
import { logger } from '@/lib/utils/logger'
import pool from '@/lib/db/pool'
import { redis } from '@/lib/cache/redis'

interface ShutdownTask {
  name: string
  handler: () => Promise<void>
  timeout: number
}

const shutdownTasks: ShutdownTask[] = []
let isShuttingDown = false

export function registerShutdownTask(task: ShutdownTask) {
  shutdownTasks.push(task)
}

export async function gracefulShutdown(signal: string) {
  if (isShuttingDown) {
    logger.warn('Shutdown already in progress')
    return
  }

  isShuttingDown = true
  logger.info(`Received ${signal}, starting graceful shutdown`)

  // Stop accepting new requests
  // (handled by load balancer health check returning unhealthy)

  // Execute shutdown tasks with timeout
  for (const task of shutdownTasks) {
    try {
      logger.info(`Executing shutdown task: ${task.name}`)

      await Promise.race([
        task.handler(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), task.timeout)
        )
      ])

      logger.info(`Completed shutdown task: ${task.name}`)
    } catch (error) {
      logger.error(`Shutdown task failed: ${task.name}`, { error })
    }
  }

  logger.info('Graceful shutdown complete')
  process.exit(0)
}

// Register default tasks
registerShutdownTask({
  name: 'database-pool',
  handler: async () => {
    await pool.end()
  },
  timeout: 10000
})

registerShutdownTask({
  name: 'redis-connection',
  handler: async () => {
    await redis.quit()
  },
  timeout: 5000
})

// Listen for signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
```

### Pattern 11: Error Logging with Sentry Integration

```typescript
// lib/errors/sentry.ts
import * as Sentry from '@sentry/nextjs'
import { logger } from '@/lib/utils/logger'
import { getRequestContext } from '@/lib/context/request-context'

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  beforeSend(event, hint) {
    // Don't send operational errors to Sentry
    const error = hint.originalException
    if (error instanceof AppError && error.isOperational) {
      return null
    }

    // Add request context
    const ctx = getRequestContext()
    if (ctx) {
      event.tags = {
        ...event.tags,
        requestId: ctx.requestId,
        path: ctx.path
      }

      if (ctx.userId) {
        event.user = { id: ctx.userId }
      }
    }

    return event
  }
})

export function captureError(error: Error, context?: Record<string, any>) {
  // Log locally
  logger.error('Error captured', {
    message: error.message,
    stack: error.stack,
    ...context
  })

  // Send to Sentry if non-operational
  if (!(error instanceof AppError) || !error.isOperational) {
    Sentry.captureException(error, {
      contexts: {
        custom: context
      }
    })
  }
}

// Wrap API handlers with Sentry
export function withSentry(handler: AsyncHandler): AsyncHandler {
  return Sentry.wrapApiHandlerWithSentry(handler)
}
```

---


---

## COMPLETE ENCRYPTION PATTERNS (ALL 6 TYPES)

### Pattern 3: TLS/SSL Configuration (HTTPS Enforcement)

```typescript
// middleware.ts - Force HTTPS redirect
export function middleware(request: NextRequest) {
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
      301
    )
  }

  return NextResponse.next()
}

// Database SSL configuration
const pool = new Pool({
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true,
    ca: process.env.DB_CA_CERT
  } : false
})
```

### Pattern 4: Environment Variable Encryption (At Rest)

```typescript
// lib/secrets/env-encryption.ts
import crypto from 'crypto'

const MASTER_KEY = process.env.MASTER_ENCRYPTION_KEY!
const ALGORITHM = 'aes-256-gcm'

export function encryptEnvVar(plaintext: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(MASTER_KEY, 'hex'), iv)

  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag()

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

export function decryptEnvVar(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(MASTER_KEY, 'hex'), iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

// Load encrypted .env file
export function loadEncryptedEnv(path = '.env.encrypted') {
  const envConfig = require('dotenv').parse(require('fs').readFileSync(path))

  for (const [key, value] of Object.entries(envConfig)) {
    if (typeof value === 'string' && value.startsWith('ENC[') && value.endsWith(']')) {
      const encrypted = value.slice(4, -1)
      process.env[key] = decryptEnvVar(encrypted)
    } else {
      process.env[key] = value as string
    }
  }
}
```

### Pattern 5: AES-256-CBC Encryption (Application-Level)

```typescript
// lib/security/encryption.ts
import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')
const IV_LENGTH = 16

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return iv.toString('hex') + ':' + encrypted
}

export function decrypt(text: string): string {
  const [ivHex, encryptedText] = text.split(':')
  const iv = Buffer.from(ivHex, 'hex')

  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv)

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
```

### Pattern 6: Key Management (AWS/Google/Vault)

```typescript
// lib/secrets/aws.ts
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

const client = new SecretsManagerClient({ region: process.env.AWS_REGION })

export async function getSecret(secretName: string): Promise<string> {
  const command = new GetSecretValueCommand({ SecretId: secretName })
  const response = await client.send(command)

  if (response.SecretString) return response.SecretString
  if (response.SecretBinary) return Buffer.from(response.SecretBinary).toString('utf-8')

  throw new Error('Secret not found')
}

export async function loadSecretsFromAWS() {
  const secrets = await getSecret('production/app/secrets')
  const parsed = JSON.parse(secrets)

  process.env.DATABASE_URL = parsed.DATABASE_URL
  process.env.JWT_SECRET = parsed.JWT_SECRET
  process.env.ENCRYPTION_KEY = parsed.ENCRYPTION_KEY
}

// lib/secrets/vault.ts
import axios from 'axios'

const VAULT_ADDR = process.env.VAULT_ADDR || 'http://localhost:8200'
const VAULT_TOKEN = process.env.VAULT_TOKEN!

export async function getVaultSecret(path: string): Promise<any> {
  const response = await axios.get(`${VAULT_ADDR}/v1/secret/data/${path}`, {
    headers: { 'X-Vault-Token': VAULT_TOKEN }
  })
  return response.data.data.data
}
```

---

