# Frontend KB — Index

Comprehensive frontend reference, chunked by topic from the original ~203KB `core-frontend-specialist.md` monolith (Next.js 15 / React 19 / Tailwind v4 / shadcn/ui / Framer Motion / WCAG 2.2 / Core Web Vitals). Load this index first, then open only the chunk(s) you need — never load all chunks at once.

All chunks live flat in this same `ref/` folder.

| Chunk | Load this when… | Covers |
|---|---|---|
| `frontend-kb-01-data-fetching.md` | Building routes, Server Components, Server Actions, streaming UI | Next.js 15 App Router: Server Components architecture, Server Actions (React 19 + Next.js 15), data fetching & caching strategies, Streaming & Suspense |
| `frontend-kb-02-state.md` | Wiring up client state, the `use` hook, custom hooks, wiring shadcn/ui + Framer Motion into a project | React 19 features (`use` hook, Actions API, React Compiler optimization); shadcn/ui setup & configuration, Framer Motion integration, custom hook patterns |
| `frontend-kb-03-styling-tailwind.md` | Writing Tailwind v4 CSS, building a design system, avoiding generic AI-slop aesthetics | Tailwind v4 modern CSS (`@property`, `color-mix()`), container queries, P3 color, logical properties/RTL; design system (typography, CSS-variable color system, atmospheric backgrounds, entrance animations); anti-generic aesthetic system (anti-AI-slop color/motion/background patterns) |
| `frontend-kb-04-components.md` | Building data tables, writing component handoff docs, virtualizing large lists, scaffolding from v0/Bolt output | Data tables with sorting & selection; developer handoff documentation templates; virtualized data table patterns; AI-generated UI patterns (v0 Code Project, Bolt UI scaffolding) |
| `frontend-kb-05-forms.md` | Building accessible forms, structuring page visual hierarchy | Accessible form components (react-hook-form + Zod + shadcn/ui, WCAG 2.2 AA); information architecture (page hierarchy & visual weight) |
| `frontend-kb-06-animation.md` | Adding motion, scroll effects, gestures, or narrative-driven UI reveals | Framer Motion patterns (GPU-optimized, scroll-triggered, gesture, text animations, accessibility-aware motion); visual storytelling framework (narrative structure for UI) |
| `frontend-kb-07-performance-core.md` | Chasing Core Web Vitals, optimizing images/assets, configuring production builds | Core Web Vitals 2025 targets, image & asset optimization, code splitting & lazy loading, caching strategies; production deployment/env config; UI-only rendering optimization |
| `frontend-kb-08-performance-vercel.md` | Debugging waterfalls, bloated bundles, slow Server Components, excess re-renders | Vercel performance rules: eliminating waterfalls (critical), bundle size optimization (critical), Server Component performance (high), client-side data optimization; re-render prevention, rendering performance, JS micro-optimizations, advanced React patterns |
| `frontend-kb-09-a11y.md` | Meeting WCAG 2.2, testing with axe-core/Playwright | WCAG 2.2 new success criteria, keyboard navigation, screen reader support, color contrast; automated accessibility testing (axe-core, Playwright a11y tests) |
| `frontend-kb-10-responsive.md` | Building mobile-first layouts, handling touch/viewport constraints | Mobile-first patterns, mobile-specific constraints, responsive typography |
| `frontend-kb-11-landing-pages.md` | Building marketing/landing pages, implementing theme (dark/light) toggles | Hero/feature/CTA/testimonial section patterns; complete theme management system |
| `frontend-kb-12-advanced-integration.md` | Building editor-like cross-frame communication, micro-frontends, or WASM integration | Editor integration engineering (cross-application communication); Web Components/micro-frontends, WebAssembly integration |
| `frontend-kb-13-workflow-meta.md` | Structuring the delivery workflow, writing deliverable reports, agent handoffs | Frontend development workflow & deliverable template; success metrics & communication style; learning/memory retention notes; activation triggers; handoffs to backend/security/testing specialists |

## Notes
- Each chunk retains its original section label(s) in an inline `## [SECTION N: ...]` heading so provenance is traceable back to the source monolith.
- Code blocks and tables were preserved intact — no chunk splits inside a fence.
- Two chunks intentionally combine non-adjacent sections that share a topic (e.g. `frontend-kb-09-a11y.md` = WCAG patterns + a11y testing; `frontend-kb-08-performance-vercel.md` = both halves of the original 28KB "Vercel Performance Rules" section, still under 40KB combined but split further here for load efficiency).
