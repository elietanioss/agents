# React/Next.js Performance Rules — Vercel Engineering

Source: claude-code-templates-main & Vercel React Best Practices (extracted 2026-07-02)

## Waterfall Elimination (CRITICAL)

**Goal**: Eliminate sequential request chains. Fetch in parallel and defer awaits to usage point.

- **Defer `await`**: Don't await at the top level of a component. Move `await` into the branch that uses it.
- **Promise.all()**: Fetch independent data in parallel, not sequentially.
- **Strategic Suspense**: Place Suspense boundaries close to data dependencies; show skeletons aligned with final layout.
- **React.cache() per-request dedup**: Cache within a single server render to deduplicate identical queries.
- **Cross-request LRU cache**: For queries that span multiple requests (e.g., user profile), cache with TTL.

## Bundle Size (CRITICAL)

- **Barrel import avoidance**: Never `import { Check } from 'lucide-react'`; use `import Check from 'lucide-react/dist/esm/icons/check'` to tree-shake unused icons.
- **next/dynamic with {ssr:false}**: Defer heavy component hydration; load on client only.
- **Third-party script deferral**: Use `next/script` with `strategy="afterInteractive"` or `lazyOnload`.
- **Code splitting**: Lazy-load heavy features (charts, editors) behind user interaction.

## Render Optimization

- **Defer state reads**: Read state as close as possible to usage; don't lift state higher than necessary.
- **Narrow effect dependencies**: Only depend on values that actually change; avoid over-capturing scope.
- **Lazy state init**: Use initializer function for expensive initial state: `useState(() => computeExpensive())`.
- **useTransition for non-urgent updates**: Mark non-critical state updates as transitions; keep UI responsive.
- **CSS content-visibility**: For long lists/documents, use `content-visibility: auto` to skip rendering off-screen content.
- **DOM recycling**: For large dynamic lists, maintain an element pool and reuse DOM nodes.

## Other Patterns

- **Hoist static JSX**: Move static parts outside event handlers to prevent re-creation.
- **Uncontrolled inputs**: For keystroke-heavy fields, use uncontrolled `<input>` with refs to avoid re-renders on every keystroke.
- **Image optimization**: Use `next/image` with explicit width/height; enable responsive sizing via `sizes`.
- **Font optimization**: Use `next/font` with `display: swap` to prevent layout shift during font load.

## Request Waterfall Anti-Patterns

1. **Sequential fetches in useEffect** → Use `Promise.all()` instead.
2. **Fetching in a parent, passing to child** → Fetch in the child or at the component closest to usage.
3. **Component-level data fetching in parallel** → Use `Promise.all()` at the server level (RSC).
4. **Unnecessary client-side waterfalls** → Keep fetches on server (Route Handlers, Server Components).

## Measurement

- **Core Web Vitals targets**:
  - LCP (Largest Contentful Paint): < 2.5s
  - INP (Interaction to Next Paint): < 200ms
  - CLS (Cumulative Layout Shift): < 0.1

- **Tools**: React DevTools Profiler (identify render bottlenecks), Lighthouse (field-like scoring), Chrome User Experience Report (real-user field data).
