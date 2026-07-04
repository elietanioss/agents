# Testing KB 04 — Mocking, Fixtures, and CI/CD

## SECTION 8: MOCKING & FIXTURES

### 8.1 Mock Service Worker (MSW)

**Pattern 25: MSW API Mocking**
```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users', () => HttpResponse.json([
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ])),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: '3', ...body }, { status: 201 })
  }),

  http.get('/api/users/:id', ({ params }) => {
    if (params.id === 'error') return HttpResponse.json({ error: 'User not found' }, { status: 404 })
    return HttpResponse.json({ id: params.id, name: 'Mock User', email: 'mock@example.com' })
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

### 8.2 Test Fixtures

**Pattern 27: Reusable Test Data Fixtures** — plain objects (`mockUsers.admin`, `mockUsers.user`, `mockUsers.unverified`) keyed by role/state, referenced by id across related fixture sets (e.g. `mockProjects` referencing `mockUsers.admin.id`).

**Pattern 28: Factory Pattern for Test Data**
```typescript
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

// Usage: UserFactory.create(), UserFactory.createAdmin(), UserFactory.createMany(10)
```
Prefer factories over static fixtures once tests need varied/randomized data — factories prevent hardcoded-value collisions across parallel test runs.

---

## SECTION 10: CI/CD & TEST AUTOMATION

### 10.1 GitHub Actions Workflows

**Pattern 32: Complete Test Pipeline** — four jobs: `unit-tests` (checkout → setup-node → `npm ci` → `npm run test:unit -- --coverage` → upload to Codecov), `integration-tests` (adds Postgres + Redis service containers with healthchecks, runs migrations then `npm run test:integration`), `e2e-tests` (installs Playwright with `--with-deps`, builds, runs `npm run test:e2e`, uploads `playwright-report/` on failure), `lighthouse` (installs `@lhci/cli`, runs `lhci autorun`).

Key service-container pattern (Postgres):
```yaml
services:
  postgres:
    image: postgres:16
    env: { POSTGRES_PASSWORD: postgres, POSTGRES_DB: test }
    options: >-
      --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5
    ports: ['5432:5432']
```

**Pattern 33: Parallel Test Execution (sharding)**
```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - run: npm test -- --shard=${{ matrix.shard }}/4
```
Use matrix sharding once a single-runner suite exceeds a few minutes — 4-way shard is a good default before tuning further.
