# Testing KB 08 — Performance & Load Testing

## SECTION 9: PERFORMANCE TESTING (Core Web Vitals + Lighthouse CI)

**Pattern 29: Lighthouse CI Integration**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000', 'http://localhost:3000/about', 'http://localhost:3000/pricing'],
      numberOfRuns: 3,
      settings: { preset: 'desktop', throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
}
```

**Pattern 30: Playwright Performance Testing** — use `PerformanceObserver` inside `page.evaluate()` to collect `largest-contentful-paint`, `layout-shift`, and `first-input` entries live in-browser; assert LCP < 2500ms, CLS < 0.1, FID < 100ms. Resolve with a 5s timeout fallback in case not all entry types fire.

**Pattern 31: k6 Load Testing Script**
```javascript
import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const errorRate = new Rate('errors')

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.1'],
  },
}

export default function () {
  const getRes = http.get('http://localhost:3000/api/users')
  check(getRes, { 'GET status is 200': (r) => r.status === 200 }) || errorRate.add(1)
  sleep(1)
}
```

---

## SECTION 20: PERFORMANCE TESTING PATTERNS (advanced)

**Pattern 54: k6 Load Test Suite (multi-stage + spike)**
```javascript
export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 200 },  // spike
    { duration: '2m', target: 200 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    errors: ['rate<0.01'],
    api_duration: ['p(95)<300'],
  },
}
// Simulate a real user journey: login → auth headers → dashboard load; sleep(Math.random()*3+1) for think-time
```

**Pattern 55: Lighthouse CI Integration (extended assertion set)** — adds `interactive` (TTI) < 3800ms, `categories:accessibility` ≥ 0.95, `first-contentful-paint` (warn) < 1800ms, `total-byte-weight` (warn) < 500KB, `uses-text-compression` must score 1 (gzip/brotli mandatory).

**Pattern 56: Core Web Vitals Monitoring (Real User Monitoring)**
```typescript
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals'

const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
}

function reportVital(metric) {
  const body = JSON.stringify({ name: metric.name, value: metric.value, rating: metric.rating, url: location.pathname, timestamp: Date.now() })
  if (navigator.sendBeacon) navigator.sendBeacon('/api/analytics/vitals', body)
  else fetch('/api/analytics/vitals', { method: 'POST', body, keepalive: true })
}

onLCP(reportVital); onINP(reportVital); onCLS(reportVital); onFCP(reportVital); onTTFB(reportVital)
```
Use `sendBeacon` (not a normal `fetch`) for RUM reporting so the beacon survives page unload.

**Pattern 57: Database Query Performance Testing**
```typescript
describe('Database Performance', () => {
  it('dashboard query < 100ms', async () => {
    const start = performance.now()
    await db.query(`SELECT u.id, u.name, COUNT(DISTINCT p.id) AS project_count FROM users u LEFT JOIN projects p ON p.user_id = u.id WHERE u.id = $1 GROUP BY u.id, u.name`, ['test-user-id'])
    expect(performance.now() - start).toBeLessThan(100)
  })

  it('list query uses index (no seq scan)', async () => {
    const explain = await db.query(`EXPLAIN (FORMAT JSON) SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC LIMIT 50`, ['test-project-id'])
    const plan = explain.rows[0]['QUERY PLAN'][0]['Plan']
    expect(plan['Node Type']).not.toBe('Seq Scan') // catches a missing index directly, not just slow wall-clock
  })

  it('handles 10K rows without timeout', async () => {
    const start = performance.now()
    const result = await db.query(`SELECT * FROM audit_log WHERE created_at > NOW() - INTERVAL '30 days' ORDER BY created_at DESC LIMIT 10000`)
    expect(result.rows.length).toBeLessThanOrEqual(10000)
    expect(performance.now() - start).toBeLessThan(2000)
  })
})
```
Assert on `EXPLAIN` plan node type, not just duration — a "fast enough on this dataset" query can still hide a missing index that will regress badly at scale.
