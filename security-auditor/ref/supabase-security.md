---
ref-name: supabase-security
description: Supabase-specific security code review. Service role key exposure, RLS policy audit, storage security, edge function security, and auth patterns.
---

# Supabase Security Reference

## SERVICE ROLE KEY — MOST CRITICAL ISSUE

The service role key bypasses ALL Row Level Security policies.
It grants full read/write access to every table as a superuser.
Exposing it is equivalent to giving root access to your database.

### Detection Patterns

```bash
# NEXT_PUBLIC_ prefixed service role key (exposed to browser bundle)
grep -rn --include=".env*" \
  "NEXT_PUBLIC.*SERVICE_ROLE\|NEXT_PUBLIC.*SUPABASE_ADMIN" . \
  > /tmp/sb-service-role-exposed.txt

# Service role key used in browser client code
grep -rn --include="*.ts" --include="*.js" --include="*.tsx" \
  -E "createBrowserClient\s*\([^)]*SERVICE_ROLE\|createClient\s*\([^)]*NEXT_PUBLIC.*SERVICE_ROLE" \
  src/ >> /tmp/sb-service-role-exposed.txt

# Service role key in SSR client (risk: user sessions override it)
grep -rn --include="*.ts" --include="*.js" \
  -E "createServerClient\s*\([^)]*SERVICE_ROLE\|createServerComponentClient.*SERVICE_ROLE" \
  src/ > /tmp/sb-ssr-service-role.txt
```

### Safe vs Unsafe Patterns

```typescript
// ❌ CRITICAL — service role in .env with NEXT_PUBLIC prefix
// .env.local
// NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  // Bundled into client JS!

// ❌ CRITICAL — createBrowserClient with service role
// src/lib/supabase.ts
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // Bypasses ALL RLS
)

// ❌ VULNERABLE — SSR client with service role shares user sessions
// This is a known Supabase gotcha: SSR clients extract user JWT from cookies
// If initialized with service role, the user JWT overrides it inconsistently
export const supabaseServerClient = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,  // Wrong for SSR
  { cookies }
)

// ✅ SAFE — two separate clients for two purposes
// lib/supabase-browser.ts (for client components — respects RLS)
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // Anon key is safe in browser
)

// lib/supabase-admin.ts (for server-side admin ops — bypasses RLS intentionally)
import 'server-only'
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // No NEXT_PUBLIC_, server-only import
)
```

---

## RLS POLICY AUDIT

### SQL Queries to Run Against Database

```sql
-- 1. Find tables with RLS DISABLED (critical risk)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = false;
-- Any row here = critical security gap

-- 2. Find tables with NO POLICIES at all (RLS enabled but no rules = deny all)
SELECT t.tablename
FROM pg_tables t
WHERE t.schemaname = 'public'
AND t.rowsecurity = true
AND NOT EXISTS (
  SELECT 1 FROM pg_policies p
  WHERE p.tablename = t.tablename AND p.schemaname = 'public'
);

-- 3. Find overly permissive policies (USING (true) = anyone can do anything)
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND (qual = 'true' OR with_check = 'true');

-- 4. Find policies using user_metadata (user-controlled — insecure)
-- user_metadata can be modified by the user themselves via Supabase Auth
-- Use app_metadata instead (only modifiable by service role)
SELECT tablename, policyname, qual
FROM pg_policies
WHERE schemaname = 'public'
AND qual LIKE '%user_metadata%';

-- 5. Find UPDATE/INSERT policies missing WITH CHECK clause
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
AND cmd IN ('INSERT', 'UPDATE', 'ALL')
AND (with_check IS NULL OR with_check = '');
-- Missing with_check on INSERT/UPDATE = bypass via crafted data

-- 6. Find views that bypass RLS (default in PostgreSQL)
-- Views run as their creator (usually postgres = superuser), bypassing RLS
SELECT viewname, definition
FROM pg_views
WHERE schemaname = 'public';
-- These need security_invoker = true (PG15+) or explicit RLS policies

-- 7. Find missing indexes on RLS policy columns (security + performance)
-- If user_id column in policy has no index, table scans reveal data timing
SELECT
  p.tablename,
  p.policyname,
  p.qual
FROM pg_policies p
LEFT JOIN pg_indexes i ON (
  i.tablename = p.tablename
  AND p.qual LIKE '%' || i.indexdef || '%'
)
WHERE p.schemaname = 'public'
AND i.indexname IS NULL
AND p.qual LIKE '%user_id%';
```

### RLS Code Review Patterns

```typescript
// ❌ WRONG — using user_metadata in RLS policy
// Policy: auth.jwt()->'user_metadata'->>'role' = 'admin'
// Problem: users can update their own user_metadata via Supabase Auth API!
// Attacker calls: supabase.auth.updateUser({ data: { role: 'admin' } })

// ✅ CORRECT — use app_metadata (only modifiable via service role)
// Policy: auth.jwt()->'app_metadata'->>'role' = 'admin'
// app_metadata requires service role key to modify = attacker can't self-promote

// ❌ WRONG — SELECT policy only (no INSERT/UPDATE/DELETE protection)
// CREATE POLICY "users_read_own" ON orders
//   FOR SELECT USING (user_id = auth.uid());
// Users can still INSERT orders with any user_id!

// ✅ CORRECT — all operations covered
// CREATE POLICY "users_own_orders" ON orders
//   FOR ALL
//   USING (user_id = auth.uid())           -- For SELECT, UPDATE, DELETE
//   WITH CHECK (user_id = auth.uid());     -- For INSERT, UPDATE (data validation)

// ❌ WRONG — views bypass RLS (PostgreSQL default)
// CREATE VIEW public_products AS
//   SELECT * FROM products WHERE is_published = true;
// This view runs as postgres superuser, bypassing products RLS!

// ✅ CORRECT — security_invoker makes view respect caller's RLS
// CREATE VIEW public_products
//   WITH (security_invoker = true)  -- PostgreSQL 15+
// AS SELECT * FROM products WHERE is_published = true;
```

---

## STORAGE SECURITY

```bash
# Find public buckets in code (may expose private files)
grep -rn --include="*.ts" --include="*.js" --include="*.sql" \
  "public.*:\s*true\|public.*=\s*true\|createBucket.*public" \
  src/ > /tmp/sb-public-buckets.txt

# Find storage uploads without auth check
grep -rn --include="*.ts" --include="*.js" \
  "storage\.from\|supabase\.storage" src/ \
  | grep -v "auth\|session\|user" > /tmp/sb-storage-no-auth.txt
```

```sql
-- Find public storage buckets
SELECT name, public FROM storage.buckets WHERE public = true;
-- Public buckets = anyone can download without auth

-- Check storage.objects RLS
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'storage' AND tablename = 'objects';
```

---

## EDGE FUNCTION SECURITY

```typescript
// ❌ VULNERABLE — edge function with no auth validation
// supabase/functions/process-data/index.ts
Deno.serve(async (req) => {
  const data = await req.json()
  await processData(data)  // Any caller can trigger this
  return new Response('ok')
})

// ✅ SAFE — validate auth token in edge function
Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 })
  }
  const token = authHeader.slice(7)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return new Response('Unauthorized', { status: 401 })

  // Now safe to process with verified user context
  const data = await req.json()
  await processData(data, user.id)
  return new Response('ok')
})
```

---

## SUPABASE AUTH SECURITY

```typescript
// ❌ VULNERABLE — email enumeration via different error messages
const { error } = await supabase.auth.signInWithPassword({ email, password })
if (error?.message === 'Invalid login credentials') {
  // "user not found" vs "wrong password" — reveals if account exists
}

// ✅ SAFE — generic error message regardless of reason
return res.status(401).json({ error: 'Invalid email or password' })

// anon key IS safe in browser (by design)
// It respects RLS and cannot bypass policies
// NEVER try to "hide" the anon key — it's designed to be public
// Only the service_role key must be secret
```

---

## SUPABASE SECURITY CHECKLIST

```
CRITICAL:
[ ] SUPABASE_SERVICE_ROLE_KEY has NO NEXT_PUBLIC_ prefix
[ ] service_role key NOT used in createBrowserClient()
[ ] service_role key imported with 'server-only' protection
[ ] RLS enabled on ALL public schema tables

HIGH:
[ ] No policies using user_metadata (use app_metadata)
[ ] All tables have SELECT + INSERT + UPDATE + DELETE policies
[ ] No USING (true) policies on sensitive tables
[ ] Views use security_invoker=true (PG15+)
[ ] Missing WITH CHECK on INSERT/UPDATE policies fixed
[ ] Indexes on user_id/owner_id columns used in policies

MEDIUM:
[ ] Storage buckets: private unless intentionally public
[ ] storage.objects has RLS policies
[ ] Edge functions validate auth header
[ ] No credentials in edge function code (use Deno.env secrets)
[ ] Email enumeration prevented (generic error messages)
```
