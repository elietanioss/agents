---
ref-name: eval-harness
description: Formal evaluation framework for Claude Code sessions implementing eval-driven development (EDD) principles
origin: ECC
tools: Read, Write, Edit, Bash, Grep, Glob
---

# Eval Harness Skill

A formal evaluation framework for Claude Code sessions, implementing eval-driven development (EDD) principles.

## When to Activate

- Setting up eval-driven development (EDD) for AI-assisted workflows
- Defining pass/fail criteria for Claude Code task completion
- Measuring agent reliability with pass@k metrics
- Creating regression test suites for prompt or agent changes
- Benchmarking agent performance across model versions

## Philosophy

Eval-Driven Development treats evals as the "unit tests of AI development":
- Define expected behavior BEFORE implementation
- Run evals continuously during development
- Track regressions with each change
- Use pass@k metrics for reliability measurement

## Eval Types

### Capability Evals
Test if Claude can do something it couldn't before:
```markdown
[CAPABILITY EVAL: feature-name]
Task: Description of what Claude should accomplish
Success Criteria:
  - [ ] Criterion 1
  - [ ] Criterion 2
Expected Output: Description of expected result
```

### Regression Evals
Ensure changes don't break existing functionality:
```markdown
[REGRESSION EVAL: feature-name]
Baseline: SHA or checkpoint name
Tests:
  - existing-test-1: PASS/FAIL
Result: X/Y passed
```

## Grader Types

### 1. Code-Based Grader (Deterministic)
```bash
grep -q "export function handleAuth" src/auth.ts && echo "PASS" || echo "FAIL"
npm test -- --testPathPattern="auth" && echo "PASS" || echo "FAIL"
```

### 2. Model-Based Grader
Use Claude to evaluate open-ended outputs with a rubric (1-5 scale).

### 3. Human Grader
Flag for manual review with risk level: LOW/MEDIUM/HIGH.

## Metrics

### pass@k
"At least one success in k attempts"
- pass@1: First attempt success rate
- pass@3: Success within 3 attempts
- Typical target: pass@3 > 90%

### pass^k
"All k trials succeed"
- Higher bar for reliability
- pass^3: 3 consecutive successes

## Eval Workflow

1. **Define** (Before Coding) — capability evals + regression evals + success metrics
2. **Implement** — write code to pass the defined evals
3. **Evaluate** — run evals, record PASS/FAIL
4. **Report** — generate full eval report

## Eval Storage

```
.claude/
  evals/
    feature-xyz.md      # Eval definition
    feature-xyz.log     # Eval run history
    baseline.json       # Regression baselines
```

## Best Practices

1. **Define evals BEFORE coding** — Forces clear thinking about success criteria
2. **Run evals frequently** — Catch regressions early
3. **Track pass@k over time** — Monitor reliability trends
4. **Use code graders when possible** — Deterministic > probabilistic
5. **Human review for security** — Never fully automate security checks
6. **Keep evals fast** — Slow evals don't get run
7. **Version evals with code** — Evals are first-class artifacts

## Eval Anti-Patterns

- Overfitting prompts to known eval examples
- Measuring only happy-path outputs
- Ignoring cost and latency drift while chasing pass rates
- Allowing flaky graders in release gates
