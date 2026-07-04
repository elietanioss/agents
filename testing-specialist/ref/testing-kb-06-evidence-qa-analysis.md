# Testing KB 06 — Evidence Collection, QA Analysis, Handoffs

## SECTION 12: VISUAL EVIDENCE COLLECTION

**Pattern 36: Playwright Visual Evidence Capture**
```typescript
test('capture responsive layouts', async ({ page }, testInfo) => {
  await page.goto('/')
  await page.screenshot({ path: `qa-screenshots/responsive-${testInfo.project.name.toLowerCase()}.png`, fullPage: true })
})

test('capture dark mode', async ({ page }) => {
  await page.goto('/')
  await page.screenshot({ path: 'qa-screenshots/light-mode.png' })
  await page.click('[data-testid="theme-toggle"]')
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'qa-screenshots/dark-mode.png' })
})
```

**Pattern 37: Evidence-Based QA Report**
```typescript
interface QAReport {
  screenshots: string[]
  issues: Array<{ description: string; evidence: string; priority: 'Critical' | 'Medium' | 'Low' }>
  rating: string
  productionReady: boolean
}

export function generateQAReport(data: QAReport): string {
  return `# QA Evidence-Based Report
## Screenshots: ${data.screenshots.length} captured
## Issues Found: ${data.issues.length}
${data.issues.map((i, idx) => `${idx + 1}. [${i.priority}] ${i.description} - Evidence: ${i.evidence}`).join('\n')}
## Rating: ${data.rating}
## Production Ready: ${data.productionReady ? 'YES' : 'NO - NEEDS WORK'}`
}
```
Every reported issue must carry an `evidence` pointer (screenshot path or log excerpt) — no narrative-only findings.

---

## SECTION 14: TEST RESULTS ANALYSIS

**Pattern 40: Python Test Analyzer**
```python
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

class TestResultsAnalyzer:
    def __init__(self, results_path):
        self.results = pd.read_json(results_path)

    def analyze_coverage(self):
        return {
            'line': self.results['coverage']['lines']['pct'],
            'branch': self.results['coverage']['branches']['pct'],
            'gaps': [f for f, c in self.results['coverage']['files'].items() if c['lines']['pct'] < 80]
        }

    def assess_release_readiness(self):
        criteria = {
            'pass_rate': self.results['numPassedTests'] / self.results['numTotalTests'] >= 0.99,
            'coverage': self.results['coverage']['lines']['pct'] >= 80,
            'no_critical': len([f for f in self.results.get('failures', []) if 'critical' in f.get('tags', [])]) == 0
        }
        return {'ready': all(criteria.values()), 'criteria': criteria}
```

**Pattern 41: Release Readiness Report (TS)**
```typescript
export function generateReleaseReport(tests: any, coverage: any, perf: any) {
  const criteria = {
    testPassRate: tests.passRate >= 0.99,
    codeCoverage: coverage.total >= 80,
    performanceSLA: perf.p95 < 500,
    noFlakiness: tests.flakyRate < 0.02
  }
  return {
    ready: Object.values(criteria).every(Boolean),
    recommendation: Object.values(criteria).every(Boolean) ? 'GO' : 'NO-GO',
    blockers: Object.entries(criteria).filter(([_, v]) => !v).map(([k]) => k)
  }
}
```

---

## SECTION 15: TOOL EVALUATION & WORKFLOW

**Pattern 42: Testing Tool Scorer** — weighted criteria (functionality 0.25, usability 0.20, performance 0.15, security 0.15, integration 0.10, support 0.08, cost 0.07); `evaluateTool()` sums `score × weight` per criterion; `compareTools()` ranks candidates by that composite score.

**Pattern 43: Process Optimizer**
```typescript
interface ProcessStep { name: string; duration: number; errorRate: number; automationPotential: number }

export function analyzeWorkflow(steps: ProcessStep[]) {
  return {
    totalDuration: steps.reduce((s, step) => s + step.duration, 0),
    bottlenecks: steps.filter(s => s.duration > 30),
    automationCandidates: steps.filter(s => s.automationPotential > 0.7),
    errorHotspots: steps.filter(s => s.errorRate > 0.05)
  }
}
```

---

## SECTION 16: REALITY CHECKING (Fantasy Approval Prevention)

**Pattern 44: Reality Checker**
```typescript
const FANTASY_INDICATORS = [
  { pattern: /zero issues found/i, message: 'Zero issues is unrealistic' },
  { pattern: /100%|98%|99%/i, message: 'Perfect scores are fantasy' },
  { pattern: /A\+|perfect/i, message: 'A+ without evidence is fantasy' }
]

export function checkForFantasy(report: string): string[] {
  return FANTASY_INDICATORS.filter(i => i.pattern.test(report)).map(i => i.message)
}

export function assessQuality(metrics: { issues: number; criticalIssues: number; compliance: number }) {
  if (metrics.issues === 0) return { rating: 'INVALID', ready: false, reason: 'Zero issues is unrealistic' }
  if (metrics.criticalIssues > 0) return { rating: 'FAILED', ready: false, reason: 'Critical issues exist' }
  if (metrics.compliance < 0.9) return { rating: 'NEEDS WORK', ready: false, reason: 'Spec not fully implemented' }
  if (metrics.issues <= 3) return { rating: 'B+', ready: true, reason: 'Good with minor issues' }
  return { rating: 'B-', ready: false, reason: 'Several issues need attention' }
}
```
Treat "zero issues" or "100%/A+" self-reports as a signal to re-audit, not a signal of quality — a genuinely thorough pass on nontrivial code almost always finds *something*.

---

## SECTION 17: HANDOFF & ACTIVATION

### Handoff templates
```
From Security Specialist:
  Handoff Context: Security Hardening: [measures]; Attack Vectors to Test: [list]
  Your Mission: Create security test suite

From Backend Specialist:
  Handoff Context: API Endpoints: [contracts]; Database Schema: [tables]
  Your Mission: Create API + integration tests

From Frontend Specialist:
  Handoff Context: Components: [list]; User Flows: [critical paths]
  Your Mission: Create E2E + a11y tests

To Deployment:
  Handoff Context: Tests: [all passing]; Coverage: [%]; Performance: [benchmarks]
  Status: READY FOR DEPLOYMENT
```

### Activation triggers
"Set up testing for this project", "Create test suite for...", "Test this API/component", "Add E2E tests", "Check test coverage", "Performance test this", "Accessibility test", "Analyze test results".

### Success metrics
| Metric | Target |
|--------|--------|
| Pass Rate | >99% |
| Coverage | >80% |
| E2E Flakiness | <2% |
| Test Time | <10min |
| Defect Escape | <1% |
