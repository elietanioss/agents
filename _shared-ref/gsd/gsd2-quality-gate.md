# GSD QUALITY GATE — 8-QUESTION CHECKLIST
*Derived from gsd-2 verification framework | April 2026*
*Use in gsd-verifier before signing off any phase completion*

## The 8 Questions

Before marking ANY phase or milestone complete, answer all 8:

### 1. Requirements Met?
Are all must-haves from ROADMAP.md satisfied for this phase?
Evidence: point to specific files/functions that fulfill each requirement.
**Pass criteria:** Every must-have has a named artifact + line reference.

### 2. Test Coverage?
Are the critical paths tested?
Not asking for 100% coverage — asking if failure scenarios that would block launch are covered.
**Pass criteria:** At least one test per must-have; all tests pass.

### 3. Security Reviewed?
Have inputs been validated? Are there exposed secrets? Any obvious injection vectors?
Run security-auditor or at minimum check: no hardcoded keys, Zod validation on API inputs, RLS on DB queries.
**Pass criteria:** No CRITICAL or HIGH severity findings unaddressed.

### 4. Performance Acceptable?
Does it meet the performance targets stated in ROADMAP.md?
If no targets stated: does it respond in <2s for user-facing actions?
**Pass criteria:** No obvious N+1 queries; no blocking operations on the main thread.

### 5. Maintainability Adequate?
Can another developer understand what was built without asking questions?
**Pass criteria:** Functions named clearly; no magic numbers; complex logic has a comment.

### 6. Documentation Updated?
Is CLAUDE.md current? Is README accurate? Are new env vars documented?
**Pass criteria:** Any new setup step is documented. No stale instructions.

### 7. Scope Respected?
Did implementation stay within the phase boundary?
**Pass criteria:** No features from Phase N+1 were added. STATE.md accurately reflects what was built.

### 8. Design Reviewed?
If this involved architectural choices — were they intentional?
**Pass criteria:** Any architectural decision not in ROADMAP.md is documented in STATE.md Decisions section.

## Scoring
- 8/8 PASS → Phase complete. Write VERIFICATION.md, advance to next phase.
- 7/8 → Address the failing question. Re-check before proceeding.
- <7/8 → Phase NOT complete. Write SUMMARY.md status: BLOCKED with specific gaps.
