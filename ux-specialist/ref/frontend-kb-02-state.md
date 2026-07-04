## [SECTION 2: REACT 19 FEATURES & PATTERNS (use hook, Actions API, Compiler)]

===========================================
SECTION 2: REACT 19 FEATURES & PATTERNS
===========================================

Source: Research-added (React 19 release notes, 2025 developer guides)

## 2.1 The `use` Hook

**Pattern 12: Reading Promises with `use`**
```typescript
// components/user-profile.tsx
// Source: React 19 documentation

'use client'

import { use } from 'react'

interface UserProfileProps {
  userPromise: Promise<User>
}

export function UserProfile({ userPromise }: UserProfileProps) {
  // use() can be called conditionally and in loops
  const user = use(userPromise)

  return (
    <div className="card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}

// Parent component
export function UserPage({ userId }: { userId: string }) {
  const userPromise = fetchUser(userId)

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  )
}
```

**Pattern 13: Conditional `use` (Unlike Other Hooks)**
```typescript
'use client'

import { use } from 'react'

export function ConditionalData({
  showData,
  dataPromise
}: {
  showData: boolean
  dataPromise: Promise<Data>
}) {
  // use() CAN be called conditionally (unlike useState, useEffect)
  const data = showData ? use(dataPromise) : null

  if (!showData) {
    return <p>Data hidden</p>
  }

  return <DataDisplay data={data} />
}
```

**Pattern 14: Reading Context with `use`**
```typescript
'use client'

import { use } from 'react'
import { ThemeContext } from '@/contexts/theme'

export function ThemedButton() {
  // Alternative to useContext
  const theme = use(ThemeContext)

  return (
    <button className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
      Themed Button
    </button>
  )
}
```

## 2.2 React Actions API

**Pattern 15: useActionState for Form State**
```typescript
'use client'

import { useActionState } from 'react'
import { submitForm } from './actions'

export function FormWithState() {
  const [state, formAction, isPending] = useActionState(
    submitForm,
    { message: null, errors: null }
  )

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      {state.errors?.email && (
        <p className="text-red-500">{state.errors.email}</p>
      )}

      <button disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>

      {state.message && (
        <p className="text-green-500">{state.message}</p>
      )}
    </form>
  )
}
```

**Pattern 16: useFormStatus for Submit Button**
```typescript
'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}

// Usage in form
<form action={submitAction}>
  <input name="email" />
  <SubmitButton>Subscribe</SubmitButton>
</form>
```

## 2.3 React Compiler Optimization

**Pattern 17: Automatic Memoization (No useMemo Needed)**
```typescript
// Source: React 19 compiler documentation
// React Compiler automatically optimizes these patterns

// OLD WAY (React 18):
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data)
}, [data])

// NEW WAY (React 19 with compiler):
const expensiveValue = calculateExpensiveValue(data)
// Compiler automatically memoizes when beneficial

// No need for useCallback either:
// OLD: const handleClick = useCallback(() => {...}, [dep])
// NEW: const handleClick = () => {...}
```

**Pattern 18: Component Optimization Without memo()**
```typescript
// React 19 compiler handles optimization

// No need for React.memo() wrapper
export function ExpensiveComponent({ data }: { data: Data }) {
  // Compiler optimizes re-renders automatically
  return (
    <div className="complex-component">
      {data.items.map(item => (
        <ComplexItem key={item.id} item={item} />
      ))}
    </div>
  )
}

// Compiler intelligently batches updates and minimizes re-renders
```

===========================================

---

## [SECTION 10: COMPONENT LIBRARY INTEGRATION (shadcn/ui setup, Framer Motion integration, custom hooks)]

===========================================
SECTION 10: COMPONENT LIBRARY INTEGRATION
===========================================

Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt + Research

## 10.1 shadcn/ui Setup & Configuration

**Pattern 72: Initial Setup**
```bash
# Terminal commands
# Source: shadcn/ui installation guide

# Initialize shadcn/ui
npx shadcn@latest init -d

# Add components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sheet
npx shadcn@latest add tabs
npx shadcn@latest add accordion
npx shadcn@latest add separator
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add scroll-area

# All components are copied to your project
# Full control over styling and behavior
```

**Pattern 73: Theme Configuration**
```typescript
// components.json
// Source: shadcn/ui configuration

{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

## 10.2 Framer Motion Integration

**Pattern 74: Animation Utilities Library**
```typescript
// lib/animations.ts
// Source: Complete animation library from source extraction

import { Variants } from 'framer-motion'

// ============================================
// BASIC ANIMATIONS
// ============================================

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// ============================================
// STAGGER CONTAINER
// ============================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// ============================================
// HOVER ANIMATIONS
// ============================================

export const hoverLift = {
  hover: {
    y: -8,
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
}

export const hoverScale = {
  hover: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  },
  tap: {
    scale: 0.95,
  },
}

// ============================================
// PAGE TRANSITIONS
// ============================================

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' },
}
```

## 10.3 Custom Hook Patterns

**Pattern 75: useMediaQuery Hook**
```typescript
// lib/hooks/use-media-query.ts
// Source: Common responsive pattern

'use client'

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// Usage
export function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <div>
      {isMobile && <MobileView />}
      {isDesktop && <DesktopView />}
    </div>
  )
}
```

**Pattern 76: useLocalStorage Hook**
```typescript
// lib/hooks/use-local-storage.ts

'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(error)
    }
  }, [key])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

// Usage
export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  )
}
```

===========================================

