# methodologies.md — Architecture Methodologies & Frameworks
### File 2 of 10 · Knowledge base for a domain-agnostic solution-architect agent

**Tag legend (see `fundamentals.md` §0 for full definitions):**
- `[T]` — Timeless. The method's core idea doesn't age even if tooling around it does.
- `[TS]` — Time-sensitive. Refresh per `sources-and-currency.md` (specific tool versions, template repos, framework editions).
- `[UNVERIFIED]` — Heuristic in active practitioner use that outruns a citable source. Flagged inline, never silently blended with cited claims.

This file inventories real, citable architecture methodologies and frameworks, and — the highest-value part — states explicitly **when not to use each one**. A methodology applied outside its cost/benefit envelope is itself an anti-pattern (see `anti-patterns.md` §"process cosplay"). Every method below is evaluated against `fundamentals.md` §7 (reversibility/one-way-vs-two-way doors): that section is the gate every methodology-selection rule in this file passes through.

---

## 0. How to read this file

Each methodology gets: **what it's for** → **cost/overhead** → **when not to use it** → **`[T]` core vs. `[TS]` tooling split**. Methods are not mutually exclusive — most real architecture practice combines a documentation method (C4, arc42) with a decision method (ADR) and, occasionally, an evaluation method (ATAM). Do not treat this as a menu where you pick exactly one.

---

## 1. C4 model (Simon Brown)

**Source:** Simon Brown, *C4 model for visualising software architecture* (c4model.com); Simon Brown, *The C4 Model* (self-published/Leanpub, iterated 2018–2025); developed 2006–2011, building on UML and Kruchten's 4+1 (§3 below). `[T]` for the four-level idea; `[TS]` for the current book edition and Structurizr tooling.

**What it's for:** A minimal, four-level notation for diagramming software architecture at increasing zoom: **Context** (system + external actors/systems) → **Container** (deployable/runnable units — services, apps, databases) → **Component** (major structural elements inside one container) → **Code** (class/module diagrams, optional, usually auto-generated). Designed as "just enough" notation — a reaction against heavyweight UML that nobody kept updated.

**Cost/overhead:** Low. Context and Container diagrams are cheap (hours) and have the highest audience reach (they're readable by non-architects — Conway's Law, `fundamentals.md` §3, makes this matter: these diagrams are also organizational communication artifacts). Component-level diagrams cost more and rot faster. Code-level diagrams are usually not worth hand-maintaining at all.

**RULE 2.1** — IF you need a shared mental model across mixed technical/non-technical stakeholders (the Fowler definition of architecture in `fundamentals.md` §1) THEN produce Context + Container diagrams as the default minimum architecture artifact for any system with more than one deployable unit. **RATIONALE:** these two levels have the best cost-to-shared-understanding ratio of any documentation method in this file; skipping them is the most common documentation gap this agent will see.

**RULE 2.2 (when not to use it)** — IF a diagram would only ever have one box at Container level (a single-process monolith with no meaningful external systems) THEN stop at Context level — do not force a Container diagram to exist for its own sake, and never produce hand-maintained Code-level diagrams; regenerate them from source (IDE/tool support) or omit them. **RATIONALE:** C4's own value proposition is "just enough" — inventing structure to fill a level template inverts the method's purpose.

**RULE 2.3** — IF the system is architecturally simple but organizationally complex (many teams touching one deployable unit) THEN C4 alone is insufficient — pair it with a team-topology view (`fundamentals.md` §3) or arc42 §1 (introduction and goals, stakeholder-oriented) because C4 has no native notation for team/ownership boundaries.

---

## 2. arc42 (Gernot Starke & Peter Hruschka)

**Source:** Dr. Gernot Starke and Dr. Peter Hruschka, arc42 template, first released 2005, maintained as an open-source community template (docs.arc42.org / github.com/arc42). `[T]` for the 12-section structure; `[TS]` for the specific template repo/format (AsciiDoc, Markdown, Word variants churn).

**What it's for:** A complete architecture *documentation* template (not a design method) — 12 sections covering: introduction & goals, constraints, context & scope, solution strategy, building block view, runtime view, deployment view, cross-cutting concepts, architecture decisions, quality requirements, risks & technical debt, glossary. Process-neutral and technology-independent — it tells you what to document, not how to design it.

**Cost/overhead:** Medium if filled in fully; the template is explicitly permitted to be pruned — "empty section, mark as not applicable" is an accepted arc42 practice, not a failure. Overhead scales with how many of the 12 sections a team insists on filling exhaustively rather than proportionally to risk.

**RULE 2.4** — IF a system needs durable, onboarding-grade documentation (new engineers, auditors, or a future team must reconstruct the "why" without the original authors) THEN use arc42 as the document skeleton and fill sections in proportion to risk — populate §9 (architecture decisions) and §11 (risks & technical debt) first, since those decay fastest and are hardest to reconstruct after the fact. **RATIONALE:** arc42's structure front-loads exactly the sections (decisions, risks) that tribal knowledge loses first when people leave — directly serves the Fowler "shared understanding" definition in `fundamentals.md` §1.
**RULE 2.5 (when not to use it)** — IF the team is under 5 engineers, the system is a two-way door (`fundamentals.md` §7), or documentation would be read once and never again THEN do not populate the full arc42 template — a single-page C4 Context/Container diagram plus a running ADR log covers the same need at a fraction of the cost. Full arc42 is a **maintenance commitment**, not a one-time artifact — 12 sections nobody updates are worse than 3 sections that stay current, per Nygard's own critique of large documents (§9 below).

---

## 3. 4+1 architectural view model (Philippe Kruchten)

**Source:** Philippe Kruchten, "Architectural Blueprints — The '4+1' View Model of Software Architecture," *IEEE Software* 12(6), November 1995, pp. 42–50. `[T]`

**What it's for:** Five concurrent views, each serving a different stakeholder concern, reconciled by use-case scenarios (the "+1"): **Logical** (functional requirements, object/class structure — developers/analysts), **Process** (concurrency, synchronization, distribution — system integrators), **Development** (module/subsystem organization, build/reuse — programmers/managers), **Physical** (deployment topology, mapping software to hardware — system engineers/ops), and **Scenarios** (the +1 — a small set of key use cases that validate the other four views are consistent with each other).

**Cost/overhead:** Medium-high if all five views are produced formally with UML. The model predates and is a direct ancestor of C4 (Brown built C4 explicitly on Kruchten's foundation, simplifying the view count and dropping UML as a hard requirement).

**RULE 2.6** — IF stakeholders have genuinely distinct, conflicting concerns that a single diagram type cannot reconcile (e.g., ops needs deployment topology, developers need module boundaries, and neither view alone reveals whether they're consistent) THEN use the *concept* of multiple, purpose-built views validated against common scenarios — this is 4+1's lasting contribution, independent of whether you use UML or its specific five names.
**RULE 2.7 (when not to use it, as originally specified)** — IF the team already has a lighter, non-UML notation in active use (C4, informal boxes-and-lines) and stakeholder concerns are not in active conflict THEN do not introduce formal 4+1/UML as a second parallel notation — pick one documentation language per system and let C4 or arc42 absorb the "multiple views for multiple stakeholders" *idea* without the UML *machinery*. **RATIONALE:** the view-per-stakeholder insight is durable `[T]`; the specific notation (UML) is `[TS]` and has fallen out of default practice — most teams in 2026 get the same stakeholder-separation benefit from C4 + a deployment diagram at far lower notation overhead.

---

## 4. Attribute-Driven Design (ADD) — SEI

**Source:** Original ADD: Len Bass, Paul Clements, Rick Kazman, *Software Architecture in Practice* (1st ed.), Addison-Wesley, 2000 (method first published by SEI, 2000). ADD 2.0: R. Wojcik, F. Bachmann, L. Bass, P. Clements, P. Merson, R. Nord, B. Wood, *Attribute-Driven Design (ADD), Version 2.0*, CMU/SEI-2006-TR-023, Software Engineering Institute, Carnegie Mellon University, 2006. Later revisions (ADD 3.0) continued under SEI/IASA. `[T]` for the core recursive-decomposition idea; `[TS]` for the specific tactics catalog, which SEI periodically extends.

**What it's for:** A step-by-step *design* method (not just documentation): starting from prioritized quality-attribute scenarios (see `fundamentals.md` §6, the Bass/Clements/Kazman stimulus→response scenario format), recursively decompose the system, at each step selecting architectural tactics and patterns that satisfy the highest-priority quality attributes for that subsystem, then verify the decomposition against the scenarios before recursing further.

**Cost/overhead:** Medium — requires the quality-attribute-scenario groundwork (§6 of `fundamentals.md`) to already exist or be built alongside it; without prioritized, measurable scenarios, ADD degrades into design-by-intuition wearing ADD's procedural clothing.

**RULE 2.8** — IF quality attributes are the dominant design driver (e.g., "must survive 10x load," "must be certifiable to DO-178C," "must support offline-first sync") and are in tension with each other THEN use ADD's recursive tactic-selection procedure rather than an unstructured "sketch some boxes" approach — it forces every decomposition step to cite *which* quality-attribute scenario it serves, which is directly auditable later (ties to `verification.md`).
**RULE 2.9 (when not to use it)** — IF the dominant design driver is domain complexity rather than quality-attribute tension (the hard part is modeling the business, not meeting a latency/availability/security target) THEN prefer Domain-Driven Design (§5 below) as the primary method — ADD's tactic catalog has little to say about how to carve up a rich business domain. IF the team has no prioritized quality-attribute scenarios and no appetite to build them THEN ADD cannot be executed as specified — either invest in the scenario groundwork first (`fundamentals.md` §6, RULE 6.2) or fall back to a lighter method; running "ADD" without measurable scenarios is cargo-culting the name.

---

## 5. Domain-Driven Design (DDD) — Eric Evans

**Source:** Eric Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software*, Addison-Wesley, 2003. `[T]` for the core patterns; strategic/tactical terminology usage has shifted since (see below, `[TS]`/community convention).

**What it's for:** A method for aligning software structure with a complex business domain via a shared **ubiquitous language** between domain experts and engineers. Evans's own book organizes this as Part IV "Strategic Design"; the practitioner community since has split DDD into two commonly-referenced tiers (note: this split is *community convention layered onto Evans's text*, not Evans's own two-tier naming — flag this distinction when citing "strategic vs. tactical DDD" as if it were Evans's original taxonomy):

| Tier | Concepts | Concern |
|---|---|---|
| Strategic | Bounded Context, Context Map, Core Domain vs. Supporting/Generic Subdomains, Anti-Corruption Layer | Where to draw system/team boundaries; which parts of the domain deserve the most design investment |
| Tactical | Entity, Value Object, Aggregate, Domain Event, Repository, Domain Service, Factory | How to model *inside* one bounded context |

**Cost/overhead:** Strategic DDD is medium-cost and high-value even partially applied (identifying one Core Domain and its Bounded Contexts is often a half-day workshop). Full tactical DDD (Aggregates, Repositories, Domain Events applied rigorously) is a heavier commitment — it pays off in domains with genuine behavioral complexity and pays *nothing* in CRUD-shaped domains.

**RULE 2.10** — IF a system's hardest problem is modeling a business domain with real invariants, multiple experts using the same word to mean different things across departments, or a domain that will outlive any one technology choice THEN invest in strategic DDD first — Bounded Context identification directly operationalizes the Conway's Law consequence in `fundamentals.md` §3 (a bounded context is a strong candidate service/team boundary) and the information-hiding test in `fundamentals.md` §5.3.
**RULE 2.11 (when not to use it)** — IF the domain is simple CRUD with little genuine business logic (most internal admin tools, most read-mostly reporting systems) THEN tactical DDD (Aggregates, Repositories, Domain Events as ceremony) is pure accidental complexity (`fundamentals.md` §2) — it adds indirection with no corresponding domain complexity to hide. Use plain data access instead. **A Bounded Context still may be worth identifying even here** (it's nearly free and prevents future coupling) — the "when not to use" applies to the *tactical* layer, not the strategic one.
**RULE 2.12** — IF multiple bounded contexts are being forced into one shared data model to "avoid duplication" THEN this is very likely wrong — Evans's own point is that the *same* real-world concept (e.g., "Customer") legitimately has different shapes, invariants, and lifecycles in different contexts (billing's "Customer" vs. support's "Customer"); duplication across bounded contexts is often correct, not a DRY violation. **RATIONALE:** this is one of the most common DDD misapplications this agent will see flagged as a "problem" that isn't one — see `anti-patterns.md` §"premature shared model."

---

## 6. ATAM — Architecture Tradeoff Analysis Method (SEI)

**Source:** R. Kazman, M. Klein, P. Clements, *ATAM: Method for Architecture Evaluation*, CMU/SEI-2000-TR-004, Software Engineering Institute, Carnegie Mellon University, 2000 (formalizing earlier work: R. Kazman, M. Klein, M. Barbacci, T. Longstaff, H. Lipson, J. Carriere, "The Architecture Tradeoff Analysis Method," *Proc. ICECCS '98*, IEEE, 1998). `[T]`

**What it's for:** A structured, scenario-based evaluation method for a *proposed or existing* architecture, run as a facilitated workshop (typically spanning multiple days across two phases) with architects and a wide stakeholder group. Produces: a prioritized **utility tree** of quality-attribute scenarios, identified architectural approaches/decisions, **sensitivity points** (where a small architectural change causes a large quality-attribute swing), **tradeoff points** (a sensitivity point affecting more than one attribute, in opposite directions), and a **risk/non-risk log**.

**Cost/overhead:** High. A full ATAM engagement pulls in a large facilitated group (architects, developers, PMs, business stakeholders, plus a trained ATAM evaluation team distinct from the design team) for multiple days. This is the single most expensive methodology in this file. Lightweight/"mini-ATAM" variants exist in practice but dilute the method's core value (independent evaluation team, structured elicitation) — treat these as `[UNVERIFIED]` practitioner adaptations, not the citable method.

**RULE 2.13 (the central selection rule for this file)** — IF a pending decision is a one-way door under `fundamentals.md` RULE 7.1 (weeks+ reversal cost AND broad blast radius) **AND** two or more quality attributes are in *contested* tension (stakeholders disagree, or the tradeoff is not yet made explicit per RULE 6.1) THEN run an ATAM-style scenario review before committing — scale the ceremony to the stakes (a full multi-day ATAM for a genuinely enterprise-critical, multi-team, hard-to-reverse decision; a half-day facilitated risk-storming session, §7 below, for a smaller but still one-way decision). **RATIONALE:** this is the direct bridge from `fundamentals.md` §7's classification procedure to a concrete method — ATAM is *expensive verification for one-way doors*, exactly the category Bezos's framework describes; running it on a two-way door is the paradigm case of process misapplied to the wrong decision class.
**RULE 2.14 (when not to use it)** — IF the decision is a two-way door, if there is no genuine disagreement about quality-attribute priority (RULE 6.1's ranking is already explicit and uncontested), or if the team lacks the stakeholder breadth to staff a real evaluation (no independent business/ops representation) THEN do not run ATAM — the method's value comes from surfacing disagreement across a wide stakeholder group; run with a narrow or homogeneous group and it becomes theater that produces a document nobody contests and nobody uses. In that situation, a lightweight architecture review (peers reading an ADR + C4 diagrams, half a day) captures most of the value.

---

## 7. Risk-storming (Simon Brown)

**Source:** Simon Brown, "Risk Storming," codingthearchitecture.com, 2012, later formalized in Simon Brown, *Software Architecture for Developers* / workshops, and independently documented at riskstorming.com. `[T]` for the four-step technique.

**What it's for:** A lightweight, collaborative, visual risk-identification workshop: (1) draw architecture diagrams (C4 pairs well here) at multiple zoom levels on a wall/whiteboard, (2) each participant *individually and silently* writes risks on sticky notes, (3) participants place notes directly on the diagram near the relevant element, (4) the group reviews clustering and disagreement (notes only one person wrote, or where people disagree on severity) and produces a prioritized risk register.

**Cost/overhead:** Low — typically under half a day, no dedicated external evaluation team required (unlike ATAM), scales down to a handful of participants.

**RULE 2.15** — IF you need broad-based risk identification but the decision doesn't clear the bar for full ATAM (RULE 2.13/2.14) — e.g., a one-way door with real stakes but no *contested* quality-attribute tradeoff, just general uncertainty about where the risk lives THEN run risk-storming instead of ATAM. **RATIONALE:** risk-storming's individual-silent-writing step (step 2) is the mechanism that makes it work — it surfaces risks a loud/senior voice would otherwise suppress in open discussion, at a fraction of ATAM's cost; treat it as the default "someone should sanity-check this" tool and ATAM as the escalation when disagreement is already known to be sharp and attribute-specific.
**RULE 2.16 (when not to use it)** — IF the team has fewer than ~3 people or the diagrams risk-storming would use don't exist yet THEN produce the C4 diagrams first (§1) — risk-storming has no content to stick notes on without them, and a single person "risk-storming" alone is just a checklist exercise, not the collaborative-divergence technique the method depends on.

---

## 8. Architecture fitness functions & evolutionary architecture

**Source:** Neal Ford, Rebecca Parsons, Patrick Kua, *Building Evolutionary Architectures: Support Constant Change*, O'Reilly Media, 2017 (1st ed.); 2nd ed. adds Pramod Sadalage as co-author, retitled *...Automated Software Governance*, O'Reilly, 2022. `[T]` for the fitness-function concept; `[TS]` for specific tool recommendations (ArchUnit, Deptrac, specific CI integrations — these churn fast, see `sources-and-currency.md`).

**What it's for:** Defines an **architectural fitness function** as any mechanism (automated test, metric, code-structure check, chaos experiment, manual review checklist) that provides an objective measure of some architectural characteristic, run continuously so architectural erosion is caught the way a unit test catches a regression. Evolutionary architecture = architecture that supports "guided, incremental change across multiple dimensions" — the fitness functions are the guidance mechanism.

**Cost/overhead:** Low-to-medium per fitness function (a single ArchUnit-style rule — "no package in `domain/` may import from `infra/`" — is cheap to write and cheap to run in CI); overhead compounds if the team builds an elaborate fitness-function suite for characteristics nobody is actually worried about eroding.

**RULE 2.17** — IF an architectural characteristic has been decided and documented (an ADR, a layering rule, a dependency direction, a performance budget) THEN write at least one automatable fitness function that fails CI when the characteristic is violated, rather than relying on code review vigilance alone. **RATIONALE:** this is the direct enforcement mechanism for RULE 5.3 in `fundamentals.md` (the information-hiding test) — a fitness function is how you catch a leaking abstraction mechanically instead of hoping reviewers notice.
**RULE 2.18 (when not to use it)** — IF the system has no CI/CD pipeline capable of running automated checks, or the "characteristic" in question is still actively in flux and un-decided THEN do not write a fitness function yet — a fitness function encodes a *decision already made*; writing one prematurely ossifies a decision that RULE 7.1 might still classify as reversible, converting a two-way door into a de facto one-way door by making the current state expensive to deviate from even experimentally.
**RULE 2.19** — IF the codebase or its deployment target has no automation surface at all (e.g., firmware built and flashed by hand, no CI) THEN "fitness function" degrades to a manual checklist item in a review gate (`verification.md`) — the concept (continuous, objective characteristic-checking) still applies; only the mechanism changes. Do not conclude the concept is inapplicable just because the *automated* form isn't available — see `domain-matrix.md` for embedded/safety-critical adaptations.

---

## 9. RFC/ADR practice (Michael Nygard's Architecture Decision Records)

**Source:** Michael Nygard, "Documenting Architecture Decisions," Cognitect blog, 15 November 2011. `[T]` for the core five-field format; `[TS]` for the proliferation of template variants since (MADR, Y-statements, etc. — see `artifacts-and-templates.md`).

**What it's for:** A short, immutable, append-only record per significant decision: **Title**, **Status** (proposed/accepted/deprecated/superseded), **Context** (the forces at play, described neutrally), **Decision** (the response, stated actively — "we will..."), **Consequences** (what becomes easier/harder as a result, including negative ones — Nygard is explicit that consequences should be honestly reported, not just the upside). Nygard's own rationale, directly quotable: agile teams aren't opposed to documentation, only to documentation nobody keeps current — small, numerous, immutable records survive where large living documents don't, because a *superseded* ADR is still correct (as a historical record) even after the decision changes; you write a new ADR, you don't edit the old one.

**Cost/overhead:** Very low per record (minutes to an hour) — this is the cheapest methodology in this file and the one with the best cost-to-value ratio for two-way doors specifically, not just one-way doors.

**RULE 2.20** — IF a decision clears the two-way-door bar in `fundamentals.md` RULE 7.1 THEN still write an ADR — but a one-paragraph one (Title/Decision/one-line-Context is enough; skip the full Consequences enumeration). IF it clears the one-way-door bar THEN write a full ADR with an explicit tradeoff table and reference to whatever evaluation produced it (ATAM output, risk-storming register, ADD scenario). **RATIONALE:** this operationalizes `fundamentals.md` RULE 7.1's two branches directly — the *existence* of an ADR is non-negotiable in both branches, only its depth varies. A missing ADR for a one-way door is a process failure; a missing ADR for a two-way door is merely suboptimal.
**RULE 2.21 (when not to use it, in the sense of "when the format itself is wrong")** — IF the "decision" being recorded is actually still under active debate (no decision has been made) THEN do not write a Status: accepted ADR to manufacture false consensus — use "proposed" status honestly, or use a lighter pre-decision artifact (a risk-storming register, a spike write-up) until a decision actually exists to record. An ADR documents a decision, not a discussion.
**RULE 2.22** — IF a decision changes THEN write a new ADR that supersedes the old one (link both directions) — never edit or delete a past ADR's Decision/Context text. **RATIONALE:** Nygard's immutability point is what makes the ADR log itself useful as a *history* — an editable "living decision doc" reverts to the large-document rot problem ADRs exist to solve, and destroys the audit trail RULE 7.3 (`fundamentals.md`) depends on for calibrating future one-way/two-way classification.

---

## 10. TOGAF and enterprise architecture frameworks

**Source:** The Open Group, *TOGAF*, versions 1 (1995) through 9.2 (2018) and TOGAF 10 (2022, with 2025 targeted updates to the Architecture Development Method and Business Architecture guides). `[T]` for the existence and intent of the ADM (Architecture Development Method) phase cycle; `[TS]` — heavily, version-churn is frequent and this file's version list will age fastest of any claim in this file (verify current version in `sources-and-currency.md` before citing a version number to a user).

**What it's for:** An enterprise-level framework covering business, data, application, and technology architecture domains, organized around the cyclical **ADM** (Preliminary → Architecture Vision → Business Architecture → Information Systems Architectures → Technology Architecture → Opportunities & Solutions → Migration Planning → Implementation Governance → Architecture Change Management). Designed for organizations that must govern *many* interdependent architectures (multiple business units, long-lived IT portfolios, regulatory reporting obligations) rather than design *one* system.

**Cost/overhead:** Very high. TOGAF engagements involve certification programs, dedicated enterprise-architecture roles, governance boards, and a documentation load that dwarfs every other method in this file. This is not a criticism of misuse — it is the correct cost for the problem TOGAF actually targets (portfolio-scale governance), and a symptom of misuse when applied below that scale.

**RULE 2.23** — IF the unit of concern is a single system, a single product, or a handful of services owned by one or a few teams THEN TOGAF is categorically the wrong tool regardless of company size — reach for C4/arc42 + ADRs + (if warranted) ATAM instead. TOGAF's ADM cycle answers "how do we govern architecture decisions across dozens of business units and IT portfolios," a question that doesn't exist yet at single-system scale.
**RULE 2.24 (where it earns its weight)** — IF the actual problem is portfolio-level: multiple business units with overlapping/competing technology investments, a need for a shared enterprise vocabulary for audit/regulatory purposes, or multi-year technology-migration governance spanning organizational boundaries THEN TOGAF's structure (or a comparable enterprise framework) earns its overhead — the alternative at that scale is not "no framework," it's each business unit inventing its own ad hoc governance, which is worse. **RATIONALE:** the same logic as `fundamentals.md` RULE 1.1 (cost/blast-radius drives ceremony) applies one level up — TOGAF is appropriate exactly when the blast radius is the whole enterprise, not one system.
**RULE 2.25** — IF a team is adopting TOGAF vocabulary ("Architecture Vision," "Statement of Architecture Work") for a single-system project because it sounds rigorous THEN this is a documentation-theater smell (`anti-patterns.md`) — the tell is that TOGAF artifacts are being produced with no actual portfolio-level stakeholder (no other business unit, no enterprise governance board) consuming them.

---

## 11. Methodology selection table

| Situation | Methodology | Relative cost | Notes |
|---|---|---|---|
| Need a shared diagram for mixed technical/non-technical audiences | C4 (Context + Container) | Low | Default minimum artifact for >1 deployable unit |
| Need durable onboarding-grade documentation, team will outlive current members | arc42 | Medium | Fill proportional to risk, not exhaustively |
| Stakeholders have genuinely conflicting concerns needing reconciliation | 4+1 view concept (not necessarily UML) | Medium–High | Usually the *idea*, not the literal notation, is what's still used |
| Quality attributes are the dominant, contested design driver | ADD | Medium | Requires prioritized QA scenarios as a precondition |
| Domain complexity (not QA tension) is the hard part | DDD (strategic first, tactical only where behavior is rich) | Medium | Tactical DDD on a CRUD domain is accidental complexity |
| One-way door + contested quality-attribute tradeoff | ATAM | High | Needs a real, wide, independent stakeholder group or it's theater |
| One-way door + general "where's the risk" uncertainty, not yet sharply contested | Risk-storming | Low | Needs existing diagrams (C4) as substrate |
| A decided architectural characteristic needs continuous enforcement | Fitness functions | Low–Medium | Encodes decisions already made; don't ossify undecided ones |
| Any decision at all, reversible or not | ADR | Very low | Depth scales with door type; existence never optional for one-way doors |
| Portfolio-scale governance across many business units/systems | TOGAF / enterprise framework | Very high | Wrong tool below single-digit-system scale |
| Small team + clearly reversible decision | None of the above — one-paragraph ADR only | Minimal | Ties directly to `fundamentals.md` RULE 7.1's two-way-door branch |

**RULE 2.26 (composition, not selection)** — Do not treat this table as "pick exactly one row." The typical well-run architecture practice runs concurrently: C4 or arc42 for shared understanding, ADRs for every decision regardless of size, fitness functions for anything already decided, and ATAM/risk-storming only when a one-way door surfaces contested tradeoffs. Selecting a single methodology and declaring "we do DDD" or "we do TOGAF" as an identity rather than a fit-for-purpose tool choice is itself the anti-pattern (`anti-patterns.md` §"methodology-as-identity").

---

## 12. How this file drives the rest of the knowledge base

- §1–§3 (C4, arc42, 4+1) define the **default documentation artifacts** referenced throughout `artifacts-and-templates.md`.
- §4–§5 (ADD, DDD) define **design-time methods** that `decision-rules.md` assumes are available when a quality-attribute or domain-modeling decision is on the table.
- §6–§7 (ATAM, risk-storming) are the two calibrated escalation levels for **contested one-way-door decisions**, directly consumed by `verification.md`'s review-gate rules and gated by `fundamentals.md` RULE 7.1.
- §8 (fitness functions) is the **enforcement layer** — it's how a decision recorded in an ADR (§9) stays true after the decision is made, and is the mechanical backstop `cross-cutting.md` relies on for cross-cutting-concern drift.
- §9 (ADRs) is the **universal artifact** — every methodology in this file terminates in an ADR; `artifacts-and-templates.md` carries the actual template.
- §10 (TOGAF) exists primarily so the agent can correctly say "no" — recognizing when enterprise-framework ceremony is being reached for below the scale where it earns its cost is as valuable as knowing when to apply ATAM.
- The selection table (§11) is the first thing to consult when a user asks "which method should I use" — but `fundamentals.md` §7's reversibility classification must run *before* this table, not after; door-type is the input, methodology is the output.

---

## Report

- **File path:** `C:\Users\User\.claude\agents\solution-architect\ref\methodologies.md`
- **Line count:** 145
- **RULE count:** 26 (RULE 2.1 – RULE 2.26)
- **Distinct cited sources:** 11 — Simon Brown (C4model.com / *The C4 Model*); Simon Brown ("Risk Storming," 2012 + riskstorming.com); Starke & Hruschka (arc42); Philippe Kruchten (*IEEE Software* 12(6), 1995); Bass/Clements/Kazman (*Software Architecture in Practice*, 2000) + Wojcik et al. (CMU/SEI-2006-TR-023, ADD 2.0); Eric Evans (*Domain-Driven Design*, 2003); Kazman/Klein/Clements (CMU/SEI-2000-TR-004, ATAM) + Kazman et al. (ICECCS '98); Ford/Parsons/Kua (*Building Evolutionary Architectures*, O'Reilly 2017/2022); Michael Nygard (Cognitect blog, 2011, ADR); The Open Group (TOGAF, versions 1995–2025).
- **`[UNVERIFIED]` items flagged:** 1 — §6 note that "lightweight/mini-ATAM" variants are practitioner adaptations, not part of the citable SEI method (explicitly marked in text, not blended with the cited ATAM description).
- **Verification method:** all citations checked via WebSearch against primary/authoritative sources (c4model.com, docs.arc42.org, SEI library at sei.cmu.edu, Cognitect blog, opengroup.org, IEEE/ACM DL records) during drafting; no fabricated titles, venues, or years.
