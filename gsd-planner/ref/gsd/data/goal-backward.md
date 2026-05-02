# GSD Goal-Backward Planning Reference
# Source: gsd-roadmapper.md | Operational reference — not a summary.

---

## Core Principle (3 lines)

Forward planning asks "what should we build?" — produces task lists.
Goal-backward asks "what must be TRUE for users when this is done?" — produces success criteria.
Tasks are means. Observable user behaviors are the goal.

---

## The 5-Step Process

**Step 1: State the Phase Goal** — outcome, not task.
- Good: "Users can securely access their accounts"
- Bad: "Build authentication"

**Step 2: Derive Observable Truths (2-5 per phase)**
What users can observe or do when the phase completes. Each truth must be verifiable by a human using the application.

**Step 3: Cross-Check Against Requirements**
- Each truth → at least one requirement supports it (else: gap)
- Each requirement → contributes to at least one truth (else: question if it belongs)

**Step 4: Resolve Gaps**
- Truth with no requirement: add requirement OR mark out of scope
- Requirement that supports no truth: move to different phase OR defer to v2

**Step 5: Validate 100% Coverage** — every v1 requirement maps to exactly one phase. No orphans, no duplicates. Do not proceed until coverage = 100%.

---

## Must-Haves YAML Format

```yaml
must_haves:
  truths:
    - "User can see existing messages"
    - "User can send a message"
  artifacts:
    - path: "src/components/Chat.tsx"
      provides: "Message list rendering"
  key_links:
    - from: "Chat.tsx"
      to: "api/chat"
      via: "fetch in useEffect"
```

---

## Coverage Rule

```
AUTH-01 → Phase 2
AUTH-02 → Phase 2
PROF-01 → Phase 3
...
Mapped: 12/12 ✓
```

If orphaned: create phase, merge into existing, or defer to v2. Decide before proceeding.

---

## Phase Anti-Patterns

**Horizontal layers (BAD):**
```
Phase 1: All database models
Phase 2: All API endpoints     ← Can't verify independently
Phase 3: All UI components     ← Nothing works until end
```

**Vertical slices (GOOD):**
```
Phase 1: Complete Auth feature (DB + API + UI)
Phase 2: Complete Content feature (DB + API + UI)
```

---

## Success Criteria: Bad vs Good

| Bad (task-based) | Good (observable behavior) |
|-----------------|---------------------------|
| "Authentication works" | "User can log in with email/password and stay logged in across sessions" |
| "Build chat component" | "User can see message history and send new messages in real time" |
| "Add error handling" | "User sees clear error message when login fails; can retry immediately" |

---

## Phase Identification Steps

1. Group requirements by natural delivery boundary (use existing category IDs)
2. Identify dependencies: which groups require others?
3. Create phases that complete coherent, verifiable capabilities
4. Assign each v1 requirement to exactly one phase
5. Apply depth calibration: Quick=3-5 phases, Standard=5-8, Comprehensive=8-12

**Depth is compression guidance, not a target.** 3 auth requirements = 1 auth phase, not 3 phases.
