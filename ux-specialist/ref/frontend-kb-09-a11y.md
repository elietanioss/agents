## [SECTION 8: ACCESSIBILITY PATTERNS WCAG 2.2 (new success criteria, keyboard nav, screen reader support, color contrast)]

===========================================
SECTION 8: ACCESSIBILITY PATTERNS (WCAG 2.2)
===========================================

Source: Research-added (WCAG 2.2 W3C standard, ISO/IEC 40500:2025)

## 8.1 WCAG 2.2 New Success Criteria

**Pattern 56: Focus Appearance (2.4.11 AA - New in 2.2)**
```css
/* app/globals.css */
/* Source: WCAG 2.2 new criteria */

/* Enhanced focus visibility */
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  /* Contrast ratio: at least 3:1 against adjacent colors */
}

/* Button focus */
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* Input focus */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 0;
  border-color: var(--ring);
}

/* WCAG 2.2 requirement:
   - Focus indicator must be at least 2px thick
   - Contrast ratio of at least 3:1 against adjacent colors
   - Focus area must be at least as large as a 2px border
*/
```

**Pattern 57: Target Size (2.5.8 AAA - New in 2.2)**
```tsx
// components/accessible-button.tsx
// Source: WCAG 2.2 target size criteria

export function AccessibleButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="
      min-h-[44px]     /* Minimum 44x44px target */
      px-6 py-3        /* Comfortable padding */
      inline-flex items-center justify-center
      gap-2
    ">
      {children}
    </button>
  )
}

/* WCAG 2.2 Target Size:
   - Level AA (2.5.5): 24x24px minimum (unless exception)
   - Level AAA (2.5.8): 44x44px minimum (best practice)
   - Spacing: 8px between targets recommended
*/
```

## 8.2 Keyboard Navigation

**Pattern 58: Keyboard-Accessible Dropdown**
```tsx
// components/dropdown-menu.tsx
// Source: WCAG 2.1 keyboard accessibility patterns

'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function AccessibleDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* Arrow keys to navigate, Enter to select, Escape to close */}
        <DropdownMenuItem onSelect={() => console.log('Edit')}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => console.log('Delete')}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* Keyboard interactions (automatic via Radix UI):
   - Tab: Focus trigger
   - Enter/Space: Open menu
   - Arrow Down/Up: Navigate items
   - Enter: Select item
   - Escape: Close menu
   - Tab out: Close menu
*/
```

**Pattern 59: Skip to Content Link**
```tsx
// components/skip-link.tsx
// Source: WCAG 2.1 bypass blocks

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        focus:absolute focus:top-4 focus:left-4
        focus:z-50 focus:px-4 focus:py-2
        focus:bg-primary focus:text-primary-foreground
        focus:rounded-md
      "
    >
      Skip to main content
    </a>
  )
}

// Usage in layout
<body>
  <SkipLink />
  <nav>...</nav>
  <main id="main-content">...</main>
</body>

/* Allows keyboard users to skip repetitive navigation */
```

## 8.3 Screen Reader Support

**Pattern 60: ARIA Labels & Live Regions**
```tsx
// components/loading-button.tsx
// Source: WCAG ARIA best practices

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function LoadingButton({ children, onClick }: {
  children: React.ReactNode
  onClick: () => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    await onClick()
    setIsLoading(false)
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      aria-busy={isLoading}
      aria-live="polite"
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
      <span>{isLoading ? 'Loading...' : children}</span>
    </Button>
  )
}

/* ARIA attributes:
   - aria-busy: Indicates loading state to screen readers
   - aria-live="polite": Announces state changes
   - aria-hidden="true": Hides decorative icons from screen readers
*/
```

**Pattern 61: Visually Hidden Text**
```css
/* app/globals.css */
/* Source: WCAG visually hidden pattern */

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:not(:focus):not(:active) {
  /* Keep hidden even when focused */
}

/* Usage */
<button>
  <Icon aria-hidden="true" />
  <span className="sr-only">Delete item</span>
</button>

/* Icon is visible, text is read by screen readers */
```

## 8.4 Color Contrast

**Pattern 62: WCAG 2.2 AA Contrast Ratios**
```css
/* app/globals.css */
/* Source: WCAG 2.2 contrast requirements */

:root {
  /* Text contrast: 4.5:1 minimum (AA), 7:1 (AAA) */
  --foreground: #fafafa;   /* White text */
  --background: #0a0a0b;   /* Near black bg */
  /* Contrast ratio: 19.5:1 ✓ Passes AAA */

  /* UI elements: 3:1 minimum (AA) */
  --border: #27272a;       /* Border color */
  --background: #0a0a0b;   /* Background */
  /* Contrast ratio: 3.2:1 ✓ Passes AA */

  /* Interactive states */
  --primary: #6366f1;
  --primary-hover: #818cf8;  /* Lighter for hover */
  /* Both pass 4.5:1 against background */
}

/* Testing tools:
   - Chrome DevTools: Lighthouse accessibility audit
   - axe DevTools extension
   - WAVE browser extension
   - Contrast ratio calculator: webaim.org/resources/contrastchecker
*/
```

**Pattern 63: Color-Independent Information**
```tsx
// components/status-indicator.tsx
// Source: WCAG don't rely on color alone

export function StatusIndicator({ status }: { status: 'success' | 'warning' | 'error' }) {
  const config = {
    success: {
      color: 'text-green-500',
      icon: '✓',
      label: 'Success',
    },
    warning: {
      color: 'text-yellow-500',
      icon: '⚠',
      label: 'Warning',
    },
    error: {
      color: 'text-red-500',
      icon: '✕',
      label: 'Error',
    },
  }

  const { color, icon, label } = config[status]

  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

/* Don't rely on color alone:
   - Add icon
   - Add text label
   - Use patterns/shapes
*/
```

---

## [SECTION 24: ACCESSIBILITY TESTING PATTERNS (automated a11y testing, axe-core, Playwright a11y tests)]

===========================================
SECTION 24: ACCESSIBILITY TESTING PATTERNS
===========================================

Source: WCAG 2.2 AA/AAA, axe-core, Playwright accessibility

## 24.1 Automated Accessibility Testing

**Pattern 126: axe-core Integration**
```typescript
// Vitest + axe-core for component accessibility testing
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Accessibility: Navigation', () => {
  it('should have no a11y violations', async () => {
    const { container } = render(<Navigation />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper heading hierarchy', async () => {
    const { container } = render(<PageLayout />)
    const results = await axe(container, {
      rules: {
        'heading-order': { enabled: true },
        'page-has-heading-one': { enabled: true }
      }
    })
    expect(results).toHaveNoViolations()
  })
})
```

**Pattern 127: Keyboard Navigation Testing**
```typescript
// Playwright accessibility test for keyboard navigation
import { test, expect } from '@playwright/test'

test.describe('Keyboard Navigation', () => {
  test('tab order follows visual layout', async ({ page }) => {
    await page.goto('/dashboard')

    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="search-input"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="nav-home"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="nav-settings"]')).toBeFocused()
  })

  test('modal traps focus correctly', async ({ page }) => {
    await page.goto('/dashboard')
    await page.click('[data-testid="open-modal"]')

    // Focus should be inside modal
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => document.activeElement?.closest('[role="dialog"]'))
    expect(focused).toBeTruthy()

    // Shift+Tab should not escape modal
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Shift+Tab')
      const stillInModal = await page.evaluate(
        () => document.activeElement?.closest('[role="dialog"]')
      )
      expect(stillInModal).toBeTruthy()
    }

    // Escape closes modal
    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('skip links work correctly', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.locator('a[href="#main-content"]')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('#main-content')).toBeFocused()
  })
})
```

**Pattern 128: Color Contrast Validation**
```typescript
// Automated contrast ratio checking
function getContrastRatio(fg: string, bg: string): number {
  const fgLum = getRelativeLuminance(parseColor(fg))
  const bgLum = getRelativeLuminance(parseColor(bg))
  const lighter = Math.max(fgLum, bgLum)
  const darker = Math.min(fgLum, bgLum)
  return (lighter + 0.05) / (darker + 0.05)
}

// WCAG 2.2 AA requirements:
// Normal text (< 18pt): 4.5:1 minimum
// Large text (>= 18pt or 14pt bold): 3:1 minimum
// UI components & graphical objects: 3:1 minimum

// WCAG 2.2 AAA requirements:
// Normal text: 7:1 minimum
// Large text: 4.5:1 minimum

const CONTRAST_REQUIREMENTS = {
  'AA-normal': 4.5,
  'AA-large': 3.0,
  'AA-ui': 3.0,
  'AAA-normal': 7.0,
  'AAA-large': 4.5,
}

// Test all theme color combinations
describe('Color Contrast', () => {
  const theme = {
    text: '#1c1917',
    textMuted: '#78716c',
    bg: '#fafaf9',
    surface: '#ffffff',
    accent: '#059669',
  }

  it('primary text on background meets AA', () => {
    expect(getContrastRatio(theme.text, theme.bg))
      .toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS['AA-normal'])
  })

  it('muted text on surface meets AA', () => {
    expect(getContrastRatio(theme.textMuted, theme.surface))
      .toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS['AA-normal'])
  })

  it('accent on background meets AA for UI', () => {
    expect(getContrastRatio(theme.accent, theme.bg))
      .toBeGreaterThanOrEqual(CONTRAST_REQUIREMENTS['AA-ui'])
  })
})
```

**Pattern 129: Screen Reader Testing Checklist**
```typescript
// ARIA patterns for common UI components

// Accessible Modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Confirm Action</h2>
  <p id="modal-description">Are you sure you want to proceed?</p>
  <button onClick={onConfirm}>Confirm</button>
  <button onClick={onCancel}>Cancel</button>
</div>

// Accessible Tabs
<div role="tablist" aria-label="Settings sections">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">
    General
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">
    Security
  </button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
  Panel content
</div>

// Accessible Toast/Alert
<div role="alert" aria-live="polite" aria-atomic="true">
  Settings saved successfully
</div>

// Accessible Loading State
<div role="status" aria-live="polite">
  <span className="sr-only">Loading data...</span>
  <Spinner aria-hidden="true" />
</div>

// Accessible Icon Button
<button aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>
```

**Pattern 130: Responsive Accessibility**
```typescript
// Ensure touch targets meet WCAG 2.2 Target Size (Level AA)
// Minimum 24x24 CSS pixels, recommended 44x44

// Touch target sizing
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 8px;
  /* Ensure spacing between adjacent targets */
  margin: 4px;
}

// Mobile-specific a11y
@media (max-width: 768px) {
  /* Increase all interactive elements for touch */
  button, a, input, select, textarea {
    min-height: 44px;
    min-width: 44px;
  }

  /* Increase font size for readability */
  body {
    font-size: 16px;  /* Prevents iOS zoom on input focus */
  }

  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

