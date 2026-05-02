---
name: nextjs-security
description: Next.js specific security patterns, 2025 CVEs, middleware bypass, React Server Components security, server actions, and code review checklist.
---

# Next.js Security Reference

## CRITICAL 2025 CVEs — CHECK THESE FIRST

### CVE-2025-29927 — Middleware Authorization Bypass (CVSS 9.1)
**Disclosed:** March 2025
**Affected:** Next.js 11.1.4–13.5.6, 14.x < 14.2.25, 15.x < 15.2.3
**Fixed in:** 12.3.5, 13.5.9, 14.2.25, 15.2.3

**Vulnerability:** Sending `x-middleware-subrequest` header skips ALL middleware execution.
Any app relying on middleware for auth is bypassed with a single HTTP header.

**Code audit — detect vulnerable pattern:**
```typescript
// ❌ VULNERABLE ARCHITECTURE — auth only in middleware
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  if (!token) return NextResponse.redirect('/login')
  // This is the ONLY auth check — bypassed by CVE-2025-29927
}

// app/api/admin/route.ts
export async function GET(req: Request) {
  // NO auth check here — relies entirely on middleware
  return Response.json(await getAdminData())
}
```

**Detection grep:**
```bash
# Find route handlers with no auth check (relies on middleware only)
grep -rn --include="*.ts" \
  -E "export async function (GET|POST|PUT|DELETE|PATCH)" \
  app/ | grep -v "auth\|session\|user\|token\|supabase" > /tmp/nextjs-no-auth-routes.txt

# Check if middleware exists and is the only auth layer
ls middleware.ts middleware.js 2>/dev/null
grep -n "auth\|token\|session\|redirect" middleware.ts 2>/dev/null
```

**Fix pattern — auth in BOTH middleware AND route handlers:**
```typescript
// ✅ SAFE — defense in depth
// middleware.ts — first line of defense (UI redirects)
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  if (!token) return NextResponse.redirect('/login')
}

// app/api/admin/route.ts — second line of defense (actual protection)
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)  // ALWAYS verify here too
  if (!session?.user?.role === 'admin') return new Response('Forbidden', {status: 403})
  return Response.json(await getAdminData())
}
```

---

### CVE-2025-55182 / CVE-2025-66478 — React2Shell RCE (CVSS 10.0)
**Disclosed:** December 2025
**Affected:** React 19.0-19.2.0 + Next.js 15.x with App Router
**Fixed in:** React 19.3.0+, Next.js 15.3.0+

**Vulnerability:** Unsafe deserialization in React Flight protocol (RSC).
Any public App Router endpoint can be exploited for unauthenticated RCE.
Affects freshly generated `create-next-app` with no code changes.

**Detection — version check:**
```bash
# Check Next.js version
cat package.json | python3 -c "
import json,sys
d=json.load(sys.stdin)
deps={**d.get('dependencies',{}),**d.get('devDependencies',{})}
nextver=deps.get('next','not found')
reactver=deps.get('react','not found')
print('Next.js:',nextver)
print('React:',reactver)
if 'next' in deps:
    v=nextver.lstrip('^~>=')
    major,minor=v.split('.')[:2]
    if int(major)==15 and int(minor)<3:
        print('CRITICAL: Vulnerable to CVE-2025-66478 React2Shell — upgrade to 15.3.0+')
    if int(major)==16:
        print('CRITICAL: Check React2Shell patch status')
"

# Check for App Router usage (RSC)
ls app/ 2>/dev/null && echo "App Router detected — CVE-2025-66478 applies if version vulnerable"
```

---

### CVE-2025-67779 — Incomplete fix for CVE-2025-55184 (DoS via RSC)
**Disclosed:** December 2025
**Note:** Initial patch was incomplete. If you applied 15.x patch before Dec 11 2025,
you must upgrade again to the latest patched release.

---

## NEXT.JS SECURITY HEADERS

### next.config.js — Required Security Headers
```typescript
// ✅ next.config.ts — add these headers
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'nonce-{nonce}'",  // Use nonce, not unsafe-inline
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.your-domain.com",
            ].join('; ')
          },
        ],
      },
    ]
  },
}
```

**Detection — missing headers:**
```bash
grep -n "headers\|Content-Security-Policy\|X-Frame\|HSTS\|nosniff" \
  next.config.js next.config.ts next.config.mjs 2>/dev/null \
  || echo "WARNING: No security headers found in Next.js config"
```

---

## NEXT.JS SERVER ACTIONS SECURITY

```typescript
// ❌ VULNERABLE — Server Action with no auth check
'use server'
export async function deleteUser(userId: string) {
  await db.users.delete({ where: { id: userId } })
  // Any client can call this — no auth verification!
}

// ❌ VULNERABLE — Server Action trusting client-provided user ID
'use server'
export async function updateProfile(userId: string, data: unknown) {
  await db.profiles.update({ where: { id: userId }, data })
  // userId from client can be any user — IDOR
}

// ✅ SAFE — always verify session in Server Actions
'use server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role === 'admin') throw new Error('Unauthorized')
  await db.users.delete({ where: { id: userId } })
}

export async function updateProfile(data: unknown) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Not authenticated')
  // Use session.user.id — NEVER accept userId from client
  const validData = ProfileSchema.parse(data)
  await db.profiles.update({ where: { id: session.user.id }, data: validData })
}
```

---

## NEXT.JS ROUTE HANDLERS SECURITY

```typescript
// ❌ VULNERABLE — open redirect via returnTo param
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const returnTo = searchParams.get('returnTo') || '/'
  return NextResponse.redirect(returnTo)  // OPEN REDIRECT — attacker sends to evil.com
}

// ✅ SAFE — validate returnTo is relative path
const returnTo = searchParams.get('returnTo') || '/'
if (!returnTo.startsWith('/') || returnTo.startsWith('//')) {
  return NextResponse.redirect('/')  // Default to home if suspicious
}

// ❌ VULNERABLE — CORS wildcard in API route
export async function GET() {
  return new Response(data, {
    headers: { 'Access-Control-Allow-Origin': '*' }  // Any site can read this
  })
}

// ✅ SAFE — explicit origin allowlist
const allowedOrigins = ['https://yourdomain.com', 'https://app.yourdomain.com']
const origin = req.headers.get('origin') || ''
const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
```

---

## ENVIRONMENT VARIABLE LEAKAGE

```bash
# ❌ ANY secret prefixed NEXT_PUBLIC_ is exposed to the browser bundle
NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_...  # CRITICAL: exposed to all users
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=eyJ... # CRITICAL: bypasses all RLS
NEXT_PUBLIC_OPENAI_API_KEY=sk-...  # CRITICAL: users can charge to your account

# ✅ Server-only secrets (no NEXT_PUBLIC_ prefix)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
```

**Detection:**
```bash
grep -rn "NEXT_PUBLIC_" .env* 2>/dev/null \
  | grep -iE "secret|service_role|stripe.*sk_live|openai|anthropic|private" \
  > /tmp/nextjs-exposed-secrets.txt
```

---

## NEXT.JS SECURITY CODE REVIEW CHECKLIST

```
CRITICAL (block deploy if any fail):
[ ] Next.js version: not in CVE-2025-29927 affected range (< 14.2.25 or < 15.2.3)
[ ] Next.js version: not in CVE-2025-66478 affected range (15.x < 15.3.0 with App Router)
[ ] No secrets prefixed NEXT_PUBLIC_ that are actually secrets
[ ] Auth verified in route handlers/server actions (not only in middleware)
[ ] No dangerouslySetInnerHTML with unsanitized user content

HIGH:
[ ] Security headers configured in next.config
[ ] No open redirects in returnTo/redirect params
[ ] CORS configured explicitly (not *)
[ ] Server Actions validate session and use server-side user ID
[ ] server-only imported in files with sensitive operations

MEDIUM:
[ ] CSP configured (not just X-Frame-Options)
[ ] No NEXT_PUBLIC_ variables pointing to internal services
[ ] Error responses don't expose stack traces in production
[ ] next.config.js has output: 'standalone' for Docker (smaller attack surface)
```
