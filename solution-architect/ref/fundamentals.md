# fundamentals.md — Universal Architectural Fundamentals
### File 1 of 10 · Knowledge base for a domain-agnostic solution-architect agent

**Tag legend (used across all 10 files):**
- `[T]` — Timeless. Re-derive only if a citation link rots; the underlying claim doesn't age.
- `[TS]` — Time-sensitive. Refresh per the cadence in `sources-and-currency.md`.
- `[UNVERIFIED]` — Claim the agent should treat as a heuristic in use, not a citable fact. None appear in this file; the tag exists for files 4–6, where "best practice" claims outrun citable sources.

Everything in this file is `[T]`. It is the backbone the other 9 files sit on. When a domain-specific rule elsewhere conflicts with a rule here, the conflict is a signal to re-examine the domain rule, not this one — but state the conflict in an ADR rather than silently picking a side.

---

## 1. What "architecture" means (operationally)

Two converging definitions the agent should run on simultaneously:

| Definition | Source | Use it for |
|---|---|---|
| "The decisions that need to be made early in a project" — corrected to "the decisions you wish you could get right early," and "architecture is about the important stuff, whatever that is" | Ralph Johnson, via Martin Fowler, *"Who Needs an Architect?"*, IEEE Software 20(5), 2003 <br> `[T]` | Deciding what deserves an ADR |
| "The shared understanding that the expert developers have of the system design" | Martin Fowler, martinfowler.com/architecture, expanding on Johnson's critique of purely structural definitions <br> `[T]` | Explaining why undocumented tribal knowledge is still "architecture" — and why losing the people who hold it is an architectural risk |

**RULE 1.1** — IF a decision is cheap to reverse (low cost, small blast radius) THEN it is not architecture, regardless of how it feels in the moment. **RATIONALE:** treating reversible decisions with architectural ceremony (ADR review, ATAM, committee sign-off) is the single most common source of process bloat; Johnson's "whatever that is" is explicitly a warning against fixed lists of "architectural" topics (layers, patterns, DB choice) — importance is contextual, not categorical.

This rule is the seed of §7 (reversibility) and is elaborated with a testable procedure there — read this file in order once, but treat §7 as the operational engine and §1 as its justification.

---

## 2. Essential vs. accidental complexity

**Source:** Frederick P. Brooks Jr., *"No Silver Bullet — Essence and Accidents of Software Engineering,"* IFIP 10th World Computing Conference, 1986; reprinted IEEE Computer 20(4), 1987; Ch. 16–17 of *The Mythical Man-Month*, Anniversary Edition, Addison-Wesley, 1995. `[T]`

- **Essential complexity**: inherent to the problem domain. If the business genuinely has 30 distinct rules, the system has 30 distinct rules — no tool, framework, or process removes this.
- **Accidental complexity**: introduced by *how* the essential complexity is expressed and built — language ergonomics, deployment mechanics, boilerplate, incidental tooling friction.

**RULE 2.1** — IF a complexity can be removed by a better representation, tool, or process without changing what the system must actually do THEN it is accidental — attack it aggressively, it is nearly free to remove. IF removing it would mean the system does less or handles fewer real-world cases THEN it is essential — no architectural style substitutes for correctly modeling the domain. **RATIONALE:** teams burn enormous effort "simplifying" architecture by deleting essential complexity (dropping edge cases, ignoring real invariants), which looks like progress and creates defects; classify before you cut.

**RULE 2.2** — IF a proposed architecture change's pitch is "this will make the system simpler" THEN ask which kind of complexity it removes. A change that only relocates essential complexity (e.g., moving validation from the API layer to the database) is not simplification — it's a coupling choice, evaluate it as one (§4).

---

## 3. Conway's Law

**Source:** Melvin E. Conway, *"How Do Committees Invent?"*, Datamation 14(4), April 1968, pp. 28–31; named "Conway's Law" by Fred Brooks in *The Mythical Man-Month* (1975) and independently by George Mealy at the 1968 National Symposium on Modular Programming. `[T]`

> "Organizations which design systems... are constrained to produce designs which are copies of the communication structures of these organizations."

**RULE 3.1** — IF the proposed system boundaries do not match the organization's actual communication structure THEN either (a) change the org structure to match, or (b) expect the system to drift toward the org's shape regardless of the diagram, or (c) explicitly budget for the ongoing translation cost of fighting the drift. Pick one and record it — "we'll just be disciplined" is not (a), (b), or (c).

**RULE 3.2 (inverse — "reverse Conway maneuver")** — IF you want a specific system topology (e.g., N independently deployable services) THEN shape the teams first; the system topology tends to follow team topology faster than the reverse. For the modern operational treatment of team-shaping-as-architecture, see Matthew Skelton & Manuel Pais, *Team Topologies*, IT Revolution Press, 2019. `[T]`

**Consequence for the agent:** every architecture proposal is implicitly an org proposal. When the agent recommends a service boundary, it should flag the team-structure assumption the boundary depends on (see `domain-matrix.md`, team-size heuristics).

---

## 4. Coupling and cohesion

**Source (taxonomy):** Larry L. Constantine & Edward Yourdon, *Structured Design: Fundamentals of a Discipline of Computer Program and Systems Design*, Yourdon Press / Prentice-Hall, 1979. `[T]` — predates OO and microservices but the taxonomy transfers directly (module ↔ service, subroutine call ↔ API call).

**Coupling, worst to best** (lower is better — fewer, narrower, more stable dependencies between units):

| Type | Description | Modern analogue |
|---|---|---|
| Content | One module reaches into another's internals | Reading another service's private DB tables |
| Common | Modules share global/shared mutable state | Shared mutable cache, shared config object with no ownership |
| Control | One module dictates another's internal logic via a flag | `mode` parameter that changes callee's control flow |
| Stamp | Modules share a composite data structure, using only part of it | Passing a full "User" object when only `user.id` is needed |
| Data | Modules share only simple, well-defined data via a clean interface | Typed API contract, single primitive/DTO argument |

**Cohesion, worst to best** (higher is better — a unit's parts serve one purpose):

| Type | Description |
|---|---|
| Coincidental | No meaningful relationship among the module's parts |
| Logical | Parts grouped by category but not by collaboration ("UtilityService") |
| Temporal | Parts grouped because they happen at the same time ("StartupTasks") |
| Procedural | Parts grouped because they follow the same control-flow sequence |
| Communicational | Parts operate on the same data |
| Sequential | Output of one part is the input of the next |
| Functional | Every part contributes to one single, well-defined task — the target |

**RULE 4.1** — IF a proposed module/service exhibits logical or coincidental cohesion (a grab-bag "Utils," "Common," or "Shared" module/service) THEN it is a smell, not a boundary — see `anti-patterns.md` §"god service" / "junk drawer module." Push the classification toward functional cohesion by asking "what one thing does every part of this exist to do?"

**RULE 4.2 (empirical, not just structural coupling)** — Structural coupling (does A call B?) misses coupling induced by shared assumptions and habitual co-change. **IF two components change together in a majority of commits over a representative history (e.g., a rolling 6–12 month window, adjust per release cadence) THEN treat them as one architectural boundary regardless of their structural separation** — either merge them or invest in decoupling their reason to co-change. **Source/technique:** Harald Gall, Karin Hajek, Mehdi Jazayeri, *"Detection of Logical Coupling Based on Product Release History,"* Proc. ICSM '98, IEEE CS, pp. 190–198. `[T]` for the technique; the specific co-change threshold is a practitioner calibration, not from the paper — treat the percentage as a tunable signal, not a law, and validate it against the team's actual commit history before acting on it (see `verification.md`).

**RATIONALE for 4.1/4.2 together:** coupling is a property of *change*, not just of call graphs. A codebase can look decoupled on a dependency diagram and still be tightly coupled in practice if the same PR always touches both halves. Historical co-change data is evidence; a clean diagram is not proof.

---

## 5. Separation of concerns, abstraction, and boundaries

**Source:** Edsger W. Dijkstra, *"On the Role of Scientific Thought,"* EWD447, 30 August 1974. `[T]`

> "One is willing to study in depth an aspect of one's subject matter in isolation for the sake of its own consistency, all the time knowing that one is occupying oneself only with one of the aspects."

Dijkstra's framing is cognitive (how a designer should think, one aspect at a time); Parnas's framing below is structural (how a *system* should be cut). Both are needed — the agent should not treat them as synonyms.

**RULE 5.1** — IF a single component's design cannot be reasoned about, tested, or explained without simultaneously reasoning about another concern (e.g., you cannot describe the billing logic without also describing the retry/network logic) THEN those concerns are not separated, regardless of file/module boundaries. The test is explainability in isolation, not physical location in the codebase.

### Information hiding (the mechanism that makes separation durable)

**Source:** David L. Parnas, *"On the Criteria to Be Used in Decomposing Systems into Modules,"* Communications of the ACM 15(12), December 1972, pp. 1053–1058. `[T]`

Parnas's core move, still the single most useful idea in this file: **decompose around design decisions likely to change, not around steps in a flowchart.** Each module hides one such decision from the rest of the system.

**RULE 5.2** — IF you are decomposing a new system THEN start from "what are the decisions we're least sure of, or most likely to need to change?" (technology choices, business rules in flux, unproven algorithms, third-party dependencies) — not from "what are the sequential processing steps?" Flowchart-shaped decomposition produces modules that all break together when any one assumption changes; decision-shaped decomposition contains the damage.

**RULE 5.3 (the test for information hiding, not the mechanism)** — IF a module's internal representation, algorithm, or storage format can change with zero changes required in any caller THEN information hiding is present. A `private` keyword or a "modular" file layout is not evidence by itself — only the test in the previous sentence is. Interfaces that leak implementation details (e.g., returning ORM entities across a service boundary, exposing internal enums that mirror a specific vendor's API) fail this test even inside a nominally "modular" codebase.

---

## 6. Quality attributes and their tradeoffs

**Source (attribute taxonomy for evaluation):** ISO/IEC 25010, *"Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models,"* first published 2011, revised 2023. `[T]` (the standard itself is stable infrastructure; specific edition text is `[TS]` — check for revisions).

**Source (architecturally-significant subset, the "-ilities" an architect actually trades off):** Len Bass, Paul Clements, Rick Kazman, *Software Architecture in Practice*, SEI Series in Software Engineering, Addison-Wesley (multiple editions). `[T]`

ISO 25010 gives a broad evaluation taxonomy (functional suitability, performance efficiency, compatibility, usability/interaction capability, reliability, security, maintainability, portability — plus quality-in-use characteristics). Bass/Clements/Kazman's *quality attribute scenario* approach is the operational tool: stated as stimulus → environment → response → response measure, so "fast" or "secure" become testable (see `artifacts-and-templates.md` for the scenario template and `verification.md` for how ATAM uses it).

**RULE 6.1** — IF two or more quality attributes are not explicitly ranked THEN the system will rank them implicitly under delivery pressure — almost always in favor of whatever ships fastest, at the expense of whichever attribute has no advocate in the room. Force an explicit, written ranking into the ADR (see `artifacts-and-templates.md`) before design begins, not after a conflict surfaces.

**RULE 6.2** — IF a quality attribute has no stated, measurable target (a number, not an adjective) THEN it cannot be architected for — it can only be argued about. "Fast" is not a requirement; "p99 < 200ms at 500 req/s" is.

### Named, citable tradeoffs the agent should recognize by name

| Tradeoff | What it says | Source |
|---|---|---|
| CAP | Under a network partition, a distributed system must choose consistency or availability, not both | Eric Brewer's conjecture (2000); formalized by Seth Gilbert & Nancy Lynch, *"Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services,"* ACM SIGACT News 33(2), 2002 `[T]` |
| PACELC | Extends CAP: even absent a partition (E), you still trade Latency vs. Consistency (LC) | Daniel J. Abadi, *"Consistency Tradeoffs in Modern Distributed Database System Design,"* IEEE Computer 45(2), 2012 `[T]` |
| Essential vs. accidental (complexity budget) | See §2 — bounds how much "simplification" is actually available | Brooks, 1986/1987 |

**RULE 6.3** — IF a system is single-node / non-distributed THEN CAP does not apply — do not import distributed-systems tradeoff language into a context with no network partition to speak of. This sounds obvious and is nonetheless a recurring anti-pattern: reaching for eventual-consistency reasoning in a monolith with one Postgres instance.

---

## 7. Reversible vs. irreversible decisions ("one-way vs. two-way doors")

**Source:** Jeff Bezos, 2015 Amazon Letter to Shareholders (the "Type 1 / Type 2" framing); reiterated 2016 letter. `[T]` — a business-decision framework, not a software-specific one, but directly portable to architecture decisions and the single highest-leverage governance rule in this file.

> "Some decisions are consequential and irreversible or nearly irreversible — one-way doors... [these] must be made methodically, carefully, slowly, with great deliberation and consultation. But most decisions aren't like that — they are changeable, reversible — they're two-way doors... Type 2 decisions can and should be made quickly by high judgment individuals or small groups."

**This is the master heuristic that governs how much process every other file in this knowledge base recommends.** ADR depth, ATAM sessions, spikes, and committee review are all *expensive verification for one-way doors* — applying them to two-way doors is the primary cause of architectural process becoming a bottleneck (Bezos's own warning: "the tendency to use the heavyweight Type 1 decision-making process on most decisions, including many Type 2 decisions... [causes] slowness, unthoughtful risk aversion, failure to experiment sufficiently").

**RULE 7.1 (classification procedure)** — For any pending decision, estimate two numbers:
1. **Reversal cost** — engineer-time to undo it if wrong (rough order of magnitude: hours / weeks / quarters).
2. **Blast radius** — count of other decisions, teams, or externally-visible contracts that depend on it (e.g., a public API schema, a data model migrated by customers, a hardware form factor, a regulatory filing).

IF reversal cost is weeks+ **AND** blast radius is broad (multiple teams or external parties) THEN treat as a one-way door: full ADR, explicit tradeoff table, ideally a spike/prototype or ATAM-style scenario review before committing (see `verification.md`).
IF reversal cost is hours-to-days **AND** blast radius is contained to one team/component THEN treat as a two-way door: a single accountable owner decides, a lightweight ADR (one paragraph) records it, and the team moves on same-day.

**RULE 7.2** — IF a decision is *labeled* irreversible mostly because reversing it is *inconvenient* rather than actually costly or broad-blast-radius THEN downgrade it — "we'd have to have a meeting about it" is not evidence of a one-way door. Common false-one-way-doors in software: choice of internal folder structure, choice of a specific logging library behind an interface, naming conventions. Common true-one-way-doors: public API contracts, data model choices for data that's expensive/impossible to backfill or migrate, hardware/firmware choices with physical lead times, cryptographic primitives baked into long-lived signed artifacts, anything a regulator or external auditor has signed off on.

**RULE 7.3** — Log every decision classified as one-way in the "one-way vs. two-way door log" artifact (template in `artifacts-and-templates.md`), even ones that turn out well — the log's value is calibrating future classification, not just justifying past ones.

---

## 8. How this file drives the rest of the knowledge base

- §1 + §7 together define **when an ADR is warranted at all** (`artifacts-and-templates.md`).
- §2 defines the **complexity classification** used before applying any decision rule that claims to "simplify" (`decision-rules.md`).
- §3 defines the **team-topology precondition** attached to every service-boundary recommendation (`domain-matrix.md`).
- §4 + §5 define the **test for a correct boundary** (structural + empirical coupling, information-hiding test) that every methodology in `methodologies.md` is ultimately trying to operationalize.
- §6 defines the **quality-attribute vocabulary and scenario format** used by ATAM and fitness functions (`methodologies.md`, `verification.md`).

Nothing above requires refresh on a calendar. If it ever looks wrong for a new system class, the extension procedure in `domain-matrix.md` — not an edit here — is the first place to check whether the *domain* is the exception, before assuming the fundamental is.
