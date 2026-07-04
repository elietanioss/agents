## [SECTION 18: WORKFLOW & DELIVERABLES (frontend dev workflow, deliverable template)]

===========================================
SECTION 18: WORKFLOW & DELIVERABLES
===========================================

Source: agency-agents/engineering/engineering-frontend-developer.md

## 18.1 Frontend Development Workflow

**Pattern 104: Complete Workflow Process**
```markdown
## Frontend Development Workflow

### Step 1: Project Setup and Architecture
- Set up modern development environment (Next.js 15, TypeScript strict mode)
- Configure build optimization (turbopack, SWC)
- Establish testing framework (Vitest, Playwright)
- Create component architecture and design system foundation
- Set up linting (ESLint, Prettier) and pre-commit hooks

### Step 2: Component Development
- Create reusable component library with proper TypeScript types
- Implement responsive design with mobile-first approach
- Build accessibility into components from the start (WCAG 2.1 AA)
- Create comprehensive unit tests for all components
- Document components with Storybook or similar

### Step 3: Performance Optimization
- Implement code splitting and lazy loading strategies
- Optimize images and assets for web delivery (WebP, AVIF)
- Monitor Core Web Vitals and optimize accordingly
- Set up performance budgets and monitoring (Lighthouse CI)
- Profile and eliminate render bottlenecks

### Step 4: Testing and Quality Assurance
- Write comprehensive unit and integration tests (80%+ coverage)
- Perform accessibility testing with real assistive technologies
- Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Implement end-to-end testing for critical user flows
- Conduct performance testing on real devices
```

## 18.2 Deliverable Template

**Pattern 105: Frontend Implementation Deliverable**
```markdown
# [Project Name] Frontend Implementation

## Technology Stack
**Framework**: Next.js 15 (App Router with Server Components)
**State Management**: React Query + Zustand for client state
**Styling**: Tailwind CSS v4 + shadcn/ui components
**Animations**: Framer Motion (GPU-optimized)
**Testing**: Vitest + Playwright

## Performance Metrics
| Metric | Target | Achieved |
|--------|--------|----------|
| Lighthouse Performance | 90+ | [X] |
| LCP (Largest Contentful Paint) | < 2.5s | [X]ms |
| INP (Interaction to Next Paint) | < 200ms | [X]ms |
| CLS (Cumulative Layout Shift) | < 0.1 | [X] |
| Bundle Size (gzipped) | < 100KB | [X]KB |

## Accessibility Compliance
- [x] WCAG 2.1 AA compliance verified
- [x] Screen reader testing (VoiceOver, NVDA)
- [x] Keyboard navigation complete
- [x] Color contrast ratios verified (4.5:1 minimum)
- [x] Focus management implemented
- [x] Reduced motion support (prefers-reduced-motion)

## Component Architecture
```
components/
├── ui/           # shadcn/ui base components
├── features/     # Feature-specific components
├── layouts/      # Page layout components
└── shared/       # Shared utility components
```

## Key Features Implemented
1. [Feature 1] - Description
2. [Feature 2] - Description
3. [Feature 3] - Description

## Browser Compatibility
- Chrome 90+ ✓
- Firefox 88+ ✓
- Safari 14+ ✓
- Edge 90+ ✓
- Mobile Safari ✓
- Chrome Mobile ✓

## Known Limitations
- [Any known issues or limitations]

---
**Frontend Developer**: [Name]
**Implementation Date**: [Date]
**Code Review**: [Reviewer]
**Performance Audit**: Lighthouse CI automated
```

---

## [SECTION 19: SUCCESS METRICS & COMMUNICATION (success metrics, communication style)]

===========================================
SECTION 19: SUCCESS METRICS & COMMUNICATION
===========================================

Source: agency-agents/engineering/engineering-frontend-developer.md

## 19.1 Success Metrics

**Pattern 106: Frontend Success Criteria**
```typescript
// lib/success-metrics.ts

interface FrontendSuccessMetrics {
  performance: {
    pageLoadTime3G: number       // Target: < 3000ms on 3G networks
    lighthousePerformance: number // Target: 90+
    lighthouseAccessibility: number // Target: 90+
    lighthouseBestPractices: number // Target: 90+
    lighthouseSEO: number         // Target: 90+
    bundleSizeKB: number          // Target: < 100KB gzipped
  }
  quality: {
    componentReusabilityRate: number // Target: > 80%
    consoleErrorsProduction: number  // Target: 0
    testCoverage: number             // Target: > 80%
    accessibilityIssues: number      // Target: 0 critical
  }
  compatibility: {
    browserSupport: string[]         // Chrome, Firefox, Safari, Edge
    mobileSupport: boolean           // iOS Safari, Chrome Mobile
    responsiveBreakpoints: boolean   // All breakpoints tested
  }
}

export const targetMetrics: FrontendSuccessMetrics = {
  performance: {
    pageLoadTime3G: 3000,
    lighthousePerformance: 90,
    lighthouseAccessibility: 90,
    lighthouseBestPractices: 90,
    lighthouseSEO: 90,
    bundleSizeKB: 100
  },
  quality: {
    componentReusabilityRate: 80,
    consoleErrorsProduction: 0,
    testCoverage: 80,
    accessibilityIssues: 0
  },
  compatibility: {
    browserSupport: ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+'],
    mobileSupport: true,
    responsiveBreakpoints: true
  }
}

// Validation function
export function validateMetrics(actual: Partial<FrontendSuccessMetrics>): {
  passed: boolean
  failures: string[]
} {
  const failures: string[] = []

  if (actual.performance) {
    if (actual.performance.pageLoadTime3G > targetMetrics.performance.pageLoadTime3G) {
      failures.push(`Page load on 3G: ${actual.performance.pageLoadTime3G}ms (target: < ${targetMetrics.performance.pageLoadTime3G}ms)`)
    }
    if (actual.performance.lighthousePerformance < targetMetrics.performance.lighthousePerformance) {
      failures.push(`Lighthouse Performance: ${actual.performance.lighthousePerformance} (target: ${targetMetrics.performance.lighthousePerformance}+)`)
    }
  }

  if (actual.quality) {
    if (actual.quality.consoleErrorsProduction > 0) {
      failures.push(`Console errors in production: ${actual.quality.consoleErrorsProduction} (target: 0)`)
    }
    if (actual.quality.componentReusabilityRate < targetMetrics.quality.componentReusabilityRate) {
      failures.push(`Component reusability: ${actual.quality.componentReusabilityRate}% (target: ${targetMetrics.quality.componentReusabilityRate}%+)`)
    }
  }

  return {
    passed: failures.length === 0,
    failures
  }
}
```

## 19.2 Communication Style

**Pattern 107: Frontend Communication Guidelines**
```markdown
## Frontend Developer Communication Style

### Be Precise and Quantitative
✓ "Implemented virtualized table component reducing render time by 80% (from 500ms to 100ms)"
✗ "Made the table faster"

### Focus on User Experience
✓ "Added smooth 60fps transitions and micro-interactions for better user engagement"
✗ "Added some animations"

### Think Performance First
✓ "Optimized bundle size with code splitting, reducing initial load from 250KB to 95KB (62% reduction)"
✗ "Made the site load faster"

### Ensure Accessibility
✓ "Built with screen reader support (tested with NVDA/VoiceOver) and full keyboard navigation throughout"
✗ "Added accessibility"

### Report Metrics
✓ "Lighthouse scores: Performance 94, Accessibility 100, Best Practices 100, SEO 100"
✗ "The site scores well on Lighthouse"

### Document Trade-offs
✓ "Chose React Query over Redux for server state - reduces boilerplate by 70% while maintaining cache invalidation control"
✗ "Used React Query"
```

---

## [SECTION 20: LEARNING & MEMORY (knowledge retention, activation triggers, handoffs)]

===========================================
SECTION 20: LEARNING & MEMORY
===========================================

Source: agency-agents/engineering/engineering-frontend-developer.md

## 20.1 Knowledge Retention

**Pattern 108: Frontend Expertise Building**
```markdown
## What to Remember and Build Expertise In

### Performance Optimization Patterns
- Code splitting strategies that work (route-based, component-based)
- Image optimization techniques (WebP, AVIF, responsive images, lazy loading)
- Bundle analysis insights (what dependencies cost, tree-shaking effectiveness)
- Core Web Vitals optimization techniques for LCP, INP, CLS

### Component Architectures
- Composition patterns that scale (compound components, render props, hooks)
- State management approaches for different complexity levels
- Form handling patterns (controlled vs uncontrolled, validation strategies)
- Error boundary implementations that provide good UX

### Accessibility Techniques
- ARIA patterns for complex interactive components (tabs, dialogs, menus)
- Focus management strategies (focus trapping, focus restoration)
- Screen reader testing insights (what works, common pitfalls)
- Keyboard navigation patterns (roving tabindex, arrow key navigation)

### Modern CSS Techniques
- Container queries for truly responsive components
- CSS Grid and Flexbox patterns for complex layouts
- CSS custom properties for theming
- Animation performance (transform/opacity only, will-change usage)

### Testing Strategies
- Component testing patterns that catch real bugs
- Integration testing approaches for user flows
- Visual regression testing setup
- Accessibility testing automation (axe-core, pa11y)

### Framework-Specific Knowledge
- Next.js App Router patterns (Server Components, Server Actions)
- React 19 features and when to use them
- Tailwind CSS v4 features and optimization
- Framer Motion performance patterns
```

===========================================
ACTIVATION TRIGGERS & HANDOFFS
===========================================

Source: agency-agents/engineering/engineering-frontend-developer.md + frontend-specialist.md

## Activation Triggers

**Invoke Frontend Specialist when:**
- "Build a landing page" / "Create a marketing site"
- "Create a dashboard UI" / "Build an admin panel"
- "Implement animations" / "Add micro-interactions"
- "Design a component library" / "Create a design system"
- "Build responsive website" / "Make this mobile-friendly"
- "Optimize frontend performance" / "Improve Lighthouse scores"
- "Add accessibility" / "Make this WCAG compliant"
- "Integrate with editor" / "Build VS Code extension UI"

## Handoff to Backend Specialist
```
Handoff Context:
- Frontend Complete: [Component list with paths]
- API Requirements: [Endpoints needed with request/response shapes]
- Data Structures: [TypeScript interfaces to match]
- Authentication: [Auth flow used - JWT/OAuth/Session]
- Real-time Needs: [WebSocket requirements if any]

Your Mission: Build APIs that match these TypeScript contracts
```

## Handoff to Security Specialist
```
Handoff Context:
- Frontend Stack: Next.js 15, React 19, TypeScript
- User Inputs: [All form locations with validation applied]
- External Requests: [API calls made, CORS requirements]
- Authentication: [How tokens/sessions are handled]
- Security Concerns: XSS prevention, CSRF tokens, input sanitization

Your Mission: Review and harden frontend security implementation
```

## Handoff to Testing Specialist
```
Handoff Context:
- Components to Test: [List with paths]
- Critical User Flows: [Flows requiring E2E tests]
- Accessibility Requirements: [WCAG level, testing tools]
- Browser Matrix: [Browsers/versions to support]
- Performance Budgets: [LCP, INP, CLS targets]

Your Mission: Create comprehensive test suite for frontend
```

===========================================
SECTION 21: AI-GENERATED UI PATTERNS (v0, Bolt)
===========================================

Source: v0 System Prompt, Bolt System Prompt, Anthropic Frontend Aesthetics Cookbook

## 21.1 v0 Code Project Pattern (UI Generation)

**Pattern 109: v0 Component Generation Architecture**
```typescript
// v0 uses Code Project blocks to group React files
// Always reads existing files before editing (Search Repo first)
// Uses kebab-case file names: login-form.tsx

// Quick Edit Pattern - ONLY write changed parts:
// ... existing code ...
// <CHANGE> adding new animation to hero section
const [isVisible, setIsVisible] = useState(false)
useEffect(() => setIsVisible(true), [])
// ... existing code ...

// v0 Style Defaults:
// - Tailwind CSS (no import needed)
// - shadcn/ui components: import { Card, CardContent } from "@/components/ui/card"
// - lucide-react for icons: import { Search, Menu } from "lucide-react"
// - recharts for data visualization
// - Framer Motion for animations
// - Default export React component
```

**Pattern 110: v0 React Style Guide**
```typescript
// Production-ready v0 component following style guide
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Filter, ArrowUpDown } from 'lucide-react'

export default function DataExplorer() {
  const [filter, setFilter] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-zinc-100 p-6">
      {/* xl headlines, base body text */}
      <h1 className="text-4xl font-bold tracking-tight mb-8">
        Data Explorer
      </h1>

      {/* Grid layout to avoid clutter */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 2xl rounded corners, soft shadows */}
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-4">
            {/* Filter/sort controls for organization */}
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(s => s === 'asc' ? 'desc' : 'asc')}
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {/* Adequate padding (at least p-2) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-base text-muted-foreground">
                Content with Framer Motion animations
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

**Pattern 111: v0 Canvas/canmore Edit Pattern**
```typescript
// GPT Canvas (canmore) uses regex-based updates for React:
// canmore.create_textdoc → initial component
// canmore.update_textdoc → regex updates (ALWAYS use ".*" for code)
// canmore.comment_textdoc → specific suggestions

// Canvas React defaults match v0:
// - Tailwind CSS
// - shadcn/ui components
// - lucide-react icons
// - recharts for charts
// - Framer Motion for animations
// - Production-ready, minimal clean aesthetic

// Key difference: Canvas rewrites entire file with ".*" pattern
// v0 uses "// ... existing code ..." for partial edits
```

## 21.2 Bolt UI Scaffolding Pattern

**Pattern 112: Bolt Rapid UI Scaffolding**
```typescript
// Bolt generates full-stack apps but FRONTEND_SPECIALIST
// only uses its UI scaffolding patterns (NO API/DB)

// Bolt UI-only patterns to extract:
// 1. Component file structure (kebab-case, co-located styles)
// 2. Responsive breakpoint system
// 3. Theme configuration
// 4. Component composition patterns

// Bolt component structure (UI only):
// src/
//   components/
//     ui/           ← Primitive components (Button, Input, Card)
//     features/     ← Feature-specific UI (HeroSection, PricingTable)
//     layouts/      ← Layout components (Sidebar, Header, Footer)
//   styles/
//     globals.css   ← CSS variables, theme tokens
//     animations.css ← Reusable animation definitions
```

**Pattern 113: AI Tool Component Sizing Patterns**
```css
/* Consistent sizing system used by v0/Bolt/Canvas */
/* Based on 4px grid with named tokens */

:root {
  /* Spacing scale */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */

  /* Border radius (v0 style: 2xl rounded) */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;  /* Default for cards/buttons */

  /* Shadow scale (soft shadows) */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.08);
}
```

