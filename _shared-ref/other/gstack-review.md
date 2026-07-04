---
ref-name: review
preamble-tier: 4
version: 1.0.0
description: |
  Pre-landing PR review. Analyzes diff against the base branch for SQL safety, LLM trust
  boundary violations, conditional side effects, and other structural issues. Use when
  asked to "review this PR", "code review", "pre-landing review", or "check my diff".
  Proactively suggest when the user is about to merge or land code changes. (gstack)
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - Agent
  - AskUserQuestion
  - WebSearch
source: gstack
---

# review (gstack)

Pre-landing PR review. Analyzes diff for structural issues before code lands.

## When to Use

- "review this PR" / "code review" / "pre-landing review" / "check my diff"
- User is about to merge or land code changes

## Review Dimensions

### SQL Safety
- [ ] No raw string interpolation in queries (use parameterized queries)
- [ ] No unbounded queries (LIMIT present where needed)
- [ ] No missing WHERE clauses on UPDATE/DELETE
- [ ] Migrations are reversible

### LLM Trust Boundary Violations
- [ ] User-provided content not injected into system prompts without sanitization
- [ ] LLM outputs not used as direct SQL/shell input without validation
- [ ] No prompt injection vectors in templates

### Conditional Side Effects
- [ ] Side effects (emails, webhooks, charges) are inside appropriate conditions
- [ ] No side effects in error paths that shouldn't trigger them
- [ ] Idempotency handled for retryable operations

### Auth and Security
- [ ] All new endpoints have auth checks
- [ ] Permission checks happen before data access, not after
- [ ] Sensitive data not logged
- [ ] No hardcoded secrets

### General Code Quality
- [ ] Error cases handled explicitly
- [ ] No silent failures (caught exceptions that do nothing)
- [ ] New code is testable (no untestable side effects baked in)
- [ ] Breaking changes documented

## Process

1. Get the diff: `git diff main...HEAD` or `git diff --staged`
2. Scan for each dimension above
3. For each issue: note file, line number, and specific problem
4. Categorize as BLOCKER (must fix) or CONCERN (should fix)
5. Deliver structured report

## Output Format

```markdown
## PR Review: [branch/PR name]

### Blockers (must fix before landing)
1. **[File:line]** — [Specific issue]
   Fix: [Concrete recommendation]

### Concerns (should fix)
1. **[File:line]** — [Issue]
   Suggestion: [Recommendation]

### Looks Good
- [What is well done]

### Verdict
[APPROVED / REQUEST CHANGES]
```

## Tone

Senior eng energy. Name the exact file and line. "auth.ts:47 — the token check returns undefined when the session expires, which will let unauthenticated requests through" is useful. "There might be an auth issue" is not.
