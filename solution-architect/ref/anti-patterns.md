# anti-patterns.md — Cross-Domain Failure Library
### File 9 of 10 · Knowledge base for a domain-agnostic solution-architect agent

**Tag legend (repeated from `fundamentals.md`):**
- `[T]` — Timeless. Re-derive only if a citation link rots.
- `[TS]` — Time-sensitive. Refresh per the cadence in `sources-and-currency.md`.
- `[UNVERIFIED]` — Industry-folklore name or heuristic in active use, with no single citable origin. This file has a fair number of these — most anti-pattern *names* were coined informally in blogs, conference hallway talk, or converged on independently in multiple places before anyone wrote them down formally. Where a formal citation exists, it is given; where it doesn't, the tag says so rather than inventing one.

Each entry below follows the same shape: **NAME** → **SMELL** (the observable signal that reveals it — the single most useful field for an agent doing live diagnosis) → **WHY IT HAPPENS** → **THE FIX** → **HITS** (system classes, cross-referencing `domain-matrix.md`). Entries are grounded in `fundamentals.md`'s vocabulary (coupling/cohesion §4, complexity §2, reversibility §7) — read a smell here as a *specific, recognizable instance* of a fundamental already established, not a new theory.

---

## 1. Distributed monolith

**SMELL:** Services are deployed independently, but a single deploy still requires coordinating version bumps across 3+ services in lockstep; a "small" schema change in one service breaks three others at runtime; the on-call runbook for any incident says "check if it's actually service X, Y, or Z" because failure isolation doesn't exist despite the network boundary.

**WHY IT HAPPENS:** teams extract services along org-chart or "logical domain" lines (see `fundamentals.md` §3, Conway's Law) without first passing `fundamentals.md` RULE 4.2's empirical co-change test — the modules were never actually decoupled, so the extraction just moved the coupling behind a network call, converting a cheap in-process refactor into an expensive cross-service one. It also happens when services share a physical database (see entry 8, below) — shared data is shared coupling no matter how many separate deployables sit on top of it.

**THE FIX:** re-run `fundamentals.md` RULE 4.2 (co-change coupling) and `decision-rules.md` RULE 1.2 (co-change gate on extraction) against the actual commit history. If the boundary is genuinely unstable, merge the services back — painful, but cheaper than perpetuating the tax indefinitely — or invest specifically in decoupling the *reason* they co-change (usually a shared data model or a synchronous call chain) before re-splitting.

**HITS:** distributed systems, cloud/microservices, any system class using `decision-rules.md` §1's service-boundary rules. `[UNVERIFIED]` as a named term — no single canonical paper; the term circulates widely in architecture blogs and conference talks (Fowler's writing on microservices names the failure mode without using this exact phrase as a formal term).

---

## 2. God service / big ball of mud

**SMELL:** One service (or, pre-microservices, one module) has no describable single purpose — its name is a noun like "Core," "Common," "Manager," or "Platform"; every unrelated feature request lands in it because "it already has the DB connection"; its dependency graph shows most of the system pointing into it, and it points into most of the system.

**WHY IT HAPPENS:** the entity accretes responsibility one convenient shortcut at a time — each individual addition is locally rational ("it's faster to add it here than to design a new boundary"), and there is no architectural review step that asks the cohesion question from `fundamentals.md` RULE 4.1 at the time each piece is added.

**Source:** Brian Foote & Joseph Yoder, *"Big Ball of Mud,"* Proc. 4th Conference on Pattern Languages of Programs (PLoP '97), September 1997; reprinted as Ch. 29 of *Pattern Languages of Program Design 4*, Addison-Wesley, 2000. `[T]` — the paper itself frames the pattern not as a mistake to shame but as the *default outcome* absent deliberate structure: "a casually, even haphazardly structured system... thrown together... grown, expediently."

**THE FIX:** apply `fundamentals.md` RULE 4.1 — ask "what one thing does every part of this exist to do?" Where the answer is "several unrelated things," carve along Parnas decision boundaries (`fundamentals.md` §5, RULE 5.2), starting with the piece most requested for reuse or most frequently the cause of unrelated regressions. Foote & Yoder's own prescription is incremental "reconstruction," not a rewrite — a big-bang rewrite of a big ball of mud is itself a common second failure (see entry 12, second-system effect).

**HITS:** every system class — this is the single most universal anti-pattern in the catalog, from a 200-line embedded firmware "utils.c" to a 4M-LOC monolith to a "shared" Lambda in a serverless system.

---

## 3. Premature microservices

**SMELL:** A greenfield project starts with 8 services and a service mesh before the first paying customer; more time is spent on inter-service auth, tracing, and CI pipeline count than on product logic; the team can't agree on where a given business rule "belongs" because the domain model itself hasn't stabilized yet.

**WHY IT HAPPENS:** the "microservices premium" (service discovery, distributed transactions, inter-service integration testing, N× operational surface) is paid before the system has enough genuine complexity to make the split pay for itself, and before the team has the domain knowledge to draw correct boundaries — see `decision-rules.md` §1 and Fowler's *"MonolithFirst"* (already cited there). Often driven by resume-driven development (entry 15) or cargo-culting a FAANG-scale architecture onto a pre-product-market-fit team.

**THE FIX:** `decision-rules.md` RULE 1.1–1.3 — default to modular monolith; extract only against a concrete forcing function (distinct scaling profile, distinct deployment cadence, distinct failure-isolation need), and pick the smallest boundary that resolves that specific forcing function.

**HITS:** distributed systems, cloud-native/startups, any early-stage system regardless of eventual scale. `[UNVERIFIED]` as a named term (folklore, widely used since ~2015 alongside "microservice premium"), but the underlying mechanism is `[T]` via Fowler's cited work in `decision-rules.md`.

---

## 4. Chatty interfaces / N+1 queries

**SMELL:** A single logical operation on the caller's side produces dozens-to-thousands of physical round trips on the wire — one query to fetch a list of N records, then N further queries to fetch each record's related data; a mobile client's single screen load triggers 40 sequential API calls; a service-to-service call chain fans out multiplicatively per item in a collection.

**WHY IT HAPPENS:** an abstraction (an ORM lazy-loading a relation, a "just call the other service" mental model inherited from in-process method calls) hides the *cost* of a round trip while preserving its *syntax*, so the code reads like a cheap operation and executes like an expensive one. This is a direct instance of Deutsch's Fallacies (`decision-rules.md` RULE 2.6, "latency is zero" / "bandwidth is infinite") manifesting at the data-access layer specifically.

**THE FIX:** batch the fetch (single query with a join, or a single "get many by ids" call instead of N single-item calls); for APIs, offer bulk/batch endpoints or a query language that lets the caller specify exactly the shape needed in one round trip (GraphQL's original motivating case, though GraphQL introduces its own N+1 risk at the resolver level if resolvers aren't batched via patterns like Facebook's Dataloader). Measure round-trip count as a first-class metric in review, not just total latency — total latency can hide underneath connection pooling until load increases.

**HITS:** web/backend APIs, distributed systems, data-heavy applications, mobile (chatty client-server chains are especially costly over cellular latency). `[UNVERIFIED]` as a name for the general "chatty interface" pattern; "N+1 query problem" is documented ORM terminology (appears in Hibernate/ActiveRecord/Django ORM documentation and issue trackers) without one single canonical paper of origin.

---

## 5. Ignoring backpressure / unbounded queues

**SMELL:** A queue's depth graph only ever goes up, cut off abruptly by an OOM kill or a redeploy that resets it; a producer service's p50 latency looks fine while its downstream consumer's queue grows without bound; "add more consumers" is the only lever the team has ever pulled, with no mechanism to shed load or slow the producer.

**WHY IT HAPPENS:** treating a queue as a solved decoupling mechanism rather than as `decision-rules.md` RULE 2.4 frames it — a queue changes *when* backpressure is felt, it does not remove the need for it. An unbounded queue defers the failure from "producer sees an error now" to "the whole system runs out of memory or the consumer drowns in stale work later," which feels like progress in a demo and is a ticking liability in production.

**THE FIX:** apply Little's Law (`decision-rules.md` RULE 2.4, L = λW) as a standing check: if arrival rate λ is trending up and processing time W is flat or rising, queue depth L grows without bound — instrument this and alert on the trend, not just on a fixed depth threshold. Bound every queue; define an explicit shed policy (reject, dead-letter, load-shed the least valuable items) for what happens at the bound; and, per the Reactive Manifesto (cited in `decision-rules.md` RULE 2.4), make the producer's rate controllable, not just the consumer's throughput.

**HITS:** distributed systems, event-driven architectures, IoT/telemetry ingestion, ML training-data pipelines, embedded systems with bounded RAM (an "unbounded queue" in firmware is a stack/heap overflow waiting for a burst, not just a performance complaint).

---

## 6. Cache stampede / thundering herd

**SMELL:** A cache-miss spike appears exactly at a round-number time boundary (top of the hour, midnight) or immediately after a deploy that flushed the cache; the origin database's CPU/connection graph shows a sharp vertical spike correlated with a cache expiry event, not with a genuine traffic increase; adding *more* cache capacity doesn't help because the problem is concurrent misses, not insufficient cache size.

**WHY IT HAPPENS:** many cache entries are set with the same TTL (e.g., all seeded at deploy time, or all TTL'd to a fixed round interval), so they expire simultaneously; every one of the many concurrent requests that miss in that instant independently goes to the origin to recompute the same value, multiplying origin load by the request concurrency instead of by the number of distinct keys. The general "thundering herd" mechanism — many waiters woken for one event, only one of which can usefully proceed — was documented in OS scheduler literature; the specific web-cache instance follows the same shape.

**Source (general mechanism, web-serving context):** Stephen P. Molloy & Chuck Lever, *"Accept() Scalability in Linux,"* Proc. USENIX Annual Technical Conference (FREENIX Track), 2000, discussing thundering-herd wakeups in the accept() path. `[T]` for the mechanism; the specific term's earliest use is commonly traced further back to BSD-era kernel-scheduler discussions and is `[UNVERIFIED]` for an exact first citation.

**THE FIX:** jitter TTLs (randomize expiry within a window so entries don't all expire at once — the same jittering principle as entry 11 below, applied to cache expiry instead of retries); use request coalescing / single-flight (only one of N concurrent misses for the same key actually queries the origin; the rest wait on that one result); use stale-while-revalidate (serve the expired value while one request refreshes it in the background); pre-warm caches before a known traffic event instead of relying on lazy population.

**HITS:** web/backend systems, CDN-fronted content, distributed caching layers (Redis/Memcached), any read-heavy system per `decision-rules.md` RULE 3.5/3.6.

---

## 7. Dual-write / missing outbox — data inconsistency across a boundary

**SMELL:** A service writes to its database and then separately publishes an event/message about that write as two distinct operations; occasionally the database commit succeeds but the message never arrives (or vice versa) — visible as "the record exists but downstream consumers never heard about it," usually discovered by a customer complaint or a reconciliation job, not by an alert, because nothing was technically "down."

**WHY IT HAPPENS:** the write to the database and the write to the message broker are not part of one atomic transaction — they can't be, since they're two different systems with no shared transaction coordinator. A crash, a dropped acknowledgement, or a pod termination between the two writes silently loses one side. This is a direct instance of `decision-rules.md` RULE 2.6 (Deutsch's fallacy: "the network is reliable") applied to the specific case of publish-after-commit.

**THE FIX:** the transactional outbox pattern — within the *same* database transaction as the business write, insert a row into an outbox table describing the event to publish; a separate poller or change-data-capture process (e.g., Debezium reading the DB's write-ahead log) reads the outbox table and publishes to the broker, retrying until it succeeds, then marks the row published. This makes the business write and the "intent to publish" atomic (single-database-transaction guarantee, per `decision-rules.md` RULE 3.1's ACID rationale), and moves the "did the message actually get sent" problem to an at-least-once, idempotent-consumer pattern (`decision-rules.md` RULE 4.3/4.4) rather than a silent gap.

**Source:** Chris Richardson, *"Pattern: Transactional outbox,"* microservices.io pattern catalog (part of the broader microservices patterns work published in *Microservices Patterns*, Manning, 2018). `[T]`

**HITS:** distributed systems, event-driven architectures, any system with a database-plus-message-broker boundary — including "modular monolith" designs the moment a module publishes domain events to other modules asynchronously.

---

## 8. Shared mutable database across services

**SMELL:** Two or more independently-deployed services connect directly to the same database and the same tables; a migration in one service's codebase can break a query in a service owned by a different team who didn't know the table existed; "who owns this table" has no clean answer, or the answer is "everyone."

**WHY IT HAPPENS:** it looks like the fast path during an initial service split — the data's already there, why stand up a new database and an API just to read three columns? — but it silently recreates content coupling (`fundamentals.md` §4, the worst tier: "one module reaches into another's internals") across a boundary that was supposedly drawn to remove exactly that coupling. It is the single most common concrete cause of entry 1 (distributed monolith).

**THE FIX:** enforce single-writer-per-table ownership (`decision-rules.md` RULE 3.7) — one service owns the schema and is the only writer; all other services access that data through the owning service's API, or through an explicitly-versioned read replica/projection they don't control the schema of. Where wholesale migration is too costly immediately, at minimum freeze cross-team direct writes and add a contract test that fails if a non-owning service's queries touch the table's internal structure — the migration to a real API can then happen incrementally without new coupling accruing in the meantime.

**HITS:** distributed systems, microservices, data platforms with multiple consuming teams. `[UNVERIFIED]` as a named term; the underlying coupling analysis is `[T]` via Constantine & Yourdon (cited in `fundamentals.md` §4).

---

## 9. Priority inversion (real-time / RTOS)

**SMELL:** A high-priority task misses its deadline even though the specific task that's "blocking" it is lower-priority and should have been preempted; the system exhibits sporadic, load-correlated watchdog resets or deadline-miss logs that don't correlate with the high-priority task's own code changing; a mutex or semaphore is involved, and priority inheritance is either absent or explicitly disabled "for performance."

**WHY IT HAPPENS:** a low-priority task holds a lock a high-priority task needs; without priority inheritance, a *medium*-priority task (uninvolved in the lock at all) can preempt the low-priority lock-holder and run for an unbounded time, indirectly blocking the high-priority task far longer than the lock hold time alone would predict — the medium-priority task "inverts" the intended priority order.

**Source (the canonical public case):** the Mars Pathfinder mission, July 1997 — the spacecraft's VxWorks RTOS experienced repeated system resets traced to priority inversion on a shared bus-management mutex, because the priority-inheritance flag on that mutex had been disabled for performance reasons. Diagnosed post-launch by Glenn Reeves (Flight Software Cognizant Engineer) with remote assistance identifying the mechanism; fixed in-flight by uploading code that re-enabled priority inheritance on the mutex. Documented publicly in comp.risks and widely analyzed since (e.g., Mike Jones/David Wilner's public accounts; the mechanism itself dates to earlier academic work — Lui Sha, Ragunathan Rajkumar, John P. Lehoczky, *"Priority Inheritance Protocols: An Approach to Real-Time Synchronization,"* IEEE Transactions on Computers 39(9), 1990). `[T]`

**THE FIX:** enable priority inheritance (or priority ceiling protocol) on every mutex/semaphore shared across tasks of different priority — this is a scheduler/RTOS configuration decision, not an application-code pattern, which is exactly why it's easy to silently disable "for performance" without realizing the safety property it was providing. In systems where priority inheritance isn't available, minimize critical-section hold time and avoid priority-inverting constructs (e.g., avoid a low-priority task holding a lock while doing anything that can be preempted for a long time).

**HITS:** embedded/RTOS, safety-critical, aerospace, automotive — any preemptive-priority-scheduled system with shared locks across priority levels.

---

## 10. Retry storms / missing jitter

**SMELL:** A dependency has a brief blip (a few seconds of elevated latency or a rolling deploy); load on that dependency spikes far *higher* after the blip than during it, and the spike recurs in decaying waves rather than a single bump; clients' retry logs show many independent clients retrying at suspiciously similar intervals.

**WHY IT HAPPENS:** capped exponential backoff without randomization still synchronizes clients — every client that failed at the same moment computes the same backoff schedule and retries at the same moment again, so the "storm" just gets delayed and re-concentrated rather than spread out; each retry wave itself can cause further failures, cause further synchronized retries, and so on, sometimes former enough to prevent the dependency from ever recovering (a self-sustaining outage sometimes called a "retry storm" or, at the extreme, cascading failure).

**Source:** Marc Brooker, *"Exponential Backoff And Jitter,"* AWS Architecture Blog, 2015 (aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter); companion treatment in the Amazon Builders' Library, *"Timeouts, retries, and backoff with jitter."* `[T]` — names three concrete jitter strategies (Full Jitter, Equal Jitter, Decorrelated Jitter) and demonstrates via simulation that full jitter minimizes total work done against the dependency during recovery.

**THE FIX:** add randomized jitter to every retry backoff — never retry on a fixed or purely-multiplicative schedule shared identically across clients. Combine with a circuit breaker (stop calling a dependency at all once its failure rate crosses a threshold, rather than continuing to retry into a hole) and with client-side rate limiting / request budgets so one caller's retry policy can't unilaterally amplify load on a shared dependency. Cross-reference `decision-rules.md` RULE 2.6 (Deutsch's fallacies) — a naive retry policy is usually an unexamined assumption that "the network is reliable" and "latency is zero" baked into code.

**HITS:** distributed systems, any client-server or service-to-service architecture, mobile apps retrying against flaky connectivity, IoT devices retrying against intermittent connectivity at fleet scale (where synchronized retries are especially dangerous because fleet size can be enormous).

---

## 11. Golden hammer / resume-driven development

**SMELL:** the same technology is proposed as the answer regardless of the problem statement — "we should use Kafka for this" is the answer before the throughput, ordering, or durability requirements have been stated; a team's architecture diagrams for unrelated projects are suspiciously identical; a technology choice is justified by "it's what's hot" or "it'll look good on the team's resume/conference talk" rather than by a quality-attribute scenario (`fundamentals.md` §6).

**WHY IT HAPPENS (golden hammer):** a team develops deep competence in one tool and, rationally, reaches for the tool it already knows well — but the reasoning silently inverts from "this tool fits this problem" to "this problem must fit this tool," and problems that don't fit get bent to match rather than the tool being reconsidered.

**Source (golden hammer):** William J. Brown, Raphael C. Malveau, Hays W. McCormick III, Thomas J. Mowbray, *AntiPatterns: Refactoring Software, Architectures, and Projects in Crisis*, Wiley, 1998. `[T]`

**WHY IT HAPPENS (resume-driven development):** individual incentives (career growth, market demand for trending skills, conference-talk visibility) diverge from system incentives (operate the simplest thing that meets the quality-attribute targets), and absent an explicit decision-rights process, individual incentive wins because the cost of the mismatch lands on future maintainers, not on the person choosing the technology.

**Source (résumé-driven development, first empirical characterization):** Jonas Fritzsch, Marvin Wyrich, Justus Bogner, Stefan Wagner, *"Résumé-Driven Development: A Definition and Empirical Characterization,"* Proc. IEEE/ACM 43rd International Conference on Software Engineering: Software Engineering in Society (ICSE-SEIS), 2021 (arXiv:2101.12703). `[T]` — the term itself circulated informally before this paper; the paper is the first to define and empirically study it, confirming practitioners recognize and report the phenomenon.

**THE FIX:** force every significant technology choice through `fundamentals.md` §6's quality-attribute-scenario discipline (stated, measurable target) and `fundamentals.md` §7's reversibility classification — a genuinely two-way-door tech choice (RULE 7.1) doesn't need this ceremony, but "we're standardizing on X for every future service" is exactly the broad-blast-radius, hard-to-reverse decision that does.

**HITS:** every system class — organizational/process anti-pattern, not domain-specific.

---

## 12. Second-system effect

**SMELL:** the team that shipped a lean, successful v1 is now building v2, and v2's design doc is 3x longer than v1's ever was; every feature anyone wished v1 had is now "must-have" for v2; the schedule for v2 slips well past the original estimate, and the slip is attributed to "just a bit more polish" repeatedly rather than to scope.

**WHY IT HAPPENS:** having shipped once under real constraints, the architect(s) now have both the confidence and the accumulated wish-list to over-design the follow-up — every deferred idea from v1 gets included, often uncritically, because the team no longer feels the original schedule pressure that forced v1's discipline.

**Source:** Frederick P. Brooks Jr., *The Mythical Man-Month: Essays on Software Engineering*, Addison-Wesley, 1975; Ch. 5, "The Second-System Effect," Anniversary Edition, 1995. `[T]` — Brooks draws the observation from his own experience managing OS/360 development at IBM, and states it as a predictable hazard specifically of an architect's *second* design, not their first or their fifth (by the fifth, the lesson has usually been learned).

**THE FIX:** apply `fundamentals.md` §2's essential-vs-accidental test explicitly to every "must-have for v2" item — much of a wish-list accumulated during v1's constrained shipping is really a backlog of nice-to-haves, not essential complexity the domain demands. Re-apply `fundamentals.md` §7 reversibility discipline to v2's architecture decisions with the same rigor as if this were the team's first system, specifically because the team's confidence is the risk factor here, not a mitigant.

**HITS:** every system class — a hazard of architect experience and morale, not of any particular technology.

---

## 13. Vendor lock-in as an un-budgeted one-way door

**SMELL:** a migration-cost estimate for "switching off vendor X" doesn't exist anywhere in writing; the system uses a vendor's proprietary extensions (a cloud provider's non-standard API, a proprietary data format, a proprietary protocol) in the critical path with no abstraction layer between application code and the vendor's SDK; the contract/pricing conversation with the vendor has manifestly weaker leverage than it did at signing, and everyone in the room knows it but no one budgeted for it.

**WHY IT HAPPENS:** adopting a vendor's proprietary capability is evaluated at adoption time purely on the capability and short-term cost it provides, without pricing in `fundamentals.md` §7's reversal-cost dimension — the decision is architecturally a one-way door (broad blast radius: the whole system depends on it; high reversal cost: replacing it means re-architecting the integration, not swapping a config value) but gets nodded through with two-way-door-level process because "it's just a managed service" *feels* like an implementation detail rather than architecture.

**THE FIX:** apply `fundamentals.md` RULE 7.1 explicitly at adoption time, not just at exit time — estimate the reversal cost *before* committing, the same way a one-way door would be evaluated for any other irreversible decision, and record it in the ADR (`artifacts-and-templates.md`) alongside the benefit being purchased. Where the capability is genuinely differentiated and worth the lock-in, that's a legitimate trade — the anti-pattern isn't "using a vendor," it's failing to price the door before walking through it. Mitigate where the cost/benefit allows: an anti-corruption-layer/adapter interface between application code and the vendor SDK reduces (not eliminates) reversal cost by containing the blast radius to one module (`fundamentals.md` §5, information hiding).

**HITS:** cloud/SaaS-heavy systems, data platforms built on a single warehouse vendor, any system integrating a proprietary managed service — this is a decision-governance failure, not a technology-specific one. `[UNVERIFIED]` as a named "anti-pattern" per se (vendor lock-in is a widely documented risk category across cloud-computing literature and analyst reports, e.g., Gartner/NIST cloud-risk guidance, without one canonical originating paper).

---

## 14. LLM application anti-patterns

Three domain-specific failure modes for LLM-powered applications, an emerging system class whose failure modes are still being catalogued industry-wide as of this writing — treat the following as current practitioner consensus (`[UNVERIFIED]`/`[TS]`, refresh per `sources-and-currency.md`), not settled theory:

**14a. Unbounded context growth ("context rot")**
**SMELL:** an agent's output quality visibly degrades over the course of a long-running session or multi-step task, even though no single turn's input looks wrong in isolation; the context window is allowed to grow without any eviction, summarization, or retrieval strategy — every prior turn, tool call, and tool result is concatenated forever.
**WHY IT HAPPENS:** treating the context window as unlimited working memory rather than as a finite, decaying-relevance resource; stale or contradictory information accumulated early in a session competes with and sometimes overrides more relevant recent information, and the failure is gradual rather than a hard error, so it's easy to miss until output quality has already visibly degraded.
**THE FIX:** actively manage context — summarize or evict stale turns, retrieve only what's relevant to the current step rather than replaying full history, and treat context length as a budgeted resource with an explicit policy for what gets dropped first, the same discipline `decision-rules.md` applies to any other bounded resource (queues, caches).
**HITS:** LLM/agentic applications, RAG systems, long-running autonomous agents.

**14b. No evaluation harness ("vibes-based" shipping)**
**SMELL:** the only test for "did this prompt/model change make things better" is a developer manually trying a few examples and eyeballing the output; there is no regression suite of representative inputs with graded expected behavior; a model or prompt upgrade ships and the first signal of a regression is a user complaint, not a failing test.
**WHY IT HAPPENS:** LLM output is nondeterministic and the space of possible inputs is unbounded, which makes traditional exact-match unit testing feel inapplicable — teams conclude (wrongly) that no systematic evaluation is possible and fall back to spot-checking, which doesn't scale past the first few prompt iterations and provides no defense against silent regressions on a model version bump.
**THE FIX:** build a graded evaluation harness — a representative, versioned set of inputs with either exact checks (where deterministic behavior is expected, e.g., valid JSON, tool-call schema conformance) or a scored rubric/LLM-as-judge comparison against a baseline, run on every prompt or model change, per `verification.md`'s general fitness-function discipline applied to this domain specifically.
**HITS:** LLM/agentic applications, any product with an LLM in the critical response path.

**14c. Prompt-in-code coupling**
**SMELL:** prompts are embedded as inline string literals scattered across application code; changing a prompt requires a full code deploy and code review by an engineer, even when the actual change is a wording tweak a domain expert or prompt engineer could safely make; there is no version history for a prompt independent of the code's own version history, so it's impossible to answer "what did this prompt say when the incident happened" without archaeology through git blame across unrelated commits.
**WHY IT HAPPENS:** prompts start small and get inlined for convenience during prototyping, and the convenience never gets revisited once the system is in production — this is `fundamentals.md` §5's information-hiding test failing in a new guise: the "prompt" design decision (wording, few-shot examples, output format instructions) is exactly the kind of decision Parnas says should be hidden behind a boundary because it's likely to change, yet it's welded to the code that's least likely to change for the same reason.
**THE FIX:** externalize prompts into versioned, independently-deployable artifacts (a prompt registry, templated files with their own review/release process) decoupled from application code deploys, mirroring how `decision-rules.md` treats configuration and feature flags as a separate deployment concern from code.
**HITS:** LLM/agentic applications.

---

## 15. Embedded: blocking work in an ISR

**SMELL:** an interrupt service routine contains a loop with unbounded iteration count, a memory allocation, a blocking call (mutex lock, I/O wait), or floating-point work on a platform where that's expensive to context-switch around; overall system responsiveness (jitter on other interrupts, missed deadlines on unrelated tasks) degrades specifically when the interrupt in question fires frequently, even though that ISR's own "happy path" logic looks simple.

**WHY IT HAPPENS:** the ISR is written with the same mental model as ordinary application code — "do the work where the event happens" — without accounting for the fact that an ISR runs at a priority above the scheduler's normal task-switching logic and blocks everything at equal-or-lower priority (including, on many platforms, other interrupts) for its entire execution.

**THE FIX:** keep the ISR itself to the minimum work required to acknowledge the interrupt and capture the triggering data (often measured in tens to low hundreds of clock cycles, or "half a page of code" as a practitioner rule of thumb), then defer any substantial processing to a lower-priority task or the main loop via a flag, ring buffer, or message queue — the same defer-to-a-consumer shape as `decision-rules.md` §2's async/queue guidance, applied at the hardware-interrupt level instead of the service level.

**HITS:** embedded/RTOS, safety-critical, IoT, automotive/aerospace firmware. `[UNVERIFIED]` — universally taught practitioner consensus (embedded-systems textbooks, vendor app notes, and RTOS vendor documentation converge on it independently) without one single canonical originating citation; cross-reference entry 9 (priority inversion) — a long ISR and a priority-inversion-prone mutex are two different mechanisms producing the same class of symptom (an unrelated high-priority task missing its deadline).

---

## 16. Data pipelines: no schema contract between stages

**SMELL:** a change to an upstream data producer (a new optional field, a renamed column, a changed enum value) silently breaks a downstream consumer's transformation logic or, worse, doesn't break it loudly but corrupts aggregate metrics quietly; the only way to know a pipeline stage's expected input shape is to read that stage's code, because nothing enforces or documents the contract between stages; a "data incident" retro repeatedly traces back to "someone changed the producer and didn't know who consumed it."

**WHY IT HAPPENS:** pipeline stages are typically owned by different teams or written at different times, and the "interface" between them is often just "whatever fields happen to be in the file/topic/table today," implicit rather than explicit — this is `fundamentals.md` §5's information-hiding failure again: the producer's internal representation isn't actually hidden from consumers, it *is* the contract, by accident rather than by design.

**THE FIX:** define an explicit, versioned schema for data crossing any pipeline-stage boundary (e.g., a schema registry for streaming data, a documented and validated table contract for batch/warehouse boundaries); treat schema changes with the same one-way/two-way door discipline as an API change (`fundamentals.md` §7) — additive, backward-compatible changes are cheap; breaking changes need a migration plan and consumer coordination, exactly like a public API version bump. Validate data against the schema at the boundary (fail fast at ingestion) rather than letting malformed data propagate silently into downstream aggregates.

**HITS:** data/ML platforms, analytics pipelines, event-driven architectures feeding data lakes/warehouses. `[UNVERIFIED]` as a named anti-pattern; the discipline it violates (Parnas information hiding) is `[T]`.

---

## How this file drives the rest

- Every entry here is a **named, recognizable instance** of a violation already defined structurally in `fundamentals.md` (coupling/cohesion §4, information hiding §5, reversibility §7) or operationalized as a rule in `decision-rules.md` (§1 service boundaries, §2 communication/backpressure, §3 data, §4 idempotency) — this file exists so the agent can pattern-match a live symptom to a name fast, then jump to the fundamental or rule that explains *why* it's wrong and what the fix's mechanism is, instead of re-deriving the diagnosis from scratch each time.
- The **SMELL** field in each entry is the file's primary export: it's written to be checked against an observed system (logs, metrics, dependency graphs, org charts), not against a design document — an architecture can claim anything on paper, but a smell is what's actually happening. `verification.md` should treat this file's smells as a candidate checklist when auditing an existing system, alongside whatever fitness functions are already defined.
- Entries 14–16 (LLM apps, embedded ISRs, data pipeline contracts) are the seeds of a domain-specific extension pattern: as new system classes mature (per `domain-matrix.md`'s extension procedure), their emerging failure modes belong here once a smell is recognizable and repeatable across multiple independent teams/projects — not before, to avoid cataloguing a one-off mistake as if it were a named pattern.
- Where this file marks something `[UNVERIFIED]`, that is itself information the agent should surface to the user rather than hide: a folklore name is still useful for communication ("this looks like a thundering herd") even when it can't be footnoted to a paper — but the agent should not present the *name's provenance* with more confidence than it has.
