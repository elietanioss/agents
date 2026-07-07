# sources-and-currency.md — Citation Index & Refresh Protocol
### File 10 of 10 · Knowledge base for a domain-agnostic solution-architect agent

**Purpose.** This file is the KB's memory of *what it knows and how fresh it is*. It does two jobs: (1) a master index of every source the other 9 files cite, so a claim can be traced to origin; (2) a refresh protocol that tells the agent which claims decay on a calendar and how to re-verify them. The agent reads this file when a user asks "is this still current?", before quoting any version number, and on the refresh cadences below.

**Tag legend** (same as `fundamentals.md`): `[T]` timeless · `[TS]` time-sensitive · `[UNVERIFIED]` heuristic, not a citable fact.

**The governing rule of this file:**

**RULE 10.1** — IF the agent is about to state a version number, a price, a benchmarked throughput, a "current best tool," or an edition year THEN it must treat that token as `[TS]` and either (a) cite the freshness note here, or (b) if the cadence below says the item is due for refresh, verify it live (WebSearch) before asserting it, or (c) explicitly hedge ("as of the last KB refresh, <date>; verify current"). **RATIONALE:** the fastest way this KB loses trust is confidently quoting a stale TOGAF version, WCAG level, or model price as fact. The timeless layer (§1–§7 of `fundamentals.md`, the decision heuristics, the anti-patterns) does not need this treatment; the specifics do.

---

## 1. Master citation index (by durability)

### 1a. Timeless foundations `[T]` — books & papers that do not age
Re-verify only if a link rots; the claim stands regardless.

| Work | Used in | Anchors |
|---|---|---|
| Brooks, *No Silver Bullet* (1986/87) & *Mythical Man-Month* (1975/95) | fundamentals §2, anti-patterns | essential vs accidental complexity; second-system effect |
| Conway, *How Do Committees Invent?* (1968) | fundamentals §3, decision-rules, domain-matrix | Conway's Law |
| Constantine & Yourdon, *Structured Design* (1979) | fundamentals §4 | coupling/cohesion taxonomy |
| Parnas, *On the Criteria...Decomposing Systems* (CACM 1972) | fundamentals §5 | information hiding |
| Dijkstra, *On the Role of Scientific Thought* (EWD447, 1974) | fundamentals §5 | separation of concerns |
| Gilbert & Lynch (2002) / Brewer (2000) | fundamentals §6, decision-rules | CAP |
| Abadi, *Consistency Tradeoffs...* (IEEE 2012) | fundamentals §6, decision-rules | PACELC |
| Bezos, 2015/2016 shareholder letters | fundamentals §7 (the master heuristic) | one-way / two-way doors |
| Gall, Hajek, Jazayeri, *Detection of Logical Coupling* (ICSM '98) | fundamentals §4, verification | co-change coupling |
| Bass, Clements, Kazman, *Software Architecture in Practice* | fundamentals §6, methodologies, artifacts | quality-attribute scenarios |
| Kruchten, *4+1 View Model* (IEEE 1995) | methodologies | view models |
| Evans, *Domain-Driven Design* (2003) | methodologies, decision-rules | bounded contexts |
| Kazman/Klein/Clements, *ATAM* (CMU/SEI-2000-TR-004) | methodologies, verification | scenario-based evaluation |
| Ford/Parsons/Kua, *Building Evolutionary Architectures* (2017/22) | methodologies, verification | fitness functions |
| Nygard, *Documenting Architecture Decisions* (2011) & *Release It!* (2007/18) | methodologies, artifacts, cross-cutting | ADR format; stability patterns |
| Foote & Yoder, *Big Ball of Mud* (PLoP '97) | anti-patterns | god-system default |
| Dean & Barroso, *The Tail at Scale* (CACM 2013) | cross-cutting, verification | tail latency |
| Little, *L = λW* (Oper. Research 1961) | decision-rules, cross-cutting | queue-growth test |
| Amdahl (1967) & Gustafson (1988) | domain-matrix (HPC) | parallel speedup ceilings |
| Sha/Rajkumar/Lehoczky, *Priority Inheritance Protocols* (IEEE 1990) | anti-patterns | priority inversion |
| Kohnfelder & Garg (1999) / Shostack, *Threat Modeling* (2014) | cross-cutting | STRIDE |
| Google, *Site Reliability Engineering* (2016) + *Workbook* (2018) | cross-cutting | SLI/SLO/error budgets |
| Lewis & Fowler, *Microservices* (2014); Fowler, *MonolithFirst* (2015) | decision-rules, anti-patterns | smart-endpoints/dumb-pipes; monolith-first |
| Skelton & Pais, *Team Topologies* (2019) | fundamentals §3, domain-matrix | reverse-Conway |

### 1b. Standards `[TS]` — real & authoritative, but editions revise
**Verify the edition/version before quoting a number.** Cadence in §2.

ISO/IEC 25010 (quality model, 2011→2023) · ISO/IEC/IEEE 42010 (architecture description) · TOGAF (1995→10, 2022; **fastest-churning**) · WCAG (2.2, Oct 2023) · PCI-DSS (v4.0) · GDPR · HIPAA · ISO 26262 (automotive) · DO-178C (avionics) · IEC 61508 (generic functional safety) · IEC 62304 (medical) · MISRA C · FMEA family (MIL-STD-1629A / IEC 60812:2018 / SAE J1739) · FinOps Framework.

### 1c. Practitioner / web sources — mixed `[T]`/`[TS]`
C4 model (c4model.com, Simon Brown) · arc42 (Starke & Hruschka) · Risk Storming · Wardley Mapping · Reactive Manifesto v2.0 (2014) · Brooker, *Exponential Backoff and Jitter* (AWS, 2015) · Richardson, transactional outbox (microservices.io) · Stripe idempotency docs · Majors/Fong-Jones/Miranda, *Observability Engineering* (2022) · CHAOSS bus-factor · Taleb, *Antifragile* / Lindy (2012) · Gaffer on Games, *Fix Your Timestep!* · Android offline-first docs · Brown et al., *AntiPatterns* (1998) · Fritzsch et al., résumé-driven development (ICSE-SEIS 2021) · Roofline model (NERSC).

---

## 2. Refresh cadence table

Cadence = how often the agent should re-verify before asserting the item as current. "On-quote" = verify live every time you cite a specific number to a user, regardless of calendar.

| Item / claim class | File(s) | Tag | Cadence | What to check |
|---|---|---|---|---|
| TOGAF version | methodologies | `[TS]` | on-quote | current version # (churns fastest in the KB) |
| WCAG version/level references | cross-cutting | `[TS]` | on-quote | newer version than 2.2? |
| Safety standards editions (26262, DO-178C, 61508, 62304, MISRA C) | domain-matrix, cross-cutting | `[TS]` | 12 mo | current edition year before citing to a regulated client |
| ISO/IEC 25010 edition | fundamentals §6 | `[TS]` | 24 mo | revision after 2023 |
| PCI-DSS / GDPR / HIPAA specifics | cross-cutting | `[TS]` | 12 mo | amendments; enforcement changes |
| FinOps Framework specifics | cross-cutting | `[TS]` | 12 mo | framework version/certification tracks |
| Named "current best" tools (Structurizr, ArchUnit, Deptrac, MS Threat Modeling Tool, Augur/GrimoireLab, stream processors) | methodologies, cross-cutting, domain-matrix | `[TS]` | 6 mo | still maintained / still leader / replaced |
| Language/framework/datastore/cloud names | stack-selection, domain-matrix | `[TS]` | 6–12 mo | re-score via stack-selection.md §"re-scoring procedure" |
| LLM cost/context/pricing & RAG-vs-long-context numbers | domain-matrix (LLM), decision-rules | `[TS]` | on-quote | model prices, context windows shift per generation |
| Blockchain consensus throughput benchmarks | domain-matrix | `[TS]` | on-quote | active research area |
| HPC hardware ceilings (Roofline specifics) | domain-matrix | `[TS]` | per HW gen | current accelerator peak FLOP/s & bandwidth |
| All `[T]` foundations (§1a) | all | `[T]` | never (link-rot only) | replace dead URL, keep claim |

---

## 3. Refresh procedure (how to re-research a stale item)

**RULE 10.2** — When an item is due (per §2) or a user challenges its currency:
1. **Isolate the token.** Separate the durable claim from the perishable specific. ("Use a circuit breaker" `[T]` vs "resilience4j is the library" `[TS]`) — only the specific needs refresh.
2. **WebSearch the primary source**, not a blog aggregator — the standards body, the tool's own repo/release notes, the vendor pricing page.
3. **If changed:** update the specific in the owning file, keep the surrounding rule/rationale intact, and bump the freshness note here. **If a `[T]` claim itself looks wrong** (rare), do NOT quietly edit — open an ADR (`artifacts-and-templates.md`) documenting the conflict, per `fundamentals.md`'s rule that a fundamental is the last thing to suspect.
4. **If unverifiable:** downgrade the claim to `[UNVERIFIED]` and say so to the user rather than asserting it.

**RULE 10.3** — IF asked to design in a domain whose specifics this KB tags `[TS]` and the cadence is overdue THEN do a live pass on that domain's tech before recommending a stack — the timeless decision framework (`decision-rules.md`, `stack-selection.md`) still applies unchanged; only the candidate list needs refreshing.

---

## 4. `[UNVERIFIED]` register — treat as calibratable heuristics, not facts

These are the load-bearing numbers/claims across the KB that outrun a citable source. The agent must present them as tunable heuristics and, where possible, calibrate against the specific system (per `verification.md`) before betting a one-way door on them.

- **Co-change threshold** for "same boundary" (fundamentals §4 RULE 4.2) — the majority-of-commits % is a practitioner calibration; validate on the real repo's git history.
- **Decision-rule thresholds** in `decision-rules.md` tied to team size / request rate / data volume — starting points, not laws; ~37 `[UNVERIFIED]` tags across the KB concentrate here and in stack/domain specifics, as `fundamentals.md` predicted.
- **Wardley stage placement** of any specific capability — a judgment call, not a formula.
- **Lindy/age-implies-robustness** as a predictor for a *specific* candidate — a prior to weight, not a guarantee.
- **Spike duration** ("half-day to two weeks") — calibration, not a rule.
- **Folklore-named anti-patterns** (distributed monolith, premature microservices, chatty interfaces, etc.) — real phenomena, no single canonical citation; named honestly as industry folklore in `anti-patterns.md`.
- **Observability "three pillars"** — accessible baseline vocabulary; the high-cardinality-events critique is one influential book's position, not settled consensus.

---

## 5. How this file drives the rest
- It is the enforcement point for `fundamentals.md`'s `[T]`/`[TS]`/`[UNVERIFIED]` discipline — the other 9 files tag; this file schedules and traces.
- Any file quoting a version/price/tool defers to §2's cadence and RULE 10.1's on-quote check.
- The `[UNVERIFIED]` register (§4) is the to-do list for `verification.md`: each entry is a heuristic that a real project's telemetry can turn into a validated, system-specific number.
- When `domain-matrix.md`'s extension procedure adds a new system class, add its `[TS]` tech specifics to §2 with a cadence so the new class ages gracefully too.
