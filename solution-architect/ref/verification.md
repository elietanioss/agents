# verification.md — Validating an Architecture Before Building
### File 8 of 10 · Knowledge base for a domain-agnostic solution-architect agent

**Tag legend (see `fundamentals.md` for full definitions):** `[T]` timeless · `[TS]` time-sensitive, refresh per `sources-and-currency.md` · `[UNVERIFIED]` heuristic in use, not a citable fact.

## 0. Purpose of this file — the anti-fabrication spine

Every other file in this knowledge base can produce an *opinion* about what architecture is correct. This file exists because an opinion, however well-reasoned, is not evidence. **The agent must not sign off on an architecture as "sound enough to build" on the strength of reasoning alone when a cheaper evidence-producing method exists and was skipped.** Each method below states explicitly: what you *do*, what evidence it *produces*, and — critically — what claim that evidence actually *licenses* (and, by implication, what it does not license). A spike that runs without crashing licenses "the happy path is technically possible" — it does not license "this will perform under production load," and treating it as though it does is exactly the fabrication this file exists to prevent.

**RULE 0.1** — IF the agent is asked to bless an architecture as ready to build THEN it must be able to point to which of the methods in this file were applied, what evidence resulted, and which claims that evidence actually supports — an unqualified "this looks right" is not an acceptable output regardless of how much of the rest of the knowledge base was consulted to produce it.

---

## 1. Decision-risk determines required verification depth

This is the master table for the file — every method below is filed under the risk tier(s) where it is required versus merely available. Risk classification comes directly from `fundamentals.md` RULE 7.1 (reversal cost × blast radius).

| Decision-risk tier (`fundamentals.md` §7) | Minimum required verification | Optional / escalate-if-contested |
|---|---|---|
| **Two-way door** (hours–days reversal, contained blast radius) | Author's own reasoning + a lightweight ADR (`methodologies.md` RULE 2.20). No additional method in this file is *required*. | A quick spike if genuinely uncertain (§3) |
| **One-way door, narrow disagreement** (weeks+ reversal OR broad blast radius, but stakeholders roughly agree on the tradeoff) | Quality-attribute scenarios for the contested attributes (§2) + back-of-envelope load/latency validation (§5) + dependency/blast-radius mapping (§6) | Spike/PoC (§3) if a specific technical question is genuinely open |
| **One-way door, contested tradeoff** (weeks+ reversal AND blast radius broad AND stakeholders disagree on attribute priority) | Full ATAM-style scenario evaluation (§2) + threat model if security-relevant (§4) + dependency/blast-radius mapping (§6) + independent/red-team review (§7) | — this tier has no "optional, skip if busy" methods; the whole point of the tier is that shortcuts here are the expensive-mistake case |
| **Safety-classified system** (`cross-cutting.md` §4 — ISO 26262 / IEC 62304 / DO-178C or equivalent applies) | Whatever the governing standard mandates as a minimum, which is very likely to equal or exceed the "contested" row above regardless of whether stakeholders actually disagree | The standard's required artifacts are not optional even when internal consensus is high — regulatory/certification risk is a blast-radius category of its own |

**RULE 1.1** — IF a decision is classified as a one-way door with contested attribute tradeoffs THEN skipping any row-required method in the table above is itself a finding to log — record *why* it was skipped (time pressure, no independent reviewer available, etc.) in the ADR's Context section (`methodologies.md` RULE 2.21) rather than silently omitting it, so the gap is visible to whoever inherits the decision later.

**RULE 1.2** — IF a decision is a two-way door THEN do not apply the full machinery of this file to it — this is the direct continuation of `fundamentals.md` RULE 1.1 and the whole knowledge base's governing warning against process misapplied to reversible decisions. Verification depth that exceeds the decision's actual risk is not rigor, it is the same bottleneck-creation Bezos's letter warns against, applied to verification specifically rather than decision-making generally.

---

## 2. Quality-attribute scenario evaluation & ATAM

**What you do:** Write quality-attribute scenarios in the stimulus → environment → response → response-measure form (`fundamentals.md` §6, template in `artifacts-and-templates.md`); for contested one-way doors, run a full ATAM workshop (`methodologies.md` §6, Kazman/Klein/Clements, CMU/SEI-2000-TR-004, 2000) with an evaluation team independent from the design team, producing a utility tree, identified architectural approaches, sensitivity points, tradeoff points, and a risk/non-risk log.

**Evidence produced:** A documented, prioritized set of quality-attribute scenarios; for full ATAM, a facilitated cross-stakeholder record of where the architecture is sensitive to change and where attributes trade off against each other, plus an explicit risk/non-risk log.

**Claim this evidence licenses:** "The architecture's behavior under these specific, agreed-on stimulus/response scenarios has been reasoned through by the people who understand the tradeoffs, and points of fragility are named." It does **not** license "the architecture works" in general — ATAM is a structured *evaluation* method, not a test; it finds risks in a design on paper, it does not execute code or prove the design's assumptions are individually true (that's what §3 and §5 are for).

**RULE 2.1** — Cross-reference `methodologies.md` RULE 2.13/2.14 directly: this file supplies the *verification-depth* trigger (the table in §1 above), `methodologies.md` supplies the *method mechanics*. Do not duplicate the mechanics here — when the table in §1 says "full ATAM required," go to `methodologies.md` §6 for how to run it.

---

## 3. Spikes, prototypes, and PoCs

**Source:** the "spike" as a time-boxed technical-uncertainty investigation originates in Extreme Programming practice (Kent Beck, in work on the Chrysler C3 project, mid-to-late 1990s; documented alongside XP's planning game) — "a thin but deep" investigation through a specific unknown, by analogy to driving a spike through a log. `[T]` for the concept and time-boxing discipline; the specific "half-day to two-week" duration guidance in practice is a `[TS]`/practitioner calibration, not a fixed rule.

**What you do:** Before writing a spike, state the **one specific question** it must answer — not "explore the technology" but "can library X sustain 5,000 writes/sec against our data shape" or "does this third-party API's auth flow actually support server-to-server tokens as documented." Time-box it explicitly (a fixed number of days, agreed before starting). Throw the code away regardless of outcome — a spike's code is not production code, and treating it as a head start on the real implementation reintroduces exactly the pressure that made the spike unrigorous in the first place.

**Evidence produced:** A yes/no/partial answer to the one stated question, with enough detail to say *why*.

**Claim this evidence licenses:** Only an answer to the question the spike was scoped to ask. A spike that succeeds at "can this library parse our file format" licenses exactly that claim — it does **not** license "this library is production-ready," "this library performs adequately at our scale," or "this library's licensing/support model is acceptable" unless those were the specific stated questions. This is the most common fabrication risk in practice: a successful happy-path spike gets silently reinterpreted as a full architectural validation.

**RULE 3.1** — IF a spike's time-box expires without a clear answer THEN that itself is evidence — "we invested N days and could not get a clear yes" is a legitimate, reportable finding (often pointing toward "this integration is riskier than assumed"), not a failure to hide or quietly extend. Extending a time-box repeatedly without re-scoping the question is a sign the *question* was wrong, not that more time will fix it.

**RULE 3.2** — IF the pending decision is a two-way door (`fundamentals.md` §7) THEN a spike is often still cheap and worth doing to reduce uncertainty, but it is optional, not required — per the §1 table, two-way doors do not require any method in this file. Reserve mandatory spikes for one-way doors where a genuine, nameable technical unknown exists; "let's spike it" is sometimes used to defer a decision that is actually already answerable from documentation or existing team knowledge, which wastes the time-box on a question nobody actually had.

---

## 4. Architecture fitness functions (as verification)

Fully specified as a methodology in `methodologies.md` §8 (Ford/Parsons/Kua, *Building Evolutionary Architectures*, O'Reilly 2017/2022). This file's contribution is narrower: fitness functions are a **continuous** verification method, distinct from every other method in this file, which are point-in-time (run once before a build decision, not continuously after).

**Evidence produced:** An automated, repeated, objective pass/fail signal against a specific architectural characteristic, running in CI on every change.

**Claim this evidence licenses:** "This specific, named characteristic has not eroded as of the last commit that ran the check." It licenses nothing about characteristics with no fitness function written — the absence of a failing fitness function is not evidence of soundness for a property nobody encoded a check for.

**RULE 4.1** — IF a one-way-door decision was validated by ATAM, a spike, or any other point-in-time method in this file THEN write at least one fitness function that encodes the assumption the decision depended on, so a later, unrelated change cannot silently invalidate a decision that was expensively verified once — a point-in-time verification with no continuous backstop decays back to "unverified" the moment the codebase changes underneath it. **RATIONALE:** this is the direct link between this file's point-in-time methods and `methodologies.md` RULE 2.17's continuous-enforcement mechanism — verification without a continuous fitness function is a verification with an undeclared expiration date.

---

## 5. Load/latency budget validation and back-of-envelope math

Fully specified in `cross-cutting.md` §6 (tail latency, Dean & Barroso "The Tail at Scale," *CACM* 2013; back-of-envelope capacity math). This file's contribution: back-of-envelope math is a *required* verification step, not an optional sanity check, whenever a quality-attribute scenario in §2 makes a numeric performance/capacity claim.

**What you do:** Produce, in writing, the estimate chain: peak requests/sec → bytes/request → bandwidth; working-set size × replication factor → memory/storage footprint; per-hop p99 latency summed along the critical path → total latency budget (per `cross-cutting.md` RULE 6.2, budget against the tail, not the mean, whenever the path fans out).

**Evidence produced:** A numeric estimate with stated assumptions, cheap to produce (typically under an hour) and cheap to falsify (any team member can challenge one assumption in the chain and recompute).

**Claim this evidence licenses:** "Under these stated assumptions, the architecture's capacity margin is (or is not) plausible." It does **not** license "the system will perform this way in production" — back-of-envelope math is a plausibility filter that catches order-of-magnitude mistakes cheaply; it is not a substitute for load testing against a real or realistic environment, which is a separate, more expensive verification step this file does not mandate universally (reserve actual load testing for one-way-door-tier decisions per §1, where the cost is justified).

**RULE 5.1** — IF an architecture proposal states a numeric quality-attribute target (`fundamentals.md` RULE 6.2) but has no back-of-envelope math showing the target is plausible under the proposed design THEN treat the target as unverified regardless of how confidently it's stated — this is the direct enforcement of `cross-cutting.md` RULE 6.3 at the verification-gate level.

---

## 6. Dependency and failure analysis (blast-radius mapping)

**What you do:** For the component(s) under a one-way-door decision, enumerate: (a) everything that calls it or depends on its output (downstream blast radius), (b) everything it calls or depends on (upstream fragility — if any of these fail, what happens here), and (c) for safety- or reliability-critical paths, run the FMEA method from `cross-cutting.md` §2 (Source: IEC 60812 / MIL-STD-1629A / SAE J1739) to enumerate specific failure modes, effects, and current mitigations per dependency.

**Evidence produced:** A concrete map — not a diagram alone, but a list — of what breaks, and how visibly, if this component is wrong, slow, unavailable, or compromised. For FMEA specifically: a per-failure-mode table with effect, cause, and mitigation-or-explicit-gap.

**Claim this evidence licenses:** "If this decision needs to be reversed or this component fails, here is the known scope of impact." It does **not** license "this component will not fail" — dependency/failure analysis maps consequences and prepares mitigations, it does not reduce the underlying probability of failure (that's what the resilience patterns in `cross-cutting.md` §2 are for — this method tells you *where* to apply them).

**RULE 6.1** — IF a one-way-door decision's blast radius has not been mapped THEN the "blast radius" half of its own risk classification (`fundamentals.md` RULE 7.1) was estimated, not verified — this is circular unless the mapping is actually done: you cannot honestly classify a decision as broad- or narrow-blast-radius without having enumerated what depends on it. Do the mapping *before* finalizing the risk-tier classification in §1's table, not after.

---

## 7. Threat modeling as verification

Fully specified as a concern in `cross-cutting.md` §3 (STRIDE; Kohnfelder & Garg, 1999; Shostack, 2014). This file's contribution: treat a STRIDE pass over trust-boundary elements as a *required* verification step for any one-way door that touches a trust boundary, not an optional security-team nicety layered on afterward.

**Evidence produced:** A per-element (data flow, process, store, external entity) enumeration of Spoofing/Tampering/Repudiation/Information-disclosure/Denial-of-service/Elevation-of-privilege threats, each with a stated mitigation or an explicit, named, accepted residual risk.

**Claim this evidence licenses:** "These six threat categories have been considered for every element touching a trust boundary, and each identified threat has a mitigation or a knowingly accepted residual risk." It does **not** license "this system is secure" — STRIDE is a structured elicitation method that reduces the chance of an *entire category* of threat being unconsidered; it does not itself prove the chosen mitigations are correctly implemented (that requires implementation-level review/testing, out of this file's scope) or that novel threat classes outside STRIDE's original scope (e.g., prompt injection in LLM-app architectures, `cross-cutting.md` §3) have been covered.

**RULE 7.1** — IF a one-way-door decision creates or modifies a trust boundary THEN a STRIDE pass is required before build, per the §1 table, regardless of whether the team "feels" the design is secure — security intuition reliably misses categories (repudiation and denial-of-service are the two most commonly skipped in ad hoc review) that a structured pass forces onto the table.

---

## 8. Co-change validation — running `fundamentals.md` RULE 4.2 on a real repository

`fundamentals.md` RULE 4.2 states the principle (components that change together in a majority of commits are one architectural boundary regardless of structural separation) and cites the technique (Gall, Hajek, Jazayeri, "Detection of Logical Coupling Based on Product Release History," ICSM '98). This section is the operational procedure for actually running it.

**What you do:**
1. Pick a representative window (a rolling 6–12 month period, or adjust to the release cadence — a monthly-release product needs a longer window than a continuous-deploy one to get a meaningful commit sample).
2. Extract, per commit (or per PR/changeset, whichever is the atomic unit of review in the team's workflow) touching the components under evaluation, the set of files/modules changed together. A minimal version: `git log --since=<window-start> --name-only --pretty=format:"COMMIT %H"` over the paths of interest, then group changed-file-sets by commit.
3. Compute, for each candidate pair of components (or proposed service-boundary split), the proportion of commits touching component A that also touch component B (and vice versa — the two directions can differ meaningfully).
4. Compare the resulting percentage against a locally calibrated threshold — **treat any specific percentage (e.g., "50%+") as a tunable signal per `fundamentals.md` RULE 4.2, not a law; validate the threshold's meaningfulness against a couple of pairs the team already knows are or aren't coupled, as a sanity check on the method itself before trusting it on an unknown pair.**

**Evidence produced:** A measured co-change percentage between specific components, computed from the team's actual commit history rather than asserted from memory or a dependency diagram.

**Claim this evidence licenses:** "Historically, over this window, these components changed together at this rate." It does **not** automatically license "these must be merged" or "this boundary is correct" — a high co-change rate is evidence the boundary is currently coupled in practice; the *response* (merge, invest in decoupling, or accept the coupling as an acceptable/known cost) is a separate decision that should weigh this evidence alongside other factors (team ownership, deployment independence needs), not be dictated by the number alone.

**RULE 8.1** — IF a proposed service extraction or module split is being justified primarily by a dependency diagram (structural coupling) THEN run the co-change measurement above before finalizing the boundary — a clean diagram with a high measured co-change rate is a specific, common false signal (`fundamentals.md` RULE 4.2's whole point) and this is the concrete, repeatable way the agent (or the team) actually checks for it rather than asserting it qualitatively.

**RULE 8.2** — IF the repository's history is too short, too noisy (e.g., dominated by a single large refactor or a monorepo-wide formatting commit), or the components are genuinely new (no history exists yet) THEN co-change validation cannot be run yet — do not force a number out of insufficient data; state explicitly that this method is unavailable for this decision and rely on structural analysis (`fundamentals.md` §4/§5) plus the other methods in this file instead.

---

## 9. Red-team / independent review

**What you do:** Have the design reviewed by someone (or a group) who did not produce it and has no stake in it being approved — internal cross-team review, a designated "devil's advocate" role, or in security-sensitive cases an actual adversarial red-team exercise. The defining feature is independence, not formality — a two-person startup's "independent review" might just be the one engineer who wasn't in the room when the design was drafted, and that is still meaningfully different from self-review.

**Evidence produced:** A documented set of objections, questions, or gaps raised by someone without motivated reasoning to approve the design, plus the design team's response to each.

**Claim this evidence licenses:** "At least one person without a stake in this design's approval has actively tried to find its weaknesses, and each identified weakness has a recorded response." It does **not** license "no weaknesses exist" — independent review is bounded by the reviewer's own expertise and available time; a reviewer who is not a security specialist will not catch what a STRIDE pass (§7) catches, and vice versa. Independent review is a *general* check against groupthink and motivated reasoning, not a substitute for the domain-specific methods above.

**RULE 9.1** — IF a one-way-door decision with contested attribute tradeoffs (the §1 table's third tier) has been reviewed only by its own author or its own immediate team THEN the review is incomplete regardless of how thorough the self-review was — self-review cannot surface the blind spots that are, by definition, invisible to the person or team that has them. This is the same rationale ATAM's independent-evaluation-team requirement is built on (`methodologies.md` §6) generalized to contexts too small or time-pressured for full ATAM.

**RULE 9.2** — IF "independent review" in practice means a rubber-stamp approval from someone who did not actually read the design THEN it produces the *appearance* of this verification method's evidence without the substance — the tell is a review response with no specific objections or questions at all on a genuinely contested decision; treat a review with zero recorded pushback on a contested one-way door as a signal to seek an actually-independent second reviewer, not as clean evidence.

---

## 10. How this file drives the rest

- The §1 table is the **dispatch mechanism** for this entire knowledge base's verification effort: `fundamentals.md` §7 classifies a decision's risk, and this file's §1 table converts that classification directly into a required-methods checklist — no other file specifies *how much* verification is enough; this file is where that question is answered.
- §2 (ATAM/scenarios) closes the loop back to `methodologies.md` §6–7 and to the quality-attribute scenario template in `artifacts-and-templates.md` — this file adds the *trigger condition*, those files hold the *mechanics* and *template*.
- §5 and §6 give `cross-cutting.md`'s performance (§6) and reliability (§2) concerns their pre-build teeth — a cross-cutting concern stated as a principle in that file becomes an actual gate here.
- §7 does the same for `cross-cutting.md` §3 (security) — STRIDE stops being a nice-to-have practice and becomes a required pre-build step for any trust-boundary-touching one-way door.
- §8 is the concrete, runnable procedure behind `fundamentals.md` RULE 4.2 — any time that rule is invoked to justify a service-boundary decision in `decision-rules.md`, this section is what makes the invocation evidence-based rather than a citation of the rule's existence.
- §4 (fitness functions) is what keeps every other method's evidence from silently expiring — every point-in-time verification in this file should produce at least one candidate fitness function so the verified assumption is checked continuously, not just once.
- Taken together, this file is what makes the phrase "verified" mean something specific and falsifiable throughout the rest of the knowledge base — any other file's claim that something has been "validated" should be traceable to one of the nine methods above, with the specific claim that method licenses stated alongside it, not a bare assertion of confidence.

---

## Report

- **File path:** `C:\Users\User\.claude\agents\solution-architect\ref\verification.md`
- **Line count:** 161
- **RULE count:** 14 (RULE 0.1, 1.1–1.2, 2.1, 3.1–3.2, 4.1, 5.1, 6.1, 7.1, 8.1–8.2, 9.1–9.2)
- **Distinct cited sources:** 8 — Jeff Bezos, 2015/2016 Amazon Shareholder Letters (via `fundamentals.md` §7, referenced not re-derived); Kazman, Klein, Clements, *ATAM: Method for Architecture Evaluation*, CMU/SEI-2000-TR-004 (2000); Kent Beck / XP planning-game "spike" practice (Chrysler C3 project, 1990s); Ford, Parsons, Kua, *Building Evolutionary Architectures* (O'Reilly, 2017/2022, via `methodologies.md` §8); Jeffrey Dean & Luiz André Barroso, "The Tail at Scale," *CACM* 56(2) (2013, via `cross-cutting.md` §6); MIL-STD-1629A / IEC 60812 / SAE J1739 (FMEA, via `cross-cutting.md` §2); Loren Kohnfelder & Praerit Garg (1999) + Adam Shostack (2014) STRIDE (via `cross-cutting.md` §3); Harald Gall, Karin Hajek, Mehdi Jazayeri, "Detection of Logical Coupling Based on Product Release History," ICSM '98 (via `fundamentals.md` RULE 4.2).
- **`[UNVERIFIED]` count:** 1 — the note in §3 that spike-duration guidance ("half-day to two weeks") is practitioner calibration rather than a fixed rule from the original XP sources.
