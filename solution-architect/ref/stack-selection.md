# stack-selection.md — Technology Selection Framework
### File 4 of 10 · Knowledge base for a domain-agnostic solution-architect agent

**Tag legend (repeated from `fundamentals.md` for standalone readability):**
- `[T]` — Timeless. Re-derive only if a citation link rots; the underlying claim doesn't age.
- `[TS]` — Time-sensitive. Refresh per the cadence in `sources-and-currency.md`.
- `[UNVERIFIED]` — Claim the agent should treat as a heuristic in use, not a citable fact.

This file is deliberately **not** a list of today's recommended languages, frameworks, or databases. Any such list decays within a product cycle and would actively mislead a future reader who trusts this knowledge base. Instead, this file is the **durable method** for choosing a technology, applicable whether the candidate is a 1975 language or something that ships next year. Every concrete technology name that appears below is an *example of applying the method*, tagged `[TS]`, and is replaceable without touching the method itself, which is `[T]`.

**How this file relates to its neighbors:** `decision-rules.md` §5 (build vs. buy vs. open-source vs. platform) supplies the disqualifiers this file operationalizes into a scoring method; `fundamentals.md` §7 (reversibility) supplies the governance weight applied to the whole exercise; `domain-matrix.md` supplies the per-system-class *dominant quality attributes* that become this file's scoring weights in practice.

---

## 1. The criteria set

Any technology selection — language, framework, datastore, message broker, cloud provider, hardware platform — should be scored against the same criteria set. Which criteria dominate changes by domain (`domain-matrix.md`); the *set* does not.

| Criterion | What it actually measures | Common failure to avoid |
|---|---|---|
| **Problem-fit** | Does the tool's design center match the problem's actual shape (data model, concurrency model, latency envelope)? | Picking a tool because it's familiar, not because its design center matches the problem — see `decision-rules.md` §3 for the data-layer version of this test |
| **Team skill / hiring pool** | Can the current team use it productively now, and can you hire/train for it at the rate the team needs to grow? | Evaluating only "can our best engineer learn this," not "can we hire 5 more people who already know this within our timeline" |
| **Ecosystem / library maturity** | Are the libraries, tooling, debuggers, and observability integrations for this stack's actual *use case* mature, not just the language itself | A language can be mature while its ecosystem for your specific need (e.g., a niche protocol, a specific hardware target) is thin |
| **Operational cost & complexity** | Total cost to run it in production: infra spend, on-call burden, operational tooling required, expertise needed to operate (not just to write code) | Comparing sticker price/license cost while ignoring the ops-headcount cost of an unfamiliar runtime |
| **Performance envelope** | Does it comfortably clear the *actual measured* quality-attribute targets (`fundamentals.md` RULE 6.2 — numbers, not adjectives) with margin, not just today's load | Benchmarking on unrealistic data volumes or with unrealistic concurrency, then extrapolating |
| **Longevity / community health** | Is this still going to be maintained, patched, and hireable-for in the timeframe the system needs to live | See §4 below — this has become measurable, not just a vibe |
| **Licensing** | Does the license permit the intended use (commercial redistribution, SaaS operation, embedding in a proprietary product) without triggering obligations the business can't or won't meet | Treating "open source" as one bucket instead of checking permissive vs. copyleft vs. source-available terms |
| **Lock-in / exit cost** | If this choice turns out wrong in 2 years, what does it cost to leave — in data migration, retraining, and contractual terms | Evaluating switching *in* cost only, ignoring switching *out* cost, which is the one that matters once you're committed (`fundamentals.md` §7) |
| **Security posture** | Track record of vulnerability handling, patch cadence, supply-chain integrity (signed releases, reproducible builds, SBOM availability) | Assuming "popular" implies "secure" — popularity increases attack-surface interest, not automatically defense quality |
| **Hardware / platform constraints** | Does it run at all on the target (MCU flash/RAM budget, a certified RTOS, a specific GPU architecture, a regulator-approved runtime) | Evaluating software-only criteria for a system where the hardware constraint is actually the binding one (`domain-matrix.md` — embedded, HPC) |

**RULE 1.1** — IF any single criterion above is scored as a hard failure (see §3, disqualifiers) THEN do not average it away with strong scores elsewhere — a weighted-sum score can hide a fatal flaw under enough unrelated strengths. Disqualifiers gate *before* scoring, never blend into it.

**RULE 1.2** — IF the problem domain has a criterion not listed above that is clearly dominant (e.g., a regulator-mandated certification path, a specific data-residency law) THEN add it explicitly as its own row with its own weight rather than folding it into "operational cost" or "licensing" — a criterion that's actually load-bearing needs its own visible score, not a diluted mention inside another one.

---

## 2. Weighted-scoring method

**Procedure:**

1. List every criterion from §1 that plausibly applies to this decision (drop ones that are genuinely irrelevant — e.g., "hardware constraints" rarely binds for a backend CRUD service; say so explicitly rather than silently omitting).
2. Assign each criterion a **weight** (e.g., 1–5) reflecting how much *this specific system's* quality-attribute ranking (`fundamentals.md` RULE 6.1) depends on it. Weights come from the domain's dominant quality attributes (`domain-matrix.md`), not from generic taste.
3. Score each candidate technology against each criterion (e.g., 1–5, with a one-line justification per cell — an unjustified number is not evidence).
4. Multiply weight × score per cell, sum per candidate.
5. **Before trusting the total:** check every candidate against the disqualifiers table (§3). A disqualified candidate is removed regardless of its weighted total.
6. Record the table and the reasoning in an ADR if the decision passes the one-way-door test (`fundamentals.md` RULE 7.1) — most stack choices do, because "blast radius" for a language or primary datastore choice is almost always broad (see `artifacts-and-templates.md` for the ADR template).

**RULE 2.1** — IF a weighted score is close between two or more candidates (within, e.g., 10% of the leading score — treat this threshold as a judgment call, not a law) THEN the decision is effectively a tie on the *measurable* criteria, and the tiebreaker should be the criterion with the highest cost of being wrong (usually longevity or lock-in, per §4/§1), not the criterion that's most fun to argue about (usually raw performance or language aesthetics).

**RULE 2.2** — IF the scoring table was built by one person with one set of priors THEN have at least one other engineer independently assign weights before finalizing — the weights, not the scores, are where bias actually enters (two engineers usually agree on "does Postgres support JSON columns," they disagree on "how much should longevity matter here").

### Worked example (illustrative weights and candidates — the technology names are `[TS]`, the method is `[T]`)

Scenario: choosing a primary datastore for a new B2B SaaS product's transactional core, small team (4 engineers), no existing data-residency constraint, expected to run for 5+ years.

| Criterion | Weight (1–5) | Candidate A: relational (e.g., PostgreSQL) | Candidate B: document store (e.g., a managed NoSQL document DB) | Candidate C: new/Genesis-stage distributed SQL engine |
|---|---|---|---|---|
| Problem-fit (relational invariants, flexible queries — `decision-rules.md` RULE 3.1) | 5 | 5 (25) | 2 (10) | 4 (20) |
| Team skill / hiring pool | 4 | 5 (20) | 3 (12) | 1 (4) |
| Ecosystem maturity | 4 | 5 (20) | 4 (16) | 2 (8) |
| Operational cost & complexity | 3 | 4 (12) | 4 (12) | 2 (6) |
| Performance envelope (measured load) | 3 | 4 (12) | 4 (12) | 5 (15) |
| Longevity / community health (§4) | 5 | 5 (25) | 4 (20) | 1 (5) |
| Licensing | 2 | 5 (10) | 4 (8) | 3 (6) |
| Lock-in / exit cost | 4 | 5 (20) | 3 (12) | 1 (4) |
| Security posture | 3 | 4 (12) | 4 (12) | 2 (6) |
| Hardware/platform constraints | 1 | 5 (5) | 5 (5) | 4 (4) |
| **Weighted total** | | **161** | **119** | **78** |

**Reading the table:** Candidate C (the Genesis-stage engine) loses heavily on exactly the criteria a 5-year, small-team, no-forcing-function system should weight hardest — longevity and lock-in — even though it might win on raw performance. This is the method working as intended: it is not "pick the newest thing," it is "pick the thing whose weaknesses you can least afford given *this* system's actual constraints." Per `decision-rules.md` RULE 3.2, if this system later develops a genuine horizontal-write-scale requirement that Candidate A cannot meet, that is a new forcing function to re-score against (see §5) — it is not evidence the original choice was wrong.

---

## 3. Hard disqualifiers (auto-reject, regardless of weighted score)

A candidate that trips any of these is removed from consideration before scoring, or immediately after if discovered late — no weighted total offsets a disqualifier.

| Disqualifier | Why it's absolute |
|---|---|
| License is legally incompatible with the intended distribution/SaaS model (e.g., a strong copyleft license and a proprietary-redistribution business model with no compliance path) | This isn't a quality tradeoff, it's a legal exposure — `decision-rules.md` §5's disqualifiers table names the buy-side version of this |
| No viable data-export or migration path exists for a datastore/platform, and the system's data is a true one-way door (`fundamentals.md` RULE 7.2) | Locks the exit door on the one decision category where exit matters most |
| Does not run on the mandated hardware/regulatory-approved platform at all (e.g., not certified for the required safety-integrity level, no port to the required MCU architecture) | A capability gap, not a quality-tradeoff gap — no amount of "great ecosystem" compensates for "cannot run here" |
| Vendor/maintainer cannot contractually or technically meet a hard data-residency or compliance requirement | Same class as above — a binary gate, not a score |
| Effectively unmaintained with no viable fork/take-over path and the system has a multi-year expected lifetime (see §4's health signals) | A slow-motion version of "does not run here" — it will stop running here, on an unknown timeline |
| Total cost of ownership at the system's realistic scale is provably unaffordable (e.g., a usage-based pricing model that becomes unaffordable at the committed growth trajectory, not just at current scale) | `decision-rules.md` §5's build/buy disqualifier table names this from the buy side; it disqualifies just as hard when the "candidate" is a paid platform rather than a build decision |

**RULE 3.1** — IF a disqualifier is discovered *after* a decision was made and shipped THEN do not silently work around it — reopen the decision as a new one-way-door candidate (`fundamentals.md` RULE 7.1) with the disqualifier as the forcing function, and record it as such rather than accumulating undocumented exceptions to a license or compliance rule.

---

## 4. Longevity and community-health signals (making "will this still exist" measurable)

`decision-rules.md` RULE 5.4 already flags ongoing OSS cost (patch cadence, CVE monitoring, bus factor). This section gives the concrete, checkable signals behind that rule.

**Source (bus factor / contributor concentration as a measurable metric):** CHAOSS (Community Health Analytics in Open Source Software), a Linux Foundation project — metrics model includes an explicit **Bus Factor** metric: the smallest number of contributors responsible for half of a project's contributions; a low number is a concentration risk. `[T]` for the metric's existence and definition; `[TS]` for specific tooling (Augur, GrimoireLab) used to compute it, which changes over time.

**Source (the underlying age-implies-robustness heuristic):** the Lindy effect — for non-perishable, informational things (which software, as a durable artifact, resembles more than a physical product does), the longer something has already survived, the longer its expected remaining lifespan, popularized by Nassim Nicholas Taleb, *Antifragile: Things That Gain from Disorder*, Random House, 2012. `[T]` for the concept; `[UNVERIFIED]` as a *predictive tool for a specific candidate* — it is a prior to weight, not a guarantee (a 40-year-old language can still be abandoned by its steward; a 2-year-old one can still calcify into permanence because it became infrastructure, e.g. via a well-funded foundation). Treat "how long has this already survived in production use, under real load, across multiple maintainers" as a genuine signal, and treat "brand new but funded/governed like an old thing" (foundation-backed, multi-vendor governance) as a partial substitute for age.

**Concrete checklist (turns both sources above into a scorable checklist):**

| Signal | What good looks like |
|---|---|
| Bus factor | More than 2–3 people could independently carry the project forward; not a single maintainer with no succession plan |
| Commit / release recency | Regular releases or commits within a timeframe appropriate to the project's maturity (a stable, "done" library with infrequent commits is not automatically unhealthy — check issue/PR response latency instead) |
| Governance | Foundation-backed or multi-vendor governance reduces single-company-shutdown risk; a single-company-controlled project is not disqualifying but raises the weight on that company's own health/incentives |
| CVE/patch history | Vulnerabilities get acknowledged and patched on a documented timeline, not silently or never |
| Fork/take-over viability | If the steward disappeared tomorrow, is the codebase/license structured so the community *could* fork and continue (permissive-enough license, no single-vendor proprietary lock inside the "open" project) |
| Downstream adoption breadth | Used by multiple unrelated organizations, not just its own creator — breadth of adoption is itself a maintenance-pressure signal (more users → more eyes → more reported issues → faster fixes), though it also means more attack-surface interest (weigh against Security posture, §1) |

**RULE 4.1** — IF a candidate scores well on every criterion except longevity/community-health, and the system's expected lifetime is short (a prototype, a time-boxed migration target, a component explicitly planned for replacement) THEN downweight this criterion deliberately and say so — longevity matters in proportion to how long the system needs to survive, not as a universal veto. **UNLESS** the "short-lived" system has a well-documented habit of outliving its planned lifetime (common enough in practice — `anti-patterns.md` covers "the permanent temporary system") — in which case score it as if it will persist, because it likely will.

---

## 5. IF/THEN rules tying selection weight to reversibility and domain

**RULE 5.1 (reversibility sets the weighting rigor, not just the process)** — IF the decision is a one-way door per `fundamentals.md` §7 (broad blast radius, weeks+ reversal cost — true for most primary language, primary datastore, and cloud-provider choices) THEN weight longevity, lock-in/exit-cost, and licensing far above novelty or the candidate's most exciting feature, and require the full scoring table + ADR. IF the decision is a two-way door (an internal library choice behind a clean interface, a build tool, a logging library) THEN a single accountable engineer can decide from experience without running the full table — `decision-rules.md`'s reversibility gate applies here exactly as it does everywhere else in this knowledge base.

**RULE 5.2** — IF the problem domain's dominant quality attribute (per `domain-matrix.md`) is determinism, verifiability, or certification (embedded/safety-critical) THEN hardware/platform constraints and licensing (certification status is often licensing-adjacent — some certified runtimes are only available under specific commercial terms) should carry the highest weights in the table, frequently outweighing team familiarity or ecosystem size. IF the dominant attribute is iteration speed under uncertainty (an early-stage product, an LLM-app prototype) THEN team skill/hiring pool and ecosystem maturity should dominate, because the cost of being slow to iterate often exceeds the cost of a later migration — `decision-rules.md` RULE 1.1's team-size logic and `fundamentals.md` §7's reversibility framing both support treating an early prototype's stack choice as a two-way door more often than its production successor's stack choice.

**RULE 5.3** — IF the candidate technology is at Wardley Mapping's **Genesis** or early **Custom-built** evolutionary stage (novel, still being invented, few if any competing implementations) THEN treat "longevity" and "ecosystem maturity" scores as provisional and volatile, and require an explicit fallback plan (what happens if this candidate stalls or is abandoned within 18 months) before selecting it for a one-way-door decision. **Source:** Simon Wardley, Wardley Mapping evolution-stage taxonomy — see `decision-rules.md` RULE 5.1 for the full stage definitions (Genesis → Custom-built → Product/rental → Commodity/utility). `[T]` for the taxonomy; `[UNVERIFIED]` for placing any specific real candidate on the axis, which is a judgment call. **RATIONALE:** this is the direct selection-time consequence of `decision-rules.md` RULE 5.2 — a capability at Genesis stage may be *worth building on* if it's your differentiator, but it is simultaneously the least safe pick for a one-way-door infrastructure choice, because both its interface and its survival are still unsettled.

**RULE 5.4** — IF two candidates are tied after weighting and one has a materially larger, more diverse hiring pool THEN prefer it, even over a marginally better problem-fit score — `decision-rules.md` RULE 1.1's Conway's-Law-derived team-size logic means a technology nobody can be hired to maintain eventually becomes a team-topology problem (`fundamentals.md` §3) regardless of its technical merits, and this failure mode shows up years after the original decision, when it is hardest to reverse.

**RULE 5.5 (the anti-novelty guard, stated positively — this is not "never adopt new tech")** — IF a genuinely new technology offers a decisive, measured advantage on the specific criterion your domain weights highest (e.g., a new datastore that measurably clears a performance envelope nothing else can, for a system where that envelope is the dominant quality attribute) THEN its Genesis-stage risk (RULE 5.3) is a cost to explicitly accept and mitigate (fallback plan, abstraction seam to ease future migration — `decision-rules.md` RULE 5.5's PaaS lock-in mitigation is the same pattern), not an automatic disqualifier. The framework's job is to make the tradeoff visible and deliberate, not to always pick the boring option — boring-by-default (RULE 2.1's tiebreak logic) only wins when the decision is otherwise a toss-up.

---

## 6. How to re-score when the landscape shifts

Because every named technology in this file is `[TS]`, the framework must include its own refresh procedure — otherwise the framework itself silently rots into "the list of winners from the year this file was written."

**Procedure:**

1. **Trigger conditions for re-scoring** (any one is sufficient to reopen a past decision as a new evaluation, not necessarily to change it):
   - A disqualifier newly applies (license change, vendor pricing-model change, end-of-life announcement, a new compliance requirement the current choice can't meet).
   - A criterion's weight has materially shifted because the system's dominant quality attribute changed (e.g., a prototype that became the production system now needs a longevity weight it never had — RULE 4.1's "permanent temporary system" case).
   - A previously Genesis/Custom-built candidate (RULE 5.3) has moved to Product or Commodity stage and now scores competitively on criteria it previously failed (ecosystem maturity, hiring pool).
   - The originally chosen candidate's community-health signals (§4) have degraded past an agreed threshold (bus factor collapsed, maintainers announced sunset, adoption breadth cratered).
   - The forcing function that justified a one-way-door decision (`decision-rules.md` §1's RULE 1.3-style forcing functions, applied here to a stack choice rather than a service split) has itself changed or disappeared.
2. **Re-run the weighted-scoring table (§2) from a blank sheet**, not as an incremental patch to the old one — carrying over old scores anchors the re-evaluation to stale assumptions about ecosystem maturity and longevity, which is precisely what's being re-checked.
3. **Re-classify reversibility (`fundamentals.md` RULE 7.1) for the *migration*, not just the original choice** — moving off an entrenched datastore is usually a bigger one-way-door decision than the original adoption was, because production data and operational habits have accumulated (this mirrors `decision-rules.md` §1's observation that merging two live microservices is harder than splitting them was). Budget the migration's own reversal cost and blast radius honestly before committing to a switch.
4. **Record the re-score as a new ADR that explicitly supersedes the old one** (`artifacts-and-templates.md`), stating the trigger condition from step 1 — this preserves the decision history's calibration value (`fundamentals.md` RULE 7.3) instead of silently overwriting it.
5. **Set a review cadence proportional to the criterion's volatility**, not a single fixed calendar date for the whole stack: licensing and compliance status should be checked whenever a vendor/maintainer announces a change (event-triggered); community-health signals on a periodic cadence (see `sources-and-currency.md` for suggested intervals); hardware/platform constraints only when a new hardware target is introduced. Re-scoring everything on one arbitrary annual date wastes effort on stable criteria and under-checks fast-moving ones.

**RULE 6.1** — IF a re-score's conclusion is "stay" THEN still record it — a documented "we re-evaluated and confirmed the choice" is evidence the decision is being actively governed, not merely inherited by inertia, and it shortens the next re-evaluation (the trigger-condition check in step 1 can start from this record instead of from scratch).

---

## How this file drives the rest of the knowledge base

- The criteria set (§1) and disqualifiers (§3) are the concrete, scorable version of `decision-rules.md` §5's build-vs-buy-vs-open-source rules — that file decides the *category* of solution (build/buy/adopt), this file decides *which specific one* once the category is chosen.
- The weighting procedure (§2, §5) is where `domain-matrix.md`'s per-system-class dominant quality attributes actually enter a decision numerically — that file states *what matters most* for a system class; this file is *how that "what matters most" becomes a weight in a table*.
- The reversibility-gated rigor rule (RULE 5.1) is `fundamentals.md` §7 applied specifically to technology choice, and feeds the ADR trigger in `artifacts-and-templates.md`.
- The re-scoring procedure (§6) is what keeps this entire knowledge base from becoming a fossilized "best tools of [year]" document — it's the mechanism by which every `[TS]`-tagged example throughout the other 9 files gets safely replaced without the underlying rules needing to change.
- `verification.md` supplies the method for validating a scoring table's assumptions against reality (e.g., confirming a "performance envelope" score against an actual load test rather than a vendor benchmark) before a one-way-door stack decision ships.
