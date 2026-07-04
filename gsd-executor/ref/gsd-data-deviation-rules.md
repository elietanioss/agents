# GSD Deviation Rules Reference
# Source: gsd-executor.md | Apply automatically during plan execution.

---

## Context

During execution you WILL discover work not in the plan. This is normal.
Apply these rules automatically. Track all deviations for SUMMARY.md.

---

## RULE 1: Auto-fix Bugs

**Trigger:** Code doesn't work as intended (broken behavior, incorrect output, errors)
**Action:** Fix immediately, track for Summary. No user permission needed.

Examples:
- Wrong SQL query returning incorrect data
- Logic errors (inverted condition, off-by-one, infinite loop)
- Type errors, null pointer exceptions, undefined references
- Broken validation (accepts invalid input, rejects valid)
- Security vulnerabilities (SQL injection, XSS, CSRF, insecure auth)
- Race conditions, deadlocks, memory/resource leaks

Process: Fix inline → add/update tests → verify → continue → track as `[Rule 1 - Bug] [description]`

---

## RULE 2: Auto-add Missing Critical Functionality

**Trigger:** Code is missing essential features for correctness, security, or basic operation
**Action:** Add immediately, track for Summary. No user permission needed.

Examples:
- Missing error handling (no try/catch, unhandled promise rejections)
- No input validation (accepts malicious data)
- Missing null/undefined checks (crashes on edge cases)
- No authentication on protected routes
- Missing authorization checks (users can access others' data)
- No CSRF protection, missing CORS configuration
- No rate limiting on public APIs
- Missing required database indexes (causes timeouts)
- No logging for errors

Process: Add inline → add tests → verify → continue → track as `[Rule 2 - Missing Critical] [description]`

**Critical = required for correct/secure/performant operation.** These are not features — they are requirements for basic correctness.

---

## RULE 3: Auto-fix Blocking Issues

**Trigger:** Something prevents you from completing current task
**Action:** Fix immediately to unblock, track for Summary. No user permission needed.

Examples:
- Missing dependency (package not installed, import fails)
- Wrong types blocking compilation
- Broken import paths (file moved, wrong relative path)
- Missing environment variable (app won't start)
- Database connection config error
- Build configuration error (webpack, tsconfig, etc.)
- Missing file referenced in code

Process: Fix blocker → verify task can proceed → continue → track as `[Rule 3 - Blocking] [description]`

---

## RULE 4: Ask About Architectural Changes

**Trigger:** Fix/addition requires significant structural modification
**Action:** STOP, present to user, wait for decision. User decision required.

Examples:
- Adding new database table (not just column)
- Major schema changes (changing primary key, splitting tables)
- Introducing new service layer or architectural pattern
- Switching libraries/frameworks (React → Vue, REST → GraphQL)
- Changing authentication approach (sessions → JWT)
- Adding new infrastructure (message queue, cache layer, CDN)
- Changing API contracts (breaking changes to endpoints)

Process: STOP → return checkpoint with: what you found / proposed change / why needed / impact / alternatives → WAIT for decision → fresh agent continues

---

## Rule Priority

**1. If Rule 4 applies → STOP and return checkpoint (Rule 4 wins)**
**2. If Rules 1-3 apply → Fix automatically, track for Summary**
**3. If genuinely unsure which rule → Apply Rule 4 (ask, don't guess)**

---

## Edge Case Table

| Situation | Rule |
|-----------|------|
| "Validation is missing" | Rule 2 (critical for security) |
| "This crashes on null" | Rule 1 (bug) |
| "Need to add table" | Rule 4 (architectural) |
| "Need to add column" | Rule 1 or 2 (fixing bug or adding critical field) |
| "Need new package for existing feature" | Rule 3 (blocking) |
| "Need to refactor to make testable" | Rule 4 (structural) |

**When in doubt:** Does this affect correctness, security, or ability to complete task?
- YES → Rules 1-3 (fix automatically)
- MAYBE → Rule 4 (return checkpoint for user decision)
