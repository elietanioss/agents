# SKILLBOOK — STATE.md Template Section
*Derived from ACE (Agentic Context Engine) Skillbook pattern*
*Benchmarked: 2x consistency improvement, 49% token reduction on Tau2 benchmark*

Add this section to every project's STATE.md file.
The gsd-executor reads this at the start of every session BEFORE reading PLAN.md.

---

## SKILLBOOK

### Active Strategies
<!-- Format: [CONFIDENCE: HIGH|MED|LOW] Strategy text -->
<!-- Add after any successful non-obvious approach. Remove after 3 failures on same project. -->
<!-- Example entries — replace with project-specific learnings: -->

- [HIGH] Run `npm run type-check` before any TypeScript commit — catches errors Bash misses
- [MED] This project's test suite requires `npm run db:seed` before `npm test` — skip it and 40+ tests fail

### Reflection Log
<!-- Append after each completed or failed task. Never delete — archive instead. -->
<!-- Format: TASK | OUTCOME | LESSON | DATE -->

| Task | Outcome | Lesson | Date |
|------|---------|--------|------|
| (first entry) | SUCCESS | (what worked that wasn't obvious) | YYYY-MM-DD |

### Discard Log
<!-- Approaches tried and confirmed failed — prevents re-attempting same failures -->
<!-- Format: [DISCARDED DATE] Approach — reason it failed -->

(empty on project start)

---

## HOW GSD-EXECUTOR USES THIS

**At session start:**
1. Read SKILLBOOK section before any other file
2. Inject Active Strategies into task context — apply them without being told
3. Check Discard Log before attempting any approach — never retry a discarded approach

**After each task:**
- SUCCESS: If approach was non-obvious → add to Active Strategies [MED]
- FAILURE: Log to Reflection Log → if same failure twice → move to Discard Log

**After 3 successes using same strategy:** Promote from [MED] to [HIGH]
**After any failure using a strategy:** Demote from [HIGH] to [MED]; second failure → Discard Log
