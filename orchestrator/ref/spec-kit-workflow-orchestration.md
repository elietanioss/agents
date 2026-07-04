# Spec-Kit Workflow Orchestration Patterns

**Source:** spec-kit/docs/reference/workflows.md + spec-kit/.specify/memory/constitution.md

## Overview

Spec-Kit defines workflow orchestration as a sequence of **commands**, **gates**, and **branches** that chain multiple planning/execution steps together. This fills a GSD gap: multi-phase orchestration with inter-phase gates and conditional branching.

## Core Workflow Concepts

### 1. **Commands** (Sequential Execution)
A command is a single step in a workflow that runs to completion before the next step.

```yaml
workflow:
  name: Feature Development
  steps:
    - command: /speckit.specify
      description: "Define feature specification"
      
    - command: /speckit.plan
      description: "Break specification into tasks"
      
    - command: /speckit.implement
      description: "Execute task plan"
```

### 2. **Gates** (Conditional Advancement)
A gate is a checkpoint that must pass before the next step executes. Gates can check:
- Constitution compliance (does this violate principles?)
- Artifact existence (did prior step produce required outputs?)
- Quality metrics (did tests pass? coverage >80%?)

```yaml
steps:
  - command: /speckit.specify
  
  - gate: constitution-check
    rules:
      - All features trace to vision (Principle I)
      - MECE decomposition verified (Principle II)
      - No circular dependencies (Principle III)
    on_fail: "Stop and ask for revision"
    
  - command: /speckit.plan
    only_if: constitution-check passed
```

### 3. **Branches** (Conditional Routing)
A branch routes workflow based on conditions. Example: if previous phase detected gaps, route to gap-closure planning instead of next phase.

```yaml
steps:
  - command: /speckit.implement
  
  - check: goal-achieved?
    if_yes:
      - command: /speckit.verify
      - command: /speckit.document
    if_no:
      - command: /gsd-planner (gap-closure mode)
      - loop_back: to implement
```

### 4. **Loops** (Retry Logic)
A loop retries a step until a condition is met. Useful for:
- Re-planning after failed attempts
- Multi-iteration verification/refinement

```yaml
steps:
  - loop: until all-tests-pass
    max_iterations: 3
    steps:
      - command: /speckit.implement
      - command: /speckit.verify
```

## Multi-Phase Orchestration Pattern

Spec-Kit's workflow model maps to GSD phases:

```
Phase 1 (e.g., Foundation)
  → Planning command (/gsd-planner)
  → Gate: Are must-haves achievable? (constitution-check)
  → If yes: Execute (/gsd-executor)
  → If no: Revise plan (loop back to planning)
  
Phase 1 Verify
  → Verify command (/gsd-verifier)
  → Check: Is phase goal achieved?
  → If yes: Mark COMPLETE, advance to Phase 2
  → If no: Create gap-closure plan (/gsd-planner gap-closure mode)
  
Gap Closure (optional)
  → Execute (/gsd-executor)
  → Verify (/gsd-verifier re-verification mode)
  → If still gaps: escalate to debugging (/gsd-debugger)
  
Phase 2 (next phase)
  → [Repeat pattern]
```

## Three-Phase Development Model (from Spec-Kit)

Spec-Kit distinguishes three project types with different workflows:

### 0-to-1 (Greenfield)
**Workflow:** Spec → Plan → Implement → Verify → Ship

Characteristics:
- No existing code
- Architecture decisions are greenfield
- Full spec-driven approach works

GSD mapping: Standard roadmap → plan → execute → verify cycle

### Creative Exploration (Prototype/Spike)
**Workflow:** Minimal spec → Spike → Learn → Refine spec → Implement

Characteristics:
- Uncertain requirements
- Need to validate architectural assumptions
- Multiple iterations expected

GSD mapping: Roadmap → spike phase → spec refinement → plan phases

**Key difference:** Spike phase comes FIRST, then architecture decisions firm up.

### Brownfield (Existing System Enhancement)
**Workflow:** Assess codebase → Spec deltas → Prioritize → Implement

Characteristics:
- Existing code and architecture
- Changes constrained by existing design
- Risk assessment critical

GSD mapping: Roadmap includes "Compatibility assessment" phase before planning

## Constitution Gates in Workflow

**Key pattern:** Spec-Kit binds constitution checks to workflow gates. Every plan must verify:

```yaml
constitution-check:
  Principle I - Vision Clarity:
    verify: "Every task traces to a feature traces to capability traces to vision"
    
  Principle II - MECE:
    verify: "No duplicate tasks; all capabilities covered"
    
  Principle III - Sequencing:
    verify: "No circular dependencies; critical path identified"
    
  Principle IV - Incremental Value:
    verify: "Each task ships or unblocks value; no scaffolding-only tasks"
    
  Principle V - Risk Ordering:
    verify: "High-risk/high-learning tasks scheduled first"
    
on_all_pass: → Proceed to execution
on_any_fail: → Stop, ask for revision (do not proceed)
```

## Workflow.md Format for Multi-Phase Projects

**When to use:** Projects with 3+ phases or conditional branching

```yaml
---
project: Feature Name
phases: 3
workflow_type: standard  # or: exploration, brownfield
---

# Workflow: [Project Name]

## Phase 1: Foundation

### Step 1.1: Plan
command: /gsd-planner
input: ROADMAP.md (Phase 1)
output: .planning/phase-1/PLAN.md

### Step 1.2: Constitution Gate
gate: constitution-check
checks:
  - Vision-traced: Every task → feature → vision
  - MECE: No duplicates, all capabilities covered
  - Dependencies: No circular deps
on_pass: → Proceed to execute
on_fail: → Ask for plan revision

### Step 1.3: Execute
command: /gsd-executor
input: .planning/phase-1/PLAN.md
output: .planning/phase-1/SUMMARY.md

### Step 1.4: Verify
command: /gsd-verifier
input: ROADMAP.md (Phase 1 exit criteria)
output: .planning/phase-1/VERIFICATION.md
check:
  - EXISTS: All artifacts present?
  - SUBSTANTIVE: Real implementation, not stubs?
  - WIRED: Connected to system?
  
on_pass: Phase 1 complete
on_fail: Branch to gap closure

### Step 1.5: Gap Closure (if needed)
branch:
  if: verification.status == FAIL
  then:
    - command: /gsd-planner (gap-closure mode)
      input: verification.gaps
      output: .planning/phase-1/GAP-PLAN.md
    - command: /gsd-executor
      input: .planning/phase-1/GAP-PLAN.md
    - loop_back: to verify (re-verification mode)

---

## Phase 2: Features

[Similar structure]

---

## Post-Phase Retrospective

gate: learning-capture
after_each_phase:
  - What went well vs estimated?
  - What SKILLBOOK patterns did we learn?
  - Update STATE.md for next phase
```

## Convergence Pattern (Spec-Kit `/speckit.converge`)

Spec-Kit defines convergence as a **specification ↔ implementation feedback loop**:

1. Spec defines what should be built
2. Code is built (may diverge from spec)
3. Convergence command: "Assess code against spec, find divergences"
4. If divergences: "Is this intentional? Approved? Add to spec or fix code?"
5. If unintended: Create gap-closure plan

**GSD Mapping:** This is gsd-verifier's job (check goal achieved), but missing the spec-update feedback.

**Enhancement idea:** After gsd-verifier finds gaps, consider:
- Are gaps intentional deviations from spec? (update ROADMAP.md)
- Or unfinished work? (create gap-closure plan)

## Multi-Backend Routing Pattern (for Research)

Spec-Kit's workflow model can route research tasks to multiple sources with fallback:

```yaml
workflow:
  - command: research-competitive-landscape
    backends:
      primary: /gsd-phase-researcher (web search)
      fallback1: agent-reach (Reddit, Twitter, GitHub)
      fallback2: manual (ask user for domain context)
    retry_logic: "Try primary; if timeout or insufficient, try fallback1"
```

**GSD Mapping:** gsd-phase-researcher could adopt this multi-backend model (currently single-strategy).

## Orchestrator Integration Points

If building workflow orchestration into GSD orchestrator:

1. **Workflow registry:** Map workflows to project types (greenfield/exploration/brownfield)
2. **Gate executor:** Run constitution checks before phase execution
3. **Branch resolver:** Route to gap-closure vs next phase based on verification
4. **Retry logic:** Handle failed executions with tier escalation + loop-back
5. **Phase router:** Select which phase runs next based on prior completion

## Example: Brownfield Enhancement Workflow

```yaml
workflow_type: brownfield

steps:
  - name: "Compatibility Assessment"
    command: /gsd-phase-researcher
    query: "How does existing architecture constrain this feature?"
    output: .planning/compatibility-assessment.md
    
  - gate: architecture-review
    rule: "Does assessment show feasibility? (gate: confidence >= 75%)"
    
  - name: "Phase 1: Spec"
    command: /gsd-planner
    input: compatibility-assessment.md
    constraint: "Plan must work within existing architecture"
    
  - gate: constitution-check
    (standard constitution validation)
    
  - name: "Phase 1: Implement"
    command: /gsd-executor
    
  - name: "Phase 1: Verify"
    command: /gsd-verifier
    
  - branch:
      if: gaps_found
      then: gap-closure workflow (loops back)
      else: proceed to Phase 2
```

The key: **Brownfield projects frontload compatibility assessment** before detailed planning.

