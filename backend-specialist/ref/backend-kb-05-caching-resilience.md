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

