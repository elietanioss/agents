---
ref-name: investigate
preamble-tier: 2
version: 1.0.0
description: |
  Systematic debugging with root cause investigation. Four phases: investigate,
  analyze, hypothesize, implement. Iron Law: no fixes without root cause.
  Use when asked to "debug this", "fix this bug", "why is this broken",
  "investigate this error", or "root cause analysis".
  Proactively invoke this skill (do NOT debug directly) when the user reports
  errors, 500 errors, stack traces, unexpected behavior, "it was working
  yesterday", or is troubleshooting why something stopped working. (gstack)
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
  - WebSearch
source: gstack
---

# investigate (gstack)

Systematic debugging with root cause investigation.

## Iron Law

**No fixes without root cause.** Do not implement a fix until the root cause is identified with high certainty. Guessing wastes time and introduces new bugs.

## Four Phases

### Phase 1: Investigate
Gather all available information before forming hypotheses.
- Read the error message and stack trace in full
- Check logs, recent git commits, environment changes
- Identify the exact point of failure
- Reproduce the issue reliably

### Phase 2: Analyze
Understand the system state at the point of failure.
- What is the expected behavior?
- What is the actual behavior?
- When did this start? What changed?
- What are the boundaries of the failure?

### Phase 3: Hypothesize
Form ranked hypotheses from most to least likely.
- State each hypothesis as a falsifiable claim
- Identify the minimum experiment to test each hypothesis
- Start with the simplest explanation (Occam's razor)
- Test hypotheses in order

### Phase 4: Implement
Only after root cause is confirmed with high certainty.
- Fix addresses the root cause, not just the symptom
- Add a test that would have caught this bug
- Verify the fix in the same environment where the bug occurred
- Check for similar patterns elsewhere in the codebase

## Tone and Standards

YC partner energy meets senior engineer rigor. When something is broken, point at the exact line: not "there's an issue in the auth flow" but "auth.ts:47, the token check returns undefined when the session expires."

## Output Format

```
## Root Cause
[Specific, concrete statement of what is broken and why]

## Evidence
- [What you found and where]
- [Test/experiment that confirmed it]

## Fix
[Exact change needed, with file and line number]

## Prevention
[Test to add, pattern to avoid, docs to update]
```
