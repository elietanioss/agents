## [SECTION 25.1-25.4: VERCEL PERFORMANCE RULES pt1 (Eliminating Waterfalls, Bundle Size, Server Component Perf, Client-Side Data Optimization)]

===========================================
SECTION 25: VERCEL PERFORMANCE RULES (React/Next.js)
===========================================

Source: Vercel Engineering React Best Practices (57 rules, 8 priority categories)
47 new UI-appropriate rules integrated below. 6 rules already existed in prior sections.
4 backend rules excluded (server-auth-actions, server-cache-lru, async-api-routes, server-after-nonblocking) — those belong to BACKEND_SPECIALIST.

## 25.1 Eliminating Waterfalls (CRITICAL)

**Pattern 131: Async Waterfall Elimination**
```typescript
// Three techniques: defer-await, Promise.all, partial dependencies

// TECHNIQUE 1: Defer await into the branch that actually needs it
// BAD: Unnecessary await on cache hit path
async function getContent(slug: string) {
  const content = await fetchContent(slug) // Always waits for network
  return content
}

// GOOD: Only await in the branch that fetches
async function getContent(slug: string) {
  const cached = cache.get(slug)
  if (cached) return cached // No await needed — instant return
  const content = await fetchContent(slug)
  cache.set(slug, content)
  return content
}

// TECHNIQUE 2: Promise.all for independent operations
// BAD: Sequential waterfall — total time = sum of all requests
async function loadDashboard(userId: string) {
  const user = await fetchUser(userId)            // 200ms
  const posts = await fetchPosts(userId)           // 300ms
  const notifications = await fetchNotifications() // 150ms
  return { user, posts, notifications }            // Total: 650ms
}

// GOOD: Parallel execution — total time = slowest request
async function loadDashboard(userId: string) {
  const [user, posts, notifications] = await Promise.all([
    fetchUser(userId),          // 200ms ─┐
    fetchPosts(userId),         // 300ms ─┤ All start together
    fetchNotifications()        // 150ms ─┘
  ])
  return { user, posts, notifications } // Total: 300ms
}

// TECHNIQUE 3: Partial dependencies — mix sequential + parallel
// When some operations depend on prior results but not on each other
async function loadUserDashboard(userId: string) {
  const user = await fetchUser(userId) // Must resolve first
  const [posts, settings, activity] = await Promise.all([
    fetchPosts(user.id),          // These three depend on user
    fetchSettings(user.preferences), // but NOT on each other
    fetchActivity(user.teamId)
  ])
  return { user, posts, settings, activity }
}
```

## 25.2 Bundle Size Optimization (CRITICAL)

**Pattern 132: Bundle Size Reduction**
```typescript
// RULE: Avoid barrel file imports — tree-shaking fails on re-export barrels
// BAD: Barrel import pulls entire library into bundle
import { Button, Icon } from '@/components'
import { formatDate } from '@/utils'

// GOOD: Import directly from source module
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { formatDate } from '@/utils/date'

// RULE: Defer third-party scripts until after hydration
// BAD: Analytics loaded at startup blocks hydration
import { Analytics } from '@segment/analytics'
const analytics = new Analytics({ writeKey: '...' })

// GOOD: Dynamic import after hydration completes
'use client'
import { useEffect } from 'react'

function AnalyticsProvider() {
  useEffect(() => {
    import('@segment/analytics').then(({ Analytics }) => {
      const analytics = new Analytics({ writeKey: '...' })
      analytics.page()
    })
  }, [])
  return null
}

// RULE: Conditional module loading — only load when feature is activated
// BAD: Admin panel bundled for all users
import { AdminPanel } from '@/components/AdminPanel'

// GOOD: Load only when the feature flag is true
function Dashboard({ user }: { user: User }) {
  const [AdminPanel, setAdminPanel] = useState<ComponentType | null>(null)

  useEffect(() => {
    if (user.isAdmin) {
      import('@/components/AdminPanel').then(mod => {
        setAdminPanel(() => mod.AdminPanel)
      })
    }
  }, [user.isAdmin])

  return (
    <div>
      <MainContent />
      {AdminPanel && <AdminPanel />}
    </div>
  )
}

// RULE: Preload on hover/focus for perceived instant navigation
import Link from 'next/link'

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const preload = () => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }

  return (
    <Link href={href} onMouseEnter={preload} onFocus={preload}>
      {children}
    </Link>
  )
}
```

## 25.3 Server Component Performance (HIGH)

**Pattern 133: React Server Component Optimization**
```typescript
// RULE: React.cache() for per-request deduplication in RSC
import { cache } from 'react'

const getUser = cache(async (userId: string) => {
  const res = await fetch(`/api/users/${userId}`)
  return res.json()
})

// Both Server Components call getUser() — only ONE fetch per request
async function UserHeader({ userId }: { userId: string }) {
  const user = await getUser(userId)
  return <h1>{user.name}</h1>
}
async function UserSidebar({ userId }: { userId: string }) {
  const user = await getUser(userId) // Hits cache, not network
  return <nav>{user.role}</nav>
}

// RULE: Avoid duplicate RSC prop serialization
// BAD: Same data serialized through props to multiple children
async function Page() {
  const user = await getUser()
  return (
    <>
      <Header user={user} />   {/* user serialized to client */}
      <Sidebar user={user} />  {/* user serialized AGAIN */}
    </>
  )
}

// GOOD: Each Server Component fetches internally (deduped by React.cache)
async function Page() {
  return (
    <>
      <Header />   {/* calls getUser() internally — cache hit */}
      <Sidebar />  {/* calls getUser() internally — cache hit */}
    </>
  )
}

// RULE: Minimize data passed to client components
// BAD: Full 50-field object serialized across server/client boundary
async function ProductPage({ id }: { id: string }) {
  const product = await getProduct(id)
  return <ProductCard product={product} /> // Entire object serialized
}

// GOOD: Pick only the fields the client component needs
async function ProductPage({ id }: { id: string }) {
  const product = await getProduct(id)
  return (
    <ProductCard
      name={product.name}
      price={product.price}
      imageUrl={product.images[0]?.url}
    />
  )
}

// RULE: Parallelize fetches via sibling Suspense boundaries
// BAD: Sequential data loading in single component
async function Dashboard() {
  const user = await getUser()           // 200ms
  const posts = await getPosts(user.id)  // 300ms waits for user
  const stats = await getStats(user.id)  // 150ms waits for posts
  return <DashboardView user={user} posts={posts} stats={stats} />
}

// GOOD: Parallel siblings — each streams independently
async function Dashboard() {
  return (
    <div>
      <Suspense fallback={<UserSkeleton />}>
        <UserSection />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <PostsSection />
      </Suspense>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>
    </div>
  )
}
```

## 25.4 Client-Side Data Optimization (MEDIUM-HIGH)

**Pattern 134: Client Data & Event Optimization**
```typescript
// RULE: SWR automatic request deduplication
// BAD: Multiple components make duplicate fetch calls
function Header() {
  const [user, setUser] = useState(null)
  useEffect(() => { fetch('/api/user').then(r => r.json()).then(setUser) }, [])
  return <div>{user?.name}</div>
}
function Sidebar() {
  const [user, setUser] = useState(null)
  useEffect(() => { fetch('/api/user').then(r => r.json()).then(setUser) }, []) // Duplicate!
  return <nav>{user?.role}</nav>
}

// GOOD: SWR deduplicates identical keys automatically
import useSWR from 'swr'
const fetcher = (url: string) => fetch(url).then(r => r.json())

function Header() {
  const { data: user } = useSWR('/api/user', fetcher)
  return <div>{user?.name}</div>
}
function Sidebar() {
  const { data: user } = useSWR('/api/user', fetcher) // Same key = one request
  return <nav>{user?.role}</nav>
}

// RULE: Deduplicate global event listeners via shared hook
// BAD: Each component attaches its own resize listener
function ComponentA() {
  useEffect(() => {
    const h = () => setWidth(window.innerWidth)
    window.addEventListener('resize', h) // N components = N listeners
    return () => window.removeEventListener('resize', h)
  }, [])
}

// GOOD: Single shared hook, one listener
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}

// RULE: Passive event listeners for scroll/touch
// BAD: Blocking listener — browser waits to see if preventDefault() is called
element.addEventListener('scroll', onScroll)

// GOOD: Passive flag — browser can scroll immediately without waiting
element.addEventListener('scroll', onScroll, { passive: true })

useEffect(() => {
  const el = ref.current
  if (!el) return
  el.addEventListener('scroll', handleScroll, { passive: true })
  return () => el.removeEventListener('scroll', handleScroll)
}, [])

// RULE: Version localStorage schema for safe migrations
// BAD: No versioning — stale data after schema change causes crashes
const data = JSON.parse(localStorage.getItem('settings') || '{}')

// GOOD: Schema version check with migration path
const STORAGE_VERSION = 3

interface StorageSchema {
  version: number
  theme: 'light' | 'dark'
  sidebar: boolean
}

function readSettings(): StorageSchema {
  try {
    const raw = localStorage.getItem('settings')
    if (!raw) return getDefaults()
    const data = JSON.parse(raw)
    if (data.version !== STORAGE_VERSION) return migrate(data)
    return data
  } catch {
    return getDefaults()
  }
}
```

---

## [SECTION 25.5-25.8: VERCEL PERFORMANCE RULES pt2 (Re-render Prevention, Rendering Performance, JS Micro-Optimization, Advanced React Patterns)]

## 25.5 Re-render Prevention — State & Derivation (MEDIUM)

**Pattern 135: State Subscription Optimization**
```typescript
// RULE: Don't subscribe to state only used in callbacks
// BAD: Component re-renders on every keystroke just to read query in onClick
function SearchButton({ store }: { store: Store }) {
  const query = store.useQuery() // Re-renders every keystroke
  return <button onClick={() => search(query)}>Search</button>
}

// GOOD: Read state inside the callback, not during render
function SearchButton({ store }: { store: Store }) {
  return <button onClick={() => search(store.getQuery())}>Search</button>
}

// RULE: Subscribe to derived booleans, not raw collections
// BAD: Re-renders when ANY item changes
function CartIcon({ store }: { store: Store }) {
  const items = store.useItems() // New array ref on every item mutation
  return <Badge show={items.length > 0} />
}

// GOOD: Derived boolean only changes when threshold crosses
function CartIcon({ store }: { store: Store }) {
  const hasItems = store.useSelector(state => state.items.length > 0)
  return <Badge show={hasItems} />
}

// RULE: Derive state during render, not in effects
// BAD: Effect-driven derivation causes extra render cycle
function FilteredList({ items, query }: Props) {
  const [filtered, setFiltered] = useState(items)
  useEffect(() => {
    setFiltered(items.filter(i => i.name.includes(query)))
  }, [items, query]) // render → effect → setState → render again
  return <List items={filtered} />
}

// GOOD: Compute during render — one pass, no extra cycle
function FilteredList({ items, query }: Props) {
  const filtered = items.filter(i => i.name.includes(query))
  return <List items={filtered} />
}

// RULE: Functional setState for stable callbacks
// BAD: Closure over state forces new callback identity each render
function Counter() {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => {
    setCount(count + 1) // count in dependency = new callback each render
  }, [count])
  return <ExpensiveChild onIncrement={increment} />
}

// GOOD: Functional updater — no external dependency, permanently stable
function Counter() {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => {
    setCount(prev => prev + 1)
  }, []) // Empty deps = stable identity forever
  return <ExpensiveChild onIncrement={increment} />
}

// RULE: Lazy state initialization for expensive defaults
// BAD: parseMarkdown runs on EVERY render, result discarded after first
function Editor() {
  const [state, setState] = useState(parseMarkdown(initialContent))
  return <EditorView state={state} />
}

// GOOD: Function form — runs only once on mount
function Editor() {
  const [state, setState] = useState(() => parseMarkdown(initialContent))
  return <EditorView state={state} />
}
```

**Pattern 136: Effect & Dependency Optimization**
```typescript
// RULE: Hoist default non-primitive props to module scope
// BAD: Default object is new reference every render → child always re-renders
function List({ items, style = { gap: 8 } }: Props) {
  return <StyledList style={style}>{items.map(renderItem)}</StyledList>
}

// GOOD: Module-level constant — stable identity across renders
const DEFAULT_STYLE = { gap: 8 }
function List({ items, style = DEFAULT_STYLE }: Props) {
  return <StyledList style={style}>{items.map(renderItem)}</StyledList>
}

// RULE: Use primitive dependencies in effects
// BAD: Object reference changes every render → effect re-runs constantly
function UserProfile({ user }: { user: User }) {
  useEffect(() => {
    trackPageView(user)
  }, [user]) // Object — new reference each render
}

// GOOD: Primitive value — stable equality check
function UserProfile({ user }: { user: User }) {
  useEffect(() => {
    trackPageView(user.id)
  }, [user.id]) // String — only re-runs when ID actually changes
}

// RULE: Move interaction logic to event handlers, not effects
// BAD: Effect fires analytics on mount — fragile, re-fires on deps change
function ProductPage({ productId }: Props) {
  useEffect(() => {
    analytics.track('product_viewed', { productId })
  }, [productId])
}

// GOOD: Explicit in event handler — clear trigger, no re-fire issues
function ProductLink({ productId, children }: Props) {
  const handleClick = () => {
    analytics.track('product_clicked', { productId })
    router.push(`/product/${productId}`)
  }
  return <button onClick={handleClick}>{children}</button>
}

// RULE: startTransition for non-urgent state updates
// BAD: Expensive filter blocks the input
function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Item[]>([])
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setResults(computeExpensiveResults(e.target.value)) // Blocks typing
  }
}

// GOOD: Transition keeps input responsive
import { useState, useTransition } from 'react'

function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Item[]>([])
  const [isPending, startTransition] = useTransition()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value) // Urgent — updates immediately
    startTransition(() => {
      setResults(computeExpensiveResults(e.target.value)) // Deferred
    })
  }
  return (
    <>
      <input value={query} onChange={onChange} />
      <div style={{ opacity: isPending ? 0.7 : 1 }}>
        <ResultsList items={results} />
      </div>
    </>
  )
}

// RULE: Use refs for transient frequently-updating values
// BAD: useState for mouse position = 60+ re-renders per second
function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [])
  return <div style={{ left: pos.x, top: pos.y }} className="cursor" />
}

// GOOD: Ref + direct DOM mutation — zero re-renders
function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`
        ref.current.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener('mousemove', h, { passive: true })
    return () => window.removeEventListener('mousemove', h)
  }, [])
  return <div ref={ref} className="cursor" />
}
```

## 25.6 Rendering Performance (MEDIUM)

**Pattern 137: DOM & SVG Rendering Optimization**
```typescript
// RULE: Animate wrapper div, not SVG element directly
// BAD: Animating SVG forces full SVG subtree re-render
<motion.svg animate={{ scale: 1.2 }}>
  <ComplexPath />
</motion.svg>

// GOOD: Animate a wrapping div — SVG content stays static
<motion.div animate={{ scale: 1.2 }}>
  <svg><ComplexPath /></svg>
</motion.div>

// RULE: Hoist static JSX outside component to prevent recreation
// BAD: Footer JSX recreated as new object every render
function Layout({ children }: { children: React.ReactNode }) {
  const footer = (
    <footer>
      <p>&copy; 2025 Company</p>
      <nav><a href="/privacy">Privacy</a></nav>
    </footer>
  )
  return <div>{children}{footer}</div>
}

// GOOD: Module-level constant — same reference across renders
const Footer = (
  <footer>
    <p>&copy; 2025 Company</p>
    <nav><a href="/privacy">Privacy</a></nav>
  </footer>
)
function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}{Footer}</div>
}

// RULE: Reduce SVG coordinate precision to minimize DOM size
// BAD: 12 decimal places of precision — visually imperceptible
<path d="M 12.345678901234 67.890123456789 L 98.765432109876 43.210987654321" />

// GOOD: 1-2 decimal places — identical visual result, smaller payload
<path d="M 12.35 67.89 L 98.77 43.21" />

// RULE: Inline script to prevent hydration theme flicker
// BAD: Client-only theme causes flash of wrong theme
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'light') // FLASH!
  }, [])
}

// GOOD: Inline script runs before React hydrates — no mismatch
// In layout.tsx <head>:
<script dangerouslySetInnerHTML={{ __html: `
  document.documentElement.dataset.theme =
    localStorage.getItem('theme') || 'light'
`}} />

// Component reads attribute set before hydration — zero flicker
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.dataset.theme || 'light'
      : 'light'
  )
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
```

**Pattern 138: React Rendering Patterns**
```tsx
// RULE: Activity component (React 19+) preserves state when hiding
// BAD: Conditional render destroys component state
function Tabs({ activeTab }: { activeTab: string }) {
  return (
    <div>
      {activeTab === 'posts' && <PostsTab />}   {/* State lost on switch */}
      {activeTab === 'photos' && <PhotosTab />}
    </div>
  )
}

// GOOD: Activity hides without unmounting — scroll position, form state preserved
import { unstable_Activity as Activity } from 'react'

function Tabs({ activeTab }: { activeTab: string }) {
  return (
    <div>
      <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
        <PostsTab />
      </Activity>
      <Activity mode={activeTab === 'photos' ? 'visible' : 'hidden'}>
        <PhotosTab />
      </Activity>
    </div>
  )
}

// RULE: Use ternary, not && for conditional rendering
// BAD: && renders falsy values like 0 or NaN to the DOM
function Notifications({ count }: { count: number }) {
  return <div>{count && <Badge count={count} />}</div>
  // When count === 0, renders "0" as text!
}

// GOOD: Explicit ternary — full control over both branches
function Notifications({ count }: { count: number }) {
  return <div>{count > 0 ? <Badge count={count} /> : null}</div>
}

// RULE: useTransition for loading states — preserve current content
// BAD: useState loading — immediately replaces content with spinner
function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const handleNav = async (url: string) => {
    setIsLoading(true) // Current content vanishes immediately
    const data = await fetchPage(url)
    setData(data)
    setIsLoading(false)
  }
}

// GOOD: useTransition — current content stays visible during load
function Page() {
  const [isPending, startTransition] = useTransition()
  const handleNav = (url: string) => {
    startTransition(async () => {
      const data = await fetchPage(url)
      setData(data)
    })
  }
  // Current content visible but dimmed while loading
  return <div style={{ opacity: isPending ? 0.7 : 1 }}>{content}</div>
}
```

## 25.7 JavaScript Micro-Optimization Quick Reference (LOW-MEDIUM)

**Pattern 139: JavaScript Performance Patterns**

| Rule | Pattern | Instead Of |
|------|---------|------------|
| `js-batch-dom-css` | Toggle class or use `cssText` | Multiple `el.style.x =` calls |
| `js-index-maps` | `new Map(items.map(i => [i.id, i]))` | Repeated `.find()` on arrays |
| `js-cache-property-access` | `const len = arr.length` in loops | `arr.length` on every iteration |
| `js-cache-function-results` | Module-level `Map` cache | Recomputing pure functions |
| `js-cache-storage` | Read localStorage once at init | Reading localStorage in render |
| `js-combine-iterations` | Single `for..of` loop | Chained `.filter().map().reduce()` |
| `js-length-check-first` | `if (arr.length === 0) return` | Running expensive ops on empty arrays |
| `js-early-exit` | Guard clauses at function top | Deeply nested if/else blocks |
| `js-hoist-regexp` | `const RE = /pattern/` at module scope | `new RegExp()` inside loops |
| `js-min-max-loop` | `Math.min(...arr)` or manual loop | `.sort()[0]` for min value |
| `js-set-map-lookups` | `new Set(ids).has(id)` | `ids.includes(id)` in loops |
| `js-tosorted-immutable` | `arr.toSorted()` | `[...arr].sort()` |

```typescript
// High-impact examples:

// js-index-maps — O(1) lookup instead of O(n) find
// BAD
const getUser = (id: string) => users.find(u => u.id === id)

// GOOD
const userMap = new Map(users.map(u => [u.id, u]))
const getUser = (id: string) => userMap.get(id)

// js-combine-iterations — single pass
// BAD: Three array traversals
const result = items
  .filter(item => item.active)
  .map(item => item.value)
  .reduce((sum, val) => sum + val, 0)

// GOOD: One pass
let result = 0
for (const item of items) {
  if (item.active) result += item.value
}

// js-set-map-lookups — O(1) membership test
// BAD: O(n) per check in render loop
const isSelected = (id: string) => selectedIds.includes(id)

// GOOD: O(1) per check
const selectedSet = new Set(selectedIds)
const isSelected = (id: string) => selectedSet.has(id)
```

## 25.8 Advanced React Patterns (LOW)

**Pattern 140: Advanced Hook Patterns**
```typescript
// RULE: Store event handlers in refs to avoid effect re-subscription
// BAD: Effect re-subscribes when onChange identity changes (every parent render)
function Input({ onChange }: { onChange: (v: string) => void }) {
  useEffect(() => {
    const handler = (e: Event) => onChange((e.target as HTMLInputElement).value)
    element.addEventListener('input', handler)
    return () => element.removeEventListener('input', handler)
  }, [onChange]) // Runs on every parent render
}

// GOOD: Ref always points to latest handler — effect runs once
function Input({ onChange }: { onChange: (v: string) => void }) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const handler = (e: Event) =>
      onChangeRef.current((e.target as HTMLInputElement).value)
    element.addEventListener('input', handler)
    return () => element.removeEventListener('input', handler)
  }, []) // Stable — never re-runs
}

// RULE: Initialize expensive singletons lazily, not at import time
// BAD: Top-level side effect breaks SSR and test isolation
const analytics = new Analytics({ key: process.env.NEXT_PUBLIC_KEY })

// GOOD: Lazy singleton — initialized on first call
let analytics: Analytics | null = null
function getAnalytics() {
  if (!analytics) {
    analytics = new Analytics({ key: process.env.NEXT_PUBLIC_KEY! })
  }
  return analytics
}

// RULE: useLatest — stable ref always pointing to latest value
function useLatest<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}

// Stable callback that always invokes the latest function version
function useStableCallback<T extends (...args: any[]) => any>(fn: T): T {
  const fnRef = useLatest(fn)
  return useCallback(
    ((...args) => fnRef.current(...args)) as T,
    []
  )
}
```

