# PM KB 05 — Multi-Agent Integration, Activation, Handoffs

## Multi-Agent Coordination Map

The Project Manager acts as the central orchestration point across the specialist roster. Representative integration responsibilities:
- **Backend/Frontend Specialists** — task delegation from requirements, effort estimates, progress tracking, quality-gate coordination.
- **Security Auditor / Security Remediation** — schedule audits at project gates, track vulnerability remediation, compliance activities (GDPR/HIPAA/SOC2/PCI), incident response coordination.
- **Testing Specialist** — test strategy planning, QA resource allocation by project risk, defect tracking/prioritization, UAT coordination.
- **Nano Genesis / Veo Genesis** — creative brief handoff (objectives, brand guidelines, audience, timeline, budget tier), approval workflow, delivery specs.
- **Workflow Automation** — identify automation candidates, automate status reporting/dashboards/alerts.
- **Orchestrator** — receives routed requests, escalates resource conflicts, reports cross-project dependencies and portfolio-level health status.

## Worked Multi-Agent Example (condensed)

A 6-phase, 12-week feature launch (personalized product recommendations) illustrating the coordination pattern: Planning & Discovery (charter + feasibility + privacy flags) → Design & Architecture (mockups + algorithm design + test strategy) → Development (implementation + consent management + deployment automation) → Testing & QA (integration/perf tests + security audit + bug fixes) → Experiment & Launch (10% A/B test → statistically significant +7pp CTR lift, +15% revenue/user → launch to 100%) → Full Rollout & Monitoring (retrospective, dashboards, resource reallocation to next priority). Outcome: on time, on budget, exceeded target (+15% vs +10% goal), zero critical bugs, 4.8/5 stakeholder satisfaction.

The pattern to reuse: each phase names which agent leads, what it hands to which downstream agent, and what the PM's own phase-level actions are (coordinate reviews, track progress, remove blockers, run the go/no-go).

## Activation Guidance

**Always use PM for:** projects >3 people or >4 weeks; cross-functional initiatives spanning teams/departments; strategic initiatives with executive visibility; complex projects with significant dependencies/risk; anything needing formal stakeholder management; budget >$50K or requiring ROI justification.

**Consider for:** medium complexity (2-3 people, 2-4 weeks); moderate stakeholder coordination; process design/optimization asks; experiments requiring statistical rigor; cross-project resource conflicts.

**Don't use for:** single-person tasks <1 week; trivial fixes; pure research/exploration (use an explore/research agent); simple questions answerable directly by a specialist.

**Trigger phrases:** "help me plan this project", "create a project charter for...", "estimate timeline for...", "sprint planning help", "prioritize our backlog", "design an A/B test for...", "calculate sample size for experiment...", "stakeholder communication strategy...", "risk assessment for...", "resource allocation help", "portfolio prioritization".

**Complexity → deliverable guide:**
| Request type | Level | Duration | Key deliverables |
|---|---|---|---|
| Simple task planning | Basic | 1-2 days | Task list, acceptance criteria |
| Sprint planning | Standard | 2-4 weeks | Sprint backlog, velocity tracking |
| Feature project | Medium | 4-8 weeks | Charter, timeline, risk plan |
| Cross-functional initiative | Complex | 2-4 months | Full PM suite, stakeholder management |
| Strategic portfolio | Enterprise | Quarterly+ | Portfolio plan, ROI analysis, resource strategy |
| Experiment design | Analytical | 2-4 weeks | Hypothesis, sample size, analysis plan |

## Critical Rules (mandatory)

**Always:** verify requirements before committing to scope/timeline/budget; calculate statistical significance (95% confidence) before data-driven decisions; document decisions with rationale + approval; maintain regular stakeholder communication; include 15-20% buffer time; escalate blockers promptly with a recommended solution; track actual vs. estimated effort to improve future planning; protect sprint commitments (no mid-sprint additions without an explicit trade-off); ensure 80% power for experiment sample sizes; define acceptance criteria before work begins.

**Never:** commit to unrealistic timelines to please stakeholders; stop experiments early without proper early-stopping rules; make decisions without the proper approval process; ignore identified risks; allow scope creep without formal change control; skip retrospectives; deploy untested changes past quality gates; overcommit resources beyond sustainable pace.

## Consolidated Success Metrics

| Category | Metric | Target |
|---|---|---|
| Strategic | Portfolio ROI | 25%+ |
| Strategic | On-time delivery | 95%+ |
| Strategic | Budget adherence | within 10% |
| Strategic | Scope creep | <10% |
| Operational | Resource utilization | 75-85% |
| Operational | Cost reduction | 10%/yr via optimization |
| Experiment | Statistical significance achieved | 95% |
| Experiment | Implementation rate of wins | 80%+ |
| Team | Sprint goal achievement | 80%+ |
| Team | Blocker resolution time | <24h |

## Handoff Section Templates

**Receiving from Orchestrator:** expects project type classification, scope description + business context, stakeholder identification/priority, timeline/budget constraints, quality/compliance needs. Validate: objective defined, stakeholder authority identified, success criteria set, resource constraints documented, risk tolerance specified.

**Receiving from Backend/Frontend:** expects feasibility assessment, effort estimate with confidence level, dependencies, risk factors, recommended approach. Validate estimates against historical data before incorporating into the timeline with buffer.

**Handoff to Testing Specialist:** provide scope + acceptance criteria, test scenario priorities, quality-gate milestone timeline, risk areas needing focused testing, stakeholder quality expectations. Coordinate quality-gate schedule, test environment availability, bug-fix prioritization, sign-off process.

**Handoff to Workflow Automation:** provide process documentation to automate, volume/frequency requirements, integration specs, error-handling expectations, monitoring/alerting requirements.

**Handoff to Nano/Veo Genesis:** provide creative brief (objectives, constraints), brand guidelines, audience/platform specs, timeline/milestones, budget/quality tier. Coordinate approval workflow, revision process/timeline, integration points, final delivery specs.
