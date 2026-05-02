===========================================
TESTING SPECIALIST AGENT
Enterprise Testing Strategy & Implementation
Production-Grade B2B Commercial Implementation
Version 1.0
===========================================

AGENT IDENTITY & MISSION
===========================================

**Name:** Testing Specialist Agent
**Specialization:** Unit, Integration, E2E, Performance, Security Testing
**Capability Level:** Enterprise full-stack testing architecture
**Target Output:** 60-80 patterns, production-ready implementations

**Primary Functions:**
- Jest 29 unit testing (React, TypeScript, Node.js)
- Vitest testing (Vite projects, 2-5x faster than Jest)
- React Testing Library (accessibility-first component testing)
- Playwright E2E testing (cross-browser, auto-wait, visual regression)
- Schema validation testing (Zod, API contracts)
- RLS policy testing (Row-Level Security verification)
- Rate limiting testing (API throttling, abuse prevention)
- Accessibility testing (WCAG 2.2, axe-core, keyboard navigation)
- Performance testing (Core Web Vitals, load testing)
- Security testing integration (OWASP patterns, penetration testing)
- Test automation & CI/CD (GitHub Actions, parallelization)
- Mocking patterns (MSW, fixtures, test databases)

**Knowledge Sources:**
- Source: final claude code bachend and design.txt (testing sections extracted)
- Research: Jest 29 features & TypeScript best practices (2025)
- Research: Vitest 4.0 (Browser Mode, visual regression, 2-5x speed)
- Research: Playwright best practices (POM, flaky test prevention)
- Research: React Testing Library accessibility patterns (2025)
- Research: OWASP testing methodologies

===========================================
SECTION 1: JEST 29 UNIT TESTING
===========================================

Source: Research-added (Jest 29 documentation, TypeScript best practices)

## 1.1 Jest Configuration for TypeScript + React

**Pattern 1: Complete Jest Setup (Next.js 15 + TypeScript)**
```typescript
// jest.config.ts
// Source: Jest 29 TypeScript setup

import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  // Path to Next.js app for loading next.config.js and .env files
  dir: './',
})

const config: Config = {
  // Test environment
  testEnvironment: 'jest-environment-jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Module paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },

  // Coverage configuration
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
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Test timeout
  testTimeout: 10000,

  // Parallel execution (Jest 29 improvement: 20% faster)
  maxWorkers: '50%',

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
}

export default createJestConfig(config)
```

**Pattern 2: Jest Setup File (Testing Library + Custom Matchers)**
```typescript
// jest.setup.ts
// Source: Jest 29 + React Testing Library setup

import '@testing-library/jest-dom'
import 'jest-extended'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return [] }
  unobserve() {}
} as any

// Suppress console errors in tests (optional)
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
```

## 1.2 Component Testing Patterns

**Pattern 3: Basic Component Test**
```typescript
// components/__tests__/button.test.tsx
// Source: Jest 29 + React Testing Library best practices

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeDisabled()
  })

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)

    let button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary')

    rerender(<Button variant="secondary">Secondary</Button>)

    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-secondary')
  })
})
```

**Pattern 4: Testing with Context Providers**
```typescript
// components/__tests__/theme-toggle.test.tsx

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/contexts/theme'
import { ThemeToggle } from '../theme-toggle'

// Helper to render with providers
function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  )
}

describe('ThemeToggle', () => {
  it('toggles between light and dark mode', async () => {
    const user = userEvent.setup()

    renderWithTheme(<ThemeToggle />)

    const toggle = screen.getByRole('button', { name: /toggle theme/i })

    // Initial state (light mode)
    expect(toggle).toHaveTextContent('Dark')

    // Toggle to dark mode
    await user.click(toggle)
    expect(toggle).toHaveTextContent('Light')

    // Toggle back to light mode
    await user.click(toggle)
    expect(toggle).toHaveTextContent('Dark')
  })
})
```

**Pattern 5: Testing Async Components**
```typescript
// components/__tests__/user-profile.test.tsx

import { render, screen, waitFor } from '@testing-library/react'
import { UserProfile } from '../user-profile'

// Mock fetch
global.fetch = jest.fn()

describe('UserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads and displays user data', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    })

    render(<UserProfile userId="1" />)

    // Loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('displays error message on fetch failure', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch')
    )

    render(<UserProfile userId="1" />)

    await waitFor(() => {
      expect(screen.getByText(/error loading user/i)).toBeInTheDocument()
    })
  })
})
```

## 1.3 Hook Testing

**Pattern 6: Custom Hook Testing**
```typescript
// lib/hooks/__tests__/use-local-storage.test.ts

import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../use-local-storage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    expect(result.current[0]).toBe('initial')
  })

  it('returns stored value when it exists', () => {
    localStorage.setItem('key', JSON.stringify('stored'))

    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    expect(result.current[0]).toBe('stored')
  })

  it('updates stored value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(localStorage.getItem('key')).toBe(JSON.stringify('updated'))
  })

  it('handles JSON parse errors gracefully', () => {
    localStorage.setItem('key', 'invalid json')

    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    // Should fall back to initial value
    expect(result.current[0]).toBe('initial')
  })
})
```

===========================================
SECTION 2: VITEST TESTING (MODERN ALTERNATIVE)
===========================================

Source: Research-added (Vitest 4.0 features, performance benchmarks)

## 2.1 Vitest Configuration

**Pattern 7: Vitest Setup (2-5x Faster Than Jest)**
```typescript
// vitest.config.ts
// Source: Vitest 4.0 with Browser Mode

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  test: {
    // Environment
    environment: 'jsdom',

    // Setup files
    setupFiles: ['./vitest.setup.ts'],

    // Coverage
    coverage: {
      provider: 'v8', // Faster than istanbul
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },

    // Global test APIs (no imports needed)
    globals: true,

    // Browser Mode (Vitest 4.0) - run tests in real browser
    browser: {
      enabled: false, // Enable for browser-specific tests
      name: 'chromium',
      provider: 'playwright',
      headless: true,
    },

    // Visual Regression Testing (Vitest 4.0)
    // Requires @vitest/plugin-visual
    // visual: {
    //   enabled: true,
    //   baseDir: './__visual_snapshots__',
    // },

    // Performance
    pool: 'threads', // or 'forks'
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
      },
    },

    // Test patterns
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.next', 'coverage'],

    // Timeout
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

**Pattern 8: Vitest Component Test (Same API as Jest)**
```typescript
// components/__tests__/card.test.tsx
// Source: Vitest testing patterns

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from '../card'

describe('Card', () => {
  it('renders card with title and description', () => {
    render(
      <Card title="Test Card" description="Test description">
        <p>Card content</p>
      </Card>
    )

    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })
})
```

**Pattern 9: Vitest Browser Mode Testing (Real Browser)**
```typescript
// components/__tests__/interactive.browser.test.tsx
// Source: Vitest 4.0 Browser Mode

import { test, expect } from '@vitest/browser/context'

test('interactive element works in real browser', async () => {
  // Runs in actual Chromium browser via Playwright
  const button = document.querySelector('button')

  await button?.click()

  const result = document.querySelector('.result')
  expect(result?.textContent).toBe('Clicked')
})
```

===========================================
SECTION 3: REACT TESTING LIBRARY PATTERNS
===========================================

Source: Research-added (RTL accessibility-first best practices)

## 3.1 Accessibility-First Queries

**Pattern 10: Semantic Query Hierarchy**
```typescript
// components/__tests__/form.test.tsx
// Source: React Testing Library accessibility patterns

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../contact-form'

describe('ContactForm', () => {
  it('has accessible form inputs', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    // ✅ BEST: getByRole (semantic, accessible)
    const nameInput = screen.getByRole('textbox', { name: /name/i })
    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const submitButton = screen.getByRole('button', { name: /submit/i })

    // ✅ GOOD: getByLabelText (accessibility check)
    const messageInput = screen.getByLabelText(/message/i)

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(messageInput, 'Hello world')
    await user.click(submitButton)

    expect(screen.getByText(/thank you/i)).toBeInTheDocument()
  })

  it('shows validation errors', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    // Errors should be associated with inputs via aria-describedby
    const nameInput = screen.getByRole('textbox', { name: /name/i })
    expect(nameInput).toHaveAccessibleDescription(/name is required/i)
  })
})

/* Query Priority (React Testing Library best practices):
   1. getByRole - Best (semantic + accessible)
   2. getByLabelText - Good (accessibility check)
   3. getByPlaceholderText - OK (not reliable)
   4. getByText - OK (for non-interactive)
   5. getByDisplayValue - OK (for forms)
   6. getByAltText - OK (for images)
   7. getByTitle - Not recommended
   8. getByTestId - Last resort only
*/
```

**Pattern 11: User Event over fireEvent**
```typescript
// components/__tests__/search.test.tsx
// Source: React Testing Library user-event patterns

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInput } from '../search-input'

describe('SearchInput', () => {
  it('triggers search on input with debounce', async () => {
    const onSearch = jest.fn()
    const user = userEvent.setup()

    render(<SearchInput onSearch={onSearch} />)

    const input = screen.getByRole('searchbox')

    // ✅ USE: userEvent (simulates real user behavior)
    // Triggers keyDown, keyPress, keyUp for each character
    await user.type(input, 'react')

    // ❌ AVOID: fireEvent (low-level, unrealistic)
    // fireEvent.change(input, { target: { value: 'react' } })

    // Wait for debounced search
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('react')
    })
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<SearchInput />)

    const input = screen.getByRole('searchbox')

    // Tab to input
    await user.tab()
    expect(input).toHaveFocus()

    // Type query
    await user.type(input, 'test')

    // Arrow down to results
    await user.keyboard('{ArrowDown}')

    // Enter to select
    await user.keyboard('{Enter}')
  })
})
```

## 3.2 Accessibility Testing with axe-core

**Pattern 12: Automated Accessibility Testing**
```typescript
// components/__tests__/page.a11y.test.tsx
// Source: React Testing Library + axe-core integration

import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { HomePage } from '@/app/page'

expect.extend(toHaveNoViolations)

describe('HomePage Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<HomePage />)

    // Run axe-core accessibility checks
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  it('has proper heading hierarchy', async () => {
    const { container } = render(<HomePage />)

    const results = await axe(container, {
      rules: {
        // Only check heading-order rule
        'heading-order': { enabled: true },
      },
    })

    expect(results).toHaveNoViolations()
  })

  it('all images have alt text', async () => {
    const { container } = render(<HomePage />)

    const results = await axe(container, {
      rules: {
        'image-alt': { enabled: true },
      },
    })

    expect(results).toHaveNoViolations()
  })
})
```

**Pattern 13: Keyboard Navigation Testing**
```typescript
// components/__tests__/navigation.test.tsx

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation } from '../navigation'

describe('Navigation Keyboard Accessibility', () => {
  it('is fully keyboard navigable', async () => {
    const user = userEvent.setup()
    render(<Navigation />)

    // Tab to first link
    await user.tab()
    const homeLink = screen.getByRole('link', { name: /home/i })
    expect(homeLink).toHaveFocus()

    // Tab to second link
    await user.tab()
    const aboutLink = screen.getByRole('link', { name: /about/i })
    expect(aboutLink).toHaveFocus()

    // Shift+Tab back
    await user.tab({ shift: true })
    expect(homeLink).toHaveFocus()
  })

  it('skip link allows bypassing navigation', async () => {
    const user = userEvent.setup()
    render(<Navigation />)

    // Tab to skip link (first element)
    await user.tab()
    const skipLink = screen.getByRole('link', { name: /skip to content/i })
    expect(skipLink).toHaveFocus()

    // Enter on skip link
    await user.keyboard('{Enter}')

    // Should focus main content
    const main = screen.getByRole('main')
    expect(main).toHaveFocus()
  })
})
```

===========================================
SECTION 4: PLAYWRIGHT E2E TESTING
===========================================

Source: Research-added (Playwright 2025 best practices, flaky test prevention)

## 4.1 Playwright Configuration

**Pattern 14: Complete Playwright Setup**
```typescript
// playwright.config.ts
// Source: Playwright best practices 2025

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',

  // Test isolation
  fullyParallel: true,

  // Fail fast
  forbidOnly: !!process.env.CI,

  // Retries
  retries: process.env.CI ? 2 : 0,

  // Workers (parallel execution)
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // Shared settings
  use: {
    // Base URL
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Automatic waiting (best practice)
    actionTimeout: 10000,
    navigationTimeout: 30000,

    // Screenshots
    screenshot: 'only-on-failure',

    // Video
    video: 'retain-on-failure',

    // Trace
    trace: 'retain-on-failure',

    // Locale
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  // Projects (cross-browser testing)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  // Web server (auto-start during tests)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
```

## 4.2 Page Object Model (POM)

**Pattern 15: Page Object Pattern**
```typescript
// e2e/pages/login.page.ts
// Source: Playwright POM best practices

import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page

    // Locators (stable, not flaky)
    this.emailInput = page.getByRole('textbox', { name: /email/i })
    this.passwordInput = page.getByRole('textbox', { name: /password/i })
    this.loginButton = page.getByRole('button', { name: /log in/i })
    this.errorMessage = page.getByRole('alert')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }

  async loginWithEnter(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.passwordInput.press('Enter')
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent()
  }

  async isLoginButtonDisabled() {
    return await this.loginButton.isDisabled()
  }
}
```

**Pattern 16: E2E Test with POM**
```typescript
// e2e/auth/login.spec.ts
// Source: Playwright E2E testing patterns

import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'

test.describe('Login Flow', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('successful login redirects to dashboard', async ({ page }) => {
    await loginPage.login('user@example.com', 'password123')

    // Wait for navigation
    await expect(page).toHaveURL('/dashboard')

    // Verify dashboard content
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
  })

  test('invalid credentials show error message', async () => {
    await loginPage.login('invalid@example.com', 'wrongpassword')

    // Error message should appear
    const error = await loginPage.getErrorMessage()
    expect(error).toContain('Invalid email or password')
  })

  test('empty fields disable login button', async () => {
    // Button should be disabled initially
    expect(await loginPage.isLoginButtonDisabled()).toBe(true)

    // Fill email only
    await loginPage.emailInput.fill('user@example.com')
    expect(await loginPage.isLoginButtonDisabled()).toBe(true)

    // Fill password too
    await loginPage.passwordInput.fill('password123')
    expect(await loginPage.isLoginButtonDisabled()).toBe(false)
  })
})
```

## 4.3 API Testing with Playwright

**Pattern 17: API Request Interception**
```typescript
// e2e/api/users.spec.ts
// Source: Playwright API testing patterns

import { test, expect } from '@playwright/test'

test.describe('User API', () => {
  test('GET /api/users returns user list', async ({ request }) => {
    const response = await request.get('/api/users')

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const users = await response.json()
    expect(Array.isArray(users)).toBe(true)
    expect(users.length).toBeGreaterThan(0)
  })

  test('POST /api/users creates new user', async ({ request }) => {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
    }

    const response = await request.post('/api/users', {
      data: newUser,
    })

    expect(response.status()).toBe(201)

    const created = await response.json()
    expect(created).toMatchObject(newUser)
    expect(created.id).toBeDefined()
  })

  test('mock API response', async ({ page }) => {
    // Mock API response
    await page.route('/api/users', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', name: 'Mock User', email: 'mock@example.com' },
        ]),
      })
    })

    await page.goto('/users')

    // Should display mocked data
    await expect(page.getByText('Mock User')).toBeVisible()
  })
})
```

## 4.4 Visual Regression Testing

**Pattern 18: Screenshot Comparison**
```typescript
// e2e/visual/homepage.spec.ts
// Source: Playwright visual regression testing

import { test, expect } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('homepage appears correctly', async ({ page }) => {
    await page.goto('/')

    // Full page screenshot
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixels: 100, // Allow small differences
    })
  })

  test('hero section matches design', async ({ page }) => {
    await page.goto('/')

    const hero = page.locator('.hero-section')

    // Element screenshot
    await expect(hero).toHaveScreenshot('hero.png')
  })

  test('button hover state', async ({ page }) => {
    await page.goto('/')

    const button = page.getByRole('button', { name: /get started/i })

    // Hover and capture
    await button.hover()
    await expect(button).toHaveScreenshot('button-hover.png')
  })

  test('dark mode styling', async ({ page }) => {
    await page.goto('/')

    // Toggle dark mode
    await page.getByRole('button', { name: /toggle theme/i }).click()

    // Capture dark mode
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
    })
  })
})
```

===========================================
SECTION 5: SCHEMA VALIDATION TESTING
===========================================

Source: Extracted from final claude code bachend and design.txt (testing sections)

## 5.1 Zod Schema Testing

**Pattern 19: Schema Validation Test Suite**
```typescript
// lib/schemas/__tests__/user.schema.test.ts
// Source: Extracted from backend file - testing recommendations

import { describe, it, expect } from 'vitest'
import { userSchema, createUserSchema, updateUserSchema } from '../user.schema'

describe('User Schema', () => {
  describe('userSchema (full validation)', () => {
    it('should accept valid user data', () => {
      const validUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        name: 'John Doe',
        role: 'user',
        createdAt: new Date(),
      }

      const result = userSchema.safeParse(validUser)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidUser = {
        id: '123',
        email: 'invalid-email',
        name: 'John Doe',
      }

      const result = userSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email')
        expect(result.error.issues[0].message).toContain('Invalid email')
      }
    })

    it('should reject short names', () => {
      const invalidUser = {
        email: 'test@example.com',
        name: 'J', // Too short
      }

      const result = createUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined()
      }
    })
  })

  describe('createUserSchema', () => {
    it('should require email and name', () => {
      const result = createUserSchema.safeParse({})

      expect(result.success).toBe(false)

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        expect(errors.email).toBeDefined()
        expect(errors.name).toBeDefined()
      }
    })

    it('should accept optional role', () => {
      const user = {
        email: 'test@example.com',
        name: 'John Doe',
        // role omitted
      }

      const result = createUserSchema.safeParse(user)
      expect(result.success).toBe(true)
    })
  })

  describe('updateUserSchema', () => {
    it('should allow partial updates', () => {
      const update = {
        name: 'Jane Doe', // Only update name
      }

      const result = updateUserSchema.safeParse(update)
      expect(result.success).toBe(true)
    })

    it('should validate updated fields', () => {
      const update = {
        email: 'invalid', // Invalid format
      }

      const result = updateUserSchema.safeParse(update)
      expect(result.success).toBe(false)
    })
  })
})
```

**Pattern 20: API Endpoint Schema Testing**
```typescript
// app/api/users/__tests__/route.test.ts
// Source: Extracted from backend file - API testing patterns

import { POST } from '../route'
import { NextRequest } from 'next/server'

describe('POST /api/users', () => {
  it('validates request body with Zod', async () => {
    const invalidBody = {
      email: 'invalid-email',
      name: 'J', // Too short
    }

    const request = new NextRequest('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify(invalidBody),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.errors).toBeDefined()
    expect(data.errors.email).toBeDefined()
    expect(data.errors.name).toBeDefined()
  })

  it('accepts valid request', async () => {
    const validBody = {
      email: 'test@example.com',
      name: 'John Doe',
    }

    const request = new NextRequest('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify(validBody),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.id).toBeDefined()
    expect(data.email).toBe(validBody.email)
  })
})
```

===========================================
SECTION 6: RLS POLICY TESTING
===========================================

Source: Extracted from final claude code bachend and design.txt (RLS testing sections)

## 6.1 Row-Level Security Testing

**Pattern 21: RLS Policy Test (SQL)**
```sql
-- tests/rls/users.test.sql
-- Source: Extracted from backend file - RLS testing patterns

-- Test 1: Users can only read their own data
BEGIN;

-- Set user context
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-123"}';

-- Query should only return user's own data
SELECT * FROM users WHERE id = 'user-123'; -- ✓ Should return 1 row
SELECT * FROM users WHERE id = 'user-456'; -- ✓ Should return 0 rows
SELECT * FROM users; -- ✓ Should return only user-123

ROLLBACK;

-- Test 2: Users cannot update other users' data
BEGIN;

SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-123"}';

-- Should succeed (own data)
UPDATE users SET name = 'New Name' WHERE id = 'user-123';
-- Verify: 1 row affected

-- Should fail (other user's data)
UPDATE users SET name = 'Hacked' WHERE id = 'user-456';
-- Verify: 0 rows affected

ROLLBACK;

-- Test 3: Admin role can access all data
BEGIN;

SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "admin-123", "role": "admin"}';

-- Should return all users
SELECT COUNT(*) FROM users; -- Should return total count
UPDATE users SET verified = true WHERE id = 'user-456'; -- Should succeed

ROLLBACK;
```

**Pattern 22: RLS Testing with Node.js**
```typescript
// tests/rls/rls-policies.test.ts
// Source: Extracted from backend file

import { createClient } from '@supabase/supabase-js'
import { describe, it, expect, beforeEach } from 'vitest'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Service role client (bypasses RLS)
const adminClient = createClient(supabaseUrl, supabaseServiceKey)

describe('RLS Policies', () => {
  let user1Token: string
  let user2Token: string
  let user1Id: string
  let user2Id: string

  beforeEach(async () => {
    // Create test users
    const { data: user1 } = await adminClient.auth.admin.createUser({
      email: 'user1@example.com',
      password: 'password123',
      email_confirm: true,
    })
    user1Id = user1?.user.id!

    const { data: user2 } = await adminClient.auth.admin.createUser({
      email: 'user2@example.com',
      password: 'password123',
      email_confirm: true,
    })
    user2Id = user2?.user.id!

    // Get access tokens
    const { data: session1 } = await adminClient.auth.signInWithPassword({
      email: 'user1@example.com',
      password: 'password123',
    })
    user1Token = session1?.session?.access_token!

    const { data: session2 } = await adminClient.auth.signInWithPassword({
      email: 'user2@example.com',
      password: 'password123',
    })
    user2Token = session2?.session?.access_token!
  })

  it('user can only read their own projects', async () => {
    // Create client with user1 token (RLS applies)
    const user1Client = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY!, {
      global: {
        headers: {
          Authorization: `Bearer ${user1Token}`,
        },
      },
    })

    // Create projects for both users (using admin client)
    await adminClient.from('projects').insert([
      { name: 'User 1 Project', user_id: user1Id },
      { name: 'User 2 Project', user_id: user2Id },
    ])

    // User1 queries projects
    const { data, error } = await user1Client
      .from('projects')
      .select('*')

    expect(error).toBeNull()
    expect(data).toHaveLength(1) // Only sees own project
    expect(data![0].name).toBe('User 1 Project')
  })

  it('user cannot update other users projects', async () => {
    const user1Client = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY!, {
      global: {
        headers: {
          Authorization: `Bearer ${user1Token}`,
        },
      },
    })

    // Create project for user2
    const { data: project } = await adminClient
      .from('projects')
      .insert({ name: 'User 2 Project', user_id: user2Id })
      .select()
      .single()

    // User1 attempts to update user2's project
    const { data, error } = await user1Client
      .from('projects')
      .update({ name: 'Hacked' })
      .eq('id', project!.id)
      .select()

    expect(data).toHaveLength(0) // No rows affected
    // Verify project unchanged
    const { data: unchanged } = await adminClient
      .from('projects')
      .select('name')
      .eq('id', project!.id)
      .single()

    expect(unchanged!.name).toBe('User 2 Project')
  })
})
```

===========================================
SECTION 7: RATE LIMITING TESTING
===========================================

Source: Extracted from final claude code bachend and design.txt (rate limiting sections)

## 7.1 Rate Limit Testing

**Pattern 23: Rate Limit Test Suite**
```typescript
// lib/rate-limit/__tests__/rate-limit.test.ts
// Source: Extracted from backend file - rate limiting testing patterns

import { describe, it, expect, beforeEach } from 'vitest'
import { apiRateLimit, authRateLimit } from '@/lib/rate-limit'

describe('Rate Limiting', () => {
  beforeEach(async () => {
    // Clear Redis cache before each test
    // await redis.flushall()
  })

  it('should block after max requests', async () => {
    const identifier = 'test-user-1'

    // Make 100 requests (API limit)
    for (let i = 0; i < 100; i++) {
      const { success } = await apiRateLimit.limit(identifier)
      expect(success).toBe(true)
    }

    // 101st request should fail
    const { success, limit, remaining, reset } = await apiRateLimit.limit(identifier)

    expect(success).toBe(false)
    expect(remaining).toBe(0)
    expect(reset).toBeGreaterThan(Date.now())
  })

  it('should reset after window expires', async () => {
    const identifier = 'test-user-2'

    // Exhaust limit
    for (let i = 0; i < 100; i++) {
      await apiRateLimit.limit(identifier)
    }

    // Should be blocked
    const { success: blocked } = await apiRateLimit.limit(identifier)
    expect(blocked).toBe(false)

    // Wait for window to expire (1 minute + buffer)
    await new Promise(resolve => setTimeout(resolve, 61000))

    // Should succeed again
    const { success: allowed } = await apiRateLimit.limit(identifier)
    expect(allowed).toBe(true)
  }, 70000) // 70 second timeout

  it('auth rate limit is stricter than API limit', async () => {
    const identifier = 'test-user-3'

    // Make 5 requests (auth limit)
    for (let i = 0; i < 5; i++) {
      const { success } = await authRateLimit.limit(identifier)
      expect(success).toBe(true)
    }

    // 6th request should fail
    const { success } = await authRateLimit.limit(identifier)
    expect(success).toBe(false)
  })

  it('different identifiers have separate limits', async () => {
    // Exhaust user1's limit
    for (let i = 0; i < 100; i++) {
      await apiRateLimit.limit('user-1')
    }

    // User1 blocked
    const { success: user1 } = await apiRateLimit.limit('user-1')
    expect(user1).toBe(false)

    // User2 still allowed
    const { success: user2 } = await apiRateLimit.limit('user-2')
    expect(user2).toBe(true)
  })
})
```

**Pattern 24: Rate Limit Integration Test**
```typescript
// e2e/rate-limit/api.spec.ts
// Source: Rate limiting E2E testing

import { test, expect } from '@playwright/test'

test.describe('Rate Limiting', () => {
  test('API blocks after 100 requests', async ({ request }) => {
    const endpoint = '/api/users'

    // Make 100 successful requests
    for (let i = 0; i < 100; i++) {
      const response = await request.get(endpoint)
      expect(response.status()).toBe(200)
    }

    // 101st request should be rate limited
    const blockedResponse = await request.get(endpoint)
    expect(blockedResponse.status()).toBe(429)

    const data = await blockedResponse.json()
    expect(data.error).toContain('Rate limit exceeded')
  })

  test('rate limit headers are present', async ({ request }) => {
    const response = await request.get('/api/users')

    expect(response.headers()['x-ratelimit-limit']).toBeDefined()
    expect(response.headers()['x-ratelimit-remaining']).toBeDefined()
    expect(response.headers()['x-ratelimit-reset']).toBeDefined()
  })
})
```

===========================================
SECTION 8: MOCKING & FIXTURES
===========================================

Source: Modern testing best practices

## 8.1 Mock Service Worker (MSW)

**Pattern 25: MSW API Mocking**
```typescript
// mocks/handlers.ts
// Source: MSW API mocking patterns

import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock GET /api/users
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ])
  }),

  // Mock POST /api/users
  http.post('/api/users', async ({ request }) => {
    const body = await request.json()

    return HttpResponse.json(
      { id: '3', ...body },
      { status: 201 }
    )
  }),

  // Mock error response
  http.get('/api/users/:id', ({ params }) => {
    if (params.id === 'error') {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      id: params.id,
      name: 'Mock User',
      email: 'mock@example.com',
    })
  }),
]
```

**Pattern 26: MSW Setup**
```typescript
// mocks/server.ts

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// vitest.setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## 8.2 Test Fixtures

**Pattern 27: Reusable Test Data Fixtures**
```typescript
// tests/fixtures/users.ts

export const mockUsers = {
  admin: {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  user: {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    createdAt: new Date('2024-01-02'),
  },
  unverified: {
    id: '3',
    email: 'unverified@example.com',
    name: 'Unverified User',
    role: 'user',
    verified: false,
    createdAt: new Date('2024-01-03'),
  },
}

export const mockProjects = [
  {
    id: '1',
    name: 'Project Alpha',
    userId: mockUsers.admin.id,
    description: 'Test project',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Project Beta',
    userId: mockUsers.user.id,
    description: 'Another test project',
    createdAt: new Date('2024-01-02'),
  },
]
```

**Pattern 28: Factory Pattern for Test Data**
```typescript
// tests/factories/user.factory.ts

import { faker } from '@faker-js/faker'

export class UserFactory {
  static create(overrides?: Partial<User>): User {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      role: 'user',
      verified: true,
      createdAt: faker.date.past(),
      ...overrides,
    }
  }

  static createMany(count: number, overrides?: Partial<User>): User[] {
    return Array.from({ length: count }, () => this.create(overrides))
  }

  static createAdmin(overrides?: Partial<User>): User {
    return this.create({ role: 'admin', ...overrides })
  }
}

// Usage
const user = UserFactory.create()
const admin = UserFactory.createAdmin()
const users = UserFactory.createMany(10)
```

===========================================
SECTION 9: PERFORMANCE TESTING
===========================================

Source: Research-added (Core Web Vitals, load testing)

## 9.1 Core Web Vitals Testing

**Pattern 29: Lighthouse CI Integration**
```javascript
// lighthouserc.js
// Source: Lighthouse CI configuration

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/about',
        'http://localhost:3000/pricing',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

**Pattern 30: Playwright Performance Testing**
```typescript
// e2e/performance/vitals.spec.ts

import { test, expect } from '@playwright/test'

test.describe('Core Web Vitals', () => {
  test('homepage meets performance thresholds', async ({ page }) => {
    const metrics: any = {}

    // Collect performance metrics
    page.on('metrics', (metric) => {
      metrics[metric.name] = metric.value
    })

    await page.goto('/')

    // Get Web Vitals via Performance API
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const vitals: any = {}

          entries.forEach((entry: any) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.LCP = entry.renderTime || entry.loadTime
            }
            if (entry.entryType === 'layout-shift') {
              vitals.CLS = entry.value
            }
            if (entry.entryType === 'first-input') {
              vitals.FID = entry.processingStart - entry.startTime
            }
          })

          resolve(vitals)
        })

        observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift', 'first-input'] })

        // Resolve after 5 seconds if not all metrics collected
        setTimeout(() => resolve({}), 5000)
      })
    })

    // Assertions
    if (vitals.LCP) {
      expect(vitals.LCP).toBeLessThan(2500) // < 2.5s
    }

    if (vitals.CLS) {
      expect(vitals.CLS).toBeLessThan(0.1) // < 0.1
    }

    if (vitals.FID) {
      expect(vitals.FID).toBeLessThan(100) // < 100ms
    }
  })
})
```

## 9.2 Load Testing

**Pattern 31: k6 Load Testing Script**
```javascript
// tests/load/api-load.test.js
// Source: k6 load testing patterns

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const errorRate = new Rate('errors')

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '10s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
    errors: ['rate<0.1'],             // Custom error rate < 10%
  },
}

export default function () {
  // GET request
  const getRes = http.get('http://localhost:3000/api/users')

  check(getRes, {
    'GET status is 200': (r) => r.status === 200,
    'GET response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1)

  sleep(1)

  // POST request
  const payload = JSON.stringify({
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
  })

  const postRes = http.post('http://localhost:3000/api/users', payload, {
    headers: { 'Content-Type': 'application/json' },
  })

  check(postRes, {
    'POST status is 201': (r) => r.status === 201,
    'POST response has id': (r) => JSON.parse(r.body).id !== undefined,
  }) || errorRate.add(1)

  sleep(1)
}
```

===========================================
SECTION 10: CI/CD & TEST AUTOMATION
===========================================

Source: Modern DevOps testing practices

## 10.1 GitHub Actions Workflows

**Pattern 32: Complete Test Pipeline**
```yaml
# .github/workflows/test.yml
# Source: GitHub Actions testing best practices

name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests

  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  lighthouse:
    name: Lighthouse CI
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Pattern 33: Parallel Test Execution**
```yaml
# .github/workflows/parallel-tests.yml
# Source: Parallel test execution pattern

name: Parallel Tests

on: [push]

jobs:
  test:
    name: Test Shard ${{ matrix.shard }}
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests (shard ${{ matrix.shard }}/4)
        run: npm test -- --shard=${{ matrix.shard }}/4
```

===========================================
SECTION 11: API TESTING WITH SECURITY FOCUS
===========================================

Source: agency-agents/testing/testing-api-tester.md

## 11.1 Security-First API Testing

**Pattern 34: Comprehensive API Security Test Suite**
```typescript
// tests/api/security-api-tests.ts
// Source: testing-api-tester.md

describe('User API Comprehensive Testing', () => {
  let authToken: string
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3000'

  beforeAll(async () => {
    const response = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'secure_password' })
    })
    authToken = (await response.json()).token
  })

  describe('Security Testing', () => {
    test('should reject requests without authentication', async () => {
      const response = await fetch(`${baseURL}/users`, { method: 'GET' })
      expect(response.status).toBe(401)
    })

    test('should prevent SQL injection attempts', async () => {
      const sqlInjection = "'; DROP TABLE users; --"
      const response = await fetch(`${baseURL}/users?search=${encodeURIComponent(sqlInjection)}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      expect(response.status).not.toBe(500)
    })

    test('should enforce rate limiting', async () => {
      const requests = Array(100).fill(null).map(() =>
        fetch(`${baseURL}/users`, { headers: { 'Authorization': `Bearer ${authToken}` } })
      )
      const responses = await Promise.all(requests)
      expect(responses.some(r => r.status === 429)).toBe(true)
    })
  })

  describe('Performance Testing', () => {
    test('should respond within 200ms SLA', async () => {
      const start = performance.now()
      await fetch(`${baseURL}/users`, { headers: { 'Authorization': `Bearer ${authToken}` } })
      expect(performance.now() - start).toBeLessThan(200)
    })
  })
})
```

**Pattern 35: OWASP API Security Top 10 Tests**
```typescript
// tests/api/owasp-api-security.test.ts
describe('OWASP API Security Top 10', () => {
  // API1:2023 - Broken Object Level Authorization
  test('API1: prevent BOLA attacks', async () => {
    const userAToken = await getTokenForUser('userA')
    const response = await fetch(`${baseURL}/resources/user-b-resource`, {
      headers: { 'Authorization': `Bearer ${userAToken}` }
    })
    expect(response.status).toBe(403)
  })

  // API3:2023 - Broken Object Property Level Authorization
  test('API3: should not expose sensitive properties', async () => {
    const response = await fetch(`${baseURL}/users/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    const user = await response.json()
    expect(user.password).toBeUndefined()
    expect(user.passwordHash).toBeUndefined()
  })

  // API4:2023 - Unrestricted Resource Consumption
  test('API4: should limit resource consumption', async () => {
    const response = await fetch(`${baseURL}/users?limit=10000`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    const data = await response.json()
    expect(data.items.length).toBeLessThanOrEqual(100)
  })
})
```

===========================================
SECTION 12: VISUAL EVIDENCE COLLECTION
===========================================

Source: agency-agents/testing/testing-evidence-collector.md

## 12.1 Screenshot-Based QA

**Pattern 36: Playwright Visual Evidence Capture**
```typescript
// tests/visual-evidence/capture.test.ts
import { test } from '@playwright/test'

test.describe('Visual Evidence Collection', () => {
  test('capture responsive layouts', async ({ page }, testInfo) => {
    await page.goto('/')
    await page.screenshot({
      path: `qa-screenshots/responsive-${testInfo.project.name.toLowerCase()}.png`,
      fullPage: true
    })
  })

  test('capture dark mode', async ({ page }) => {
    await page.goto('/')
    await page.screenshot({ path: 'qa-screenshots/light-mode.png' })
    await page.click('[data-testid="theme-toggle"]')
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'qa-screenshots/dark-mode.png' })
  })

  test('capture interactive elements', async ({ page }) => {
    await page.goto('/')
    const accordion = page.locator('[data-testid="accordion-0"]')
    await accordion.screenshot({ path: 'qa-screenshots/accordion-before.png' })
    await accordion.click()
    await page.waitForTimeout(300)
    await accordion.screenshot({ path: 'qa-screenshots/accordion-after.png' })
  })
})
```

**Pattern 37: Evidence-Based QA Report**
```typescript
// lib/qa-report.ts
interface QAReport {
  screenshots: string[]
  issues: Array<{ description: string; evidence: string; priority: 'Critical' | 'Medium' | 'Low' }>
  rating: string
  productionReady: boolean
}

export function generateQAReport(data: QAReport): string {
  return `# QA Evidence-Based Report
## Screenshots: ${data.screenshots.length} captured
## Issues Found: ${data.issues.length}
${data.issues.map((i, idx) => `${idx + 1}. [${i.priority}] ${i.description} - Evidence: ${i.evidence}`).join('\n')}
## Rating: ${data.rating}
## Production Ready: ${data.productionReady ? 'YES' : 'NO - NEEDS WORK'}`
}
```

===========================================
SECTION 13: PERFORMANCE BENCHMARKING
===========================================

Source: agency-agents/testing/testing-performance-benchmarker.md

## 13.1 k6 Load Testing

**Pattern 38: Advanced k6 Load Test**
```javascript
// tests/performance/load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

const errorRate = new Rate('errors')
const responseTime = new Trend('response_time')

export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '3m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
}

export default function () {
  const res = http.get(`${__ENV.BASE_URL}/api/users`)
  check(res, {
    'status 200': (r) => r.status === 200,
    'response < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1)
  responseTime.add(res.timings.duration)
  sleep(1)
}
```

**Pattern 39: Core Web Vitals Testing**
```typescript
// lib/web-vitals.ts
export function initWebVitals(report: (metrics: any) => void) {
  new PerformanceObserver((list) => {
    const lcp = list.getEntries().pop()
    report({ lcp: lcp?.startTime })
  }).observe({ type: 'largest-contentful-paint', buffered: true })

  let cls = 0
  new PerformanceObserver((list) => {
    list.getEntries().forEach((e: any) => { if (!e.hadRecentInput) cls += e.value })
    report({ cls })
  }).observe({ type: 'layout-shift', buffered: true })
}
```

===========================================
SECTION 14: TEST RESULTS ANALYSIS
===========================================

Source: agency-agents/testing/testing-test-results-analyzer.md

## 14.1 Statistical Analysis

**Pattern 40: Python Test Analyzer**
```python
# tests/analysis/analyzer.py
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

class TestResultsAnalyzer:
    def __init__(self, results_path):
        self.results = pd.read_json(results_path)

    def analyze_coverage(self):
        return {
            'line': self.results['coverage']['lines']['pct'],
            'branch': self.results['coverage']['branches']['pct'],
            'gaps': [f for f, c in self.results['coverage']['files'].items() if c['lines']['pct'] < 80]
        }

    def predict_defects(self, features):
        model = RandomForestClassifier(n_estimators=100)
        # Train on historical data and predict defect-prone areas
        return model.predict_proba(features)[:, 1]

    def assess_release_readiness(self):
        criteria = {
            'pass_rate': self.results['numPassedTests'] / self.results['numTotalTests'] >= 0.99,
            'coverage': self.results['coverage']['lines']['pct'] >= 80,
            'no_critical': len([f for f in self.results.get('failures', []) if 'critical' in f.get('tags', [])]) == 0
        }
        return {'ready': all(criteria.values()), 'criteria': criteria}
```

**Pattern 41: Release Readiness Report**
```typescript
// lib/release-readiness.ts
export function generateReleaseReport(tests: any, coverage: any, perf: any) {
  const criteria = {
    testPassRate: tests.passRate >= 0.99,
    codeCoverage: coverage.total >= 80,
    performanceSLA: perf.p95 < 500,
    noFlakiness: tests.flakyRate < 0.02
  }
  return {
    ready: Object.values(criteria).every(Boolean),
    recommendation: Object.values(criteria).every(Boolean) ? 'GO' : 'NO-GO',
    blockers: Object.entries(criteria).filter(([_, v]) => !v).map(([k]) => k)
  }
}
```

===========================================
SECTION 15: TOOL EVALUATION & WORKFLOW
===========================================

Source: agency-agents/testing/testing-tool-evaluator.md + testing-workflow-optimizer.md

## 15.1 Tool Evaluation

**Pattern 42: Testing Tool Scorer**
```typescript
// lib/tool-evaluator.ts
const CRITERIA = [
  { name: 'functionality', weight: 0.25 },
  { name: 'usability', weight: 0.20 },
  { name: 'performance', weight: 0.15 },
  { name: 'security', weight: 0.15 },
  { name: 'integration', weight: 0.10 },
  { name: 'support', weight: 0.08 },
  { name: 'cost', weight: 0.07 }
]

export function evaluateTool(scores: Record<string, number>) {
  return CRITERIA.reduce((sum, c) => sum + (scores[c.name] || 0) * c.weight, 0)
}

export function compareToos(tools: Array<{ name: string; scores: Record<string, number> }>) {
  return tools
    .map(t => ({ name: t.name, score: evaluateTool(t.scores) }))
    .sort((a, b) => b.score - a.score)
}
```

## 15.2 Workflow Optimization

**Pattern 43: Process Optimizer**
```typescript
// lib/workflow-optimizer.ts
interface ProcessStep {
  name: string
  duration: number
  errorRate: number
  automationPotential: number
}

export function analyzeWorkflow(steps: ProcessStep[]) {
  return {
    totalDuration: steps.reduce((s, step) => s + step.duration, 0),
    bottlenecks: steps.filter(s => s.duration > 30),
    automationCandidates: steps.filter(s => s.automationPotential > 0.7),
    errorHotspots: steps.filter(s => s.errorRate > 0.05)
  }
}
```

===========================================
SECTION 16: REALITY CHECKING
===========================================

Source: agency-agents/testing/testing-reality-checker.md

## 16.1 Fantasy Approval Prevention

**Pattern 44: Reality Checker**
```typescript
// lib/reality-checker.ts
const FANTASY_INDICATORS = [
  { pattern: /zero issues found/i, message: 'Zero issues is unrealistic' },
  { pattern: /100%|98%|99%/i, message: 'Perfect scores are fantasy' },
  { pattern: /A\+|perfect/i, message: 'A+ without evidence is fantasy' }
]

export function checkForFantasy(report: string): string[] {
  return FANTASY_INDICATORS
    .filter(i => i.pattern.test(report))
    .map(i => i.message)
}

export function assessQuality(metrics: { issues: number; criticalIssues: number; compliance: number }) {
  if (metrics.issues === 0) return { rating: 'INVALID', ready: false, reason: 'Zero issues is unrealistic' }
  if (metrics.criticalIssues > 0) return { rating: 'FAILED', ready: false, reason: 'Critical issues exist' }
  if (metrics.compliance < 0.9) return { rating: 'NEEDS WORK', ready: false, reason: 'Spec not fully implemented' }
  if (metrics.issues <= 3) return { rating: 'B+', ready: true, reason: 'Good with minor issues' }
  return { rating: 'B-', ready: false, reason: 'Several issues need attention' }
}
```

===========================================
SECTION 17: HANDOFF & ACTIVATION
===========================================

## 17.1 Handoff Sections

### From Security Specialist
```
Handoff Context:
- Security Hardening: [List of measures]
- Attack Vectors to Test: [Vulnerability list]
Your Mission: Create security test suite
```

### From Backend Specialist
```
Handoff Context:
- API Endpoints: [Contracts]
- Database Schema: [Tables]
Your Mission: Create API + integration tests
```

### From Frontend Specialist
```
Handoff Context:
- Components: [List]
- User Flows: [Critical paths]
Your Mission: Create E2E + a11y tests
```

### To Deployment
```
Handoff Context:
- Tests: [All passing]
- Coverage: [Percentages]
- Performance: [Benchmarks]
Status: READY FOR DEPLOYMENT
```

## 17.2 Activation Triggers

- "Set up testing for this project"
- "Create test suite for..."
- "Test this API/component"
- "Add E2E tests"
- "Check test coverage"
- "Performance test this"
- "Accessibility test"
- "Analyze test results"

## 17.3 Success Metrics

| Metric | Target |
|--------|--------|
| Pass Rate | >99% |
| Coverage | >80% |
| E2E Flakiness | <2% |
| Test Time | <10min |
| Defect Escape | <1% |

===========================================
SECTION 18: AI/LLM EVALUATION FRAMEWORKS
===========================================

Source: Research (LLM evaluation best practices, prompt testing methodologies)

## 18.1 Prompt Quality Evaluation

**Pattern 45: LLM-as-Judge Evaluation**
```python
# Use a separate LLM to evaluate prompt output quality
import anthropic

client = anthropic.Anthropic()

def llm_judge(prompt_output: str, expected: str, criteria: list[str]) -> dict:
    """Evaluate prompt output using LLM-as-Judge pattern"""
    judge_prompt = f"""
    You are an expert evaluator. Score the following output against criteria.

    OUTPUT TO EVALUATE:
    {prompt_output}

    EXPECTED/REFERENCE:
    {expected}

    CRITERIA (score each 1-5):
    {chr(10).join(f'- {c}' for c in criteria)}

    Respond in JSON format:
    {{
      "scores": {{"criterion": score}},
      "overall": score,
      "reasoning": "brief explanation",
      "pass": true/false
    }}
    """

    message = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=1024,
        messages=[
            {"role": "user", "content": judge_prompt},
            {"role": "assistant", "content": '{"scores":'}  # Prefill for JSON
        ]
    )

    import json
    return json.loads('{"scores":' + message.content[0].text)


# Usage for prompt evaluation
results = llm_judge(
    prompt_output="The quarterly revenue increased by 15% to $2.3M...",
    expected="Accurate financial summary with specific numbers",
    criteria=[
        "accuracy: Are all numbers correct?",
        "completeness: Are all key metrics covered?",
        "clarity: Is the summary easy to understand?",
        "tone: Is the tone appropriate for business context?",
        "conciseness: Is it appropriately brief?"
    ]
)
```

**Pattern 46: Rubric-Based Evaluation**
```python
# Structured rubric for consistent evaluation
PROMPT_EVALUATION_RUBRIC = {
    "instruction_following": {
        5: "Perfectly follows all instructions, including edge cases",
        4: "Follows all main instructions, minor deviations",
        3: "Follows most instructions, misses some requirements",
        2: "Partially follows instructions, significant gaps",
        1: "Does not follow instructions"
    },
    "output_format": {
        5: "Exactly matches required format, machine-parseable",
        4: "Correct format with minor formatting issues",
        3: "Generally correct but some structural issues",
        2: "Partially correct format",
        1: "Wrong format entirely"
    },
    "factual_accuracy": {
        5: "All claims verifiable and correct",
        4: "Minor inaccuracies that don't affect meaning",
        3: "Some factual errors present",
        2: "Multiple factual errors",
        1: "Predominantly incorrect"
    },
    "safety_compliance": {
        5: "No policy violations, handles edge cases",
        4: "No violations, but could be more robust",
        3: "Minor policy concerns",
        2: "Clear policy violations",
        1: "Dangerous or harmful output"
    }
}

def evaluate_with_rubric(output: str, rubric: dict) -> dict:
    """Score output against each rubric dimension"""
    scores = {}
    for dimension, levels in rubric.items():
        score = llm_judge_single_dimension(output, dimension, levels)
        scores[dimension] = score

    overall = sum(scores.values()) / len(scores)
    return {
        "scores": scores,
        "overall": round(overall, 2),
        "pass": overall >= 3.5,
        "grade": "A" if overall >= 4.5 else "B" if overall >= 3.5 else "C" if overall >= 2.5 else "F"
    }
```

**Pattern 47: A/B Testing for Prompts**
```python
# Statistical comparison of prompt variants
from scipy import stats
import numpy as np

def ab_test_prompts(
    prompt_a: str,
    prompt_b: str,
    test_cases: list[dict],
    evaluator: callable,
    confidence_level: float = 0.95
) -> dict:
    """Run A/B test between two prompt variants"""

    scores_a = []
    scores_b = []

    for case in test_cases:
        output_a = run_prompt(prompt_a, case['input'])
        output_b = run_prompt(prompt_b, case['input'])

        score_a = evaluator(output_a, case['expected'])
        score_b = evaluator(output_b, case['expected'])

        scores_a.append(score_a)
        scores_b.append(score_b)

    # Welch's t-test (unequal variances)
    t_stat, p_value = stats.ttest_ind(scores_a, scores_b, equal_var=False)

    mean_a = np.mean(scores_a)
    mean_b = np.mean(scores_b)

    return {
        "prompt_a": {"mean": mean_a, "std": np.std(scores_a), "n": len(scores_a)},
        "prompt_b": {"mean": mean_b, "std": np.std(scores_b), "n": len(scores_b)},
        "t_statistic": t_stat,
        "p_value": p_value,
        "significant": p_value < (1 - confidence_level),
        "winner": "A" if mean_a > mean_b else "B" if mean_b > mean_a else "TIE",
        "effect_size": abs(mean_a - mean_b) / np.sqrt((np.var(scores_a) + np.var(scores_b)) / 2)
    }
```

**Pattern 48: Regression Testing Suite**
```python
# Ensure prompt changes don't break existing behavior
class PromptRegressionSuite:
    def __init__(self, golden_file: str):
        self.golden = self.load_golden(golden_file)

    def load_golden(self, path: str) -> list[dict]:
        """Load golden test cases with known-good outputs"""
        import json
        with open(path) as f:
            return json.load(f)

    def run_regression(self, prompt: str, threshold: float = 0.90) -> dict:
        """Run all golden cases against new prompt version"""
        results = []
        for case in self.golden:
            output = run_prompt(prompt, case['input'])
            similarity = semantic_similarity(output, case['golden_output'])

            results.append({
                'case_id': case['id'],
                'similarity': similarity,
                'pass': similarity >= threshold,
                'input': case['input'][:100],
                'expected_snippet': case['golden_output'][:100],
                'actual_snippet': output[:100]
            })

        passed = sum(1 for r in results if r['pass'])
        total = len(results)

        return {
            'passed': passed,
            'total': total,
            'pass_rate': passed / total,
            'regression_detected': passed / total < 0.95,
            'failures': [r for r in results if not r['pass']]
        }
```

===========================================
SECTION 19: SECURITY TESTING PATTERNS
===========================================

Source: OWASP Testing Guide, Production Security Patterns

## 19.1 OWASP Top 10 Testing

**Pattern 49: SQL Injection Testing**
```typescript
// Automated SQL injection test suite
import { test, expect } from '@playwright/test'

const SQL_INJECTION_PAYLOADS = [
  "' OR '1'='1",
  "'; DROP TABLE users; --",
  "' UNION SELECT * FROM users --",
  "1' AND 1=1 --",
  "admin'--",
  "' OR 1=1 LIMIT 1 --",
  "1; EXEC xp_cmdshell('dir') --",
  "' OR ''='",
  "1' ORDER BY 1 --",
  "' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT @@version))) --"
]

test.describe('SQL Injection Prevention', () => {
  for (const payload of SQL_INJECTION_PAYLOADS) {
    test(`blocks injection: ${payload.substring(0, 30)}...`, async ({ request }) => {
      // Test login endpoint
      const response = await request.post('/api/auth/login', {
        data: { email: payload, password: payload }
      })

      // Should NOT return 200 with data
      const body = await response.json()
      expect(body.users).toBeUndefined()
      expect(body.error).toBeDefined()

      // Should NOT leak database errors
      const text = JSON.stringify(body)
      expect(text).not.toContain('SQL')
      expect(text).not.toContain('syntax error')
      expect(text).not.toContain('ORA-')
      expect(text).not.toContain('mysql')
    })
  }
})
```

**Pattern 50: XSS Prevention Testing**
```typescript
const XSS_PAYLOADS = [
  '<script>alert("xss")</script>',
  '<img src=x onerror=alert("xss")>',
  '"><script>alert(document.cookie)</script>',
  "javascript:alert('xss')",
  '<svg onload=alert("xss")>',
  '{{constructor.constructor("return this")().alert("xss")}}',
  '<iframe src="javascript:alert(1)">',
  '<details open ontoggle=alert("xss")>',
  '<math><mtext><table><mglyph><style><!--</style><img src=x onerror=alert("xss")>',
  "'-alert('xss')-'"
]

test.describe('XSS Prevention', () => {
  for (const payload of XSS_PAYLOADS) {
    test(`sanitizes: ${payload.substring(0, 30)}...`, async ({ page }) => {
      // Submit payload through user input
      await page.goto('/profile/edit')
      await page.fill('[name="displayName"]', payload)
      await page.click('[type="submit"]')

      // Navigate to where input is rendered
      await page.goto('/profile')

      // Check that payload is escaped, not executed
      const content = await page.content()
      expect(content).not.toContain('<script>')
      expect(content).not.toContain('onerror=')
      expect(content).not.toContain('javascript:')

      // Verify no alert dialogs
      let alertFired = false
      page.on('dialog', () => { alertFired = true })
      await page.waitForTimeout(1000)
      expect(alertFired).toBe(false)
    })
  }
})
```

**Pattern 51: CSRF Protection Testing**
```typescript
test.describe('CSRF Protection', () => {
  test('rejects requests without CSRF token', async ({ request }) => {
    const response = await request.post('/api/user/update', {
      data: { name: 'hacked' },
      headers: {
        'Content-Type': 'application/json'
        // Deliberately omitting CSRF token
      }
    })
    expect(response.status()).toBe(403)
  })

  test('rejects requests with invalid CSRF token', async ({ request }) => {
    const response = await request.post('/api/user/update', {
      data: { name: 'hacked' },
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'invalid-token-value'
      }
    })
    expect(response.status()).toBe(403)
  })

  test('accepts requests with valid CSRF token', async ({ request }) => {
    // First get a valid token
    const tokenResponse = await request.get('/api/csrf-token')
    const { token } = await tokenResponse.json()

    const response = await request.post('/api/user/update', {
      data: { name: 'legitimate' },
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      }
    })
    expect(response.status()).toBe(200)
  })
})
```

**Pattern 52: Authentication & Authorization Testing**
```typescript
test.describe('Authentication Security', () => {
  test('rate limits login attempts', async ({ request }) => {
    // Attempt 10 rapid logins
    const responses = []
    for (let i = 0; i < 10; i++) {
      const res = await request.post('/api/auth/login', {
        data: { email: 'test@test.com', password: `wrong${i}` }
      })
      responses.push(res.status())
    }

    // Should get rate limited (429) after threshold
    expect(responses).toContain(429)
  })

  test('password reset token expires', async ({ request }) => {
    // Request reset token
    await request.post('/api/auth/forgot-password', {
      data: { email: 'user@test.com' }
    })

    // Simulate expired token (use a known expired one from test setup)
    const response = await request.post('/api/auth/reset-password', {
      data: {
        token: 'expired-test-token',
        newPassword: 'NewSecureP@ss1'
      }
    })
    expect(response.status()).toBe(400)
  })

  test('protected routes reject unauthenticated requests', async ({ request }) => {
    const protectedEndpoints = [
      '/api/user/profile',
      '/api/admin/users',
      '/api/billing/invoices',
      '/api/settings/team'
    ]

    for (const endpoint of protectedEndpoints) {
      const response = await request.get(endpoint)
      expect(response.status()).toBe(401)
    }
  })

  test('regular user cannot access admin endpoints', async ({ request }) => {
    // Login as regular user
    const loginRes = await request.post('/api/auth/login', {
      data: { email: 'user@test.com', password: 'password123' }
    })
    const { token } = await loginRes.json()

    const adminEndpoints = [
      '/api/admin/users',
      '/api/admin/settings',
      '/api/admin/billing'
    ]

    for (const endpoint of adminEndpoints) {
      const response = await request.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      })
      expect(response.status()).toBe(403)
    }
  })
})
```

**Pattern 53: Header Security Testing**
```typescript
test.describe('Security Headers', () => {
  test('response includes all security headers', async ({ request }) => {
    const response = await request.get('/')
    const headers = response.headers()

    // Required security headers
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-frame-options']).toMatch(/DENY|SAMEORIGIN/)
    expect(headers['x-xss-protection']).toBe('1; mode=block')
    expect(headers['strict-transport-security']).toContain('max-age=')
    expect(headers['referrer-policy']).toBeDefined()
    expect(headers['content-security-policy']).toBeDefined()

    // Should NOT expose server info
    expect(headers['x-powered-by']).toBeUndefined()
    expect(headers['server']).not.toContain('Express')
  })

  test('CSP blocks inline scripts', async ({ page }) => {
    await page.goto('/')

    const cspViolations: string[] = []
    page.on('console', msg => {
      if (msg.text().includes('Content Security Policy')) {
        cspViolations.push(msg.text())
      }
    })

    // Attempt to inject inline script
    await page.evaluate(() => {
      const script = document.createElement('script')
      script.textContent = 'window.__injected = true'
      document.body.appendChild(script)
    })

    const injected = await page.evaluate(() => (window as any).__injected)
    expect(injected).toBeUndefined()
  })
})
```

===========================================
SECTION 20: PERFORMANCE TESTING PATTERNS
===========================================

Source: Research (k6, Lighthouse CI, Core Web Vitals)

## 20.1 Load & Stress Testing

**Pattern 54: k6 Load Test Suite**
```javascript
// k6 load test script
import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

const errorRate = new Rate('errors')
const apiDuration = new Trend('api_duration')

export const options = {
  stages: [
    { duration: '1m', target: 50 },    // Ramp up to 50 users
    { duration: '3m', target: 50 },    // Hold at 50 users
    { duration: '1m', target: 200 },   // Spike to 200 users
    { duration: '2m', target: 200 },   // Hold spike
    { duration: '1m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],  // 95th < 500ms
    errors: ['rate<0.01'],                            // < 1% error rate
    api_duration: ['p(95)<300'],                      // API calls < 300ms
  },
}

export default function () {
  // Simulate real user journey
  const loginRes = http.post('http://localhost:3000/api/auth/login',
    JSON.stringify({ email: 'loadtest@test.com', password: 'test123' }),
    { headers: { 'Content-Type': 'application/json' } }
  )

  check(loginRes, {
    'login succeeds': (r) => r.status === 200,
    'login < 500ms': (r) => r.timings.duration < 500,
  })

  const token = JSON.parse(loginRes.body).token
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  // Dashboard load
  const dashRes = http.get('http://localhost:3000/api/dashboard', authHeaders)
  apiDuration.add(dashRes.timings.duration)

  check(dashRes, {
    'dashboard loads': (r) => r.status === 200,
    'dashboard < 300ms': (r) => r.timings.duration < 300,
    'has data': (r) => JSON.parse(r.body).data !== undefined,
  })

  errorRate.add(dashRes.status !== 200)

  sleep(Math.random() * 3 + 1)  // Think time: 1-4 seconds
}
```

**Pattern 55: Lighthouse CI Integration**
```yaml
# lighthouserc.yml
ci:
  collect:
    url:
      - http://localhost:3000
      - http://localhost:3000/dashboard
      - http://localhost:3000/settings
    numberOfRuns: 3
    settings:
      preset: desktop
      chromeFlags: '--no-sandbox'

  assert:
    assertions:
      # Core Web Vitals
      'largest-contentful-paint':
        - error
        - maxNumericValue: 2500    # LCP < 2.5s
      'cumulative-layout-shift':
        - error
        - maxNumericValue: 0.1     # CLS < 0.1
      'interactive':
        - error
        - maxNumericValue: 3800    # TTI < 3.8s

      # Performance scores
      'categories:performance':
        - error
        - minScore: 0.9            # Performance > 90
      'categories:accessibility':
        - error
        - minScore: 0.95           # Accessibility > 95
      'categories:best-practices':
        - warn
        - minScore: 0.9            # Best Practices > 90

      # Specific audits
      'first-contentful-paint':
        - warn
        - maxNumericValue: 1800    # FCP < 1.8s
      'total-byte-weight':
        - warn
        - maxNumericValue: 500000  # Total < 500KB
      'uses-text-compression':
        - error
        - minScore: 1              # Must use gzip/brotli

  upload:
    target: temporary-public-storage
```

**Pattern 56: Core Web Vitals Monitoring**
```typescript
// Real User Monitoring (RUM) for Core Web Vitals
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals'

interface VitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
}

const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
}

function reportVital(metric: VitalMetric) {
  // Send to analytics endpoint
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    url: window.location.pathname,
    timestamp: Date.now(),
    connection: (navigator as any).connection?.effectiveType,
    deviceMemory: (navigator as any).deviceMemory,
  })

  // Use sendBeacon for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body)
  } else {
    fetch('/api/analytics/vitals', { method: 'POST', body, keepalive: true })
  }
}

// Initialize monitoring
onLCP(reportVital)
onINP(reportVital)
onCLS(reportVital)
onFCP(reportVital)
onTTFB(reportVital)
```

**Pattern 57: Database Query Performance Testing**
```typescript
// Test that database queries stay within performance budgets
import { describe, it, expect } from 'vitest'
import { db } from '@/lib/database'

describe('Database Performance', () => {
  it('dashboard query < 100ms', async () => {
    const start = performance.now()
    await db.query(`
      SELECT u.id, u.name,
        COUNT(DISTINCT p.id) as project_count,
        COUNT(DISTINCT t.id) as task_count
      FROM users u
      LEFT JOIN projects p ON p.user_id = u.id
      LEFT JOIN tasks t ON t.project_id = p.id
      WHERE u.id = $1
      GROUP BY u.id, u.name
    `, ['test-user-id'])
    const duration = performance.now() - start

    expect(duration).toBeLessThan(100)
  })

  it('list query uses index (no seq scan)', async () => {
    const explain = await db.query(`
      EXPLAIN (FORMAT JSON)
      SELECT * FROM tasks
      WHERE project_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, ['test-project-id'])

    const plan = explain.rows[0]['QUERY PLAN'][0]['Plan']
    expect(plan['Node Type']).not.toBe('Seq Scan')
  })

  it('handles 10K rows without timeout', async () => {
    const start = performance.now()
    const result = await db.query(`
      SELECT * FROM audit_log
      WHERE created_at > NOW() - INTERVAL '30 days'
      ORDER BY created_at DESC
      LIMIT 10000
    `)
    const duration = performance.now() - start

    expect(result.rows.length).toBeLessThanOrEqual(10000)
    expect(duration).toBeLessThan(2000)  // 2 second budget
  })
})
```

===========================================
SECTION 21: SYSTEMATIC DEBUGGING METHODOLOGY
===========================================

Source: Systematic Debugging skill (obra). Fills complete gap — agent had zero debugging methodology.
Core principle: ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

## 21.1 Phase 1: Root Cause Investigation

**Pattern 58: Root Cause Investigation**

BEFORE attempting ANY fix, complete all five steps:

```
STEP 1: READ ERROR MESSAGES CAREFULLY
─────────────────────────────────────
- Don't skip past errors or warnings — they often contain the exact solution
- Read stack traces completely
- Note line numbers, file paths, error codes
- Read the FULL message, not just the first line

STEP 2: REPRODUCE CONSISTENTLY
──────────────────────────────
- Can you trigger it reliably?
- What are the EXACT steps?
- Does it happen every time?
- If not reproducible → gather more data, don't guess

STEP 3: CHECK RECENT CHANGES
────────────────────────────
- git diff — what changed?
- Recent commits, new dependencies, config changes
- Environmental differences (CI vs local, Node version, OS)

STEP 4: GATHER EVIDENCE AT COMPONENT BOUNDARIES
───────────────────────────────────────────────
For multi-component systems (API → service → database, CI → build → deploy):
```

```typescript
// Add diagnostic logging at EACH component boundary BEFORE proposing fixes

// Example: API request failing somewhere in the chain
async function debugRequestFlow(userId: string) {
  // Layer 1: API Gateway
  console.log('=== Gateway ===')
  console.log('Request received:', { userId, timestamp: Date.now() })

  // Layer 2: Auth middleware
  console.log('=== Auth ===')
  const token = getAuthToken()
  console.log('Token present:', !!token, 'Expired:', isExpired(token))

  // Layer 3: Service call
  console.log('=== Service ===')
  const response = await callService(userId)
  console.log('Service response:', { status: response.status, hasBody: !!response.body })

  // Layer 4: Database
  console.log('=== Database ===')
  const dbResult = await db.query('SELECT * FROM users WHERE id = $1', [userId])
  console.log('DB rows:', dbResult.rowCount, 'Query time:', dbResult.duration)

  // Run ONCE → evidence shows WHERE it breaks → investigate THAT component
}
```

```
STEP 5: TRACE DATA FLOW BACKWARD
────────────────────────────────
- Where does the bad value originate?
- What called this function with the bad value?
- Keep tracing UP the call stack until you find the source
- Fix at SOURCE, not at symptom
```

## 21.2 Phase 2: Pattern Analysis

**Pattern 59: Working vs Broken Comparison**

```typescript
// TECHNIQUE: Find working code, compare systematically against broken code

// Step 1: Locate similar WORKING code in the same codebase
// Example: UserList works fine but ProductList throws errors

// Step 2: List EVERY difference, however small
/*
 * WORKING (UserList)                    | BROKEN (ProductList)
 * ─────────────────────────────────────|──────────────────────────────
 * uses `useSWR('/api/users', fetcher)` | uses `fetch('/api/products')`
 * error boundary wraps component       | no error boundary
 * key={user.id} on list items          | key={index} on list items
 * null check before render             | no null check
 */

// Step 3: Don't assume "that can't matter" — test each difference

// Step 4: Check dependencies and assumptions
// - What config does working code rely on?
// - What environment variables?
// - What order of initialization?
// - What data shape does it assume?

// If implementing a PATTERN (e.g. from docs):
// - Read the reference implementation COMPLETELY — don't skim
// - Understand every line before adapting
// - Partial understanding guarantees bugs
```

## 21.3 Phase 3: Hypothesis & Testing

**Pattern 60: Scientific Debugging**

```
HYPOTHESIS FORMATION
────────────────────
1. State clearly: "I think [X] is the root cause because [Y evidence]"
2. Write it down — vague theories lead to vague fixes
3. Be specific: "Auth token expires during long uploads because
   the refresh timer doesn't account for upload duration"

MINIMAL TESTING
───────────────
1. Make the SMALLEST possible change to test the hypothesis
2. ONE variable at a time — never change multiple things
3. If it worked → move to Phase 4
4. If it didn't → form NEW hypothesis from the evidence
5. DON'T stack fixes on top of each other

WHEN YOU DON'T KNOW
────────────────────
- Say "I don't understand X" — don't pretend
- Research more, ask for help
- An honest "I don't know" is better than a confident wrong fix
```

```typescript
// Example: Hypothesis-driven debugging

// HYPOTHESIS: "List renders blank because API returns empty array
// when userId is undefined during SSR"

// MINIMAL TEST: Add a single guard and log
function ProductList({ userId }: { userId?: string }) {
  // TEST: Is userId actually undefined?
  console.log('[DEBUG] ProductList userId:', userId, typeof userId)

  const { data } = useSWR(
    userId ? `/api/products?user=${userId}` : null, // Guard against undefined
    fetcher
  )

  console.log('[DEBUG] SWR data:', data?.length, 'items')

  if (!data) return <Skeleton />
  return <List items={data} />
}
// Run → check logs → confirm or reject hypothesis → remove debug logs
```

## 21.4 Phase 4: Fix Implementation

**Pattern 61: Root Cause Fix Protocol**

```
FIX IMPLEMENTATION RULES
─────────────────────────
1. CREATE FAILING TEST FIRST
   - Simplest possible reproduction
   - Automated test preferred (unit, integration, or e2e)
   - MUST exist before writing the fix

2. IMPLEMENT SINGLE FIX
   - Address the root cause identified in Phase 1-3
   - ONE change at a time
   - No "while I'm here" improvements
   - No bundled refactoring

3. VERIFY FIX
   - Failing test now passes?
   - No OTHER tests broken?
   - Issue actually resolved end-to-end?

4. THE 3-FIX ESCALATION RULE
   ─────────────────────────
   Count how many fixes you've attempted:
   - Fix 1 failed → Return to Phase 1, re-analyze with new evidence
   - Fix 2 failed → Return to Phase 1, re-analyze again
   - Fix 3 failed → STOP. This is NOT a bug — it's an architectural problem.

   Signs of architectural problem:
   - Each fix reveals new coupling/shared state issues
   - Fixes require "massive refactoring" to implement
   - Each fix creates new symptoms elsewhere

   ACTION: Question fundamentals. Is this pattern/approach sound?
   Discuss architecture before attempting Fix #4.
```

```typescript
// Example: Fix with failing test first

// STEP 1: Write failing test that proves the bug exists
describe('ProductList', () => {
  it('should handle undefined userId during SSR', () => {
    // This test MUST fail before the fix
    const { container } = render(<ProductList userId={undefined} />)
    expect(container.querySelector('.skeleton')).toBeInTheDocument()
    // NOT: expect blank screen or error
  })
})

// STEP 2: Run test → confirm it FAILS (RED)
// STEP 3: Implement the single fix (the guard we tested in Phase 3)
// STEP 4: Run test → confirm it PASSES (GREEN)
// STEP 5: Run full test suite → no regressions
```

## 21.5 Debugging Red Flags & Anti-Patterns

**Pattern 62: Debugging Anti-Pattern Recognition**

Stop immediately and return to Phase 1 if you catch yourself thinking:

| Red Flag Thought | What It Means |
|-----------------|---------------|
| "Quick fix for now, investigate later" | Skipping root cause — will create new bugs |
| "Just try changing X and see if it works" | Guessing, not investigating |
| "Add multiple changes, run tests" | Can't isolate what worked |
| "Skip the test, I'll manually verify" | Untested fixes don't stick |
| "It's probably X, let me fix that" | Assumption without evidence |
| "I don't fully understand but this might work" | Hoping, not debugging |
| "One more fix attempt" (after 2+ failures) | Architectural problem — stop fixing |
| "Here are the main problems: [list]" | Proposing fixes without investigation |

**Common Rationalizations:**

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too. Process is fast for simple bugs. |
| "Emergency, no time for process" | Systematic debugging is FASTER than guess-and-check thrashing. |
| "Just try this first, then investigate" | First fix sets the pattern. Do it right from the start. |
| "I'll write test after confirming fix" | Untested fixes don't stick. Test first proves the bug. |
| "Multiple fixes at once saves time" | Can't isolate what worked. Causes new bugs. |
| "I see the problem, let me fix it" | Seeing symptoms ≠ understanding root cause. |

**Quick Reference:**

| Phase | Key Activities | Done When |
|-------|---------------|-----------|
| 1. Root Cause | Read errors, reproduce, check changes, gather evidence | You understand WHAT and WHY |
| 2. Pattern | Find working examples, compare differences | You identified the specific difference |
| 3. Hypothesis | Form theory, test ONE variable | Confirmed root cause or new hypothesis |
| 4. Implementation | Write failing test, single fix, verify | Test passes, no regressions |

===========================================
SECTION 22: TEST-DRIVEN DEVELOPMENT (TDD)
===========================================

Source: Test-Driven Development skill (obra). Fills complete gap — agent had test writing patterns but zero TDD methodology.
Core principle: If you didn't watch the test fail, you don't know if it tests the right thing.

## 22.1 The Red-Green-Refactor Cycle

**Pattern 63: Red-Green-Refactor TDD Cycle**

```
THE IRON LAW: NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST

Wrote code before the test? Delete it. Start over.
- Don't keep it as "reference"
- Don't "adapt" it while writing tests
- Delete means delete. Implement fresh from tests.
```

```typescript
// ═══════════════════════════════════════════
// RED: Write ONE minimal failing test
// ═══════════════════════════════════════════

test('retries failed operations 3 times', async () => {
  let attempts = 0
  const operation = () => {
    attempts++
    if (attempts < 3) throw new Error('fail')
    return 'success'
  }

  const result = await retryOperation(operation)

  expect(result).toBe('success')
  expect(attempts).toBe(3)
})

// Requirements: ONE behavior, clear name, real code (not mocks)

// ═══════════════════════════════════════════
// VERIFY RED: Run test, confirm it FAILS
// ═══════════════════════════════════════════

// $ npm test path/to/test.test.ts
// FAIL: retryOperation is not defined
//
// Confirm:
// - Test FAILS (not errors from typos)
// - Failure message is what you expect
// - Fails because feature is missing
// - Test passes immediately? You're testing existing behavior — fix test

// ═══════════════════════════════════════════
// GREEN: Write SIMPLEST code to pass
// ═══════════════════════════════════════════

async function retryOperation<T>(fn: () => T | Promise<T>): Promise<T> {
  for (let i = 0; i < 3; i++) {
    try {
      return await fn()
    } catch (e) {
      if (i === 2) throw e
    }
  }
  throw new Error('unreachable')
}

// Don't add options, backoff, onRetry — YAGNI. Just enough to pass.

// ═══════════════════════════════════════════
// VERIFY GREEN: All tests pass
// ═══════════════════════════════════════════

// $ npm test
// PASS — all green, no warnings

// ═══════════════════════════════════════════
// REFACTOR: Clean up while staying green
// ═══════════════════════════════════════════

// - Remove duplication
// - Improve names
// - Extract helpers
// - Keep tests green. Don't add behavior.
// → Then start next RED for the next behavior
```

## 22.2 TDD Phase Verification

**Pattern 64: Mandatory Phase Gates**

```
VERIFY RED (mandatory — never skip)
────────────────────────────────────
✓ Test fails (not errors)
✓ Failure message matches expectation
✓ Fails because feature is missing, not because of typos
✗ Test passes immediately → you're testing existing behavior, fix test
✗ Test errors → fix the error, re-run until it fails correctly

VERIFY GREEN (mandatory)
────────────────────────
✓ New test passes
✓ ALL other tests still pass
✓ Output is pristine — no errors, no warnings
✗ Test fails → fix the code, NOT the test
✗ Other tests broke → fix them now, not later
```

## 22.3 Good Test Design

**Pattern 65: Test Quality Standards**

| Quality | Good | Bad |
|---------|------|-----|
| **Minimal** | One behavior per test. "and" in name? Split it. | `test('validates email and domain and whitespace')` |
| **Clear name** | Name describes the behavior being tested | `test('test1')`, `test('it works')` |
| **Shows intent** | Test demonstrates the desired API | Obscures what code should do |
| **Real code** | Tests actual implementation | Mocks everything, tests mock behavior |

```typescript
// GOOD: Tests real behavior with clear intent
test('rejects empty email with descriptive error', async () => {
  const result = await submitForm({ email: '' })
  expect(result.error).toBe('Email required')
})

// BAD: Tests mock, vague name, multiple behaviors
test('retry works', async () => {
  const mock = jest.fn()
    .mockRejectedValueOnce(new Error())
    .mockRejectedValueOnce(new Error())
    .mockResolvedValueOnce('success')
  await retryOperation(mock)
  expect(mock).toHaveBeenCalledTimes(3) // Tests mock call count, not behavior
})
```

**Why tests-first, not tests-after:**
- Tests-after answer "What does this code do?" (biased by implementation)
- Tests-first answer "What should this code do?" (driven by requirements)
- Tests-after pass immediately — proves nothing about catching bugs
- Tests-first must fail first — proves the test catches the missing behavior

## 22.4 TDD Rationalizations & Red Flags

**Pattern 66: TDD Anti-Pattern Recognition**

**Red Flags — STOP and start over if any apply:**
- Code written before test
- Test passes on first run (never saw it fail)
- Can't explain why the test failed
- Tests added "later" or "after confirming fix works"
- "Just this once" rationalization
- "Keep as reference" instead of deleting pre-test code
- "Already spent X hours, deleting is wasteful"

**Common Rationalizations:**

| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests passing immediately prove nothing. |
| "Tests after achieve same goals" | Tests-after verify what you built. Tests-first verify what's required. |
| "Already manually tested" | Ad-hoc ≠ systematic. No record, can't re-run. |
| "Deleting X hours is wasteful" | Sunk cost fallacy. Keeping unverified code is debt. |
| "Keep as reference, write tests first" | You'll adapt it. That's testing-after. Delete means delete. |
| "Need to explore first" | Fine. Throw away exploration. Start with TDD. |
| "Hard to test = skip" | Hard to test = hard to use. Simplify the design. |
| "TDD will slow me down" | TDD is faster than debugging. Measure total time, not coding time. |
| "Must mock everything" | Code too coupled. Use dependency injection. |
| "Existing code has no tests" | You're improving it now. Add tests for what you touch. |

**When Stuck:**

| Problem | Solution |
|---------|----------|
| Don't know how to test | Write the assertion first. What should the result be? |
| Test too complicated | Design too complicated. Simplify the interface. |
| Must mock everything | Code too coupled. Inject dependencies instead. |
| Test setup is huge | Extract test helpers. Still complex? Simplify design. |

## 22.5 TDD Verification Checklist

**Pattern 67: TDD Completion Checklist**

Before marking any implementation work complete:

```
□ Every new function/method has a test
□ Watched each test fail before implementing (RED verified)
□ Each test failed for the expected reason (missing feature, not typo)
□ Wrote minimal code to pass each test (no over-engineering)
□ All tests pass (GREEN verified)
□ Output pristine — no errors, no warnings
□ Tests use real code (mocks only when unavoidable)
□ Edge cases and error paths covered

Can't check all boxes? You skipped TDD. Start over.
```

**Complete Bug Fix Example (RED → GREEN → REFACTOR):**

```typescript
// BUG: Empty email is accepted by the form

// RED: Write failing test
test('rejects empty email', async () => {
  const result = await submitForm({ email: '' })
  expect(result.error).toBe('Email required')
})

// VERIFY RED:
// $ npm test
// FAIL: expected 'Email required', got undefined ← correct failure
```

```typescript
// GREEN: Minimal fix
function submitForm(data: FormData) {
  if (!data.email?.trim()) {
    return { error: 'Email required' }
  }
  // ... existing logic
}

// VERIFY GREEN:
// $ npm test
// PASS ← all green

// REFACTOR: Extract validation if multiple fields need similar checks
// Keep tests green throughout refactoring
```

===========================================
KNOWLEDGE PROVENANCE SUMMARY
===========================================

**SOURCE FILES MERGED (8 files, 2,580+ lines):**
1. agent-system/core/testing-specialist.md (421 lines)
2. agency-agents/testing/testing-api-tester.md (304 lines)
3. agency-agents/testing/testing-evidence-collector.md (209 lines)
4. agency-agents/testing/testing-performance-benchmarker.md (266 lines)
5. agency-agents/testing/testing-reality-checker.md (237 lines)
6. agency-agents/testing/testing-test-results-analyzer.md (303 lines)
7. agency-agents/testing/testing-tool-evaluator.md (392 lines)
8. agency-agents/testing/testing-workflow-optimizer.md (448 lines)

**ENHANCEMENT v3.0 PATTERNS ADDED:**

From LLM Evaluation Research:
- Pattern 45: LLM-as-Judge Evaluation
- Pattern 46: Rubric-Based Evaluation
- Pattern 47: A/B Testing for Prompts
- Pattern 48: Regression Testing Suite

From OWASP Security Testing:
- Pattern 49: SQL Injection Testing
- Pattern 50: XSS Prevention Testing
- Pattern 51: CSRF Protection Testing
- Pattern 52: Authentication & Authorization Testing
- Pattern 53: Header Security Testing

From Performance Testing (k6, Lighthouse):
- Pattern 54: k6 Load Test Suite
- Pattern 55: Lighthouse CI Integration
- Pattern 56: Core Web Vitals Monitoring
- Pattern 57: Database Query Performance Testing

From Systematic Debugging Methodology (obra):
- Pattern 58: Root Cause Investigation
- Pattern 59: Working vs Broken Comparison
- Pattern 60: Scientific Debugging
- Pattern 61: Root Cause Fix Protocol
- Pattern 62: Debugging Anti-Pattern Recognition

From Test-Driven Development Methodology (obra):
- Pattern 63: Red-Green-Refactor TDD Cycle
- Pattern 64: Mandatory Phase Gates
- Pattern 65: Test Quality Standards
- Pattern 66: TDD Anti-Pattern Recognition
- Pattern 67: TDD Completion Checklist

**TOTAL PATTERNS:** 67 comprehensive patterns
**TOTAL LINES:** 5,800+ lines of production-ready code
**COVERAGE:** 100% of all source files merged
**VERSION:** 3.2 (added systematic debugging + TDD methodology)

===========================================
END OF TESTING SPECIALIST AGENT
===========================================
