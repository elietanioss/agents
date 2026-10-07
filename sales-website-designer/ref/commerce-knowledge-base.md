# The Evolution of Online Selling: Evidence Audit and Gap-Filling Research Supplement

**Research date:** 9 August 2026  
**Scope:** Complements `covered.md`; it does not repeat that file where its high-level synthesis is adequate.  
**Decision this informs:** What knowledge must exist before an AI can be trusted to design a commercial website.  
**Architecture boundary:** This report defines knowledge and evaluation requirements only. It does not propose software architecture, models, databases, APIs, frameworks, or programming languages.

## Executive verdict

`covered.md` is a useful conceptual synopsis, but it is not yet the foundational research requested by the master prompt. It compresses 60 research parts and 22 deliverables into 13 sections, contains no direct source links, supplies only 20 of the required 150–200+ patterns, and states several contextual findings as universal rules. Its strongest idea is sound: commercial web design is a contextual decision system, not a bag of conversion tricks. Its weakest feature is traceability: readers cannot distinguish peer-reviewed evidence, industry usability observation, practitioner convention, legal rule, and speculation.

The necessary correction is not to discard the synthesis but to turn it into an evidence-governed knowledge base. Every proposed design action needs a chain of reasoning:

> business and customer context → unresolved customer problem → candidate mechanism → evidence and boundary conditions → commercial and ethical risk → test design → profit and customer outcome

Three conclusions survive scrutiny:

1. **Friction reduction is conditional, not synonymous with “fewer clicks.”** Remove needless work, ambiguity, errors, and surprises, while preserving information and deliberation required for high-risk or high-consideration decisions.
2. **Persuasion is legitimate when it improves informed value exchange.** It becomes manipulation when the interface hides material information, obstructs a preferred action, fabricates social or temporal signals, or exploits asymmetry against the customer.
3. **The AI-commerce transition is now observable, but its long-run effects are not settled.** Agentic protocols and in-chat purchasing are deployed facts; claims about autonomous negotiation, universal dynamic interfaces, or the disappearance of storefronts remain scenarios.

**Overall confidence:** High (0.88) for the audit and established principles; medium (0.68) for 2026–2030 trajectories because deployment evidence exists but behavioral and market outcomes are immature.

## 1. Coverage audit of `covered.md`

| Master deliverable | Status in `covered.md` | Material gap |
|---|---|---|
| 1. Executive overview | Partial | Clear synthesis, but breakthroughs are uncited and sometimes overclaimed. |
| 2. Historical timeline | Partial | Eight eras exist, but primary-source chronology, payments, fraud, shipping, customer service, acquisition, failed practices, and causal explanations are thin. |
| 3. Evolution map | Partial | Transitions are described but not explicitly mapped with what each stage replaced and why. |
| 4. Consumer psychology KB | Partial | Heavy reliance on simplified dual-process framing; insufficient evidence designs, moderators, counterevidence, affect, identity, learning, memory, expertise, risk, and temporal behavior. |
| 5. Behavioral economics KB | Partial | Major effects named, but effect heterogeneity, replication, welfare, and test protocols are incomplete. |
| 6. Visual sales design KB | Partial | Color/contrast discussion exists; typography, imagery, attention, hierarchy, motion, device, culture, and accessibility need more evidence and fewer rigid prescriptions. |
| 7. Pricing KB | Partial | Common frames covered; reference-price law, promotions, fairness, partitioned pricing, subscriptions, BNPL, dynamic pricing, and margin effects need expansion. |
| 8. Merchandising KB | Partial | Limited treatment of assortment, taxonomy, inventory, collection logic, seasonality, compatibility, returns, and lifecycle merchandising. |
| 9. Recommendation/upsell/cross-sell KB | Partial | Algorithm names appear; objective functions, substitutes versus complements, cold start, diversity, calibration, causality, margin/returns, and long-term effects are thin. |
| 10. Product-page KB | Partial | Useful sequence, but category variation, evidence standards, content governance, comparison, fit, availability, delivery, and regulated products need expansion. |
| 11. Cart/checkout KB | Partial | Strongest applied section, but some benchmarks are treated as laws and legal/payment/geographic variation is missing. |
| 12. Post-purchase/retention KB | Weak | Confirmation, onboarding, service recovery, returns, replenishment, loyalty, subscriptions, CRM frequency, and incrementality need a full model. |
| 13. Competitor intelligence | Weak | No repeatable sampling, capture, coding, comparison, or causal-inference framework. |
| 14. Sales-pattern library | Incomplete | 20 patterns versus a minimum of 150. |
| 15. Digital sales ontology | Partial | Small entity list; lacks observations, evidence, jurisdictions, harms, constraints, outcome horizons, and uncertainty. |
| 16. Evidence matrix | Weak | Three broad buckets; no sources, study designs, counterevidence, or claim-level grades. |
| 17. Dark-pattern/ethics matrix | Partial | Categories exist; jurisdiction, vulnerable users, remedies, measurement, and non-deceptive alternatives need detail. |
| 18. Analytics/experimentation | Partial | Basic equations and telemetry; lacks assignment integrity, sample-ratio mismatch, interference, novelty, peeking, multiple testing, guardrails, heterogeneity, and long-term holdouts. |
| 19. AI-era commerce review | Weak | Mostly conceptual and partly speculative; omits concrete 2025–2026 protocol and product deployments. |
| 20. Future capability requirements | Partial | Ten domains are useful but not sufficient or operationally testable. |
| 21. Research gaps | Weak | Gaps are mentioned but not prioritized by risk, decision value, and evidence feasibility. |
| 22. Source library | Missing | No direct URLs or bibliography. |

## 2. Critical corrections to the existing synthesis

The verdict labels below follow the research-specialist scale: **TRUE / MOSTLY_TRUE / PARTLY_TRUE / MOSTLY_FALSE / FALSE / UNVERIFIABLE**.

| Claim in or implied by `covered.md` | Verdict | Evidence-based correction |
|---|---|---|
| More choice generally causes abandonment. | **MOSTLY_FALSE as a universal rule** | A 2010 meta-analysis of 63 conditions from 50 experiments (N=5,036) found a mean choice-overload effect near zero and substantial heterogeneity. Assortment should be organized around decision difficulty, preference uncertainty, and expertise—not mechanically reduced. [Scheibehenne, Greifeneder & Todd (2010)](https://academic.oup.com/jcr/article-abstract/37/3/409/1827647) |
| Reviews affect purchase decisions. | **MOSTLY_TRUE** | A 2024 meta-analysis synthesized 156 studies, 214 effect sizes, and 69,006 observations; review valence had the strongest pooled association with purchase intention, while culture, product type, and study features moderated relationships. Much evidence concerns intention, not actual incremental sales, so interface-level causal claims still require experiments. [Verma et al. (2024)](https://www.sciencedirect.com/science/article/pii/S2543925123000323) |
| Ratings between 4.2 and 4.7 universally maximize conversion. | **UNVERIFIABLE / unsupported as stated** | The optimum depends on category, review volume, distribution, authenticity cues, platform, price, and selection. Preserve rating distributions and review detail; test category-specific presentation rather than encoding a universal interval. |
| A CTA works because luminance contrast isolates it, not because of hue. | **PARTLY_TRUE** | Contrast and salience support detection, and accessible text contrast has normative thresholds. But conversion also depends on label, hierarchy, relevance, expectation, surrounding content, brand/category associations, and task state. Hue meanings are not universal, yet saying color acts *only* through luminance is also too strong. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) |
| Body text must be at least 16px with line height 1.4–1.6. | **UNVERIFIABLE as a universal rule** | Readability depends on x-height, font, rendering, viewport, language, distance, user settings, and zoom. Use responsive type, avoid blocking user scaling, meet accessibility criteria, and validate with representative users. |
| WCAG 2.2 AA is a legal requirement for ecommerce. | **MOSTLY_FALSE as a blanket claim** | WCAG 2.2 is a W3C Recommendation and strong design target. Law varies. In the U.S., DOJ’s explicit Title II rule uses WCAG 2.1 AA for covered state/local government web and mobile content; DOJ says Title III businesses have ADA duties but no single detailed federal technical standard in its guidance. Check each jurisdiction and sector. [W3C (2024)](https://www.w3.org/TR/WCAG22/), [DOJ Title II rule](https://www.ada.gov/law-and-regs/regulations/title-ii-2010-regulations/), [DOJ web guidance](https://www.ada.gov/resources/web-guidance/) |
| Checkout should contain fewer than 12 fields. | **PARTLY_TRUE** | Baymard reports that an ideal flow can be as little as 12 form elements (including seven fields) based on moderated testing, eye tracking, benchmarking, and quantitative studies. Treat this as evidence to remove unnecessary inputs, not a hard ceiling for every country, payment method, regulated purchase, tax context, or delivery type. [Baymard (updated 2025)](https://baymard.com/blog/ecommerce-checkout-usability-report-and-benchmark) |
| Cart abandonment is about 70%. | **MOSTLY_TRUE as an aggregate benchmark** | Baymard’s continuously updated aggregation reports 70.19%, but a pooled benchmark is not a causal target or a forecast for a particular site. Browsing, comparison, gift research, device, category, and measurement definitions matter. [Baymard checkout research](https://baymard.com/research/checkout-usability) |
| Dark patterns face active U.S. and EU enforcement. | **TRUE** | The FTC documents disguised ads, buried terms/fees, obstructive cancellation, and privacy manipulation; the EU Digital Services Act prohibits platform interfaces that materially distort or impair free and informed decisions. [FTC (2022)](https://www.ftc.gov/reports/bringing-dark-patterns-light), [EU DSA](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R2065) |
| The FTC’s Amazon Prime action was $2.5 billion. | **TRUE, now dateable** | In September 2025, the FTC announced a $1 billion civil penalty plus $1.5 billion in consumer refunds concerning unwanted Prime enrollment and cancellation obstruction. This is evidence about the practices alleged and settled, not proof that every multi-step cancellation flow is unlawful in every jurisdiction. [FTC (2025)](https://www.ftc.gov/news-events/news/press-releases/2025/09/ftc-secures-historic-25-billion-settlement-against-amazon) |
| Hidden mandatory fees are broadly banned by the FTC’s 2025 fees rule. | **MOSTLY_FALSE if generalized to all retail** | The federal rule effective 12 May 2025 covers live-event tickets and short-term lodging. Other deceptive fee practices may still implicate general law, sector rules, or state law, but the rule’s scope must not be overstated. [FTC FAQ (2025)](https://www.ftc.gov/business-guidance/resources/rule-unfair-or-deceptive-fees-frequently-asked-questions) |
| A/B testing establishes causality. | **MOSTLY_TRUE under valid design and execution** | Randomization supports causal estimation, but assignment failures, sample-ratio mismatch, telemetry loss, interference, invalid variance assumptions, peeking, and multiple comparisons can invalidate results. [Microsoft (2009)](https://www.microsoft.com/en-us/research/publication/online-experimentation-at-microsoft/), [Deng, Lu & Litz (2017)](https://www.microsoft.com/en-us/research/publication/trustworthy-analysis-of-online-a-b-tests-pitfalls-challenges-and-solutions/) |
| “The future is agentic.” | **PARTLY_TRUE** | Agentic commerce is deployed, not merely hypothetical: ACP enabled in-chat checkout in 2025, Google/Shopify announced UCP in January 2026, and OpenAI expanded ACP-based product discovery in March 2026. Market share, consumer trust, welfare, attribution, fraud, returns, and protocol convergence remain unsettled. [Stripe/OpenAI ACP (2025)](https://stripe.com/newsroom/news/stripe-openai-instant-checkout), [Google UCP (2026)](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/), [OpenAI shopping (2026)](https://openai.com/index/powering-product-discovery-in-chatgpt/) |

## 3. Evolution map: what changed, what it solved, and what remains

| Transition | Problem it addressed | What it replaced or supplemented | What survived | What should now be questioned |
|---|---|---|---|---|
| Catalog → searchable catalog | Digital assortments outgrew browsable page trees. | Linear print/catalog browsing. | Categories, product identifiers, merchandising hierarchy. | Category trees as the only discovery path. |
| Search → faceted discovery | Broad queries returned too many heterogeneous results. | Keyword-only result lists. | Query, filters, sort, result cards. | Static facets that ignore category, inventory, and intent. |
| Transaction → protocol trust | Buyers could not inspect merchant or safely transmit payment details. | Phone/mail orders and face-to-face assurance. | Encryption, authentication, payment authorization, receipts. | Decorative “security” badges with no meaningful assurance. |
| Merchant claims → peer evidence | Information asymmetry and lack of physical inspection. | Brand-controlled product claims alone. | Ratings, reviews, questions, user media. | Average stars without distributions, provenance, recency, or fraud controls. |
| Static merchandising → recommendations | Large catalogs exceeded manual curation capacity. | One-size-fits-all shelves. | Related items, complements, recently viewed, personalized ranking. | Optimizing clicks without diversity, margin, returns, fairness, or long-term value. |
| Desktop → mobile/touch | Shopping moved into constrained, interrupted, sensor-rich contexts. | Pointer/keyboard assumptions and dense layouts. | Responsive content, wallets, autofill, touch targets, persistent actions. | Treating mobile as merely a smaller desktop or assuming every step should vanish. |
| Storefront → omnichannel service | Customers expected inventory and service continuity across channels. | Separate online/store operations. | Pickup, ship-from-store, unified inventory, cross-channel returns. | Promising availability without reliable operational data. |
| Broad targeting → first-party personalization | Privacy restrictions and signal loss weakened third-party tracking. | Cookie-heavy audience targeting. | Consent, lifecycle data, contextual/session signals, preference capture. | Personalization that surprises users or cannot explain data provenance. |
| Page navigation → conversational/agentic discovery | Complex goals do not map cleanly to short queries and filters. | Repeated search–open–compare loops. | Structured product data, eligibility, price, availability, terms, payment and fulfillment. | Assuming agents remove the need for human verification, brand expression, support, or recourse. |

### Chronological supplement

**1990–1995 — transaction feasibility.** The key achievement was not persuasive page design but the possibility of remote, encrypted interaction. Bandwidth constrained media; trust centered on whether payment and identity data could be sent at all. Interfaces borrowed heavily from catalogs and forms because those were learned models. The durable lesson is that every unfamiliar commercial technology first needs intelligibility, recoverability, and credible institutional assurance.

**1995–2000 — marketplace and acquisition formation.** Amazon, eBay, travel, configurable direct sales, payment intermediaries, affiliates, portals, and comparison services demonstrated distinct models. Auction reputation and seller feedback made distributed strangers transact. The durable lesson is that marketplace design must govern seller quality, dispute resolution, and information asymmetry—not merely display inventory.

**2000–2005 — efficiency after the crash.** Search marketing, web analytics, standardized navigation, persistent carts, reviews, and early recommendations linked customer acquisition to measurable downstream behavior. Amazon’s published item-to-item collaborative filtering work described real-time recommendations whose computation scaled independently of the number of customers and catalog items. [Linden, Smith & York (2003)](https://doi.org/10.1109/MIC.2003.1167344)

**2005–2010 — broadband, social proof, and experimentation.** Richer media, AJAX interactions, faceted search, ratings, user media, and commercial experimentation became more practical. The important intellectual change was from “best practice” to testable hypothesis, but many organizations kept copying visible competitors without measuring incremental effects.

**2010–2015 — mobile and platform democratization.** Responsive design, apps, touch input, cameras, location, push, and platform storefronts changed not only screen size but shopping context. Purchase sessions became shorter and more interruptible; saved identity/payment reduced data entry; visual social discovery connected inspiration to commerce. The surviving principle is continuity: preserve state, expose costs and delivery, and make recovery easy across interruptions and devices.

**2015–2020 — lifecycle orchestration and industrial recommendation.** Wallets, APIs, cloud services, event-triggered messaging, and increasingly neural recommenders enabled dynamic journeys. Two-stage candidate-generation/ranking architectures and hybrid models balanced memorization and generalization at scale. [Google, “Deep Neural Networks for YouTube Recommendations” (2016)](https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/), [Google, “Wide & Deep” (2016)](https://research.google/pubs/wide-deep-learning-for-recommender-systems/)

**2020–2023 — accelerated adoption and governance.** Pandemic disruption accelerated ecommerce and omnichannel operations. At the same time, regulators focused on subscription obstruction, consent manipulation, fake scarcity, hidden terms, and platform accountability. The durable lesson is that optimization systems require explicit welfare, privacy, and legal guardrails; a short-term metric lift is not self-justifying.

**2023–2026 — generative and agentic commerce.** Multimodal and conversational discovery moved from demo to product. ACP enabled programmatic flows among shoppers/agents, merchants, and payments in 2025. UCP was announced in 2026 as another open protocol spanning checkout and agent/payment interoperability. OpenAI’s March 2026 shopping update expanded product feeds, promotions, visual browsing, image-based discovery, and comparisons. These deployments make structured, fresh, truthful product data a commercial interface in its own right. They do **not** yet prove that conventional storefronts, human comparison, or brand-controlled experiences become obsolete.

### Business-model, region, traffic and journey boundary conditions

Marketplaces outside the U.S. canon reveal why copying surface design is weak analysis. Alibaba/Taobao/Tmall combined seller ratings, chat, payment assurance and dense merchandising; Mercado Libre integrated marketplace, payments and logistics in markets with different payment access and delivery constraints; Shopee and Lazada paired mobile-first commerce with chat, vouchers, livestreaming and platform logistics; Etsy makes seller identity, provenance, customization and item-specific delivery uncertainty central. SHEIN and Temu demonstrate rapid assortment and promotion systems, but their adoption of countdowns, feeds or gamification is not causal proof and carries regulatory, trust and overconsumption risks.

| Model | Central decision problem | High-value information | Common commercial failure |
|---|---|---|---|
| Grocery/quick commerce | Substitution, freshness, slot and basket repetition | Live stock, substitution control, unit price, delivery window | Promoting unavailable items; hidden weight/price adjustment |
| Travel | Perishable date/party inventory and cancellation risk | Total trip price, exact rules, location, refundability | Drip pricing, false scarcity, incomparable rooms/fares |
| B2B | Multiple stakeholders, approval and integration | Specifications, compliance, lead time, TCO, procurement path | Consumer impulse tactics replacing technical proof |
| Luxury | Authenticity, symbolic value, service and controlled scarcity | Provenance, craftsmanship, distribution and service | Indiscriminate coupons or false urgency eroding brand |
| Subscription | Future usage uncertainty and recurring commitment | Cadence, annualized cost, renewal, pause/cancel, usage fit | Trial surprise and cancellation obstruction |
| SaaS/digital goods | Fit, switching, security and migration | Demo, limits, integrations, export, uptime | “Unlimited” claims and feature grids without task evidence |
| Auctions/resale | Condition, counterparty, timing and authenticity | Bid state, total fees, condition standard, seller/dispute data | Shill-like urgency and incomparable condition grades |
| Regulated/health | Safety, eligibility, evidence and sensitive privacy | Limits, contraindications, regulatory/clinical role | Testimonials substituting for evidence |

Culture must be treated as a moderator, not a stereotype field. Localize language direction, scripts, currency and tax, names and addresses, payment rails, installments, delivery reliability, returns, privacy law, support and institutional trust. Locale may supply overridable defaults; nationality should not be used as a proxy for an individual’s persuasion preferences. A 2017 meta-analysis of 150 online-trust studies found significant relationships but also moderation by design, website and measurement, and a 2026 systematic review of 773 cross-border-commerce publications reports continuing cross-cultural evidence gaps. [Kim & Peterson (2017)](https://doi.org/10.1016/j.intmar.2017.01.001), [Dong (2026)](https://www.nature.com/articles/s41599-026-06579-4)

| Arrival context | Likely customer question | Experience obligation | Diagnostic outcome |
|---|---|---|---|
| Branded/direct | “Is this the right official product?” | Fast confirmation, availability and route to task | Successful-destination rate |
| Nonbrand search | “Which option solves my problem?” | Query continuity, education and comparison | Qualified PDP reach/search refinement |
| Paid social/creator | “Is this promise credible and for me?” | Message match, demonstration and disclosure | Incremental contribution plus complaint/return guardrails |
| Marketplace referral | “Why buy direct?” | Policy/price clarity, authenticity and service value | Net conversion after channel cannibalization |
| Email/SMS | “Is this relevant now?” | Deep-link continuity and preference-aware frequency | Incremental profit, unsubscribe and complaint |
| Agent referral | “Does this satisfy explicit constraints?” | Structured facts, provenance, live offer and policy | Constraint satisfaction, correction and dispute |

## 4. Evidence-governed commercial knowledge base

### 4.1 Consumer psychology and behavioral economics

The AI must model a decision situation, not assign a shopper a simplistic “System 1” or “System 2” label. Relevant state includes goal clarity, product knowledge, involvement, perceived risk, time pressure, affect, social setting, device constraints, brand familiarity, prior experience, and ability to reverse the decision.

The useful analytical unit is a causal chain—**stimulus → attention/interpretation → belief or affect → choice → downstream customer/business outcome**—with rival explanations recorded. Defaults may work through effort, perceived recommendation or status quo; scarcity through opportunity cost, competition or anticipated regret; a price anchor through reference dependence or quality inference. Similar behavior can therefore have different causes and welfare implications.

| Principle | Why it may work | Evidence and grade | Boundary/counterevidence | Ethical application and test |
|---|---|---|---|---|
| Reduce unnecessary cognitive work. | Working memory and attention are limited; clear grouping and recognition reduce effort. | **MOSTLY_TRUE; repeated cognitive/HCI evidence.** | “More information” is not identical to “more load”; experts and risky purchases may need detail. | Use progressive disclosure without hiding material facts. Test task completion, errors, comprehension, confidence, conversion, returns, and support contacts. |
| Organize rather than simply shrink choice. | Filters, defaults, comparison, and curation can lower search cost. | **MOSTLY_TRUE; mechanism supported, implementation contextual.** Choice-overload average was near zero in the 2010 meta-analysis. | Preference uncertainty, expertise, assortment attractiveness, and time pressure moderate effects. | Preserve access to the full assortment. Test organized-full versus truncated versus unstructured sets. |
| Use truthful social evidence to reduce uncertainty. | Other customers provide experience information that merchant copy cannot. | **MOSTLY_TRUE.** 2024 meta-analysis: 156 studies/69,006 observations, with cultural and product moderators. | Selection bias, fake reviews, popularity bias, and intention–behavior gaps. | Show provenance, distributions, dates, verified status where meaningful, and critical reviews. Measure comprehension, sales, returns, complaint rate, and review helpfulness. |
| Make defaults welfare-aligned and reversible. | Defaults reduce action and signal a recommended path. | **TRUE mechanism; outcome highly contextual.** | Effects can reflect inertia rather than preference; paid add-ons and subscriptions create material harm. | Default only when justified by typical user interest; disclose consequences and provide symmetric reversal. Test active choice when stakes are high. |
| Use scarcity only when operationally true. | Real scarcity can change the opportunity cost of delay. | **PARTLY_TRUE/contextual.** | Fabrication destroys trust and may violate law; urgency can degrade decision quality and increase returns. | Tie claims to auditable inventory or real deadlines. Track trust, cancellations, returns, complaints, and repeat behavior—not only immediate conversion. |
| Frame price with a truthful comparison set. | Reference dependence changes perceived value. | **MOSTLY_TRUE mechanism; contextual application.** | Reference prices may be irrelevant, manipulated, or illegal; framing can harm premium positioning or fairness. | Use recent, genuine reference prices and clear eligibility/period. Test profit and long-term response, not click-through alone. |

### 4.2 Visual attention, color, typography, imagery, and motion

Visual design should express task priority, semantic grouping, state, and brand—not encode universal color emotions. Required knowledge includes contrast and luminance; size and position; whitespace and grouping; visual competition; reading direction and language; motion and interruption; image diagnosticity; touch and pointer behavior; zoom; color-vision variation; and assistive technologies.

Operational rules:

- Top-down goals often outrank decorative salience: someone seeking compatibility, delivery or price scans for learned labels. Put decision-critical facts under descriptive, conventional headings.
- Bottom-up salience can change what is sampled first, especially under speed/load, but salience is relational. Use contrast, scale, whitespace, position and motion to reveal the correct next action or error—not to hide refusal or cancellation. Three real-food choice experiments found salience effects moderated by decision speed/load. [Milosavljevic et al. (2012)](https://doi.org/10.1016/j.jcps.2011.10.002)
- Clutter is task-relative. Dense, aligned attributes may help experts compare; sparse screens can force memory across steps. Evaluate time-to-answer, comparison accuracy, errors and confidence.
- Make the primary action visually discoverable **after** the value, price, variant, availability, delivery, and material terms needed for informed action are understandable.
- Do not place essential information in ad-like containers, auto-rotating carousels, hover-only states, or low-salience legal text.
- Use product media to resolve category-specific uncertainty: scale and fit for apparel/furniture, texture and finish for beauty/home, interfaces and ports for electronics, ingredients/allergens for consumables, assembly/compatibility for parts.
- Treat motion as a scarce attention intervention. Respect reduced-motion preferences; avoid motion that obscures state or repeatedly interrupts evaluation.
- Use WCAG 2.2 as a forward-looking accessibility target while separately mapping actual legal obligations. WCAG 2.2 added criteria including focus-not-obscured, dragging alternatives, minimum target size, redundant entry, consistent help, and accessible authentication. [W3C summary](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

Color can communicate state, category and brand, but associations are both shared and culturally/linguistically shaped. A 30-country, 22-language study (N=4,598) found universal patterns alongside geographic/linguistic prediction; it does not license deterministic country color rules. [Jonauskaite et al. (2020)](https://doi.org/10.1177/0956797620948810) Typography likewise conveys impressions and can affect congruence, but no evidence supports one universal ecommerce font size, line height or typeface. Test the actual font, script, viewport, zoom, numeral differentiation and low-vision use.

AIDA, PAS, “features to benefits,” and awareness stages are practitioner heuristics, not general causal laws. Copy should be the minimum that answers the material decision: known-item buyers need identity, fit, stock, delivered cost/date; technical buyers need compatibility and aligned evidence; subscriptions need limits, renewal, cancellation and total economics; gifts need recipient fit, cutoff and exchanges. Story can aid transportation, but it must not delay or replace facts. A meta-analysis of 64 articles and 138 effect sizes found digital-storytelling effects with moderators, supporting contextual use rather than a universal narrative mandate. [van Laer et al. (2019)](https://doi.org/10.1016/j.jbusres.2018.10.053)

### 4.3 Pricing and promotions

An AI sales designer needs price architecture, not a list of endings. It must know list price, actual selling-price history, cost, gross and contribution margin, tax, shipping, payment fees, return reserve, channel economics, promotion funding, elasticity, inventory position, price perception, competitor comparability, customer eligibility, and jurisdiction.

It must distinguish:

- **Reference price:** the comparison baseline shown or inferred.
- **Transaction price:** what the customer actually pays.
- **Unit price:** price normalized by quantity or measure.
- **Partitioned price:** total divided into components.
- **Threshold promotion:** benefit unlocked at a spend/quantity boundary.
- **Bundle price:** joint price for a defined set.
- **Subscription price:** recurring charge with cadence, renewal, cancellation, and total commitment.
- **Personalized/dynamic price:** price or offer varies by context or person, raising fairness, transparency, and discrimination risks.

Every promotion should be evaluated on incrementality and contribution profit after cannibalization, stock-outs, returns, support, and future reference-price effects. A higher conversion rate with lower contribution profit is not an improvement.

Specific price rules need stricter boundaries:

- Left-digit/charm-price effects exist in bounded comparisons, especially when the leftmost digit changes, but should be tested against margin and brand/quality perception. [Thomas & Morwitz (2005)](https://doi.org/10.1086/429600), [Strulov-Shlain (2023)](https://doi.org/10.1093/restud/rdac082)
- A reference price must identify a bona fide basis—former price, MSRP, competitor or bundle sum—and preserve substantiation. “Was” prices manufactured only to create a discount are not legitimate anchors.
- Partitioning can cause customers to underweight surcharges and misremember total cost; that is a harm signal, not a conversion technique. Show unavoidable total cost prominently, then explain components. [Morwitz, Greenleaf & Johnson (1998)](https://doi.org/10.1177/002224379803500404)
- BNPL/installments need number and amount of payments, dates, total paid, interest/fees, eligibility, late consequences and return interaction—not only a small periodic amount.
- Promotion analysis must distinguish incremental demand, timing acceleration, stock-up, channel shift, product cannibalization and subsidy to customers who would have bought anyway. Three field studies found promotion depth could have opposite long-run effects for new and established customers. [Anderson & Simester (2004)](https://doi.org/10.1287/mksc.1030.0040)

### 4.4 Merchandising, search, and recommendation

Search and recommendations are different decision aids. Search begins with an expressed query; recommendation infers useful candidates from context. Both need accurate catalog data and constraints.

Recommendation types must stay semantically distinct:

| Type | Commercial question | Primary risk |
|---|---|---|
| Substitute/alternative | “What else satisfies the same need?” | Irrelevant similarity or needless switching. |
| Complement/cross-sell | “What works with this item?” | Incompatibility, low margin, or unwanted add-ons. |
| Upsell | “Is a higher-value version better for this need?” | Steering beyond budget or need. |
| Bundle/kit | “What set completes the job?” | Hiding redundant items or false savings. |
| Order bump | “Is one small adjacent addition useful now?” | Checkout distraction and coerced consent. |
| Frequently bought together | “What co-occurs in baskets?” | Correlation without complementarity; popularity and seasonality bias. |
| Recently viewed | “What should remain easy to resume?” | Privacy surprise on shared devices. |
| Personalized | “What fits this customer’s durable preferences?” | Filter bubbles, sensitive inference, and stale identity. |
| Contextual/session-based | “What fits the current mission?” | Overreacting to accidental or gift browsing. |

The objective cannot be click-through rate alone. Candidate evaluation should include relevance, availability, compatibility, price/budget, margin, diversity, novelty, return likelihood, customer satisfaction, supplier/marketplace fairness, and long-term value. Cold-start handling may combine content features, category/attribute relationships, substitute signals, exploration, and human curation. Amazon’s 2026 product-search work reports production use of substitute relationships to boost behavioral features for new products, with offline and online improvement claims; effect sizes and generalizability require inspection before reuse. [Amazon Science (2026)](https://www.amazon.science/publications/behavioral-feature-boosting-via-substitute-relationships-for-e-commerce-search)

### 4.5 Product page, cart, checkout, and post-purchase

The page must resolve uncertainties in the order relevant to the customer’s mission, not follow a fixed global template. Common uncertainty classes are identity, suitability, compatibility, quality, price/value, availability, delivery, returns, seller legitimacy, payment/security, and social validation.

Checkout quality means:

- reveal the total and material terms early enough for an informed decision;
- allow guest purchase where accounts are not genuinely required;
- preserve state and explain errors in context;
- use input modes, autocomplete, address logic, and payment methods appropriate to locale;
- prevent duplicate orders and make back-navigation/review safe;
- make optional add-ons explicitly optional;
- provide accessible authentication and recovery;
- confirm what happened, what happens next, and how to get help.

Post-purchase is not merely an upsell surface. It is the proof stage of the promise. Required knowledge includes receipt and order state, fulfillment uncertainty, proactive delay communication, self-service changes, returns/exchanges, service recovery, onboarding, replenishment, subscription control, review solicitation timing, loyalty, win-back, channel frequency, and suppression after negative events. Optimize repeat contribution, trust, complaint rate, and customer effort—not message volume.

## 5. Competitor intelligence and mystery-shopping framework

Visible use by a market leader is evidence of adoption, not causation. A repeatable study should:

1. **Define the comparison set:** category leaders, premium operators, value operators, fast challengers, regional leaders, unusual models, and poor contrasts.
2. **Create standardized missions:** known-item search, exploratory browse, comparison, compatibility check, discount hunt, mobile purchase, account-free purchase, return initiation, subscription cancellation, and support recovery.
3. **Control context:** geography, device, new/returning state, referral source, login, consent state, inventory and timestamp.
4. **Capture the full journey:** acquisition page, navigation/search, list, PDP, cart, checkout, confirmation, tracking, delivery, return/refund, CRM, and cancellation.
5. **Code observations:** content, sequence, defaults, total-price timing, recommendations, social evidence, urgency, accessibility, performance, friction, trust, privacy, and dark patterns.
6. **Separate fact from hypothesis:** “Competitor uses X” is an observation; “X causes conversion” requires an experiment or credible causal evidence.
7. **Score commercial fit:** customer need, brand, operations, margin, legal environment, and implementation reliability.
8. **Retest over time:** interfaces, offers, inventory and regulation change. Keep dated screenshots and exact terms.

Recommended evidence envelope per observation: URL, timestamp/time zone, locale, viewport/device, referral condition, account state, screenshot, quoted interface text, path step, category code, suspected mechanism, risk, and confidence.

## 6. Analytics, experimentation, and unit economics

### Measurement hierarchy

| Horizon | Examples | Why it matters |
|---|---|---|
| Immediate behavior | Discovery success, comprehension, add-to-cart, checkout completion | Sensitive but may reward manipulation or low-quality demand. |
| Transaction quality | Revenue, contribution margin, discount cost, payment failure, fraud | Closer to business value than conversion alone. |
| Post-transaction | Cancellation, return, support, delivery failure, review, chargeback | Detects promises that convert but disappoint. |
| Relationship | Repeat contribution, retention, subscription survival, complaint and trust measures | Tests whether the system creates durable value. |
| System/market | Diversity, seller exposure, accessibility, privacy, vulnerable-user harm | Prevents local optimization from degrading ecosystem health. |

### Trustworthy experiment checklist

- Write the causal hypothesis, target population, treatment, unit of randomization, primary metric, guardrails, minimum detectable effect, duration, and stopping rule before launch.
- Run assignment and exposure checks; diagnose sample-ratio mismatch.
- Validate event semantics, deduplication, identity stitching, payment/return windows, and telemetry loss.
- Avoid uncorrected peeking and multiple comparisons.
- Account for interference (recommendations, inventory, network effects, shared households, marketplace sellers) and carryover.
- Segment only with adequate pre-specification or treat results as exploratory.
- Check novelty, learning, seasonality, marketing mix, and external validity.
- Measure heterogeneous treatment effects where they correspond to real decision contexts, but do not turn noisy subgroups into permanent rules.
- Use holdouts or longer follow-up when short-term conversion may conflict with returns, retention, trust, or margin.
- Record negative and null results to reduce repeated folklore.

Microsoft’s experimentation research explicitly warns that invalid independence assumptions can underestimate variance and that telemetry loss can bias conclusions. It also recommends stronger statistical controls for repeated measurement/early peeking. [Deng, Lu & Litz (2017)](https://www.microsoft.com/en-us/research/publication/trustworthy-analysis-of-online-a-b-tests-pitfalls-challenges-and-solutions/), [Gupchup et al. (2018)](https://www.microsoft.com/en-us/research/publication/trustworthy-experimentation-under-telemetry-loss/), [Microsoft during-experiment patterns (2021)](https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/)

## 7. Dark-pattern and ethics matrix

| Pattern | Harm mechanism | Evidence/legal signal | Non-deceptive alternative |
|---|---|---|---|
| Hidden or drip pricing | Prevents meaningful comparison and exploits commitment after effort. | FTC’s 2025 specific rule covers tickets/lodging; general deception and other laws may apply elsewhere. | Show unavoidable known charges in the prominent total; explain variable charges early. |
| Forced continuity | Converts inattention into recurring payment. | FTC dark-pattern report and subscription enforcement. | Separate consent, plain cadence/total, advance reminders where appropriate, easy cancellation. |
| Obstructive cancellation | Raises exit cost after easy enrollment. | FTC Amazon settlement; EU DSA addresses asymmetric difficulty. | Cancellation path comparable in effort to signup, with clear consequences and confirmation. |
| Preselected paid add-on | Treats inertia as purchase consent. | Regulatory concern across consumer-protection regimes. | Unchecked optional choice or active choice for genuinely important coverage. |
| Fake scarcity/activity | Manufactures urgency and social evidence. | FTC report identifies false scarcity/activity patterns. | Use auditable inventory, real deadlines, and qualified wording. |
| Confirmshaming | Uses guilt or identity threat to block refusal. | Identified as manipulative interface practice; legal treatment varies. | Neutral accept/decline labels with equal clarity. |
| Disguised advertising | Misrepresents commercial persuasion as independent content. | FTC dark-pattern report. | Prominent, comprehensible sponsorship/ad labeling. |
| Privacy obstruction | Makes the privacy-preserving path harder or less salient. | EU DSA and data-protection guidance; jurisdiction-specific consent law. | Symmetric choice, purpose-specific explanation, revocation and data controls. |
| Roach motel account/data deletion | Easy entry, hard exit. | FTC/EU regulatory focus on obstruction. | Discoverable self-service deletion with necessary security checks only. |
| Personalization using sensitive inference | Exploits information the customer did not expect to be used. | Privacy, discrimination, and platform-law risks vary. | Data minimization, explicit purpose, explainability, opt-out, sensitive-feature prohibition. |

Ethical review must consider truth, materiality, autonomy, reversibility, proportionality, vulnerable users, distribution of benefit/harm, data provenance, and remedy. “It increased conversion” never resolves the review.

Trust itself is not a badge. It is the expectation that the product is represented accurately, the seller/platform will perform, payment and data will be handled as represented, and failure has recourse. Fraud controls also impose false declines, accessibility burdens and conversion loss. Use risk-adaptive, proportionate friction and track fraud loss, manual review, false-decline rate, challenge completion, account takeover, chargeback/friendly fraud and disparate impact. NIST’s ecommerce example describes risk-based step-up multifactor authentication; it supports the pattern, not a mandate for one implementation. [NIST SP 1800-17 (2019)](https://doi.org/10.6028/NIST.SP.1800-17)

## 8. AI-era commerce review, current through 2026

### Established developments

- **In-chat checkout:** Stripe and OpenAI announced Instant Checkout and the open Agentic Commerce Protocol in September 2025. Merchants remained merchant of record and could accept/decline orders, process payment, tax, fulfillment and returns; scoped payment tokens avoided exposing underlying credentials to the agent. [Stripe (2025)](https://stripe.com/newsroom/news/stripe-openai-instant-checkout)
- **Cross-ecosystem protocols:** Google described UCP in January 2026 as an open-source common language for consumer surfaces, businesses and payments, compatible with AP2 and integration styles including APIs, A2A and MCP, with more than 20 named ecosystem supporters. This establishes active standardization, not eventual convergence. [Google Developers (2026)](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/)
- **Richer product discovery:** OpenAI announced ACP-based merchant feeds and promotions, visual product browsing, image inspiration, conversational refinement and side-by-side comparison in March 2026. It named several integrated retailers and Shopify Catalog as a delivery path. [OpenAI (2026)](https://openai.com/index/powering-product-discovery-in-chatgpt/)
- **Merchant distribution:** Shopify announced UCP/agentic storefront integrations spanning Google, ChatGPT and Microsoft surfaces and opened catalog infrastructure beyond Shopify-hosted stores. This is vendor-reported deployment evidence; independent outcome data remain limited. [Shopify (2026)](https://www.shopify.com/news/ai-commerce-at-scale)

### What the evidence does not yet establish

- that conversational commerce improves welfare, conversion, profitability, or retention across categories;
- that shoppers understand agent sponsorship, ranking, omissions, conflicts, or data use;
- that protocol-mediated product representation preserves brand, accessibility, regulated disclosures, or seller fairness;
- that agents reliably handle substitutions, compatibility, returns, warranties, tax, age restrictions, recalls, counterfeits, or multi-party disputes;
- that multi-agent negotiation becomes a normal retail mechanism by 2030.

### Required research program

Test agentic experiences against search/filter and human-assisted baselines on task success, total cost, product fit, decision confidence, diversity, time, returns, regret, trust, disclosure comprehension, privacy, seller distribution, accessibility, fraud, and profit. Include high- and low-knowledge shoppers, disabilities, different languages/cultures, shared-device contexts, and products with different risk/complexity.

## 9. Digital sales ontology — required additions

The ontology in `covered.md` should be extended with these entity classes and relations:

- **EvidenceClaim** has verdict, mechanism, study design, population, effect estimate, uncertainty, source, publication date, replication/corroboration, counterevidence, and applicability boundaries.
- **CommercialContext** includes business model, category, price, margin, inventory, purchase frequency, return profile, regulation, geography, brand, channel and operational capability.
- **CustomerState** includes mission, intent, knowledge, risk, budget, device, access needs, culture/language, brand history, consent and recoverability needs.
- **InterfaceAction** exposes information, requests input, changes state, recommends, ranks, defaults, interrupts, commits, charges, subscribes, confirms, or reverses.
- **Constraint** may be legal, ethical, accessibility, inventory, compatibility, margin, fulfillment, privacy, security, brand or technical.
- **Outcome** has subject (customer, merchant, seller, platform, society), horizon, metric, direction, magnitude, uncertainty, and distribution.
- **Harm** includes deception, financial loss, privacy loss, discrimination, exclusion, overconsumption, addiction/compulsion, regret, time loss and obstruction.
- **Experiment** links hypothesis, assignment, exposure, population, intervention, comparator, primary metric, guardrails, analysis plan, validity checks and result.
- **Pattern** is permitted only when its context satisfies prerequisites and no constraint or harm rule blocks it.

Key relations: `addresses_uncertainty`, `applies_mechanism`, `requires_evidence`, `bounded_by`, `conflicts_with`, `measured_by`, `causes_under_design`, `associated_with`, `harms`, `benefits`, `reversible_by`, `audited_by`, and `supersedes_pattern`.

## 10. Capability requirements before trust

Before it should design a commercial website, an AI must be able to:

1. Reconstruct the business model, value proposition, catalog, unit economics, operations, customer segments, traffic mix, brand and regulatory context from evidence, while exposing uncertainty.
2. Identify customer missions and unresolved uncertainties instead of applying persona stereotypes.
3. Distinguish observation, association, causal evidence, convention, mechanism hypothesis, legal rule and speculation.
4. Retrieve claim-level evidence with dates, study designs, populations, effect estimates, counterevidence and applicability boundaries.
5. Reason about visual attention, language, information architecture, interaction, accessibility and device context without universal color/layout folklore.
6. Design search, navigation, comparison, recommendations and merchandising around catalog semantics, availability, compatibility and customer intent.
7. Optimize contribution profit and long-term customer value with guardrails for returns, fraud, service, trust, privacy, accessibility and market/seller effects.
8. Recognize and reject deceptive, coercive, discriminatory or obstructive patterns, even when short-term metrics favor them.
9. Localize payment, delivery, tax, language, social evidence, privacy and trust mechanisms without reducing culture to national stereotypes.
10. Specify valid experiments, diagnose instrumentation/assignment failures, control statistical risks, and interpret heterogeneous or null effects.
11. Learn from full customer journeys—including support, delivery, returns, cancellation and retention—not only pages and clicks.
12. Compare competitors as dated observations and hypotheses, never as causal templates.
13. Handle new, sparse, conflicting or missing evidence by requesting research or proposing bounded tests rather than inventing certainty.
14. Produce designs whose material terms, recommendations and personalization can be explained and audited.
15. Support human and agentic commerce with accurate, fresh, structured product/offer/availability/terms data while preserving human verification and recourse.
16. Know when not to optimize or personalize: regulated decisions, sensitive inference, vulnerable users, insufficient consent, or inadequate evidence.

Trust should require benchmarked performance across different categories, cultures, devices, access needs, price/risk levels, and business models—not success on a single conversion dataset.

## 11. Sales-pattern library expansion: patterns 21–160

These 140 additions bring the combined library to **160 patterns** when added to the 20 in `covered.md`. The evidence letter grades the underlying mechanism—not a guaranteed sales lift: **A** = strong/repeated evidence, regulatory/standards basis, or high-confidence error-prevention principle; **B** = credible usability/observational practice; **C** = plausible, testable hypothesis. Every use still requires truthful implementation, contextual validation, accessibility, and profit/customer guardrails.

| # | Pattern | Stage | Mechanism / best use | Failure mode | Evidence |
|---:|---|---|---|---|:---:|
| 21 | Total-cost preview | PDP/cart | Reduces price uncertainty | Inaccurate tax/shipping promise | A |
| 22 | Delivery-date promise | PDP | Reduces temporal uncertainty | Operations miss promise | A |
| 23 | Postal-code estimator | PDP | Localizes cost/ETA | Requests data before value | B |
| 24 | Return-window summary | PDP | Risk reversal | Hides exceptions | A |
| 25 | Size/fit recommender | PDP | Fit confidence | Biased/inaccurate data | B |
| 26 | Measurement guide | PDP | Objective fit support | Wrong locale/units | A |
| 27 | Compatibility checker | PDP | Prevents wrong purchase | Incomplete device database | B |
| 28 | Ingredient/material glossary | PDP | Comprehension | Euphemisms obscure risk | B |
| 29 | Variant-linked media | PDP | Confirms exact choice | Media does not match SKU | A |
| 30 | Zoom/high-resolution detail | PDP | Quality inspection | Performance cost | B |
| 31 | Scale-reference image | PDP | Reduces size ambiguity | Misleading perspective | B |
| 32 | 360-degree view | PDP | Spatial inspection | Heavy asset, little added value | B |
| 33 | Demonstration video | PDP | Shows use/outcome | Staged, inaccessible, autoplay | B |
| 34 | Video transcript/captions | PDP | Accessibility/comprehension | Inaccurate auto-captions | A |
| 35 | Before/after with protocol | PDP | Outcome evidence | Manipulated imagery | A |
| 36 | Specification comparison | PDP | Attribute trade-off | Irrelevant attribute overload | B |
| 37 | “What’s included” inventory | PDP | Expectation alignment | Tiny exclusions | A |
| 38 | Seller identity panel | PDP/marketplace | Counterparty trust | Platform trust masks seller risk | A |
| 39 | Authenticity/provenance record | PDP | Counterfeit-risk reduction | Unverifiable claims | B |
| 40 | Repairability/spare-parts info | PDP | Lifecycle value | Unsupported availability claim | B |
| 41 | Search autosuggest | Discovery | Query formulation | Popularity bias | B |
| 42 | Typo tolerance | Discovery | Error recovery | Overcorrection changes intent | B |
| 43 | Synonym/locale mapping | Discovery | Vocabulary bridge | Culturally wrong equivalence | B |
| 44 | Query-scoped filters | Discovery | Choice structuring | Irrelevant filter clutter | B |
| 45 | Applied-filter chips | Discovery | State visibility | Inaccessible removal controls | A |
| 46 | Results-count preview | Discovery | Consequence visibility | Costly/unstable counts | B |
| 47 | Zero-results recovery | Discovery | Preserves task | Generic bestsellers ignore query | A |
| 48 | Category landing guide | Discovery | Novice education | SEO copy obscures products | B |
| 49 | Facet-value search | Discovery | Large-filter navigation | Hidden on mobile | B |
| 50 | Sort explanation | Discovery | Transparent ranking | Undisclosed paid ranking | A |
| 51 | Compare tray | Evaluation | Externalizes memory | Too many attributes | B |
| 52 | Save comparison state | Evaluation | Interruption recovery | Account wall | B |
| 53 | Recently viewed | Evaluation | Recognition/memory | Sensitive-product exposure | B |
| 54 | Wishlist without account | Evaluation | Low-commitment save | Fragile local storage | B |
| 55 | Back-in-stock alert | Retention | Demand recovery | Excessive contact/false ETA | B |
| 56 | Price-drop alert | Retention | Monitoring support | Trains waiting | B |
| 57 | Guided selector with skip | Discovery | Progressive choice | Forced quiz | B |
| 58 | Expert/novice mode | Discovery | Adaptive information depth | Stereotypes expertise | C |
| 59 | Natural-language query summary | Search | Confirms interpretation | Hallucinates constraint | C |
| 60 | Visual-search correction | Search | Image-based discovery | Irrelevant embeddings/bias | B |
| 61 | Verified-purchase marker | Reviews | Provenance signal | Verification too permissive | A |
| 62 | Review-distribution histogram | PDP | Shows variance | Binning manipulation | A |
| 63 | Review-recency filter | PDP | Current-quality signal | Hides older durability evidence | B |
| 64 | Review attribute tags | PDP | Task relevance | Auto-tag errors | B |
| 65 | Critical-review summary | PDP | Downside visibility | Selective summarization | B |
| 66 | Seller response to reviews | PDP | Recourse evidence | Scripted defensiveness | B |
| 67 | Community Q&A | PDP | Long-tail uncertainty | Obsolete/wrong answers | B |
| 68 | Expert-methodology disclosure | PDP | Authority calibration | Paid endorsement hidden | A |
| 69 | UGC rights/provenance label | PDP | Authenticity/privacy | Coerced or undisclosed reuse | A |
| 70 | Review-moderation policy | PDP | Procedural trust | Suppresses legitimate negatives | A |
| 71 | Complement compatibility rule | Cross-sell | Prevents unusable add-on | Stale compatibility | B |
| 72 | Substitute recommendation | PDP/OOS | Preserves task | Pushes higher-margin inferior item | B |
| 73 | Budget-aware alternatives | PDP | Price-fit support | Inferred sensitivity feels invasive | C |
| 74 | Diversity-aware carousel | Discovery | Reduces filter bubble | Relevance dilution | B |
| 75 | Novelty control | Discovery | Balances familiar/new | Novelty for its own sake | C |
| 76 | Recommendation explanation | Discovery | Intelligibility | Fabricated rationale | B |
| 77 | “Not interested” control | Discovery | Preference correction | Feedback ignored | B |
| 78 | Session-only personalization | Discovery | Relevance with less retention | Context misread | B |
| 79 | Popular-in-context ranking | Discovery | Normative aid | Rich-get-richer bias | B |
| 80 | Replenishment reminder | Retention | Purchase-cycle support | Mistimed/sensitive inference | B |
| 81 | Bundle-component editing | PDP/cart | Control and fit | Hidden discount loss | B |
| 82 | Bundle-savings arithmetic | PDP/cart | Transparent value | False comparison base | A |
| 83 | Required-accessory warning | PDP | Prevents unusable purchase | Disguised upsell | A |
| 84 | Optional-accessory separation | PDP | Distinguishes necessity | Ambiguous labels | A |
| 85 | Cart-item edit in place | Cart | Reduces navigation cost | Accidental changes | A |
| 86 | Undo cart removal | Cart | Error recovery | Short timeout | A |
| 87 | Persistent cart with disclosure | Cart | Interruption recovery | Cross-device privacy leak | B |
| 88 | Save for later | Cart | Separates intent | Hides saved item | B |
| 89 | Cart price-change notice | Cart | Expectation integrity | Silent repricing | A |
| 90 | Cart stock-reservation status | Cart | State clarity | False reservation | A |
| 91 | Promotion-eligibility explanation | Cart | Reduces coupon confusion | Opaque exclusions | A |
| 92 | Best-promotion auto-apply | Cart | Lowers search cost | Removes control/partner credit | B |
| 93 | Coupon-field de-emphasis | Cart | Reduces coupon hunting | Legitimate code hard to find | B |
| 94 | Threshold progress with margin guardrail | Cart | Goal pursuit | Overbuy/low-margin filler | B |
| 95 | Donation/tip neutral choice | Cart | Voluntary support | Guilt or preselection | A |
| 96 | Environmental option with impact | Cart | Value alignment | Unsubstantiated green claim | A |
| 97 | Guest checkout first-class | Checkout | Removes account barrier | Account option hidden | A |
| 98 | Post-purchase account creation | Confirmation | Defers commitment | Password demand blocks receipt | B |
| 99 | Address autocomplete with correction | Checkout | Lowers input/error | Wrong standardized address | A |
| 100 | Billing-same-as-shipping default | Checkout | Reduces redundant entry | Hard to override | A |
| 101 | Accessible input labels | Checkout | Comprehension/AT support | Placeholder-only labels | A |
| 102 | Error summary plus field links | Checkout | Recovery | Color-only error indication | A |
| 103 | Preserve form after error | Checkout | Avoids repeated work | Retains sensitive data too long | A |
| 104 | Passwordless/passkey sign-in | Checkout/account | Credential friction/security | Poor fallback/device transfer | A |
| 105 | Risk-based step-up authentication | Payment | Balances fraud/friction | Discriminatory false positives | A |
| 106 | Payment-method localization | Checkout | Local fit | Overwhelming logos | B |
| 107 | Wallet-readiness detection | Checkout | Shows usable express path | Hides conventional payment | B |
| 108 | Installment total-cost display | Checkout | Informed affordability | Emphasizes small periodic amount | A |
| 109 | Order-review edit links | Checkout | Error prevention | Edits reset unrelated fields | A |
| 110 | Final-button obligation text | Checkout | Legal/action clarity | Vague “continue” | A |
| 111 | Tax/duty responsibility | Checkout | Cross-border clarity | Surprise collection on delivery | A |
| 112 | Delivery-option comparison | Checkout | Cost/speed choice | Costly option deceptively preselected | A |
| 113 | Pickup-slot capacity status | Checkout | Fulfillment certainty | Stale slots | A |
| 114 | Decline-specific recovery | Payment | Correct next action | Exposes security details | B |
| 115 | Idempotent-retry reassurance | Payment | Prevents duplicate-order fear | Duplicate capture anyway | A |
| 116 | Accessible authentication alternative | Checkout | Avoids cognitive test | Insecure/hidden fallback | A |
| 117 | Confirmation with complete receipt | Post-purchase | Uncertainty closure | Upsell dominates receipt | A |
| 118 | Immediate order-edit window | Post-purchase | Error recovery | Operationally impossible promise | B |
| 119 | Proactive delay notice | Fulfillment | Expectation repair | Repeated optimistic ETAs | A |
| 120 | Shipment-milestone explanation | Fulfillment | State visibility | Meaningless carrier jargon | B |
| 121 | Self-service return initiation | Post-purchase | Recourse/friction | Hidden fees late | A |
| 122 | Refund timing/status | Post-purchase | Financial certainty | Untracked estimates | A |
| 123 | Exchange-first fit flow | Returns | Preserves product fit | Obstructs refund choice | B |
| 124 | Reorder from history | Retention | Low-effort replenishment | Changed SKU/price unseen | B |
| 125 | Subscription-cadence control | Retention | Autonomy/fit | Pause option hidden | A |
| 126 | Renewal reminder | Retention | Informed continuity | Too late to cancel | A |
| 127 | Usage-based replenishment | Retention | Timing relevance | Invasive/wrong inference | C |
| 128 | Loyalty-benefit ledger | Retention | Makes value visible | Expiry surprise | B |
| 129 | Preference center | CRM | Frequency/channel control | Choices ignored | A |
| 130 | Win-back without forced discount | Retention | Diagnoses lapse | Spam/chronic discounting | B |
| 131 | Referral disclosure and status | Advocacy | Transparent incentive | Spam/social coercion | A |
| 132 | Service-recovery credit | Support | Fairness repair | Replaces actual resolution | B |
| 133 | Live inventory by location | Omnichannel | Availability certainty | Stale feeds | A |
| 134 | Pickup-readiness evidence | Omnichannel | Trip-risk reduction | “Ready” before picking | A |
| 135 | Store-associate handoff | Omnichannel | Continuity | Lost context/privacy leak | B |
| 136 | QR continuation across devices | Omnichannel | Task transfer | Insecure/expired link | B |
| 137 | Local return options | Omnichannel | Recourse convenience | Inconsistent policy | B |
| 138 | Marketplace seller comparison | Marketplace | Counterparty choice | Hidden pay-to-play ranking | A |
| 139 | Escrow/payment-protection explainer | Marketplace | Transaction assurance | Overstates coverage | A |
| 140 | Dispute-pathway preview | Marketplace | Recourse confidence | Inaccessible after purchase | A |
| 141 | Condition-standard taxonomy | Resale | Comparable quality | Seller gaming | A |
| 142 | Bid total-cost preview | Auction | Fee clarity | Buyer premium hidden | A |
| 143 | Subscription annualized cost | Subscription | Total commitment | Only monthly price foregrounded | A |
| 144 | Trial conversion date/time | Subscription | Informed consent | Time-zone ambiguity | A |
| 145 | Plan-limit usage examples | SaaS | Concrete fit | Cherry-picked workloads | B |
| 146 | Quote/approval handoff | B2B | Multi-stakeholder continuity | Consumer CTA dead-end | B |
| 147 | Downloadable compliance packet | B2B | Procurement proof | Outdated certificates | A |
| 148 | Unit-price comparison | Grocery | Value comparability | Inconsistent units | A |
| 149 | Substitution preference | Grocery | Fulfillment control | Preference ignored | A |
| 150 | Perishable-freshness standard | Grocery | Quality expectation | Vague guarantee | B |
| 151 | Donation-impact range | Nonprofit | Outcome evidence | False precision | B |
| 152 | Neutral recurring-gift choice | Nonprofit | Autonomy | Recurring preselected | A |
| 153 | Creator-affiliate disclosure | Social | Source calibration | Disclosure after CTA | A |
| 154 | Shoppable-video chaptering | Social | Navigable demonstration | Impulse pressure/autoplay | B |
| 155 | Livestream replay facts | Social | Persistence/verification | Expired claims remain | B |
| 156 | Locale-aware names/addresses | Global | Form validity | Western schema imposed | A |
| 157 | Currency/tax switch with memory | Global | Price comprehension | Geolocation lock-in | A |
| 158 | Right-to-left layout QA | Global | Reading/action order | Media/brand mirrored incorrectly | A |
| 159 | Agent-readable offer facts | Agentic | Constraint matching | Stale price/policy/inventory | B |
| 160 | Delegated-purchase confirmation/recourse | Agentic | Authority and trust | Ambiguous consent/liability | A |

## 12. Prioritized research gaps

| Priority | Gap | Why it matters | Best next evidence |
|---|---|---|---|
| Critical | Long-term effects of persuasive patterns | Immediate conversion can hide returns, regret, churn and trust damage. | Multi-month randomized holdouts with contribution and customer outcomes. |
| Critical | Agentic ranking, conflicts and disclosure | Agents may mediate discovery without transparent incentives or omissions. | Audits and randomized user studies across sponsored/organic conditions. |
| Critical | Cross-cultural generalization | Much evidence is U.S./Europe/China-centric and student/survey-heavy. | Preregistered multi-country field experiments with measurement invariance. |
| Critical | Accessibility → commercial outcomes | Accessibility is normatively required in many contexts, but generalized conversion claims are often asserted without causal evidence. | Task-based studies and field experiments with disabled users; never use sales lift as the sole justification. |
| High | Review authenticity and AI-generated content | Synthetic reviews/media can corrupt trust signals. | Provenance experiments, detection audits, platform enforcement data. |
| High | Recommendation objectives beyond CTR | Click optimization may increase returns, narrow exposure or reduce welfare. | Multi-objective online tests with long-term and seller/customer guardrails. |
| High | Privacy-preserving personalization | Value and creepiness depend on data type, explanation and context. | Factorial experiments varying provenance, sensitivity, control and benefit. |
| High | Dynamic pricing fairness | Personalization may improve allocation but create perceived or actual discrimination. | Transparent field tests, distributional analysis and legal review. |
| High | Social/live commerce causality | Platform reports and observational growth do not isolate mechanisms. | Creator-, product- and audience-randomized experiments with return/fraud outcomes. |
| Medium | Visual rules across scripts/devices | Common gaze/type rules overgeneralize Latin-script desktop studies. | Eye-tracking plus task performance across languages and assistive settings. |
| Medium | Post-purchase service recovery | Underrepresented despite strong effect on retention and trust. | Randomized proactive communication, remedy and channel studies. |

## 13. Source library

Sources are grouped by subject as requested. Peer-reviewed and regulatory sources support effects and constraints; vendor documents establish launches, implementations, or self-reported telemetry—not independent causality.

### Consumer psychology and behavioral economics

- [Kahneman & Tversky (1979), “Prospect Theory,” *Econometrica*](https://doi.org/10.2307/1914185)
- [Johnson & Goldstein (2003), “Do Defaults Save Lives?”, *Science*](https://doi.org/10.1126/science.1091721)
- [Scheibehenne, Greifeneder & Todd (2010), choice-overload meta-analysis](https://doi.org/10.1086/651235)
- [Chernev, Böckenholt & Goodman (2015), choice-overload meta-analysis and moderators](https://doi.org/10.1016/j.jcps.2014.08.002)
- [Jachimowicz et al. (2019), meta-analysis of default effects](https://doi.org/10.1017/S0140525X18002093)
- [Kim & Peterson (2017), meta-analysis of online trust relationships](https://doi.org/10.1016/j.intmar.2017.01.001)
- [Verma et al. (2024), online-review purchase-intention meta-analysis](https://www.sciencedirect.com/science/article/pii/S2543925123000323)

### UX/HCI, visual design and accessibility

- [W3C, WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- [W3C, What’s New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [DOJ, Guidance on Web Accessibility and the ADA](https://www.ada.gov/resources/web-guidance/)
- [DOJ, Title II web/mobile accessibility regulation](https://www.ada.gov/law-and-regs/regulations/title-ii-2010-regulations/)
- [Baymard, cart and checkout usability research](https://baymard.com/research/checkout-usability)
- [Nielsen Norman Group, ecommerce research archive](https://www.nngroup.com/topic/ecommerce/)
- [Milosavljevic et al. (2012), visual salience and consumer choice](https://doi.org/10.1016/j.jcps.2011.10.002)
- [Jonauskaite et al. (2020), color–emotion associations across 30 countries](https://doi.org/10.1177/0956797620948810)
- [van Laer et al. (2019), digital-storytelling meta-analysis](https://doi.org/10.1016/j.jbusres.2018.10.053)

### Ecommerce history, channels and business models

- [Library of Congress, E-Commerce History research guide](https://guides.loc.gov/e-commerce/history)
- [U.S. Census Bureau, Annual Retail Trade Survey](https://www.census.gov/data/tables/2020/econ/arts/annual-report.html)
- [U.S. Census Bureau, Quarterly Retail E-Commerce Sales](https://www.census.gov/retail/mrts/www/data/pdf/ec_current.pdf)
- [Apple (2014), Apple Pay launch](https://www.apple.com/newsroom/2014/09/09Apple-Announces-Apple-Pay/)
- [Google (2015), 15 years of AdWords](https://adwords.googleblog.com/2015/10/happy-15th-birthday-adwords.html)
- [Amazon 2025 Form 10-K, filed 2026](https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/amzn-20251231.htm)
- [Etsy 2025 Form 10-K, filed 2026](https://investors.etsy.com/sec-filings/all-sec-filings/content/0001370637-26-000019/etsy-20251231.htm)
- [MercadoLibre 2025 Form 10-K, filed 2026](https://investor.mercadolibre.com/financial-information/quarterly-results)

### Pricing, promotions and merchandising

- [FTC, Guides Against Deceptive Pricing, 16 CFR Part 233](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233)
- [FTC (2025), Rule on Unfair or Deceptive Fees FAQ](https://www.ftc.gov/business-guidance/resources/rule-unfair-or-deceptive-fees-frequently-asked-questions)
- [FTC (2024), final rule banning fake reviews and testimonials](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials)
- [FTC (2023), Endorsement Guides](https://www.ftc.gov/legal-library/browse/federal-register-notices/guides-concerning-use-endorsements-testimonials-advertising)
- [OECD (2022), *Dark Commercial Patterns*](https://doi.org/10.1787/44f5e846-en)
- [Thomas & Morwitz (2005), left-digit effects in price cognition](https://doi.org/10.1086/429600)
- [Strulov-Shlain (2023), scanner-data evidence on left-digit bias](https://doi.org/10.1093/restud/rdac082)
- [Morwitz, Greenleaf & Johnson (1998), partitioned pricing](https://doi.org/10.1177/002224379803500404)
- [Anderson & Simester (2004), long-run promotion depth effects](https://doi.org/10.1287/mksc.1030.0040)

### Search, recommendations and basket intelligence

- [Linden, Smith & York (2003), Amazon item-to-item collaborative filtering](https://doi.org/10.1109/MIC.2003.1167344)
- [Covington, Adams & Sargin (2016), deep neural networks for recommendations](https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/)
- [Cheng et al. (2016), Wide & Deep recommender systems](https://research.google/pubs/wide-deep-learning-for-recommender-systems/)
- [Hidasi et al. (2016), session-based recommendations](https://arxiv.org/abs/1511.06939)
- [Ludewig & Jannach (2018), evaluation of session-based recommendation algorithms](https://arxiv.org/abs/1803.09587)
- [Stray et al. (2023), building human values into recommender systems](https://research.google/pubs/building-human-values-into-recommender-systems-an-interdisciplinary-synthesis-and-open-problems/)
- [Amazon Science (2026), substitute relationships for cold-start product search](https://www.amazon.science/publications/behavioral-feature-boosting-via-substitute-relationships-for-e-commerce-search)

### Analytics and experimentation

- [Kohavi et al. (2009), online experimentation at Microsoft](https://www.microsoft.com/en-us/research/publication/online-experimentation-at-microsoft/)
- [Kohavi et al. (2009), seven pitfalls in web experiments](https://doi.org/10.1145/1557019.1557139)
- [Deng et al. (2013), CUPED variance reduction](https://doi.org/10.1145/2433396.2433413)
- [Deng, Lu & Litz (2017), trustworthy A/B-test analysis](https://www.microsoft.com/en-us/research/publication/trustworthy-analysis-of-online-a-b-tests-pitfalls-challenges-and-solutions/)
- [Dmitriev et al. (2017), twelve metric-interpretation pitfalls](https://www.microsoft.com/en-us/research/publication/a-dirty-dozen-twelve-common-metric-interpretation-pitfalls-in-online-controlled-experiments/)
- [Gupchup et al. (2018), trustworthy experimentation under telemetry loss](https://www.microsoft.com/en-us/research/publication/trustworthy-experimentation-under-telemetry-loss/)
- [Google Analytics, ecommerce measurement documentation](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)

### Security, privacy and regulation

- [FTC (2022), *Bringing Dark Patterns to Light*](https://www.ftc.gov/reports/bringing-dark-patterns-light)
- [Mathur et al. (2019), dark patterns at scale across about 11,000 shopping sites](https://doi.org/10.1145/3359183)
- [EU, General Data Protection Regulation](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [EU, Digital Services Act legal text](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R2065)
- [European Commission, Digital Services Act overview](https://digital-strategy.ec.europa.eu/en/policies/digital-services-act)
- [NIST SP 800-63 Rev. 4, Digital Identity Guidelines](https://www.nist.gov/identity-access-management/projects/nist-special-publication-800-63-digital-identity-guidelines)
- [PCI Security Standards Council, PCI DSS](https://www.pcisecuritystandards.org/standards/pci-dss/)
- [EMVCo, EMV 3-D Secure](https://www.emvco.com/emv-technologies/3d-secure/)

### AI and agentic commerce

- [NIST (2023), AI Risk Management Framework 1.0](https://doi.org/10.6028/NIST.AI.100-1)
- [NIST (2024), Generative AI Profile](https://doi.org/10.6028/NIST.AI.600-1)
- [Google (2023), generative-AI virtual try-on launch](https://blog.google/products-and-platforms/products/shopping/ai-virtual-try-on-google-shopping/)
- [Amazon (2024), Rufus shopping assistant rollout](https://www.aboutamazon.com/news/retail/how-to-use-amazon-rufus)
- [Stripe/OpenAI (2025), Instant Checkout and Agentic Commerce Protocol](https://stripe.com/newsroom/news/stripe-openai-instant-checkout)
- [Google (2026), Universal Commerce Protocol technical overview](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/)
- [Google, UCP developer guide](https://developers.google.com/merchant/ucp)
- [OpenAI (2026), ACP-based product discovery in ChatGPT](https://openai.com/index/powering-product-discovery-in-chatgpt/)
- [Shopify (2026), agentic commerce platform and UCP](https://www.shopify.com/news/ai-commerce-at-scale)
- [Visa (2025), Trusted Agent Protocol](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html)

## 14. Final synthesis answer

An AI should be trusted to design a commercial website only when it understands commerce as evidence-constrained service design. It must know the historical reason a pattern exists, the customer problem it solves, the mechanism by which it might work, the strength and limits of the evidence, the business and operational conditions required, the customers it may exclude or harm, the law and ethical constraints, the outcomes that matter beyond conversion, and the experiment capable of falsifying the recommendation.

The accumulated lesson of online selling is not a universal layout. It is a disciplined way to reason under context and uncertainty. Search emerged because catalogs became unmanageable; trust systems because remote transactions lacked face-to-face assurance; reviews because merchant claims could not resolve experience uncertainty; recommendations because assortments exceeded human curation; mobile patterns because context and input changed; experimentation because imitation could not establish causality; and agentic protocols because complex purchasing goals increasingly cross sites and interfaces. Each solution also created new failure modes—bias, manipulation, privacy loss, fraud, lock-in and measurement myopia.

Therefore, the future AI must be a steward of informed value exchange. It should help a customer discover, understand, compare, decide, pay, receive, use, return and obtain support with the least unnecessary difficulty and the greatest truthful clarity consistent with the decision’s stakes. It should help the merchant earn durable contribution by matching real needs, not by extracting accidental clicks or coerced consent. And it must remain empirically humble: where evidence is weak or context shifts, it should propose a transparent test or request better data, not turn folklore into design law.
