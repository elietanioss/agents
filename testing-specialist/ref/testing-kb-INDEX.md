# Testing Specialist Knowledge Base — INDEX

Chunked from the original 109KB monolith (`06-testing_specialist.md`, deleted after chunking — full backup at `C:\Users\User\.claude\backups\agents-backup-2026-07-02.tar.gz`). 67 patterns preserved across 9 topic chunks. Load only the chunk you need.

| Chunk | Contains | Load when |
|-------|----------|-----------|
| `testing-kb-01-jest-vitest-rtl.md` | Jest 29 config + component/hook tests, Vitest config (incl. Browser Mode), React Testing Library query hierarchy + axe-core a11y patterns (Patterns 1-13) | Writing unit/component tests, choosing Jest vs Vitest, RTL query selection, accessibility test setup |
| `testing-kb-02-playwright-e2e.md` | Playwright config (cross-browser/mobile projects), Page Object Model, API request interception, visual regression screenshots (Patterns 14-18) | Any E2E test, POM structure, mocking API responses in E2E, visual diffing |
| `testing-kb-03-schema-rls-ratelimit.md` | Zod schema test suites, API endpoint schema validation, SQL + Node.js RLS policy tests, rate-limit test suites (Patterns 19-24) | Testing Zod schemas, Supabase RLS policies, API rate limiting |
| `testing-kb-04-mocking-cicd.md` | MSW handlers/server setup, fixtures, factory pattern (Faker), GitHub Actions test pipelines incl. service containers + sharding (Patterns 25-33) | Setting up mocks/fixtures, wiring CI test pipelines, parallel test sharding |
| `testing-kb-05-security-testing.md` | Security-first API test suite, OWASP API Top 10, SQL injection/XSS/CSRF payload suites, auth/authz tests, security header tests (Patterns 34-35, 49-53) | Any security-focused test suite, OWASP verification, header/CSRF/auth testing |
| `testing-kb-06-evidence-qa-analysis.md` | Playwright visual evidence capture, QA report generation, statistical test-results analysis (Python), release-readiness scoring, tool evaluation scoring, workflow optimization, "reality checker" fantasy-score detector, handoff templates + activation triggers (Patterns 36-44, plus Section 17) | Producing QA evidence packages, release go/no-go calls, evaluating testing tools, writing handoff sections |
| `testing-kb-07-llm-eval.md` | LLM-as-Judge evaluation, rubric-based scoring, A/B testing prompts (Welch's t-test), prompt regression suites (Patterns 45-48) | Testing/evaluating prompts or LLM output quality, not application UI |
| `testing-kb-08-perf-testing.md` | k6 load/stress test scripts, Lighthouse CI config, Core Web Vitals RUM reporting, DB query performance tests (Patterns 29-31, 54-57) | Load testing, Lighthouse CI setup, Core Web Vitals monitoring, DB query perf budgets |
| `testing-kb-09-debugging-tdd.md` | Systematic debugging methodology (root cause investigation, hypothesis testing, 3-fix escalation rule) + full TDD Red-Green-Refactor cycle with anti-pattern tables (Patterns 58-67) | Debugging a failing test/feature systematically, doing real TDD instead of tests-after |

## Other ref files (not chunked, already reasonably sized)
- `gsd-verifier.md` — goal-backward validation methodology
- `pr-review-toolkit.md` — multi-aspect PR review, severity tiers
- `testing-patterns.md` — mocking decisions, test data strategies
- `webapp-testing.md` — Playwright E2E toolkit (recon-then-action, server lifecycle)
- `skills-enrichment.csv` — data corpus, query don't load whole
