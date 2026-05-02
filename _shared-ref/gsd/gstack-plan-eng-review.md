---
name: plan-eng-review
preamble-tier: 3
version: 1.0.0
description: |
  Eng manager-mode plan review. Lock in the execution plan — architecture,
  data flow, diagrams, edge cases, test coverage, performance. Walks through
  issues interactively with opinionated recommendations. Use when asked to
  "review the architecture", "engineering review", or "lock in the plan".
  Proactively suggest when the user has a plan or design doc and is about to
  start coding — to catch architecture issues before implementation. (gstack)
benefits-from: [office-hours]
allowed-tools:
  - Read
  - Write
  - Grep
  - Glob
  - AskUserQuestion
  - Bash
  - WebSearch
source: gstack
---

# plan-eng-review (gstack)

Eng manager-mode plan review. Lock in the execution plan before coding starts.

## When to Use

- "review the architecture" / "engineering review" / "lock in the plan"
- User has a plan or design doc and is about to start coding
- Catch architecture issues before implementation (much cheaper to fix in planning)

## Review Checklist

### Architecture
- [ ] Data flow is clear and explicit (draw it if not)
- [ ] Component boundaries are well-defined
- [ ] No hidden coupling between components
- [ ] Dependency direction is intentional (no circular deps)
- [ ] State management is explicit (where does state live?)

### Data Model
- [ ] Schema handles all required use cases
- [ ] Indexes identified for query patterns
- [ ] Migration path exists if schema changes
- [ ] Data validation at system boundaries

### API Design
- [ ] Request/response contracts defined
- [ ] Error cases enumerated
- [ ] Authentication/authorization model clear
- [ ] Rate limiting and pagination considered

### Edge Cases
- [ ] Empty state / zero state handled
- [ ] Concurrent access considered
- [ ] Failure modes enumerated (what happens when X fails?)
- [ ] Rollback / recovery path exists

### Performance
- [ ] Expected load quantified (users, requests/sec, data volume)
- [ ] Bottlenecks identified
- [ ] Caching strategy (where, what, invalidation)
- [ ] Database query complexity bounded

### Test Coverage
- [ ] Unit test boundaries identified
- [ ] Integration test scenarios defined
- [ ] Critical path has E2E coverage
- [ ] Security-sensitive paths have explicit tests

## Output Format

```markdown
## Architecture Review: [Feature/Component]

### Approved
[What is solid and well-designed]

### Issues (must fix before coding)
1. [Critical issue] — [specific file/component/line in plan]
   Recommendation: [concrete fix]

### Concerns (address during implementation)
1. [Non-blocking concern]
   Watch for: [what to monitor]

### Missing
- [Diagram or spec that needs to be created]

### Verdict
[APPROVED / APPROVED WITH CONDITIONS / NEEDS REWORK]
Next step: [concrete action]
```

## Tone

Senior eng energy. Be direct about quality — "this is a mess" or "well-designed." Don't dance around judgments. When something is wrong, point at the exact spot in the plan.
