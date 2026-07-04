# Testing KB 01 — Jest 29, Vitest, React Testing Library

## SECTION 1: JEST 29 UNIT TESTING

### 1.1 Jest Configuration for TypeScript + React

**Pattern 1: Complete Jest Setup (Next.js 15 + TypeScript)**
```typescript
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/dist/**',
  ],
  coverageThresholds: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest', {
      jsc: { parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } } },
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testTimeout: 10000,
  maxWorkers: '50%', // Jest 29 improvement: 20% faster
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
}

export default createJestConfig(config)
```

**Pattern 2: Jest Setup File (Testing Library + Custom Matchers)**
```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
import 'jest-extended'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false, media: query, onchange: null,
    addListener: jest.fn(), removeListener: jest.fn(),
    addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn(),
  })),
})

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return [] }
  unobserve() {}
} as any

const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render')) return
    originalError.call(console, ...args)
  }
})
afterAll(() => { console.error = originalError })
```

### 1.2 Component Testing Patterns

**Pattern 3: Basic Component Test** — render, query by role, click, assert class/state changes via `rerender`.

**Pattern 4: Testing with Context Providers** — wrap render in a `renderWithTheme()` helper that supplies `<ThemeProvider>`; assert toggled text content across clicks.

**Pattern 5: Testing Async Components**
```typescript
global.fetch = jest.fn()

describe('UserProfile', () => {
  beforeEach(() => jest.clearAllMocks())

  it('loads and displays user data', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockUser })

    render(<UserProfile userId="1" />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument())
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('displays error message on fetch failure', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'))
    render(<UserProfile userId="1" />)
    await waitFor(() => expect(screen.getByText(/error loading user/i)).toBeInTheDocument())
  })
})
```

### 1.3 Hook Testing

**Pattern 6: Custom Hook Testing**
```typescript
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../use-local-storage'

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear())

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('updates stored value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))
    act(() => { result.current[1]('updated') })
    expect(result.current[0]).toBe('updated')
    expect(localStorage.getItem('key')).toBe(JSON.stringify('updated'))
  })

  it('handles JSON parse errors gracefully', () => {
    localStorage.setItem('key', 'invalid json')
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))
    expect(result.current[0]).toBe('initial') // falls back
  })
})
```

---

## SECTION 2: VITEST (2-5x FASTER THAN JEST)

### 2.1 Vitest Configuration

**Pattern 7: Vitest Setup with Browser Mode**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8', // faster than istanbul
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.config.*', '**/mockData'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
    globals: true,
    browser: { enabled: false, name: 'chromium', provider: 'playwright', headless: true }, // Vitest 4.0 Browser Mode
    pool: 'threads',
    poolOptions: { threads: { singleThread: false, isolate: true } },
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.next', 'coverage'],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
    },
  },
})
```

**Pattern 8: Vitest Component Test** — same RTL API as Jest (`render`, `screen`), swap `jest.fn()` for `vi.fn()`.

**Pattern 9: Vitest Browser Mode Testing (Real Browser)**
```typescript
// components/__tests__/interactive.browser.test.tsx
import { test, expect } from '@vitest/browser/context'

test('interactive element works in real browser', async () => {
  const button = document.querySelector('button')
  await button?.click()
  const result = document.querySelector('.result')
  expect(result?.textContent).toBe('Clicked')
})
```

---

## SECTION 3: REACT TESTING LIBRARY PATTERNS

### 3.1 Accessibility-First Queries

**Pattern 10: Semantic Query Hierarchy**
```
Query Priority (RTL best practice):
1. getByRole        — Best (semantic + accessible)
2. getByLabelText   — Good (accessibility check)
3. getByPlaceholderText — OK (not reliable)
4. getByText        — OK (for non-interactive)
5. getByDisplayValue — OK (for forms)
6. getByAltText     — OK (for images)
7. getByTitle       — Not recommended
8. getByTestId      — Last resort only
```
Errors surfaced via `toHaveAccessibleDescription` should be linked to inputs via `aria-describedby` — verify this in the test, not just that error text renders somewhere on the page.

**Pattern 11: userEvent over fireEvent**
```typescript
// ✅ USE: userEvent (simulates real user behavior — triggers keyDown/keyPress/keyUp per char)
await user.type(input, 'react')

// ❌ AVOID: fireEvent (low-level, unrealistic)
// fireEvent.change(input, { target: { value: 'react' } })
```
Also cover keyboard navigation: `user.tab()`, `user.keyboard('{ArrowDown}')`, `user.keyboard('{Enter}')` for combobox/menu interactions.

### 3.2 Accessibility Testing with axe-core

**Pattern 12: Automated Accessibility Testing**
```typescript
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('HomePage Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<HomePage />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has proper heading hierarchy', async () => {
    const { container } = render(<HomePage />)
    const results = await axe(container, { rules: { 'heading-order': { enabled: true } } })
    expect(results).toHaveNoViolations()
  })
})
```

**Pattern 13: Keyboard Navigation Testing** — Tab through links verifying focus order; test a skip-link that moves focus to `<main>` on Enter; `user.tab({ shift: true })` to verify reverse order.
