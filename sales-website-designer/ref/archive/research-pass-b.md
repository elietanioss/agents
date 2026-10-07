# Gap-Filling Research Supplement: Evidence, Boundary Conditions, and Commercial Pattern Library

**Date:** 2026-08-09  
**Role/method:** research-specialist, deep-dive mode  
**Purpose:** supplement—not repeat—the material in `covered.md`, and close its largest evidentiary and coverage gaps across Parts I–LX and Deliverables 1–22.  
**Confidence gate:** 0.94. The decision is clear: establish what an eventual sales-design intelligence must know before architecture is discussed.  
**Scope constraint:** this document does **not** propose agents, software architecture, frameworks, databases, or implementation.

## Executive recommendation

Treat every commercial design choice as a conditional intervention: **customer × task × product economics × channel × device × culture × regulation × time horizon**. The existing draft correctly rejects folklore, but it makes many new assertions without citations, collapses disparate evidence types, gives only 20 patterns, and barely covers geography, accessibility, promotion incrementality, review-system validity, typography/copy evidence, or legal status. The remedy is an evidence ledger and a pattern library in which every tactic carries (1) a mechanism, (2) boundary conditions, (3) an ethics/legal check, (4) profit and customer guardrails, and (5) a test design.

The most defensible general principles are not persuasion “tricks.” They are: disclose material terms before commitment; make the total cost and next action intelligible; preserve meaningful choice; show evidence proportionate to risk; support recovery from errors; make purchase and cancellation comparably easy; ensure keyboard, screen-reader, zoom, contrast, target-size, and cognitive accessibility; and optimize contribution profit, satisfaction, and retention alongside conversion. Color meanings, fixed scan paths, “three choices,” nine-ending prices, countdowns, testimonial formats, and copy formulas remain contextual hypotheses.

## 1. Audit of what `covered.md` does and does not establish

| Requirement cluster | Existing coverage | Gap this supplement fills |
|---|---|---|
| Parts I–XII / Deliverables 1–3 | Broad chronology, mostly uncited | Separates documented milestones from causal stories; flags historical claims needing archival verification |
| Parts XIII–XIV / Deliverables 4–5 | General dual-process and bias summary | Adds meta-analyses, counterevidence, moderators, ethics, and testable hypotheses |
| Parts XV–XVIII / Deliverable 6 | Several unsupported prescriptions (for example fixed 16px and Z-pattern claims) | Replaces rules with visual-search, salience, color, typeface-congruence, readability, and narrative evidence |
| Parts XIX–XXI / Deliverables 7–8 | Short pricing/merchandising overview | Adds left-digit, round-price, partitioning, reference-price law, promotion incrementality, assortment, sorting, and discovery boundaries |
| Parts XXII–XXVI / Deliverables 9–12 | Funnel components summarized | Adds decision sequence, recommendation failure modes, cancellation/returns, post-purchase and long-term effects |
| Parts XXVII–XXXIII / Deliverable 17 | Trust/dark patterns named | Adds trust meta-analysis, review-system bias, authentic scarcity, accessibility standards, FTC/EU/OECD evidence and legal cautions |
| Parts XXXIV–XLV / Deliverable 13 | Mostly absent | Adds journey-based competitor method, traffic-intent matrix, culture/geography, and unit-economics controls |
| Parts XLVI–L / Deliverables 18–19 | High-level only | Adds test governance, forecast discipline, mature-versus-experimental AI distinctions |
| Parts LI–LX / Deliverables 14–22 | Ontology sketch; only 20 patterns; no source library | Adds 130 nonduplicate patterns, expanded ontology, evidence matrix, capability requirements, research gaps, and grouped sources |

### Historical correction ledger

The broad chronology is plausible, but statements such as “SSL was invented in 1994,” “Amazon introduced item-to-item collaborative filtering in 2003,” or a tool “proved incremental sales” require primary archival sources and more careful wording. A publication date is not necessarily an operational launch date, and adoption is not causation. In the final union report, every milestone should record: **first documented appearance; first scaled deployment; problem replaced; enabling technology; diffusion evidence; remaining necessity**. Company behavior belongs in a separate observation column from causal evidence.

The evolution map is best understood as overlapping layers, not a single replacement chain:

`catalog/navigation → secure transaction → search/facets → reputation systems → recommendation → mobile/wallets → social/creator discovery → omnichannel fulfillment → predictive personalization → generative assistance → agent-mediated discovery`

Older layers persist. Known-item search does not disappear when conversational search arrives; guest checkout does not become obsolete because wallets exist; machine-readable product facts become more—not less—important when agents summarize offers.

## 2. Evidence and verdict protocol

**Verdicts:** TRUE / MOSTLY_TRUE / PARTLY_TRUE / MOSTLY_FALSE / FALSE / UNVERIFIABLE. A verdict grades the wording of the claim, not the general topic.  
**Evidence levels:** A = meta-analysis, convergent field experiments, or binding/official standard; B = replicated experiments or strong observational/quasi-experimental evidence; C = single study or context-limited evidence; D = practitioner convention; F = folklore/contradicted.  
**Corroboration:** no claim is TRUE from one low-tier source. Numeric claims need a direct source, population, year, and design.

### Load-bearing claim matrix

| Claim | Verdict | Evidence | Boundary conditions / implication |
|---|---|---:|---|
| More options inherently reduce conversion | MOSTLY_FALSE | A | Choice-overload meta-analysis found moderators—complexity, task difficulty, preference uncertainty, and effort-minimizing goals—not a universal assortment penalty [S1]. Preserve useful variety; improve comparison and organization first. |
| Defaults influence choice | MOSTLY_TRUE | A | Meta-analytic evidence supports defaults, with effects varying by implied endorsement, switching effort, and endowment [S2]. Never use a default to conceal cost, consent, or renewal. |
| Decoys always improve tier selection | PARTLY_TRUE | B | Attraction effects exist, but magnitude and replication vary by task, similarity, and respondent attention [S3]. Test against simpler two-option and undominated sets. |
| Losses always loom larger than gains | PARTLY_TRUE | A/C | Loss aversion has substantial evidence but is not a universal psychological law; definitions and tasks matter [S4]. Do not turn the construct into fear-based copy by default. |
| “Free” is psychologically discontinuous | MOSTLY_TRUE | B | Lab/field evidence supports a zero-price effect in some choices [S5], but “free” shipping, trials, or gifts still impose business and sometimes customer costs. |
| Nine-ending prices look lower | MOSTLY_TRUE | B/A | Five experiments support the left-digit mechanism when the leftmost digit changes [S6]; scanner evidence also finds left-digit-biased demand [S7]. The effect is not a mandate for premium/luxury categories. |
| Partitioning mandatory charges can increase demand | PARTLY_TRUE | B | Consumers can underweight surcharges [S8], but hidden or late fees impair informed comparison and can violate price-transparency rules [S31]. Lead with total price. |
| Deeper promotions build loyalty | PARTLY_TRUE | A/B | Three field studies found different long-run effects for first-time versus established customers [S9]. Measure incrementality, stock-up, reference-price erosion, margin, and repeat behavior. |
| Salience can bias choice | MOSTLY_TRUE | B | Three real-food choice experiments found larger salience effects under speed and load [S10]. Salience should make a relevant action findable, not overpower material terms. |
| Users follow a universal F- or Z-pattern | MOSTLY_FALSE | C/D | Scan paths emerge from task and layout. Treat eye-tracking patterns as descriptions of tested pages, never geometric laws. Use task-based eye tracking and click/keyboard data. |
| A hue has a universal sales meaning | FALSE | A | Reviews and 30-nation evidence show both shared and culturally/linguistically shaped associations [S11–S12]. Contrast, learned brand/category meaning, and context dominate simplistic hue labels. |
| Typeface has no commercial meaning beyond legibility | MOSTLY_FALSE | B | Typeface dimensions and appropriateness change impressions and brand choice [S13–S14]. Legibility remains a prerequisite; congruence is contextual. |
| Long copy is bad | FALSE | D/F | Needed information depends on risk, involvement, expertise, and stage. Narrative effects have moderators [S15]; utilitarian decisions often need specs, comparisons, and evidence rather than a story. |
| Higher average star rating means objectively better quality | MOSTLY_FALSE | B | Across 1,272 products/120 categories, average ratings poorly converged with Consumer Reports and consumers over-relied on them [S16]. Show distribution, volume, recency, context, and text. |
| Social proof is independent evidence of quality | PARTLY_TRUE | A/B | Reviews can affect sales [S17], while a large randomized experiment shows displayed prior ratings can create herding [S18]. Reputation systems require anti-manipulation and uncertainty cues. |
| Scarcity increases purchase intention | PARTLY_TRUE | B | Limited-quantity versus limited-time effects varied with symbolic/functional brand framing [S19]. Inventory truth, persuasion knowledge, reactance, stockouts, and trust are boundaries. |
| Online trust predicts valuable outcomes | MOSTLY_TRUE | A | Meta-analysis of 150 B2C studies links trust to privacy/service antecedents and loyalty/repeat intentions, with method and site moderators [S20]. Trust is multidimensional, not a badge. |
| Accessibility is only compliance | FALSE | A | WCAG 2.2 specifies contrast, reflow, focus, targets, error prevention, and accessible authentication [S21]; DOJ explains exclusion from online goods/services [S22]. Accessibility is core transaction quality. |
| Dark patterns are harmless nudges | FALSE | A | FTC, OECD, EU law and a 399-site EU sweep document deception, impaired autonomy, and widespread potentially unlawful patterns [S23–S26]. |
| One global storefront can rely on national stereotypes | FALSE | A/B | Payment access, privacy concern, color associations, and the motivational value of personal choice vary within and between markets [S12, S27–S29]. Local evidence beats Hofstede-style inference. |

## 3. Consumer psychology and behavioral economics: decision-useful map

The useful unit is not a named “bias” but a causal chain: **stimulus → attention/interpretation → belief or affect → choice → downstream welfare/business outcome**. Record mediators and rival explanations.

| Mechanism | What evidence supports | Works best when | Failure/backfire | Ethical ecommerce hypothesis |
|---|---|---|---|---|
| Anchoring/reference dependence | Initial values shift judgments; market prices and prior paid prices also form anchors | Value is genuinely comparable and reference is credible | Experts, implausible anchors, stable known prices, fictitious MSRP | A bona fide comparable-price explanation raises price confidence more sustainably than a bare strikethrough |
| Default/status quo | Defaults change selection via effort, endorsement, and endowment [S2] | A safe, reversible, welfare-aligned option fits most users | Heterogeneous needs, paid add-ons, privacy/renewal consent | Neutral “recommended because…” plus easy switching outperforms unexplained preselection on satisfaction guardrails |
| Attraction/decoy | An asymmetrically dominated option can shift share [S3] | Attributes are comparable and target/decoy relation is noticed | Complex, high-stakes, expert or distrustful decisions | Remove dominated plans unless they convey a real segment fit; compare profit and decision confidence |
| Compromise | Middle options may reduce perceived extremeness | Ordered, interpretable attributes and uncertainty | Strong prior preferences or non-ordered attributes | Make “middle” descriptive, not falsely “most popular” |
| Choice overload | Conditional meta-analytic effect [S1] | Difficult tasks, uncertain preferences, complex sets | Experts and clear ideal points may value breadth | Guided filters should reduce decision complexity without hiding assortment |
| Zero price | Free can be valued discontinuously [S5] | The free item has clear utility and no hidden cost | Low relevance, added hassle, data/renewal costs | State the exchange: “$0 today; renews at X on date Y” |
| Goal gradient/progress | Effort can accelerate near an endowed or visible goal | A real attainable threshold with feedback | Remote or moving goals, manipulated progress | Use truthful shipping/loyalty progress and disclose margin/expiry implications |
| Mental accounting | Consumers separate budgets and gains/losses | Categories and payment timing are salient | Categories differ by person; framing can obscure total cost | Show total and periodic costs together; let users change cadence |
| Present bias | Immediate benefits/costs overweighted | Delayed payoff or payment | Stakes, financial literacy, commitment mechanisms | BNPL and subscriptions need total cost and schedule prominence |
| Price-quality inference | Price is a cue when quality is hard to observe | Experience/credence goods and low knowledge | Strong objective quality information or bargain positioning | Pair price with substantiated quality evidence, not vague luxury typography |
| Scarcity/anticipated regret | Scarcity can increase competition and urgency [S19] | Inventory/deadline is real, relevant and verifiable | Repeated timers, commoditized substitutes, reactance | Show “3 in this warehouse” only from inventory truth; remove when stale |
| Social proof/informational influence | Others’ outcomes reduce uncertainty; ratings also herd [S17–S18] | Similar reviewers and uncertain experience goods | Experts, identity mismatch, manipulated or weak samples | Show review context and uncertainty; never fabricate counts |
| Authority | Expertise can reduce epistemic uncertainty | Credential is relevant, current and independently verifiable | Celebrity/category mismatch, paid connection hidden | Link credential scope and material connection |
| Reciprocity | Gifts may increase felt obligation | Genuine, unconditional, useful value | Obvious quid pro quo or unwanted samples | Separate gift from forced lead capture or positive-review condition |
| Commitment/consistency | Prior active commitments can shape later action | User-created goals/wishlists | Coerced micro-commitments, sunk-cost exploitation | Make saved preferences editable and deletable |
| Fluency/familiarity | Easier processing can increase liking [S30] | Routine evaluation and clear conventions | Fluency can make false claims feel true; experts need detail | Improve legibility and structure, then substantiate claims |
| Reactance/persuasion knowledge | Recognition of manipulation can trigger resistance | High-pressure or repeated prompts | Low awareness can mask short-run harm | Frequency-cap prompts; make decline equal and persistent |
| Endowment/ownership imagery | Psychological ownership can increase valuation | Configurators, saved designs, trial use | Return friction, coercive sunk cost | Let users export/delete configurations; keep returns unaffected |
| Peak-end | Memory can overweight intense/end moments | Service recovery and delivery/onboarding | Not a substitute for average journey quality | Design confirmation and recovery well, while monitoring whole journey |

**Missing decision modes:** The final knowledge base should explicitly distinguish replenishment, emergency, gifting, professional procurement, luxury signaling, beginner learning, expert comparison, bargain hunting, hedonic browsing, and high-risk credence purchases. Each changes evidence order. Emergency purchase prioritizes availability and delivery certainty; gifting prioritizes recipient fit, presentation, and returns; expert procurement prioritizes compatible specifications and auditability; luxury prioritizes provenance, control, scarcity authenticity, and brand coherence; replenishment prioritizes recognition, cadence and fast reorder.

## 4. Visual attention, color, typography, imagery, and copy

### Visual-attention principles

1. **Top-down goals usually outrank decorative salience.** A shopper looking for compatibility, delivery, or price will scan for learned labels. Put decision-critical information under conventional, descriptive headings.
2. **Bottom-up salience changes which candidate is sampled first**, especially under speed or load [S10]. Use contrast, scale, whitespace, position, and motion to reveal the correct next action and errors—not to hide alternatives or cancellation.
3. **Hierarchy is relational.** A red button on a red page is not salient; a muted control in an isolated location may be. Test luminance contrast and competing elements, not hue names.
4. **Clutter is task-relative.** High density can aid expert comparison if attributes align; low density can frustrate when it forces memory across screens. Measure time-to-answer, comparison accuracy, error, and confidence.
5. **Animation has an attentional tax.** Reserve motion for state change or causal explanation; respect `prefers-reduced-motion`; do not let carousels advance while a user reads.
6. **Faces and gaze are conditional cues.** They can attract attention, but a face may compete with product evidence; inferred gaze effects do not guarantee CTA clicks. Test product comprehension and recall, not eye position alone.
7. **“Above the fold” is an opportunity, not a border.** The opening viewport should identify relevance, value, and the path to evidence. Long pages can work when scent and sequencing justify scrolling.

### Color evidence and accessibility

Color can signal state, category, brand, and priority, but the evidence does not justify `red=urgency`, `blue=trust`, or `green=nature` globally [S11–S12]. Record hue, saturation, luminance, adjacent colors, display/device, ambient light, learned category meaning, and culture. Never rely on color alone for errors, stock, selected variants, price change, or focus. WCAG 2.2 requires at least 4.5:1 for normal text and 3:1 for large text, subject to defined exceptions [S21]; legal conformance depends on jurisdiction and context, so “WCAG AA” is not a universal legal safe harbor.

### Typography and numerical presentation

Typeface communicates impressions through dimensions such as weight, compression, harmony, flourish, and naturalness [S13]. Congruent type can improve brand choice [S14], but decorative distinctiveness must not impair text recognition, numeral differentiation, zoom, or language coverage. There is no universal empirical rule that all ecommerce body text must be exactly 16px or line-height 1.4–1.6. Use responsive testing with actual fonts, scripts, viewport, zoom and low vision. Support tabular numerals in comparison tables where alignment matters; show currency, billing cadence, taxes/fees and accessible names. A smaller printed price is not ethically acceptable if it hides total cost.

### Copy and information length

AIDA, PAS, “features → benefits,” awareness stages, and benefit ladders are useful practitioner heuristics, not general causal laws. Evidence is stronger for comprehensibility, relevant claim substantiation, source credibility, and narrative transportation under moderators [S15, S30]. Copy length should be the minimum that answers the decision’s material questions:

| Decision | Lead with | Then supply | Avoid |
|---|---|---|---|
| Known-item/replenishment | Exact identity, fit, stock, delivered price/date | Quantity/cadence, reorder controls | Long story before purchase facts |
| Complex technical | Use case and compatibility | Aligned specs, comparison, evidence, warranty | Benefit-only prose that hides constraints |
| New DTC/high uncertainty | Outcome and mechanism | Demonstration, provenance, reviews, returns | Unsupported superlatives and generic “science-backed” claims |
| Luxury | Provenance, craft, identity, control | Materials, service, authenticity, delivery | Constant discounting and fake scarcity |
| Subscription/SaaS | Job, eligible user, total economics | Limits, renewal, cancellation, migration/security | Monthly-only framing without annual total |
| Gift | Recipient fit and occasion | Delivery cutoff, gift receipt, exchanges | Personalization that reveals recipient data |

## 5. Pricing, promotion, and digital merchandising

### Price presentation

- **Left-digit/charm pricing:** supported in specific comparisons [S6–S7]; use as a value-positioning hypothesis, not a universal conversion law. Measure margin, brand-quality perception, and return-adjusted revenue.
- **Round pricing:** may better fit emotional or prestige evaluation; precise prices may cue calculation or cost basis. Category meaning and currency conventions moderate both.
- **Reference price:** state what the reference is (former price, MSRP, competitor, bundle sum) and maintain proof. U.S. FTC guides describe bona fide former-price conditions [S32]; EU discount rules can differ. Never manufacture a high reference.
- **Discount format:** percentage versus currency saving depends on price magnitude, numeracy, and familiarity. Always show final price; consider both saving forms only if clarity improves.
- **Partitioning:** can reduce perceived cost by underweighting surcharges [S8]. That is a harm signal, not a design goal. Present unavoidable total price early; separately explain optional components.
- **Installments/BNPL:** display number, amount, dates, total paid, interest/fees, late consequences, eligibility and returns interaction. “Only X/month” alone is incomplete.
- **Subscriptions:** show recurring price and cadence adjacent to CTA, renewal date at confirmation, and an easy cancellation path. Trials must show when and how billing begins.

### Promotion incrementality

Promotion evaluation must distinguish **persuaded purchase, timing acceleration, quantity stock-up, channel shift, product cannibalization, and subsidy to would-have-bought customers**. The core measure is incremental contribution profit, not redemption or conversion. Field evidence shows promotion depth can have opposite long-run effects for new and established customers [S9]. Use customer-level holdouts where feasible; track post-promotion repeat, returns, service cost, and reference-price expectations.

### Merchandising logic

Assortment size is not itself the problem. Design should reduce comparison complexity through taxonomy, attribute alignment, filters with counts, reversible sorting, inventory-aware ranking, and explanations. Merchandising objectives conflict: relevance, margin, inventory health, novelty, diversity, supplier obligations, brand exposure and customer welfare. Paid placement must be labeled. Ranking should not quietly bury cheaper or accessible alternatives. Recommenders need complement/substitute separation: a substitute helps choose; a complement expands the basket; an accessory must be compatible; replenishment depends on consumption timing; “complete the look” is aesthetic and culturally/category dependent.

## 6. Social proof, urgency, trust, privacy, accessibility, and law

### Reputation-system design

Average stars are a noisy, path-dependent summary, not objective quality [S16, S18]. Preserve: rating distribution; count; recency; verified transaction/experience definition; variant purchased; use context; incentives/material connection; review text and media; helpfulness; response from merchant; moderation policy; and uncertainty for small samples. Do not suppress negative sentiment, condition incentives on positivity, or generate synthetic testimonials. The FTC’s Consumer Reviews and Testimonials Rule took effect in 2024 and addresses fake/false reviews, sentiment-conditioned incentives, undisclosed insider reviews, suppression, controlled “independent” sites, and fake social indicators [S33]. Apply jurisdiction-specific counsel.

### Trust is earned evidence

Trust signals should answer a concrete risk: seller identity, product authenticity, payment security, delivery, fit, performance, data use, returns, warranty, or recourse. A meta-analysis across 150 studies supports privacy and service-quality antecedents but also strong moderators [S20]. Payment logos or generic shields can add clutter or appear counterfeit. Prefer operational evidence: legal identity and contact, dated delivery promise, complete total price, accessible policies, authenticated reviews, warranty scope, support hours, secure payment flow, and consistent fulfillment.

### Authentic urgency standard

An urgency claim requires a truth source and expiry behavior. Inventory count must map to salable stock and reservation rules; delivery cutoff to carrier/service capacity; offer timer to a real offer end; limited edition to a defined quantity. Once expired, price/availability must change as stated. Persist and audit the claim across device/session. False countdowns were a focus of the EU 2022 sweep [S26]. Even truthful urgency should be frequency-capped and tested for reactance, cancellation, returns and trust.

### Accessibility as commercial infrastructure

The checkout must work using keyboard only and screen readers; focus must be visible and unobscured; labels must remain programmatic; error messages must identify field and remedy; authentication should not depend only on memory puzzles; drag interactions need alternatives; content must reflow and zoom; controls need adequate target size; timeouts need warning/extension; media needs alternatives; and status changes need announcements [S21]. Automated scanners are insufficient; DOJ recommends pairing tools with manual checking [S22]. Test purchasing, applying a coupon, changing quantity, recovering payment failure, downloading receipt, tracking, returning and cancelling with assistive technology.

### Ethics/legal boundary matrix

| Practice | Persuasive if | Manipulative/deceptive when | Safer control |
|---|---|---|---|
| Default | Welfare-aligned, explained, reversible | Paid/privacy/renewal option is preselected or obscured | Neutral state or explicit informed choice |
| Scarcity | Verifiable stock/deadline | Counter resets or claim persists after expiry | Truth source, expiry audit, no reset |
| Social proof | Real, representative, connections disclosed | Fabricated, suppressed, bought-positive, or falsely “independent” | Provenance and moderation ledger |
| Reference price | Bona fide and defined | Inflated/artificial/irrelevant comparator | Price-history evidence and label |
| Personalization | Consented, expected, useful, controllable | Sensitive inference or opaque vulnerability targeting | Explain “why shown,” minimize data, opt out |
| Subscription | Recurrence and cancellation are salient | Trial rollover hidden or exit obstructed | Symmetric signup/cancel effort |
| Visual hierarchy | Clarifies material action and alternatives | Decline/cheaper choice made hard to perceive | Comparable prominence for consequential choice |
| Recommendation | Relevance and commercial influence explained | Sponsored placement disguised as organic | Label sponsorship and rationale |
| Gamification | Progress reflects real customer benefit | Variable rewards or streak loss exploits compulsion | Spend/time caps and quiet mode |

The FTC describes dark patterns as interfaces that trick or manipulate choices [S23]; the OECD documents consumer detriment [S24]; DSA Article 25 prohibits specified deceptive/manipulative interface practices for covered platforms [S25]. The 2022 EU sweep found one of three examined dark-pattern categories on 148 of 399 sites [S26]. These are regulatory facts, not proof that every instance is illegal in every jurisdiction. Maintain a jurisdiction/date/status field and legal review.

## 7. Culture, geography, device, traffic source, and business model

Do not map continents to fixed psychology. Region is a prior for research—not a customer attribute to infer blindly. Within-country language, income, age, urbanization, diaspora, payment access, platform habit, disability, and category often matter more. The World Bank’s Findex documents large changes and regional differences in digital payment use [S27]; GSMA documents mobile-money concentration and growth [S34]. Jonauskaite et al. show both shared and nation-predictive color associations [S12]. Iyengar and Lepper show that personal choice’s motivational effect differed between sampled American independent and Asian interdependent selves [S28], not that every Asian shopper prefers family choice.

| Market research lens | North America | Europe | Middle East/Gulf | East Asia | South Asia | Southeast Asia | Latin America |
|---|---|---|---|---|---|---|---|
| Validate, don’t assume | State/province price, privacy and subscription law; wallet/card mix | GDPR/ePrivacy, UCPD/DSA scope, local price-display/returns rules | Arabic/English directionality, COD/wallet/card mix, address/delivery and seller legitimacy | Super-app/marketplace and wallet expectations; dense discovery may be learned | UPI/wallet/COD and bandwidth/device diversity; multilingual scripts | Marketplace, social/live commerce, wallet/bank/COD and island logistics | Local instant payments/cards/COD, installments, cross-border duties and delivery |
| Trust study | Returns, delivery, reviews, fraud | Data use, trader identity, total price, withdrawal | Merchant identity, local support, delivery certainty, authenticity | Platform guarantees, seller reputation, livestream/peer proof | Payment confirmation, returns, authenticity, support | Seller/platform reputation, chat, fulfillment | Installments, delivery, duties, local support |
| Mandatory experiment | State-level total-price comprehension | Consent symmetry and localized legal text | RTL/LTR mixed checkout and address entry | Search density versus guided discovery | Low-bandwidth and multilingual checkout | Chat-assisted versus self-serve | Total installment/duty comprehension |

**Localization means operational fit:** language and script; name/address/phone formats; currency/decimal conventions; tax/duty; payment authentication; delivery geography; return channel; support hours; imagery and sizing; legal disclosures; and locally representative usability samples. Translation alone is inadequate.

Traffic source changes the initial question. Branded search needs rapid confirmation and navigation; non-branded search needs category fit and comparison; shopping ads need exact price/variant continuity; social/creator traffic needs claim continuity, source disclosure and fast orientation; email/SMS needs offer/account continuity; QR/offline needs context and mobile resilience; marketplace traffic needs seller differentiation without assuming brand familiarity. Preserve message scent and never change material terms across channel.

Business model changes the optimization target: marketplaces balance buyer/seller liquidity and trust; DTC balances acquisition payback and brand; luxury protects scarcity/provenance and service; discount retail prioritizes price confidence and availability; subscriptions require retention and cancellation fairness; SaaS/B2B require stakeholder, security, migration and procurement evidence; travel/booking requires availability, total mandatory charges, cancellation and date risk; financial/health products require heightened substantiation and regulatory review.

## 8. Funnel, sequencing, recommendations, retention, analytics, and experimentation

### Psychological question sequence

The general sequence is not a fixed page order. It is a dependency graph: **relevance → comprehension → differentiated value → evidence → fit/availability → total economics → risk/recourse → action**. Low-risk replenishment compresses it; high-risk products expand and revisit it. Price can appear early while deeper justification follows. Hiding price until after persuasion creates uncertainty and can exclude budget-constrained users.

Product pages should place variant-dependent price, availability, delivery and compatibility near the selector/CTA; evidence should be adjacent to the claim it substantiates; returns/warranty summaries should link to full terms; media should answer scale, texture, operation and context; reviews need filters by variant/use; sticky CTAs must preserve selected state and not cover content. Cart recommendations should be low-complexity, compatible, margin-aware and removable. Checkout is primarily completion and error recovery; high-cognitive-load cross-sells generally belong earlier or after payment and require testing.

Post-purchase design should first confirm success: order identifier, exact items/price, delivery, payment, receipt, support and change/cancel rules. Upsells must not obscure confirmation. Retention should be earned through product success, onboarding, service, replenishment timing and transparent loyalty—not forced continuity. Track delayed cancellation, refund, support, repeat contribution and complaint rate.

### Measurement portfolio

Primary decision metric: **incremental contribution profit per eligible visitor/customer**, with guardrails for total price comprehension, task success, errors, accessibility, latency, cancellation, refunds/returns, complaints, delivery failure, repeat purchase, churn, brand/trust and customer-support load. Recommendation measurement must include eligible impressions, coverage, diversity, novelty, compatibility errors, click, add, attach, incremental basket profit and cannibalization. Search needs zero-results, reformulation, time-to-product, result relevance, filter use, abandonment and conversion conditional on intent.

Heatmaps describe aggregated interaction, not cognition. Scroll depth does not prove reading; repeated clicks may be confusion; attention maps built from mouse movement are proxies. Combine event logs with task testing, interviews, accessibility tests and controlled experiments.

### Experiment governance

Pre-register unit, population, intervention, primary metric, minimum detectable effect, sample size/power, duration, exclusion, multiple-testing control and guardrails. Check sample-ratio mismatch, instrumentation, carryover, novelty, seasonality, interference and peeking. Use persistent holdouts for promotion/personalization and long-term brand/retention effects. Segment only with pre-specified hypotheses or correction; a winning average can harm vulnerable or high-value groups. Do not ship an accessibility or deception regression because a short-run conversion metric rose.

## 9. AI-era commerce and 2026–2030 forecast discipline

**Mature enough for bounded use:** semantic retrieval/reranking; structured attribute extraction with verification; review summarization with citations; conversational query reformulation; customer-service drafting with human escalation; image tagging; catalog enrichment with validation.  
**Promising but context-limited:** multimodal compatibility assistance, generative comparison, session recommendations, localized guided selling, virtual try-on where calibrated error and representation are disclosed.  
**Experimental/high-risk:** autonomous price discrimination, psychological vulnerability targeting, fully generated product claims, unsupervised dynamic UI, autonomous negotiation, synthetic-user-only research, self-optimizing dark-pattern discovery, and agent-to-agent purchase without verifiable authority/consent.

Forecasts, not facts: machine-readable offer identity, provenance, price, availability, shipping, returns and warranty will gain importance; conversational discovery will supplement rather than eliminate navigation; buyer agents may increase price/term comparability; generated storefront components will require stronger consistency, accessibility, evidence provenance and policy constraints. Forecast confidence is medium because standards, liability, consumer adoption, merchant incentives and model reliability remain unsettled.

## 10. Digital-sales ontology extension and capability requirements

Add the following entities and relations to the existing sketch:

- **Evidence** `supports/contradicts` Claim; has design, sample, geography, year, quality, replication, uncertainty.
- **Claim** `appears_in` Copy/Media/Badge; has substantiation requirement and jurisdiction.
- **Customer context** includes task, expertise, accessibility need, language/script, device/network, channel, consent, lifecycle—not inferred sensitive traits.
- **Offer** has total price, cadence, eligibility, inventory truth, expiry truth, delivery, cancellation, returns, warranty and sponsorship.
- **Pattern** uses mechanism; answers customer question; targets metric; creates risk; has boundary condition; is tested by Experiment.
- **Recommendation** has relationship type (substitute/complement/accessory/replenishment/style), compatibility, rationale, commercial influence and confidence.
- **Outcome** spans immediate behavior, profit, welfare, trust, retention, complaint and accessibility.
- **Law/standard** has jurisdiction, scope, effective/status date, prohibited conduct and review date.

The eventual intelligence therefore needs knowledge and evaluation capability for: evidence retrieval and grading; historical provenance; customer/task research; catalog and compatibility reasoning; total-price and unit-economics analysis; visual hierarchy and multilingual typography; accessibility; claims substantiation; trust and reputation systems; promotion incrementality; recommendation type and cannibalization; journey-based competitor observation; experimentation/statistics; analytics quality; privacy/security/fraud friction; jurisdiction-aware consumer protection; cultural localization; long-term brand/retention effects; and uncertainty reporting. These are requirements only, not architecture.

## 11. Master sales-pattern library supplement (patterns 21–150)

These 130 entries deliberately do not repeat the 20 patterns in `covered.md`. Together they meet the required minimum of 150. **Row schema:** history/where/stage; customer and business mechanism; best uses; failure/boundary/ethical risk; evidence; example; metrics/test; related patterns. Evidence A/B/C/D/F follows Section 2. Brand names are not evidence; examples describe pattern types, not endorsements.

### Discovery, assortment, search, and product pages (21–55)

| ID / pattern | History, placement, stage | Mechanism and best use | Boundary, risk, evidence | Metric/test; related |
|---|---|---|---|---|
| 21 Breadcrumb hierarchy | Early catalog convention; category/PDP; orientation | Recognition and backtracking; deep taxonomies | Weak for shallow/single-product stores; D usability | Backtrack success, category continuation; 22, 24 |
| 22 Descriptive mega menu | 2000s large catalogs; header; discovery | Externalizes taxonomy and exposes breadth | Mobile crowding, jargon, inaccessible hover; D | Findability/task time by expertise; 21, 23 |
| 23 Scoped category search | Large catalogs; header/category; known item | Reduces candidate set and query ambiguity | Wrong default scope hides items; C/D | Search success, scope changes; 26, 29 |
| 24 Faceted filtering with counts | 2000s search retail; listing; evaluation | Progressive constraint and outcome preview | Empty sets, excessive facets, inaccessible controls; B/D | Time-to-fit, zero set, conversion; 25, 30 |
| 25 Applied-filter chips | Modern responsive listings; evaluation | Makes state visible and reversible | Chips overflow or lack accessible names; D | Filter undo, abandonment; 24 |
| 26 Query autocomplete | 2000s search; header; discovery | Recognition, spelling support, intent prediction | Popularity bias, sensitive-query leakage; B/D | Query success, reformulation; 27, 28 |
| 27 Typo-tolerant retrieval | Search engines; search; discovery | Error recovery | False corrections for SKUs/brands; B/D | No-result rate, correction precision; 26 |
| 28 Semantic query rewrite | 2020s; search/assistant; discovery | Maps natural language to catalog attributes | Hallucinated constraints or erased intent; C | Retrieval relevance by query class; 26, 29 |
| 29 Search rationale / matched terms | 2020s explainable retrieval; results; evaluation | Calibrates trust and correction | False explanation or clutter; C | Correction, confidence, bad-click rate; 28, 40 |
| 30 Result-set comparison tray | Mature ecommerce; listing; evaluation | Aligns attributes, reduces memory load | Too many items/attributes; D/B | Comparison completion, choice confidence; 24, 44 |
| 31 Sort by delivered price | Comparison retail; listing; evaluation | Makes economic ranking explicit | Tax/shipping uncertainty; B/D | Sort use, total-price comprehension; 96 |
| 32 Relevance-sort explanation | Algorithmic retail; listing; discovery | Reveals ranking signals and control | Gaming, vague claims, sponsored contamination; C | Trust, alternative-sort use; 33, 128 |
| 33 Sponsored-placement label | Search/marketplaces; listing; discovery | Separates commercial influence from relevance | Low contrast or ambiguous “featured”; A/regulatory | Label comprehension; 32, 128 [S23] |
| 34 Diversity-aware carousel | Recommender era; home/listing; exploration | Avoids near-duplicate tunnel and covers intents | Lower short-run CTR; C/B | Coverage, diversity, downstream profit; 123 |
| 35 Recently viewed with privacy control | Personalization era; global; revisit | Recognition and memory aid | Shared-device embarrassment/creepiness; C/D | Revisit conversion, hide/delete use; 129 |
| 36 New-arrival module | Catalog merchandising; home/category; exploration | Novelty and temporal relevance | Constant churn, low evidence of quality; D | New-item discovery and returns; 37 |
| 37 Bestseller module with definition | Social-commerce era; home/category; evaluation | Reduces uncertainty through aggregate choice | Self-reinforcing exposure, undefined window; B/C | New-user lift, concentration, return rate; 34, 72 |
| 38 Availability-aware ranking | Omnichannel era; listings; discovery | Avoids dead-end choice | Can bury preferred but backorderable items; D | Out-of-stock click loss; 83 |
| 39 Beginner/expert view toggle | Guided commerce; category/PDP; evaluation | Matches information density to expertise | Misclassification or duplicated maintenance; C | Task accuracy by expertise; 44, 48 |
| 40 Recommendation reason | Modern recommender; cards/PDP; evaluation | Gives relevance cue and correction path | Post-hoc or sensitive inference; C | Acceptance, correction, trust; 29, 126 |
| 41 Product-card unit price | Grocery/consumables; listing; evaluation | Normalizes quantity comparison | Unit inconsistency or unreadable secondary text; A/D | Cheapest-choice accuracy, margin; 93 |
| 42 Variant swatches with text names | Fashion; listing/PDP; evaluation | Preview without navigation | Color-only selection, image mismatch; A/accessibility | Variant errors, keyboard completion; 85 |
| 43 Quick view | 2010s grids; listing; evaluation | Preserves context while adding facts | Modal accessibility, incomplete terms; D | PDP avoidance versus errors; 50 |
| 44 Attribute-aligned comparison table | Durable/technical goods; evaluation | Reduces cognitive load and supports experts | Cherry-picked rows, mobile reflow; B/D | Comparison accuracy/confidence; 30, 45 |
| 45 Difference-only comparison | Modern tables; evaluation | Focuses diagnostic attributes | Hides shared essentials; C/D | Time and missed-constraint rate; 44 |
| 46 Compatibility checker | Electronics/parts; PDP; evaluation | Risk reduction and error prevention | Stale catalog mapping; B/D | Compatibility returns, false matches; 124 |
| 47 Size/fit estimator with uncertainty | Apparel; PDP; evaluation | Converts body/product data to fit probability | Sensitive data, biased model, false certainty; C | Fit returns, calibration by group; 86 |
| 48 Specification progressive disclosure | Technical PDP; evaluation | Manages density while preserving facts | Critical details hidden under vague labels; B/D | Findability and comprehension; 39, 44 |
| 49 Evidence-adjacent claim | Direct response/PDP; evaluation | Reduces source-memory gap | Badge theatre or irrelevant citation; B | Claim recall/credibility; 63, 68 |
| 50 Media gallery by customer question | Broadband/mobile PDP; evaluation | Answers appearance, scale, operation, context | Decorative redundancy and load time; C/D | Media task success, performance; 51–54 |
| 51 In-scale product image | Catalog/PDP; evaluation | Reduces size uncertainty | Misleading perspective; B/C | Size-related returns; 50 |
| 52 Product-in-use demonstration | TV shopping/video commerce; PDP; evaluation | Causal/mechanism evidence | Staged conditions or unrepresentative user; B/C | Comprehension, expectation gap; 50, 63 |
| 53 Detail/zoom image | Broadband PDP; evaluation | Material/finish inspection | Artificial retouching, mobile gesture issue; D | Zoom use, quality returns; 50 |
| 54 Accessible video transcript/captions | Video commerce; PDP; evaluation | Multimodal access and searchable facts | Auto-caption errors; A/accessibility | Completion and comprehension; 50 [S21] |
| 55 Virtual try-on with limitation disclosure | AR era; PDP; evaluation | Simulates ownership/fit | Calibration, skin/body bias, privacy, false realism; C | Error calibration, returns by group; 47 |

### Proof, trust, risk, and urgency (56–80)

| ID / pattern | History, placement, stage | Mechanism and best use | Boundary, risk, evidence | Metric/test; related |
|---|---|---|---|---|
| 56 Rating distribution histogram | Review era; PDP; evaluation | Shows variance hidden by mean | Small samples and selection bias remain; B | Distribution use, confidence; 57, 72 [S16] |
| 57 Review count plus uncertainty cue | Review era; cards/PDP; evaluation | Calibrates sample evidence | Count is not representativeness; B | Choice accuracy under sample sizes; 56 |
| 58 Review recency filter | Mature UGC; PDP; evaluation | Detects product/service drift | Can overvalue noise; C/D | Filter use, return/complaint prediction; 59 |
| 59 Variant/use-case review filter | Mature UGC; PDP; fit evaluation | Increases reviewer relevance | Sparse cells, privacy; C | Helpful votes, fit returns; 58 |
| 60 Verified-experience definition | Marketplace era; PDP; trust | Clarifies provenance | “Verified” can mean only transaction; B/regulatory | Label comprehension; 61, 62 |
| 61 Incentivized-review disclosure | Influencer/UGC; review; trust | Reveals material connection | Low-salience disclosure; A/regulatory | Disclosure recall; 60 [S33] |
| 62 Review moderation policy link | Platform governance; reviews; trust | Explains inclusion/removal | Policy differs from practice; A/D | Suppression complaints/audits; 60 [S33] |
| 63 Substantiated expert endorsement | Advertising/PDP; evaluation | Relevant authority reduces uncertainty | Credential mismatch or undisclosed payment; B/regulatory | Credential comprehension; 49 |
| 64 Merchant response to negative review | Marketplace/service; PDP; trust | Demonstrates recovery and accountability | Defensive canned reply; C/D | Recovery perception, support demand; 58 |
| 65 Seller identity panel | Marketplace/cross-border; PDP/checkout; trust | Identifies counterparty and recourse | Platform/merchant confusion; A/D | Seller-identification accuracy; 66 |
| 66 Contact and support availability | Early ecommerce onward; global; trust | Reduces recourse uncertainty | Dead channels or hidden hours; B/D | Contact success, pre-sale support conversion; 65 |
| 67 Delivery-date promise with basis | Logistics era; PDP/cart; risk | Resolves availability/time risk | Uncalibrated promise; B/D | On-time rate, cancellation; 83 |
| 68 Return-summary near CTA | DTC/PDP; risk | Risk reversal with material terms | “Free returns” exclusions hidden; B/D | Policy comprehension, return-adjusted profit; 69 |
| 69 Full return-cost estimator | Cross-border/large goods; PDP/cart; risk | Makes recourse economics concrete | Location/condition uncertainty; C/D | Purchase and surprise-return complaints; 68 |
| 70 Warranty scope matrix | Durables; PDP; evaluation | Clarifies duration, actor, exclusions | “Lifetime” ambiguity; D/regulatory | Claim comprehension, warranty contacts; 63 |
| 71 Authenticity/provenance chain | Luxury/marketplaces; PDP; trust | Reduces counterfeit uncertainty | unverifiable blockchain theatre; C/D | Verification use, counterfeit claims; 65 |
| 72 Balanced review excerpt set | Review era; PDP; evaluation | Represents benefits and drawbacks | Cherry-picking; B/regulatory | Representativeness audit; 56, 62 |
| 73 Customer-Q&A with answered status | Web 2.0; PDP; evaluation | Resolves long-tail uncertainty | Stale/community misinformation; C/D | Answer latency, deflection, returns; 64 |
| 74 Real inventory count | Retail systems; PDP/cart; urgency | Scarcity and planning | Stale/reserved stock, pressure; B | Accuracy, trust, stockout cancel; 75 [S19] |
| 75 Inventory confidence / “low stock” rule | Modern inventory; PDP; urgency | Communicates uncertainty | Arbitrary threshold masquerades as exact truth; C/D | Alert precision, reaction, trust; 74 |
| 76 Genuine offer-expiry timestamp | Promotions; PDP/cart; urgency | Temporal planning and regret reduction | Resetting/persistent deal is deceptive; A/B | Expiry audit, long-term trust; 77 [S26] |
| 77 Delivery cutoff with timezone | Omnichannel; PDP/cart; urgency | Makes logistics deadline actionable | Does not guarantee delivery; D | Cutoff comprehension/on-time; 67 |
| 78 Reservation-window indicator | Ticketing/travel/drops; cart; completion | Coordinates scarce inventory | Excessive pressure/inaccessible timeout; A/D | Timeout recovery, completion, fairness; 79 |
| 79 Timeout extension and warning | Security/accessibility; checkout; completion | Prevents loss and supports cognitive/motor needs | Inventory constraints require explanation; A | Timeout failures; 78 [S21] |
| 80 Price-history/context link | Regulated discounting; PDP; evaluation | Lets user assess reference price | Data window selection; A/C | Reference comprehension, audit; 94 [S32] |

### Cart, checkout, payment, accessibility, and security (81–110)

| ID / pattern | History, placement, stage | Mechanism and best use | Boundary, risk, evidence | Metric/test; related |
|---|---|---|---|---|
| 81 Editable cart summary | Shopping-cart era; cart/checkout; completion | Control, recognition, error correction | Tiny edit links/context loss; A/D | Item/variant error recovery; 82 |
| 82 Save-for-later with clear state | Mature carts; cart; evaluation | Defers without destructive loss | Account coercion/privacy; C/D | Save return rate, cart clarity; 81 |
| 83 Delivered-date/stock refresh in cart | Logistics era; cart; completion | Revalidates changing promise | Silent changes undermine trust; B/D | Change notice comprehension, cancellation; 67 |
| 84 Coupon field de-emphasis plus automatic best price | Coupon era; cart; completion | Reduces “missing deal” search | “Best” logic opaque; C/D | Exit-to-search, savings accuracy; 95 |
| 85 Variant persistence across sticky CTA/cart | Mobile era; PDP/cart | Prevents wrong-size/color purchase | Stale selection; D | Variant corrections/returns; 42 |
| 86 Size-exchange shortcut | Apparel; post-cart/account; recovery | Lowers return friction, preserves relationship | Stock unavailable or fee hidden; D | Exchange completion, refund avoided; 47 |
| 87 Guest-first checkout entry | 2000s checkout; completion | Avoids account commitment | Some regulated/B2B cases need identity; B/D | Start-to-complete by new user; 88 |
| 88 Optional account after purchase | Modern checkout; confirmation; retention | Earns account with saved order benefit | Prechecked marketing/weak password flow; C/D | Account adoption and consent quality; 87 |
| 89 Address autocomplete with manual override | Mobile/maps era; checkout | Entry efficiency and error reduction | Rural/local-format failures, third-party data; B/D | Deliverability, correction rate; 90 |
| 90 Locale-aware address form | Global commerce; checkout | Matches postal reality | Country stereotypes/stale schema; A/D | Delivery failure by locale; 89 |
| 91 Input-purpose/autocomplete semantics | HTML/mobile; checkout | Browser/assistive entry support | Wrong token exposes data; A | Completion/time/accessibility; 89 [S21] |
| 92 On-submit error summary plus inline link | Accessible forms; checkout; recovery | Directs focus to fixable errors | Color-only/vague message; A/B | Error recovery and abandonment; 91 [S21] |
| 93 Order total with unit/quantity math | Cart/checkout; evaluation | Supports arithmetic and error spotting | Promotions/tax ambiguity; A/D | Total comprehension; 41, 96 |
| 94 Bona fide previous-price label | Catalog/promo; PDP/cart | Credible reference saving | Fictitious former price; A/B | Audit, trust, margin; 80 [S32] |
| 95 Automatically applied eligible promotion | Modern commerce; cart | Fairness and reduced code friction | Excludes segments silently; C/D | Eligible uptake, support complaints; 84 |
| 96 Upfront unavoidable total price | Catalog law → digital; listing/PDP/checkout | Comparison and informed choice | Dynamic taxes may require range/explanation; A | Total-price recall, checkout shock; 31 [S31] |
| 97 Shipping-option tradeoff table | Checkout; completion | Aligns price/date/footprint | Default hides slower/cheaper option; C/D | Option comprehension and on-time rate; 98 |
| 98 Shipping default with rationale | Checkout; completion | Reduces effort if welfare aligned | Paid fast shipping preselection; A/B | Switch rate, satisfaction; 97 [S2] |
| 99 Wallet with fallback | Mobile era; checkout | Reduces typing/tokenizes payment | Device/browser limits and express bypass of review; B/D | Completion, wrong-address edits; 100 |
| 100 Payment-method localization | Global ecommerce; checkout | Fits access and learned trust | Excess choices/unsupported refunds; B/D | Success/refund by method/market; 99 [S27] |
| 101 Installment total-cost disclosure | BNPL era; PDP/checkout | Makes intertemporal cost comparable | “Only/month” obscures total/fees; A/B | Schedule comprehension, delinquency complaints; 102 |
| 102 Subscription cadence/renewal disclosure | Subscription era; PDP/checkout | Informed recurring choice | Hidden rollover/annual total; A | Recall, cancellation, chargebacks; 103 [S23] |
| 103 Symmetric online cancellation | Subscription account; retention | Autonomy and trust | Roach motel/forced call; A | Time/clicks to cancel, complaints; 102 [S23–S25] |
| 104 Cancellation consequence preview | Subscription/account; retention | Prevents accidental data/benefit loss | Fear copy or repeated save screens; C/D | Completion accuracy and regret; 103 |
| 105 Payment-failure recovery preserving cart | Checkout; recovery | Reduces rework and uncertainty | Duplicate charges or unsafe retry; B/D | Recovery/duplicate rate; 106 |
| 106 Idempotent order-status feedback | Modern payments; checkout; recovery | Prevents double submission | Technical state mislabeled; A/D | Duplicate orders, support; 105 |
| 107 Risk-based authentication step-up | Fraud/security; checkout | Adds friction only when risk warrants | Model bias, inaccessible OTP, false declines; B | Fraud, approval, challenge by group; 108 |
| 108 Alternative accessible authentication | WCAG 2.2; account/checkout | Avoids cognitive-function tests only | Security downgrade; A | Completion by assistive need; 107 [S21] |
| 109 CAPTCHA fallback/escalation | Anti-bot era; account/checkout | Balances abuse and human access | Disability exclusion/false positives/privacy; A/C | Challenge failure by group; 108 |
| 110 Non-obscured focus and sticky-layer collision check | Mobile/accessibility; global | Keeps controls perceivable/operable | Chat/cookie/sticky CTA stacks; A | Keyboard task completion; 118 [S21] |

### Pricing, merchandising, promotion, recommendation, and basket intelligence (111–135)

| ID / pattern | History, placement, stage | Mechanism and best use | Boundary, risk, evidence | Metric/test; related |
|---|---|---|---|---|
| 111 Left-digit price test | Retail history; listing/PDP; evaluation | Lower magnitude perception when left digit changes | Premium image and tiny absolute difference; B/A | Margin, quality perception; 112 [S6–S7] |
| 112 Round/prestige price test | Premium retail; PDP; evaluation | Fluency/emotional-category congruence | Not inherently “luxury”; C | WTP, brand perception; 111 |
| 113 Percentage-versus-amount saving | Promotions; PDP/cart | Saving format changes evaluability | Numeracy/price magnitude; B/C | Saving accuracy, margin; 114 |
| 114 Absolute final price prominence | All commerce; listing/PDP/cart | Enables comparison despite framing | Small gray total under huge saving; A | Final-price recall; 96, 113 |
| 115 Volume tier with per-unit total | Wholesale/consumables; PDP | Makes scale economics visible | Waste/stock-up and margin erosion; B/D | Incremental units, repeat delay; 41 |
| 116 Bundle component-level choice | Bundling era; PDP/cart | Transaction convenience and complementarity | Forced unwanted component, incompatible stock; C/D | Attach, component returns, profit; 124 |
| 117 Unbundled baseline beside bundle | Bundling; PDP/cart | Makes incremental value and autonomy clear | Information density; B/D | Bundle value comprehension/cannibalization; 116 |
| 118 Free-shipping threshold explanation | Mail order → ecommerce; cart | Goal gradient and transaction economics | Overspend, returns, moving threshold; B/C | Incremental profit, returns; covered pattern 1 |
| 119 Gift-with-purchase relevance selector | Beauty/DTC; cart | Reciprocity with preference control | Waste, induced unwanted spend; C/D | Gift use, threshold profit; 120 |
| 120 Sample choice at checkout | Beauty/food; cart/post-purchase | Trial and discovery | Choice load, allergy/privacy; C/D | Sample-to-purchase, complaint; 119 |
| 121 Customer-specific promotion holdout | CRM era; offer delivery | Measures true incrementality | Fairness and contamination; A/B | Incremental contribution/LTV; 122 [S9] |
| 122 New-versus-established promo policy | Direct marketing; CRM | Accounts for long-run heterogeneity | Discriminatory/unfair opaque treatment; A/B | Repeat and margin by cohort; 121 [S9] |
| 123 Substitute recommendation | Recommender era; PDP/results | Helps choose among alternatives | Cannibalizes preferred item or confuses complement; B/D | Choice, margin, substitution; 124 |
| 124 Compatibility-constrained accessory | Basket intelligence; PDP/cart | Complement and error prevention | False compatibility causes high harm; B/D | Attach, compatibility returns; 46 |
| 125 Replenishment reminder from consumption range | CRM; post-purchase | Timely recognition and convenience | Sensitive inference, over-contact, variable usage; C | Reorder, opt-out, waste; 130 |
| 126 Preference-feedback control | Personalization era; cards/account | Corrects model and adds agency | Feedback ignored or profile leakage; C | Correction impact, satisfaction; 40 |
| 127 “Why this price/offer” explanation | Dynamic commerce; PDP/account | Reduces unfairness and opacity | Reveals protected/sensitive targeting; C | Fairness perception, complaints; 131 |
| 128 Organic/sponsored recommendation separation | Marketplace/recommender; discovery | Preserves ranking integrity | Native-ad ambiguity; A/D | Label comprehension, organic trust; 33 |
| 129 Personalization reset/private mode | Modern privacy; global | Control on shared/novel sessions | Settings hard to find; B/D | Reset success, opt-out retention; 35 |
| 130 Frequency-capped lifecycle reminder | CRM; retention | Timely memory cue without fatigue | Harassment and vulnerable targeting; C/D | Incremental reorder, unsubscribe; 125 |
| 131 Consistent price across channel or explained difference | Omnichannel; evaluation | Fairness and message continuity | Personalized surveillance pricing; C/A | Complaint, conversion, price trust; 127 |
| 132 Margin/inventory-aware ranking with customer guardrail | Digital merchandising; listing | Balances profit and relevance | Self-dealing, stale inventory, hidden cheap alternatives; C | Contribution, relevance, diversity; 32 |
| 133 Out-of-stock substitute preserving constraints | Inventory/recommender; PDP/cart | Recovers task without restarting | Substitute violates allergen/fit/budget; B/D | Recovery and bad-substitution rate; 123 |
| 134 Back-in-stock alert with consent and expiry | CRM/inventory; PDP; revisit | Commitment and timely availability | Indefinite marketing capture; C/D | Alert conversion, consent withdrawal; 130 |
| 135 Price-drop alert with baseline context | Comparison/CRM; revisit | Reference tracking and anticipated saving | Manipulated baseline/dynamic-price anxiety; C | Alert incrementality, trust; 80 |

### Post-purchase, retention, localization, measurement, and governance (136–150)

| ID / pattern | History, placement, stage | Mechanism and best use | Boundary, risk, evidence | Metric/test; related |
|---|---|---|---|---|
| 136 Confirmation-first receipt page | Transactional ecommerce; confirmation | Closes uncertainty before selling | Upsell obscures order success; A/D | Success comprehension/support; 137 |
| 137 Order-change/cancel window | Modern fulfillment; confirmation/account | Error recovery and autonomy | Operational cutoff hidden; C/D | Self-service recovery, fulfillment cost; 136 |
| 138 Accessible order tracking timeline | Logistics era; post-purchase | Progress and uncertainty reduction | Fake precision or color-only states; A/D | “Where is order” contacts; 139 |
| 139 Exception-first delivery recovery | Omnichannel; post-purchase | Converts failure into actionable choices | Buried delay, no human path; B/D | Recovery, satisfaction, churn; 138 |
| 140 Outcome-based onboarding | SaaS/complex goods; post-purchase | Competence and product success | Premature cross-sell and forced tour; C/D | Activation, support, retention; 141 |
| 141 Review request after sufficient experience | UGC/CRM; post-purchase | Improves evidence relevance | Too early, sentiment gating, incentive bias; A/C | Review representativeness; 60–62 |
| 142 Loyalty progress with real value | Loyalty era; account/cart | Goal gradient and recognition | Expiry opacity, sunk-cost lock-in; B/C | Incremental repeat, breakage, satisfaction; 143 |
| 143 Plain-language points/expiry economics | Loyalty account; retention | Makes value calculable | Devaluation and hidden expiry; C/D | Value comprehension/complaints; 142 |
| 144 Right-to-left mirrored interaction audit | Global mobile; all stages | Operational language/script fit | Mechanical mirroring breaks numbers/media conventions; A/D | RTL task success; 90 |
| 145 Low-bandwidth media mode | Mobile/global; discovery/PDP | Access under network/device constraints | Reduced evidence without opt-in restore; B/D | Task success/data/load by network; 50 |
| 146 Local payment/refund explanation | Cross-border checkout; completion | Learned-method trust and recourse clarity | Translation without operational support; B/D | Payment success/refund time; 100 |
| 147 Jurisdiction/versioned disclosure registry | Governance; all stages | Keeps legal claims current and scoped | “Compliant” badge without review; A/D | Audit exceptions and update latency; 148 |
| 148 Pattern evidence card | Research/governance; design decision | Preserves claim, source, boundary and test | Citation laundering/outdated studies; A | Orphan claims, review cadence; all |
| 149 Long-term holdout | Experimentation/CRM; all stages | Detects delayed retention/brand/promo effects | Contamination and opportunity cost; A/B | Incremental LTV/profit/trust; 121 |
| 150 Accessibility + ethics release gate | Governance; pre-release/all stages | Prevents metric wins from overriding rights | Checkbox compliance without users; A | Blocked regressions, manual task pass; 92, 103, 110 |

## 12. Competitor-intelligence and mystery-shopping framework

For each competitor, observe—not endorse—the full journey for beginner, expert, price-sensitive, premium, skeptical, gift, returning, mobile, keyboard-only and screen-reader shoppers. Use entry points from branded search, shopping ad, social creator, email and direct traffic. At home/category/search/PDP/cart/checkout/confirmation/account/cancellation/return, log: timestamp, country/device/login state; element and exact claim; customer question answered; inferred commercial objective; possible mechanism; total price and terms; proof provenance; friction; accessibility; outcome; and uncertainty. Re-run because personalization and experiments make one screenshot nonrepresentative.

Score **transferability**, not polish: catalog scale, brand familiarity, market power, logistics, membership lock-in, first-party data, traffic mix, regulation, margins and app penetration. “Successful companies can still have bad UX” when a practice survives because switching costs, loyalty, selection, price, monopoly-like reach or legacy systems compensate. A smaller merchant should not copy density, forced login, aggressive cross-selling, confusing marketplace seller identity, persistent discounting, or proprietary-wallet pressure merely because a leader uses it.

## 13. What we still do not know

1. Reliable causal effects of most visual ecommerce patterns on contribution profit and long-term trust; public datasets are rare.
2. Whether many classic behavioral effects retain magnitude in real mobile commerce under repeated exposure; publication bias and task realism remain concerns.
3. Stable ways to separate genuine helpful personalization from perceived surveillance across individuals and cultures.
4. Which review summaries improve decisions rather than merely conversion, and how LLM summaries alter herding or minority-view visibility.
5. Long-run customer and brand effects of authentic versus manufactured urgency.
6. Promotion incrementality under cross-channel contamination, strategic customer waiting and heterogeneous margins.
7. Accessibility interventions’ causal revenue effects; compliance and inclusion do not require a revenue proof, but business estimates are often proprietary.
8. Whether virtual try-on reduces category-specific returns across body/skin/disability groups after calibration is considered.
9. How buyer agents will compare seller terms, express authority, handle returns and resist sponsored ranking; standards and liability remain unsettled.
10. How generated dynamic interfaces can remain predictable, accessible and auditable while adapting.
11. Cross-cultural effects below country level and for multilingual/diaspora shoppers; national averages are too coarse.
12. Whether agent-mediated comparison will reduce brand effects or shift persuasion into feeds, data schemas and commercial ranking.

Every gap becomes an experiment candidate, not permission to invent a rule.

## 14. Source library

Sources are grouped by the requested domains. Year refers to publication/standard/report year. Peer-reviewed and official/regulatory sources are prioritized. Direct DOI links are used where stable. Practitioner sources should be added only as examples, never as the sole basis for causal claims.

### Consumer psychology and behavioral economics

- **[S1] Chernev, Böckenholt & Goodman (2015), “Choice overload: A conceptual review and meta-analysis.”** Meta-analysis, 99 observations, N=7,202; identifies four moderators. *Journal of Consumer Psychology*. https://doi.org/10.1016/j.jcps.2014.08.002
- **[S2] Jachimowicz et al. (2019), “When and why defaults influence decisions: a meta-analysis of default effects.”** *Behavioural Public Policy*. https://doi.org/10.1017/S0140525X18002093
- **[S3] Huber, Payne & Puto (1982), “Adding asymmetrically dominated alternatives.”** Original attraction-effect experiments; *Journal of Consumer Research*. https://doi.org/10.1086/208899
- **[S4] Gal & Rucker (2018), “The loss of loss aversion.”** Critical conceptual/evidentiary review; *Journal of Consumer Psychology*. https://doi.org/10.1002/jcpy.1047
- **[S5] Shampanier, Mazar & Ariely (2007), “Zero as a special price: the true value of free products.”** Experiments on zero-price discontinuity; *Marketing Science*. https://doi.org/10.1287/mksc.1060.0254
- **Kivetz, Urminsky & Zheng (2006), “The goal-gradient hypothesis resurrected.”** Field/experimental loyalty progress evidence; *Journal of Marketing Research*. https://doi.org/10.1509/jmkr.43.1.39
- **Scheibehenne, Greifeneder & Todd (2010), “Can there ever be too many options? A meta-analytic review of choice overload.”** Important counterweight showing near-zero mean effect before moderators; *Journal of Consumer Research*. https://doi.org/10.1086/651235
- **Simonson (1989), “Choice based on reasons: the case of attraction and compromise effects.”** *Journal of Consumer Research*. https://doi.org/10.1086/209205
- **Iyengar & Lepper (2000), “When choice is demotivating.”** Famous field/lab studies; should be read alongside meta-analyses, not generalized alone. https://doi.org/10.1037/0022-3514.79.6.995
- **[S28] Iyengar & Lepper (1999), “Rethinking the value of choice: a cultural perspective on intrinsic motivation.”** Two studies; culture/self-construal boundary. https://business.columbia.edu/faculty/research/rethinking-value-choice-cultural-perspective-intrinsic-motivation

### Visual attention, color, typography, copy, and HCI

- **[S10] Milosavljevic et al. (2012), “Relative visual saliency differences induce sizable bias in consumer choice.”** Three real-food choice experiments; effects vary with decision speed/load. https://doi.org/10.1016/j.jcps.2011.10.002
- **[S11] Elliot & Maier (2014), “Color psychology: effects of perceiving color on psychological functioning in humans.”** Review; *Annual Review of Psychology*. https://doi.org/10.1146/annurev-psych-010213-115035
- **[S12] Jonauskaite et al. (2020), “Universal patterns in color-emotion associations are further shaped by linguistic and geographic proximity.”** N=4,598, 30 nations, 22 languages; *Psychological Science*. https://doi.org/10.1177/0956797620948810
- **[S13] Henderson, Giese & Cote (2004), “Impression management using typeface design.”** Empirically derived typeface dimensions; *Journal of Marketing*. https://doi.org/10.1509/jmkg.68.4.60.42736
- **[S14] Doyle & Bottomley (2004), “Font appropriateness and brand choice.”** Brands chosen more often under congruent fonts in forced choice; *Journal of Business Research*. https://doi.org/10.1016/S0148-2963(02)00487-3
- **[S15] van Laer et al. (2019), “Storytelling in the digital era.”** Meta-analysis of 64 articles/138 effect sizes and digital moderators; *Journal of Business Research*. https://doi.org/10.1016/j.jbusres.2018.10.053
- **[S30] Reber, Schwarz & Winkielman (2004), “Processing fluency and aesthetic pleasure.”** Integrative review; *Personality and Social Psychology Review*. https://doi.org/10.1207/S15327957PSPR0804_3
- **Tuch et al. (2012), “The role of visual complexity and prototypicality regarding first impression of websites.”** Two experiments; *International Journal of Human–Computer Studies*. https://doi.org/10.1016/j.ijhcs.2012.06.003
- **Wolfe (2021), “Guided Search 6.0.”** Visual-search theory emphasizes interaction of bottom-up and top-down guidance; *Acta Psychologica*. https://doi.org/10.1016/j.actpsy.2021.103433
- **[S21] W3C (2023), WCAG 2.2 Recommendation.** Primary accessibility standard, including contrast, reflow, focus, targets, redundant entry and accessible authentication. https://www.w3.org/TR/WCAG22/
- **[S22] U.S. Department of Justice (2022), Guidance on Web Accessibility and the ADA.** Official guidance; explains online exclusion and manual-plus-automated checking. https://www.ada.gov/resources/web-guidance/

### Trust, social proof, privacy, and culture

- **[S16] de Langhe, Fernbach & Lichtenstein (2016), “Navigating by the stars.”** 1,272 products in 120 categories plus experiments; documents “illusion of validity” in average ratings. https://doi.org/10.1093/jcr/ucv047
- **[S17] Chevalier & Mayzlin (2006), “The effect of word of mouth on sales: online book reviews.”** Cross-site observational/econometric evidence; negative reviews often more consequential in samples. https://doi.org/10.1509/jmkr.43.3.345
- **[S18] Muchnik, Aral & Taylor (2013), “Social influence bias: a randomized experiment.”** >100,000 online comments; positive initial manipulation increased subsequent positive ratings and produced herding. https://doi.org/10.1126/science.1240466
- **[S19] Aggarwal, Jun & Huh (2011), “Scarcity messages: a consumer competition perspective.”** Two studies; limited-quantity/time and brand-concept boundaries. https://doi.org/10.2753/JOA0091-3367400302
- **[S20] Kim & Peterson (2017), “A meta-analysis of online trust relationships in e-commerce.”** 150 B2C studies and 16 pairwise relationships; moderators include method and website type. https://doi.org/10.1016/j.intmar.2017.01.001
- **[S29] Trepte et al. (2023), “Global variations in online privacy concerns across 57 countries.”** Cross-national evidence; do not reduce privacy attitudes to a single global average. https://doi.org/10.1016/j.techsoc.2023.102187
- **[S27] World Bank (2022), Global Findex 2021: Use of accounts.** Official survey program; digital payment use in developing economies grew substantially, with major regional variation. https://www.worldbank.org/en/publication/globalfindex/brief/the-global-findex-database-2021-chapter-2-use-of-accounts
- **[S34] GSMA (2025), State of the Industry Report on Mobile Money 2025.** Official industry dataset with regional adoption/use. https://www.gsma.com/sotir/

### Pricing, promotions, and merchandising

- **[S6] Thomas & Morwitz (2005), “Penny wise and pound foolish: the left-digit effect in price cognition.”** Five experiments; effect conditional on leftmost-digit change and comparison distance. https://doi.org/10.1086/429600
- **[S7] Strulov-Shlain (2023), “More than a penny’s worth: left-digit bias and firm pricing.”** Scanner data from 3,500 products/25 U.S. chains; *Review of Economic Studies*. https://doi.org/10.1093/restud/rdac082
- **[S8] Morwitz, Greenleaf & Johnson (1998), “Divide and prosper: consumers’ reactions to partitioned prices.”** Experiments on surcharge processing and total-cost recall. https://doi.org/10.1177/002224379803500404
- **[S9] Anderson & Simester (2004), “Long-run effects of promotion depth on new versus established customers.”** Three field studies; opposite long-run effects by customer tenure. https://doi.org/10.1287/mksc.1030.0040
- **Krishna et al. (2002), “A meta-analysis of the impact of price presentation on perceived savings.”** Helps bound percentage-versus-amount and reference framing. https://doi.org/10.1016/S0022-4359(02)00072-6
- **Manning & Sprott (2009), “Price endings, left-digit effects, and choice.”** *Journal of Consumer Research*. https://doi.org/10.1086/593424
- **Chernev (2012), “Product assortment and consumer choice: an interdisciplinary review.”** Assortment mechanisms and moderators. https://doi.org/10.1561/1700000030
- **[S32] FTC Guides Against Deceptive Pricing, 16 CFR §233.1, former-price comparisons.** Official U.S. guidance on bona fide former prices; current scope/status must be checked. https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233/section-233.1

### Recommender systems, search, and basket intelligence

- **Linden, Smith & York (2003), “Amazon.com recommendations: item-to-item collaborative filtering.”** Influential system description; adoption evidence, not causal proof of Amazon’s success. https://doi.org/10.1109/MIC.2003.1167344
- **Koren, Bell & Volinsky (2009), “Matrix factorization techniques for recommender systems.”** *IEEE Computer*. https://doi.org/10.1109/MC.2009.263
- **Hidasi et al. (2016), “Session-based recommendations with recurrent neural networks.”** GRU4Rec; benchmark evidence with stated datasets, not a universal production winner. https://arxiv.org/abs/1511.06939
- **Schnabel et al. (2016), “Recommendations as treatments: debiasing learning and evaluation.”** Exposes selection bias in logged recommender evaluation. https://doi.org/10.48550/arXiv.1602.05352
- **Jannach & Bauer (2020), “Escaping the McNamara fallacy: towards more impactful recommender systems research.”** Warns against optimizing offline accuracy detached from business/user outcomes. https://doi.org/10.1145/3383313.3412485
- **Agrawal, Imieliński & Swami (1993), “Mining association rules between sets of items in large databases.”** Foundational basket-analysis work. https://doi.org/10.1145/170035.170072

### Analytics and experimentation

- **Kohavi et al. (2009), “Controlled experiments on the web: survey and practical guide.”** Experiment design and organizational practice; *Data Mining and Knowledge Discovery*. https://doi.org/10.1007/s10618-008-0114-1
- **Kohavi, Tang & Xu (2020), *Trustworthy Online Controlled Experiments*.** Comprehensive industrial experimentation reference. https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/60D24E3E5D8B7A7B230CA1F14A568916
- **Fabijan et al. (2019), “Diagnosing sample ratio mismatch in online controlled experiments.”** Data-quality prerequisite; KDD. https://doi.org/10.1145/3292500.3330722
- **Johari, Pekelis & Walsh (2022), “Always valid inference: continuous monitoring of A/B tests.”** Sequential inference; *Operations Research*. https://doi.org/10.1287/opre.2021.2135
- **Deng, Lu & Chen (2016), “Continuous monitoring of A/B tests without pain.”** Practical sequential-testing methods; KDD. https://doi.org/10.1145/2939672.2939785

### AI commerce and standards

- **NIST (2023), AI Risk Management Framework 1.0.** Official risk governance framework applicable to generated claims, recommendations and dynamic interfaces. https://doi.org/10.6028/NIST.AI.100-1
- **NIST (2024), Generative AI Profile.** Risks including confabulation, privacy, bias and information integrity. https://doi.org/10.6028/NIST.AI.600-1
- **Schema.org, Product and Offer vocabularies (living standard).** Machine-readable product/offer semantics; implementation does not guarantee agent accuracy. https://schema.org/Product and https://schema.org/Offer
- **European Union (2024), AI Act, Regulation (EU) 2024/1689.** Risk-based obligations; exact applicability depends on system, role, use and timeline. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

### Regulation, consumer protection, reviews, and deceptive design

- **[S23] U.S. FTC (2022), *Bringing Dark Patterns to Light*.** Official staff report. https://www.ftc.gov/reports/bringing-dark-patterns-light
- **[S24] OECD (2022), *Dark Commercial Patterns*.** Evidence review and policy analysis. https://doi.org/10.1787/44f5e846-en
- **[S25] European Union (2022), Digital Services Act, Regulation (EU) 2022/2065, Article 25 and Recital 67.** Official text. https://eur-lex.europa.eu/eli/reg/2022/2065/oj
- **[S26] European Commission (2023 reporting 2022 sweep), dark-pattern sweep.** 399 sites/apps checked; 148 contained one examined category; a screening result is not a final adjudication. https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/sweeps_en
- **[S33] U.S. FTC (2024), Consumer Reviews and Testimonials Rule Q&A.** Rule effective October 21, 2024; official staff guidance. https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers
- **[S31] U.S. FTC (2025), Rule on Unfair or Deceptive Fees Q&A.** Covered sectors/scope must be checked; useful “clear and conspicuous” guidance, not a global total-price rule. https://www.ftc.gov/business-guidance/resources/rule-unfair-or-deceptive-fees-frequently-asked-questions
- **European Union (2019), Directive (EU) 2019/2161 (“Omnibus Directive”).** Price reductions and review-related consumer-law changes; national transposition matters. https://eur-lex.europa.eu/eli/dir/2019/2161/oj
- **California (2020/2023), CPRA/CCPA regulations and official resources.** Applicability and current regulations require date-specific review. https://cppa.ca.gov/regulations/
- **European Union (2016), GDPR, Regulation (EU) 2016/679.** Profiling, consent, transparency and data-subject rights depend on facts and lawful basis. https://eur-lex.europa.eu/eli/reg/2016/679/oj

## 15. Final deliverable crosswalk

| Deliverable | Supplement contribution |
|---|---|
| 1 Executive overview | Conditional-intervention thesis; defensible principles |
| 2 Historical timeline | Correction ledger and archival-source requirements |
| 3 Evolution map | Overlapping-layer evolution map |
| 4 Consumer psychology KB | Decision modes and causal mechanism table |
| 5 Behavioral economics KB | 19 mechanisms with evidence, failure and ethical hypotheses |
| 6 Visual sales design KB | Attention, color, typography, media, copy boundaries |
| 7 Pricing KB | Charm/round/reference/partition/BNPL/subscription analysis |
| 8 Merchandising KB | Assortment, ranking, discovery and pattern rows |
| 9 Recommendation/upsell KB | Relationship taxonomy, compatibility, cannibalization and rows 123–135 |
| 10 Product-page KB | Sequencing, media, proof, fit and rows 41–80 |
| 11 Cart/checkout KB | Completion, errors, total price, payment and rows 81–110 |
| 12 Post-purchase/retention KB | Confirmation, recovery, onboarding and rows 136–143 |
| 13 Competitor intelligence | Full-journey, multi-persona transferability method |
| 14 Pattern library | 130 new rows + existing 20 = 150 |
| 15 Digital sales ontology | Evidence/claim/offer/recommendation/law extensions |
| 16 Evidence matrix | Verdict/evidence scale and 20 load-bearing claims |
| 17 Dark-pattern/ethics matrix | Persuasion/manipulation/deception controls |
| 18 Analytics/experimentation | Metric portfolio, holdouts, test governance |
| 19 AI-era review | Mature/bounded versus experimental/high-risk |
| 20 Future capability requirements | Knowledge/evaluation requirements without architecture |
| 21 Research gaps | Twelve explicit unknowns/experiment candidates |
| 22 Source library | Grouped primary, peer-reviewed and official direct links |

## Quality status

`{"status":"draft_complete","current_phase":"evidence_and_citation_verification","quality_metrics":{"coverage":0.91,"depth":0.86,"confidence":0.88}}`

Human/legal review is still required for jurisdiction-specific claims, current regulatory status, and any commercial deployment. The final union merge should preserve counterevidence and avoid converting contextual findings into universal rules.

