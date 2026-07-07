# cross-cutting.md — Cross-Cutting Concerns
### File 6 of 10 · Knowledge base for a domain-agnostic solution-architect agent

**Tag legend (see `fundamentals.md` for full definitions):** `[T]` timeless · `[TS]` time-sensitive, refresh per `sources-and-currency.md` · `[UNVERIFIED]` heuristic in use, not a citable fact.

This file treats each cross-cutting concern as a lens the agent applies to *any* system class, not a checklist item to tick once. Every concern below states the timeless principle `[T]`, the specific tools/standards that currently implement it `[TS]`, and — per concern — how it differs by system class, cross-referencing `domain-matrix.md`. Where a concern touches a one-way door (`fundamentals.md` §7), that link is called out explicitly, because cross-cutting concerns are where irreversible mistakes hide: they rarely appear in a single component's design review, only in how components combine.

---

## 1. Scalability

**Vertical scaling** (bigger machine) vs. **horizontal scaling** (more machines) is the foundational fork. Horizontal scaling requires **statelessness** — or explicit, deliberate state externalization — because you cannot add instance N+1 of a stateful process and expect it to serve requests that assume instance N's in-memory state.

**RULE 1.1** — IF a component holds request-relevant state only in local memory or local disk (session data, in-process cache, sticky uploads) THEN it cannot horizontally scale without either (a) externalizing that state (shared cache, DB, object store) or (b) sticky routing, which caps effective horizontal scaling and reintroduces a single point of failure per shard. **RATIONALE:** this is the single most common reason a "just add more instances" plan fails in practice — the plan is a deployment change, but the actual blocker is an architectural one (state placement), and deployment tooling cannot fix it.

**RULE 1.2** — IF vertical scaling still has meaningful headroom (the workload isn't yet hitting the largest available instance class) AND the team is small THEN prefer vertical scaling first — it is a two-way door (resize, redeploy) versus horizontal scaling's frequent one-way-door consequences (state externalization decisions, data partitioning schemes that are expensive to undo). Reach for horizontal scaling when vertical headroom is provably exhausted or when availability (not just throughput) requires multiple instances regardless of size.

**Differs by system class** (`domain-matrix.md`): web/distributed systems default to horizontal scaling behind a load balancer; embedded/RTOS systems typically have exactly one target device and "scaling" means algorithmic/resource budget work within a fixed footprint, not adding nodes; data/ML training scales by sharding data or model parallelism (a distinct discipline from request-serving scaling); HPC scales by node count in a scheduler-managed cluster with interconnect topology as a first-class constraint most other classes never encounter; blockchain systems face scaling constraints from consensus itself (see `domain-matrix.md`), where adding nodes can *reduce* throughput rather than increase it — the opposite of the default web intuition.

---

## 2. Reliability and failure-mode analysis

**RULE 2.1** — IF a system has never had its failure modes enumerated *before* an incident forces the enumeration THEN treat that as a verification gap, not a documentation nicety — see `verification.md` for how this ties to pre-build sign-off. Reliability engineering starts from "how does this fail," not "does this work" — the two questions have different answers and only the first one scales to systems with many components.

**Method: FMEA (Failure Mode and Effects Analysis).** Enumerate, per component: the **failure mode** (how it fails), the **effect** (what happens downstream), the **cause**, and — in FMECA, the criticality-extended variant — a **Risk Priority Number** (severity × occurrence × detectability, or a locally calibrated equivalent). **Source:** originated in US military practice, MIL-STD-1629A, *"Procedures for Performing a Failure Mode, Effects and Criticality Analysis,"* 1980 (canceled 1998 without replacement but still widely used as a reference baseline); standardized for general use as IEC 60812, *"Failure modes and effects analysis (FMEA and FMECA),"* first published as IEC 812:1985, current edition IEC 60812:2018; automotive-specific variant SAE J1739, *"Potential Failure Mode and Effects Analysis in Design (Design FMEA), Manufacturing and Assembly Processes (Process FMEA), and Software (Software FMEA)."` `[T]` for the method; `[TS]` for the current standard edition numbers.

**RULE 2.2** — IF a component sits on a path a user-visible SLO depends on (see §6) THEN it needs at least a lightweight FMEA pass — one row per plausible failure mode, effect, and current mitigation (or "none," which is itself the finding) — before the design is considered done, not after the first production incident. **RATIONALE:** FMEA's value is that it is systematic and per-component; ad hoc "what could go wrong" brainstorming reliably misses the boring, high-probability failure modes (disk full, dependency timeout, clock skew) in favor of the memorable dramatic ones.

**RULE 2.3** — IF the system is safety-critical (see §4 below) THEN FMEA is not optional and is typically a documented deliverable required by the applicable functional-safety standard, not merely a recommended practice — check `domain-matrix.md` for which standard governs and what the standard mandates as the specific failure-analysis deliverable (e.g., ISO 26262 requires this at the item and system level with ASIL-dependent rigor).

### Resilience patterns (once failure modes are known, these are how you survive them)

**Source:** Michael T. Nygard, *Release It!: Design and Deploy Production-Ready Software*, Pragmatic Bookshelf, 1st ed. 2007, 2nd ed. 2018 (2nd edition adds cloud/container-era material; the core stability-pattern chapter is unchanged in intent). `[T]` for the patterns; `[TS]` for specific library/tool implementations (see `sources-and-currency.md`).

| Pattern | What it does | IF/THEN |
|---|---|---|
| **Timeout** | Bounds how long a caller waits for a dependency | **RULE 2.4** — IF a call crosses a process or network boundary THEN it must have an explicit timeout shorter than the caller's own SLO budget allows for that hop. No timeout means "wait forever," which converts one slow dependency into an unbounded resource leak in every caller. |
| **Retry with backoff + jitter** | Re-attempts a failed call without synchronizing all callers into a retry storm | **RULE 2.5** — IF a call is retried on failure THEN the retry must use exponential backoff *with jitter*, not a fixed interval or backoff-without-jitter. **RATIONALE/Source:** Marc Brooker, "Exponential Backoff and Jitter," AWS Architecture Blog, 2015 (updated 2023) — fixed-interval or non-jittered exponential retry causes synchronized "thundering herd" retry storms across many clients that amplify rather than relieve load on a recovering dependency; the AWS Builders' Library companion piece "Timeouts, retries, and backoff with jitter" documents this as standard practice across Amazon's internal services. `[T]` for the mechanism; `[TS]` for specific jitter algorithm recommendations (full jitter vs. equal jitter vs. decorrelated jitter — see the source for current guidance). |
| **Circuit breaker** | Stops calling a dependency that is already failing, failing fast instead of piling up timeouts | **RULE 2.6** — IF a dependency's failure rate crosses a threshold THEN a circuit breaker should open and fail fast for a cool-down period before probing again (half-open state) — this is a two-way door (tunable thresholds) but its *absence* on a critical path is close to a one-way door in practice, because retrofitting it after an outage caused by its absence is expensive under pressure. **RATIONALE:** Nygard's original motivating case is a slow dependency exhausting caller thread pools, which cascades the failure upstream — a circuit breaker converts a slow failure into a fast, contained one. |
| **Bulkhead** | Isolates resource pools (threads, connections) per dependency so one saturated dependency cannot starve others | **RULE 2.7** — IF a service calls multiple downstream dependencies from a shared resource pool (one thread pool, one connection pool) THEN a single slow dependency can starve calls to healthy dependencies — partition pools per dependency (or per criticality class) so failure is contained to its own compartment, the same principle as a ship's bulkheads. |
| **Graceful degradation** | Serves a reduced but still useful response when a non-critical dependency is unavailable, instead of failing the whole request | **RULE 2.8** — IF a request depends on both a critical-path dependency and a non-critical enhancement (e.g., a recommendations widget, a "recently viewed" strip) THEN the non-critical dependency's failure must not fail the whole request — define, per endpoint, which dependencies are "must have" versus "nice to have" and enforce the difference at the code level (e.g., a try/catch around the enhancement, not the core), not just as a design intention. |

**Differs by system class** (`domain-matrix.md`): distributed/web systems apply all four patterns directly at the network-call boundary. Embedded/RTOS systems apply the same *concepts* at different boundaries — "timeout" becomes a watchdog timer, "circuit breaker" becomes a fault-mode state machine with a safe-state fallback, and "graceful degradation" is often a certified requirement (e.g., "system shall degrade to manual control within N ms of sensor fault") rather than a UX nicety. Native/desktop C++ applications apply timeout/retry primarily at the I/O and IPC boundary (file locks, plugin hosts, external processes) rather than network calls. Data/ML pipelines apply "circuit breaker" logic to upstream data-quality gates (halt the pipeline rather than train on corrupted data) more often than to service calls.

---

## 3. Security and threat modeling

**RULE 3.1** — IF a system design is presented as "secure" without a documented threat model THEN the claim is unverifiable — see `verification.md` for why threat modeling is treated as a verification method, not a design nicety. Security is a property that must be reasoned about explicitly per system, not assumed to follow from using "secure" technologies.

**Method: STRIDE.** A mnemonic threat-classification framework: **S**poofing, **T**ampering, **R**epudiation, **I**nformation disclosure, **D**enial of service, **E**levation of privilege — applied per element of a data-flow diagram (external entity, process, data store, data flow). **Source:** Loren Kohnfelder and Praerit Garg, "The Threats to Our Products," internal Microsoft document, 1 April 1999 (the origin of the classification); formalized and disseminated via Microsoft's Security Development Lifecycle (SDL) from 2002 onward; popularized in book form by Adam Shostack, *Threat Modeling: Designing for Security*, Wiley, 2014. `[T]` for the classification and per-element method; `[TS]` for specific current tooling (Microsoft Threat Modeling Tool and equivalents — see `sources-and-currency.md`).

**RULE 3.2** — IF a system has trust boundaries (any point where data crosses from a less-trusted to a more-trusted context — client to server, third-party plugin to host process, external API to internal service) THEN run a STRIDE pass over each element touching that boundary before build, not after. **RATIONALE:** STRIDE's structure (walk the data-flow diagram, ask all six threat categories per element) is what prevents threat modeling from silently narrowing to "the threats we already thought of" — the categories force consideration of threat types (e.g., repudiation) that intuition-only review reliably skips.

**RULE 3.3 (least privilege)** — IF a component, process, credential, or user is granted more access than its current, actual task requires THEN that excess access is a standing liability, not a convenience — grant the minimum access needed and expand deliberately, not the reverse ("grant broad, restrict later" is the common failure pattern because "later" rarely arrives under delivery pressure).

**RULE 3.4 (defense in depth)** — IF a security property depends on exactly one control (one validation layer, one network boundary, one auth check) THEN a single control failure is a total failure — layer independent controls (e.g., input validation *and* parameterized queries *and* least-privilege DB accounts, not any one alone) so that one control's failure is contained by the next. **RATIONALE:** this is the same logic as the bulkhead pattern (§2) applied to security rather than availability — independent, redundant containment beats a single strong barrier.

**RULE 3.5 (secure defaults)** — IF a system's default configuration is insecure and requires an operator to opt into safety (opt-in encryption, opt-in auth, opt-in least-privilege roles) THEN expect the insecure default to ship to production, because defaults are what get deployed under time pressure — invert this: ship secure by default and require explicit, logged opt-out for anyone who genuinely needs the less-secure path.

**Differs by system class** (`domain-matrix.md`): web/API systems apply STRIDE at request/response and service boundaries; LLM-app architectures need STRIDE *plus* prompt-injection and data-exfiltration-via-tool-use threat classes that predate-STRIDE frameworks don't cover natively (cross-ref `domain-matrix.md` for LLM-specific threat taxonomies, e.g., OWASP's LLM Top 10 — `[TS]`, versioned, check current release); embedded/IoT systems add physical-access and firmware-tampering threat classes (an attacker with a screwdriver is in-scope, unlike most web threat models); blockchain systems add threats specific to consensus manipulation and smart-contract reentrancy that have no STRIDE analogue and need domain-specific frameworks in addition.

---

## 4. Privacy and compliance (including functional safety)

**RULE 4.1** — IF a system processes data or performs functions covered by a regulation or safety standard THEN the applicable regime is a design input from day one, not a post-hoc audit checklist — retrofitting compliance after architecture is set is frequently a one-way-door-cost problem even when the underlying decision (e.g., where data is stored) looked like a two-way door in isolation (`fundamentals.md` §7).

**Data-privacy regulations:**

| Regime | Scope | Key architectural implications |
|---|---|---|
| **GDPR** — Regulation (EU) 2016/679, adopted 14 April 2016, effective 25 May 2018 `[TS]` | Personal data of EU/EEA data subjects, extraterritorial reach regardless of where the processor is located | Right to erasure (data must be *deletable*, not just soft-flagged — a real architectural constraint on any append-only or event-sourced store), data minimization, purpose limitation, breach notification within 72 hours, data residency implications for cross-border transfer |
| **HIPAA** (US) `[TS]` | Protected Health Information (PHI) for US covered entities and business associates | Access controls and audit logging are named technical safeguards, not optional hardening; Business Associate Agreements propagate compliance obligations to any subprocessor touching PHI — a vendor/subprocessor choice is a compliance-scope decision, not just a technical one |
| **PCI-DSS** (v4.0, sole active version from March 2024) `[TS]` | Payment card data, applies globally wherever card data is stored, processed, or transmitted | Strongly favors *not* touching card data at all (tokenization, hosted fields, redirect-to-processor) over building compliant storage — the cheapest way to satisfy PCI-DSS is architecting the card data out of your systems entirely |

**RULE 4.2** — IF a design choice would satisfy a regulation more cheaply by *not storing* the regulated data at all (tokenization, delegation to a compliant third party, redirect flows) THEN prefer that over building in-house compliant handling — compliance scope you don't have is compliance cost you don't pay, and it removes an entire class of one-way-door data-model decisions (§7 of `fundamentals.md` — regulated data is named there as a canonical hard-to-reverse case).

**Functional-safety standards** (where the system class involves physical risk to people — see `domain-matrix.md` for which system classes trigger which standard):

| Standard | Domain | Notes |
|---|---|---|
| **ISO 26262**, *"Road vehicles — Functional safety,"* 2011, revised 2018 `[TS]` | Automotive E/E systems in production road vehicles | Defines ASIL (Automotive Safety Integrity Level) A–D; rigor of required verification (including FMEA depth, §2) scales with ASIL |
| **IEC 62304**, *"Medical device software — Software life cycle processes"* `[TS]` | Medical device software | Defines software safety classes A/B/C by potential harm; class determines required lifecycle rigor |
| **DO-178C**, *"Software Considerations in Airborne Systems and Equipment Certification"* `[TS]` | Avionics software, the primary basis for FAA/EASA/Transport Canada software certification | Defines Design Assurance Levels A–E by failure-condition severity; all three standards above trace conceptually to the generic functional-safety standard **IEC 61508** |

**RULE 4.3** — IF a system falls under a functional-safety standard THEN the standard's required artifacts (safety case, traceability matrix, FMEA/FMECA at the mandated rigor level) are architecture deliverables, not paperwork bolted on afterward — `verification.md`'s "required verification depth by decision-risk" table treats every decision in a safety-classified system as inheriting at least that classification's minimum rigor, regardless of the decision's own reversal cost.

**Differs by system class:** this entire section *is* the differs-by-domain concern — web/SaaS systems typically face GDPR/HIPAA/PCI-DSS (data regulation) but not functional-safety standards; automotive/medical/avionics systems face both data regulation *and* functional-safety certification simultaneously and the two regimes' required artifacts (privacy impact assessment vs. safety case) are not interchangeable — see `domain-matrix.md` for the full per-domain regulatory map.

---

## 5. Observability

**RULE 5.1** — IF a system is running in production without the ability to answer "what is it doing right now, for this one request" THEN it is not observable, regardless of how much data it logs — observability is about being able to ask new questions of a running system without shipping new code, not about dashboard volume.

**The three pillars.** **Source:** widely used practitioner framing, most thoroughly systematized in Charity Majors, Liz Fong-Jones, George Miranda, *Observability Engineering: Achieving Production Excellence*, O'Reilly, 2022 `[T]` for the pillar framing and its critique; note the book's own argument is that logs/metrics/traces are necessary but *insufficient* — high-cardinality, high-dimensionality event data queryable ad hoc is the book's actual thesis, and the "three pillars" framing predates and is partly superseded by that argument. Treat "three pillars" as the accessible baseline vocabulary and the book's high-cardinality-events argument as the more rigorous refinement `[UNVERIFIED as consensus — this is one influential book's position, not an industry-wide settled standard]`.

| Pillar | Answers | Failure mode if missing |
|---|---|---|
| **Logs** | What happened, in detail, for a specific event | No forensic trail after an incident |
| **Metrics** | Aggregate numeric trends over time (rate, error count, latency percentiles) | No early-warning signal, no capacity trend |
| **Traces** | The path and timing of one request across multiple components | Cannot localize which hop in a distributed call caused the slowdown |

**RULE 5.2** — IF a system spans more than one process/service on a request's critical path THEN distributed tracing is required to answer "which hop is slow" — metrics alone tell you *that* p99 latency is bad, not *where* in the call graph it's bad, and logs alone require manually correlating timestamps across services, which does not scale past a handful of hops.

### SLI / SLO / error budgets

**Source:** Betsy Beyer, Chris Jones, Jennifer Petoff, Niall Richard Murphy (eds.), *Site Reliability Engineering: How Google Runs Production Systems*, O'Reilly, 2016, Ch. 4 "Service Level Objectives" (Chris Jones, John Wilkes, Niall Murphy, with Cody Smith); companion *The Site Reliability Workbook*, O'Reilly, 2018, Ch. 4 "SLO Engineering Case Studies." `[T]` for the framework.

- **SLI** (Service Level Indicator) — a directly measured quantity (e.g., proportion of requests served under 200ms).
- **SLO** (Service Level Objective) — a target value or range for an SLI (e.g., "99.9% of requests under 200ms, measured over a rolling 28 days").
- **Error budget** — 1 − SLO, the allowed unreliability, spent deliberately (releases, risky migrations, chaos experiments) rather than treated as pure loss.

**RULE 5.3** — IF a service has no SLO THEN "reliability" cannot be architected for and can only be argued about after the fact — this is `fundamentals.md` RULE 6.2 (quality attributes need measurable targets) applied specifically to reliability. Define the SLI/SLO pair before debating whether a proposed architecture is "reliable enough."

**RULE 5.4** — IF the error budget for a period is exhausted THEN the team's own prior agreement (made when the SLO was set, not renegotiated under pressure in the moment) should govern the response — typically freezing further risky releases until the budget recovers. **RATIONALE:** the error-budget mechanism's entire value is converting "reliability vs. velocity" from a recurring political argument into a pre-agreed, numeric policy; if the response is renegotiated every time the budget is spent, the mechanism provides no value over ad hoc argument.

**Differs by system class:** request-serving web/API systems map cleanly onto the SLI/SLO model above. Batch/data-pipeline systems need SLOs framed around freshness and completeness (e.g., "99% of daily batches complete by 06:00 UTC") rather than per-request latency. Embedded/safety-critical systems often have hard real-time deadlines that are correctness properties, not probabilistic SLOs — missing a deadline is a defect, not a budget line item (see `domain-matrix.md`). LLM-app systems need SLOs that account for model-output variability (e.g., "p95 tokens/sec," groundedness/hallucination-rate budgets) that have no equivalent in traditional SRE literature — treat these as `[UNVERIFIED]` extensions of the SLO concept until domain-specific literature matures further.

---

## 6. Performance

**RULE 6.1** — IF a performance requirement is stated as an adjective ("fast," "responsive," "scalable") without a number and a percentile THEN it is not a requirement — restate it as a quality-attribute scenario (`fundamentals.md` RULE 6.2, template in `artifacts-and-templates.md`).

**Tail latency.** **Source:** Jeffrey Dean, Luiz André Barroso, "The Tail at Scale," *Communications of the ACM* 56(2), February 2013, pp. 74–80. `[T]` — Average latency is a misleading target in any system that fans a request out to multiple backends: if each of 100 backends has a 1% chance of a slow response, the probability that *at least one* is slow on a given fan-out request approaches certainty, so the user-visible latency is governed by the tail (p99, p99.9), not the mean.

**RULE 6.2** — IF a request fans out to N backend calls and the response waits on all of them THEN the effective latency distribution is governed by the *slowest* of the N, not the average of the N — budget and monitor p99/p99.9 per hop, not just mean latency, and consider hedged requests or partial-result strategies (per Dean & Barroso) when N is large enough that tail amplification is significant.

**Back-of-envelope capacity math.** Before committing to an architecture, the agent should be able to produce a rough load estimate: expected requests/sec (peak, not average — provision for peak or explicitly accept degradation at peak), bytes per request × requests/sec = bandwidth, working-set size × replication factor = memory/storage footprint, and a latency budget decomposed per hop (total budget ≥ sum of per-hop p99s on the critical path, not per-hop averages — per RULE 6.2).

**RULE 6.3** — IF an architecture proposal has no back-of-envelope capacity math attached THEN quality-attribute claims about it ("this will scale," "this handles the load") are opinions, not verified — see `verification.md` for the load/latency-budget validation method and the level of rigor it requires before an architecture is considered ready to build.

**Differs by system class:** web/API latency budgets are typically 10s–100s of ms end to end; HPC workloads optimize for throughput and total job completion time over many minutes-to-hours, where tail latency of an individual operation is often irrelevant; embedded/RTOS systems have hard deadlines where "tail latency" reframes as worst-case execution time (WCET), a fundamentally different (and much harder) analysis than a statistical percentile (see `domain-matrix.md`).

---

## 7. Cost / FinOps

**Source:** FinOps Foundation (a Linux Foundation project), *FinOps Framework*, ongoing (finops.org). `[TS]` — framework content and certification tracks are actively maintained and versioned; verify current framework version before citing specifics.

FinOps treats cloud cost as a first-class, continuously-managed architectural concern — not a finance-department afterthought discovered via a monthly bill.

**RULE 7.1** — IF an architecture decision has a materially different cost profile across its alternatives (e.g., always-on provisioned capacity vs. serverless/pay-per-use, cross-region data transfer, storage tier choice) THEN the cost delta is a decision input at design time, belongs in the tradeoff table (`artifacts-and-templates.md`), and should carry an explicit numeric estimate — not be discovered for the first time in a production bill.

**RULE 7.2** — IF a resource's ownership (who is accountable for its cost) is unclear THEN its cost will not be managed regardless of tooling — FinOps's collaboration principle (engineering + finance + business jointly accountable) is itself an architectural-boundary decision analogous to Conway's Law (`fundamentals.md` §3): cost accountability tends to follow team/service boundaries, so an ambiguous service boundary produces ambiguous cost accountability as a direct consequence.

**Differs by system class:** cloud/web systems have the richest FinOps tooling (granular usage-based billing, tagging, showback/chargeback). On-prem/HPC systems shift the cost conversation to capital expenditure and utilization of fixed capacity rather than variable cloud spend. Embedded/hardware systems have a per-unit bill-of-materials cost that is a one-way door baked in at the hardware-selection stage (`fundamentals.md` §7) — a $0.50 component cost decision multiplied across a million-unit production run is a far larger and far less reversible decision than most cloud architecture cost choices.

---

## 8. Data lifecycle

**RULE 8.1** — IF a data model or storage choice is made without an explicit answer to "how does this get migrated, and how does this get deleted/retained" THEN that answer will be improvised later, under worse conditions (production data volume, live traffic, possibly a regulatory deadline) — this is a direct instance of `fundamentals.md` §7's one-way-door warning: "data model choices for data that's expensive/impossible to backfill or migrate" is explicitly named there as a canonical true one-way door.

**RULE 8.2 (migration)** — IF a schema or storage migration is planned for a dataset with live production traffic THEN the migration plan (dual-write, backfill, cutover, rollback point) is itself an architectural artifact requiring the same rigor as the original design decision — a "we'll just run a script" migration plan for a one-way-door-classified dataset is a mismatch between decision-risk and verification depth (`verification.md`).

**RULE 8.3 (retention)** — IF a data-retention policy is not decided at design time THEN the default that emerges in practice is "keep everything forever," which is simultaneously a cost problem (§7), a compliance liability (§4 — data you don't have can't be breached or subject to a retention violation), and a migration-complexity multiplier (every future migration must now account for however many years of accumulated data shape-drift). Decide retention explicitly, even if the decision is "indefinite" — make it a decision, not a default.

**RULE 8.4 (backfill cost)** — IF a new field, index, or derived value must be backfilled across existing data THEN estimate the backfill cost (compute time, lock contention, downstream reprocessing) as part of the original decision, not after the migration is underway — backfill cost is frequently the dominant cost of a "simple" schema change and is the concrete mechanism by which a data-model decision becomes a one-way door in practice (large backfills are themselves hard to reverse once partially applied against live data).

**Differs by system class:** OLTP web systems face migration/retention primarily as a schema-evolution problem. Data/ML systems face it as a training-data versioning and reproducibility problem (can you reproduce the exact dataset a deployed model was trained on? — a lineage question with no OLTP analogue). Blockchain systems face it as a uniquely severe case: on-chain data is close to literally immutable, making data-model mistakes there among the most irreversible decisions in this entire knowledge base — see `domain-matrix.md`.

---

## 9. Maintainability and evolvability

**RULE 9.1** — IF a system's design makes future change *harder* in proportion to how much the system has grown (every new feature requires touching more existing code, not less) THEN maintainability is degrading regardless of current test-pass rates or velocity metrics — this is the practical symptom to watch for, distinct from any single code-quality metric.

**RULE 9.2** — Evolvability is a quality attribute like any other in `fundamentals.md` §6 and should be given an explicit, ranked priority and — where feasible — a fitness function (`methodologies.md` §8) rather than assumed to be a natural byproduct of "good" architecture. Systems optimized hard for one attribute (raw performance, minimal cost) frequently trade evolvability away without anyone deciding to.

**Differs by system class:** long-lived enterprise/web systems treat evolvability as a primary attribute because requirements churn continuously over the system's life. Embedded/firmware systems shipped on fixed hardware often have a harder evolvability ceiling (a bug fix may require a physical recall, not a deploy) — see `domain-matrix.md` for the OTA-update-capable vs. field-immutable distinction, which changes evolvability from a code-quality question into a hardware/logistics question.

---

## 10. Accessibility (where user-facing)

**Source:** W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*, W3C Recommendation, 5 October 2023. `[TS]` — versioned; WCAG 2.2 is backward-compatible with 2.1/2.0, but check `sources-and-currency.md` for newer versions before citing a version number. Three conformance levels: A (minimum), AA (the level most legal/regulatory regimes reference), AAA (highest, rarely mandated in full). Organized under four principles: Perceivable, Operable, Understandable, Robust (POUR).

**RULE 10.1** — IF a system has any user-facing interface THEN an explicit WCAG conformance target (typically AA) is a quality-attribute requirement with the same status as a performance budget — stated as a number/level, assigned an owner, and verified, not left as an implicit good intention. **RATIONALE:** this is `fundamentals.md` RULE 6.2 (measurable targets) applied to accessibility specifically — "accessible" is not a requirement, "WCAG 2.2 AA conformance, verified via automated + manual audit before release" is.

**RULE 10.2** — IF accessibility is treated as a post-launch remediation task rather than a design-time constraint THEN expect the same one-way-door cost dynamic as retrofitted security or compliance (§3, §4) — interface and interaction-pattern decisions made without accessibility in view (color-only status indicators, keyboard-untestable custom widgets, unlabeled dynamic content) are frequently expensive to retrofit precisely because they're spread across every screen, not isolated in one component.

**Differs by system class:** consumer web/mobile applications are WCAG's direct target and increasingly a legal requirement (regulatory reference varies by jurisdiction — verify current local requirements, `[TS]`). Internal enterprise tools still carry accessibility obligations in many jurisdictions (workplace accommodation law) even without public-facing legal pressure. Game UIs and AR/VR interfaces need accessibility guidance WCAG does not directly cover (motion sensitivity, non-visual/non-auditory failure modes) — treat as an active, less-standardized area and flag it `[UNVERIFIED]` when advising beyond WCAG's literal scope; see `domain-matrix.md` for game-specific accessibility guidance where available.

---

## How this file drives the rest

- Every concern here becomes a **row candidate** in the quality-attribute scenario table and the NFR/quality-attribute budget table in `artifacts-and-templates.md` — this file supplies the vocabulary and the "what a good target looks like" guidance; that file supplies the fillable template.
- §2's resilience patterns and §3's threat modeling are directly consumed by `verification.md` as two of its named pre-build verification methods (failure/dependency analysis, threat modeling as verification) — this file defines *what* to check, `verification.md` defines *how to prove* it was checked before committing to build.
- §5's SLI/SLO framework supplies the measurable-target mechanism that `fundamentals.md` RULE 6.2 requires and that `verification.md`'s load/latency-budget validation method tests against.
- §4's regulatory/safety-standard table feeds directly into `verification.md`'s decision-risk-to-verification-depth mapping: a system under a functional-safety standard inherits that standard's minimum verification rigor regardless of any individual decision's own reversal-cost classification.
- Every "differs by system class" note throughout this file is a pointer into `domain-matrix.md`, which is the authoritative per-domain elaboration — this file intentionally states the general form of each concern plus the *fact* that it varies by domain, not the full per-domain detail, to avoid duplicating content that belongs in `domain-matrix.md`.
- §7 (cost) and §8 (data lifecycle) are the two concerns most likely to be under-weighted relative to their actual risk in typical architecture review — the agent should proactively surface both even when not asked, per this file's rules, because both tend to have no natural advocate in a room focused on functional requirements (the same dynamic `fundamentals.md` RULE 6.1 describes for unranked quality attributes generally).

---

## Report

- **File path:** `C:\Users\User\.claude\agents\solution-architect\ref\cross-cutting.md`
- **Line count:** 207
- **RULE count:** 35 (RULE 1.1–1.2, 2.1–2.8, 3.1–3.5, 4.1–4.3, 5.1–5.4, 6.1–6.3, 7.1–7.2, 8.1–8.4, 9.1–9.2, 10.1–10.2)
- **Distinct cited sources:** 13 — MIL-STD-1629A (1980) + IEC 60812:2018 + SAE J1739 (FMEA/FMECA); Michael Nygard, *Release It!* (2007/2018); Marc Brooker, "Exponential Backoff and Jitter," AWS Architecture Blog (2015/2023) + AWS Builders' Library companion; Loren Kohnfelder & Praerit Garg, "The Threats to Our Products" (1999) + Adam Shostack, *Threat Modeling* (2014); GDPR Regulation (EU) 2016/679 (2016/2018); HIPAA; PCI-DSS v4.0 (2024); ISO 26262 (2011/2018); IEC 62304; DO-178C; Charity Majors, Liz Fong-Jones, George Miranda, *Observability Engineering* (O'Reilly, 2022); Beyer/Jones/Petoff/Murphy (eds.), *Site Reliability Engineering* (O'Reilly, 2016) Ch. 4 + *The Site Reliability Workbook* (2018) Ch. 4; Jeffrey Dean & Luiz André Barroso, "The Tail at Scale," *CACM* 56(2) (2013); FinOps Foundation, *FinOps Framework*; W3C, WCAG 2.2 (2023).
- **`[UNVERIFIED]` count:** 2 — §5's note that the "three pillars" framing is an accessible-but-superseded baseline versus Majors/Fong-Jones/Miranda's own high-cardinality-events thesis; §10's note on game/AR-VR accessibility guidance extending beyond WCAG's literal scope.
