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

