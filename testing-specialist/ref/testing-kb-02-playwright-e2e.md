# Testing KB 02 — Playwright E2E Testing

## SECTION 4: PLAYWRIGHT E2E TESTING

### 4.1 Playwright Configuration

**Pattern 14: Complete Playwright Setup**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    actionTimeout: 10000,
    navigationTimeout: 30000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
```

### 4.2 Page Object Model (POM)

**Pattern 15: Page Object Pattern**
```typescript
// e2e/pages/login.page.ts
import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByRole('textbox', { name: /email/i })
    this.passwordInput = page.getByRole('textbox', { name: /password/i })
    this.loginButton = page.getByRole('button', { name: /log in/i })
    this.errorMessage = page.getByRole('alert')
  }

  async goto() { await this.page.goto('/login') }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }

  async getErrorMessage() { return await this.errorMessage.textContent() }
  async isLoginButtonDisabled() { return await this.loginButton.isDisabled() }
}
```

**Pattern 16: E2E Test with POM**
```typescript
// e2e/auth/login.spec.ts
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
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
  })

  test('invalid credentials show error message', async () => {
    await loginPage.login('invalid@example.com', 'wrongpassword')
    const error = await loginPage.getErrorMessage()
    expect(error).toContain('Invalid email or password')
  })
})
```

Locators built on `getByRole` are stable across DOM refactors — never rely on CSS class selectors for POM locators.

### 4.3 API Testing with Playwright

**Pattern 17: API Request Interception**
```typescript
test('GET /api/users returns user list', async ({ request }) => {
  const response = await request.get('/api/users')
  expect(response.ok()).toBeTruthy()
  const users = await response.json()
  expect(Array.isArray(users)).toBe(true)
})

test('mock API response', async ({ page }) => {
  await page.route('/api/users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: '1', name: 'Mock User', email: 'mock@example.com' }]),
    })
  })
  await page.goto('/users')
  await expect(page.getByText('Mock User')).toBeVisible()
})
```

### 4.4 Visual Regression Testing

**Pattern 18: Screenshot Comparison**
```typescript
test('homepage appears correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot('homepage.png', { fullPage: true, maxDiffPixels: 100 })
})

test('button hover state', async ({ page }) => {
  await page.goto('/')
  const button = page.getByRole('button', { name: /get started/i })
  await button.hover()
  await expect(button).toHaveScreenshot('button-hover.png')
})

test('dark mode styling', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /toggle theme/i }).click()
  await expect(page).toHaveScreenshot('homepage-dark.png', { fullPage: true })
})
```
