# Execution State Machine & Pull-Based Context

**Source:** merged from `gsd-2-main/docs/building-coding-agents/03-state-machine-context-management.md` and gsd-2 v2.33 state machine + SuperClaude confidence gates (previously two near-duplicate files: `execution-state-machine.md` + `gsd2-state-machine-context-mgt.md` — combined here, no content dropped, overlap deduped).

## States and transitions

```
PLAN → IMPLEMENT → TEST → DEBUG → VERIFY → DOCUMENT
```

Transitions are **pull-based, not push-based**: the agent doesn't auto-advance. Before entering a state it asks "can I enter it?" and checks that state's entry criteria explicitly.

| State | Entry criteria | Exit criteria |
|---|---|---|
| PLAN | Task created | PLAN.md + dependencies + test strategy written |
| IMPLEMENT | Plan accepted | Code compiles/type-checks + happy path works |
| TEST | Implementation complete | All unit + integration tests green |
| DEBUG | Test failure + hypothesis | Root cause identified + fix applied, or escalate |
| VERIFY | Tests passing | Lint clean + security scan passing + review approved |
| DOCUMENT | Verification passed | API docs + changelog + release notes updated |

### Stuck detection

A unit is stuck if: same state for >3 consecutive attempts, blocked on an external resource, or missing information (unclear spec, unready dependency). Recovery: escalate model tier (Haiku→Sonnet→Opus), or break the unit into smaller sub-units, or ask the user. **Never escalate more than once per task** — if Opus fails after Sonnet, the task is genuinely hard and needs human input, not a third tier jump.

### DEBUG sub-loop (scientific method, matches gsd-debugger)

1. Generate hypothesis → 2. Design a diagnostic test → 3. Run it → 4. Evaluate: supported → FIX; not supported → refine hypothesis (step 1). Checkpoint: after 3 failed hypotheses without progress, escalate tier rather than keep guessing.

## Pull-based context (not push-based)

**Anti-pattern:** load the entire codebase + all references + all error traces before starting. Wastes 40-80% of context on unused information and blurs signal.

**Pattern:** start minimal; the agent explicitly asks for what it discovers it needs — read only the files named in the task, grep for symbols rather than reading whole files, run code locally to observe current behavior instead of reading it all first.

**Working context window per LLM call: 8K–25K tokens.** Rough split: narrow problem statement (~0.5-2K), current state / relevant files only (~2-10K), task + dependencies (~1-2K), agent working space (~3-10K). A pull-based task that needed ~17K tokens end-to-end would cost 100K+ tokens if pushed in upfront.

### Layered memory (outside the working window)

```
Ground truth (disk)  — canonical repo, completed-keys, STATE.md, verification-results
Session memory       — current PLAN.md, current-task reference, in-progress code/tests
Semantic memory       — SKILLBOOK / long-term learnings, agent preferences
```

## Persistence & crash recovery

All state lives on disk, never in an in-memory singleton:
```
.planning/phase-N/  STATE.md · PLAN.md · completed-keys · routing-history · verification-results
```
Recovery after a crash or new session: read STATE.md ("where were we"), read completed-keys ("what's done"), resume from the `continue-here` marker — never re-run completed tasks.

## Context pressure & downgrade rule

If context pressure exceeds ~60% mid-unit: snapshot to STATE.md, close the current unit cleanly (commit progress, log findings), start a new session, resume from STATE.md. A unit that resumes under pressure may downgrade one model tier from where it started, never below the original estimate.

## Atomic commits

Commit after each verified task, never batched across tasks:
```
git commit -m "Task: <name> — <what changed>

Acceptance criteria:
- [x] Criterion 1
Tests: <test> PASSED"
```
Deviation from PLAN.md still gets committed, with a `Deviation: ...` note — never silently absorbed.

## Reference files
- `C:\Users\User\.claude\agents\gsd-executor\gsd-executor.md` — full executor agent (already encodes this state machine in PROCESS/CHECKLIST)
- `C:\Users\User\.claude\agents\gsd-debugger\gsd-debugger.md` — owns the DEBUG state's scientific-method sub-loop in depth
