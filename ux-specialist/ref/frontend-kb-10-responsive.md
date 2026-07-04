## [SECTION 7: RESPONSIVE DESIGN PATTERNS (mobile-first, mobile constraints, responsive typography)]

===========================================
SECTION 7: RESPONSIVE DESIGN PATTERNS
===========================================

Source: Extracted from Master_Claude_Code_Architect.txt

## 7.1 Mobile-First Patterns

**Pattern 49: Mobile-First Grid Layout**
```tsx
// components/feature-grid.tsx
// Source: Extracted from Master_Claude_Code_Architect.txt

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="
      grid
      grid-cols-1              /* Mobile: single column */
      sm:grid-cols-2           /* Tablet: 2 columns */
      lg:grid-cols-3           /* Desktop: 3 columns */
      xl:grid-cols-4           /* Large: 4 columns */
      gap-4 sm:gap-6 lg:gap-8  /* Responsive gaps */
    ">
      {features.map((feature) => (
        <div key={feature.id} className="card p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">
            {feature.title}
          </h3>
          <p className="text-sm sm:text-base mt-2">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  )
}

/* Breakpoints:
   sm: 640px
   md: 768px
   lg: 1024px
   xl: 1280px
   2xl: 1536px
*/
```

**Pattern 50: Responsive Container**
```tsx
// components/container.tsx

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      container
      mx-auto
      px-4              /* Mobile: 16px padding */
      sm:px-6           /* Tablet: 24px padding */
      lg:px-8           /* Desktop: 32px padding */
      max-w-7xl         /* Max width: 1280px */
    ">
      {children}
    </div>
  )
}
```

## 7.2 Mobile-Specific Constraints

**Pattern 51: Touch Target Sizing**
```tsx
// components/mobile-nav.tsx
// Source: Extracted from Master_Claude_Code_Architect.txt

export function MobileNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="md:hidden">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="
            block
            min-h-[44px]     /* Apple HIG: 44x44px minimum */
            py-3 px-4        /* Comfortable touch area */
            text-base        /* Legible on mobile */
          "
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}

/* Touch target guidelines:
   - Apple HIG: 44x44px minimum
   - Material Design: 48x48px minimum
   - WCAG 2.2: 24x24px minimum (new)

   Best practice: Use 44x44px minimum
*/
```

**Pattern 52: Thumb Zone Optimization**
```tsx
// components/mobile-cta.tsx
// Source: Extracted from Master_Claude_Code_Architect.txt

export function MobileCTA() {
  return (
    <>
      {/* Desktop: top navigation */}
      <div className="hidden md:block">
        <button className="btn-primary">Sign Up</button>
      </div>

      {/* Mobile: bottom sticky CTA (easy thumb reach) */}
      <div className="
        fixed bottom-0 left-0 right-0
        p-4 bg-background border-t
        md:hidden
      ">
        <button className="btn-primary w-full min-h-[48px]">
          Sign Up
        </button>
      </div>
    </>
  )
}

/* Thumb zones:
   EASY: Bottom 30% of screen - primary actions
   OK: Middle 40% - content, scrolling
   HARD: Top 30% - secondary actions, navigation
*/
```

**Pattern 53: No Hover States on Mobile**
```tsx
// components/interactive-card.tsx

'use client'

import { useState } from 'react'

export function InteractiveCard({ content }: { content: string }) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div
      className={`
        card p-6 cursor-pointer
        active:scale-[0.98]      /* Touch feedback on mobile */
        md:hover:shadow-lg       /* Hover only on desktop */
        md:hover:-translate-y-2  /* Hover only on desktop */
        transition-all duration-200
      `}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {content}
    </div>
  )
}

/* Mobile: Use active: states, not hover:
   - active:scale-95 (press effect)
   - active:bg-secondary
   - Touch feedback is immediate

   Desktop: Use hover: states
*/
```

## 7.3 Responsive Typography

**Pattern 54: Fluid Typography**
```css
/* app/globals.css */
/* Source: Extracted from Master_Claude_Code_Architect.txt */

:root {
  /* Fluid font sizes using clamp() */
  --font-size-h1: clamp(2rem, 5vw, 4rem);     /* 32px - 64px */
  --font-size-h2: clamp(1.75rem, 4vw, 3rem);  /* 28px - 48px */
  --font-size-h3: clamp(1.5rem, 3vw, 2.25rem);/* 24px - 36px */
  --font-size-body: clamp(1rem, 2vw, 1.125rem);/* 16px - 18px */
}

h1 {
  font-size: var(--font-size-h1);
  line-height: 1.1;
}

h2 {
  font-size: var(--font-size-h2);
  line-height: 1.2;
}

h3 {
  font-size: var(--font-size-h3);
  line-height: 1.3;
}

body {
  font-size: var(--font-size-body);
  line-height: 1.6;
}

/* Scales smoothly across all screen sizes */
```

**Pattern 55: Responsive Spacing**
```tsx
// components/section.tsx

export function Section({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <section className="
      py-12 sm:py-16 lg:py-24       /* Vertical padding scales */
      px-4 sm:px-6 lg:px-8           /* Horizontal padding scales */
    ">
      <div className="container mx-auto">
        <h2 className="
          text-3xl sm:text-4xl lg:text-5xl  /* Font size scales */
          mb-8 sm:mb-12 lg:mb-16            /* Bottom margin scales */
          font-bold
        ">
          {title}
        </h2>
        <div className="
          space-y-6 sm:space-y-8 lg:space-y-12  /* Gap between items scales */
        ">
          {children}
        </div>
      </div>
    </section>
  )
}
```

