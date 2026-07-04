# PM KB 03 — Operational Excellence

## Pattern 3.1: Standard Operating Procedure (SOP) Design

Template sections: Process Metadata (ID, version, owner, review cycle, status) → Purpose (business value statement) → Scope (when it applies / doesn't, with explicit ✅/❌ conditions) → RACI matrix per activity → Prerequisites (tools/access, permissions, knowledge/skills, upstream dependencies) → Step-by-step procedure, each step with objective/responsible role/estimated time/detailed input-action-output sub-steps/quality checkpoint/common issues table → Quality Control & Definition of Done with quality metrics table (target, measurement method, review frequency) → Troubleshooting & FAQs (symptom/root cause/solution/prevention format) → Escalation Path (3 levels with response-time SLAs) → Documentation & Records (what to keep, retention period) → Process Review & Improvement (review schedule, how to propose changes, version history) → Appendix (templates/checklists, related SOPs, reference materials).

**SOP design principles:** make it scannable (headers/bullets/tables, not prose walls); be specific ("click the green Merge button" not "merge the code"); include examples; anticipate problems with troubleshooting; keep it living — review and update regularly.

**When to create an SOP:** process repeats >5 times; involves multiple people/handoffs; has quality/compliance requirements; new team members need to learn it; process has had errors or inconsistencies.

## Pattern 3.2: Process Bottleneck Identification & Elimination

**Step 1 — Process mapping:** visual flow with duration/resources/wait-time/throughput/error-rate/cost per step. Compute total lead time (work time + wait time) and cost per unit of output.

**Step 2 — Bottleneck identification (Theory of Constraints):** the bottleneck is the step with lowest throughput — the whole system's output is capped at that rate regardless of other steps' capacity. Additional indicators: high wait-time queuing upstream of a step, resource utilization >85%, high error/rework rate (often a sign of rushed work under capacity pressure). Quantify the business impact of relieving the constraint (throughput delta × annual periods × value per unit − cost of relief = net benefit / ROI).

**Step 3 — Root cause analysis:**
- **5 Whys** — chain "why" until you reach a structural/process root cause, not a symptom (worked example in source traces "low dev throughput" back to "planning doesn't treat tech-debt reduction as explicit work").
- **Fishbone (Ishikawa)** — categorize causes under People / Process / Technology / Environment / Materials-Data, then prioritize by Impact/Effort ratio (highest ratio = do first).

**Step 4 — Elimination strategies (Theory of Constraints 4-step cycle):**
1. **Increase capacity at the constraint** — add resources (hire, reallocate, contractors) or improve resource efficiency (cut low-value meetings, better tooling); always show cost vs. benefit/ROI.
2. **Reduce work at the constraint** — eliminate low-value work (Pareto: 40% of features often deliver 80% of value), reduce complexity (mandate smaller batch sizes — smaller features flow faster even at the same nominal throughput).
3. **Subordinate everything to the constraint** — ensure the bottleneck resource is never idle (maintain a ready-work buffer upstream, fast-SLA response to its questions) and protect it from disruption (dedicated interrupt/support rotation absorbs context-switching cost).
4. **Elevate the constraint** — a major one-time investment that structurally breaks the bottleneck (e.g. 3-month test-automation investment cutting bug-fix time from 60%→20% of dev capacity, doubling feature throughput).

**Step 5 — Continuous improvement:** track baseline metrics over time (lead time, throughput, capacity-on-features %, bug escape rate, cost per unit). **Critical warning:** eliminating one bottleneck reveals the next one (e.g., fix Dev → QA becomes the new constraint) — this is a continuous cycle, not a one-time fix. Run quarterly bottleneck reviews and maintain a prioritized improvement backlog scored by Impact/Effort/ROI.

## Pattern 3.3: Resource Capacity Planning & Optimization

**Available capacity formula:**
```
Available Hours = (Work Days × Hours/Day) − (PTO + Holidays + Meetings + Admin + Context-switching tax)
```
Key insight from the worked example: a nominal "full-time" resource nets only ~40-45% of gross hours as real planned project capacity once meetings/admin/context-switching are deducted — plan against net available hours, never gross.

**Team capacity matrix** — columns: gross hours, available hours, utilization target %, planned capacity, current allocation, remaining (flag negative remaining as over-allocated ⚠️).

**Multi-project allocation** — when total demand exceeds team capacity, resolve via: (1) defer lowest-priority project, (2) reduce scope + add limited contractor hours, (3) add a contractor and rebalance. Build a decision matrix (cost / risk / project impact) rather than picking ad hoc.

**Resource leveling** — smooth uneven demand across months by shifting non-critical-path tasks earlier/later so no month exceeds capacity; only tasks with float can be leveled, never critical-path or fixed-external-deadline tasks.

**Skills-based allocation** — maintain a skill matrix (Basic/Proficient/Expert per person per skill). Decision rule: if a task is critical-path AND needs expert-level skill, pull an expert even from another project; if no expert is available, consider contractor, training, scope reduction, or delay — don't silently accept a suboptimal assignment without naming the velocity/quality trade-off (worked example: non-expert assignment costs ~20% velocity, +15% quality risk).

**Cross-training** — treat "only one person can do X" as a strategic risk (single point of failure), not just a scheduling inconvenience. Cross-training has a J-curve: short-term −10% capacity (training overhead), medium-term breakeven, long-term +30% capacity from eliminated bottlenecks and flexibility.

**Capacity allocation principles:**
1. Reserve 10-20% buffer — never plan to 100% utilization.
2. Protect the critical path with the best resources.
3. Balance specialist (higher productivity, single-point-of-failure risk) vs. generalist (lower productivity, better coverage).
4. Minimize context switching — >2 concurrent projects costs ~40% productivity; ideal is 1 project at 80-100% or 2 at 50-70% each.
5. Plan for ramp-up/ramp-down — new hires need 1-2 months to full productivity; every project needs 2-4 weeks of slower start and 1-2 weeks of handoff/closure at the end.
