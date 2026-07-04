# GSD-2 Capability-Aware Model Routing

**Source:** gsd-2-main/docs/building-coding-agents/21-cost-quality-tradeoff-model-routing.md

## Overview

Tier-based routing (Light/Standard/Heavy) is binary and doesn't account for task *specialization*. Capability-aware routing adds a 7-dimension profile to classify units by their capability requirements, enabling smarter model selection.

## 7-Dimension Capability Profile

Each dimension scored 0-1 (requirement level for the task):

| Dimension | Meaning | Examples of High-Requirement Tasks |
|-----------|---------|-----------------------------------|
| **coding** | Code generation + implementation | Build feature, fix bug, refactor |
| **debugging** | Root cause analysis, hypothesis testing | Why is this failing? Trace call stack |
| **research** | Synthesis, literature review, comparison | Evaluate libraries, competitive analysis |
| **reasoning** | Logical inference, proof, edge case analysis | Design architecture, threat model |
| **speed** | Fast token throughput (long outputs) | Generate boilerplate, write docs, expand |
| **longContext** | Handling 100k+ token inputs | Analyze 50K lines of code, synthesize corpus |
| **instruction** | Following complex multi-step procedures | Migrate schema across 5 systems, orchestrate multi-agent |

## Unit-Type Capability Requirements (Defaults)

Map each GSD unit type to a weighted capability vector:

### Coding Tasks
```yaml
execute-task:
  coding: 0.9
  debugging: 0.6
  reasoning: 0.5
  research: 0.1
  speed: 0.4
  longContext: 0.3
  instruction: 0.2
# → Route to Sonnet (Haiku may fail; Opus overkill)

refactor:
  coding: 0.8
  longContext: 0.7  # read existing code
  reasoning: 0.6    # impact analysis
  debugging: 0.4
  research: 0.1
# → Route to Sonnet or Opus (Haiku fails on longContext)

migrate-schema:
  coding: 0.7
  instruction: 0.8  # multi-step process
  longContext: 0.6  # understand all affected code
  reasoning: 0.5
  debugging: 0.4
# → Route to Opus (instruction + longContext critical)
```

### Planning Tasks
```yaml
decompose-feature:
  reasoning: 0.9    # break down logically
  instruction: 0.6  # multi-step breakdown
  longContext: 0.4  # read requirements
  coding: 0.1
  debugging: 0.0
  research: 0.1
  speed: 0.3
# → Route to Haiku (no coding/debugging; pure logic)

write-plan:
  instruction: 0.8  # follow structure
  reasoning: 0.6    # reason about dependencies
  speed: 0.7        # long output
  coding: 0.2       # snippets only
  research: 0.1
  debugging: 0.0
  longContext: 0.3
# → Route to Haiku or Sonnet (Opus overkill for pure planning)
```

### Research Tasks
```yaml
literature-review:
  research: 0.9
  reasoning: 0.7    # synthesize contradictions
  speed: 0.5        # long output
  coding: 0.0
  debugging: 0.0
  instruction: 0.4  # multi-source gathering
  longContext: 0.3
# → Route to Haiku (no coding; pure synthesis)

competitive-analysis:
  research: 0.9
  reasoning: 0.8
  speed: 0.6
  instruction: 0.5
  coding: 0.0
  debugging: 0.0
  longContext: 0.2
# → Route to Haiku or Sonnet (pure research, no context burden)

evaluate-architecture:
  reasoning: 0.9    # deep analysis
  longContext: 0.7  # read designs
  research: 0.6     # compare patterns
  instruction: 0.5
  coding: 0.2       # pseudo-code examples
  debugging: 0.1
  speed: 0.3
# → Route to Opus (reasoning + longContext = Opus baseline)
```

## Routing Decision Algorithm

For a given task:

1. **Classify the unit.** Determine the capability vector (use defaults or user-provided overrides).
2. **Score the unit.** Compute weighted profile score:
   ```
   score = sum(capability[i] * weight[i] for i in dimensions)
   # where weight = [coding:3, debugging:3, reasoning:2, research:1, speed:1, longContext:2, instruction:1]
   ```

3. **Select tier:**
   - score ≥ 8: → **Opus** (heavy reasoning + multiple dimensions)
   - 4 ≤ score < 8: → **Sonnet** (moderate complexity)
   - score < 4: → **Haiku** (low complexity, pure synthesis)

4. **Apply context pressure:** If working under budget pressure (>60% context used):
   - If score < 5: downgrade Sonnet → Haiku
   - If score < 7: downgrade Opus → Sonnet
   - Never downgrade below Haiku

5. **Store routing decision.** Record in `.gsd/routing-history.json`:
   ```json
   {
     "unit_id": "feature-sync-engine-1",
     "unit_type": "execute-task",
     "capability_vector": {
       "coding": 0.9,
       "debugging": 0.6,
       "reasoning": 0.5,
       "research": 0.1,
       "speed": 0.4,
       "longContext": 0.3,
       "instruction": 0.2
     },
     "score": 7.2,
     "selected_tier": "Sonnet",
     "context_pressure": 0.45,
     "completion_status": "PASSED|FAILED",
     "failure_reason": null,
     "user_feedback": null
   }
   ```

## Adaptive Learning from Routing History

After each unit completes, update routing decisions:

1. **Failure analysis:** If unit failed, check selected tier:
   - If tier was Haiku and failure rate >20% for similar units → bump to Sonnet
   - If tier was Sonnet and failure rate >20% → bump to Opus
   - Record reason (e.g., "Haiku timeout on 50K-line analysis")

2. **User feedback:** Manually override tier with 2× weight:
   - User says "Sonnet struggles with this type" → bump to Opus for next similar unit
   - User says "Haiku is overkill" → downgrade to research-only Haiku

3. **Convergence:** After 5 units of the same type with consistent tier selection, that tier becomes default for that type.

**Example Adaptive Update:**
```
Routed feature-sync-1 to Haiku (score 3.2)
  → FAILED: "Haiku timeout on architecture evaluation"
  
Next feature-sync-2 detected as same type
  → Bump Haiku baseline to Sonnet
  → Routed to Sonnet instead
  → PASSED
  
After 3 more sync features all succeed on Sonnet
  → Update default for feature-sync-* to Sonnet
```

## Token Savings Estimates

Capability routing vs tier-only routing:

- **Research tasks:** 15-25% token savings (Haiku for pure synthesis vs Sonnet for "Standard")
- **Planning tasks:** 10-20% token savings (Haiku for decomposition vs Sonnet for planning)
- **Coding tasks:** 0-5% (likely Sonnet for both; no savings)
- **Debugging tasks:** 5-15% (Haiku for log analysis vs Sonnet for complex traces)

**Overall:** 10-15% cost reduction with equivalent quality (or better via adaptive learning).
