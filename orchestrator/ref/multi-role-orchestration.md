# Multi-Role Orchestration with Learning Loop

**Source:** agentic-context-engine (ACE) v2.0 + SuperClaude PM-layer patterns

## Overview

Multi-agent systems benefit from explicit role definition and learning loops. This pattern separates concerns (Agent executes, Reflector analyzes, SkillManager curates) and creates feedback loops that improve performance over time.

## Three-Role Model

### Role 1: Agent (Executor)
**Responsibility:** Execute task using current strategies and skillbook

**When:** Task starts; use current knowledge
**Output:** Task result + execution trace (what was attempted, what worked, what failed)
**Interface:**
- Input: task descriptor + current skillbook strategies
- Output: task result + detailed trace log
- Failure mode: execution error, timeout, hallucination

**Example (GSD Executor):**
```
Task: Implement PDF validation function
  ↓
Agent reads PLAN.md, current code, test suite
  ↓
Agent writes code using known patterns from skillbook
  ↓
Agent runs tests, generates detailed trace (steps taken, errors hit, how resolved)
  ↓
Output: Task complete + trace file
```

### Role 2: Reflector (Analyzer)
**Responsibility:** Analyze execution trace programmatically; extract root causes, patterns, and strategies

**When:** After Agent completes (success or failure)
**Output:** Structured findings (what worked, what failed, why)
**Interface:**
- Input: task trace, task descriptor
- Process: programmatic search, not summarization
  - Find all error patterns
  - Group by root cause
  - Identify successful strategies
  - Detect repeated mistakes
- Output: JSON findings file (root_causes, strategies, deviations)

**Example (gsd-debugger + reflexion):**
```
Trace input:
  - Attempted to call API
  - Got 500 error
  - Retried 3x
  - Eventually timed out

Reflector analysis:
  1. Search trace for "error" → found 500 errors
  2. Group by endpoint → all from /extract endpoint
  3. Check dependencies → API rate limit was hit
  4. Identify strategy: "Rate limiting defensive coding needed"

Output JSON:
  root_causes: [
    { cause: "API rate limit", pattern: "500 error from /extract", solution: "Add exponential backoff" }
  ],
  strategies: [
    { name: "exponential-backoff-v1", source: "task-pdf-validation", date: "2026-07-02" }
  ],
  deviations: ["Used Sonnet instead of Haiku per stuck detection"]
```

### Role 3: SkillManager (Curator)
**Responsibility:** Maintain skillbook quality; add new strategies, refine weak ones, remove low-value ones

**When:** Post-reflection; before next similar task
**Output:** Updated skillbook
**Interface:**
- Input: reflector findings + current skillbook
- Process:
  - Deduplicate new strategies against existing ones
  - Version strategies when refined ("exponential-backoff-v1" → "v2")
  - Remove strategies that haven't helped recent tasks (stale removal)
  - Track strategy source (which task, when learned)
- Output: updated skillbook.json (ordered by ROI)

**Example:**
```
Reflector found: "exponential-backoff strategy"
SkillManager checks: Is this already in skillbook?
  → No "exponential-backoff" found
  → Add to skillbook with metadata:
    {
      name: "exponential-backoff",
      description: "Retry with 2^n delay when API rate limited",
      learned_from: "pdf-validation-task",
      learned_date: "2026-07-02",
      success_rate: "0.95",  // will update as used
      version: "1"
    }

On next API task:
  → Agent checks skillbook, finds exponential-backoff strategy
  → Agent applies it proactively (without being asked)
  → Success rate updates to 0.97
```

## Orchestration Flow

```
┌─────────────────────────────────────────┐
│ Task arrives                            │
│ (e.g., "implement PDF validation")     │
└─────────────────────────────────────────┘
                  ↓
         ┌───────────────────┐
         │ Confidence Check  │ (SuperClaude)
         │ ≥90%: proceed     │
         │ 70-89%: present   │
         │ <70%: ask user    │
         └───────────────────┘
                  ↓
         ┌───────────────────┐
         │ [Agent] Execute   │ (GSD Executor)
         │ With skillbook    │
         │ Generate trace    │
         └───────────────────┘
                  ↓
          ┌──────────────────┐
          │ Success? Trace   │
          │ complete enough? │
          └──────────────────┘
                  ↓
         ┌───────────────────┐
         │ [Reflector]       │ (GSD Debugger)
         │ Analyze trace     │ Programmatic search:
         │ Programmatic      │ - Find error patterns
         │ Search            │ - Group by root cause
         │                   │ - Extract strategies
         │ Output: JSON      │
         │ findings          │
         └───────────────────┘
                  ↓
         ┌───────────────────┐
         │ [SkillManager]    │ (Skillbook curator)
         │ Deduplicate new   │
         │ strategies        │
         │ Version refinement│
         │ Remove stale ones │
         │                   │
         │ Output: updated   │
         │ skillbook.json    │
         └───────────────────┘
                  ↓
    ┌────────────────────────────┐
    │ Return to user:            │
    │ - Task result              │
    │ - Learned strategies       │
    │ - Confidence level         │
    └────────────────────────────┘
                  ↓
           Next similar task
           (skillbook pre-populated)
```

## Confidence Routing (SuperClaude Pattern)

**Pre-execution confidence assessment:**

```
Assess context:
- Task complexity (simple/medium/complex)
- Documentation available? (bool)
- Similar examples in codebase? (bool)
- Team familiarity with domain (0-1.0)
- Failure cost if wrong (low/medium/high)

Compute confidence score (0-100%):
  confidence = complexity_factor × docs_factor × examples_factor × familiarity_factor × cost_factor

Decision:
  if confidence ≥ 90%:
    return "PROCEED" (use current skillbook, no alternatives needed)
  elif confidence 70-89%:
    return "PRESENT_ALTERNATIVES" (offer manual options, continue research)
  else:  # < 70%
    return "ASK_QUESTIONS" (STOP; clarify with user before proceeding)
```

**Example:**
```
Task: Add dark mode toggle to React component

Confidence assessment:
- Complexity: MEDIUM (CSS + state management)
- Docs: YES (React docs + Tailwind docs)
- Examples: YES (3 similar components in codebase)
- Familiarity: 0.9 (team has done this 5x)
- Cost: LOW (non-critical feature, easy to revert)

Score: 0.6 × 1.0 × 1.0 × 0.9 × 1.0 = 0.84 (84%)

Decision: PRESENT_ALTERNATIVES
  - "Approach A: CSS variables (matches existing pattern)"
  - "Approach B: Tailwind dark: prefix (simpler, less control)"
  → Ask user which approach they prefer
  → Continue with chosen approach
```

## Skillbook Maintenance

### Skillbook Structure

```json
{
  "version": "1.0",
  "skills": [
    {
      "name": "exponential-backoff",
      "category": "error-handling",
      "description": "Retry with 2^n delay when API rate limited",
      "trigger_keywords": ["rate limit", "429", "retry"],
      "learned_from": {
        "task": "pdf-validation-task",
        "date": "2026-07-02",
        "source_session": "session-abc123"
      },
      "success_rate": 0.95,
      "last_used": "2026-07-02T14:30:00Z",
      "version": "1",
      "implementation_snippet": "async function retryWithBackoff(fn, maxRetries=5) { ... }"
    }
  ],
  "meta": {
    "last_updated": "2026-07-02T15:00:00Z",
    "total_skills": 42,
    "success_rate_avg": 0.87
  }
}
```

### Deduplication Strategy

When Reflector proposes new strategy:

1. **Exact Match:** Strategy name exists in skillbook → skip (don't re-add)
2. **Semantic Match:** Embedding similarity >0.85 (if available) → merge/version
3. **No Match:** New strategy → add with `version: "1"`, track ROI

**Example:**
```
Reflector finds: "Rate limit handling with exponential backoff"
SkillManager checks:
  - Exact match "exponential-backoff"? → YES
  - In skillbook already? → YES (from 2 days ago)
  - Keep existing or update? → Update success_rate + last_used timestamp

Result: No duplicate; one skill with improved metadata
```

### Stale Removal

**Monthly cleanup:**
```
For each skill in skillbook:
  - Calculate: days_since_last_used
  - Calculate: recent_success_rate (last 10 uses)
  - If days_since_last_used > 30 AND recent_success_rate < 0.70:
    → Archive to skillbook-archived.json (can restore if needed)
    → Note: "Removed: low ROI on API-retry-v0 (30% success, unused 45 days)"

Result: Lean skillbook (high-value strategies only)
```

## Reflector as Programmatic Trace Analyzer

**Anti-Pattern (Summarization):**
```
Trace input: "Tried A, failed with error. Retried, failed again. Then tried B, succeeded."
Summarization output: "A doesn't work, B works better."
→ Vague; unclear root cause; can't transfer to next task
```

**Pattern (Programmatic Analysis):**
```
Trace input: execution log with all steps, errors, decisions

Reflector program:
1. grep for "error" in trace → find all failures
2. group_by(error.endpoint) → categorize by API endpoint
3. for each group:
     - check rate limiting headers
     - count retry attempts
     - measure backoff delay
4. identify pattern: "All failures from /extract; rate limit headers present; no backoff"
5. Generate root cause: "API rate limiting + missing backoff logic"
6. Generate strategy: "Implement exponential backoff for /extract calls"

Output JSON:
  {
    root_cause: "API rate limiting without backoff",
    pattern: "500 errors from /extract after 3 requests",
    evidence: ["rate-limit-remaining: 0", "retry-after: 60"],
    strategy: "exponential-backoff-v1",
    confidence: 0.92
  }
```

**Key innovation:** Searching trace for patterns (not just summarizing) produces actionable, verifiable findings.

## Integration with GSD Pipeline

### During Roadmapping (gsd-roadmapper)
- No learning yet (first pass)
- Confidence check: do we understand the problem? ≥90% → proceed

### During Planning (gsd-planner)
- Read relevant strategies from skillbook
- Apply known patterns to task decomposition
- Pre-populate with successful PLAN.md templates from similar prior tasks

### During Execution (gsd-executor → gsd-debugger)
- Agent executes task using skillbook strategies
- If stuck → Reflector analyzes trace
- SkillManager updates skillbook
- Next similar task starts with improved strategies

### During Verification (gsd-verifier)
- Confidence check: did we achieve the phase goal? ≥95% required

## Example: Cross-Session Learning

**Session 1 — Task: Implement PDF OCR**
```
Agent attempts OCR implementation
Fails: PaddleOCR memory bloat after 100 PDFs
Reflector finds: "Memory not released after model inference"
SkillManager adds: "ocr-memory-management-v1" skill
```

**Session 2 — Task: Batch OCR processing**
```
Agent starts (new session)
Reads skillbook → finds "ocr-memory-management-v1"
Applies strategy proactively: "Explicitly del(model) after each page"
Result: Success on first try (would have failed without skillbook)

Reflector: "Strategy ocr-memory-management-v1 applied successfully"
SkillManager updates: success_rate 1.0 → 1.0 (still perfect)
```

## Reference Files

- `C:\Users\User\.claude\agents\orchestrator\orchestrator.md` — Main orchestrator agent
- `C:\Users\User\.claude\agents\gsd-executor\ref\execution-state-machine.md` — Executor state machine (Agent role)
- `C:\Users\User\.claude\agents\gsd-debugger\gsd-debugger.md` — Reflector (Analyzer role)
- `C:\Users\User\.claude\agents\_shared-ref\core\ecc-memory-persistence.md` — Skillbook persistence patterns

---

**Key Insight:** Separating executor (Agent), analyzer (Reflector), and curator (SkillManager) creates sustainable learning loops. Programmatic trace analysis (not summarization) produces transferable strategies. Confidence routing gates improve quality without overhead.
