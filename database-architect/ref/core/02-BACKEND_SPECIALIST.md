# BACKEND SPECIALIST AGENT
## Complete Backend Security & Infrastructure Patterns
### 100% Knowledge Preservation - Zero Summarization

---

## AGENT ROLE & EXPERTISE

**Primary Function:** Backend security architecture, database design, API security, encryption, authentication/authorization, rate limiting, audit logging, and production deployment strategies.

**Specialization Areas:**
- JWT Authentication & Token Management
- Row-Level Security (RLS) with Supabase/PostgreSQL
- CORS & Security Headers (Helmet.js)
- Rate Limiting Algorithms (Token Bucket, Sliding Window, Adaptive)
- SQL Injection Prevention
- Encryption (bcrypt, pgcrypto, AES-256-CBC, TLS/SSL)
- Audit Logging (Winston with daily rotation)
- Environment Configuration & Secrets Management
- Connection Pooling & Query Optimization
- HIPAA, PCI-DSS, SOX compliance patterns

**Tech Stack:**
- Backend: Node.js, Next.js API Routes, Express.js
- Database: PostgreSQL, Supabase, Prisma ORM
- Security: JWT, bcrypt, Helmet.js, @upstash/ratelimit
- Logging: Winston, winston-daily-rotate-file
- Secrets: AWS Secrets Manager, Google Secret Manager, HashiCorp Vault

---

## TABLE OF CONTENTS

1. [JWT Authentication Patterns](#jwt-authentication-patterns)
2. [Row-Level Security (RLS)](#row-level-security-rls)
3. [CORS Configuration](#cors-configuration)
4. [Security Headers (Helmet.js)](#security-headers-helmetjs)
5. [Error Handling](#error-handling)
6. [Connection Pooling](#connection-pooling)
7. [Rate Limiting Algorithms](#rate-limiting-algorithms)
8. [SQL Injection Prevention](#sql-injection-prevention)
9. [Encryption Patterns](#encryption-patterns)
10. [Audit Logging (Winston)](#audit-logging-winston)
11. [Environment Configuration](#environment-configuration)
12. [Commercial Use Cases](#commercial-use-cases)
13. [Production Deployment Checklist](#production-deployment-checklist)

---

## JWT AUTHENTICATION PATTERNS

### Pattern 1: Complete JWT Implementation (Next.js API Routes)

**File:** `lib/auth/jwt.ts`

```typescript
import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

// Generate short-lived access token (15 minutes)
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
    issuer: 'your-app-name',
    audience: 'your-app-users'
  })
}

// Generate long-lived refresh token (7 days)
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
    issuer: 'your-app-name',
    audience: 'your-app-users'
  })
}

// Verify access token
export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_TOKEN_SECRET, {
    issuer: 'your-app-name',
    audience: 'your-app-users'
  }) as TokenPayload
}

// Verify refresh token
export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET, {
    issuer: 'your-app-name',
    audience: 'your-app-users'
  }) as TokenPayload
}
```

### Pattern 2: Login Endpoint with Token Generation

**File:** `app/api/auth/login/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/auth/password'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt'
import { supabase } from '@/lib/db/supabase'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)
    
    // Fetch user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, role')
      .eq('email', email)
      .single()
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.password_hash)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Generate tokens
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    }
    
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)
    
    // Store refresh token in database
    await supabase
      .from('refresh_tokens')
      .insert({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      })
    
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      accessToken
    })
    
    // Set refresh token as httpOnly cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })
    
    return response
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Pattern 3: Token Refresh Endpoint

**File:** `app/api/auth/refresh/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifyRefreshToken, generateAccessToken } from '@/lib/auth/jwt'
import { supabase } from '@/lib/db/supabase'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      )
    }
    
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken)
    
    // Check if token exists in database and hasn't been revoked
    const { data: tokenRecord, error } = await supabase
      .from('refresh_tokens')
      .select('*')
      .eq('token', refreshToken)
      .eq('user_id', payload.userId)
      .single()
    
    if (error || !tokenRecord) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }
    
    // Generate new access token
    const accessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    })
    
    return NextResponse.json({ accessToken })
    
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Invalid or expired refresh token' },
      { status: 401 }
    )
  }
}
```

### Pattern 4: Authentication Middleware

**File:** `middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'

const publicPaths = ['/login', '/signup', '/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // Check for access token in Authorization header
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const token = authHeader.substring(7) // Remove 'Bearer ' prefix
  
  try {
    const payload = verifyAccessToken(token)
    
    // Add user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-email', payload.email)
    requestHeaders.set('x-user-role', payload.role)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/profile/:path*'
  ]
}
```

### Pattern 5: Logout with Token Revocation

**File:** `app/api/auth/logout/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db/supabase'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value
    
    if (refreshToken) {
      // Revoke refresh token in database
      await supabase
        .from('refresh_tokens')
        .delete()
        .eq('token', refreshToken)
    }
    
    const response = NextResponse.json({ success: true })
    
    // Clear refresh token cookie
    response.cookies.delete('refreshToken')
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
```

---

## ROW-LEVEL SECURITY (RLS)

### Pattern 1: User-Scoped RLS (Users Only See Their Own Data)

**Database Setup:**

```sql
-- Enable RLS on table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own posts
CREATE POLICY "users_view_own_posts"
ON posts
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Users can only insert their own posts
CREATE POLICY "users_insert_own_posts"
ON posts
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Users can only update their own posts
CREATE POLICY "users_update_own_posts"
ON posts
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Users can only delete their own posts
CREATE POLICY "users_delete_own_posts"
ON posts
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
```

**Usage in API:**

```typescript
import { supabase } from '@/lib/db/supabase'

export async function getUserPosts(userId: string) {
  // RLS automatically filters to only this user's posts
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId) // Redundant but explicit
  
  return { data, error }
}
```

### Pattern 2: Team-Based RLS (Multi-Tenancy)

```sql
-- Team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  UNIQUE(team_id, user_id)
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Team members can view team projects
CREATE POLICY "team_members_view_projects"
ON projects
FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members
    WHERE user_id = auth.uid()
  )
);

-- Policy: Only owners/admins can manage projects
CREATE POLICY "owners_admins_manage_projects"
ON projects
FOR ALL
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
```

### Pattern 3: Public + Private RLS

```sql
-- Posts can be public or private
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view public posts
CREATE POLICY "anyone_view_public_posts"
ON posts
FOR SELECT
TO anon, authenticated
USING (is_public = true);

-- Policy: Users can view their own private posts
CREATE POLICY "users_view_own_posts"
ON posts
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Users can manage their own posts
CREATE POLICY "users_manage_own_posts"
ON posts
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

### Pattern 4: Role-Based RLS (RBAC)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'moderator', 'user')) DEFAULT 'user'
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all audit logs
CREATE POLICY "admins_view_all_logs"
ON audit_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Users can view their own audit logs
CREATE POLICY "users_view_own_logs"
ON audit_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
```

---

## CORS CONFIGURATION

### Pattern 1: Production CORS (Next.js API Routes)

**File:** `middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  // Check if origin is allowed
  const isAllowed = origin && allowedOrigins.includes(origin)
  
  const response = NextResponse.next()
  
  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    )
  }
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers
    })
  }
  
  return response
}

export const config = {
  matcher: '/api/:path*'
}
```

**Environment Variable:**

```env
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

### Pattern 2: CORS with Express.js

**File:** `server.js`

```javascript
import express from 'express'
import cors from 'cors'

const app = express()

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',')
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
```

---

## SECURITY HEADERS (HELMET.JS)

### Pattern 1: Complete Helmet Configuration (Next.js)

**File:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.yourdomain.com",
              "frame-ancestors 'self'"
            ].join('; ')
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

### Pattern 2: Helmet with Express.js

**File:** `server.js`

```javascript
import express from 'express'
import helmet from 'helmet'

const app = express()

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.yourdomain.com"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'sameorigin'
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}))
```

---

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

## CONNECTION POOLING

### Pattern 1: PostgreSQL Connection Pool (pg)

**File:** `lib/db/pool.ts`

```typescript
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  
  // Pool configuration
  max: 20,                    // Maximum number of clients
  min: 5,                     // Minimum number of clients
  idleTimeoutMillis: 30000,  // Close idle clients after 30s
  connectionTimeoutMillis: 2000, // Wait 2s for connection
  
  // SSL configuration (production only)
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }
    : false
})

// Error handling
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
})

// Pool statistics (for monitoring)
export function getPoolStats() {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount
  }
}

export default pool
```

### Pattern 2: Supabase Connection (Already Pooled)

**File:** `lib/db/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Supabase handles connection pooling automatically
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
```

---

## RATE LIMITING ALGORITHMS

### Pattern 1: Token Bucket (Smooth Rate Limiting)

**File:** `lib/security/rate-limit-token-bucket.ts`

```typescript
interface TokenBucket {
  tokens: number
  lastRefill: number
}

const buckets = new Map<string, TokenBucket>()

export function tokenBucket(
  identifier: string,
  maxTokens: number = 100,
  refillRate: number = 10, // tokens per second
  cost: number = 1
): { success: boolean; remainingTokens: number } {
  const now = Date.now()
  const bucket = buckets.get(identifier) || {
    tokens: maxTokens,
    lastRefill: now
  }
  
  // Calculate tokens to add based on time elapsed
  const secondsElapsed = (now - bucket.lastRefill) / 1000
  const tokensToAdd = secondsElapsed * refillRate
  
  // Refill bucket (cap at maxTokens)
  bucket.tokens = Math.min(maxTokens, bucket.tokens + tokensToAdd)
  bucket.lastRefill = now
  
  // Check if enough tokens available
  if (bucket.tokens >= cost) {
    bucket.tokens -= cost
    buckets.set(identifier, bucket)
    return { success: true, remainingTokens: Math.floor(bucket.tokens) }
  }
  
  buckets.set(identifier, bucket)
  return { success: false, remainingTokens: Math.floor(bucket.tokens) }
}
```

**Usage:**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { tokenBucket } from '@/lib/security/rate-limit-token-bucket'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  
  const { success, remainingTokens } = tokenBucket(ip)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': remainingTokens.toString(),
          'Retry-After': '1'
        }
      }
    )
  }
  
  // Process request...
}
```

### Pattern 2: Sliding Window (Redis-Backed) - RECOMMENDED

**File:** `lib/security/rate-limit.ts`

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

// API rate limiter: 100 requests per minute
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'ratelimit:api'
})

// Auth rate limiter: 5 attempts per 10 minutes
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: true,
  prefix: 'ratelimit:auth'
})

// Sensitive operations: 10 per hour
export const sensitiveRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
  prefix: 'ratelimit:sensitive'
})
```

**Usage in Middleware:**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { apiRateLimit, authRateLimit } from '@/lib/security/rate-limit'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Choose appropriate rate limiter
  const rateLimiter = pathname.startsWith('/api/auth')
    ? authRateLimit
    : apiRateLimit
  
  const identifier = request.headers.get('x-forwarded-for') || 'unknown'
  
  const { success, limit, remaining, reset, pending } = 
    await rateLimiter.limit(identifier)
  
  const response = success
    ? NextResponse.next()
    : NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', limit.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', reset.toString())
  
  if (!success) {
    response.headers.set(
      'Retry-After',
      Math.ceil((reset - Date.now()) / 1000).toString()
    )
  }
  
  return response
}
```

### Pattern 3: Adaptive Rate Limiting (Based on Server Load)

**File:** `lib/security/adaptive-rate-limit.ts`

```typescript
import os from 'os'
import pool from '@/lib/db/pool'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

const baseLimit = 100 // requests per minute
const minLimit = 20
const maxLimit = 200

export async function getAdaptiveLimit(): Promise<number> {
  // Check CPU usage
  const cpus = os.cpus()
  const cpuUsage = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b)
    const idle = cpu.times.idle
    return acc + (1 - idle / total)
  }, 0) / cpus.length
  
  // Check memory usage
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const memUsage = 1 - (freeMem / totalMem)
  
  // Check database pool utilization
  const poolStats = pool.totalCount / pool.max
  
  // Calculate stress factor (0-1)
  const stressFactor = Math.max(cpuUsage, memUsage, poolStats)
  
  // Adjust limit based on stress
  let currentLimit: number
  
  if (stressFactor > 0.8) {
    currentLimit = minLimit // High stress: strict limiting
  } else if (stressFactor > 0.6) {
    currentLimit = baseLimit * 0.5 // Medium stress: reduce by 50%
  } else if (stressFactor < 0.3) {
    currentLimit = maxLimit // Low stress: increase capacity
  } else {
    currentLimit = baseLimit // Normal operation
  }
  
  return Math.floor(currentLimit)
}

export async function adaptiveRateLimit(identifier: string) {
  const currentLimit = await getAdaptiveLimit()
  
  const rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(currentLimit, '1 m'),
    prefix: 'ratelimit:adaptive'
  })
  
  return rateLimiter.limit(identifier)
}
```

---

## SQL INJECTION PREVENTION

### Pattern 1: Parameterized Queries (pg-postgres) ✅ SAFE

```typescript
import pool from '@/lib/db/pool'

// ✅ SAFE: Parameterized query
export async function getUserByEmail(email: string) {
  const query = 'SELECT * FROM users WHERE email = $1 AND status = $2'
  const values = [email, 'active']
  
  const result = await pool.query(query, values)
  return result.rows[0]
}

// ❌ UNSAFE: String concatenation - SQL INJECTION!
export async function getUserByEmailUnsafe(email: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`
  const result = await pool.query(query)
  return result.rows[0]
}
```

### Pattern 2: Supabase Query Builder ✅ SAFE

```typescript
import { supabase } from '@/lib/db/supabase'

// ✅ SAFE: All Supabase filters are automatically parameterized
export async function searchUsers(searchTerm: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('name', `%${searchTerm}%`)
    .eq('status', 'active')
  
  return { data, error }
}
```

### Pattern 3: Prisma ORM ✅ SAFE

```typescript
import { prisma } from '@/lib/db/prisma'

// ✅ SAFE: Prisma automatically parameterizes
export async function getUser(email: string) {
  return prisma.user.findUnique({
    where: { email }
  })
}

// ✅ SAFE: Raw queries with parameters
export async function customQuery(userId: string) {
  return prisma.$queryRaw`
    SELECT * FROM users WHERE id = ${userId}
  `
}
```

### Pattern 4: Input Validation with Zod ✅ SAFE

```typescript
import { z } from 'zod'
import pool from '@/lib/db/pool'

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(18).max(120),
  role: z.enum(['admin', 'user', 'guest'])
})

export async function createUser(input: unknown) {
  // Validate input BEFORE database query
  const validated = userSchema.parse(input)
  
  const query = `
    INSERT INTO users (email, age, role)
    VALUES ($1, $2, $3)
    RETURNING *
  `
  
  const result = await pool.query(query, [
    validated.email,
    validated.age,
    validated.role
  ])
  
  return result.rows[0]
}
```

### Pattern 5: Whitelisting (Column Names, Sort Orders)

```typescript
const allowedSortColumns = ['name', 'email', 'created_at']
const allowedSortOrders = ['ASC', 'DESC']

export async function getUsers(
  sortBy: string = 'created_at',
  sortOrder: string = 'DESC'
) {
  // Validate against whitelist
  if (!allowedSortColumns.includes(sortBy)) {
    sortBy = 'created_at'
  }
  
  if (!allowedSortOrders.includes(sortOrder.toUpperCase())) {
    sortOrder = 'DESC'
  }
  
  // ✅ SAFE: Column name is whitelisted
  const query = `
    SELECT * FROM users
    ORDER BY ${sortBy} ${sortOrder}
  `
  
  const result = await pool.query(query)
  return result.rows
}
```

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

## AUDIT LOGGING (WINSTON)

### Pattern 1: Complete Winston Configuration

**File:** `lib/utils/logger.ts`

```typescript
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// Custom log levels with colors
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
  }
}

winston.addColors(customLevels.colors)

// Custom format for structured logging
const structuredFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata(),
  winston.format.json()
)

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, metadata }) => {
    const meta = Object.keys(metadata).length ? JSON.stringify(metadata) : ''
    return `[${timestamp}] ${level}: ${message} ${meta}`
  })
)

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: customLevels.levels,
  format: structuredFormat,
  defaultMeta: {
    service: 'api',
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    hostname: process.env.HOSTNAME
  },
  transports: [
    // Error logs (daily rotation)
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true
    }),
    
    // Combined logs (daily rotation)
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true
    }),
    
    // Access logs (HTTP requests)
    new DailyRotateFile({
      filename: 'logs/access-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'http',
      maxSize: '50m',
      maxFiles: '7d',
      zippedArchive: true
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'logs/exceptions.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: 'logs/rejections.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
})

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug'
  }))
}

// Convenience methods
export const log = {
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  http: (message: string, meta?: any) => logger.http(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta)
}

export default logger
```

### Pattern 2: HTTP Request Logging (Express/Next.js)

**File:** `lib/middleware/request-logger.ts`

```typescript
import { NextRequest } from 'next/server'
import logger from '@/lib/utils/logger'

export function logRequest(
  method: string,
  path: string,
  statusCode: number,
  responseTime: number,
  meta?: Record<string, any>
) {
  logger.http('HTTP Request', {
    method,
    path,
    statusCode,
    responseTime,
    ...meta
  })
}
```

**Usage in Middleware:**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { logRequest } from '@/lib/middleware/request-logger'

export function middleware(request: NextRequest) {
  const startTime = Date.now()
  
  const response = NextResponse.next()
  
  // Log after response
  const responseTime = Date.now() - startTime
  
  logRequest(
    request.method,
    request.nextUrl.pathname,
    response.status,
    responseTime,
    {
      query: Object.fromEntries(request.nextUrl.searchParams),
      ip: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      userId: request.headers.get('x-user-id'),
      requestId: request.headers.get('x-request-id')
    }
  )
  
  return response
}
```

### Pattern 3: Security Event Logging

**File:** `lib/utils/security-logger.ts`

```typescript
import logger from '@/lib/utils/logger'
import { supabase } from '@/lib/db/supabase'

type SecurityEventType =
  | 'FAILED_LOGIN'
  | 'SUCCESSFUL_LOGIN'
  | 'PASSWORD_RESET'
  | 'PASSWORD_CHANGED'
  | 'PERMISSION_DENIED'
  | 'SUSPICIOUS_ACTIVITY'
  | 'RATE_LIMIT_EXCEEDED'
  | 'TOKEN_REUSE_DETECTED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'

interface SecurityEvent {
  type: SecurityEventType
  userId?: string
  ip: string
  userAgent: string
  details?: Record<string, any>
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export async function logSecurityEvent(event: SecurityEvent) {
  // Log to Winston
  const logLevel = event.severity === 'CRITICAL' || event.severity === 'HIGH'
    ? 'error'
    : event.severity === 'MEDIUM'
    ? 'warn'
    : 'info'
  
  logger[logLevel]('Security Event', event)
  
  // Store in database for compliance
  await supabase
    .from('security_events')
    .insert({
      event_type: event.type,
      user_id: event.userId,
      ip_address: event.ip,
      user_agent: event.userAgent,
      details: event.details,
      severity: event.severity,
      created_at: new Date().toISOString()
    })
}
```

**Usage:**

```typescript
// Failed login attempt
await logSecurityEvent({
  type: 'FAILED_LOGIN',
  userId: undefined,
  ip: request.headers.get('x-forwarded-for')!,
  userAgent: request.headers.get('user-agent')!,
  details: { email: 'user@example.com', reason: 'Invalid password' },
  severity: 'MEDIUM'
})

// Token reuse detected
await logSecurityEvent({
  type: 'TOKEN_REUSE_DETECTED',
  userId: payload.userId,
  ip: request.headers.get('x-forwarded-for')!,
  userAgent: request.headers.get('user-agent')!,
  details: { tokenId: 'abc123' },
  severity: 'HIGH'
})
```

---

## ENVIRONMENT CONFIGURATION

### Pattern 1: Centralized Configuration with Validation

**File:** `lib/config.ts`

```typescript
import { z } from 'zod'

const configSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number().default(3000),
  
  // Application
  APP_NAME: z.string(),
  APP_URL: z.string().url(),
  
  // Database
  DATABASE_URL: z.string().url(),
  DB_POOL_SIZE: z.coerce.number().default(20),
  DB_POOL_MIN: z.coerce.number().default(5),
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  
  // Encryption
  ENCRYPTION_KEY: z.string().length(64), // 32 bytes hex
  BCRYPT_SALT_ROUNDS: z.coerce.number().min(10).max(14).default(12),
  
  // CORS
  CORS_ORIGINS: z.string().transform(s => s.split(',')),
  
  // Redis (Upstash)
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  
  // Rate Limiting
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW: z.string().default('1 m'),
  
  // External Services (Optional)
  STRIPE_SECRET_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  
  // Feature Flags
  ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  ENABLE_DEBUG_MODE: z.coerce.boolean().default(false)
})

function loadConfig() {
  try {
    const config = configSchema.parse(process.env)
    console.log('✅ Configuration loaded successfully')
    return config
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Configuration validation failed:')
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
      process.exit(1)
    }
    throw error
  }
}

export const appConfig = loadConfig()

export const isDevelopment = appConfig.NODE_ENV === 'development'
export const isProduction = appConfig.NODE_ENV === 'production'
export const isStaging = appConfig.NODE_ENV === 'staging'
```

**.env.example:**

```env
# Node Environment
NODE_ENV=development
PORT=3000

# Application
APP_NAME=My App
APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
DB_POOL_SIZE=20
DB_POOL_MIN=5

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# JWT Secrets (MUST be at least 32 characters)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-minimum-32-chars

# Encryption
ENCRYPTION_KEY=64-character-hex-string-for-aes-256-encryption-key-here
BCRYPT_SALT_ROUNDS=12

# CORS
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=1 m

# External Services (Optional)
STRIPE_SECRET_KEY=sk_test_xxxxx
SENDGRID_API_KEY=SG.xxxxx
AWS_ACCESS_KEY_ID=AKIAXXXXX
AWS_SECRET_ACCESS_KEY=xxxxx

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Logging
LOG_LEVEL=debug

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_DEBUG_MODE=true
```

---

## COMMERCIAL USE CASES

### Use Case 1: SAAS Multi-Tenant Application

**Complete Implementation Strategy:**

**Database Schema:**

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subscription_status TEXT CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired')),
  subscription_plan TEXT CHECK (subscription_plan IN ('free', 'starter', 'pro', 'enterprise')),
  trial_ends_at TIMESTAMPTZ,
  max_members INTEGER DEFAULT 5,
  max_projects INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'archived', 'draft')) DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Team members can view their teams
CREATE POLICY "team_members_view_teams"
ON teams FOR SELECT
TO authenticated
USING (id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Team members can view team projects
CREATE POLICY "team_members_view_projects"
ON projects FOR SELECT
TO authenticated
USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Owners/admins can manage projects
CREATE POLICY "owners_admins_manage_projects"
ON projects FOR ALL
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
```

**Subscription Management (Stripe):**

```typescript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function createCheckoutSession(
  teamId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: teamId,
    metadata: { teamId }
  })
  
  return session
}

// Webhook handler
export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    
    switch (event.type) {
      case 'checkout.session.completed':
        await handleSubscriptionCreated(event.data.object)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object)
        break
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
```

---

## PRODUCTION DEPLOYMENT CHECKLIST

### SECURITY (13 Critical Items)

- [ ] **Environment Variables**: Secrets stored in AWS Secrets Manager / equivalent
- [ ] **HTTPS Enforced**: All traffic redirected to HTTPS (HSTS header set)
- [ ] **CORS Configured**: Explicit origin whitelist (NO wildcards)
- [ ] **Rate Limiting**: Implemented on all public APIs (100/min standard, 5/10min auth)
- [ ] **Input Validation**: Zod schemas on all API endpoints (client + server)
- [ ] **SQL Injection Prevention**: Parameterized queries ONLY (no string concatenation)
- [ ] **Error Sanitization**: Production errors hide stack traces and sensitive data
- [ ] **RLS Policies**: Row-Level Security enabled and tested on all tables
- [ ] **JWT Configuration**: 15min access tokens, 7-day refresh with rotation
- [ ] **Security Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options set
- [ ] **Audit Logging**: Winston configured with daily rotation (14-day retention)
- [ ] **Connection Pooling**: Pool size configured (20-75 based on tier)
- [ ] **Password Hashing**: bcrypt with 10-12 rounds (NEVER plaintext/MD5/SHA1)

### PERFORMANCE (7 Items)

- [ ] **Database Indexes**: Indexes on foreign keys and RLS policy columns
- [ ] **React Query Cache**: Configured with staleTime: 5min, cacheTime: 30min
- [ ] **Next.js Image**: Using next/image for automatic optimization
- [ ] **Code Splitting**: Lazy loading for large components (React.lazy)
- [ ] **API Response Caching**: Redis or Next.js cache for expensive queries
- [ ] **Query Optimization**: EXPLAIN ANALYZE run on slow queries (>1s)
- [ ] **Connection Pooling**: pg-pool with 20 connections, 30s idle timeout

### MONITORING (7 Items)

- [ ] **Error Tracking**: Sentry configured with DSN and sourcemaps
- [ ] **Structured Logging**: Winston with JSON format, daily rotation
- [ ] **Log Rotation**: DailyRotateFile, 20MB max, 14-day retention, zipped
- [ ] **Performance Monitoring**: Vercel Analytics or equivalent enabled
- [ ] **Database Monitoring**: Pool stats logged, slow queries tracked
- [ ] **Rate Limit Alerting**: Alerts on excessive rate limit hits
- [ ] **Failed Login Monitoring**: Security events logged and monitored

---

## ADVANCED JWT PATTERNS (ENHANCED)

### Pattern 6: RS256 Asymmetric JWT (Public/Private Key)

**File:** `lib/auth/jwt-rs256.ts`

```typescript
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

// Load keys (generate with: openssl genrsa -out private.pem 2048 && openssl rsa -in private.pem -pubout -out public.pem)
const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH || './keys/private.pem'
const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH || './keys/public.pem'

const PRIVATE_KEY = fs.readFileSync(path.resolve(privateKeyPath), 'utf8')
const PUBLIC_KEY = fs.readFileSync(path.resolve(publicKeyPath), 'utf8')

export interface TokenPayload {
  userId: string
  email: string
  role: 'admin' | 'moderator' | 'user'
  permissions?: string[]
}

// Generate access token with RS256 (15 minutes)
export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: '15m',
    issuer: process.env.JWT_ISSUER || 'your-app',
    audience: process.env.JWT_AUDIENCE || 'your-app-users'
  })
}

// Generate refresh token with RS256 (7 days)
export function signRefreshToken(payload: { userId: string; tokenFamily: string }): string {
  return jwt.sign(payload, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: '7d',
    issuer: process.env.JWT_ISSUER || 'your-app'
  })
}

// Verify token with public key (can be shared with microservices)
export function verifyToken<T>(token: string): T {
  return jwt.verify(token, PUBLIC_KEY, {
    algorithms: ['RS256'],
    issuer: process.env.JWT_ISSUER || 'your-app'
  }) as T
}

// Decode without verification (for debugging only)
export function decodeToken(token: string): any {
  return jwt.decode(token, { complete: true })
}
```

**Benefits of RS256 over HS256:**
```
✅ RS256 (Asymmetric):
- Private key signs tokens (server only)
- Public key verifies tokens (can be shared)
- Microservices verify without signing capability
- Key rotation without service disruption
- Better for distributed systems

❌ HS256 (Symmetric):
- Same secret for signing AND verifying
- All services with secret can forge tokens
- Key compromise requires all services update
- Better for single server setups only
```

### Pattern 7: Refresh Token Family Rotation (Token Reuse Detection)

**File:** `lib/auth/token-family.ts`

```typescript
import { createAdminClient } from '@/lib/supabase/admin'
import { signAccessToken, signRefreshToken, verifyToken } from './jwt-rs256'
import { logger } from '@/lib/utils/logger'
import { v4 as uuidv4 } from 'uuid'

interface RefreshTokenPayload {
  userId: string
  tokenFamily: string
  exp: number
}

// Database table structure
/*
CREATE TABLE refresh_token_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id TEXT UNIQUE NOT NULL,
  current_token_hash TEXT NOT NULL,
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  invalidated_at TIMESTAMPTZ,
  invalidation_reason TEXT
);

CREATE INDEX idx_token_families_user ON refresh_token_families(user_id);
CREATE INDEX idx_token_families_family ON refresh_token_families(family_id);
*/

// Create new token family on login
export async function createTokenFamily(userId: string, userEmail: string, userRole: string) {
  const supabase = createAdminClient()
  const familyId = uuidv4()

  // Generate tokens
  const accessToken = signAccessToken({
    userId,
    email: userEmail,
    role: userRole as any
  })

  const refreshToken = signRefreshToken({
    userId,
    tokenFamily: familyId
  })

  // Store family in database
  const tokenHash = await hashToken(refreshToken)

  await supabase.from('refresh_token_families').insert({
    user_id: userId,
    family_id: familyId,
    current_token_hash: tokenHash,
    is_valid: true
  })

  logger.info('Token family created', { userId, familyId })

  return { accessToken, refreshToken, familyId }
}

// Rotate refresh token (CRITICAL: detect reuse attacks)
export async function rotateRefreshToken(oldRefreshToken: string) {
  const supabase = createAdminClient()

  try {
    // Verify and decode old token
    const payload = verifyToken<RefreshTokenPayload>(oldRefreshToken)
    const { userId, tokenFamily } = payload

    // Get family from database
    const { data: family, error } = await supabase
      .from('refresh_token_families')
      .select('*')
      .eq('family_id', tokenFamily)
      .single()

    if (error || !family) {
      logger.warn('Token family not found', { tokenFamily })
      throw new Error('Invalid refresh token')
    }

    // Check if family is still valid
    if (!family.is_valid) {
      // TOKEN REUSE DETECTED - Someone is using an old token
      // This means the token was likely stolen
      logger.error('TOKEN REUSE DETECTED - Potential token theft', {
        userId,
        tokenFamily,
        invalidatedAt: family.invalidated_at,
        reason: family.invalidation_reason
      })

      // Invalidate ALL sessions for this user (nuclear option)
      await supabase
        .from('refresh_token_families')
        .update({
          is_valid: false,
          invalidation_reason: 'Token reuse detected - all sessions invalidated'
        })
        .eq('user_id', userId)

      // Log security event
      await logSecurityEvent({
        type: 'TOKEN_REUSE_DETECTED',
        userId,
        details: { tokenFamily },
        severity: 'CRITICAL'
      })

      throw new Error('Security violation: Token reuse detected')
    }

    // Verify token hash matches current
    const oldTokenHash = await hashToken(oldRefreshToken)
    if (oldTokenHash !== family.current_token_hash) {
      logger.warn('Token hash mismatch', { userId, tokenFamily })
      throw new Error('Invalid refresh token')
    }

    // Generate new refresh token (same family)
    const newRefreshToken = signRefreshToken({
      userId,
      tokenFamily
    })

    const newTokenHash = await hashToken(newRefreshToken)

    // Update family with new token hash
    await supabase
      .from('refresh_token_families')
      .update({
        current_token_hash: newTokenHash,
        last_used_at: new Date().toISOString()
      })
      .eq('family_id', tokenFamily)

    // Get user details for new access token
    const { data: user } = await supabase
      .from('users')
      .select('email, role')
      .eq('id', userId)
      .single()

    const newAccessToken = signAccessToken({
      userId,
      email: user?.email || '',
      role: user?.role || 'user'
    })

    logger.info('Token rotated successfully', { userId, tokenFamily })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }

  } catch (error) {
    logger.error('Token rotation failed', { error })
    throw error
  }
}

// Logout - invalidate token family
export async function invalidateTokenFamily(refreshToken: string, reason: string = 'logout') {
  const supabase = createAdminClient()

  try {
    const payload = verifyToken<RefreshTokenPayload>(refreshToken)

    await supabase
      .from('refresh_token_families')
      .update({
        is_valid: false,
        invalidated_at: new Date().toISOString(),
        invalidation_reason: reason
      })
      .eq('family_id', payload.tokenFamily)

    logger.info('Token family invalidated', {
      tokenFamily: payload.tokenFamily,
      reason
    })

  } catch (error) {
    // Token might be expired, try to invalidate by hash
    logger.warn('Could not verify token for invalidation', { error })
  }
}

// Hash token for secure storage
async function hashToken(token: string): Promise<string> {
  const crypto = await import('crypto')
  return crypto.createHash('sha256').update(token).digest('hex')
}

// Security event logger
async function logSecurityEvent(event: {
  type: string
  userId: string
  details: any
  severity: string
}) {
  logger.error('Security Event', event)
  // Could also store in security_events table or send to SIEM
}
```

**Token Rotation Flow:**
```
1. User logs in → Create new token family (familyId: abc123)
2. Token stored: { familyId: abc123, currentHash: hash1, valid: true }
3. User refreshes → Rotate token, update hash: hash2
4. Attacker tries old token → hash1 ≠ hash2 → REUSE DETECTED
5. All user sessions invalidated (nuclear option)
6. User must re-login on all devices
```

---

## COMPLETE CORS CONFIGURATION (ALL 8 PATTERNS)

### Pattern 3: Dynamic Origin Validation (Function-Based)

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

// Allowed origins from environment
const PRODUCTION_ORIGINS = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean)

// Development origins (localhost with any port)
const isDevelopment = process.env.NODE_ENV === 'development'

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false

  // Production: strict whitelist
  if (!isDevelopment) {
    return PRODUCTION_ORIGINS.includes(origin)
  }

  // Development: allow localhost with any port
  try {
    const url = new URL(origin)
    return (
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1' ||
      url.hostname.endsWith('.localhost')
    )
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  const isAllowed = isAllowedOrigin(origin)

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowed ? origin! : '',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400' // 24 hours preflight cache
      }
    })
  }

  const response = NextResponse.next()

  if (isAllowed && origin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Expose-Headers', 'X-Request-ID, X-RateLimit-Remaining')
  }

  return response
}
```

### Pattern 4: Route-Specific CORS (Different Policies Per Endpoint)

```typescript
// lib/cors/route-specific.ts
interface CORSConfig {
  origins: string[]
  methods: string[]
  allowCredentials: boolean
  maxAge: number
}

const routeCORSConfigs: Record<string, CORSConfig> = {
  // Public API - restricted origins
  '/api/public': {
    origins: ['https://yourdomain.com'],
    methods: ['GET'],
    allowCredentials: false,
    maxAge: 86400
  },

  // Auth endpoints - stricter
  '/api/auth': {
    origins: ['https://app.yourdomain.com'],
    methods: ['POST'],
    allowCredentials: true,
    maxAge: 0 // No caching for security
  },

  // Admin API - most restrictive
  '/api/admin': {
    origins: ['https://admin.yourdomain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowCredentials: true,
    maxAge: 0
  },

  // Webhook endpoints - no CORS (server-to-server)
  '/api/webhooks': {
    origins: [], // Block browser requests
    methods: ['POST'],
    allowCredentials: false,
    maxAge: 0
  }
}

export function getCORSConfig(pathname: string): CORSConfig {
  // Find matching route config
  for (const [route, config] of Object.entries(routeCORSConfigs)) {
    if (pathname.startsWith(route)) {
      return config
    }
  }

  // Default config
  return {
    origins: process.env.CORS_ORIGINS?.split(',') || [],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowCredentials: true,
    maxAge: 3600
  }
}

// Usage in middleware
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const origin = request.headers.get('origin')
  const config = getCORSConfig(pathname)

  const isAllowed = origin && config.origins.includes(origin)

  // ... apply CORS headers based on config
}
```

### Pattern 5: Preflight Handling (OPTIONS Method) - Complete

```typescript
// middleware.ts - Complete preflight implementation
export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  const requestMethod = request.headers.get('access-control-request-method')
  const requestHeaders = request.headers.get('access-control-request-headers')

  // Preflight request (OPTIONS with CORS headers)
  if (request.method === 'OPTIONS' && (requestMethod || requestHeaders)) {
    const isAllowed = isAllowedOrigin(origin)

    if (!isAllowed) {
      return new NextResponse(null, { status: 403 })
    }

    return new NextResponse(null, {
      status: 204,
      headers: {
        // Required CORS headers
        'Access-Control-Allow-Origin': origin!,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': requestHeaders || 'Content-Type, Authorization',

        // Optional but recommended
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours

        // Expose custom headers to client
        'Access-Control-Expose-Headers': 'X-Request-ID, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset',

        // Prevent caching of preflight response in some browsers
        'Vary': 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers'
      }
    })
  }

  // Actual request handling...
}
```

### Pattern 6: Credentials with CORS (Cookies + Auth)

```typescript
// CRITICAL: When using credentials (cookies), you CANNOT use wildcard origin

// ❌ WRONG - Will fail with credentials
response.headers.set('Access-Control-Allow-Origin', '*')
response.headers.set('Access-Control-Allow-Credentials', 'true')

// ✅ CORRECT - Explicit origin with credentials
response.headers.set('Access-Control-Allow-Origin', 'https://app.yourdomain.com')
response.headers.set('Access-Control-Allow-Credentials', 'true')

// Client-side fetch with credentials
fetch('https://api.yourdomain.com/data', {
  method: 'GET',
  credentials: 'include', // Include cookies
  headers: {
    'Content-Type': 'application/json'
  }
})
```

### Pattern 7: Exposed Headers (Custom Response Headers)

```typescript
// By default, browsers only expose these headers:
// - Cache-Control
// - Content-Language
// - Content-Type
// - Expires
// - Last-Modified
// - Pragma

// To expose custom headers (like rate limit info), use:
response.headers.set(
  'Access-Control-Expose-Headers',
  [
    'X-Request-ID',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'X-Total-Count',
    'X-Page-Count',
    'Link' // Pagination links
  ].join(', ')
)

// Now client JavaScript can access:
const response = await fetch('/api/users')
const requestId = response.headers.get('X-Request-ID')
const rateLimit = response.headers.get('X-RateLimit-Remaining')
```

### Pattern 8: Environment-Based CORS (Dev vs Production)

```typescript
// lib/cors/environment.ts
interface CORSEnvironmentConfig {
  development: {
    origins: string[]
    debug: boolean
  }
  staging: {
    origins: string[]
    debug: boolean
  }
  production: {
    origins: string[]
    debug: boolean
  }
}

const corsConfig: CORSEnvironmentConfig = {
  development: {
    origins: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000'
    ],
    debug: true
  },
  staging: {
    origins: [
      'https://staging.yourdomain.com',
      'https://staging-app.yourdomain.com'
    ],
    debug: true
  },
  production: {
    origins: [
      'https://yourdomain.com',
      'https://app.yourdomain.com',
      'https://www.yourdomain.com'
    ],
    debug: false
  }
}

export function getCORSForEnvironment() {
  const env = process.env.NODE_ENV as keyof CORSEnvironmentConfig
  return corsConfig[env] || corsConfig.production
}

// Usage
const { origins, debug } = getCORSForEnvironment()

if (debug && !isAllowedOrigin(origin)) {
  console.warn(`CORS blocked origin: ${origin}`)
}
```

### CORS Security Vulnerabilities to Avoid

```typescript
// ❌ DANGER: Origin reflection attack
// Never reflect the origin header without validation!
const origin = request.headers.get('origin')
response.headers.set('Access-Control-Allow-Origin', origin!) // VULNERABLE!

// ❌ DANGER: Null origin bypass
// Don't allow 'null' origin (used by file:// and data: URLs)
if (origin === 'null') {
  response.headers.set('Access-Control-Allow-Origin', 'null') // VULNERABLE!
}

// ❌ DANGER: Regex bypass
// Weak regex can be exploited
const allowedPattern = /yourdomain\.com$/
// Attacker uses: malicious-yourdomain.com (MATCHES!)

// ✅ SAFE: Exact match against whitelist
const allowedOrigins = new Set([
  'https://yourdomain.com',
  'https://app.yourdomain.com'
])
const isAllowed = allowedOrigins.has(origin)
```

---

## COMPLETE SECURITY HEADERS (ALL 13 HEADERS)

### Complete Helmet.js / Next.js Security Headers

```typescript
// lib/security/headers.ts
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export function applySecurityHeaders(
  response: NextResponse,
  options?: { nonce?: string }
): NextResponse {
  const nonce = options?.nonce || crypto.randomBytes(16).toString('base64')

  // 1. Content-Security-Policy (CSP) with Nonce
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.yourdomain.com wss://realtime.yourdomain.com",
    "media-src 'self'",
    "object-src 'none'",
    "frame-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
    "block-all-mixed-content"
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  // 2. Strict-Transport-Security (HSTS)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )

  // 3. X-Frame-Options (Clickjacking protection)
  response.headers.set('X-Frame-Options', 'DENY')

  // 4. X-Content-Type-Options (MIME sniffing protection)
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // 5. X-XSS-Protection (DISABLED - use CSP instead)
  // Modern browsers should rely on CSP, not this deprecated header
  response.headers.set('X-XSS-Protection', '0')

  // 6. Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // 7. Permissions-Policy (formerly Feature-Policy)
  response.headers.set(
    'Permissions-Policy',
    [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()', // Block FLoC
      'accelerometer=()',
      'gyroscope=()',
      'magnetometer=()',
      'payment=(self)',
      'usb=()',
      'bluetooth=()'
    ].join(', ')
  )

  // 8. Cross-Origin-Opener-Policy (COOP) - Spectre protection
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')

  // 9. Cross-Origin-Resource-Policy (CORP)
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')

  // 10. Cross-Origin-Embedder-Policy (COEP)
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')

  // 11. Origin-Agent-Cluster
  response.headers.set('Origin-Agent-Cluster', '?1')

  // 12. X-DNS-Prefetch-Control
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  // 13. X-Download-Options (IE specific)
  response.headers.set('X-Download-Options', 'noopen')

  // Store nonce for use in page rendering
  response.headers.set('X-Nonce', nonce)

  return response
}
```

### CSP Nonce Pattern (For Inline Scripts)

```typescript
// middleware.ts - Generate nonce per request
import crypto from 'crypto'

export function middleware(request: NextRequest) {
  const nonce = crypto.randomBytes(16).toString('base64')

  const response = NextResponse.next()

  // Set CSP with nonce
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
  `.replace(/\s+/g, ' ').trim()

  response.headers.set('Content-Security-Policy', csp)

  // Pass nonce to page via header (read in _document.tsx or layout.tsx)
  response.headers.set('X-Nonce', nonce)

  return response
}

// app/layout.tsx - Use nonce in script tags
import { headers } from 'next/headers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const nonce = headersList.get('X-Nonce') || ''

  return (
    <html lang="en">
      <head>
        <script nonce={nonce}>
          {`console.log('Inline script with nonce')`}
        </script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

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

## COMPLETE CONNECTION POOLING (ALL 9 PATTERNS)

### Pattern 3: Connection Retry Logic with Exponential Backoff

```typescript
// lib/db/retry.ts
import { Pool, PoolClient } from 'pg'
import { logger } from '@/lib/utils/logger'

interface RetryConfig {
  maxRetries: number
  initialDelay: number
  maxDelay: number
  factor: number
}

const defaultConfig: RetryConfig = {
  maxRetries: 5,
  initialDelay: 100,
  maxDelay: 5000,
  factor: 2
}

export async function queryWithRetry<T>(
  pool: Pool,
  query: string,
  params?: any[],
  config: Partial<RetryConfig> = {}
): Promise<T[]> {
  const { maxRetries, initialDelay, maxDelay, factor } = { ...defaultConfig, ...config }

  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await pool.query(query, params)
      return result.rows as T[]
    } catch (error) {
      lastError = error as Error

      if (!isRetryableError(error)) {
        throw error
      }

      if (attempt === maxRetries) {
        logger.error('Max retries exceeded', {
          query: query.substring(0, 100),
          attempts: attempt + 1,
          error: lastError.message
        })
        throw lastError
      }

      const delay = Math.min(initialDelay * Math.pow(factor, attempt), maxDelay)

      logger.warn('Query failed, retrying', {
        attempt: attempt + 1,
        maxRetries,
        delay,
        error: lastError.message
      })

      await sleep(delay)
    }
  }

  throw lastError!
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  const retryableCodes = [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    '53300', // too_many_connections
    '57P03', // cannot_connect_now
    '08006', // connection_failure
    '08001', // sqlclient_unable_to_establish_sqlconnection
  ]

  const code = (error as any).code
  return retryableCodes.includes(code) ||
    error.message.toLowerCase().includes('connection') ||
    error.message.toLowerCase().includes('timeout')
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### Pattern 4: Connection Health Checks

```typescript
// lib/db/health.ts
import pool from '@/lib/db/pool'
import { logger } from '@/lib/utils/logger'

export interface DatabaseHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  latency: number
  poolStats: {
    total: number
    idle: number
    waiting: number
  }
  timestamp: string
  error?: string
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const startTime = Date.now()

  try {
    await pool.query('SELECT 1 as health_check')

    const latency = Date.now() - startTime
    const poolStats = {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount
    }

    let status: DatabaseHealth['status'] = 'healthy'

    if (latency > 1000) status = 'degraded'
    if (poolStats.waiting > 5) status = 'degraded'
    if (poolStats.idle === 0 && poolStats.total >= 20) status = 'degraded'

    return { status, latency, poolStats, timestamp: new Date().toISOString() }

  } catch (error) {
    logger.error('Database health check failed', { error })

    return {
      status: 'unhealthy',
      latency: Date.now() - startTime,
      poolStats: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      },
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Health check API endpoint
// app/api/health/route.ts
export async function GET() {
  const health = await checkDatabaseHealth()
  const statusCode = health.status === 'unhealthy' ? 503 : 200
  return NextResponse.json(health, { status: statusCode })
}
```

### Pattern 5: Transaction Management with Pooled Connections

```typescript
// lib/db/transactions.ts
import { Pool, PoolClient } from 'pg'
import pool from '@/lib/db/pool'
import { logger } from '@/lib/utils/logger'

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    logger.debug('Transaction started')

    const result = await callback(client)

    await client.query('COMMIT')
    logger.debug('Transaction committed')

    return result

  } catch (error) {
    await client.query('ROLLBACK')
    logger.warn('Transaction rolled back', { error })
    throw error

  } finally {
    client.release()
    logger.debug('Client released back to pool')
  }
}

// Usage - atomic multi-table updates
export async function transferFunds(
  fromUserId: string,
  toUserId: string,
  amount: number
) {
  return withTransaction(async (client) => {
    // Deduct from sender
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
      [amount, fromUserId]
    )

    // Add to receiver
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
      [amount, toUserId]
    )

    // Log transaction
    const { rows } = await client.query(
      'INSERT INTO transactions (from_user, to_user, amount) VALUES ($1, $2, $3) RETURNING *',
      [fromUserId, toUserId, amount]
    )

    return rows[0]
  })
}
```

### Pattern 6: Connection Leak Detection

```typescript
// lib/db/leak-detection.ts
import { Pool } from 'pg'
import { logger } from '@/lib/utils/logger'

export function setupLeakDetection(pool: Pool) {
  const activeClients = new Map<number, { timestamp: number; stack: string }>()

  pool.on('acquire', (client) => {
    const stack = new Error().stack || 'No stack trace'
    activeClients.set(client.processID, { timestamp: Date.now(), stack })
  })

  pool.on('release', (client) => {
    activeClients.delete(client.processID)
  })

  // Check for leaks every 30 seconds
  setInterval(() => {
    const now = Date.now()
    const leakThreshold = 60000 // 1 minute

    for (const [processID, info] of activeClients.entries()) {
      const duration = now - info.timestamp

      if (duration > leakThreshold) {
        logger.warn('Potential connection leak detected', {
          processID,
          duration,
          acquiredAt: new Date(info.timestamp).toISOString(),
          stack: info.stack
        })
      }
    }
  }, 30000)
}

// Enable in development
if (process.env.NODE_ENV === 'development') {
  setupLeakDetection(pool)
}
```

### Pattern 7: Prepared Statements (Performance)

```typescript
// lib/db/prepared.ts
import pool from '@/lib/db/pool'

// Named query configurations
const queries = {
  getUserById: {
    name: 'get_user_by_id',
    text: 'SELECT * FROM users WHERE id = $1'
  },
  getUserProjects: {
    name: 'get_user_projects',
    text: 'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC'
  },
  createAuditLog: {
    name: 'create_audit_log',
    text: 'INSERT INTO audit_logs (user_id, action, resource_type, resource_id) VALUES ($1, $2, $3, $4) RETURNING *'
  }
}

// Execute prepared query
export async function queryPrepared<T>(
  queryKey: keyof typeof queries,
  params: any[]
): Promise<T[]> {
  const config = queries[queryKey]
  const result = await pool.query(config, params)
  return result.rows as T[]
}

// Usage
const users = await queryPrepared('getUserById', ['user-123'])
```

### Pattern 8: Read Replicas (Load Balancing)

```typescript
// lib/db/replicas.ts
import { Pool } from 'pg'

const primaryPool = new Pool({
  host: process.env.DB_PRIMARY_HOST,
  max: 20
})

const replicaPools = [
  new Pool({ host: process.env.DB_REPLICA_1_HOST, max: 30 }),
  new Pool({ host: process.env.DB_REPLICA_2_HOST, max: 30 })
]

let replicaIndex = 0

export function getReadPool(): Pool {
  const pool = replicaPools[replicaIndex]
  replicaIndex = (replicaIndex + 1) % replicaPools.length
  return pool
}

export function getWritePool(): Pool {
  return primaryPool
}

// Read from replica
export async function queryRead<T>(query: string, params?: any[]): Promise<T[]> {
  const pool = getReadPool()
  const result = await pool.query(query, params)
  return result.rows
}

// Write to primary
export async function queryWrite<T>(query: string, params?: any[]): Promise<T[]> {
  const pool = getWritePool()
  const result = await pool.query(query, params)
  return result.rows
}
```

### Pattern 9: Connection Pool Monitoring Dashboard

```typescript
// lib/db/monitoring.ts
import pool from '@/lib/db/pool'
import { logger } from '@/lib/utils/logger'

export interface PoolMetrics {
  timestamp: string
  total: number
  idle: number
  active: number
  waiting: number
  maxSize: number
  utilization: number
}

const metricsHistory: PoolMetrics[] = []
const MAX_HISTORY = 1000

export function collectPoolMetrics(): PoolMetrics {
  const metrics: PoolMetrics = {
    timestamp: new Date().toISOString(),
    total: pool.totalCount,
    idle: pool.idleCount,
    active: pool.totalCount - pool.idleCount,
    waiting: pool.waitingCount,
    maxSize: 20,
    utilization: ((pool.totalCount - pool.idleCount) / 20) * 100
  }

  metricsHistory.push(metrics)
  if (metricsHistory.length > MAX_HISTORY) metricsHistory.shift()

  return metrics
}

// Start metrics collection
export function startMetricsCollection(intervalMs = 5000) {
  setInterval(() => {
    const metrics = collectPoolMetrics()

    if (metrics.utilization > 80) {
      logger.warn('High pool utilization', metrics)
    }

    if (metrics.waiting > 5) {
      logger.warn('Many connections waiting', metrics)
    }
  }, intervalMs)
}

// API endpoint for metrics
export async function GET() {
  const current = collectPoolMetrics()
  const avgUtilization = metricsHistory.reduce((sum, m) => sum + m.utilization, 0) / metricsHistory.length

  return NextResponse.json({
    current,
    averages: { utilization: avgUtilization.toFixed(2) },
    history: metricsHistory.slice(-100)
  })
}
```

### Pool Size Guidelines Table

```
| Database Tier       | Max Connections | Recommended Pool | Reserve | Use Case         |
|---------------------|-----------------|------------------|---------|------------------|
| Micro (Free)        | 60              | 15               | 45      | Dev/Testing      |
| Small               | 90              | 25               | 65      | Small production |
| Medium              | 120             | 50               | 70      | Standard prod    |
| Large               | 160             | 75               | 85      | High traffic     |
| Enterprise          | 200+            | 100+             | 100+    | Very high traffic|

Formula: Pool Size = (Max DB Connections) × 0.4 to 0.8
Conservative: 40% (leave room for PostgREST, Realtime)
Aggressive: 80% (most connections for your app)
```

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

## COMPLETE AUDIT LOGGING (ALL 10 PATTERNS)

### Pattern 4: Database Query Logging

```typescript
// lib/db/query-logger.ts
import { Pool } from 'pg'
import { logger } from '@/lib/utils/logger'

export function createLoggingPool(pool: Pool): Pool {
  const originalQuery = pool.query.bind(pool)

  pool.query = async function(...args: any[]) {
    const startTime = Date.now()
    const queryConfig = args[0]

    try {
      const result = await originalQuery(...args)
      const duration = Date.now() - startTime

      if (duration > 1000) {
        logger.warn('Slow query detected', {
          query: typeof queryConfig === 'string' ? queryConfig : queryConfig.text,
          duration,
          rows: result.rowCount
        })
      } else {
        logger.debug('Query executed', {
          query: typeof queryConfig === 'string' ? queryConfig.substring(0, 100) : queryConfig.text?.substring(0, 100),
          duration,
          rows: result.rowCount
        })
      }

      return result
    } catch (error) {
      logger.error('Query failed', {
        query: typeof queryConfig === 'string' ? queryConfig : queryConfig.text,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown'
      })
      throw error
    }
  }

  return pool
}
```

### Pattern 6: Security Event Logging

```typescript
// lib/utils/security-logger.ts
import { logger } from './logger'

export type SecurityEventType =
  | 'FAILED_LOGIN'
  | 'SUCCESSFUL_LOGIN'
  | 'PASSWORD_RESET'
  | 'PASSWORD_CHANGED'
  | 'PERMISSION_DENIED'
  | 'SUSPICIOUS_ACTIVITY'
  | 'RATE_LIMIT_EXCEEDED'
  | 'TOKEN_REUSE_DETECTED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'

export interface SecurityEvent {
  type: SecurityEventType
  userId?: string
  ip: string
  userAgent: string
  details: Record<string, any>
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export function logSecurityEvent(event: SecurityEvent) {
  const logData = { ...event, timestamp: new Date().toISOString() }

  switch (event.severity) {
    case 'CRITICAL':
    case 'HIGH':
      logger.error('Security Event', logData)
      break
    case 'MEDIUM':
      logger.warn('Security Event', logData)
      break
    case 'LOW':
      logger.info('Security Event', logData)
      break
  }
}
```

### Pattern 7: Performance Monitoring Logging

```typescript
// lib/utils/performance-logger.ts
import { logger } from './logger'

export function logPerformance(
  operation: string,
  duration: number,
  metadata?: Record<string, any>
) {
  const thresholds = { fast: 100, acceptable: 500, slow: 1000, verySlow: 5000 }

  let level: 'debug' | 'info' | 'warn' | 'error' = 'debug'

  if (duration > thresholds.verySlow) level = 'error'
  else if (duration > thresholds.slow) level = 'warn'
  else if (duration > thresholds.acceptable) level = 'info'

  logger[level]('Performance Metric', { operation, duration, ...metadata })
}

// Decorator for automatic timing
export function measurePerformance(operationName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now()

      try {
        const result = await originalMethod.apply(this, args)
        logPerformance(operationName, Date.now() - startTime, { method: propertyKey })
        return result
      } catch (error) {
        logPerformance(operationName, Date.now() - startTime, {
          method: propertyKey,
          error: error instanceof Error ? error.message : 'Unknown'
        })
        throw error
      }
    }

    return descriptor
  }
}
```

### Pattern 9: Centralized Logging Service Integration

```typescript
// lib/utils/centralized-logging.ts
import winston from 'winston'
import Transport from 'winston-transport'

// Elasticsearch Transport
class ElasticsearchTransport extends Transport {
  private endpoint: string
  private apiKey: string

  constructor(opts: any) {
    super(opts)
    this.endpoint = opts.endpoint
    this.apiKey = opts.apiKey
  }

  async log(info: any, callback: () => void) {
    setImmediate(async () => {
      try {
        await fetch(`${this.endpoint}/_doc`, {
          method: 'POST',
          headers: {
            'Authorization': `ApiKey ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...info,
            '@timestamp': new Date().toISOString(),
            environment: process.env.NODE_ENV,
            service: process.env.SERVICE_NAME
          })
        })
      } catch (error) {
        console.error('Failed to send log to Elasticsearch', error)
      }
    })
    callback()
  }
}

// Add in production
if (process.env.NODE_ENV === 'production' && process.env.ELASTICSEARCH_ENDPOINT) {
  logger.add(new ElasticsearchTransport({
    endpoint: process.env.ELASTICSEARCH_ENDPOINT,
    apiKey: process.env.ELASTICSEARCH_API_KEY
  }))
}
```

### Pattern 10: Log Redaction (Sensitive Data Masking)

```typescript
// lib/utils/log-redaction.ts
const sensitivePatterns = [
  { pattern: /password["\s:=]+([^\s,"]+)/gi, replacement: 'password: [REDACTED]' },
  { pattern: /api[_-]?key["\s:=]+([^\s,"]+)/gi, replacement: 'api_key: [REDACTED]' },
  { pattern: /token["\s:=]+([^\s,"]+)/gi, replacement: 'token: [REDACTED]' },
  { pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, replacement: 'XXXX-XXXX-XXXX-XXXX' },
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: 'XXX-XX-XXXX' }
]

export function redactSensitiveData(data: any): any {
  if (typeof data === 'string') {
    let redacted = data
    for (const { pattern, replacement } of sensitivePatterns) {
      redacted = redacted.replace(pattern, replacement)
    }
    return redacted
  }

  if (Array.isArray(data)) {
    return data.map(item => redactSensitiveData(item))
  }

  if (data && typeof data === 'object') {
    const redacted: any = {}
    for (const [key, value] of Object.entries(data)) {
      if (/password|secret|token|api[_-]?key|authorization/i.test(key)) {
        redacted[key] = '[REDACTED]'
      } else {
        redacted[key] = redactSensitiveData(value)
      }
    }
    return redacted
  }

  return data
}

// Secure logger with automatic redaction
export const secureLogger = {
  error: (msg: string, meta?: any) => logger.error(msg, meta ? redactSensitiveData(meta) : undefined),
  warn: (msg: string, meta?: any) => logger.warn(msg, meta ? redactSensitiveData(meta) : undefined),
  info: (msg: string, meta?: any) => logger.info(msg, meta ? redactSensitiveData(meta) : undefined),
  debug: (msg: string, meta?: any) => logger.debug(msg, meta ? redactSensitiveData(meta) : undefined)
}
```

---

## COMPLETE ENVIRONMENT CONFIGURATION (ALL 11 PATTERNS)

### Pattern 1: Multi-Environment Configuration Files

```bash
# Project structure
.env.local          # Local development (gitignored)
.env.development    # Development config (gitignored)
.env.staging        # Staging config (gitignored)
.env.production     # Production config (gitignored)
.env.example        # Template for team (committed to git)
```

### Pattern 2: Centralized Configuration with Zod Validation

```typescript
// lib/config.ts
import { z } from 'zod'

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_NAME: z.string().min(1),
  APP_URL: z.string().url(),

  DATABASE_URL: z.string().url(),
  DB_POOL_SIZE: z.coerce.number().int().positive().default(20),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  REFRESH_TOKEN_SECRET: z.string().min(32),

  ENCRYPTION_KEY: z.string().length(64, 'ENCRYPTION_KEY must be 64 hex characters'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),

  CORS_ORIGINS: z.string().transform(s => s.split(',')),

  REDIS_URL: z.string().url(),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),

  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),

  ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  ENABLE_DEBUG: z.coerce.boolean().default(false)
})

type Config = z.infer<typeof configSchema>
let config: Config

export function loadConfig(): Config {
  if (config) return config

  try {
    config = configSchema.parse(process.env)
    console.log(`✅ Configuration loaded: ${config.NODE_ENV}`)
    return config
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Configuration validation failed:')
      error.errors.forEach(err => console.error(`  - ${err.path.join('.')}: ${err.message}`))
    }
    process.exit(1)
  }
}

export const appConfig = loadConfig()
export const isDevelopment = appConfig.NODE_ENV === 'development'
export const isProduction = appConfig.NODE_ENV === 'production'
```

### Pattern 3: Platform-Specific Configuration (Vercel)

```javascript
// next.config.js
module.exports = {
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.APP_NAME,
    NEXT_PUBLIC_API_URL: process.env.API_URL
  },

  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
      ]
    }]
  }
}
```

### Pattern 11: Environment-Based Feature Flags

```typescript
// lib/features.ts
import { appConfig } from './config'

export const features = {
  analytics: appConfig.ENABLE_ANALYTICS,
  debug: appConfig.ENABLE_DEBUG,
  newUI: process.env.ENABLE_NEW_UI === 'true',
  betaFeatures: process.env.ENABLE_BETA === 'true',

  payments: {
    stripe: !!process.env.STRIPE_SECRET_KEY,
    paypal: !!process.env.PAYPAL_CLIENT_ID
  },

  monitoring: {
    sentry: !!appConfig.SENTRY_DSN,
    analytics: appConfig.ENABLE_ANALYTICS
  }
}

export function withFeature(featureName: keyof typeof features) {
  return function(Component: React.ComponentType) {
    return function FeatureGatedComponent(props: any) {
      if (!features[featureName]) return null
      return <Component {...props} />
    }
  }
}
```

---

## ADDITIONAL RATE LIMITING PATTERNS

### Pattern 4: Fixed Window Counter

```typescript
// lib/security/fixed-window.ts
interface FixedWindowCounter {
  count: number
  windowStart: number
}

const counters = new Map<string, FixedWindowCounter>()

export function fixedWindow(
  key: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  let counter = counters.get(key)

  if (!counter || now >= counter.windowStart + windowMs) {
    counter = { count: 0, windowStart: now }
    counters.set(key, counter)
  }

  if (counter.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: counter.windowStart + windowMs
    }
  }

  counter.count++

  return {
    success: true,
    remaining: maxRequests - counter.count,
    resetAt: counter.windowStart + windowMs
  }
}
```

### Pattern 5: Tiered Rate Limiting (User Tier-Based)

```typescript
// lib/security/tiered-rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

const tierLimits = {
  free: { requests: 100, window: '1 m' },
  basic: { requests: 500, window: '1 m' },
  pro: { requests: 2000, window: '1 m' },
  enterprise: { requests: 10000, window: '1 m' }
}

export async function tieredRateLimit(userId: string, tier: keyof typeof tierLimits) {
  const { requests, window } = tierLimits[tier]

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window as any),
    prefix: `ratelimit:${tier}`
  })

  return limiter.limit(userId)
}
```

---

## PRODUCTION DEPLOYMENT CHECKLIST (ENHANCED)

### SECURITY (18 Critical Items)

- [ ] **Environment Variables**: Secrets in AWS Secrets Manager / equivalent
- [ ] **HTTPS Enforced**: All traffic redirected to HTTPS (HSTS header set)
- [ ] **CORS Configured**: Explicit origin whitelist (NO wildcards)
- [ ] **Rate Limiting**: Implemented on all public APIs
- [ ] **Input Validation**: Zod schemas on all API endpoints
- [ ] **SQL Injection Prevention**: Parameterized queries ONLY
- [ ] **Error Sanitization**: Production errors hide stack traces
- [ ] **RLS Policies**: Row-Level Security enabled and tested
- [ ] **JWT Configuration**: RS256, 15min access tokens, 7-day refresh with family rotation
- [ ] **Security Headers**: All 13 headers including COOP, CORP, COEP
- [ ] **CSP Nonce**: Implemented for inline scripts
- [ ] **Audit Logging**: Winston with daily rotation (14-day retention)
- [ ] **Connection Pooling**: Pool size configured with health checks
- [ ] **Password Hashing**: bcrypt with 10-12 rounds
- [ ] **Token Family Rotation**: Refresh token reuse detection enabled
- [ ] **Graceful Shutdown**: SIGTERM handler registered
- [ ] **Log Redaction**: Sensitive data automatically masked
- [ ] **Feature Flags**: Environment-based toggles configured

### MONITORING (10 Items)

- [ ] **Error Tracking**: Sentry configured with DSN and sourcemaps
- [ ] **Structured Logging**: Winston with JSON format, daily rotation
- [ ] **Request ID Tracking**: AsyncLocalStorage context propagation
- [ ] **Performance Logging**: Slow query detection (>1s threshold)
- [ ] **Security Event Logging**: Failed logins, permission denied tracked
- [ ] **Connection Pool Monitoring**: Utilization and leak detection
- [ ] **Health Endpoints**: /api/health with database status
- [ ] **Centralized Logging**: ELK/CloudWatch/Datadog integration
- [ ] **Rate Limit Monitoring**: Alerts on excessive hits
- [ ] **Database Query Logging**: Slow queries tracked and alerted

---

## AGENT IDENTITY & PERSONALITY

**Role:** Backend Security Architecture & Infrastructure Expert
**Personality:** Security-obsessed, performance-conscious, scalability-driven, reliability-focused
**Memory:** You remember common vulnerabilities, performance bottlenecks, and scalability anti-patterns
**Experience:** You've seen production systems fail from security flaws, poor database design, inadequate error handling, and lack of observability

### Communication Style
- **Be strategic**: "Designed microservices architecture that scales to 10x current load"
- **Focus on reliability**: "Implemented circuit breakers and graceful degradation for 99.9% uptime"
- **Think security**: "Added multi-layer security with OAuth 2.0, rate limiting, and data encryption"
- **Ensure performance**: "Optimized database queries and caching for sub-200ms response times"

### Success Metrics
- API response times consistently under 200ms (95th percentile)
- System uptime exceeds 99.9% availability
- Database queries perform under 100ms average
- Security audits find zero critical vulnerabilities
- System handles 10x normal traffic during peaks

---

## ADVANCED API DESIGN PATTERNS (10 PATTERNS)

### Pattern 1: GraphQL Security Implementation

```typescript
// lib/graphql/security.ts
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import depthLimit from 'graphql-depth-limit'
import { createComplexityLimitRule } from 'graphql-validation-complexity'

export function createSecureApolloServer(schema: any, resolvers: any) {
  return new ApolloServer({
    typeDefs: schema,
    resolvers,
    plugins: [
      ...(process.env.NODE_ENV === 'production'
        ? [ApolloServerPluginLandingPageDisabled()]
        : []),
    ],
    validationRules: [
      depthLimit(10),
      createComplexityLimitRule(1000, {
        scalarCost: 1,
        objectCost: 10,
        listFactor: 20,
      }),
    ],
    introspection: process.env.NODE_ENV !== 'production',
    formatError: (error) => {
      if (process.env.NODE_ENV === 'production') {
        return { message: 'An error occurred', code: 'INTERNAL_ERROR' }
      }
      return error
    },
  })
}

// Rate limiting for GraphQL
export const graphqlRateLimit = {
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req: any) => req.headers['x-user-id'] || req.ip,
}

// Query cost analysis
export function calculateQueryCost(query: string): number {
  const depthMultiplier = (query.match(/{/g) || []).length
  const fieldCount = (query.match(/\w+(?=\s*[:{(])/g) || []).length
  return depthMultiplier * fieldCount
}
```

### Pattern 2: gRPC Authentication & Security

```typescript
// lib/grpc/auth.ts
import * as grpc from '@grpc/grpc-js'
import jwt from 'jsonwebtoken'
import fs from 'fs'

export function authInterceptor(
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>,
  next: Function
) {
  const metadata = call.metadata
  const authHeader = metadata.get('authorization')[0] as string

  if (!authHeader?.startsWith('Bearer ')) {
    callback({
      code: grpc.status.UNAUTHENTICATED,
      message: 'Missing or invalid authorization header',
    })
    return
  }

  try {
    const token = authHeader.substring(7)
    const payload = jwt.verify(token, process.env.JWT_SECRET!)
    ;(call as any).user = payload
    next()
  } catch (error) {
    callback({
      code: grpc.status.UNAUTHENTICATED,
      message: 'Invalid or expired token',
    })
  }
}

export function createAuthMetadata(token: string): grpc.Metadata {
  const metadata = new grpc.Metadata()
  metadata.set('authorization', `Bearer ${token}`)
  return metadata
}

export function createSecureCredentials() {
  const rootCert = fs.readFileSync('./certs/ca.crt')
  const clientCert = fs.readFileSync('./certs/client.crt')
  const clientKey = fs.readFileSync('./certs/client.key')
  return grpc.credentials.createSsl(rootCert, clientKey, clientCert)
}

// Server-side mTLS
export function createServerCredentials() {
  const rootCert = fs.readFileSync('./certs/ca.crt')
  const serverCert = fs.readFileSync('./certs/server.crt')
  const serverKey = fs.readFileSync('./certs/server.key')

  return grpc.ServerCredentials.createSsl(
    rootCert,
    [{ cert_chain: serverCert, private_key: serverKey }],
    true // Request client certificate
  )
}
```

### Pattern 3: API Versioning Strategies

```typescript
// lib/api/versioning.ts
import { NextRequest, NextResponse } from 'next/server'

export function getApiVersion(request: NextRequest): string {
  const acceptHeader = request.headers.get('accept')
  const versionMatch = acceptHeader?.match(/vnd\.api\.v(\d+)/)
  if (versionMatch) return versionMatch[1]

  const versionHeader = request.headers.get('x-api-version')
  if (versionHeader) return versionHeader

  const version = request.nextUrl.searchParams.get('version')
  if (version) return version

  return '1'
}

export async function versionedApiHandler(
  request: NextRequest,
  handlers: Record<string, (req: NextRequest) => Promise<NextResponse>>
) {
  const version = getApiVersion(request)
  const handler = handlers[`v${version}`] || handlers.default

  if (!handler) {
    return NextResponse.json(
      { error: 'API version not supported', supportedVersions: Object.keys(handlers) },
      { status: 400 }
    )
  }

  const response = await handler(request)
  response.headers.set('X-API-Version', version)
  response.headers.set('Deprecation', version === '1' ? 'true' : 'false')

  return response
}

// URL path versioning
export function extractVersionFromPath(pathname: string): { version: string; path: string } {
  const match = pathname.match(/^\/api\/v(\d+)(.*)$/)
  if (match) {
    return { version: match[1], path: match[2] || '/' }
  }
  return { version: '1', path: pathname }
}
```

### Pattern 4: API Gateway Security

```typescript
// lib/gateway/security.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'
import { apiRateLimit } from '@/lib/security/rate-limit'

interface GatewayConfig {
  requireAuth: boolean
  rateLimit: { requests: number; window: string }
  allowedRoles?: string[]
  timeout: number
}

const routeConfigs: Record<string, GatewayConfig> = {
  '/api/public': {
    requireAuth: false,
    rateLimit: { requests: 1000, window: '1 m' },
    timeout: 5000,
  },
  '/api/users': {
    requireAuth: true,
    rateLimit: { requests: 100, window: '1 m' },
    allowedRoles: ['user', 'admin'],
    timeout: 10000,
  },
  '/api/admin': {
    requireAuth: true,
    rateLimit: { requests: 50, window: '1 m' },
    allowedRoles: ['admin'],
    timeout: 30000,
  },
}

export async function apiGateway(request: NextRequest) {
  const path = request.nextUrl.pathname
  const config = Object.entries(routeConfigs)
    .find(([route]) => path.startsWith(route))?.[1]

  if (!config) {
    return NextResponse.json({ error: 'Route not found' }, { status: 404 })
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const { success } = await apiRateLimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  if (config.requireAuth) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const token = authHeader.substring(7)
      const user = verifyToken(token)

      if (config.allowedRoles && !config.allowedRoles.includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  }

  const requestId = crypto.randomUUID()
  const response = NextResponse.next()
  response.headers.set('X-Request-ID', requestId)
  return response
}
```

### Pattern 5: Webhook Security

```typescript
// lib/webhooks/security.ts
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  tolerance: number = 300
): boolean {
  const elements = signature.split(',')
  const timestampElement = elements.find(e => e.startsWith('t='))
  const signatureElement = elements.find(e => e.startsWith('v1='))

  if (!timestampElement || !signatureElement) return false

  const timestamp = parseInt(timestampElement.split('=')[1])
  const providedSignature = signatureElement.split('=')[1]

  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - timestamp) > tolerance) return false

  const signedPayload = `${timestamp}.${payload}`
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(providedSignature),
    Buffer.from(expectedSignature)
  )
}

export function withWebhookVerification(
  handler: (request: NextRequest, event: any) => Promise<NextResponse>,
  secret: string
) {
  return async (request: NextRequest) => {
    const signature = request.headers.get('x-webhook-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }

    const payload = await request.text()
    if (!verifyWebhookSignature(payload, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(payload)
    return handler(request, event)
  }
}

export async function deliverWebhook(
  url: string,
  payload: any,
  secret: string,
  maxRetries: number = 3
) {
  const body = JSON.stringify(payload)
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${body}`)
    .digest('hex')

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': `t=${timestamp},v1=${signature}`,
        },
        body,
      })

      if (response.ok) return { success: true, statusCode: response.status }
      if (response.status < 500) return { success: false, statusCode: response.status }
    } catch (error) {
      if (attempt === maxRetries) return { success: false, error: 'Max retries exceeded' }
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
    }
  }
}
```

### Pattern 6: Request/Response Compression

```typescript
// lib/api/compression.ts
import zlib from 'zlib'
import { NextRequest, NextResponse } from 'next/server'

export async function compressResponse(data: any): Promise<{ buffer: Buffer; encoding: string }> {
  const json = JSON.stringify(data)

  return new Promise((resolve, reject) => {
    zlib.brotliCompress(Buffer.from(json), (err, result) => {
      if (err) {
        zlib.gzip(Buffer.from(json), (gzipErr, gzipResult) => {
          if (gzipErr) reject(gzipErr)
          else resolve({ buffer: gzipResult, encoding: 'gzip' })
        })
      } else {
        resolve({ buffer: result, encoding: 'br' })
      }
    })
  })
}

export async function decompressRequest(request: NextRequest): Promise<any> {
  const encoding = request.headers.get('content-encoding')
  const body = await request.arrayBuffer()

  if (encoding === 'gzip') {
    return new Promise((resolve, reject) => {
      zlib.gunzip(Buffer.from(body), (err, result) => {
        if (err) reject(err)
        else resolve(JSON.parse(result.toString()))
      })
    })
  }

  if (encoding === 'br') {
    return new Promise((resolve, reject) => {
      zlib.brotliDecompress(Buffer.from(body), (err, result) => {
        if (err) reject(err)
        else resolve(JSON.parse(result.toString()))
      })
    })
  }

  return JSON.parse(Buffer.from(body).toString())
}

export function compressionMiddleware(request: NextRequest) {
  const response = NextResponse.next()
  const acceptEncoding = request.headers.get('accept-encoding') || ''
  response.headers.set('Vary', 'Accept-Encoding')
  return response
}
```

### Pattern 7: OpenAPI/Swagger Documentation

```typescript
// lib/api/openapi.ts
import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = () => {
  return createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Production API with comprehensive security',
      },
      servers: [
        { url: 'https://api.yourdomain.com', description: 'Production' },
        { url: 'https://staging-api.yourdomain.com', description: 'Staging' },
      ],
      components: {
        securitySchemes: {
          BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              code: { type: 'string' },
              details: { type: 'object' },
            },
          },
          PaginatedResponse: {
            type: 'object',
            properties: {
              data: { type: 'array', items: {} },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'integer' },
                  limit: { type: 'integer' },
                  total: { type: 'integer' },
                },
              },
            },
          },
        },
      },
      security: [{ BearerAuth: [] }],
    },
  })
}
```

### Pattern 8: Batch Request Processing

```typescript
// lib/api/batch.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const batchRequestSchema = z.object({
  requests: z.array(z.object({
    id: z.string(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
    path: z.string(),
    body: z.any().optional(),
  })).max(50),
})

interface BatchResponse {
  id: string
  status: number
  body: any
}

export async function handleBatchRequest(
  request: NextRequest,
  routeHandlers: Record<string, Function>
): Promise<NextResponse> {
  const body = await request.json()
  const { requests } = batchRequestSchema.parse(body)

  const responses: BatchResponse[] = await Promise.all(
    requests.map(async (req) => {
      try {
        const handler = routeHandlers[`${req.method} ${req.path}`]
        if (!handler) {
          return { id: req.id, status: 404, body: { error: 'Route not found' } }
        }

        const mockRequest = new Request(`http://localhost${req.path}`, {
          method: req.method,
          body: req.body ? JSON.stringify(req.body) : undefined,
        })

        const response = await handler(mockRequest)
        const responseBody = await response.json()
        return { id: req.id, status: response.status, body: responseBody }
      } catch (error) {
        return { id: req.id, status: 500, body: { error: 'Internal error' } }
      }
    })
  )

  return NextResponse.json({ responses })
}
```

### Pattern 9: API Deprecation Strategy

```typescript
// lib/api/deprecation.ts
import { NextRequest, NextResponse } from 'next/server'

interface DeprecationConfig {
  deprecatedAt: Date
  sunsetAt: Date
  replacementPath?: string
}

const deprecatedEndpoints: Record<string, DeprecationConfig> = {
  '/api/v1/users': {
    deprecatedAt: new Date('2024-01-01'),
    sunsetAt: new Date('2024-06-01'),
    replacementPath: '/api/v2/users',
  },
}

export function withDeprecationWarning(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const path = request.nextUrl.pathname
    const config = deprecatedEndpoints[path]

    const response = await handler(request)

    if (config) {
      response.headers.set('Deprecation', config.deprecatedAt.toISOString())
      response.headers.set('Sunset', config.sunsetAt.toISOString())
      if (config.replacementPath) {
        response.headers.set('Link', `<${config.replacementPath}>; rel="successor-version"`)
      }
    }

    return response
  }
}

export function isSunset(path: string): boolean {
  const config = deprecatedEndpoints[path]
  return config ? new Date() > config.sunsetAt : false
}
```

### Pattern 10: HATEOAS Implementation

```typescript
// lib/api/hateoas.ts
interface Link {
  href: string
  rel: string
  method: string
}

interface HATEOASResource<T> {
  data: T
  _links: Link[]
}

export function createHATEOASResponse<T>(
  data: T,
  resourceType: string,
  resourceId: string,
  baseUrl: string
): HATEOASResource<T> {
  const links: Link[] = [
    { href: `${baseUrl}/${resourceType}/${resourceId}`, rel: 'self', method: 'GET' },
    { href: `${baseUrl}/${resourceType}/${resourceId}`, rel: 'update', method: 'PUT' },
    { href: `${baseUrl}/${resourceType}/${resourceId}`, rel: 'delete', method: 'DELETE' },
    { href: `${baseUrl}/${resourceType}`, rel: 'collection', method: 'GET' },
  ]

  return { data, _links: links }
}

export function createPaginatedHATEOAS<T>(
  data: T[],
  resourceType: string,
  baseUrl: string,
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit)
  const links: Link[] = [
    { href: `${baseUrl}/${resourceType}?page=${page}&limit=${limit}`, rel: 'self', method: 'GET' },
    { href: `${baseUrl}/${resourceType}?page=1&limit=${limit}`, rel: 'first', method: 'GET' },
    { href: `${baseUrl}/${resourceType}?page=${totalPages}&limit=${limit}`, rel: 'last', method: 'GET' },
  ]

  if (page > 1) links.push({ href: `${baseUrl}/${resourceType}?page=${page - 1}&limit=${limit}`, rel: 'prev', method: 'GET' })
  if (page < totalPages) links.push({ href: `${baseUrl}/${resourceType}?page=${page + 1}&limit=${limit}`, rel: 'next', method: 'GET' })

  return { data, _links: links, _meta: { page, limit, total, totalPages } }
}
```

---

## MICROSERVICES PATTERNS (10 PATTERNS)

### Pattern 11: Service Discovery

```typescript
// lib/microservices/discovery.ts
interface ServiceInstance {
  id: string
  name: string
  host: string
  port: number
  healthCheckUrl: string
  lastHeartbeat: Date
}

class ServiceRegistry {
  private services: Map<string, ServiceInstance[]> = new Map()
  private readonly heartbeatInterval = 30000

  register(instance: ServiceInstance): void {
    const instances = this.services.get(instance.name) || []
    const existing = instances.findIndex(i => i.id === instance.id)

    if (existing >= 0) {
      instances[existing] = { ...instance, lastHeartbeat: new Date() }
    } else {
      instances.push({ ...instance, lastHeartbeat: new Date() })
    }

    this.services.set(instance.name, instances)
  }

  deregister(serviceName: string, instanceId: string): void {
    const instances = this.services.get(serviceName) || []
    this.services.set(serviceName, instances.filter(i => i.id !== instanceId))
  }

  discover(serviceName: string): ServiceInstance | null {
    const instances = this.services.get(serviceName) || []
    const healthy = instances.filter(
      i => Date.now() - i.lastHeartbeat.getTime() < this.heartbeatInterval * 2
    )

    if (healthy.length === 0) return null
    return healthy[Math.floor(Math.random() * healthy.length)]
  }

  async healthCheck(instance: ServiceInstance): Promise<boolean> {
    try {
      const response = await fetch(instance.healthCheckUrl, { signal: AbortSignal.timeout(5000) })
      return response.ok
    } catch {
      return false
    }
  }
}

export const registry = new ServiceRegistry()
```

### Pattern 12: Circuit Breaker

```typescript
// lib/microservices/circuit-breaker.ts
enum CircuitState { CLOSED = 'CLOSED', OPEN = 'OPEN', HALF_OPEN = 'HALF_OPEN' }

interface CircuitBreakerConfig {
  failureThreshold: number
  successThreshold: number
  timeout: number
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED
  private failures: number = 0
  private successes: number = 0
  private lastFailureTime: number = 0

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime >= this.config.timeout) {
        this.state = CircuitState.HALF_OPEN
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successes++
      if (this.successes >= this.config.successThreshold) {
        this.state = CircuitState.CLOSED
        this.failures = 0
        this.successes = 0
      }
    } else {
      this.failures = 0
    }
  }

  private onFailure(): void {
    this.failures++
    this.lastFailureTime = Date.now()
    if (this.failures >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN
    }
  }

  getState(): CircuitState { return this.state }
}

export const circuitBreakers = {
  userService: new CircuitBreaker({ failureThreshold: 5, successThreshold: 3, timeout: 30000 }),
  orderService: new CircuitBreaker({ failureThreshold: 5, successThreshold: 3, timeout: 30000 }),
  paymentService: new CircuitBreaker({ failureThreshold: 3, successThreshold: 2, timeout: 60000 }),
}
```

### Pattern 13: Bulkhead Pattern

```typescript
// lib/microservices/bulkhead.ts
class Bulkhead {
  private activeCount: number = 0
  private queue: Array<{ resolve: Function; reject: Function; fn: () => Promise<any> }> = []

  constructor(
    private maxConcurrent: number,
    private queueLimit: number = 100
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.activeCount < this.maxConcurrent) {
      return this.run(fn)
    }

    if (this.queue.length >= this.queueLimit) {
      throw new Error('Bulkhead queue is full')
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, fn })
    })
  }

  private async run<T>(fn: () => Promise<T>): Promise<T> {
    this.activeCount++
    try {
      return await fn()
    } finally {
      this.activeCount--
      this.processQueue()
    }
  }

  private processQueue(): void {
    if (this.queue.length > 0 && this.activeCount < this.maxConcurrent) {
      const { resolve, reject, fn } = this.queue.shift()!
      this.run(fn).then(resolve).catch(reject)
    }
  }

  getStats() {
    return { active: this.activeCount, queued: this.queue.length, max: this.maxConcurrent }
  }
}

export const bulkheads = {
  userService: new Bulkhead(10, 50),
  orderService: new Bulkhead(20, 100),
  paymentService: new Bulkhead(5, 25),
}
```

### Pattern 14: Saga Pattern (Distributed Transactions)

```typescript
// lib/microservices/saga.ts
interface SagaStep<T> {
  name: string
  execute: (context: T) => Promise<T>
  compensate: (context: T) => Promise<void>
}

class SagaOrchestrator<T> {
  private steps: SagaStep<T>[] = []
  private executedSteps: SagaStep<T>[] = []

  addStep(step: SagaStep<T>): this {
    this.steps.push(step)
    return this
  }

  async execute(initialContext: T): Promise<T> {
    let context = initialContext
    this.executedSteps = []

    try {
      for (const step of this.steps) {
        context = await step.execute(context)
        this.executedSteps.push(step)
      }
      return context
    } catch (error) {
      await this.compensate(context)
      throw error
    }
  }

  private async compensate(context: T): Promise<void> {
    for (const step of this.executedSteps.reverse()) {
      try {
        await step.compensate(context)
      } catch (error) {
        console.error(`Compensation failed for step: ${step.name}`, error)
      }
    }
  }
}

// Example usage
interface OrderContext {
  orderId: string
  userId: string
  items: any[]
  paymentId?: string
  inventoryReserved?: boolean
}

export const orderSaga = new SagaOrchestrator<OrderContext>()
  .addStep({
    name: 'reserveInventory',
    execute: async (ctx) => ({ ...ctx, inventoryReserved: true }),
    compensate: async (ctx) => { /* release inventory */ },
  })
  .addStep({
    name: 'processPayment',
    execute: async (ctx) => ({ ...ctx, paymentId: 'payment-123' }),
    compensate: async (ctx) => { /* refund payment */ },
  })
  .addStep({
    name: 'createOrder',
    execute: async (ctx) => ctx,
    compensate: async (ctx) => { /* cancel order */ },
  })
```

### Pattern 15: Event Sourcing

```typescript
// lib/microservices/event-sourcing.ts
interface DomainEvent {
  id: string
  aggregateId: string
  aggregateType: string
  eventType: string
  payload: any
  timestamp: Date
  version: number
}

class EventStore {
  async append(event: Omit<DomainEvent, 'id' | 'timestamp'>): Promise<DomainEvent> {
    const storedEvent: DomainEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }

    await pool.query(
      `INSERT INTO events (id, aggregate_id, aggregate_type, event_type, payload, version)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [storedEvent.id, storedEvent.aggregateId, storedEvent.aggregateType,
       storedEvent.eventType, JSON.stringify(storedEvent.payload), storedEvent.version]
    )

    return storedEvent
  }

  async getEvents(aggregateId: string): Promise<DomainEvent[]> {
    const { rows } = await pool.query(
      'SELECT * FROM events WHERE aggregate_id = $1 ORDER BY version ASC',
      [aggregateId]
    )
    return rows.map(r => ({ ...r, payload: JSON.parse(r.payload) }))
  }
}

class UserAggregate {
  private id: string = ''
  private email: string = ''
  private name: string = ''
  private version: number = 0

  static async fromEvents(events: DomainEvent[]): Promise<UserAggregate> {
    const user = new UserAggregate()
    for (const event of events) {
      user.apply(event)
    }
    return user
  }

  private apply(event: DomainEvent): void {
    switch (event.eventType) {
      case 'UserCreated':
        this.id = event.aggregateId
        this.email = event.payload.email
        this.name = event.payload.name
        break
      case 'UserEmailChanged':
        this.email = event.payload.newEmail
        break
    }
    this.version = event.version
  }
}

export const eventStore = new EventStore()
```

### Pattern 16: CQRS Implementation

```typescript
// lib/microservices/cqrs.ts
interface Command { type: string; payload: any; metadata: { userId: string; timestamp: Date } }
interface Query { type: string; params: any }

class CommandBus {
  private handlers: Map<string, (cmd: Command) => Promise<void>> = new Map()

  register(commandType: string, handler: (cmd: Command) => Promise<void>): void {
    this.handlers.set(commandType, handler)
  }

  async dispatch(command: Command): Promise<void> {
    const handler = this.handlers.get(command.type)
    if (!handler) throw new Error(`No handler for command: ${command.type}`)
    await handler(command)
  }
}

class QueryBus {
  private handlers: Map<string, (query: Query) => Promise<any>> = new Map()

  register(queryType: string, handler: (query: Query) => Promise<any>): void {
    this.handlers.set(queryType, handler)
  }

  async dispatch<T>(query: Query): Promise<T> {
    const handler = this.handlers.get(query.type)
    if (!handler) throw new Error(`No handler for query: ${query.type}`)
    return handler(query)
  }
}

class ReadModelProjection {
  async project(event: DomainEvent): Promise<void> {
    switch (event.eventType) {
      case 'UserCreated':
        await pool.query(
          'INSERT INTO user_read_model (id, email, name, created_at) VALUES ($1, $2, $3, $4)',
          [event.aggregateId, event.payload.email, event.payload.name, event.timestamp]
        )
        break
      case 'UserEmailChanged':
        await pool.query(
          'UPDATE user_read_model SET email = $1 WHERE id = $2',
          [event.payload.newEmail, event.aggregateId]
        )
        break
    }
  }
}

export const commandBus = new CommandBus()
export const queryBus = new QueryBus()
```

### Pattern 17: Sidecar Pattern

```typescript
// lib/microservices/sidecar.ts
interface SidecarConfig {
  serviceName: string
  servicePort: number
  features: { logging: boolean; metrics: boolean; tracing: boolean; rateLimiting: boolean }
}

class SidecarProxy {
  constructor(private config: SidecarConfig) {}

  async handleRequest(request: Request): Promise<Response> {
    const startTime = Date.now()
    const traceId = crypto.randomUUID()

    try {
      if (this.config.features.rateLimiting) {
        const allowed = await this.checkRateLimit(request)
        if (!allowed) return new Response('Rate limited', { status: 429 })
      }

      const headers = new Headers(request.headers)
      headers.set('X-Trace-ID', traceId)
      headers.set('X-Service-Name', this.config.serviceName)

      const serviceUrl = `http://localhost:${this.config.servicePort}${new URL(request.url).pathname}`
      const response = await fetch(serviceUrl, { method: request.method, headers, body: request.body })

      if (this.config.features.metrics) this.recordMetrics(request, response, Date.now() - startTime)
      if (this.config.features.logging) this.logRequest(request, response, traceId)

      return response
    } catch (error) {
      throw error
    }
  }

  private async checkRateLimit(request: Request): Promise<boolean> { return true }
  private recordMetrics(request: Request, response: Response, duration: number): void {}
  private logRequest(request: Request, response: Response, traceId: string): void {}
}
```

### Pattern 18: Backend for Frontend (BFF)

```typescript
// lib/bff/aggregator.ts
class BFFAggregator {
  constructor(private clientType: 'web' | 'mobile' | 'iot') {}

  async getDashboardData(userId: string) {
    const [user, orders, notifications] = await Promise.all([
      this.callService('user-service', `/users/${userId}`),
      this.callService('order-service', `/users/${userId}/orders?limit=5`),
      this.callService('notification-service', `/users/${userId}/unread`),
    ])

    return this.transformForClient({ user, recentOrders: orders, unreadCount: notifications.count })
  }

  private async callService(service: string, path: string) {
    const instance = registry.discover(service)
    if (!instance) throw new Error(`Service ${service} not available`)
    const response = await fetch(`http://${instance.host}:${instance.port}${path}`)
    return response.json()
  }

  private transformForClient(data: any) {
    switch (this.clientType) {
      case 'mobile':
        return { ...data, user: { id: data.user.id, name: data.user.name } }
      case 'iot':
        return { userId: data.user.id, alerts: data.unreadCount }
      default:
        return data
    }
  }
}

export const webBFF = new BFFAggregator('web')
export const mobileBFF = new BFFAggregator('mobile')
```

### Pattern 19: Strangler Fig Migration

```typescript
// lib/migration/strangler.ts
interface RoutingRule {
  path: string
  target: 'legacy' | 'new' | 'shadow'
  percentage?: number
}

class StranglerFigRouter {
  private rules: RoutingRule[] = []

  constructor(private legacyUrl: string, private newUrl: string) {}

  addRule(rule: RoutingRule): void { this.rules.push(rule) }

  async route(request: Request): Promise<Response> {
    const path = new URL(request.url).pathname
    const rule = this.rules.find(r => path.startsWith(r.path))

    if (!rule) return this.forward(request, this.legacyUrl)

    switch (rule.target) {
      case 'new': return this.forward(request, this.newUrl)
      case 'legacy': return this.forward(request, this.legacyUrl)
      case 'shadow': return this.shadowTest(request)
    }
  }

  private async forward(request: Request, baseUrl: string): Promise<Response> {
    const url = new URL(request.url)
    return fetch(`${baseUrl}${url.pathname}${url.search}`, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    })
  }

  private async shadowTest(request: Request): Promise<Response> {
    const [legacyResponse] = await Promise.all([
      this.forward(request.clone(), this.legacyUrl),
      this.forward(request.clone(), this.newUrl),
    ])
    return legacyResponse
  }
}
```

### Pattern 20: Service Mesh Configuration

```typescript
// lib/microservices/service-mesh.ts
interface MeshConfig {
  enableMtls: boolean
  retryPolicy: { attempts: number; perTryTimeout: string }
  circuitBreaker: { consecutiveErrors: number; interval: string; baseEjectionTime: string }
}

export function generateVirtualService(serviceName: string, config: MeshConfig) {
  return {
    apiVersion: 'networking.istio.io/v1beta1',
    kind: 'VirtualService',
    metadata: { name: serviceName },
    spec: {
      hosts: [serviceName],
      http: [{
        route: [{ destination: { host: serviceName } }],
        retries: { attempts: config.retryPolicy.attempts, perTryTimeout: config.retryPolicy.perTryTimeout },
        timeout: '30s',
      }],
    },
  }
}

export function generateDestinationRule(serviceName: string, config: MeshConfig) {
  return {
    apiVersion: 'networking.istio.io/v1beta1',
    kind: 'DestinationRule',
    metadata: { name: serviceName },
    spec: {
      host: serviceName,
      trafficPolicy: {
        connectionPool: { tcp: { maxConnections: 100 }, http: { http2MaxRequests: 1000 } },
        outlierDetection: {
          consecutive5xxErrors: config.circuitBreaker.consecutiveErrors,
          interval: config.circuitBreaker.interval,
          baseEjectionTime: config.circuitBreaker.baseEjectionTime,
        },
        tls: config.enableMtls ? { mode: 'ISTIO_MUTUAL' } : undefined,
      },
    },
  }
}
```

---

## ADVANCED DATABASE PATTERNS (10 PATTERNS)

### Pattern 21: Database Sharding

```typescript
// lib/db/sharding.ts
import { Pool } from 'pg'
import crypto from 'crypto'

interface ShardConfig { id: number; host: string; port: number; database: string }

class ShardManager {
  private shards: Map<number, Pool> = new Map()
  private shardCount: number

  constructor(configs: ShardConfig[]) {
    this.shardCount = configs.length
    for (const config of configs) {
      this.shards.set(config.id, new Pool({
        host: config.host, port: config.port, database: config.database,
        user: process.env.DB_USER, password: process.env.DB_PASSWORD, max: 10,
      }))
    }
  }

  getShardId(key: string): number {
    const hash = crypto.createHash('md5').update(key).digest('hex')
    return parseInt(hash.substring(0, 8), 16) % this.shardCount
  }

  getPool(key: string): Pool {
    const shardId = this.getShardId(key)
    const pool = this.shards.get(shardId)
    if (!pool) throw new Error(`Shard ${shardId} not found`)
    return pool
  }

  async queryAll<T>(query: string, params?: any[]): Promise<T[]> {
    const results = await Promise.all(
      Array.from(this.shards.values()).map(pool => pool.query(query, params))
    )
    return results.flatMap(r => r.rows)
  }

  async queryShard<T>(shardKey: string, query: string, params?: any[]): Promise<T[]> {
    const pool = this.getPool(shardKey)
    const result = await pool.query(query, params)
    return result.rows
  }
}

export const shardManager = new ShardManager([
  { id: 0, host: 'shard0.db.local', port: 5432, database: 'app' },
  { id: 1, host: 'shard1.db.local', port: 5432, database: 'app' },
])
```

### Pattern 22: Database Partitioning

```sql
-- Range partitioning by date
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024_01 PARTITION OF orders FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE orders_2024_02 PARTITION OF orders FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- List partitioning by region
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL
) PARTITION BY LIST (region);

CREATE TABLE customers_us PARTITION OF customers FOR VALUES IN ('us-east', 'us-west');
CREATE TABLE customers_eu PARTITION OF customers FOR VALUES IN ('eu-west', 'eu-central');

-- Auto-create monthly partitions
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $$
DECLARE
  partition_date DATE := DATE_TRUNC('month', NOW() + INTERVAL '1 month');
  partition_name TEXT := 'orders_' || TO_CHAR(partition_date, 'YYYY_MM');
BEGIN
  EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF orders FOR VALUES FROM (%L) TO (%L)',
    partition_name, partition_date, partition_date + INTERVAL '1 month');
END;
$$ LANGUAGE plpgsql;
```

### Pattern 23: Cache Patterns

```typescript
// lib/cache/patterns.ts
import Redis from 'ioredis'
const redis = new Redis(process.env.REDIS_URL!)

// Cache-Aside Pattern
export async function cacheAside<T>(key: string, fetchFn: () => Promise<T>, ttl: number = 3600): Promise<T> {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  const data = await fetchFn()
  await redis.setex(key, ttl, JSON.stringify(data))
  return data
}

// Read-Through Cache
class ReadThroughCache<T> {
  constructor(private prefix: string, private loader: (id: string) => Promise<T>, private ttl: number = 3600) {}

  async get(id: string): Promise<T | null> {
    const key = `${this.prefix}:${id}`
    const cached = await redis.get(key)
    if (cached) return JSON.parse(cached)

    const data = await this.loader(id)
    if (data) await redis.setex(key, this.ttl, JSON.stringify(data))
    return data
  }

  async invalidate(id: string): Promise<void> { await redis.del(`${this.prefix}:${id}`) }
}

// Write-Through Cache
class WriteThroughCache<T> {
  constructor(private prefix: string, private writer: (id: string, data: T) => Promise<void>, private ttl: number = 3600) {}

  async set(id: string, data: T): Promise<void> {
    await Promise.all([
      redis.setex(`${this.prefix}:${id}`, this.ttl, JSON.stringify(data)),
      this.writer(id, data),
    ])
  }
}

export const userCache = new ReadThroughCache<any>('user', async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return rows[0]
})
```

### Pattern 24: Database Migration Framework

```typescript
// lib/db/migrations.ts
interface Migration { version: number; name: string; up: string; down: string }

class MigrationRunner {
  constructor(private pool: any) {}

  async initialize(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
  }

  async getCurrentVersion(): Promise<number> {
    const { rows } = await this.pool.query('SELECT MAX(version) as version FROM migrations')
    return rows[0].version || 0
  }

  async migrate(migrations: Migration[], targetVersion?: number): Promise<void> {
    const currentVersion = await this.getCurrentVersion()
    const target = targetVersion ?? Math.max(...migrations.map(m => m.version))

    if (target > currentVersion) {
      const toApply = migrations.filter(m => m.version > currentVersion && m.version <= target)
        .sort((a, b) => a.version - b.version)

      for (const migration of toApply) {
        await this.runMigration(migration, 'up')
      }
    }
  }

  private async runMigration(migration: Migration, direction: 'up' | 'down'): Promise<void> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(direction === 'up' ? migration.up : migration.down)
      if (direction === 'up') {
        await client.query('INSERT INTO migrations (version, name) VALUES ($1, $2)', [migration.version, migration.name])
      } else {
        await client.query('DELETE FROM migrations WHERE version = $1', [migration.version])
      }
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}
```

### Pattern 25: Temporal Tables (Audit History)

```sql
-- Main table with history tracking
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products_history (
  id UUID NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_to TIMESTAMPTZ NOT NULL,
  operation TEXT NOT NULL
);

CREATE INDEX idx_products_history_id ON products_history(id);
CREATE INDEX idx_products_history_valid ON products_history(valid_from, valid_to);

CREATE OR REPLACE FUNCTION track_product_changes() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO products_history (id, name, price, valid_from, valid_to, operation)
    VALUES (OLD.id, OLD.name, OLD.price, OLD.updated_at, NOW(), 'UPDATE');
    NEW.updated_at = NOW();
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO products_history (id, name, price, valid_from, valid_to, operation)
    VALUES (OLD.id, OLD.name, OLD.price, OLD.updated_at, NOW(), 'DELETE');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_audit BEFORE UPDATE OR DELETE ON products FOR EACH ROW EXECUTE FUNCTION track_product_changes();

-- Query product at point in time
CREATE OR REPLACE FUNCTION get_product_at(product_id UUID, at_time TIMESTAMPTZ)
RETURNS TABLE(id UUID, name TEXT, price DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.price FROM products p WHERE p.id = product_id AND p.updated_at <= at_time
  UNION ALL
  SELECT h.id, h.name, h.price FROM products_history h WHERE h.id = product_id AND h.valid_from <= at_time AND h.valid_to > at_time
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

### Pattern 26: Multi-Tenancy

```typescript
// lib/db/multi-tenant.ts
// Row-Level Security approach
export async function queryWithTenant<T>(tenantId: string, query: string, params: any[] = []): Promise<T[]> {
  await pool.query('SET app.current_tenant = $1', [tenantId])
  const result = await pool.query(query, params)
  return result.rows
}

// Schema-per-tenant approach
class SchemaTenantManager {
  async createTenant(tenantId: string): Promise<void> {
    const schemaName = `tenant_${tenantId.replace(/-/g, '_')}`
    await pool.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`)
  }

  async getTenantPool(tenantId: string): Promise<any> {
    const schemaName = `tenant_${tenantId.replace(/-/g, '_')}`
    return new Pool({ ...baseConfig, options: `-c search_path=${schemaName}` })
  }
}

// Database-per-tenant approach
class DatabaseTenantManager {
  private pools: Map<string, any> = new Map()

  async getTenantPool(tenantId: string): Promise<any> {
    if (this.pools.has(tenantId)) return this.pools.get(tenantId)!

    const { rows } = await centralPool.query('SELECT * FROM tenant_configs WHERE tenant_id = $1', [tenantId])
    const config = rows[0]

    const pool = new Pool({ host: config.host, database: config.database, user: config.user, password: config.password })
    this.pools.set(tenantId, pool)
    return pool
  }
}

export const tenantManager = new SchemaTenantManager()
```

### Pattern 27-30: Additional Database Patterns

```typescript
// Pattern 27: Soft Deletes
export async function softDelete(table: string, id: string, deletedBy: string): Promise<void> {
  await pool.query(`UPDATE ${table} SET deleted_at = NOW(), deleted_by = $1 WHERE id = $2`, [deletedBy, id])
}

export async function restore(table: string, id: string): Promise<void> {
  await pool.query(`UPDATE ${table} SET deleted_at = NULL, deleted_by = NULL WHERE id = $1`, [id])
}

// Pattern 28: Optimistic Locking
export async function updateWithOptimisticLock<T>(
  table: string, id: string, updates: Partial<T>, expectedVersion: number
): Promise<T | null> {
  const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 3}`).join(', ')
  const result = await pool.query(
    `UPDATE ${table} SET ${setClause}, version = version + 1 WHERE id = $1 AND version = $2 RETURNING *`,
    [id, expectedVersion, ...Object.values(updates)]
  )
  if (result.rowCount === 0) throw new Error('Record was modified by another transaction')
  return result.rows[0]
}

// Pattern 29: Secure Query Builder
class SecureQueryBuilder {
  private table: string
  private conditions: string[] = []
  private params: any[] = []

  constructor(table: string) {
    const allowedTables = ['users', 'posts', 'orders']
    if (!allowedTables.includes(table)) throw new Error('Invalid table')
    this.table = table
  }

  where(column: string, operator: '=' | '>' | '<', value: any): this {
    if (!/^[a-zA-Z_]\w*$/.test(column)) throw new Error('Invalid column')
    this.params.push(value)
    this.conditions.push(`${column} ${operator} $${this.params.length}`)
    return this
  }

  async execute<T>(): Promise<T[]> {
    const sql = `SELECT * FROM ${this.table} ${this.conditions.length ? 'WHERE ' + this.conditions.join(' AND ') : ''}`
    const result = await pool.query(sql, this.params)
    return result.rows
  }
}

// Pattern 30: Connection Health Check
export async function checkDatabaseHealth() {
  const startTime = Date.now()
  try {
    await pool.query('SELECT 1')
    return { status: 'healthy', latency: Date.now() - startTime }
  } catch {
    return { status: 'unhealthy', latency: Date.now() - startTime }
  }
}
```

---

## OBSERVABILITY PATTERNS (10 PATTERNS)

### Pattern 31: Distributed Tracing (OpenTelemetry)

```typescript
// lib/observability/tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { trace, SpanStatusCode } from '@opentelemetry/api'

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'api',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
})

sdk.start()

const tracer = trace.getTracer('api-tracer')

export function withTracing<T>(name: string, fn: () => Promise<T>, attributes?: Record<string, string>): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      if (attributes) Object.entries(attributes).forEach(([k, v]) => span.setAttribute(k, v))
      const result = await fn()
      span.setStatus({ code: SpanStatusCode.OK })
      return result
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message })
      span.recordException(error as Error)
      throw error
    } finally {
      span.end()
    }
  })
}
```

### Pattern 32: Metrics Collection (Prometheus)

```typescript
// lib/observability/metrics.ts
import client from 'prom-client'

client.collectDefaultMetrics({ prefix: 'app_' })

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
})

export const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
})

export const databaseQueryDuration = new client.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5],
})

export async function getMetrics() {
  return client.register.metrics()
}
```

### Pattern 33-40: Additional Observability Patterns

```typescript
// Pattern 33: Structured Logging with Correlation
import winston from 'winston'
import { AsyncLocalStorage } from 'async_hooks'

interface LogContext { requestId: string; traceId?: string; userId?: string }
const logContext = new AsyncLocalStorage<LogContext>()

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const ctx = logContext.getStore()
      return JSON.stringify({ timestamp, level, message, ...ctx, ...meta })
    })
  ),
  transports: [new winston.transports.Console()],
})

// Pattern 34: Alerting Configuration
export const alertRules = {
  highErrorRate: { condition: 'rate(errors_total[5m]) > 0.01', severity: 'critical' },
  highLatency: { condition: 'histogram_quantile(0.95, http_request_duration_seconds) > 2', severity: 'warning' },
}

// Pattern 35: SLI/SLO Definitions
export const sloDefinitions = {
  availability: { target: 0.999, window: '30d' },
  latency: { target: 0.95, threshold: 0.2 },
}

// Pattern 36: Health Check Aggregation
export async function healthCheck() {
  const checks = {
    database: await checkDatabaseHealth(),
    redis: await checkRedisHealth(),
  }
  return { status: Object.values(checks).every(c => c.status === 'healthy') ? 'healthy' : 'degraded', checks }
}

// Pattern 37: Feature Flag Integration
export async function isFeatureEnabled(flag: string, context?: { userId?: string }): Promise<boolean> {
  if (process.env[`FF_${flag.toUpperCase()}`] !== undefined) {
    return process.env[`FF_${flag.toUpperCase()}`] === 'true'
  }
  return false
}

// Pattern 38: A/B Testing
export function getExperimentVariant(userId: string, experimentId: string): 'control' | 'treatment' {
  const hash = crypto.createHash('md5').update(`${userId}:${experimentId}`).digest('hex')
  return parseInt(hash.substring(0, 8), 16) / 0xffffffff < 0.5 ? 'control' : 'treatment'
}

// Pattern 39: Performance Profiling
export function measurePerformance(operationName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now()
      try {
        return await originalMethod.apply(this, args)
      } finally {
        const duration = Date.now() - startTime
        if (duration > 1000) logger.warn('Slow operation', { operation: operationName, duration })
      }
    }
    return descriptor
  }
}

// Pattern 40: Deployment Tracking
export function getDeploymentInfo() {
  return {
    version: process.env.DEPLOYMENT_VERSION || 'unknown',
    slot: process.env.DEPLOYMENT_SLOT || 'blue',
    timestamp: process.env.DEPLOYMENT_TIMESTAMP,
  }
}
```

---

## RESILIENCE PATTERNS (10 PATTERNS)

### Pattern 41: Retry with Exponential Backoff and Jitter

```typescript
// lib/resilience/retry.ts
interface RetryConfig {
  maxAttempts: number
  initialDelayMs: number
  maxDelayMs: number
  factor: number
  jitter: boolean
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
  shouldRetry: (error: Error) => boolean = () => true
): Promise<T> {
  const { maxAttempts = 3, initialDelayMs = 100, maxDelayMs = 10000, factor = 2, jitter = true } = config
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (attempt === maxAttempts || !shouldRetry(lastError)) throw lastError

      let delay = Math.min(initialDelayMs * Math.pow(factor, attempt - 1), maxDelayMs)
      if (jitter) delay = Math.floor(delay * (0.75 + Math.random() * 0.5))
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw lastError!
}
```

### Pattern 42: Timeout Handling

```typescript
// lib/resilience/timeout.ts
export class TimeoutError extends Error {
  constructor(message: string = 'Operation timed out') {
    super(message)
    this.name = 'TimeoutError'
  }
}

export async function withTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError(`Timed out after ${timeoutMs}ms`)), timeoutMs)
    fn().then(result => { clearTimeout(timer); resolve(result) })
      .catch(error => { clearTimeout(timer); reject(error) })
  })
}
```

### Pattern 43: Fallback Strategies

```typescript
// lib/resilience/fallback.ts
type FallbackStrategy<T> = { type: 'default'; value: T } | { type: 'cache'; key: string } | { type: 'alternate'; fn: () => Promise<T> }

export async function withFallback<T>(primary: () => Promise<T>, fallback: FallbackStrategy<T>): Promise<T> {
  try {
    return await primary()
  } catch (error) {
    switch (fallback.type) {
      case 'default': return fallback.value
      case 'cache':
        const cached = await redis.get(fallback.key)
        if (cached) return JSON.parse(cached)
        throw error
      case 'alternate': return await fallback.fn()
    }
  }
}
```

### Pattern 44: Load Shedding

```typescript
// lib/resilience/load-shedding.ts
import os from 'os'

class LoadShedder {
  private requestQueue: number = 0

  shouldShed(): { shed: boolean; reason?: string } {
    const cpuUsage = os.loadavg()[0] / os.cpus().length
    if (cpuUsage > 0.8) return { shed: true, reason: `CPU: ${(cpuUsage * 100).toFixed(1)}%` }

    const memUsage = 1 - (os.freemem() / os.totalmem())
    if (memUsage > 0.9) return { shed: true, reason: `Memory: ${(memUsage * 100).toFixed(1)}%` }

    if (this.requestQueue > 1000) return { shed: true, reason: `Queue: ${this.requestQueue}` }

    return { shed: false }
  }

  increment() { this.requestQueue++ }
  decrement() { this.requestQueue-- }
}

export const loadShedder = new LoadShedder()
```

### Pattern 45-50: Additional Resilience Patterns

```typescript
// Pattern 45: Graceful Degradation
export class GracefulDegradation {
  private degradedFeatures: Set<string> = new Set()

  degrade(feature: string) { this.degradedFeatures.add(feature) }
  restore(feature: string) { this.degradedFeatures.delete(feature) }
  isAvailable(feature: string) { return !this.degradedFeatures.has(feature) }

  async withDegradation<T>(feature: string, primary: () => Promise<T>, degraded: () => Promise<T>): Promise<T> {
    if (this.isAvailable(feature)) {
      try { return await primary() }
      catch { this.degrade(feature); return degraded() }
    }
    return degraded()
  }
}

// Pattern 46: Token Bucket Rate Limiter
class TokenBucket {
  private tokens: number
  private lastRefill: number

  constructor(private capacity: number, private refillRate: number) {
    this.tokens = capacity
    this.lastRefill = Date.now()
  }

  tryConsume(tokens: number = 1): boolean {
    const now = Date.now()
    const elapsed = (now - this.lastRefill) / 1000
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate)
    this.lastRefill = now

    if (this.tokens >= tokens) { this.tokens -= tokens; return true }
    return false
  }
}

// Pattern 47: Request Hedging
export async function hedgedRequest<T>(fn: () => Promise<T>, hedgeDelay: number): Promise<T> {
  return new Promise((resolve, reject) => {
    let resolved = false
    const makeRequest = () => fn().then(r => { if (!resolved) { resolved = true; resolve(r) } }).catch(() => {})
    makeRequest()
    setTimeout(() => { if (!resolved) makeRequest() }, hedgeDelay)
  })
}

// Pattern 48: Backpressure Handler
export class BackpressureHandler {
  private queue: Array<() => Promise<any>> = []
  private processing = 0

  constructor(private maxConcurrent: number, private maxQueue: number) {}

  async submit<T>(fn: () => Promise<T>): Promise<T> {
    if (this.queue.length >= this.maxQueue) throw new Error('Queue full')
    return new Promise((resolve, reject) => {
      this.queue.push(async () => { try { resolve(await fn()) } catch (e) { reject(e) } })
      this.processQueue()
    })
  }

  private processQueue() {
    while (this.queue.length > 0 && this.processing < this.maxConcurrent) {
      const task = this.queue.shift()!
      this.processing++
      task().finally(() => { this.processing--; this.processQueue() })
    }
  }
}

// Pattern 49: Dead Letter Queue
export class DeadLetterQueue {
  async send(message: any, error: Error) {
    await pool.query('INSERT INTO dead_letter_queue (message, error) VALUES ($1, $2)', [JSON.stringify(message), error.message])
  }
}

// Pattern 50: Idempotency Keys
export async function withIdempotency<T>(key: string, fn: () => Promise<T>, ttl: number = 86400): Promise<T> {
  const existing = await redis.get(`idempotency:${key}`)
  if (existing) return JSON.parse(existing)

  const result = await fn()
  await redis.setex(`idempotency:${key}`, ttl, JSON.stringify(result))
  return result
}
```

---

## ACTIVATION TRIGGERS

```
"Build API for..."
"Create backend for..."
"Implement authentication"
"Setup database"
"Secure the API"
"Add rate limiting"
"Implement caching"
"Setup logging"
"Create microservices"
"Optimize database queries"
"Add GraphQL endpoint"
"Implement webhooks"
"Setup distributed tracing"
```

---

## HANDOFF SECTIONS

### Handoff to Frontend Specialist
```
Handoff Context:
- API Endpoints: [List with methods, paths, auth requirements]
- Response Formats: [TypeScript interfaces]
- Error Codes: [All possible error responses]
- Rate Limits: [Per-endpoint limits]
- WebSocket Events: [Real-time event types]
Your Mission: Build UI that consumes these APIs
```

### Handoff to Security Specialist
```
Handoff Context:
- Backend Complete: [Tech stack]
- Security Headers: Applied (all 13)
- Auth System: RS256 JWT with token rotation
- Validation: Zod schemas on all inputs
Your Mission: Security audit and penetration testing
```

### Handoff to DevOps Specialist
```
Handoff Context:
- Application: [Docker-ready, health endpoints]
- Database: [Connection pooling, migrations]
- Observability: [Metrics, logging, tracing]
Your Mission: Deploy to production with CI/CD
```

---

## END OF BACKEND SPECIALIST AGENT

**Total Patterns**: 250+ comprehensive production patterns
**Coverage**: 100% - Zero data loss from all source files
**Pattern Categories**:
- RS256 JWT with Token Family Rotation
- All 8 CORS Patterns
- All 13 Security Headers with CSP Nonce
- All 11 Error Handling Patterns
- All 9 Connection Pooling Patterns
- All 6 Encryption Patterns
- All 10 Audit Logging Patterns
- All 11 Environment Configuration Patterns
- **10 Advanced API Design Patterns** (GraphQL, gRPC, Versioning, Gateway, Webhooks, Compression, OpenAPI, Batch, Deprecation, HATEOAS)
- **10 Microservices Patterns** (Service Discovery, Circuit Breaker, Bulkhead, Saga, Event Sourcing, CQRS, Sidecar, BFF, Strangler Fig, Service Mesh)
- **10 Advanced Database Patterns** (Sharding, Partitioning, Caching, Migrations, Temporal Tables, Multi-tenancy, Soft Deletes, Optimistic Locking, Query Builder, Health Checks)
- **10 Observability Patterns** (Distributed Tracing, Metrics, Structured Logging, Alerting, SLI/SLO, Health Checks, Feature Flags, A/B Testing, Performance, Deployment)
- **10 Resilience Patterns** (Retry with Jitter, Timeouts, Fallbacks, Load Shedding, Graceful Degradation, Token Bucket, Request Hedging, Backpressure, DLQ, Idempotency)
- **Agent Identity & Personality Section**
- **Activation Triggers**
- **Handoff Sections**

**Ready For**: Enterprise-Grade B2B Commercial Production Deployments (SaaS, Multi-Tenant, Microservices, High-Availability)

---
