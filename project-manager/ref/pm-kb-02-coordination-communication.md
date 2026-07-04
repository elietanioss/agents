# PM KB 02 — Cross-Functional Coordination

## Pattern 2.1: Comprehensive Project Charter

Foundation document, sections: Problem Statement (current state pain points, desired future state with measurable targets) → Objectives (primary + secondary with success criteria) → Success Criteria table (baseline/target/measurement method) → Definition of Done → Scope (in-scope deliverables + functional/non-functional requirements; explicit out-of-scope list to prevent creep; future-phase deferred items) → Stakeholder Analysis (executive sponsor, project owner, core team table with allocation %, power/interest quadrant segmentation) → Communication Plan (format/frequency/content/owner per stakeholder group) → Timeline (phase breakdown with deliverables, major milestones table with dependencies) → Budget breakdown by category with contingency line (typically 15%) → Risk Assessment (top 5 risks with impact/probability/mitigation/contingency/owner, risk matrix visualization) → Success Factors & Assumptions & Constraints → Governance (decision authority matrix, change control process) → Success Measurement (project health metrics + business impact metrics) → Approval signatures.

**When to use:** project initiation before work begins, rebaselining a troubled project, large cross-functional initiative foundation, stakeholder expectation-setting.

## Pattern 2.2: Stakeholder Communication Matrix

**4 segments**, each with communication objectives + preferred style + engagement plan (format/frequency/content/duration) + success metrics:
1. **Executive Leadership** (high power, variable interest) — 1-page summaries, monthly email brief + quarterly review, response time <48h target.
2. **Product Owners & Business Leaders** (high power, high interest) — weekly status meeting + email update, bi-weekly demo, monthly UAT; decision turnaround <24h target.
3. **Core Project Team** (medium power, high interest) — daily standup, bi-weekly sprint planning/retro, weekly 1-on-1s; blocker resolution <4h target.
4. **Extended Stakeholders** (low power, variable interest) — monthly newsletter, quarterly feedback session, pre-launch training; launch readiness 100% target.

**Communication principles:**
1. Transparency with context — never just "delayed," always cause + mitigation + revised date + impact.
2. Right level of detail for audience — exec gets 1-sentence summary + numbers; team gets story-point/blocker detail.
3. Proactive communication — escalate before being asked: assess impact (1-4h) → communicate with recommendation → request decision with deadline → implement → follow up.
4. Consistent rhythm & format — standard weekly status email template (TL;DR / progress / next week / issues&risks / decisions needed).

**Crisis communication protocol** — activate on: critical production incident, security breach, >4wk timeline slip, >15% budget overrun, key departure, major scope conflict. 5 steps: immediate assessment (1h) → stakeholder notification (2-4h, sponsor gets immediate call) → response plan development (4-8h, root cause + recovery options + trade-offs) → decision & communication (24h) → resolution & retrospective.

**Resistance management patterns** (4 common, each with root cause + response + prevention): "wasn't in the original plan" (scope creep concern → show change-request process), "too busy to participate" (competing priorities → demonstrate ROI, escalate if critical), "not how we do things here" (culture resistance → pilot with willing participants), "wasn't consulted" (communication breakdown → clear RACI, decision summaries after meetings).

**Difficult conversation framework:** describe situation factually → explain business impact → ask for their perspective → collaborate on solution → agree next steps with accountability.

## Pattern 2.3: Dependency Mapping & Critical Path Analysis

**Dependency types:** Task (Finish-to-Start most common; Start-to-Start; Finish-to-Finish; Start-to-Finish rare), Resource (shared people/tools/budget causing conflicts), External (vendor/partner, organizational approvals, technical/infra), Knowledge (expertise requirements, information/decision prerequisites).

**Critical path calculation** — sum durations along each path through the network; the longest path is critical (zero float); other paths have float = critical path duration − their own duration. Protect near-critical paths (<3 days float) as high-risk.

**Schedule compression:**
- **Fast-tracking** — run tasks in parallel that were sequential (e.g. start B after 2 days of A instead of after A finishes); risk: rework if A changes during B's execution.
- **Crashing** — add resources to shorten duration; cost rises non-linearly due to coordination overhead.

**Dependency tracking matrix** — columns: ID, type, dependent task, depends-on, owner, status (✅Complete / ✅On Track / ⚠️At Risk / 🔴Blocked / ⏳Pending), risk level, mitigation.

**Management workflow:** identify at kickoff (5 questions per major task: what must precede it, what resources, what approvals, what info/decisions, what other projects compete for the same resource) → document in matrix with owner + target date + risk → manage proactively (daily blocker check, weekly matrix update, monthly pattern review) → escalate on criteria (blocking critical path, owner unresponsive >24h, resolution slips >2 days, high-risk external dependency) via 3-level escalation (PM → Project Owner → Executive Sponsor, each with 24-48h response windows).

**Cross-project dependency coordination** — bi-weekly meeting with PMs of interdependent projects + shared resource owners + portfolio lead; agenda: status review, conflict resolution, forward planning (next 4 weeks).

**Risk mitigation strategies:** (1) Dependency elimination — redesign to remove it entirely (e.g. frontend uses mock API instead of waiting on backend); (2) Dependency softening — reduce coupling so it's desirable not blocking (e.g. MVP launch, defer remaining features); (3) Dependency buffering — add time buffer around expected resolution date; (4) Dependency redundancy — parallel backup option for critical externals, with an explicit decision point to commit to one.
