# GSD Planner 06 — Execution Flow, Structured Returns, Success Criteria

<execution_flow>

<step name="load_project_state" priority="first">
Read `.planning/STATE.md` and parse:
- Current position (which phase we're planning)
- Accumulated decisions (constraints on this phase)
- Pending todos (candidates for inclusion)
- Blockers/concerns (things this phase may address)

If STATE.md missing but .planning/ exists, offer to reconstruct or continue without.

**Load planning config:**

```bash
# Check if planning docs should be committed (default: true)
COMMIT_PLANNING_DOCS=$(cat .planning/config.json 2>/dev/null | grep -o '"commit_docs"[[:space:]]*:[[:space:]]*[^,}]*' | grep -o 'true\|false' || echo "true")
# Auto-detect gitignored (overrides config)
git check-ignore -q .planning 2>/dev/null && COMMIT_PLANNING_DOCS=false
```

Store `COMMIT_PLANNING_DOCS` for use in git operations.
</step>

<step name="load_codebase_context">
Check for codebase map:

```bash
ls .planning/codebase/*.md 2>/dev/null
```

If exists, load relevant documents based on phase type:

| Phase Keywords | Load These |
|----------------|------------|
| UI, frontend, components | CONVENTIONS.md, STRUCTURE.md |
| API, backend, endpoints | ARCHITECTURE.md, CONVENTIONS.md |
| database, schema, models | ARCHITECTURE.md, STACK.md |
| testing, tests | TESTING.md, CONVENTIONS.md |
| integration, external API | INTEGRATIONS.md, STACK.md |
| refactor, cleanup | CONCERNS.md, ARCHITECTURE.md |
| setup, config | STACK.md, STRUCTURE.md |
| (default) | STACK.md, ARCHITECTURE.md |
</step>

<step name="identify_phase">
Check roadmap and existing phases:

```bash
cat .planning/ROADMAP.md
ls .planning/phases/
```

If multiple phases available, ask which one to plan. If obvious (first incomplete phase), proceed.

Read any existing PLAN.md or DISCOVERY.md in the phase directory.

**Check for --gaps flag:** If present, switch to gap_closure_mode.
</step>

<step name="mandatory_discovery">
Apply discovery level protocol (see discovery_levels section, chunk 01).
</step>

<step name="read_project_history">
**Intelligent context assembly from frontmatter dependency graph:**

1. Scan all summary frontmatter (first ~25 lines):
```bash
for f in .planning/phases/*/*-SUMMARY.md; do
  sed -n '1,/^---$/p; /^---$/q' "$f" | head -30
done
```

2. Build dependency graph for current phase:
- Check `affects` field: Which prior phases affect current phase?
- Check `subsystem`: Which prior phases share same subsystem?
- Check `requires` chains: Transitive dependencies
- Check roadmap: Any phases marked as dependencies?

3. Select relevant summaries (typically 2-4 prior phases)

4. Extract context from frontmatter:
- Tech available (union of tech-stack.added)
- Patterns established
- Key files
- Decisions

5. Read FULL summaries only for selected relevant phases.

**From STATE.md:** Decisions -> constrain approach. Pending todos -> candidates.
</step>

<step name="gather_phase_context">
Understand:
- Phase goal (from roadmap)
- What exists already (scan codebase if mid-project)
- Dependencies met (previous phases complete?)

**Load phase-specific context files (MANDATORY):**

```bash
# Match both zero-padded (05-*) and unpadded (5-*) folders
PADDED_PHASE=$(printf "%02d" $PHASE 2>/dev/null || echo "$PHASE")
PHASE_DIR=$(ls -d .planning/phases/$PADDED_PHASE-* .planning/phases/$PHASE-* 2>/dev/null | head -1)

# Read CONTEXT.md if exists (from /gsd:discuss-phase)
cat "$PHASE_DIR"/*-CONTEXT.md 2>/dev/null

# Read RESEARCH.md if exists (from /gsd:research-phase)
cat "$PHASE_DIR"/*-RESEARCH.md 2>/dev/null

# Read DISCOVERY.md if exists (from mandatory discovery)
cat "$PHASE_DIR"/*-DISCOVERY.md 2>/dev/null
```

**If CONTEXT.md exists:** Honor user's vision, prioritize their essential features, respect stated boundaries. These are locked decisions - do not revisit.

**If RESEARCH.md exists:** Use standard_stack, architecture_patterns, dont_hand_roll, common_pitfalls. Research has already identified the right tools.
</step>

<step name="break_into_tasks">
Decompose phase into tasks. **Think dependencies first, not sequence.**

For each potential task:
1. What does this task NEED? (files, types, APIs that must exist)
2. What does this task CREATE? (files, types, APIs others might need)
3. Can this run independently? (no dependencies = Wave 1 candidate)

Apply TDD detection heuristic. Apply user setup detection.
</step>

<step name="build_dependency_graph">
Map task dependencies explicitly before grouping into plans.

For each task, record needs/creates/has_checkpoint.

Identify parallelization opportunities:
- No dependencies = Wave 1 (parallel)
- Depends only on Wave 1 = Wave 2 (parallel)
- Shared file conflict = Must be sequential

Prefer vertical slices over horizontal layers.
</step>

<step name="assign_waves">
Compute wave numbers before writing plans.

```
waves = {}  # plan_id -> wave_number

for each plan in plan_order:
  if plan.depends_on is empty:
    plan.wave = 1
  else:
    plan.wave = max(waves[dep] for dep in plan.depends_on) + 1

  waves[plan.id] = plan.wave
```
</step>

<step name="group_into_plans">
Group tasks into plans based on dependency waves and autonomy.

Rules:
1. Same-wave tasks with no file conflicts -> can be in parallel plans
2. Tasks with shared files -> must be in same plan or sequential plans
3. Checkpoint tasks -> mark plan as `autonomous: false`
4. Each plan: 2-3 tasks max, single concern, ~50% context target
</step>

<step name="derive_must_haves">
Apply goal-backward methodology to derive must_haves for PLAN.md frontmatter.

1. State the goal (outcome, not task)
2. Derive observable truths (3-7, user perspective)
3. Derive required artifacts (specific files)
4. Derive required wiring (connections)
5. Identify key links (critical connections)
</step>

<step name="estimate_scope">
After grouping, verify each plan fits context budget.

2-3 tasks, ~50% context target. Split if necessary.

Check depth setting and calibrate accordingly.
</step>

<step name="confirm_breakdown">
Present breakdown with wave structure.

Wait for confirmation in interactive mode. Auto-approve in yolo mode.
</step>

<step name="write_phase_prompt">
Use template structure for each PLAN.md.

Write to `.planning/phases/XX-name/{phase}-{NN}-PLAN.md` (e.g., `01-02-PLAN.md` for Phase 1, Plan 2)

Include frontmatter (phase, plan, type, wave, depends_on, files_modified, autonomous, must_haves).
</step>

<step name="update_roadmap">
Update ROADMAP.md to finalize phase placeholders created by add-phase or insert-phase.

1. Read `.planning/ROADMAP.md`
2. Find the phase entry (`### Phase {N}:`)
3. Update placeholders:

**Goal** (only if placeholder):
- `[To be planned]` → derive from CONTEXT.md > RESEARCH.md > phase description
- `[Urgent work - to be planned]` → derive from same sources
- If Goal already has real content → leave it alone

**Plans** (always update):
- `**Plans:** 0 plans` → `**Plans:** {N} plans`
- `**Plans:** (created by /gsd:plan-phase)` → `**Plans:** {N} plans`

**Plan list** (always update):
- Replace `Plans:\n- [ ] TBD ...` with actual plan checkboxes:
  ```
  Plans:
  - [ ] {phase}-01-PLAN.md — {brief objective}
  - [ ] {phase}-02-PLAN.md — {brief objective}
  ```

4. Write updated ROADMAP.md
</step>

<step name="git_commit">
Commit phase plan(s) and updated roadmap:

**If `COMMIT_PLANNING_DOCS=false`:** Skip git operations, log "Skipping planning docs commit (commit_docs: false)"

**If `COMMIT_PLANNING_DOCS=true` (default):**

```bash
git add .planning/phases/$PHASE-*/$PHASE-*-PLAN.md .planning/ROADMAP.md
git commit -m "docs($PHASE): create phase plan

Phase $PHASE: $PHASE_NAME
- [N] plan(s) in [M] wave(s)
- [X] parallel, [Y] sequential
- Ready for execution"
```
</step>

<step name="offer_next">
Return structured planning outcome to orchestrator.
</step>

</execution_flow>

<structured_returns>

## Planning Complete

```markdown
## PLANNING COMPLETE

**Phase:** {phase-name}
**Plans:** {N} plan(s) in {M} wave(s)

### Wave Structure

| Wave | Plans | Autonomous |
|------|-------|------------|
| 1 | {plan-01}, {plan-02} | yes, yes |
| 2 | {plan-03} | no (has checkpoint) |

### Plans Created

| Plan | Objective | Tasks | Files |
|------|-----------|-------|-------|
| {phase}-01 | [brief] | 2 | [files] |
| {phase}-02 | [brief] | 3 | [files] |

### Next Steps

Execute: `/gsd:execute-phase {phase}`

<sub>`/clear` first - fresh context window</sub>
```

## Checkpoint Reached

```markdown
## CHECKPOINT REACHED

**Type:** decision
**Plan:** {phase}-{plan}
**Task:** {task-name}

### Decision Needed

[Decision details from task]

### Options

[Options from task]

### Awaiting

[What to do to continue]
```

## Gap Closure Plans Created

```markdown
## GAP CLOSURE PLANS CREATED

**Phase:** {phase-name}
**Closing:** {N} gaps from {VERIFICATION|UAT}.md

### Plans

| Plan | Gaps Addressed | Files |
|------|----------------|-------|
| {phase}-04 | [gap truths] | [files] |
| {phase}-05 | [gap truths] | [files] |

### Next Steps

Execute: `/gsd:execute-phase {phase} --gaps-only`
```

## Revision Complete

```markdown
## REVISION COMPLETE

**Issues addressed:** {N}/{M}

### Changes Made

| Plan | Change | Issue Addressed |
|------|--------|-----------------|
| {plan-id} | {what changed} | {dimension: description} |

### Files Updated

- .planning/phases/{phase_dir}/{phase}-{plan}-PLAN.md

{If any issues NOT addressed:}

### Unaddressed Issues

| Issue | Reason |
|-------|--------|
| {issue} | {why - needs user input, architectural change, etc.} |

### Ready for Re-verification

Checker can now re-verify updated plans.
```

</structured_returns>

<success_criteria>

## Standard Mode

Phase planning complete when:
- [ ] STATE.md read, project history absorbed
- [ ] Mandatory discovery completed (Level 0-3)
- [ ] Prior decisions, issues, concerns synthesized
- [ ] Dependency graph built (needs/creates for each task)
- [ ] Tasks grouped into plans by wave, not by sequence
- [ ] PLAN file(s) exist with XML structure
- [ ] Each plan: depends_on, files_modified, autonomous, must_haves in frontmatter
- [ ] Each plan: user_setup declared if external services involved
- [ ] Each plan: Objective, context, tasks, verification, success criteria, output
- [ ] Each plan: 2-3 tasks (~50% context)
- [ ] Each task: Type, Files (if auto), Action, Verify, Done
- [ ] Checkpoints properly structured
- [ ] Wave structure maximizes parallelism
- [ ] PLAN file(s) committed to git
- [ ] User knows next steps and wave structure

## Gap Closure Mode

Planning complete when:
- [ ] VERIFICATION.md or UAT.md loaded and gaps parsed
- [ ] Existing SUMMARYs read for context
- [ ] Gaps clustered into focused plans
- [ ] Plan numbers sequential after existing (04, 05...)
- [ ] PLAN file(s) exist with gap_closure: true
- [ ] Each plan: tasks derived from gap.missing items
- [ ] PLAN file(s) committed to git
- [ ] User knows to run `/gsd:execute-phase {X}` next

</success_criteria>
