# domain-matrix.md — Per-System-Class Reference
### File 5 of 10 · Knowledge base for a domain-agnostic solution-architect agent

**Tag legend (repeated from `fundamentals.md` for standalone readability):**
- `[T]` — Timeless. Re-derive only if a citation link rots; the underlying claim doesn't age.
- `[TS]` — Time-sensitive. Refresh per the cadence in `sources-and-currency.md`.
- `[UNVERIFIED]` — Claim the agent should treat as a heuristic in use, not a citable fact.

Each system class below is scored the same way: **dominant quality attributes** (what usually wins the tradeoff when attributes conflict, per `fundamentals.md` RULE 6.1) → **canonical architecture patterns** → **typical component topology** → **hard constraints** → **team-size/topology heuristics** (tied to `fundamentals.md` §3, Conway's Law) → **top recurring anti-patterns** (cross-ref `anti-patterns.md`). The per-class *fundamentals* (what dominates, why) are `[T]`; the specific technologies named as examples are `[TS]` and are placeholders for whatever `stack-selection.md`'s method currently outputs.

**This file does not replace `stack-selection.md`.** It tells you *which criteria to weight heavily* for a given system class; `stack-selection.md` tells you *how to turn that weighting into an actual technology choice*.

---

## 1. Web / SaaS applications

**Dominant quality attributes:** usability/time-to-interactive, availability, and iteration speed usually outrank raw performance; security (auth, multi-tenancy isolation) is non-negotiable the moment real user data is involved.

**Canonical patterns:** modular monolith by default (`decision-rules.md` §1); layered architecture (presentation/application/domain/data); BFF (Backend-for-Frontend) when multiple client types diverge significantly (`decision-rules.md` RULE 7.1); CQRS only when read/write load or models genuinely diverge, not by default.

**Typical component topology:** client (SPA/SSR) → API layer → application/domain logic → relational primary store (`decision-rules.md` RULE 3.1) → cache (RULE 3.5) → background job/queue for async work (RULE 2.2).

**Hard constraints:** multi-tenant data isolation, session/auth correctness, browser/device compatibility, regulatory data-handling requirements when applicable (GDPR-class rules) — `[T]` for the constraint category, `[TS]` for which specific regulations apply where.

**Team-size/topology heuristics:** small teams (2–8 engineers) map well to a modular monolith with clear module ownership; per `fundamentals.md` §3 and `decision-rules.md` RULE 1.1, don't split services faster than you can split accountable teams.

**Top recurring anti-patterns:** premature microservices split (`decision-rules.md` §1, §6 — distributed monolith); missing multi-tenancy isolation boundary treated as an afterthought instead of a day-one architectural decision; caching added before a measured bottleneck exists (`decision-rules.md` RULE 3.5). See `anti-patterns.md`.

---

## 2. Distributed / backend systems (general, non-web-specific)

**Dominant quality attributes:** availability and consistency, explicitly ranked per data type (`decision-rules.md` RULE 3.8) — there is rarely one right answer for a whole system; partition tolerance behavior must be a stated design decision, not a default.

**Canonical patterns:** service-per-forcing-function (`decision-rules.md` RULE 1.3), event-driven choreography for simple flows / orchestration for auditable multi-step flows (RULE 7.3), saga pattern for cross-service transactions where a single ACID transaction isn't available.

**Typical component topology:** N services, each single-writer per owned data (`decision-rules.md` RULE 3.7), message broker or event log as the "dumb pipe" (RULE 7.2), API gateway or service mesh for cross-cutting concerns (auth, rate limiting) kept intentionally logic-free.

**Hard constraints:** CAP/PACELC applies for real here (`fundamentals.md` §6) — must be resolved per data type, not assumed away; the fallacies of distributed computing (`decision-rules.md` RULE 2.6) apply to every inter-service call.

**Team-size/topology heuristics:** service boundary count should not exceed accountable-team count (`decision-rules.md` RULE 1.1); Team Topologies' stream-aligned/platform/enabling/complicated-subsystem team types map directly onto service ownership — a platform team owns the shared "dumb pipe" infrastructure, stream-aligned teams own business-capability services. **Source:** Matthew Skelton & Manuel Pais, *Team Topologies*, IT Revolution Press, 2019 `[T]`, already cited in `fundamentals.md` RULE 3.2.

**Top recurring anti-patterns:** distributed monolith (`decision-rules.md` RULE 6.2); orchestration logic leaking into the message broker/ESB config (RULE 7.2a); missing idempotency on retryable operations (RULE 4.3/4.4). See `anti-patterns.md`.

---

## 3. Native / systems programming (C/C++, performance-critical non-embedded)

**Dominant quality attributes:** raw performance and memory-safety/control usually dominate; predictable resource usage (no GC pauses, explicit lifetime management) is often the entire reason this system class was chosen over a managed-runtime alternative.

**Canonical patterns:** RAII and explicit ownership models (unique/shared ownership, avoid raw ownership ambiguity); plugin/backend-abstraction interfaces to isolate volatile third-party dependencies (`fundamentals.md` §5, information hiding around "the decision most likely to change" — e.g., a specific rendering or parsing backend); build-time feature flags over runtime polymorphism where the performance cost of virtual dispatch matters.

**Typical component topology:** core engine/library with a stable ABI or API boundary, thin platform-specific shims at the edges (`decision-rules.md` RULE 7.1 — push platform variance to the edge), sanitizer-instrumented builds as a parallel build target (ASan/UBSan/TSan) rather than an afterthought.

**Hard constraints:** memory safety (manual or via modern C++ idioms — smart pointers, bounds-checked containers), ABI stability across releases if the component is a library consumed by others, undefined-behavior avoidance (compiler/version sensitivity).

**Team-size/topology heuristics:** favors smaller, senior-heavy teams — the failure cost per defect (memory corruption, UB) is higher than in managed runtimes, so code review depth per change tends to matter more than raw team size.

**Top recurring anti-patterns:** premature micro-optimization before profiling (violates `fundamentals.md` RULE 6.2 — no measured target, just a vibe); leaking implementation details across the library's public API boundary (`fundamentals.md` RULE 5.3's information-hiding test failing in practice — e.g., exposing an internal allocator or container type in a public header). See `anti-patterns.md`.

---

## 4. Embedded / RTOS / resource-constrained

**Dominant quality attributes:** determinism (worst-case execution time, not average-case), memory footprint (often kilobytes, not gigabytes), and power consumption dominate over throughput or developer convenience.

**Canonical patterns:** static memory allocation (avoid dynamic allocation post-init to guarantee determinism and avoid fragmentation), fixed-priority preemptive scheduling (RTOS task model), interrupt-service-routine minimalism (defer work to a task, don't do it in the ISR), watchdog timers for fault recovery.

**Typical component topology:** hardware abstraction layer (HAL) → RTOS kernel/scheduler → application tasks communicating via queues/semaphores, no dynamic module loading, often a single static binary image.

**Hard constraints:** flash/RAM budget is a hard ceiling, not a soft target; power budget for battery-operated devices; real-time deadlines are correctness properties, not performance nice-to-haves — missing a deadline can be as wrong as a logic bug. Coding standards exist specifically to bound undefined behavior on constrained/critical targets. **Source:** MISRA C — a coding-standard subset of the C language, originating in the automotive sector (MISRA project founded 1990) and now used across safety/security-critical embedded sectors generally; the guidelines exist specifically to "limit the use of the C language... to enforce determinism, prevent run-time faults, and provide consistency across target platforms." `[T]` for the standard's purpose and existence; `[TS]` for the current guideline edition (MISRA C is periodically revised).

**Team-size/topology heuristics:** tight coupling to hardware means team structure often mirrors hardware boundaries (one team per board/subsystem); cross-team interface contracts (register maps, timing budgets) need the same rigor as a public API, because a hardware revision is a much harder one-way door than a software interface change (`fundamentals.md` §7).

**Top recurring anti-patterns:** dynamic allocation creeping in post-prototype (breaks determinism guarantees established early); treating a soft real-time system's occasional missed deadline the same as a hard real-time system's (the failure cost is categorically different — conflating them under one "performance" quality attribute hides the actual requirement, per `fundamentals.md` RULE 6.2). See `anti-patterns.md`.

---

## 5. Safety-critical systems (aviation, medical, automotive, rail, industrial)

**Dominant quality attribute:** verifiability dominates everything else — a feature that cannot be proven correct to the required assurance level is not shippable regardless of how well it performs or how good the UX is. This is qualitatively different from "quality matters a lot" — it means process and evidence generation are architectural constraints, not an afterthought bolted onto engineering.

**Canonical patterns:** requirements-based testing with full traceability (every requirement traces to a test, every test traces to a requirement — no orphans in either direction); redundancy/voting architectures (e.g., triple-modular redundancy) for the highest assurance levels; formal methods or model checking for the most critical components; strict configuration management (every build is reproducible and traceable to an exact source/tool version).

**Typical component topology:** partitioned architecture separating components by assurance level (a lower-assurance component must not be able to corrupt a higher-assurance one — spatial/temporal partitioning), often on a certified RTOS foundation (ties to §4 above).

**Hard constraints:** governed by domain-specific standards that assign a discrete integrity/assurance level and dictate the process rigor required at each level. **Source:** DO-178C (RTCA/EUROCAE, aviation software, Design Assurance Levels A–E), ISO 26262 (automotive functional safety, Automotive Safety Integrity Levels A–D, adapting IEC 61508 principles for automotive), IEC 61508 (the generic industry-agnostic functional-safety standard, Safety Integrity Levels 1–4), IEC 62304 (medical device software). `[T]` for the existence and purpose of tiered assurance levels across these standards; `[TS]` for specific edition/revision details, which change on a multi-year cycle per standard.

**Team-size/topology heuristics:** independent verification & validation (V&V) roles are often mandated to be organizationally separate from the development team — this is a Conway's-Law-aware requirement baked directly into the standards themselves (`fundamentals.md` §3): the org chart must reflect the independence the standard requires, not just the code structure.

**Top recurring anti-patterns:** treating certification evidence as paperwork generated after the fact instead of a build artifact generated continuously (makes late-stage certification a crisis); allowing a low-assurance component's failure mode to have an unbounded blast radius into a high-assurance one (a partitioning failure, `decision-rules.md` RULE 6.2's distributed-monolith logic applied to safety domains instead of deployment). See `anti-patterns.md`.

---

## 6. Mobile applications (iOS/Android)

**Dominant quality attributes:** offline resilience, battery/network economy, and constrained release/update cadence (app-store review cycles, no instant rollback) dominate over server-side concerns like horizontal scale.

**Canonical patterns:** offline-first architecture — the local database is the source of truth for the UI, network sync is a background reconciliation process, not a blocking dependency. **Source:** Android Developers, *"Build an offline-first app,"* developer.android.com/topic/architecture/data-layer/offline-first `[TS]` for the specific guidance, `[T]` for the underlying pattern (treat network as sync mechanism, not as the primary read/write path). Conflict resolution typically via last-write-wins with timestamp metadata, or explicit merge UI for high-stakes conflicts (ties to `decision-rules.md` RULE 3.7, single-writer/conflict-resolution logic, applied at the device-vs-server level instead of service-vs-service).

**Typical component topology:** local persistent store (on-device DB) ↔ sync/repository layer ↔ remote API, with explicit network-state awareness (fetch only under acceptable battery/connectivity conditions) built into the sync layer rather than assumed.

**Hard constraints:** app-store review latency and policy compliance (a shipped bug cannot be instantly rolled back the way a server deploy can — this changes the risk calculus for what counts as a one-way door, `fundamentals.md` §7, compared to a backend release); binary size budgets; OS-version fragmentation (must support a range of OS versions, not just the latest); battery and background-execution limits imposed by the OS, not the app.

**Team-size/topology heuristics:** platform split (iOS/Android/shared-core) is a common team boundary; whether to share business logic (via a cross-platform framework or a shared core module) vs. duplicate it natively is itself a `stack-selection.md`-governed decision weighted heavily on team skill/hiring pool and problem-fit (native performance/UX fidelity needs vs. two-team maintenance cost).

**Top recurring anti-patterns:** treating network as always-available and offline as an edge case (inverts the offline-first pattern and produces poor perceived reliability); shipping a data-sync conflict strategy as an implicit accident of implementation order rather than a stated design decision (mirrors `decision-rules.md` RULE 3.7's warning against accidental last-write-wins). See `anti-patterns.md`.

---

## 7. Desktop applications

**Dominant quality attributes:** responsiveness of the UI thread (never block it), install/update mechanics that respect the user's OS conventions, and — depending on distribution model — offline capability by default (unlike web, there's no server fallback assumption).

**Canonical patterns:** strict UI-thread/worker-thread separation (long-running work never runs on the UI thread); plugin/extension architecture via a stable internal API when third-party extensibility is a goal; auto-update mechanisms with rollback capability (the desktop analogue of a canary deploy, since there's no server-side kill switch).

**Typical component topology:** UI layer (native toolkit or embedded web view) → application/domain core → local persistence (file-based or embedded DB) → optional sync/cloud layer if the product has a networked component.

**Hard constraints:** cross-platform OS API differences if targeting multiple OSes; code-signing and OS-level security gatekeeping (notarization, SmartScreen-class mechanisms) as a release-blocking dependency, not an afterthought; backward compatibility with user data files across versions (a desktop app's file format is frequently a true one-way door once users have years of files in it — `fundamentals.md` RULE 7.2).

**Team-size/topology heuristics:** similar to native/systems programming (§3) when performance-critical; platform-specific shims at the edge (`decision-rules.md` RULE 7.1) if cross-platform.

**Top recurring anti-patterns:** blocking the UI thread with I/O or long computation (the single most common desktop-specific defect class); treating the on-disk file format as a two-way door when users have already accumulated years of files in it (should have been versioned and migration-planned from the start). See `anti-patterns.md`.

---

## 8. Data engineering / pipelines

**Dominant quality attributes:** throughput and correctness (exactly the semantics the business needs — at-least-once vs. exactly-once processing guarantees, stated explicitly) dominate over low single-request latency, which is rarely the point of a pipeline.

**Canonical patterns:** Lambda architecture (separate batch and speed/streaming layers, reconciled) when batch and stream genuinely need different processing logic (e.g., a batch layer doing complex joins/ML training a stream processor can't do efficiently); Kappa architecture (single streaming engine, backed by a replayable log, handling both real-time and reprocessing-from-replay) when the same logic serves both needs — Kappa is the simpler default absent a concrete reason to split. **Source:** the Lambda/Kappa distinction as widely practiced in the data-engineering field `[T]` for the architectural tradeoff itself (does the batch layer do something the stream layer structurally cannot); `[TS]` for specific implementing technologies (stream processors, log-based brokers), which shift generation to generation.

**Typical component topology:** ingestion (batch extract or streaming source) → processing (transform/aggregate) → storage (data lake/warehouse) → serving layer (BI tool, downstream API, ML feature store). Idempotency (`decision-rules.md` RULE 4.3/4.4) is mandatory at every stage boundary given at-least-once delivery is the norm for most streaming infrastructure.

**Hard constraints:** data volume growth trajectory (partitioning/sharding decisions, `decision-rules.md` RULE 8.2, are frequently one-way doors here because repartitioning a data lake after the fact is expensive); schema evolution (upstream schema changes must not silently corrupt downstream consumers); Little's Law (`decision-rules.md` RULE 2.4) governs whether a pipeline's queue depth is stable or growing unboundedly as volume increases.

**Team-size/topology heuristics:** often a platform-team responsibility (Team Topologies' platform-team archetype, §2 above) serving multiple stream-aligned product teams as consumers of curated data — the pipeline team's job is reducing the cognitive load of "how do I get clean data" for everyone else.

**Top recurring anti-patterns:** unbounded queues masquerading as a fix for backpressure (`decision-rules.md` RULE 2.4 — deferred, amplified failure, not a solution); batch jobs that no longer fit their processing window as volume grows, patched with more compute instead of re-architected (RULE 2.5's stated trigger for moving to streaming, ignored until it's a production incident). See `anti-patterns.md`.

---

## 9. ML / AI systems (traditional ML pipelines, training/serving)

**Dominant quality attributes:** reproducibility of training runs, data/feature lineage, and evaluation rigor (does the model actually perform against a held-out, representative test set) dominate over raw serving throughput in most cases — a fast model that's wrong is worse than a slower one that's right, and an unreproducible training run is a maintenance time bomb.

**Canonical patterns:** separate training and serving infrastructure with a versioned model artifact as the contract between them; feature store as the shared, versioned source of truth for features used in both training and serving (prevents training/serving skew); offline evaluation gate before any model reaches production traffic; shadow deployment or canary rollout for new model versions rather than a hard cutover, given that model quality regressions are often silent (no exception thrown, just worse predictions).

**Typical component topology:** data ingestion/labeling → feature engineering/feature store → training pipeline (versioned, reproducible) → model registry → serving layer (batch or online inference) → monitoring (data drift, prediction drift, business-metric impact).

**Hard constraints:** training/serving skew (the single most common ML-specific defect class — features computed differently at training time vs. serving time); data drift over time silently degrading a model with no code change to blame; labeling/ground-truth quality bounding the achievable model quality regardless of architecture sophistication.

**Team-size/topology heuristics:** frequently a "complicated subsystem" team (Team Topologies' fourth archetype, alongside stream-aligned/platform/enabling) — ML expertise is scarce enough that a dedicated team serving multiple product teams is common, with the same platform-team cognitive-load-reduction goal as §8's data pipeline team.

**Top recurring anti-patterns:** evaluating a model only on aggregate accuracy with no held-out/representative test set (violates `fundamentals.md` RULE 6.2 — "accurate" without a measured, representative target is not a requirement); deploying a new model version with no rollback path when quality regressions are silent rather than crash-loud. See `anti-patterns.md`.

---

## 10. LLM-application systems (agents, RAG, LLM-as-a-service integrations)

**Dominant quality attributes:** cost-per-token/request and latency (both directly billed, per-call, unlike traditional compute) alongside **eval-driven correctness** — since LLM output is non-deterministic and can't be unit-tested the traditional way, systematic evaluation harnesses are the substitute for the test suite a conventional system would have.

**Canonical patterns:** Retrieval-Augmented Generation (RAG) to ground responses in a maintained knowledge source rather than relying solely on model parametric knowledge or an expensively large context window — RAG demonstrably reduces both token cost and hallucination risk relative to long-context-only approaches for document-grounded tasks, at the cost of retrieval-pipeline complexity and potential retrieval-quality bottlenecks. **Source:** comparative analysis of RAG vs. long-context architectures for document-grounded generation, e.g. arXiv:2606.20898, *"The Token Tax of Epistemic Accuracy,"* 2026 `[TS]` — the specific cost/quality numbers shift as model context windows and pricing change generation to generation, but the RAG-vs-long-context tradeoff itself (retrieval complexity vs. token cost vs. grounding quality) is `[T]`. Semantic caching (cache responses keyed by embedding similarity of the query, not exact string match) is a distinctive cache-invalidation pattern beyond `decision-rules.md` RULE 3.5's general cache guidance, because "the same request" is a fuzzy-match problem here, not an exact-match one. Prompt-prefix caching (providers commonly discount repeated static prefixes heavily) makes "keep the system prompt/tool schema stable and put variable content at the end" an architecturally meaningful ordering decision, not just a style preference.

**Typical component topology:** client/agent orchestrator → tool-calling/function layer → retrieval layer (vector store + reranking, if RAG) → LLM provider call (with caching/routing layer) → guardrail/validation layer (schema validation, safety filtering) → eval harness running continuously against the whole pipeline, not just at release time.

**Hard constraints:** non-determinism means the same input can legitimately produce different outputs — architecture must accommodate this (idempotency semantics from `decision-rules.md` RULE 4.3 need adaptation: "retry-safe" for an LLM call means "safe to call again," not "will return the identical result"); token-window limits bound how much context can be supplied per call, forcing an explicit strategy (RAG, summarization, truncation) rather than "just include everything"; provider rate limits and pricing-model volatility (`stack-selection.md` §1's operational-cost criterion is unusually volatile in this domain and should be re-scored per `stack-selection.md` §6 more frequently than most other criteria).

**Team-size/topology heuristics:** the eval harness is commonly owned centrally (a platform/enabling-team function, §2/§8/§9 above) even when individual agent/prompt logic is owned by product teams — this mirrors the data-pipeline and ML-platform pattern: a shared, curated quality gate serving many consumers.

**Top recurring anti-patterns:** shipping prompt/agent changes with no systematic eval regression check (the LLM-app equivalent of shipping with no test suite); treating a long context window as a substitute for retrieval architecture past the point where token cost and hallucination-under-noise both degrade (ties to the RAG-vs-long-context tradeoff above); no fallback/guardrail path when the model output fails schema validation or violates a safety constraint, treating "the model complied" as an assumption rather than a checked postcondition. See `anti-patterns.md`.

---

## 11. Real-time / games

**Dominant quality attribute:** frame budget — every subsystem (rendering, physics, AI, audio) shares a fixed, hard time budget per frame (e.g., 16.6ms for 60fps), and blowing it is a correctness failure (visible stutter, physics instability), not merely a "slow" annotation on a ticket.

**Canonical patterns:** fixed-timestep simulation decoupled from variable-rate rendering — the simulation advances in discrete, fixed `dt` steps regardless of the actual frame rate, while rendering interpolates between simulation states at whatever rate the display achieves; this avoids simulation instability (e.g., physics behaving differently at 30fps vs. 144fps) that a naive variable-timestep loop produces. **Source:** Glenn Fiedler ("Gaffer on Games"), *"Fix Your Timestep!,"* gafferongames.com `[T]` for the pattern and its rationale; the specific code idioms shift with engine/API generation (`[TS]`). Bounded catch-up / clamped max steps-per-frame to avoid the "spiral of death" (a slow frame produces a larger next-frame delta, producing an even larger next delta, compounding until the simulation never catches up) — the fix is either ensuring the simulation step itself is fast enough to run multiple times within a frame's real-time budget, or explicitly clamping and accepting slowdown under load rather than an unbounded spiral.

**Typical component topology:** game loop (input → fixed-step simulation/physics → variable-rate render, per the pattern above) → entity/component system (data-oriented layouts favored for cache locality at scale) → asset pipeline (offline-baked where possible to keep runtime cost predictable) → networking layer (for multiplayer: client prediction + server reconciliation, since round-trip latency cannot be hidden any other way within a frame budget).

**Hard constraints:** the frame budget itself (hard real-time-adjacent, though typically "soft" — missing one frame is bad, not catastrophic, unlike §4/§5's hard real-time); memory budget on constrained platforms (consoles, mobile) where allocation patterns matter as much as total memory; input latency (the delay between physical input and visible response) as a directly player-perceptible quality attribute distinct from frame rate itself.

**Team-size/topology heuristics:** engine team (platform team analogue, §2/§8) vs. gameplay teams (stream-aligned analogue) is the dominant split in larger studios; small teams often collapse this distinction entirely and accept tighter coupling between engine and gameplay code as a deliberate, reversible-later tradeoff (`fundamentals.md` §7 — appropriate for a small team where the "cost" of that coupling is currently low).

**Top recurring anti-patterns:** variable-timestep simulation logic that behaves differently across frame rates (breaks determinism for replays, multiplayer sync, and speedrun-class scrutiny alike); unbounded frame-time catch-up loops producing the spiral of death under any load spike; treating network latency as hideable rather than architecting for it explicitly via prediction/reconciliation (a specific instance of `decision-rules.md` RULE 2.6's distributed-computing fallacies, applied to a domain where the "network" is often dismissed as "just multiplayer, not the core game"). See `anti-patterns.md`.

---

## 12. CLI tools / libraries (developer-facing)

**Dominant quality attributes:** API/interface stability (a library's public surface is a contract with every downstream consumer, and breaking it has a blast radius the maintainer often cannot even fully see, per `fundamentals.md` RULE 7.2's true one-way-door list) and installation/dependency-footprint simplicity dominate over feature breadth.

**Canonical patterns:** semantic versioning as an explicit communication contract for breaking vs. non-breaking changes; minimal transitive dependency footprint (every dependency is a supply-chain and version-conflict liability inherited by every consumer, multiplied across the consumer's own dependency tree); a stable core API with experimental/unstable features clearly namespaced and excluded from the stability guarantee (Parnas's information-hiding test, `fundamentals.md` RULE 5.3, applied to what the maintainer promises never to break vs. what remains free to change).

**Typical component topology:** public API/CLI surface → internal implementation (free to change per RULE 5.3) → thin platform-specific adapters if cross-platform (`decision-rules.md` RULE 7.1). For CLIs specifically: argument-parsing/UX layer kept separate from the underlying library logic, so the library remains embeddable by other programs even if the CLI wrapper's UX changes.

**Hard constraints:** backward compatibility across versions is a true one-way door once the library has external consumers (`fundamentals.md` RULE 7.2) — a breaking change requires a major-version bump and a migration path, not a silent behavior change; cross-platform behavior consistency if the tool targets multiple OSes; startup/cold-start latency matters disproportionately for CLIs invoked frequently in scripts or CI.

**Team-size/topology heuristics:** often maintained by very small teams or individuals relative to consumer count — this asymmetry (few maintainers, many consumers) is exactly why `stack-selection.md` §4's community-health/bus-factor signals matter so much when *choosing* a library dependency, and why a library maintainer's own governance/succession plan matters if the library is to be depended on for years.

**Top recurring anti-patterns:** breaking the public API without a major-version signal (violates the semver contract the whole ecosystem relies on); accumulating transitive dependencies without auditing their own health (`decision-rules.md` RULE 5.4 — inherited, not just incurred, since a library's dependency becomes every consumer's dependency); leaking an internal implementation detail (a specific error type, an internal data structure) through the public API, failing `fundamentals.md`'s information-hiding test in a way that's especially costly to fix later because of the same one-way-door dynamic. See `anti-patterns.md`.

---

## 13. Blockchain / distributed ledger systems

**Dominant quality attributes:** finality guarantees and immutability (the ledger's core value proposition) traded explicitly against throughput and latency — this is CAP/PACELC (`fundamentals.md` §6) in a particularly unforgiving form, because "eventual consistency" here has adversarial, economic stakes (double-spend), not just staleness.

**Canonical patterns:** consensus mechanism choice (proof-of-work: probabilistic finality, strong decentralization, high latency/low throughput; proof-of-stake and permissioned/BFT-style consensus: faster, often deterministic finality, at some cost to decentralization or open participation) is the single highest-leverage architectural decision and is usually a true one-way door once a network has live economic value on it (`fundamentals.md` RULE 7.2). **Source:** comparative treatment of consensus finality types (deterministic vs. probabilistic) and their throughput/latency tradeoffs, e.g. industry analyses of permissioned vs. permissionless blockchain performance `[T]` for the tradeoff structure; `[TS]` for specific consensus algorithms and their current benchmarked throughput, which is an active, fast-moving research area.

**Typical component topology:** peer-to-peer network layer → consensus engine → ledger/state storage → smart-contract execution environment (if applicable) → client/wallet/API layer for external interaction. Increasingly "modular" designs separate execution, consensus, and data-availability into distinct layers rather than one monolithic chain design — itself a direct application of `fundamentals.md` §5's information-hiding principle (each layer hides a decision — which consensus algorithm, which execution environment — likely to evolve independently).

**Hard constraints:** immutability means a deployed smart contract's bugs are often a true one-way door (no patching a live contract without a migration or an explicit, contentious upgrade mechanism) — this makes pre-deployment verification (formal verification, extensive audit) carry safety-critical-system-level weight (§5 above) even though the domain isn't traditionally classed as safety-critical; on-chain storage/compute cost is directly, unusually expensive compared to conventional infrastructure, making "what must actually live on-chain vs. off-chain" the domain's version of `decision-rules.md` §3's data-placement decisions, with much higher stakes per byte.

**Team-size/topology heuristics:** smart-contract/protocol-layer work often warrants the same independent-review rigor as safety-critical systems (§5) given the one-way-door cost of a deployed bug; off-chain application layers (wallets, indexers, front-ends) can be organized more conventionally (§1/§2 patterns apply).

**Top recurring anti-patterns:** deploying upgradeable-by-default contracts without a deliberate, audited decision about what "upgradeable" trades away from the immutability guarantee that's the domain's whole point; underestimating on-chain storage/compute cost until a design is economically unviable at real usage volume; treating consensus/finality choice as a implementation detail rather than the one-way-door architectural decision it actually is. See `anti-patterns.md`.

---

## 14. IoT / edge computing

**Dominant quality attributes:** power/battery economy, bandwidth economy, and tolerance of intermittent connectivity dominate — many of these systems are explicitly designed to keep functioning with the cloud unreachable, which inverts the usual web-app assumption that the backend is always there.

**Canonical patterns:** edge-local processing/filtering/aggregation before transmission (reduces both bandwidth and power cost of radio use, which is often the single largest power draw on a battery-operated device) — send conclusions, not raw streams, unless the raw stream is specifically needed centrally; store-and-forward buffering for intermittent connectivity (mirrors mobile's offline-first pattern, §6 above, but with tighter storage constraints and, often, no user present to notice or resolve a sync conflict); over-the-air (OTA) update mechanisms designed for partial/interrupted delivery, since a bricked remote device may be physically unreachable to recover.

**Typical component topology:** constrained device/sensor (often running an RTOS foundation, ties to §4) → local edge gateway (aggregation, protocol translation, local decision-making) → cloud/backend (fleet management, long-term storage, cross-device analytics). Protocols favor lightweight, low-overhead options suited to constrained links (e.g., publish/subscribe patterns over lightweight transports) rather than the heavier protocols common in web backends.

**Hard constraints:** battery life directly bounds the acceptable duty cycle of any always-on component (radio, sensor polling) — an architecture decision here is simultaneously a hardware-lifetime decision; devices may be physically inaccessible after deployment, making "can this be fixed remotely" a hard constraint on every design choice, not a convenience; fleet scale (potentially far larger device counts than typical backend service-instance counts) changes the cost calculus for anything that requires per-device individual attention.

**Team-size/topology heuristics:** typically splits into firmware/device team (overlaps with §4's embedded heuristics), edge-gateway team, and cloud/fleet-management team — a three-way version of the platform/stream-aligned split, with the device team facing by far the harshest one-way-door constraints (a shipped firmware bug on a deployed fleet with no physical access is often uncorrectable at any reasonable cost, making it a harder one-way door than almost anything in §1/§2's web/backend world).

**Top recurring anti-patterns:** designing as if connectivity is continuous and then treating disconnection as an unhandled exception rather than the expected steady state; sending raw, unaggregated data to the cloud by default and only optimizing bandwidth after a cost or latency crisis; underestimating the one-way-door cost of firmware deployed to physically unreachable devices, applying two-way-door update discipline to what is actually a one-way door (`fundamentals.md` RULE 7.1's classification procedure, misapplied). See `anti-patterns.md`.

---

## 15. HPC (high-performance computing) / scientific computing

**Dominant quality attributes:** raw throughput at scale and efficient use of memory bandwidth (frequently the actual bottleneck, not compute) dominate; correctness of numerical results (reproducibility, precision) is a close second given the scientific/engineering stakes of the outputs.

**Canonical patterns:** the Roofline model as the standard tool for classifying a workload as compute-bound or memory-bound before choosing an optimization strategy — plots achievable performance against a workload's arithmetic intensity (ratio of floating-point operations to bytes moved) against the hardware's compute and memory-bandwidth ceilings, making explicit whether more compute or more bandwidth is the thing worth investing in. **Source:** the Roofline performance model, widely documented in HPC performance-engineering literature (e.g., NERSC's Roofline documentation, docs.nersc.gov/tools/performance/roofline) `[T]` for the model's structure and use; `[TS]` for specific hardware ceilings, which change every hardware generation. Distributed-memory parallelism via message passing (each node has its own memory, communicating over a high-speed interconnect) for problems too large for a single node's memory, vs. shared-memory parallelism within a node — the choice interacts directly with Amdahl's Law and Gustafson's Law below.

**Typical component topology:** job scheduler/resource manager → distributed compute nodes (message-passing communication layer) → shared or parallel filesystem for large dataset I/O → checkpoint/restart mechanism (given job run-times can exceed practical single-session windows and hardware failure probability rises with node count and run duration).

**Hard constraints:** Amdahl's Law bounds the maximum speedup achievable by adding more processors as a function of the fraction of the workload that is inherently sequential — speedup converges to a hard ceiling (1/serial-fraction) as processor count grows, regardless of how many more are added. **Source:** Gene Amdahl, *"Validity of the single processor approach to achieving large scale computing capabilities,"* AFIPS Spring Joint Computer Conference, 1967 `[T]`. Gustafson's Law offers the counterpoint relevant to HPC specifically: for problems where the workload size scales with available compute (typical in scientific computing — more compute means a bigger simulation, not just a faster small one), the parallelizable fraction effectively grows with problem size, softening Amdahl's ceiling in practice. **Source:** John L. Gustafson, *"Reevaluating Amdahl's Law,"* Communications of the ACM 31(5), 1988 `[T]`. **RULE 15.1** — IF a workload's problem size is fixed regardless of available compute THEN Amdahl's Law governs and there is a hard, calculable ceiling on parallel speedup — measure the serial fraction before committing to a scale-out investment. IF the workload's problem size scales with available compute (the common HPC/scientific case) THEN Gustafson's framing is the more realistic planning tool, but neither law is a license to skip measuring the actual serial fraction for the workload at hand — both are formulas, not vibes, per the same discipline `decision-rules.md` RULE 2.4 (Little's Law) demands for queueing.

**Team-size/topology heuristics:** often organized around a shared computing-center/platform team (owning the scheduler, interconnect, filesystem) serving many independent research/application teams — the platform-team pattern (§2/§8/§9) applies directly, with domain scientists as the "stream-aligned" consumers.

**Top recurring anti-patterns:** scaling out node count without first measuring the workload's serial fraction (violates RULE 15.1 — throwing hardware at an Amdahl-bounded problem past its ceiling wastes budget for no gain); optimizing compute (more FLOPs) for a workload the Roofline model would show is actually memory-bandwidth-bound, missing the real bottleneck entirely; no checkpoint/restart strategy for long-running jobs, making a single late-stage hardware failure catastrophic to total wall-clock cost. See `anti-patterns.md`.

---

## 16. EXTENSION PROCEDURE — slotting a new or unknown system class into this framework

This section is what makes the file future-proof: a system class not listed above (or not yet invented) can be analyzed from first principles using `fundamentals.md` rather than waiting for this file to be manually updated. Follow this procedure in order.

**Step 1 — Identify the binding constraint, not the domain label.** Ask: "what runs out first if this system is built without any special care — time, memory, money, trust, correctness-proof, or human attention?" This answer, not the domain's name, is the seed of its dominant quality attribute. `fundamentals.md` §6 (quality attributes and their tradeoffs) and RULE 6.1 (unranked attributes get ranked by default under delivery pressure) are the operative tools here — a new domain still obeys them, it just has a different binding constraint.

**Step 2 — Derive quality-attribute ranking from the constraint, not from analogy to a "similar" existing class.** Analogy is a useful starting hypothesis (e.g., "this new domain resembles embedded because it also runs on constrained hardware") but must be checked against Step 1's actual answer — two domains can share a surface trait (constrained hardware) while having different binding constraints (one is power-bound, another is bandwidth-bound), and the architecture should follow the actual constraint, not the surface resemblance.

**Step 3 — Apply `fundamentals.md` §6, RULE 6.2 to force every candidate quality attribute into a measurable target.** If the new domain's "obviously important" attribute cannot be stated as a number (a target, not an adjective), it is not yet ready to drive an architecture decision — go find or define the measurement first (this is frequently the actual novel work in a genuinely new system class: the metric doesn't exist yet and must be invented before it can be optimized for).

**Step 4 — Apply `fundamentals.md` §7's reversibility classification to the domain's characteristic decisions.** Ask: in this new domain, what is expensive or impossible to reverse, and how broad is the blast radius when it's wrong? (For a truly novel domain, this is often the most informative question — e.g., "can a shipped instance of this system be updated after deployment, and at what cost" tends to separate domains that behave like software from domains that behave like hardware/firmware, regardless of what the domain is called.)

**Step 5 — Apply Conway's Law (`fundamentals.md` §3) to derive the team-topology heuristic.** Ask: what is the natural unit of expertise this domain demands (e.g., does correctness require a specialist who cannot be substituted, the way safety-critical V&V or ML modeling does), and does any standard or regulator mandate an organizational separation the way §5's safety-critical standards do? This produces the team-size/topology heuristic without needing a precedent.

**Step 6 — Check the criteria set in `stack-selection.md` §1 for domain-specific additions.** If the new domain has a criterion not in that list (a new kind of hard constraint — e.g., a physical/biological constraint, a new class of regulatory regime), add it explicitly per `stack-selection.md` RULE 1.2 rather than folding it into an existing row.

**Step 7 — Identify the canonical patterns by asking what problem repeats.** New domains rarely invent entirely new architectural primitives from scratch — they usually recombine `decision-rules.md`'s existing vocabulary (sync vs. async, SQL vs. NoSQL, stateless vs. stateful, single-writer vs. multi-writer, edge vs. core) under the new constraint ranking from Step 2. Enumerate which of those existing decision axes the new domain's binding constraint reorders, rather than assuming a wholesale new methodology is needed.

**Step 8 — Actively look for the new domain's version of the recurring anti-patterns.** The pattern across every section above is: an anti-pattern is what happens when a *different* domain's default assumption is imported unexamined (e.g., §1's web assumption that the network/backend is always reachable, wrongly imported into §6/§14; §11's soft-real-time tolerance, wrongly imported into §4/§5's hard-real-time domains). For a new domain, explicitly list which neighboring domain's engineers are most likely to be recruited onto it, and pre-empt the assumption they'll import that doesn't hold here.

**Step 9 — Write the section using this file's exact template** (dominant quality attributes → canonical patterns → topology → hard constraints → team heuristics → anti-patterns), tag every claim `[T]`/`[TS]`/`[UNVERIFIED]` per the legend, and cite real sources via the same discipline as `fundamentals.md`'s introduction (verified, not fabricated — mark as `[UNVERIFIED]` rather than inventing a citation if the field hasn't yet published one, which is common and expected for a genuinely new system class).

**RULE 16.1** — IF Step 1's answer is ambiguous (multiple candidate binding constraints look equally severe) THEN do not force a single dominant attribute — `fundamentals.md` RULE 6.1 anticipates this: state the ranking explicitly as a design decision to be made (likely per-component, the way `decision-rules.md` RULE 3.8 requires consistency-vs-availability to be decided per data type rather than once for a whole system), and flag it for an ADR (`artifacts-and-templates.md`) rather than silently picking one.

**RULE 16.2** — IF the new domain appears to violate one of `fundamentals.md`'s numbered rules THEN treat that as a signal to re-examine whether the domain is truly an exception, per `fundamentals.md` §8's closing instruction — the fundamentals are the stable substrate; a domain section here is the thing more likely to be incomplete, not the other way around.

---

## How this file drives the rest of the knowledge base

- Every section's "dominant quality attributes" column is the direct input to `stack-selection.md` §2's weighting step — this file answers "what matters most here," that file answers "how much weight does that get in the scoring table."
- Every section's "team-size/topology heuristics" is `fundamentals.md` §3 (Conway's Law) and `decision-rules.md` RULE 1.1 applied concretely per domain — a reminder that every architecture recommendation in this file is implicitly an org-structure recommendation too.
- Every section's anti-patterns list is a pointer into `anti-patterns.md`, not a replacement for it — this file states *which* smells recur most in a domain; that file catalogs the smell itself in full, cross-domain detail.
- The extension procedure (§16) is this file's connection back to `fundamentals.md` as the single stable substrate — no future system class should require waiting for a rewrite of this file before the agent can reason about it correctly.
