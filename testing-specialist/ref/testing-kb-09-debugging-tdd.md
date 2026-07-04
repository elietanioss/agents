# Testing KB 09 — Systematic Debugging & TDD Methodology

## SECTION 21: SYSTEMATIC DEBUGGING METHODOLOGY

Core principle: ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

### 21.1 Phase 1: Root Cause Investigation

**Pattern 58** — before attempting ANY fix, complete all five steps:
1. **Read error messages carefully** — full message, not just first line; note line numbers, file paths, error codes.
2. **Reproduce consistently** — exact steps; if not reproducible, gather more data, don't guess.
3. **Check recent changes** — `git diff`, recent commits, new dependencies, config/env differences (CI vs local, Node version, OS).
4. **Gather evidence at component boundaries** — for multi-component systems (API → service → database), add diagnostic logging at EACH boundary in one pass before proposing fixes, then look at where the chain actually breaks:
```typescript
async function debugRequestFlow(userId: string) {
  console.log('=== Gateway ==='); console.log('Request received:', { userId, timestamp: Date.now() })
  console.log('=== Auth ===');    console.log('Token present:', !!token, 'Expired:', isExpired(token))
  console.log('=== Service ==='); const response = await callService(userId); console.log('Service response:', response.status)
  console.log('=== Database ==='); const dbResult = await db.query('SELECT * FROM users WHERE id = $1', [userId])
  // Run ONCE → evidence shows WHERE it breaks → investigate THAT component
}
```
5. **Trace data flow backward** — find where the bad value originates; keep tracing up the call stack; fix at SOURCE, not at symptom.

### 21.2 Phase 2: Pattern Analysis

**Pattern 59: Working vs Broken Comparison** — locate similar WORKING code in the same codebase, list EVERY difference however small (data-fetch method, error boundary presence, `key` prop strategy, null checks), don't assume "that can't matter" — test each difference. If implementing a documented pattern, read the reference implementation COMPLETELY before adapting; partial understanding guarantees bugs.

### 21.3 Phase 3: Hypothesis & Testing

**Pattern 60: Scientific Debugging**
- State the hypothesis explicitly and specifically: "I think [X] is the root cause because [Y evidence]" — vague theories produce vague fixes.
- Make the SMALLEST possible change to test it; change ONE variable at a time; never stack fixes.
- If it worked, move to Phase 4; if not, form a NEW hypothesis from the evidence gathered.
- When you don't know: say "I don't understand X" — an honest unknown beats a confident wrong fix.

### 21.4 Phase 4: Fix Implementation

**Pattern 61: Root Cause Fix Protocol**
1. Create a failing test FIRST (simplest reproduction, automated).
2. Implement a SINGLE fix addressing the root cause — no "while I'm here" improvements, no bundled refactoring.
3. Verify: failing test now passes, no other tests broke, issue resolved end-to-end.
4. **The 3-fix escalation rule**: Fix 1 failed → return to Phase 1 with new evidence. Fix 2 failed → return to Phase 1 again. Fix 3 failed → STOP — this is not a bug, it's an architectural problem. Signs: each fix reveals new coupling/shared-state issues, fixes require "massive refactoring," each fix creates new symptoms elsewhere. Action: question fundamentals before attempting fix #4.

### 21.5 Debugging Red Flags & Anti-Patterns

**Pattern 62** — stop and return to Phase 1 if you catch yourself thinking any of:
| Red Flag Thought | What It Means |
|-----------------|---------------|
| "Quick fix for now, investigate later" | Skipping root cause — will create new bugs |
| "Just try changing X and see if it works" | Guessing, not investigating |
| "Add multiple changes, run tests" | Can't isolate what worked |
| "Skip the test, I'll manually verify" | Untested fixes don't stick |
| "It's probably X, let me fix that" | Assumption without evidence |
| "One more fix attempt" (after 2+ failures) | Architectural problem — stop fixing |
| "Here are the main problems: [list]" | Proposing fixes without investigation |

Common rationalizations to reject: "issue is simple, don't need process" (simple issues have root causes too), "emergency, no time for process" (systematic debugging is faster than guess-and-check thrashing), "multiple fixes at once saves time" (can't isolate what worked).

---

## SECTION 22: TEST-DRIVEN DEVELOPMENT (TDD)

Core principle: If you didn't watch the test fail, you don't know if it tests the right thing.

### 22.1 The Red-Green-Refactor Cycle

**Pattern 63 — THE IRON LAW: NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.** Wrote code before the test? Delete it — don't keep it "as reference," don't "adapt" it while writing tests. Delete means delete; implement fresh from tests.

```
RED: Write ONE minimal failing test for ONE behavior, clear name, real code (not mocks).
VERIFY RED: Run it — confirm it FAILS for the right reason (missing feature, not a typo).
           Test passes immediately? You're testing existing behavior — fix the test.
GREEN: Write the SIMPLEST code that passes. No options/backoff/extra flags — YAGNI, just enough.
VERIFY GREEN: Run full suite — all green, no warnings.
REFACTOR: Remove duplication, improve names, extract helpers — stay green, don't add behavior.
→ Then start next RED for the next behavior.
```

### 22.2 TDD Phase Verification

**Pattern 64 — mandatory gates, never skip:**
- VERIFY RED: test fails (not errors), failure message matches expectation, fails because feature is missing not because of typos.
- VERIFY GREEN: new test passes, ALL other tests still pass, output pristine (no errors/warnings). Other tests broke → fix them now, not later.

### 22.3 Good Test Design

**Pattern 65:**
| Quality | Good | Bad |
|---------|------|-----|
| Minimal | One behavior per test — "and" in the name? Split it. | `test('validates email and domain and whitespace')` |
| Clear name | Describes the behavior tested | `test('test1')`, `test('it works')` |
| Shows intent | Demonstrates the desired API | Obscures what code should do |
| Real code | Tests actual implementation | Mocks everything, tests the mock |

Why tests-first not tests-after: tests-after answer "what does this code do?" (biased by implementation and pass immediately, proving nothing); tests-first answer "what should this code do?" (driven by requirements, and must fail first to prove they catch the missing behavior).

### 22.4 TDD Rationalizations & Red Flags

**Pattern 66 — stop and start over if:** code written before test; test passed on first run (never saw it fail); can't explain why the test failed; tests added "later" or "after confirming fix works"; "just this once."

Rejected excuses: "too simple to test" (simple code breaks, test takes 30s); "already manually tested" (ad-hoc ≠ systematic, no record, can't re-run); "must mock everything" (code too coupled — use dependency injection instead); "TDD will slow me down" (measure total time including debugging, not just coding time).

When stuck: don't know how to test → write the assertion first (what should the result be?); test too complicated → design is too complicated, simplify the interface; test setup is huge → extract test helpers, still complex → simplify design.

### 22.5 TDD Verification Checklist

**Pattern 67 — before marking any implementation work complete:**
```
[ ] Every new function/method has a test
[ ] Watched each test fail before implementing (RED verified)
[ ] Each test failed for the expected reason (missing feature, not typo)
[ ] Wrote minimal code to pass each test (no over-engineering)
[ ] All tests pass (GREEN verified)
[ ] Output pristine — no errors, no warnings
[ ] Tests use real code (mocks only when unavoidable)
[ ] Edge cases and error paths covered
```
Can't check all boxes? You skipped TDD — start over, not "patch it up after."
