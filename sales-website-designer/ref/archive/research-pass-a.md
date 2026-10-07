# Gap-Filling Research Supplement: Evolution of Online Selling and the Knowledge Base for Sales-Oriented Digital Design

**Research date:** 9 August 2026  
**Relationship to `covered.md`:** This is a supplement, not a rewrite. The existing 6,065-word file contains a useful high-level synthesis but no live citations, almost no sample/design reporting, only 20 sales patterns, and thin or absent treatment of regional marketplaces, travel, B2B, grocery, nonprofit commerce, affiliates, culture, fraud, and the regulatory evidence base. This report fills those gaps and flags unsupported absolutes. It does **not** design software architecture.

## Executive supplement

The strongest lesson missing from the covered draft is not another tactic; it is a rule of inference. Observing that Amazon, Booking, SHEIN, or Apple uses a pattern does not establish that the pattern caused sales. A design rule should be stored with its outcome, population, treatment, comparator, time horizon, business metric, and boundary conditions. The proper default is therefore **context-dependent until replicated**, not “best practice until disproved.”

Several covered claims need qualification. “Choice reduction” is not universally beneficial: Scheibehenne, Greifeneder, and Todd’s meta-analysis covered 63 conditions from 50 published and unpublished experiments (N=5,036) and found a mean choice-overload effect near zero with large heterogeneity ([JCR, 2010](https://doi.org/10.1086/651235)). Online reviews do affect sales on average, but magnitude depends on product and platform; Floyd et al.’s meta-analysis reported larger mean elasticity for valence than volume, while later work finds hedonic/utilitarian moderation ([Journal of Retailing, 2014](https://doi.org/10.1016/j.jretai.2014.04.004); 26,357 Amazon products plus an experiment, N=541, [EJIS, 2019](https://doi.org/10.1080/0960085X.2018.1524419)). “Fewer than 12 checkout fields” is not a scientific universal; field necessity, error rate, autofill, address format, and perceived effort matter more than a fixed count. “AI-generated landing pages” and autonomous negotiation are plausible futures, not demonstrated conversion laws.

The history also needs a more causal account. Ecommerce advanced when infrastructure reduced a specific uncertainty or transaction cost: SSL and recognizable payment brands reduced interception fears; search and filters reduced catalog search cost; ratings reduced quality uncertainty; persistent carts and email reconnected interrupted sessions; smartphones shifted commerce into short, touch-based, context-rich sessions; tokenized wallets reduced typing and exposure of card credentials; marketplaces bundled selection, reputation, fulfillment, and recourse; and 2025–2026 commerce protocols began making product, checkout, and post-purchase state legible to agents. The commercial interface evolved from a digital catalog to a decision-support and risk-allocation system.

## Research method and confidence gate

**Interpretation confidence: 0.94.** The task is to supplement every omission or unsupported claim in the supplied coverage, satisfy the 22 deliverables at least at a gap-filling level, and expand the pattern library toward 150+ entries. Sources were prioritized as: peer-reviewed/meta-analysis or regulator/standard (Tier A); official company documentation and large credible datasets (Tier B); practitioner evidence used only to formulate hypotheses (Tier C). Verdicts use **TRUE / MOSTLY_TRUE / PARTLY_TRUE / MOSTLY_FALSE / FALSE / UNVERIFIABLE**. “TRUE” is reserved for narrowly scoped claims supported by multiple high-quality sources.

## 1. Historical timeline: missing events, causes, and commercial consequences

| Era | Gap-filling events and constraints | Why the change occurred | Commercial knowledge that survives |
|---|---|---|---|
| 1990–1995 | Mail-order conventions shaped product grids, item numbers, guarantees, and telephone fallback. The Web opened in 1991; early browsers were slow and image-sparse. Netscape introduced SSL in 1994. Pizza Hut’s 1994 ordering experiment and NetMarket’s encrypted purchase are often called “firsts,” but definitions differ; treat first-transaction claims as **UNVERIFIABLE** without a declared definition. | Dial-up cost, weak browsers, unfamiliar payment, and low household connectivity forced small pages and explicit reassurance. | Clear product identity, visible price, fulfillment promise, return route, and alternate support channels remain risk-reduction primitives. |
| 1995–2000 | Amazon (1995), eBay (1995), Dell direct ordering, online travel, comparison engines, portals, banner ads, affiliate programs, and early online banking established distinct models. Amazon’s Associates program (1996) made distributed performance acquisition mainstream; eBay made seller reputation a market-governance device. | Catalog scale exceeded physical shelf space; search and hyperlinks lowered discovery cost; marketplaces needed reputation because platform and seller were separate. | Separate **platform trust**, **seller trust**, and **product trust**. Comparison tools increase price transparency and shift differentiation toward service and availability. |
| 2000–2005 | The dot-com crash redirected attention from traffic to unit economics and usability. Google AdWords launched in 2000 and moved to auction/CPC economics in 2002. Amazon described item-to-item collaborative filtering in 2003 ([IEEE Internet Computing](https://www.cs.umd.edu/~samir/498/Amazon-Recommendations.pdf)). Broadband enabled richer images; analytics became less dependent on raw server logs. | Capital scarcity demanded measurable acquisition and conversion. Large catalogs made manual merchandising insufficient. | Optimize contribution, not visits. Recommendations are a relevance problem with exposure, position, and incremental-profit biases—not merely a widget. |
| 2005–2010 | Web 2.0 normalized reviews, Q&A, wishlists, richer filters, AJAX carts, remarketing, transactional email, and SaaS testing. Facebook and YouTube changed discovery; iPhone (2007) began the mobile transition. Free-shipping thresholds and liberal returns became competitive levers, but profitability varied by basket and reverse-logistics cost. | User-generated evidence lowered uncertainty; asynchronous interfaces reduced page-transition cost; ad platforms made behavioral targeting scalable. | Preserve user state, expose authentic customer evidence, and measure the full margin effect of shipping/returns. |
| 2010–2015 | Responsive design, app commerce, Instagram/Pinterest inspiration, subscription DTC, Shopify ecosystem growth, and programmatic ads expanded. Apple Pay launched in 2014 using tokenization, Secure Element, and Touch ID; Apple explicitly positioned one-touch app checkout as an alternative to lengthy forms ([Apple, 2014](https://www.apple.com/newsroom/2014/09/09Apple-Announces-Apple-Pay/)). | Smartphones made keyboard entry disproportionately costly; cameras made visual UGC ubiquitous; cloud platforms lowered store-launch cost. | Mobile is a different constraint set, not a smaller desktop: touch targets, interruption recovery, wallet availability, bandwidth, and one-handed use matter. |
| 2015–2020 | Social commerce, influencer DTC, vertical video, BNPL, marketplace logistics, lifecycle email/SMS, headless commerce, visual search, and deep learning recommenders grew. GDPR applied in 2018; privacy became a design constraint rather than only a policy page. | Paid social enabled rapid demand testing; platform tracking improved targeting; later privacy constraints raised the value of first-party data. | Attribution is partial; acquisition-channel fit and consent provenance belong in any design claim. BNPL changes payment timing, not affordability, and requires harm-sensitive disclosure. |
| 2020–2023 | Pandemic shocks accelerated online grocery, curbside pickup, QR and contactless payment, livestream selling, rapid delivery, subscriptions, and marketplace dependence. Supply volatility made inventory and delivery estimates central. Regulators intensified action against hidden fees, fake reviews, hard cancellation, and dark patterns. WCAG 2.2 became a W3C Recommendation in October 2023, adding target-size, redundant-entry, focus, and accessible-authentication criteria ([W3C](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)). | Necessity brought late adopters online; fulfillment, not interface polish, often became the bottleneck. | Never promise what inventory and operations cannot deliver. Accessibility criteria affect transaction completion directly. |
| 2023–2026 | Generative search, conversational shopping, virtual try-on, product-feed enrichment, and agent-assisted checkout emerged. Google’s 2025 Shopping AI Mode combined model reasoning with its Shopping Graph and proposed price-triggered agentic checkout under user oversight ([Google, 2025](https://blog.google/products/shopping/google-shopping-ai-mode-virtual-try-on-update/)). Stripe and OpenAI announced ACP-powered instant checkout in 2025 ([Stripe](https://stripe.com/newsroom/news/tour-newyork-2025)); Google announced Universal Commerce Protocol in January 2026 for discovery through post-purchase exchange ([Google](https://blog.google/products/ads-commerce/agentic-commerce-ai-tools-protocol-retailers-platforms/)). | Product comparison is shifting from keyword retrieval toward intent interpretation; agents require accurate structured price, inventory, policy, and authorization state. | Human persuasion remains necessary, but machine-readable accuracy, provenance, delegated authority, idempotency, recourse, and post-purchase status become commercial trust properties. Adoption and incremental sales effects remain **UNVERIFIABLE** at population scale. |

### Evolution map

`catalog digitization → searchable assortment → reputational evidence → measurable acquisition → personalized relevance → mobile/wallet friction reduction → social/creator discovery → omnichannel fulfillment → privacy/regulatory constraint → conversational and agent-mediated commerce`

Each arrow represents a reduction in a different cost: information publication, search, uncertainty, measurement, relevance, input, inspiration, fulfillment coordination, data externality, and machine-to-merchant coordination. No stage replaces the previous one.

## 2. Undercovered business models, regions, culture, and customer journeys

### Marketplaces outside the US-centric canon

- **Alibaba/Taobao/Tmall:** marketplace trust developed through escrow-like payment, seller ratings, chat, and dense merchandising. The lesson is not to copy density; it is that synchronous seller access and platform recourse can compensate for weak pre-existing merchant trust.
- **Mercado Libre:** integrated marketplace, payments, and logistics address fragmented Latin American payment access and delivery reliability. Localization must include installments, cash/voucher options where relevant, address ambiguity, and seller reputation—not merely translation.
- **Shopee and Lazada:** mobile-first Southeast Asian commerce uses vouchers, coins, chat, livestreaming, free-shipping campaigns, and platform logistics. Gamification may raise visit frequency but can also obscure price and impose cognitive load; effects require market-specific tests.
- **SHEIN and Temu:** rapid assortment testing, feed-like discovery, price promotion, and gamified incentives show an operating model, not proof that countdowns or dense discounting generalize. Regulatory and trust risks make imitation especially hazardous.
- **Etsy:** provenance, maker identity, uniqueness, customization, and delivery uncertainty are core. Social proof must distinguish the specific seller and item from platform-level assurance.

### Business-model boundary conditions

| Model | Decision problem | High-value information | Common failure |
|---|---|---|---|
| Grocery/quick commerce | substitution, freshness, time slot, basket repetition | live availability, substitution control, unit price, delivery window | promoting unavailable items; hidden weight adjustments |
| Travel | perishable inventory, date/party constraints, cancellation risk | total trip price, fare rules, location, refundability, schedule | drip pricing; false scarcity; ambiguous room/fare comparison |
| B2B | multiple stakeholders, approval, integration, negotiated price | specifications, compliance, lead time, TCO, quote and procurement path | consumer-style impulse tactics that withhold technical proof |
| Luxury | authenticity, symbolic value, service, scarcity | provenance, craftsmanship, appointment/service, controlled distribution | indiscriminate coupons and charm pricing that erode positioning |
| Subscription | uncertain future use and cancellation | renewal cadence, total recurring cost, pause/cancel, usage fit | preselection, trial-to-paid surprise, cancellation obstruction |
| Digital goods/SaaS | fit, switching cost, security, learning | demo, limits, integrations, export, uptime, migration | feature grids without task evidence; misleading “unlimited” claims |
| Auctions/resale | condition, counterparty, timing, authenticity | bid state, condition taxonomy, seller history, dispute route | shill-like urgency, unclear fees, incomparable condition grades |
| Nonprofit | trust, efficacy, identity, recurring commitment | use of funds, impact evidence, tax status, cadence | guilt/shame coercion and preselected recurring gifts |
| Regulated/health | eligibility, safety, evidence, privacy | limitations, clinician/regulatory role, contraindications | testimonials substituting for evidence; sensitive-data overcollection |

### Culture and geography

Culture is a moderator, not a stereotype field. Research must model language direction, reading system, currency and tax display, address formats, name fields, local payment rails, installment norms, delivery reliability, return expectations, privacy law, and marketplace trust. It must not infer an individual’s preferences from nationality. A safe rule is: use locale to supply correct defaults, provide an easy override, and learn from consented behavior. Cross-cultural persuasion findings are often student-sample or country-pair studies and should normally be labeled **PARTLY_TRUE** until replicated in the exact market.

### Traffic-source and decision-mode matrix

| Arrival context | Likely question | Page obligation | Diagnostic metric |
|---|---|---|---|
| Branded search/direct | “Is this the right official product?” | fast confirmation, navigation, availability | successful destination rate |
| Nonbrand search | “Which option solves my task?” | category education, comparison, query continuity | search refinement and qualified PDP reach |
| Paid social/creator | “Is the promise credible and for me?” | message match, demonstration, creator disclosure, risk reversal | landing-to-evidence engagement and incremental profit |
| Marketplace referral | “Why buy direct here?” | price/policy parity, authenticity, service advantage | direct conversion net of channel cannibalization |
| Email/SMS return | “Is this relevant now?” | deep-link continuity, preference-aware frequency | incremental conversion and unsubscribe/complaint rate |
| Agent referral | “Does this item satisfy explicit constraints?” | structured facts, source/provenance, inventory and policy accuracy | constraint satisfaction, correction and dispute rate |

## 3. Evidence-based knowledge-base additions

### Consumer psychology and behavioral economics

1. **Uncertainty reduction is more general than “persuasion.”** Shoppers need evidence about product fit, merchant honesty, delivery, payment safety, and reversibility. Interface elements should be tagged by which uncertainty they reduce.
2. **Loss aversion is not a license for threat framing.** The classic prospect-theory finding concerns reference-dependent choices under risk; translating it into countdowns or “don’t miss out” copy is an application hypothesis, not the experiment itself ([Kahneman & Tversky, 1979](https://doi.org/10.2307/1914185)).
3. **Defaults are powerful but ethically conditional.** Johnson and Goldstein demonstrated large default effects in organ-donation choices across natural and experimental evidence ([Science, 2003](https://doi.org/10.1126/science.1091721)); this does not validate prechecked paid add-ons. Defaults must reflect reasonable consumer expectations, be disclosed, and be reversible.
4. **Choice overload is heterogeneous.** Assortment size, attribute comparability, expertise, time pressure, and preference certainty moderate effects. Provide filtering and guided comparison before deleting assortment.
5. **Social proof carries diagnostic and normative information.** Review distribution, recency, verified status, and content relevance matter. Perfectly positive review sets can appear implausible; suppressing negative reviews creates legal and epistemic risk.
6. **Processing fluency can improve ease but also mislead.** Visual simplicity should not remove price terms, limitations, or material attributes. Fluency is not synonymous with truth.

### Visual attention, color, typography, and language

- Eye-tracking “F-pattern” observations describe some information-seeking behavior on text-heavy pages; they do not prove a universal scan path or placement formula. Verdict: **MOSTLY_FALSE** when stated as “users only scan in F shapes.”
- Color effects are mediated by contrast, convention, semantic meaning, display, ambient light, impairment, brand, and culture. “Red converts best” is **FALSE** as a universal claim. Test the salience and meaning of the complete component, not hue alone.
- WCAG 2.2 provides testable minima; meeting them is necessary but not sufficient for usability. Transaction designs should additionally test zoom, screen readers, keyboard-only operation, switch access, error recovery, reduced motion, cognitive clarity, and localized text expansion.
- Typography should optimize legibility, hierarchy, and comprehension. Measure task accuracy and reading comprehension, not aesthetic preference alone. Avoid using faint or tiny text for terms.
- Copy must map claims to substantiation. Concrete specifications and demonstrated outcomes are safer than unqualified superlatives. Preserve uncertainty when the evidence is probabilistic.

### Pricing and promotions

- **Reference price:** Anchoring is real, but advertised former prices must be genuine and jurisdiction-compliant. FTC Guides Against Deceptive Pricing explain that a former price must be an actual, bona fide price, not an artificial reference ([16 CFR Part 233](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233)).
- **Charm pricing:** left-digit effects have experimental support in some settings, but the effect depends on cognition and positioning; it is not a universal revenue lift. Luxury and trust-sensitive contexts can favor round prices.
- **Free shipping:** “free” changes price partitioning and can shift baskets; judge it on contribution profit, return rate, and customer mix. A threshold can exploit goal-gradient behavior but may also induce low-margin filler purchases.
- **Discount depth:** evaluate reference integrity, stock age, future willingness to pay, and channel conflict. Constant promotion can teach customers to wait.
- **BNPL:** show schedule, total cost, late-fee consequences, and affordability safeguards. Conversion lift alone is not sufficient evidence of consumer welfare.
- **Personalized price:** distinguish personalized recommendations/offers from individualized base prices. Fairness, explanation, discrimination, and disclosure risks increase sharply when price varies by inferred willingness to pay.

### Merchandising, discovery, and recommendation science

Recommendation types must be explicit: **substitute** (same job), **alternative** (broader viable choice), **complement** (used together), **cross-sell** (commercial placement of complements), **upsell** (higher-value version), **bundle** (joint package), **order bump** (small checkout add-on), **frequently bought together** (behaviorally inferred co-occurrence), **complete the look/kit** (curated complements), **recently viewed** (memory aid), **contextual** (current session/context), and **personalized** (individual-history informed). A label describes intent, not model quality.

Amazon’s 2003 item-to-item method matched items from a user’s history to similar items and aggregated candidates; it was designed for scalability and real-time responsiveness ([Linden, Smith & York, 2003](https://www.cs.umd.edu/~samir/498/Amazon-Recommendations.pdf)). Modern evaluation must separate offline relevance from online incrementality. Required metrics include coverage, diversity, novelty, calibration, availability, price fit, attach rate, incremental margin, return rate, and exposure fairness. “Frequently bought together” can reflect position bias or promotion, not natural complementarity.

Search is a sales function when it helps users express constraints. Track query reformulation, zero-result recovery, filter usefulness, rank-sensitive conversion, and semantic error. Never treat conversion among search users as causal proof that search causes conversion; high-intent shoppers self-select into search.

### Product page, cart, checkout, post-purchase, retention

A PDP should answer: identity, fit, variation, evidence, total cost, delivery, returns, availability, seller, compatibility, and next action. Priority varies by category: dimensions dominate furniture, fit apparel, ingredients beauty, interoperability electronics, and cancellation travel/subscriptions.

Checkout research should distinguish **exploratory carts**, **saved-intent carts**, and **failed transactions**. The aggregate abandonment rate mixes different phenomena. Diagnose the specific step and reason with event data, error logs, user research, and payment decline codes. Guest checkout, address autocomplete, wallets, and inline validation are plausible friction reducers; all need localized error and fraud evaluation. W3C’s Payment Request API standardizes merchant-to-browser payment initiation but implementation and impact vary ([W3C, 2026](https://www.w3.org/TR/payment-request/)).

Post-purchase is part of the sale: confirmation, editable delivery state, cancellation/returns, proactive delay messaging, and support determine regret and repeat trust. Recovery messages should be measured incrementally with holdouts because many customers would return without a message. Optimize retention to contribution margin and customer welfare, not message volume or gross LTV projections.

## 4. Trust, fraud, privacy, accessibility, and ethics

### Trust decomposition

Trust is not a badge. It is an expectation that (1) the product is represented accurately, (2) the seller will perform, (3) the platform/payment system will protect the transaction, (4) data will be handled as represented, and (5) failures have recourse. Signals must be verifiable: legal identity, reachable support, authentic reviews, precise policies, secure payment, realistic delivery, and consistent cross-channel information.

### Fraud and security trade-offs

Fraud controls create false positives, accessibility burdens, and conversion loss. Use risk-adaptive friction, not uniform obstruction. NIST’s ecommerce guide demonstrates risk-based step-up multifactor authentication using FIDO U2F to reduce account misuse ([NIST SP 1800-17, 2019](https://doi.org/10.6028/NIST.SP.1800-17)). Track fraud loss, manual-review cost, false-decline rate, challenge completion, account takeover, friendly fraud, and disparate impact. Trust messages must never reveal exploitable fraud rules.

### Privacy and personalization

Data minimization is a design feature. Store the provenance, purpose, consent, retention, and revocation status of every personalization input. Offer useful nonpersonalized defaults. Avoid sensitive inference unless strictly necessary and lawful. Evaluate the **personalization lift minus creepiness, exclusion, and data-risk cost**. A 2026 marketing meta-analysis reports moderation by data type and self-concept relevance, reinforcing that personalization is heterogeneous rather than uniformly persuasive ([Journal of Marketing, 2026](https://doi.org/10.1177/00222429261460888)).

### Dark-pattern/ethics matrix

| Pattern | Consumer harm | Evidence/legal anchor | Ethical replacement |
|---|---|---|---|
| Fake countdown/stock | false urgency; distorted choice | FTC identifies false scarcity and deceptive design ([2022 report](https://www.ftc.gov/reports/bringing-dark-patterns-light)) | show audited inventory or actual cutoff with timestamp/timezone |
| Drip pricing | comparison obstruction; surprise total | FTC report; sector and jurisdiction rules | disclose mandatory total and variable fees early |
| Confirmshaming | emotional coercion | dark-pattern taxonomy; DSA prohibition | neutral accept/decline labels |
| Prechecked paid add-on | unauthorized charge | regulator enforcement history | unchecked choice with clear price and consequence |
| Hard cancellation | continued unwanted billing | FTC report; click-to-cancel enforcement evolves | cancellation at least as easy and discoverable as signup |
| Disguised ad/endorsement | source confusion | FTC Endorsement Guides ([2023](https://www.ftc.gov/legal-library/browse/federal-register-notices/guides-concerning-use-endorsements-testimonials-advertising)) | prominent sponsorship/affiliate disclosure |
| Review suppression/manipulation | false quality belief | FTC final rule on consumer reviews and testimonials ([2024](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials)) | publish neutral moderation rules and review provenance |
| Forced data sharing | privacy loss unrelated to task | FTC report; GDPR principles | collect minimum data with granular, symmetric choice |
| Roach motel subscription | time and financial loss | FTC report | visible renewal, self-service pause/cancel, confirmation |
| Interface interference | hidden decline/return/navigation | EU DSA bans interfaces that deceive or materially distort choice ([Commission](https://digital-strategy.ec.europa.eu/en/faqs/digital-services-act-questions-and-answers)) | equivalent visual weight and plain language |

## 5. Analytics and experimentation framework

### Measurement hierarchy

1. **North-star commercial outcome:** incremental contribution profit or long-run customer value with explicit assumptions.
2. **Primary experiment metric:** one predeclared outcome close to business value (e.g., contribution profit per eligible session).
3. **Mechanism metric:** the behavior expected to move (search success, checkout completion, attach rate).
4. **Guardrails:** refunds, returns, cancellations, support contacts, page performance, accessibility errors, complaints, unsubscribe, fraud, and margin.
5. **Diagnostic metrics:** segment and step data used to explain, not opportunistically declare a win.

### Experimental requirements

- Define eligibility, randomization unit, hypothesis, minimum detectable effect, sample duration, exclusions, and stopping rule before launch.
- Check sample-ratio mismatch, instrumentation parity, novelty, carryover, interference, and concurrent campaigns.
- Use intent-to-treat as the default; triggered analyses need careful eligibility definitions.
- Report absolute effect, relative effect, interval, sample, duration, and guardrails—not only p-values.
- Correct or hierarchically model multiple comparisons. Do not stop when significance first appears.
- Use cluster or switchback designs when treatment spills across users, inventory, price, or fulfillment capacity.
- Run holdouts for recommender, CRM, and retargeting incrementality; exposed-user conversion is confounded by selection.
- Analyze heterogeneous treatment effects only with power and pre-specified segments. Treat exploratory cuts as hypotheses.
- Monitor post-test persistence and return/cancellation effects; a short conversion lift can reverse at contribution level.

### Event schema at the knowledge level (not architecture)

Every commercial observation should record: actor/anonymous session, timestamp/timezone, surface/device, traffic source, experiment assignment, product/variant/seller, price/tax/shipping/promotion snapshot, inventory promise, recommendation request and rank, query/filter state, consent state, accessibility mode where voluntarily disclosed, cart mutation, checkout step/error/decline category, order margin estimate, fulfillment outcome, return/refund, support contact, and evidence provenance. This is a semantic requirement, not a system design.

## 6. Fact-check evidence matrix

| Claim | Verdict | Evidence and boundary condition |
|---|---|---|
| Red buttons always convert better | **FALSE** | No general causal law; contrast, convention, hierarchy, audience, and context dominate. |
| Users only read in an F-pattern | **MOSTLY_FALSE** | Observed in some text-heavy scanning tasks, not a universal attentional law. |
| More options reduce conversion | **PARTLY_TRUE** | Meta-analysis: 63 conditions, 50 experiments, N=5,036; near-zero mean and high heterogeneity ([2010](https://doi.org/10.1086/651235)). |
| Three pricing tiers are always optimal | **FALSE** | No universal evidence; task, preference distribution, comparability, and business economics vary. |
| .99 pricing always lifts revenue | **MOSTLY_FALSE** | Some left-digit evidence, but effects are context/positioning dependent and profit impact is not universal. |
| Authentic review information can affect sales | **MOSTLY_TRUE** | Meta-analytic evidence, with valence/volume and product/platform moderators ([2014](https://doi.org/10.1016/j.jretai.2014.04.004)). |
| Review effects are identical for all products | **FALSE** | Panel of 26,357 products plus N=541 experiment found utilitarian/hedonic moderation ([2019](https://doi.org/10.1080/0960085X.2018.1524419)). |
| Fake urgency is a harmless optimization | **FALSE** | Deceptive and trust-damaging; regulator reports and DSA restrictions apply. |
| Guest checkout reduces a known source of friction | **MOSTLY_TRUE** | Strong repeated usability/industry evidence; magnitude varies, account benefits can be offered after purchase. |
| Every checkout should have fewer than 12 fields | **MOSTLY_FALSE** | Fixed threshold is unsupported; necessary fields, address locale, autofill, and perceived effort vary. |
| Inline validation should validate every keystroke | **FALSE** | Premature error states harm; validate at a meaningful completion point or blur with accessible feedback. |
| Wallets can reduce mobile input burden | **TRUE** | Mechanism is inherent and documented by Apple/W3C; conversion magnitude still merchant/context dependent. |
| Free shipping is always more profitable | **FALSE** | Demand effect can be offset by fulfillment, returns, low-margin basket, and cannibalization. |
| Personalization always increases persuasion | **FALSE** | Meta-analytic evidence finds moderators; privacy and relevance failures can reverse effects. |
| Recommendation click-through proves incrementality | **FALSE** | Exposure and position bias; randomized holdout required. |
| Search-user conversion proves search causes sales | **FALSE** | Search users often have higher prior intent. |
| Accessibility is separate from conversion | **FALSE** | Target size, authentication, redundant entry, focus, and errors directly affect transaction completion; W3C advises WCAG 2.2. |
| Amazon’s layout should be copied because Amazon succeeds | **FALSE** | Observation is confounded by selection, assortment, price, logistics, Prime, and brand trust. |
| Agentic checkout is mainstream by 2026 | **UNVERIFIABLE** | Official launches exist, but adoption, reliability, consumer demand, and incremental effect lack independent population evidence. |
| Structured, current product/policy data is increasingly important to agent-mediated shopping | **MOSTLY_TRUE** | UCP/ACP and Google Shopping announcements require programmatic commerce facts; long-run standard convergence remains uncertain. |
| Optimizing conversion alone can reduce profit | **TRUE** | Discounts, free shipping, fraud, returns, and low-margin mix can raise conversion while reducing contribution; arithmetic and repeated practice corroborate. |
| Countdown timers always increase revenue | **FALSE** | Authenticity, deadline relevance, reactance, brand, and delayed outcomes vary. |
| Biometrics always reduce checkout abandonment | **PARTLY_TRUE** | They can reduce credential entry, but device support, consent, failure recovery, and accessibility moderate. |
| Heatmaps reveal why users behave | **FALSE** | They visualize recorded interaction; causal explanation requires triangulation and experiments. |

## 7. Sales-pattern library expansion (patterns 21–160)

These 140 additions bring the combined library to **160 patterns**. “Evidence” grades the underlying mechanism, not a guaranteed commercial lift: **A** strong/repeated empirical or standards basis; **B** credible usability/observational practice; **C** testable practitioner hypothesis. Every pattern requires truthful implementation and profitability/accessibility guardrails.

| # | Pattern | Stage | Mechanism / best use | Failure mode | Evidence |
|---:|---|---|---|---|:---:|
| 21 | Total-cost preview | PDP/cart | reduces price uncertainty | inaccurate tax/shipping promise | A |
| 22 | Delivery-date promise | PDP | reduces temporal uncertainty | operations miss promise | A |
| 23 | Postal-code estimator | PDP | localizes cost/ETA | requests data before value | B |
| 24 | Return-window summary | PDP | risk reversal | hides exceptions | A |
| 25 | Size/fit recommender | PDP | fit confidence | biased/inaccurate training data | B |
| 26 | Measurement guide | PDP | objective fit support | wrong locale/units | A |
| 27 | Compatibility checker | PDP | prevents wrong purchase | incomplete device database | B |
| 28 | Ingredient/material glossary | PDP | comprehension | marketing euphemisms obscure risk | B |
| 29 | Variant-linked media | PDP | confirms exact choice | media does not match SKU | A |
| 30 | Zoom/high-resolution detail | PDP | quality inspection | performance cost | B |
| 31 | Scale reference image | PDP | reduces size ambiguity | misleading perspective | B |
| 32 | 360-degree view | PDP | spatial inspection | heavy asset, low added value | B |
| 33 | Demonstration video | PDP | shows use/outcome | staged, inaccessible, autoplay | B |
| 34 | Video transcript/captions | PDP | accessibility/comprehension | inaccurate auto-captions | A |
| 35 | Before/after with protocol | PDP | outcome evidence | manipulated imagery | A |
| 36 | Specification comparison | PDP | attribute trade-off | irrelevant attribute overload | B |
| 37 | “What’s included” inventory | PDP | expectation alignment | tiny exclusions | A |
| 38 | Seller identity panel | PDP/marketplace | counterparty trust | platform trust masks seller risk | A |
| 39 | Authenticity/provenance record | PDP | counterfeit risk reduction | unverifiable claims | B |
| 40 | Repairability/spare-parts info | PDP | lifecycle value | unsupported availability claim | B |
| 41 | Search autosuggest | discovery | query formulation | popularity bias | B |
| 42 | Typo tolerance | discovery | error recovery | overcorrection changes intent | B |
| 43 | Synonym/locale mapping | discovery | vocabulary bridge | culturally wrong equivalence | B |
| 44 | Query-scoped filters | discovery | choice structuring | irrelevant filter clutter | B |
| 45 | Applied-filter chips | discovery | state visibility | inaccessible removal controls | A |
| 46 | Results-count preview | discovery | consequence visibility | costly/unstable counts | B |
| 47 | Zero-results recovery | discovery | preserves task | generic bestsellers ignore query | A |
| 48 | Category landing guide | discovery | novice education | SEO copy obscures products | B |
| 49 | Facet value search | discovery | large-filter navigation | hidden on mobile | B |
| 50 | Sort explanation | discovery | transparent ranking | undisclosed paid ranking | A |
| 51 | Compare tray | evaluation | externalizes memory | too many attributes | B |
| 52 | Save comparison state | evaluation | interruption recovery | account wall | B |
| 53 | Recently viewed | evaluation | recognition/memory | sensitive-product exposure | B |
| 54 | Wishlist without account | evaluation | low-commitment save | fragile local storage | B |
| 55 | Back-in-stock alert | retention | demand recovery | excessive contact/false ETA | B |
| 56 | Price-drop alert | retention | monitoring support | trains waiting | B |
| 57 | Guided selector with skip | discovery | progressive choice | forced quiz | B |
| 58 | Expert/novice mode | discovery | adaptive information depth | stereotyping expertise | C |
| 59 | Natural-language query summary | search | confirms interpretation | hallucinated constraint | C |
| 60 | Visual-search correction | search | image-based discovery | irrelevant embeddings/bias | B |
| 61 | Verified-purchase marker | reviews | provenance signal | verification too permissive | A |
| 62 | Review distribution histogram | PDP | shows variance | binning manipulation | A |
| 63 | Review recency filter | PDP | current quality signal | hides older durability evidence | B |
| 64 | Review attribute tags | PDP | task relevance | auto-tag errors | B |
| 65 | Critical-review summary | PDP | downside visibility | selective summarization | B |
| 66 | Seller response to reviews | PDP | recourse evidence | scripted defensiveness | B |
| 67 | Community Q&A | PDP | long-tail uncertainty | obsolete/wrong answers | B |
| 68 | Expert methodology disclosure | PDP | authority calibration | paid endorsement hidden | A |
| 69 | UGC rights/provenance label | PDP | authenticity/privacy | coerced or undisclosed reuse | A |
| 70 | Review moderation policy | PDP | procedural trust | suppresses legitimate negatives | A |
| 71 | Complement compatibility rule | cross-sell | prevents unusable add-on | stale compatibility | B |
| 72 | Substitute recommendation | PDP/OOS | preserves task | pushes higher-margin inferior item | B |
| 73 | Budget-aware alternatives | PDP | price-fit support | inferred sensitivity feels invasive | C |
| 74 | Diversity-aware carousel | discovery | reduces filter bubble | relevance dilution | B |
| 75 | Novelty control | discovery | balances familiar/new | novelty for its own sake | C |
| 76 | Recommendation explanation | discovery | intelligibility | fabricated rationale | B |
| 77 | “Not interested” control | discovery | preference correction | ignored feedback | B |
| 78 | Session-only personalization | discovery | relevance with lower retention | context misread | B |
| 79 | Popular-in-context ranking | discovery | normative aid | rich-get-richer bias | B |
| 80 | Replenishment reminder | retention | purchase-cycle support | mistimed or sensitive inference | B |
| 81 | Bundle component editing | PDP/cart | control and fit | hidden bundle discount loss | B |
| 82 | Bundle savings arithmetic | PDP/cart | transparent value | false comparison base | A |
| 83 | Required-accessory warning | PDP | prevents unusable purchase | disguised upsell | A |
| 84 | Optional-accessory separation | PDP | distinguishes necessity | ambiguous labels | A |
| 85 | Cart item edit in place | cart | reduces navigation cost | accidental changes | A |
| 86 | Undo cart removal | cart | error recovery | short timeout | A |
| 87 | Persistent cart with disclosure | cart | interruption recovery | cross-device privacy leak | B |
| 88 | Save for later | cart | separates intent | hides saved item | B |
| 89 | Cart price-change notice | cart | expectation integrity | silent repricing | A |
| 90 | Cart stock reservation status | cart | state clarity | false reservation | A |
| 91 | Promotion eligibility explanation | cart | reduces coupon confusion | opaque exclusions | A |
| 92 | Best-promotion auto-apply | cart | lowers search cost | removes user control/partner credit | B |
| 93 | Coupon-field de-emphasis | cart | reduces coupon hunting | makes legitimate code inaccessible | B |
| 94 | Threshold progress with margin guardrail | cart | goal pursuit | overbuy/low-margin filler | B |
| 95 | Donation/tip neutral choice | cart | voluntary support | guilt or preselection | A |
| 96 | Environmental option with impact | cart | value alignment | unsubstantiated green claim | A |
| 97 | Guest checkout first-class | checkout | removes account barrier | account option visually hidden | A |
| 98 | Post-purchase account creation | confirmation | defers commitment | password demand blocks receipt | B |
| 99 | Address autocomplete with correction | checkout | lowers input/error | wrong standardized address | A |
| 100 | Billing-same-as-shipping default | checkout | redundant-entry reduction | hard to override | A |
| 101 | Accessible input labels | checkout | comprehension/AT support | placeholder-only labels | A |
| 102 | Error summary plus field links | checkout | recovery | color-only error indication | A |
| 103 | Preserve form after error | checkout | avoids repeated work | retains sensitive data too long | A |
| 104 | Passwordless/passkey sign-in | checkout/account | credential friction/security | poor fallback/device transfer | A |
| 105 | Risk-based step-up auth | payment | balances fraud/friction | discriminatory false positives | A |
| 106 | Payment-method localization | checkout | local fit | overwhelming logos | B |
| 107 | Wallet readiness detection | checkout | shows usable express path | hides conventional payment | B |
| 108 | Installment total-cost display | checkout | informed affordability | emphasizes small periodic amount | A |
| 109 | Order-review edit links | checkout | error prevention | edits reset unrelated fields | A |
| 110 | Final button obligation text | checkout | legal/action clarity | vague “continue” | A |
| 111 | Tax/duty responsibility | checkout | cross-border clarity | surprise collection on delivery | A |
| 112 | Delivery-option comparison | checkout | cost/speed choice | preselects costly option deceptively | A |
| 113 | Pickup slot capacity status | checkout | fulfillment certainty | stale slots | A |
| 114 | Decline-specific recovery | payment | correct next action | exposes security details | B |
| 115 | Idempotent retry reassurance | payment | prevents duplicate-order fear | duplicate capture anyway | A |
| 116 | Accessible authentication alternative | checkout | avoids cognitive test | insecure or hidden fallback | A |
| 117 | Confirmation with complete receipt | post-purchase | uncertainty closure | upsell dominates receipt | A |
| 118 | Immediate order-edit window | post-purchase | error recovery | operational promise impossible | B |
| 119 | Proactive delay notice | fulfillment | expectation repair | optimistic repeated ETAs | A |
| 120 | Shipment milestone explanation | fulfillment | state visibility | meaningless carrier jargon | B |
| 121 | Self-service return initiation | post-purchase | recourse/friction | hidden fees late | A |
| 122 | Refund timing/status | post-purchase | financial certainty | untracked estimates | A |
| 123 | Exchange-first fit flow | returns | preserves product fit | obstructs refund choice | B |
| 124 | Reorder from history | retention | low-effort replenishment | changed SKU/price unseen | B |
| 125 | Subscription cadence control | retention | autonomy/fit | pause option hidden | A |
| 126 | Renewal reminder | retention | informed continuity | too late to cancel | A |
| 127 | Usage-based replenishment | retention | timing relevance | invasive/wrong inference | C |
| 128 | Loyalty benefit ledger | retention | makes value visible | expiry surprise | B |
| 129 | Preference center | CRM | frequency/channel control | choices ignored | A |
| 130 | Win-back without forced discount | retention | diagnose lapse | spam/chronic discounting | B |
| 131 | Referral disclosure and status | advocacy | transparent incentive | spam/social coercion | A |
| 132 | Service-recovery credit | support | fairness repair | substitutes for actual resolution | B |
| 133 | Live inventory by location | omnichannel | availability certainty | stale feeds | A |
| 134 | Pickup readiness evidence | omnichannel | trip-risk reduction | “ready” before picking | A |
| 135 | Store-associate handoff | omnichannel | continuity | lost context/privacy leak | B |
| 136 | QR continuation across devices | omnichannel | task transfer | insecure/expiring link | B |
| 137 | Local return options | omnichannel | recourse convenience | inconsistent policy | B |
| 138 | Marketplace seller comparison | marketplace | counterparty choice | ranking pay-to-play hidden | A |
| 139 | Escrow/payment protection explainer | marketplace | transaction assurance | overstates coverage | A |
| 140 | Dispute pathway preview | marketplace | recourse confidence | inaccessible after purchase | A |
| 141 | Condition-standard taxonomy | resale | comparable quality | seller gaming | A |
| 142 | Bid total-cost preview | auction | fee clarity | buyer premium hidden | A |
| 143 | Subscription annualized cost | subscription | total commitment | foregrounds low monthly price only | A |
| 144 | Trial conversion date/time | subscription | informed consent | timezone ambiguity | A |
| 145 | Plan limit usage examples | SaaS | concrete fit | cherry-picked workloads | B |
| 146 | Quote/approval handoff | B2B | multi-stakeholder continuity | consumer CTA dead-end | B |
| 147 | Downloadable compliance packet | B2B | procurement proof | outdated certificates | A |
| 148 | Unit-price comparison | grocery | value comparability | inconsistent units | A |
| 149 | Substitution preference | grocery | control over fulfillment | ignored preference | A |
| 150 | Perishable freshness standard | grocery | quality expectation | vague guarantee | B |
| 151 | Donation impact range | nonprofit | outcome evidence | false precision | B |
| 152 | Neutral recurring-gift choice | nonprofit | autonomy | recurring preselected | A |
| 153 | Creator affiliate disclosure | social | source calibration | disclosure after CTA | A |
| 154 | Shoppable-video chaptering | social | navigable demonstration | impulse pressure/autoplay | B |
| 155 | Livestream replay facts | social | persistence/verification | expired claims remain | B |
| 156 | Locale-aware names/addresses | global | form validity | Western schema imposed | A |
| 157 | Currency/tax switch with memory | global | price comprehension | geolocation lock-in | A |
| 158 | Right-to-left layout QA | global | reading/action order | mirrored brand/media incorrectly | A |
| 159 | Agent-readable offer facts | agentic | constraint matching | stale price/policy/inventory | B |
| 160 | Delegated-purchase confirmation/recourse | agentic | authority and trust | ambiguous consent/liability | A |

## 8. Digital sales ontology supplement

The covered ontology should add these missing distinctions:

- **EvidenceClaim** → has `source`, `studyDesign`, `sample`, `population`, `year`, `outcome`, `effectEstimate`, `uncertainty`, `verdict`, `replications`, and `boundaryCondition`.
- **CommercialPromise** → price, availability, delivery, return, warranty, outcome, or scarcity claim; must map to an operational source and expiry time.
- **Actor** → shopper, payer, recipient, approver, seller, platform, creator/affiliate, carrier, payment provider, agent, regulator. These roles may be different people/entities.
- **Offer** → product/variant, seller, market, currency, tax, shipping, promotion, time, inventory, eligibility, and terms. A product is not a price.
- **DecisionTask** → discover, compare, configure, verify, authorize, pay, track, resolve, replenish, cancel. Funnel stage alone is too coarse.
- **Uncertainty** → fit, quality, total cost, timing, authenticity, compatibility, privacy, safety, seller performance, recourse.
- **Intervention** → content, ordering, default, friction change, recommendation, price/promotion, proof, support, or fulfillment promise.
- **Outcome** → attention, comprehension, choice, transaction, margin, return, retention, welfare, accessibility, trust, fraud, complaint.
- **Exposure** → eligible, assigned, rendered, viewed, interacted; these must not be conflated.
- **CausalStatus** → randomized, quasi-experimental, observational, qualitative, practitioner, hypothesis, folklore.
- **Consent/Authority** → purpose, scope, actor, duration, revocation, delegation, and confirmation.
- **Failure/Recourse** → error type, responsible party, remedy, deadline, status, and appeal.

Key relations: `Intervention targets Uncertainty`; `EvidenceClaim supports/contradicts Intervention→Outcome`; `BoundaryCondition moderates Effect`; `Offer is validFor Market and Time`; `CommercialPromise is backedBy OperationalState`; `Agent actsUnder Authority`; `Outcome accruesTo Business and Consumer`; `Experiment estimates IncrementalEffect`.

## 9. Competitor-intelligence and mystery-shopping framework

Do not score screenshots alone. Sample competitors across direct category rivals, substitutes, marketplaces, regional leaders, and adjacent best-in-class task performers. For each, run standardized missions on mobile and desktop: browse vague need, exact search, compare, configure, purchase, fail payment, return, cancel subscription, contact support, and use keyboard/screen reader where possible. Capture date, locale, logged-in state, traffic source, price/fees, inventory, delivery promise, experiment evidence, and post-purchase communications.

Separate four levels: **observed** (“pattern displayed”), **inferred mechanism**, **evidence elsewhere**, and **recommended locally**. Never promote an observation to a causal recommendation. Score task success, total cost transparency, evidence quality, accessibility, speed, recourse, seller/platform separation, and brand coherence. Revisit because competitor experiences are frequently personalized and tested.

## 10. AI-era review and capability requirements (knowledge, not architecture)

The eventual designer must know how to:

1. represent claims with evidence strength and boundary conditions;
2. elicit business model, margin, product risk, market, traffic, brand, fulfillment, and regulatory context before recommending;
3. distinguish persuasion from uncertainty reduction and deception;
4. map customer tasks rather than force every visit into a linear funnel;
5. reason about alternatives, substitutes, complements, bundles, and contraindications;
6. compute expected contribution effects including discounts, shipping, payment, fraud, support, return, and retention;
7. localize payment, address, tax, language direction, accessibility, culture, and recourse without stereotyping;
8. inspect operational truth before generating price, scarcity, delivery, sustainability, or performance claims;
9. preserve source provenance and refuse unsupported superlatives;
10. propose testable hypotheses with primary and guardrail metrics;
11. detect selection bias, survivorship bias, position bias, novelty, interference, and multiple testing;
12. design for keyboard, screen reader, zoom, touch, cognitive clarity, error recovery, and accessible authentication;
13. balance personalization with consent, minimization, explanation, correction, and nonpersonalized alternatives;
14. separate seller, platform, payment, and product trust;
15. anticipate fraud and false-positive costs without exposing controls;
16. maintain accurate facts for human and agent-mediated discovery;
17. require explicit delegated authority, confirmation, auditability, and recourse for agentic purchases;
18. recognize when evidence is absent and recommend research rather than fabricate certainty.

## 11. Coverage matrix against all 22 deliverables

| # | Deliverable | Existing coverage | Supplement contribution | Residual research need |
|---:|---|---|---|---|
| 1 | Executive overview | high-level conclusions | corrected inference rule and gaps | executive tailoring by audience |
| 2 | Historical timeline | broad eras | causal timeline with dated primary links | archival first-transaction verification |
| 3 | Evolution map | implicit | explicit cost-reduction chain | quantitative adoption by country |
| 4 | Consumer psychology KB | brief mechanisms | uncertainty, defaults, choice heterogeneity | systematic review per mechanism |
| 5 | Behavioral economics KB | general | evidence translation limits | pricing/default meta-analyses by context |
| 6 | Visual sales design KB | visual hierarchy claims | attention/color/accessibility qualification | direct ecommerce eye-tracking corpus |
| 7 | Pricing KB | anchors/charm/decoy | law, promotions, shipping, BNPL, personalized price | jurisdiction-by-jurisdiction rules |
| 8 | Merchandising KB | moderate | business-model and discovery additions | category-specific planograms online |
| 9 | Recommendation/upsell KB | taxonomy/basic | definitions, bias, incrementality metrics | randomized recommender studies |
| 10 | Product-page KB | moderate | category questions and patterns | vertical-specific evidence reviews |
| 11 | Cart/checkout KB | strong but absolute | cart intent, localization, fraud, payment standards | merchant RCT corpus |
| 12 | Post-purchase/retention KB | brief | recourse, holdouts, subscriptions | long-horizon causal evidence |
| 13 | Competitor intelligence | thin | missions, evidence ladder, scoring | execute mystery shops |
| 14 | Sales pattern library | 20 rows | +140 rows = 160 total | attach studies/effect sizes per row |
| 15 | Digital sales ontology | 7 entities | evidence, offers, authority, recourse, exposure | formal validation with domain experts |
| 16 | Evidence matrix | assertions only | 24 verdicts with links/design notes | full claim-level audit of covered file |
| 17 | Dark-pattern/ethics matrix | prose | 10-pattern regulator-linked matrix | localized legal counsel |
| 18 | Analytics/experimentation | metrics overview | pre-registration, bias, guardrails, holdouts | sample-size calculators by metric |
| 19 | AI-era review | speculative | verified 2025–2026 launches, adoption caveat | independent adoption/outcome data |
| 20 | Future capability requirements | 10 imperatives | expanded 18-item knowledge requirements | capability evaluation benchmarks |
| 21 | Research gaps | short | prioritized gaps below | ongoing living review |
| 22 | Source library | absent | direct linked Tier A/B library | DOI/full-text validation and deduplication |

## 12. Priority research gaps

1. Independent, preregistered ecommerce field experiments remain scarce because merchants keep results private and publication favors wins.
2. Long-run effects of urgency, discounts, personalization, and recovery messaging on trust, returns, and price sensitivity are undermeasured.
3. Most interface evidence underrepresents Global South markets, older adults, disabled shoppers, low literacy, poor connectivity, shared devices, and non-Latin address/name systems.
4. Recommender studies overemphasize offline accuracy and underreport incremental profit, diversity, returns, satisfaction, and supplier fairness.
5. BNPL, dynamic pricing, and personalized offers need consumer-welfare and distributional analysis, not only conversion studies.
6. Creator and livestream commerce need research separating creator trust, platform affordances, product quality, and promotion intensity.
7. Agentic commerce lacks mature independent evidence on adoption, error, consent, fraud, liability, accessibility, merchant power, and incremental demand.
8. “AI-generated UI” needs controlled comparisons against human-designed baselines, including factual error, accessibility, brand coherence, and long-run outcomes.
9. Cross-device and cross-channel experiments need methods robust to identity loss and interference.
10. Sustainability, ethical sourcing, and outcome claims require provenance systems and comprehension tests to prevent greenwashing.

## 13. Source library

### Tier A — peer-reviewed, standards, and regulators

1. Kahneman & Tversky (1979), “Prospect Theory,” *Econometrica*: https://doi.org/10.2307/1914185
2. Johnson & Goldstein (2003), “Do Defaults Save Lives?”, *Science*: https://doi.org/10.1126/science.1091721
3. Scheibehenne, Greifeneder & Todd (2010), choice-overload meta-analysis, 50 experiments/63 conditions/N=5,036: https://doi.org/10.1086/651235
4. Floyd et al. (2014), online-review sales meta-analysis: https://doi.org/10.1016/j.jretai.2014.04.004
5. You, Vadakkepatt & Joshi (2015), review meta-analysis: https://doi.org/10.1016/j.jretai.2015.04.001
6. Rosario et al. (2016), eWOM meta-analysis: https://doi.org/10.1509/jm.14.0380
7. Mudambi & Schuff (2010), review helpfulness: https://doi.org/10.2307/20721420
8. Liu (2006), word of mouth and box office: https://doi.org/10.1509/jmkr.43.1.74
9. Review/product-type moderation (2019), panel 26,357 products + experiment N=541: https://doi.org/10.1080/0960085X.2018.1524419
10. Personalization in marketing communication meta-analysis (2026): https://doi.org/10.1177/00222429261460888
11. Amazon item-to-item collaborative filtering (2003): https://www.cs.umd.edu/~samir/498/Amazon-Recommendations.pdf
12. W3C WCAG 2.2 Recommendation: https://www.w3.org/TR/WCAG22/
13. W3C, What’s New in WCAG 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
14. W3C Payment Request API: https://www.w3.org/TR/payment-request/
15. NIST SP 1800-17, MFA for Ecommerce: https://doi.org/10.6028/NIST.SP.1800-17
16. FTC, *Bringing Dark Patterns to Light* (2022): https://www.ftc.gov/reports/bringing-dark-patterns-light
17. FTC final rule on fake reviews/testimonials (2024): https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials
18. FTC Endorsement Guides (2023): https://www.ftc.gov/legal-library/browse/federal-register-notices/guides-concerning-use-endorsements-testimonials-advertising
19. FTC Guides Against Deceptive Pricing, 16 CFR 233: https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233
20. European Commission, Digital Services Act overview: https://digital-strategy.ec.europa.eu/en/policies/digital-services-act
21. European Commission, DSA dark-pattern Q&A: https://digital-strategy.ec.europa.eu/en/faqs/digital-services-act-questions-and-answers
22. GDPR consolidated legal text: https://eur-lex.europa.eu/eli/reg/2016/679/oj
23. OECD (2022), dark commercial patterns: https://doi.org/10.1787/44f5e846-en
24. Mathur et al. (2019), dark patterns at scale, 11K shopping sites: https://doi.org/10.1145/3359183
25. Gray et al. (2018), dark patterns and UX practice: https://doi.org/10.1145/3173574.3174108

### Tier B — official platform/industry primary documentation

26. Apple Pay launch (2014): https://www.apple.com/newsroom/2014/09/09Apple-Announces-Apple-Pay/
27. Google AI Mode shopping and agentic checkout (2025): https://blog.google/products/shopping/google-shopping-ai-mode-virtual-try-on-update/
28. Google agentic checkout rollout (2025): https://blog.google/products-and-platforms/products/shopping/agentic-checkout-holiday-ai-shopping/
29. Google Universal Commerce Protocol announcement (2026): https://blog.google/products/ads-commerce/agentic-commerce-ai-tools-protocol-retailers-platforms/
30. Google UCP merchant documentation: https://support.google.com/merchants/answer/16837055
31. Google UCP developer guide: https://developers.google.com/merchant/ucp
32. Stripe agentic commerce/ACP announcement (2025): https://stripe.com/newsroom/news/tour-newyork-2025
33. W3C Web Payments Working Group charter (2025–2027): https://www.w3.org/Payments/WG/charter-2025.html
34. Amazon, two decades of recommender systems: https://assets.amazon.science/76/9e/7eac89c14a838746e91dde0a5e9f/two-decades-of-recommender-systems-at-amazon.pdf
35. Google Search quality evaluator guidelines (useful for claim/source quality, not conversion causality): https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf
36. Schema.org Product: https://schema.org/Product
37. Schema.org Offer: https://schema.org/Offer
38. Google Merchant product-data specification: https://support.google.com/merchants/answer/7052112
39. PCI Security Standards Council, PCI DSS: https://www.pcisecuritystandards.org/standards/pci-dss/
40. EMVCo 3-D Secure: https://www.emvco.com/emv-technologies/3d-secure/
41. Baymard checkout usability research (large commercial usability program; methods/results partly proprietary): https://baymard.com/lists/cart-abandonment-rate
42. Nielsen Norman Group ecommerce and usability topic archive: https://www.nngroup.com/topic/ecommerce/

## Closing synthesis

Before an AI should be trusted to design a commercial experience, it must know more than which patterns correlate with successful sites. It must know **what decision problem exists, whose welfare and money are affected, what evidence supports an intervention, which conditions moderate it, whether the operational promise is true, how the effect will be tested, and how a customer can recover when it fails**. The accumulated knowledge of online selling is therefore best understood as a governed body of conditional causal claims—not a catalog of conversion tricks.

**Overall confidence: 0.87.** Confidence is high for the regulator/standards facts, the cited meta-analytic results, and the correction of universal folklore. It is moderate for generalizing practitioner patterns because public randomized field evidence is sparse. It is deliberately low for 2026 agentic-commerce adoption and future outcome claims; official announcements verify availability and intent, not market-wide effectiveness.
