# PM KB 04 — Experiment Design & Statistical Rigor

## Pattern 4.1: A/B Testing & Hypothesis Validation Framework

**Template sections:** Experiment Overview (ID, name, owner, status) → Hypothesis (problem statement with baseline + evidence; testable prediction in the form "If we [change], then [metric] will [improve by X] because [reasoning]") → Success Metrics — exactly ONE primary metric (with baseline, minimum detectable effect (MDE), success threshold), 2-4 secondary metrics, and guardrail metrics that must not regress beyond a stated bound → Experimental Design (test type: A/B / A/B/n / multivariate / sequential; population & segmentation with inclusion/exclusion criteria; randomization strategy — unit of randomization, assignment method, sticky vs. not; variant descriptions with implementation complexity/estimate) → Sample Size & Duration (see Pattern 4.2 for the math) → Risk Assessment (risk/impact/probability/severity/mitigation/rollback-criteria table; safety monitoring dashboard + automated alerts + manual review cadence) → Implementation Plan (dev task list with estimates, instrumentation/event-tracking spec, QA checklist including cross-browser + accessibility) → Launch Plan (day-by-day schedule from dev-complete through ramp to 50%, rollback procedure) → Data Collection & Monitoring (instrumentation validation queries, daily traffic-split + primary-metric SQL, automated alert configs for conversion drop / error spike / traffic-split drift).

**Statistical analysis phase:**
- Data quality checks first: Sample Ratio Mismatch (chi-square test on actual vs. expected split — investigate before trusting any result if detected), novelty/primacy effect (compare Day-1 vs. later-day conversion), outlier detection (exclude bot/test accounts by abnormal order counts).
- Primary metric: two-proportion z-test (or t-test for continuous metrics), report absolute lift, relative lift, p-value, AND a confidence interval (Wilson score interval preferred for proportions) — a point estimate alone is not sufficient.
- Secondary & guardrail metrics table: control/treatment/change/p-value/significant?/status for each — guardrails must all stay "safe" for the experiment to proceed regardless of primary-metric win.
- Segmentation analysis — check for differential effects by device/user-type/geography; look for larger effects in specific segments (worked example: mobile benefited 2x more than desktop, and new users 4x more than returning) as it changes the rollout/iteration recommendation.

**Go/No-Go decision framework:**
- **Launch to 100%** if ALL hold: primary metric improved ≥ MDE, p<0.05, no guardrail regressed beyond bound, no segment shows a major negative effect, technical performance clean.
- **Iterate** if: improved but below MDE, or a guardrail concern needs mitigation first, or mixed results across segments (consider targeted rollout).
- **Rollback** if: primary metric regresses, guardrail shows unacceptable harm, or technical issues degrade UX.

Business impact projection should always translate the statistical lift into an annual revenue/cost number and a payback period, using a conservative AOV/value-per-conversion estimate — this is what makes the recommendation actionable to executives.

## Pattern 4.2: Statistical Rigor & Sample Size Calculation

**Core concepts:**
- **Type I error (α, false positive)** — standard threshold 0.05 (95% confidence). Concluding an effect exists when it doesn't wastes resources shipping ineffective changes.
- **Type II error (β, false negative)** — standard threshold 0.20 (80% power). Concluding no effect when one exists misses real opportunities, usually from too-small a sample.
- **Minimum Detectable Effect (MDE)** — the smallest effect size worth being able to detect; set based on business materiality, not statistical convenience. Smaller MDE → larger required sample (longer/pricier test).
- **Statistical power (1−β)** — probability of detecting a true effect if it exists; target 80% minimum, 90% for critical/high-stakes experiments.

**Sample size calculation (proportions — conversion/CTR/signup rates):**
```python
from statsmodels.stats.power import zt_ind_solve_power
from statsmodels.stats.proportion import proportion_effectsize

effect_size = proportion_effectsize(treatment_rate, baseline_rate)
sample_size = zt_ind_solve_power(effect_size=effect_size, alpha=0.05, power=0.80, alternative='two-sided')
```
Key insight: required sample scales inversely with MDE-squared and is much larger for low-baseline-rate events (10% baseline needs ~15K/variant for a +1pp MDE vs. ~660/variant for a +5pp MDE).

**Sample size (continuous metrics — revenue, session duration):** use Cohen's d = MDE / baseline_std via `tt_ind_solve_power`. The hard part is getting an accurate historical standard deviation — revenue metrics especially have high variance from outliers.

**Multiple variants (A/B/n):** more comparisons inflate the overall false-positive rate (3 comparisons ≈ 14% overall, 6 comparisons ≈ 26%). Apply Bonferroni correction (`adjusted α = α / number_of_comparisons`) — this typically raises required sample size 20-50% depending on variant count.

**Duration calculation:**
```
Duration (days) = (Sample Size per Variant × Number of Variants) / (Daily Traffic × Allocation %)
```
Always round up to full weeks to capture day-of-week effects (worked example: weekend e-commerce conversion is materially higher than midweek — a Mon-Thu-only test would be biased low).

**Early stopping rules:** "peeking" at results daily and stopping the moment p<0.05 (without correction) is p-hacking — actual false-positive rate can climb to ~15% instead of the nominal 5%. Two correct approaches: (1) **Fixed horizon** — decide sample size upfront, check results once at the end (simplest, guaranteed 5% FP rate); (2) **Sequential testing** — use adjusted significance boundaries per interim look (Pocock or O'Brien-Fleming boundaries) if early stopping has real business value on long (>4wk) tests.

**Common statistical pitfalls (check every experiment against these before trusting results):**
1. **Insufficient sample size** — underpowered test reports "not significant" when a real (but undetected) effect exists; always calculate required sample before launching.
2. **Sample Ratio Mismatch (SRM)** — actual split deviates meaningfully from planned (chi-square test, flag if p<0.01); causes include randomization bugs or asymmetric bot traffic. Investigate before trusting any downstream result.
3. **Novelty/primacy effect** — early-day lift fades as users habituate; run ≥2 weeks (preferably 4), compare early vs. late days, consider a permanent small holdout to measure lasting effect.
4. **Multiple testing without correction** — testing 10 metrics and reporting the one significant one as "the win" ignores that ~0.5 false positives are expected by chance alone; designate ONE primary metric up front, treat the rest as exploratory, and require p<0.01 for any secondary-metric-driven decision.
5. **Ignoring practical significance** — a huge sample can make a trivial (+0.02pp) lift "statistically significant" while being economically negative once implementation/maintenance cost is included; always evaluate against the MDE/business-value threshold, not just the p-value.
