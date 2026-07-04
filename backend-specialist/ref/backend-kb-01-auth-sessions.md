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

