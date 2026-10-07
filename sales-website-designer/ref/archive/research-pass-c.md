# Gap-Filling Research Supplement: Online Selling, Commerce Intelligence, and the AI-Era Knowledge Base

**Research date:** 9 August 2026  
**Scope:** Supplement to `covered.md`, not a replacement. This draft deliberately deepens the least-supported requirements in the master prompt: commerce history; marketplace/DTC/social/mobile/omnichannel transitions; search, recommendation and basket intelligence; analytics, experimentation and unit economics; fraud, security and privacy; competitor and mystery-shopping methods; 2023–2026 AI/agentic commerce; future knowledge and capability requirements. It does **not** propose software architecture.

## 1. Gap audit and executive conclusion

The existing document has a useful thesis—commercial design is contextual behavioral design—but it is not yet an adequate research base. Its principal weaknesses are traceability and completeness: most historical periods are compressed to a few sentences; marketplaces and DTC are treated as a single arc; social, mobile and omnichannel commerce lack channel-specific decision psychology; search/recommender/basket mechanisms are named but not operationally distinguished; experimentation lacks an end-to-end validity protocol; fraud and privacy are nearly absent; the 20-entry pattern table is far short of the requested 150–200; and there is no numbered source library or 22-deliverable coverage matrix.

**Decision-relevant conclusion.** Thirty years of commerce did not produce one winning page formula. It produced a sequence of constraints and capabilities: establish remote trust; make catalogs searchable; reduce payment and fulfillment uncertainty; let customers influence customers; fit selling into mobile moments; unify stores, inventory and delivery; personalize discovery; and, now, make offers legible to both humans and software agents. The future AI sales designer therefore needs causal restraint, channel and intent diagnosis, commercial mathematics, catalog and compatibility knowledge, measurement literacy, safety/legal judgment and the ability to state uncertainty. It must never infer causality from competitor adoption alone.

### Evidence verdict scale used here

- **TRUE:** supported by multiple high-quality sources or a primary source plus durable independent evidence.
- **MOSTLY_TRUE:** direction is well supported but magnitude or generality varies.
- **PARTLY_TRUE:** plausible and supported in a bounded setting; should be tested locally.
- **MOSTLY_FALSE / FALSE:** contradicted or materially misleading.
- **UNVERIFIABLE:** public evidence cannot establish the claim.

Vendor telemetry is labeled as such. A product launch proves existence, not effectiveness. A company-reported conversion association does not establish a causal lift.

## 2. Detailed evolution: what changed, why, and what survived

### 2.1 Prehistory to 1995: remote retail, networks and transactional trust

Mail-order catalogs, direct-response advertising, call centers and television shopping supplied the commercial grammar: hero product, demonstration, price anchor, guarantee, deadline, order form and fulfillment promise. Videotex experiments demonstrated remote ordering before the public web; the Library of Congress records the often-cited 1984 UK grocery order by Videotex. The web then lowered publishing and catalog-distribution cost, while browser security and card-not-present acceptance made transactions plausible. Amazon and AuctionWeb/eBay both came online in 1995. [Library of Congress ecommerce history (2026)](https://guides.loc.gov/e-commerce/history)

**Constraint → response.** Dial-up, tiny screens and low trust favored text, compressed images, shallow catalogs, explicit security language and manual customer service. The durable principles were not visual styling but legible offers, direct response, reassurance, order confirmation and operational follow-through.

**Verdict:** the claim that a single “first online sale” founded ecommerce is **UNVERIFIABLE/definition-dependent** (closed network, consumer Videotex and open-web card transactions produce different answers). Amazon/eBay’s 1995 launches are **TRUE**; claiming that their early page layouts caused success is **FALSE**.

### 2.2 1995–2000: catalog migration, auctions, portals and checkout primitives

Static product lists became database-backed catalogs. Category trees and keyword boxes addressed catalog scale; carts simulated a physical basket; multi-page forms reflected both technical constraints and merchants’ need to collect address/payment data. eBay made seller reputation and auction dynamics core interface objects; Amazon emphasized selection, availability and fulfillment; Dell demonstrated online configuration and direct ordering; travel sites made inventory comparison and self-service booking normal.

Trust moved from “is the internet real?” to “will this merchant protect my card and deliver?” SSL/padlock explanations, privacy statements, recognizable card marks, confirmation email and order tracking operated as uncertainty-reduction devices. Comparison engines shifted price knowledge toward buyers. Techniques that faded include splash pages, browser badges, hit counters and indiscriminate animated GIFs; techniques that survived include cart state, taxonomy, query search, order summaries and delivery estimates.

### 2.3 2000–2005: post-crash discipline, acquisition markets and scalable relevance

The crash punished growth without economics. Usability, measurable acquisition and repeat purchase gained weight. Google launched AdWords in October 2000, turning expressed query intent into an auctioned acquisition channel. [Google’s official AdWords retrospective (2015)](https://adwords.googleblog.com/2015/10/happy-15th-birthday-adwords.html) Email matured into acquisition, transactional and retention streams; affiliates and SEO connected publisher traffic with attributable outcomes.

Amazon’s 2003 item-to-item collaborative-filtering paper described real-time recommendations that scaled independently of customer count and used views, purchases and ratings. It established the practical logic behind “similar items” and “customers who bought…” at large-catalog scale. [Linden, Smith & York, IEEE Internet Computing (2003)](https://doi.org/10.1109/MIC.2003.1167344)

**Why the change mattered.** Commerce stopped being only a digitized catalog. Each query, click and order became a relevance signal; merchandising could be individualized and measured. **Verdict:** item-to-item recommendation at Amazon is **TRUE**; “recommendation widgets always raise profit” is **FALSE** because relevance, displacement, margin, returns and position determine incrementality.

### 2.4 2005–2010: Web 2.0, social proof and optimization

Broadband, AJAX and cheaper content production enabled richer filtering, larger imagery, inline validation, reviews, Q&A, wishlists, persistent carts and community content. Customers increasingly became evidence providers. Search marketing and retargeting sharpened intent capture; analytics and A/B testing made interfaces testable.

The power shift was epistemic: a manufacturer’s claim could be checked against many buyer experiences. Review distributions, recency, verified purchase, photo evidence and merchant responses became more meaningful than a testimonial strip. The commercial risk also changed: suppression, incentives and fake reviews could contaminate the evidence layer. The FTC’s 2024 final rule prohibits fake or false reviews, sentiment-conditioned incentives, undisclosed insider reviews, certain review suppression and fake social indicators. [FTC final rule announcement (2024)](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials)

### 2.5 2010–2015: smartphones, apps, wallets and platformized DTC

Smartphones converted shopping into short, interruption-prone sessions with touch input, camera, location and notifications. Responsive layouts, large targets, sticky actions, autofill and saved credentials were responses to viewport and typing costs. Native apps added persistent identity, biometrics, push and deep links but introduced installation and permission costs. Apple announced Apple Pay in September 2014 with device tokenization, Touch ID and one-touch in-app checkout, explicitly removing repeated address/card entry. [Apple launch release (2014)](https://www.apple.com/newsroom/2014/09/09Apple-Announces-Apple-Pay/)

Shopify, released as a platform in 2006, lowered the fixed cost of a branded independent store; by 2025 it reported millions of merchants, $378B GMV and operations in roughly 175 countries. These are company figures, but they demonstrate infrastructure scale. [Shopify company milestones (2026)](https://www.shopify.com/news/about-us)

**Desktop/mobile web/app decision differences.** Desktop supports parallel comparison, dense specifications and long sessions. Mobile web maximizes reach but magnifies typing, occlusion, latency and context-switch costs. Native apps are strongest for high-frequency, logged-in and location-aware behavior but weak for low-frequency discovery. This is a **MOSTLY_TRUE** interaction-cost account, not a universal psychology; device is correlated with context and traffic source and should not be treated as personality.

### 2.6 2015–2020: DTC, performance media, subscription and marketplace expectation-setting

DTC brands used platform infrastructure, paid social, influencer/UGC creative, lifestyle photography, quizzes, landing pages, subscriptions, bundles, email/SMS flows and post-purchase offers to bypass wholesale gates. The commercial advantage was control of presentation and first-party relationship; the liabilities were rising acquisition costs, limited assortment, fulfillment/returns, weak repeat frequency and dependence on platform algorithms. A beautiful single-product funnel does not repair negative contribution margin or poor retention.

Marketplaces simultaneously trained customers to expect broad selection, normalized product schemas, deep filters, plentiful reviews, price comparison, standardized checkout, buyer protection, trackable delivery and easy returns. Marketplace psychology is a three-party trust problem: buyer ↔ platform, buyer ↔ seller, and platform ↔ seller. Platform reputation can transfer trust to unknown sellers, but counterfeit, seller quality and ranking conflicts remain.

**Transferability warning.** Amazon density depends on selection, Prime, price, operational trust and learned use. Etsy differentiates around unique supply and human connection; in 2025 it reported 86.5M active buyers, 5.6M active sellers, more than 100M items, 45% of GMS in-app, and about 30% custom/made-to-order. [Etsy 2025 Form 10-K (2026)](https://investors.etsy.com/sec-filings/all-sec-filings/content/0001370637-26-000019/etsy-20251231.htm) Copying either interface without its supply and trust model is category error.

### 2.7 2020–2023: pandemic acceleration and store-network convergence

Pandemic restrictions forced more demand online and compressed adoption of pickup, curbside, local inventory, contactless payment and delivery. U.S. Census maintains comparable retail/ecommerce series back to 1998; the pandemic step-change should be read from that series rather than vendor forecasts. [U.S. Census annual retail ecommerce tables, 1998–2020](https://www.census.gov/data/tables/2020/econ/arts/annual-report.html)

Omnichannel became an inventory-and-service promise, not a matching-color exercise. Walmart’s FY2025 report says substantially all U.S. stores offered same-day pickup and delivery, including express delivery within 90 minutes, using stores plus 29 dedicated ecommerce fulfillment centers. [Walmart 2025 Annual Report](https://corporate.walmart.com/content/dam/corporate/documents/newsroom/2025/04/24/walmart-releases-2025-annual-report-and-proxy-statement/walmart-inc-2025-annual-report.pdf) The design consequence is that availability, location, substitution, cutoff, pickup readiness and return destination must be exposed before commitment.

Social commerce reversed the usual funnel. Search commerce begins with declared need; feed commerce begins with attention and socially mediated discovery. Creator demonstration, comments, livestream Q&A and scarcity can generate desire and resolve objections in the same surface. TikTok piloted Shopify shopping in 2021 and fully launched U.S. TikTok Shop in September 2023 with in-feed video, LIVE, profiles, an affiliate program, Shop Ads, fulfillment and in-app checkout. [TikTok launch (2023)](https://newsroom.tiktok.com/introducing-tiktok-shop?lang=en&os=io)

### 2.8 2023–2026: generative discovery and transaction-capable agents

The structural shift is from *retrieval of pages* toward *delegated interpretation and action*. The evidence is product deployment, though most outcome claims remain vendor-reported:

- **June 2023:** Google launched generative virtual try-on for apparel using diffusion and a survey of 1,614 U.S. online apparel shoppers to frame representation/expectation problems. Existence is **TRUE**; reduction in returns is **UNVERIFIABLE** from the release. [Google (2023)](https://blog.google/products-and-platforms/products/shopping/ai-virtual-try-on-google-shopping/)
- **2024:** Amazon rolled Rufus, a catalog-and-web-grounded conversational shopping assistant, to U.S. customers. [Amazon (updated Sept. 2024)](https://www.aboutamazon.com/news/retail/how-to-use-amazon-rufus)
- **October 2024:** Google rebuilt Shopping around Gemini plus a claimed 45B-listing Shopping Graph, with personalized feeds, comparison and price tools. [Google (2024)](https://blog.google/products-and-platforms/products/shopping/google-shopping-ai-update-october-2024/)
- **September–November 2025:** OpenAI introduced Instant Checkout/Agentic Commerce Protocol and then “shopping research,” an interactive buyer’s guide that asks constraints, researches live details, cites sources and accepts preference feedback. OpenAI explicitly warns that price and availability can still be wrong. [OpenAI shopping research (2025)](https://openai.com/index/chatgpt-shopping-research/)
- **October 2025:** Visa introduced Trusted Agent Protocol, intended to let merchants distinguish legitimate delegated agents from malicious bots; the stated 4,700% rise in AI-driven U.S. retail traffic is Adobe-derived and should be treated as vendor telemetry, not a market census. [Visa (2025)](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html)
- **January–March 2026:** Google launched and expanded Universal Commerce Protocol across discovery, buying and post-purchase, including real-time price/inventory, multi-item carts and identity-linked loyalty. [Google UCP launch (2026)](https://blog.google/products/ads-commerce/agentic-commerce-ai-tools-protocol-retailers-platforms/) and [UCP update (2026)](https://blog.google/products-and-platforms/products/shopping/ucp-updates/)
- **March 2026:** OpenAI expanded ACP for product discovery and reported integrations with major retailers and Shopify Catalog. [OpenAI (2026)](https://openai.com/index/powering-product-discovery-in-chatgpt/)
- **2026:** Amazon described Alexa for Shopping (renamed from Rufus), Lens and Buy for Me, which can transact on brand sites. Amazon reports that Rufus users are 60%+ more likely to convert; because usage is self-selected, this association is **PARTLY_TRUE as an observation**, not proof of causal lift. [Amazon (2026)](https://www.aboutamazon.com/news/retail/amazon-agentic-ai-gen-ai-shopping)

**Maturity verdicts.** Conversational product explanation, semantic query reformulation, summarization, feed ingestion and support drafting are **technically mature but accuracy-sensitive**. Generative imagery and virtual try-on are **deployed but category/representation sensitive**. Agent checkout through bounded protocols is **early production**. Open-web autonomous purchasing, negotiation, continuously generated personal storefronts, autonomous CRO and synthetic-user substitution for human research remain **experimental**. A demo completing a purchase is not evidence of safe, reliable, profitable general autonomy.

## 3. Channel and business-model implications

| Model/channel | Dominant customer job | Trust carrier | Main design requirement | Common non-transferable tactic | Core risk metric |
|---|---|---|---|---|---|
| Marketplace | Compare many sellers/items | Platform rules, reviews, buyer protection | Normalize attributes, reveal seller/fulfillment quality | Extreme density and sponsored-result load | Defect/refund/counterfeit rate |
| DTC | Believe a differentiated promise | Brand, proof, guarantee, founder/community | Explain why this product/brand, then reduce risk | Paid-social landing-page urgency | Contribution LTV:CAC and repeat rate |
| Search-led retail | Satisfy explicit need | Relevance, availability, price, retailer reliability | Fast query→filter→comparison path | Inspirational content before task completion | Search exit, zero-result, profit/search |
| Social/creator | Discover and validate in context | Creator/community + visible demonstration | Preserve content context through checkout; disclose incentives | Search-style dense grids at first touch | Incremental profit after creator commission/returns |
| Mobile web | Complete with minimum input | Browser/merchant/payment brand | Fast load, large targets, wallet, recoverable state | Desktop mega-menu compressed into a drawer | Checkout error and latency by device |
| Native app | Reorder, loyalty, location/service | Persistent account and permissions | State continuity, useful notifications, deep links | Push volume as a growth metric | opt-out/uninstall, retained profit |
| Omnichannel | Obtain item through best local route | Inventory accuracy and service promise | Show location, stock confidence, cutoff, pickup/delivery/returns | Treating “omnichannel” as visual consistency | substitution, cancellation, late-ready rate |
| Subscription | Reduce replenishment effort | Clear cadence, control and cancellation | Explain renewal, total cost, skip/pause/cancel | Hidden default or cancellation friction | contribution retention, involuntary churn |
| Luxury | Acquire identity, craft and service | Brand heritage, scarcity, concierge care | Rich proof, restraint, service continuity | Mass-market badges/charm prices | full-price sell-through and loyalty |

**Social versus search psychology.** Search sessions have articulated intent and tolerate attribute density; feed sessions often have low initial intent, high emotional/contextual influence and weak category knowledge. Therefore social landing experiences should maintain narrative and proof continuity, quickly identify the product and creator relationship, disclose sponsorship, and let buyers exit impulse mode into specifications, reviews and returns. TikTok’s 2025 claims—70M products, 120% U.S. sales growth and 8M hours of U.S. LIVE shopping in 2024—are useful platform telemetry but not independent causal evidence. [TikTok Shop (2025)](https://newsroom.tiktok.com/tiktok-shop-is-where-shoppers-come-to-discover?lang=en)

## 4. Search, recommendation and basket intelligence

### 4.1 Search is a commercial decision system, not just string matching

A useful product-search pipeline must understand query intent, retrieve eligible inventory, rank it and explain or expose tradeoffs. Required knowledge includes synonyms, taxonomy, units, variants, compatibility, price/inventory, delivery promise, safety/regulatory constraints and business objectives. Commercial ranking should not optimize click-through alone: clickbait products, out-of-stock items or high-return variants can win clicks and lose profit/trust.

**Diagnostic measures:** search usage; query reformulation; zero-result and low-result rate; click-through; time to first useful product; filter adoption/undo; result-set coverage; add-to-cart and purchase after search; revenue and contribution profit per search; return/cancel rate; latency; exposure by brand/seller; and “constraint violation rate” for conversational/agentic results.

**Failure taxonomy:** lexical miss; missing synonym; bad attribute data; wrong unit/range interpretation; availability leakage; popularity feedback loop; sponsored/organic confusion; personalization overreach; unsafe or incompatible result; stale price; and false confidence in an LLM answer.

### 4.2 Recommendation types must remain semantically distinct

| Type | Customer question | Data needed | Placement | Failure to avoid |
|---|---|---|---|---|
| Alternative/substitute | “What else solves the same job?” | category, comparable attributes, price/quality | PDP, comparison, out-of-stock | showing complements as substitutes |
| Similar item | “More like this?” | item content/embedding + interaction | PDP, listing | near-duplicates with no useful distinction |
| Complement/accessory | “What helps this work?” | compatibility graph, basket/order data | PDP/cart/post-purchase | incompatible accessory |
| Upsell | “Is the better version worth it?” | feature ladder, price, margin, need | PDP/comparison | premium mismatch or coercive default |
| Cross-sell | “What adjacent need can I satisfy?” | basket, mission, context | cart/post-purchase | interrupting checkout with unrelated goods |
| Bundle/kit | “Can I buy the complete solution?” | required/optional components, stock, economics | PDP/cart | discounting products that would sell anyway |
| Frequently bought together | “What do others combine?” | co-purchase with exposure and base-rate controls | PDP/cart | confusing coincidence with compatibility |
| Replenishment | “When will I need it again?” | consumption interval, household context | account/email/app | wrong cadence, unwanted subscription |
| Session recommendation | “Given what I am doing now?” | recent sequence/context | search/listing/PDP | over-weighting an accidental click |
| Personalized recommendation | “Given my history/preferences?” | consented profile + current intent | home/email/app | stale identity, sensitive inference, filter bubble |

Amazon’s 2003 item-to-item method is a durable baseline. Neural/session systems can capture sequence, but complexity is not automatically superiority: a broad empirical comparison found simple nearest-neighbor session methods often matched or beat more complex deep approaches. [Ludewig & Jannach (2018)](https://arxiv.org/abs/1803.09587) **Verdict:** “deep learning is required for modern recommendation” is **MOSTLY_FALSE**; benchmark against popularity, co-visitation and nearest-neighbor baselines.

### 4.3 Basket intelligence: from correlation to profitable, compatible action

Apriori-style association rules identify frequent itemsets; IBM notes the algorithm was introduced by Agrawal and Srikant in 1994 and remains used for market-basket analysis. [IBM overview](https://www.ibm.com/think/topics/apriori-algorithm) Core measures are support `P(A∩B)`, confidence `P(B|A)` and lift `P(B|A)/P(B)`. Lift above 1 indicates association, not causation or compatibility.

An actionable basket system needs five layers:

1. **Eligibility:** in stock, deliverable, legal, correct variant and price.
2. **Semantic relation:** substitute, complement, required accessory, optional accessory, consumable or incompatible.
3. **Customer/mission context:** novice setup, replacement, gift, replenishment, professional job, budget ceiling.
4. **Incrementality/economics:** exposure-adjusted attach lift, cannibalization, discount cost, margin, shipping weight, return/support burden.
5. **Placement/timing:** product page for compatibility education; cart for low-risk completion; post-purchase for non-disruptive additions; replenishment at predicted need.

**Decision rule:** recommend item *B* only if it is eligible, plausibly useful for this mission, not already owned/included, and expected incremental contribution value exceeds its experience and risk cost. Offline `precision@k`, `recall@k`, MRR/NDCG and coverage are model diagnostics—not business proof. Online tests should measure exposure-level attach lift, basket contribution, returns, cancellation, checkout completion and longer-run satisfaction.

## 5. Analytics, experimentation and unit economics

### 5.1 A commerce measurement contract

Instrument impressions as well as clicks. At minimum, events should carry timestamp, anonymous/customer/session IDs with lawful handling, page/surface, item and variant IDs, list/recommendation ID and position, query/filters, price/currency/discount, inventory/fulfillment promise, experiment assignment, traffic source, device/viewport and consent state. Google’s official GA4 ecommerce schema covers list/item views, cart add/remove, checkout, purchase, refund and promotions, and explicitly states these events are not collected automatically. [Google Analytics ecommerce documentation (2026)](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)

Quality tests must detect duplicate purchase events, missing item arrays, inconsistent currency, bot/test orders, late refunds, cross-domain identity loss, consent-caused missingness and client/server discrepancies. Heatmaps and recordings show visible interaction traces, not motivation; they are hypothesis generators and usability evidence, not causal proof.

### 5.2 Profit tree and cohort math

Use the following definitions consistently:

- `Conversion rate = orders / eligible visits`
- `AOV = gross merchandise revenue / orders`
- `Revenue per visitor = conversion rate × AOV`
- `Gross profit/order = net revenue − COGS`
- `Contribution/order = net revenue − COGS − payment fees − pick/pack − shipping subsidy − discounts − expected returns/refunds − variable support/fraud costs`
- `Contribution per visitor = conversion rate × contribution/order`
- `Recommendation incremental contribution = exposed eligible visits × incremental attach probability × contribution/add-on − cannibalization − incremental returns/support`
- `Cohort LTV = discounted expected contribution across retained orders`, not revenue.
- `CAC = incremental acquisition spend / incremental new customers`, ideally measured with geo/holdout incrementality rather than platform-attributed conversions.

A higher-converting promotion can destroy contribution through discounts, shipping, low-quality acquisition or returns. AOV can rise while profit falls. LTV:CAC ratios without cohort maturity, gross/contribution basis, payback time and uncertainty are not comparable.

### 5.3 Experiment protocol

1. Write causal hypothesis, population, unit of randomization and expected mechanism.
2. Choose one primary outcome aligned with contribution or durable customer value; predefine guardrails (errors, speed, returns, complaints, unsubscribe, fairness).
3. Calculate sample size from minimum detectable effect, baseline, power and alpha; do not stop on a favorable daily p-value.
4. Run an A/A or instrumentation validation when the pipeline is new; check assignment and exposure.
5. Ramp gradually. Check sample-ratio mismatch (SRM), bots, novelty, interference, carryover and logging health before reading the winner. Microsoft guidance says an SRM makes the analysis untrustworthy until diagnosed. [Microsoft PlayFab experimentation guidance (2025)](https://learn.microsoft.com/en-us/xbox/playfab/live-service-management/game-configuration/experiments/experimentation-keys)
6. Correct or control the familywise/false-discovery problem when many variants, metrics or segments are examined. Treat post-hoc segments as exploratory.
7. Report effect size and interval, not “significant/not significant” only. Separate intent-to-treat from exposed analyses.
8. Continue through relevant purchase/return cycles; use persistent holdouts for long-term personalization, promotion and brand effects.
9. Replicate material wins; document nulls and harms; assess heterogeneity only with sufficient power.

Microsoft’s “Dirty Dozen,” based on experience across thousands of experiments, documents metric interpretation failures capable of reversing decisions. [Dmitriev et al., KDD 2017](https://www.microsoft.com/en-us/research/publication/a-dirty-dozen-twelve-common-metric-interpretation-pitfalls-in-online-controlled-experiments/) CUPED can reduce variance using pre-experiment data, but it does not repair bad randomization, logging or metric choice.

**Local-maxima defense:** maintain a portfolio of incremental component tests, radical concept tests, qualitative discovery and long-term holdouts. A/B testing only variants of the current template cannot discover a superior information architecture.

## 6. Fraud, security, privacy and trust

### 6.1 Threat/experience matrix

| Risk | Useful control | Conversion cost | Friction-minimizing principle | Metrics |
|---|---|---|---|---|
| Card testing/stolen card | velocity rules, network signals, 3DS/risk authentication | challenge/decline | step up only at elevated risk; preserve cart | approval, fraud loss, false decline, challenge abandonment |
| Account takeover | passkeys/phishing-resistant MFA, device/risk signals | login recovery | allow guest purchase where suitable; explain anomalies | ATO, recovery success, support cost |
| E-skimming | authorize/inventory scripts, integrity and tamper detection | engineering, possible feature limits | minimize checkout scripts; use compliant hosted fields | unauthorized change, CSP violations |
| Bot scraping/scalping | rate limits, proof-of-work/challenges, queueing | CAPTCHA/accessibility cost | progressive challenge; avoid blocking assistive tech/legitimate agents | bot precision, false block, queue conversion |
| Refund/return abuse | policy/risk models, serial/receipt checks | customer suspicion | post-transaction investigation before broad pre-purchase friction | abuse loss, false positives, loyalty harm |
| Counterfeit/unsafe seller | KYBC, provenance, random checks, recall/redress | onboarding/listing delay | risk-tier sellers/categories | removal, recall, complaint, seller false positive |
| Agent impersonation | signed agent identity, scoped payment mandate, confirmation | new authorization step | show agent, task, limits and final total | disputed agent orders, mandate failures |

PCI DSS v4.x Requirements 6.4.3 and 11.6.1 address payment-page scripts and tamper detection; PCI SSC’s 2025 guidance specifically targets ecommerce skimming. [PCI SSC (2025)](https://blog.pcisecuritystandards.org/new-information-supplement-payment-page-security-and-preventing-e-skimming) NIST SP 800-63 Revision 4 (2025) frames identity proofing, authentication and federation with both privacy and customer-experience considerations. [NIST (2025)](https://www.nist.gov/identity-access-management/projects/nist-special-publication-800-63-digital-identity-guidelines)

### 6.2 Privacy and consumer protection are product constraints

Personalization must have a declared purpose, lawful basis, minimum data, retention rule, access/control path and safe fallback. GDPR Article 5 principles include lawfulness, transparency, purpose limitation, data minimization, accuracy, storage limitation and integrity/confidentiality. [GDPR, Regulation (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj)

The EU Digital Services Act bans dark patterns on covered platforms, requires ad/recommender transparency and imposes seller traceability duties on marketplaces. [European Commission DSA overview (updated 2026)](https://digital-strategy.ec.europa.eu/en/policies/digital-services-act) The FTC/ICPEN/GPEN 2024 sweep found at least one possible dark pattern on 76% of 642 subscription sites/apps and multiple patterns on nearly 67%; the agencies explicitly did **not** determine that each instance was unlawful. [FTC sweep (2024)](https://www.ftc.gov/news-events/news/press-releases/2024/07/ftc-icpen-gpen-announce-results-review-use-dark-patterns-affecting-subscription-services-privacy)

**Design rule:** never make refusal, cancellation, privacy choice or return materially harder than acceptance. Show total price, renewal/cadence, data use, seller and agent identity at the decision point. Do not infer sensitive attributes merely because a model can. Measure trust damage through complaints, returns, chargebacks, opt-outs and cohort retention, not only immediate conversion.

## 7. Competitor intelligence and mystery-shopping protocol

### 7.1 Evidence collection, not screenshot collecting

Create a dated evidence packet for each competitor and locale/device. Record URL, timestamp, logged-in state, traffic entry, location, viewport, experiment/personalization caveats, screenshots, visible copy and observable behavior. Never bypass access controls, impersonate protected persons, create harmful orders, scrape against explicit restrictions or publish personal data. Public observation shows *what was rendered to that observer at that moment*.

For each of HOME → CATEGORY → SEARCH → PDP → CART → CHECKOUT → POST-PURCHASE → ACCOUNT → APP, record:

- **Observed fact:** exact element, copy, price, prominence, state and trigger.
- **Inferred customer question:** what uncertainty/job it addresses.
- **Candidate mechanism:** attention, trust transfer, choice reduction, switching cost, goal gradient, compatibility, etc.
- **Business hypothesis:** target metric and possible cost/guardrail.
- **Boundary condition:** category, brand, market power, loyalty, logistics, device or regulation required.
- **Evidence status:** observed / repeated observation / company statement / external causal research / conjecture.
- **Transfer decision:** test / do not copy / only if prerequisite exists.

### 7.2 Controlled mystery-shopping scenarios

Use at least ten fixed personas—beginner, expert, price-sensitive, premium, impulse, skeptic, gift, returning, mobile and comparison—and supply each a concrete mission, budget, urgency and constraints. Run the same mission on competitors from equivalent clean states. Do not pretend personas are real user research; they are structured inspections.

Capture: entry message match; clicks and elapsed time to viable set; query and reformulations; filter path; comparison support; unanswered questions; price/fee reveal point; delivery confidence; seller identity; review diagnostics; recommendation relevance/compatibility; cart persistence; forced account; form fields/errors; payment methods; security challenge; upsell timing; confirmation; cancellation/return discoverability; emails/SMS/push and consent.

Use a 0–4 rubric for **discoverability, comprehension, relevance, evidence, price transparency, fulfillment certainty, control/reversibility, accessibility, mobile ergonomics and recovery**. Keep scores separate from facts and have two reviewers reconcile disagreements. Repeat on at least two dates because stock, campaigns and experiments vary.

### 7.3 Commercial-logic worksheet

| Observation | Likely question | Hypothesized mechanism | Target metric | Cost/guardrail | Verdict |
|---|---|---|---|---|---|
| Delivery date beside CTA | “When will it arrive?” | uncertainty reduction | add-to-cart | stale promise/late delivery | Test if inventory/ETA reliable |
| Sponsored result above organic | “What should I inspect?” | salience + auction monetization | ad revenue | relevance/trust displacement | Do not call best seller unless true |
| App-only price | “Can I save?” | channel migration/lock-in | app installs | resentment, price inconsistency | Context-specific |
| Resetting countdown | “Must I act now?” | false urgency | immediate conversion | deception, trust, enforcement | Do not copy |

## 8. Additional sales-pattern library (50 non-trivial entries)

Each row includes the master prompt’s required fields in compressed form: **history; function/location-stage; psychological and business mechanism; best case; failure/risk/ethics; evidence; metric/test; related patterns.** These are intended to be union-merged with other drafts and deduplicated.

| # | Pattern and category | History / what / where / stage | Mechanism and best use | Failure, ethics, evidence | Metrics / test / related |
|---:|---|---|---|---|---|
| 21 | Query autocomplete (search) | 2000s; predicts terms in global search, discovery | recognition over recall; faster vocabulary alignment in large catalogs | popularity bias, offensive/sensitive leakage; **industry evidence** | search success, reformulation; A/B; spell correction |
| 22 | Typo and synonym recovery (search) | 2000s; expands query before results | reduces lexical mismatch; technical/localized catalogs | silent broadening hides intent; **strong IR practice** | zero-result, correction acceptance; holdout; query explanation |
| 23 | Constraint-preserving conversational search | 2023s; turns natural-language needs into filters | reduces articulation burden for complex missions | LLM drops budget/size; **early production** | constraint violation, purchase/return; audited test; comparison table |
| 24 | Zero-results rescue (search) | 2000s; alternatives, correction and category links | recover dead end without pretending match | irrelevant “results” erode trust; **best practice** | exit/reformulation; query cohort; back-in-stock |
| 25 | Dynamic facets (discovery) | 2000s; category-valid filters on listing | narrows choice while preserving control | facet explosion, zero-result combinations; **repeated UX evidence** | adoption, undo, purchase; category test; guided quiz |
| 26 | Active-filter summary chips (discovery) | 2010s; visible removable constraints | external memory and reversibility | truncation hides filters; **HCI principle** | filter errors/undo; usability+A/B; dynamic facets |
| 27 | Compare tray (evaluation) | 2000s; persistent selected-item comparison | reduces working-memory load | incompatible attributes; mobile crowding; **strong HCI rationale** | compare→purchase, removals; task test; spec normalization |
| 28 | Attribute normalization (data/UX) | marketplace era; aligns units/names | makes true comparison and machine retrieval possible | bad mappings create false equivalence; **structural requirement** | missing/conflict rate; audit; agent feed |
| 29 | Explainable recommendation label | 2010s; “because you viewed/compatible with” | comprehension/control and debugging | fabricated explanation; privacy surprise; **contextual evidence** | hide/dismiss, trust, attach; copy test; preference control |
| 30 | Session-intent reset | 2010s; “not for me/gift mode/reset” | prevents history from contaminating current mission | extra UI; **plausible/contextual** | irrelevant recs, reset use; interleaving; session recommender |
| 31 | Compatibility-confirmed accessory | 2000s; model/variant-aware add-on at PDP/cart | risk reduction + basket completion | false match causes returns/damage; **strong operational logic** | attach, compatibility return; eligibility holdout; complete kit |
| 32 | Required-versus-optional kit labeling | catalog era; separates necessary components | reduces ambiguity and surprise | seller may overstate necessity; **industry practice** | missing-part support, attach; copy test; compatibility graph |
| 33 | Substitute on stockout | 2000s; same-job items on unavailable PDP | saves intent and revenue | lower-quality substitution, hidden difference; **strong logic** | recovery purchase/return; ranked holdout; back-in-stock |
| 34 | Back-in-stock alert | 2000s; consented notification on PDP | preserves preference, commitment | indefinite spam/data retention; **industry practice** | alert→purchase, unsubscribe; timing test; substitute |
| 35 | Replenishment prediction | 2010s; reminder near expected depletion | convenience/habit | wrong cadence, sensitive inference; **contextual/model-dependent** | reorder, opt-out, waste; persistent holdout; subscription |
| 36 | Multi-item add bundle | 2000s; one action for compatible set | transaction-cost reduction | accidental extras/discount leakage; **contextual** | incremental contribution, returns; item-level consent test; FBT |
| 37 | Exposure-adjusted FBT | 2000s; co-purchase rec corrected for popularity/exposure | product affinity | association ≠ causation/compatibility; **methodologically sound** | attach lift, lift, margin; randomized exposure; bundle |
| 38 | Cart-mission cross-sell | 2010s; infers job from basket before recommending | context relevance | unrelated interruption; **contextual** | checkout, attach, return; holdout; post-purchase offer |
| 39 | Shipping-weight-aware add-on | 2010s; recs respect parcel economics | contribution optimization | may suppress best customer choice; **business logic** | contribution/order, split shipment; policy test; threshold bar |
| 40 | Return-risk-aware ranking | 2010s; uses expected return cost in rank | profit/customer-fit | discriminating against sizes/groups; opacity; **contextual** | net contribution, group exposure; guarded test; size guidance |
| 41 | Local-inventory badge | omnichannel era; store-level availability | immediacy/certainty | phantom stock destroys trust; **strong operational** | stock accuracy, pickup cancel; geo holdout; pickup ETA |
| 42 | Pickup readiness window | 2010s; shows when order will be ready | planning certainty | missed promise; **strong service logic** | on-time ready, cancellation; promise test; cutoff timer |
| 43 | Substitution preference control | grocery era; accept/decline/select replacement | autonomy under uncertain stock | defaults create unwanted goods; **strong fairness logic** | substitution approval/refund; UX test; local inventory |
| 44 | Cross-channel cart/account state | 2010s; persists basket/store/app | continuity and reduced restart cost | privacy/shared-device surprise; **industry standard** | recovery, duplication; cohort rollout; persistent cart |
| 45 | Scan-to-digital product context | 2010s; QR/barcode moves store shopper to specs/reviews | bridges physical evidence and digital depth | malicious QR/accessibility; **contextual** | scan→task/purchase; store test; local stock |
| 46 | Express wallet checkout | 2014s; tokenized saved payment/address | eliminates typing, increases security salience | early express bypasses review/upsell; **strong deployed practice** | approval, completion, fraud; eligible A/B; guest checkout |
| 47 | Risk-based step-up authentication | 2010s; challenge only elevated-risk orders | balances loss and friction | biased model/false declines; **strong security practice** | fraud, false decline, abandonment by group; threshold test; passkeys |
| 48 | Phishing-resistant passkey login | 2020s; device-bound authentication | convenience + security | device recovery/confusion; **standards-backed** | login/recovery/ATO; staged rollout; guest option |
| 49 | Payment-page script minimization | 2020s PCI emphasis; limits checkout third parties | reduces e-skimming surface/performance cost | marketing tags conflict; **standards-backed** | scripts, integrity alerts, speed; controlled removal; hosted fields |
| 50 | Seller identity and provenance panel | marketplace era/DSA; displays trader and origin | accountability/trust | overload or false verification signal; **regulatory requirement in contexts** | complaints/counterfeit; comprehension test; buyer protection |
| 51 | Verified-purchase review filter | 2010s; isolates transaction-linked reviews | evidence quality | excludes gifts/off-platform buyers; badge can overclaim; **strong practice** | helpfulness/trust; randomized default; review distribution |
| 52 | Review distribution + recency | 2010s; histogram, dates and volume | diagnostic social proof | averages hide selection/fakes; **strong transparency** | filter use, returns; usability; verified purchase |
| 53 | Critical-review surfacing | 2010s; easy access to low ratings | supports fit/risk diagnosis | cherry-picked “helpful” negatives; **trust-positive hypothesis** | return/complaint/conversion; long-term A/B; Q&A |
| 54 | Material-connection disclosure | influencer era; labels paid/gift/affiliate | informed interpretation | vague/hidden disclosure unlawful; **FTC-backed** | comprehension/complaint; placement test; creator storefront |
| 55 | Human Q&A with answer provenance | Web 2.0; buyer questions answered by brand/community | resolves long-tail uncertainty | stale/wrong medical/safety answers; **contextual** | answered-to-purchase, support; quality audit; FAQ |
| 56 | Total-cost-before-commitment | foundational; price+shipping+tax/fees before CTA/checkout | prevents surprise, supports fair comparison | lower early nominal appeal; hiding is deceptive; **robust** | checkout exit, complaints; staged disclosure test; delivery promise |
| 57 | Renewal summary at subscribe CTA | subscription era; cadence, amount, next date, cancel path | informed commitment | fine print/false urgency; **regulatory/ethical** | churn, refund, complaint; comprehension test; skip/pause |
| 58 | Skip/pause before cancel | subscription era; reversible retention control | autonomy, situational recovery | obstructive save maze; **contextual** | saved contribution vs complaint; holdout; cancellation parity |
| 59 | Cancellation parity | modern regulation; cancel as simply as signup | control and trust | short-term churn rises; friction is dark pattern; **strong ethical/legal** | time/clicks, complaints, win-back; usability; renewal summary |
| 60 | Promotion eligibility preview | coupon era; tells user whether/how offer applies | reduces ambiguity and coupon-site exits | personalized exclusion resentment; **contextual** | failed codes, checkout exits; A/B; auto-apply |
| 61 | Best-price auto-apply | 2010s; automatically applies eligible promotion | fairness/effort reduction | destroys promo targeting/margin; **contextual** | contribution, support, loyalty; geo holdout; eligibility preview |
| 62 | Margin-aware threshold bar | 2000s; progress to shipping/reward threshold | goal gradient + basket economics | encourages low-margin filler/overspend; **contextual** | incremental contribution, returns; threshold experiment; add-on rec |
| 63 | Holdout-measured first-order offer | DTC era; acquisition discount with incrementality cell | reduces trial barrier | subsidizes organic buyers, attracts churners; **contextual** | incremental CAC/LTV/payback; geo/user holdout; referral offer |
| 64 | Price-history context | comparison era; shows typical/historical range | reference calibration, regret reduction | selective windows/manipulated anchors; **contextual** | trust, purchase, price complaint; disclosure test; price alert |
| 65 | Delivery-date promise beside CTA | 2010s; date not vague speed | resolves task deadline | stale estimates create breach; **strong service logic** | promise accuracy, add-to-cart, WISMO; controlled rollout; cutoff |
| 66 | Returns summary beside risk point | 2000s; concise window/cost/condition on PDP/cart | risk reversal | “free returns” with exclusions; **strong transparency** | conversion, return, complaint; copy test; full policy link |
| 67 | Size/fit evidence module | fashion era; measurements, model data, fit feedback | reduces uncertainty/returns | exclusion and bad recommendations; **contextual** | size returns, exchange, group accuracy; holdout; virtual try-on |
| 68 | Generative virtual try-on with disclosure | 2023s; synthetic visualization in PDP/search | simulation and confidence | hallucinated drape/body harm; label as visualization; **early deployed** | engagement, clickout, fit returns; controlled/category test; size guide |
| 69 | AI answer with source and freshness | 2023s; cited product answer in search/PDP | compression with verification | stale price/spec, fabricated citation; **necessary AI guardrail** | factual error, source click, correction; audited eval; Q&A |
| 70 | Agent-readable live offer | 2025s; structured item, price, stock, terms, seller | lowers machine interpretation error | feed/UI mismatch, stale inventory; **early structural standard** | mismatch/failed order; conformance test; attribute normalization |
| 71 | Scoped agent purchase mandate | 2025s; user sets item/budget/time/payment limits | delegated autonomy with control | agent exceeds intent; **emerging safety requirement** | unauthorized/disputed orders; red-team + staged pilot; confirmation |
| 72 | Agent identity indicator | 2025s; merchant/user sees which agent acts | accountability and fraud discrimination | spoofing/centralized gatekeeping; **early protocol practice** | verification/fraud/false block; protocol test; mandate |
| 73 | Pre-commit agent order review | 2025s; final human-readable total/terms before action | error catching/informed consent | defeats automation for replenishment; **context-dependent safeguard** | edit/cancel/dispute; risk-tier test; mandate |
| 74 | Conversational preference elicitation | 2023s; assistant asks budget/use/tradeoffs | preference articulation/choice reduction | leading questions, sensitive collection; **early deployed** | turns, satisfaction, constraint fit; audited A/B; guided quiz |
| 75 | Side-by-side AI comparison | 2023s; normalized candidate tradeoffs | lowers integration burden | false equivalence/omitted criteria; **early deployed** | decision confidence, error/return; expert audit; compare tray |
| 76 | “Why not this?” negative explanation | AI era; explains constraint violation/exclusion | calibrated trust and learning | verbosity/manipulation; **research gap** | override/correction, trust; lab+field test; explainable rec |
| 77 | Synthetic content provenance | genAI era; labels generated/edited imagery/copy | expectation management | labels unnoticed; **emerging policy need** | recognition, complaint, return; comprehension test; VTO |
| 78 | Recommendation diversity control | 2010s; balances relevance with variety | exploration/coverage | irrelevant novelty or homogenization; **strong recsys concern** | catalog coverage, long-run value; bandit/holdout; session reset |
| 79 | Sponsored/organic separation | search/marketplace era; labels paid placements | preserves informed relevance judgment | native camouflage; **regulatory/ethical** | label comprehension, trust, relevance; usability; ranking audit |
| 80 | Persistent long-term personalization holdout | ML era; never-personalized comparison cohort | measures true incremental/brand effects | opportunity cost/sample contamination; **strong causal practice** | contribution LTV, diversity, complaints; holdout; experiment ledger |

## 9. Future capability requirements (knowledge, not architecture)

The eventual AI should be trusted only if it can demonstrate the following capabilities and limits:

1. **Business/offer comprehension:** identify model, category, customer job, differentiation, price, margin, inventory, fulfillment, returns, regulation and brand constraints.
2. **Intent and channel diagnosis:** distinguish declared search intent from feed discovery, replenishment from gifting, expert from beginner, urgent from exploratory, and mobile context from a presumed “mobile personality.”
3. **Historical pattern retrieval with boundary conditions:** know when a pattern emerged, why, prerequisites, likely mechanism, evidence quality, transfer risks and counterexamples.
4. **Catalog and compatibility reasoning:** normalize attributes/units/variants; distinguish substitute, complement, accessory and bundle; refuse unsafe or uncertain compatibility claims.
5. **Search/recommendation literacy:** select simple baselines before complex models; understand cold start, feedback loops, exposure bias, diversity, calibration, session intent and offline/online metric gaps.
6. **Commercial mathematics:** estimate net revenue, contribution, return/fraud/support costs, incrementality, CAC/payback and cohort LTV; optimize a portfolio rather than conversion alone.
7. **Evidence and causal reasoning:** separate observation from mechanism and outcome; grade claims; design valid experiments; detect SRM, peeking, multiplicity, novelty and spillovers; preserve null results.
8. **Competitor field research:** run reproducible, ethical multi-persona inspections; preserve dated evidence; infer commercial logic without turning prevalence into proof.
9. **Customer-research humility:** synthesize real qualitative/quantitative evidence but never present synthetic personas or model predictions as actual customers.
10. **Trust/safety/privacy judgment:** use data minimization; identify dark patterns; respect cancellation/review/endorsement rules; balance authentication with false declines; require honest price, seller, agent and generated-content disclosure.
11. **Cross-channel/service reasoning:** connect page promises with inventory, delivery, pickup, substitution, returns, contact center and loyalty reality.
12. **AI-commerce literacy:** ingest and validate machine-readable offers, reason about freshness and provenance, disclose uncertainty, preserve user purchase mandates and provide human-readable review/redress.
13. **Accessibility and cultural adaptation:** treat accessibility as a functional sales constraint; test language, payment, COD, address, delivery and trust expectations locally rather than translating U.S. patterns.
14. **Brand and time-horizon reasoning:** forecast impact on trust, satisfaction, retained contribution and brand distinctiveness, not only next-session revenue.
15. **Abstention and escalation:** say “unknown,” request missing economics or catalog facts, flag legal review and refuse deceptive optimization.

### What remains genuinely unknown

- The causal long-term effect of conversational shopping assistants on choice diversity, seller concentration, returns, price sensitivity and brand memory.
- Whether agent protocols converge or remain platform-specific, and how ranking neutrality, fees, redress and liability will work.
- Reliable incremental value of generative product imagery and virtual try-on across body types/categories after returns are counted.
- Whether LLM explanations improve calibrated trust or merely persuasive confidence.
- Cross-cultural tolerance for delegated purchase, personalized price/offers and agent memory.
- Net profit impact of social/live commerce after creator commission, subsidies, returns and novelty decay.
- How to evaluate dynamic interfaces when every shopper may receive a different information sequence.
- Fair methods for return-risk, fraud and propensity models that do not create proxy discrimination or self-fulfilling exposure loops.

## 10. Deliverable coverage matrix

| # | Master deliverable | Existing coverage verdict | This supplement contribution | Remaining work after union merge |
|---:|---|---|---|---|
| 1 | Executive overview | Partial | Evidence-bounded synthesis and decision conclusion | Merge domain-wide conclusions |
| 2 | Historical timeline | Thin | Detailed prehistory–2026 causal chronology | Add more regional milestones and exact payments/logistics dates |
| 3 | Evolution map | Partial | Constraint→capability transitions and channel table | Visual map in final |
| 4 | Consumer psychology KB | Moderate | Channel/intent differences and uncertainty framing | Full construct-by-construct evidence tables |
| 5 | Behavioral economics KB | Moderate | Avoids causal overclaim; adds applied boundaries | Complete every named bias with studies/sample sizes |
| 6 | Visual sales design KB | Partial | Mobile and AI visualization implications | Full eye/color/type evidence review |
| 7 | Pricing KB | Partial | Total cost, price history, promotion incrementality | Complete pricing-study evidence matrix |
| 8 | Merchandising KB | Partial | Assortment, facets, omnichannel and profit constraints | Category-specific playbooks |
| 9 | Recommendation/upsell/cross-sell KB | Thin | Taxonomy, methods, basket decision rule, metrics | More counterfactual/bandit research |
| 10 | Product-page KB | Moderate | AI answers, compatibility, fit, fulfillment patterns | Category matrices |
| 11 | Cart/checkout KB | Moderate | Wallet, risk authentication, script safety, total cost | More independent checkout study evidence |
| 12 | Post-purchase/retention KB | Thin | replenishment, subscription control, long-term economics | Service recovery and loyalty research |
| 13 | Competitor-intelligence framework | Missing | Reproducible evidence and logic worksheet | Pilot on named companies |
| 14 | ≥150 sales-pattern library | Far short (20) | Adds 60 distinct entries (#21–80) | Need ≥70 more after deduplication |
| 15 | Digital sales ontology | Partial | Adds offer/agent/compatibility/exposure concepts implicitly | Formal relation table and controlled vocabulary |
| 16 | Evidence matrix | Missing | Verdicts and claim boundaries throughout | Consolidated claim-level matrix across all sections |
| 17 | Dark-pattern/ethics matrix | Partial | DSA, FTC reviews/subscriptions, cancellation and disclosure | Jurisdiction-specific legal review |
| 18 | Analytics/experimentation framework | Thin | Measurement contract, profit tree, validity protocol | Sample-size examples and metric dictionary |
| 19 | AI-era commerce review | Speculative | Dated 2023–2026 launch evidence and maturity verdicts | Independent outcome studies as they emerge |
| 20 | Future agent capability requirements | Partial | 15 knowledge/capability classes, no architecture | Prioritize/acceptance-test in later phase |
| 21 | Research gaps | Thin | Eight concrete empirical gaps | Maintain living registry |
| 22 | Source library | Missing | Tiered, direct-link library below | Add sources from other drafts; citation audit |

## 11. Source library

### Tier A — primary government, standards and regulatory sources

1. U.S. Census Bureau (2020), **Annual Retail Trade Survey: retail and ecommerce series 1998–2020** — historical market measurement. https://www.census.gov/data/tables/2020/econ/arts/annual-report.html
2. U.S. Census Bureau (2026), **Quarterly Retail E-Commerce Sales** — current official series. https://www.census.gov/retail/mrts/www/data/pdf/ec_current.pdf
3. Federal Trade Commission (2024), **Final Rule Banning Fake Reviews and Testimonials** — reviews, incentives, suppression, insider and fake influence rules. https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials
4. FTC/ICPEN/GPEN (2024), **Subscription/privacy dark-pattern sweep (642 sites/apps)** — observational enforcement research with explicit legal caveat. https://www.ftc.gov/news-events/news/press-releases/2024/07/ftc-icpen-gpen-announce-results-review-use-dark-patterns-affecting-subscription-services-privacy
5. European Union (2016), **GDPR, Regulation (EU) 2016/679** — lawful/fair processing, purpose limitation, minimization, security and rights. https://eur-lex.europa.eu/eli/reg/2016/679/oj
6. European Commission (updated 2026), **Digital Services Act overview** — marketplace seller verification, ad/recommender transparency and dark-pattern ban. https://digital-strategy.ec.europa.eu/en/policies/digital-services-act
7. PCI Security Standards Council (2025), **Payment Page Security and Preventing E-Skimming** — ecommerce script and tamper controls. https://blog.pcisecuritystandards.org/new-information-supplement-payment-page-security-and-preventing-e-skimming
8. NIST (2025), **SP 800-63 Revision 4 Digital Identity Guidelines** — identity proofing, authentication, federation, security/privacy/CX. https://www.nist.gov/identity-access-management/projects/nist-special-publication-800-63-digital-identity-guidelines

### Tier A/B — peer-reviewed research and authoritative research records

9. Linden, Smith & York (2003), **Amazon.com Recommendations: Item-to-Item Collaborative Filtering**, IEEE Internet Computing 7(1), 76–80. https://doi.org/10.1109/MIC.2003.1167344
10. Hidasi et al. (2016), **Session-based Recommendations with Recurrent Neural Networks**, ICLR. https://arxiv.org/abs/1511.06939
11. Ludewig & Jannach (2018), **Evaluation of Session-based Recommendation Algorithms** — complex models versus simple baselines. https://arxiv.org/abs/1803.09587
12. Agrawal & Srikant (1994), **Fast Algorithms for Mining Association Rules**; accessible contextual overview with attribution at IBM. https://www.ibm.com/think/topics/apriori-algorithm
13. Kohavi et al. (2009), **Seven Pitfalls to Avoid When Running Controlled Experiments on the Web**, KDD. https://doi.org/10.1145/1557019.1557139
14. Dmitriev et al. (2017), **A Dirty Dozen: Twelve Common Metric Interpretation Pitfalls in Online Controlled Experiments**, KDD/Microsoft Research. https://www.microsoft.com/en-us/research/publication/a-dirty-dozen-twelve-common-metric-interpretation-pitfalls-in-online-controlled-experiments/
15. Deng et al. (2013), **Improving the Sensitivity of Online Controlled Experiments by Utilizing Pre-Experiment Data (CUPED)**, WSDM. https://doi.org/10.1145/2433396.2433413

### Tier B — official company/platform documentation and filings (existence/telemetry, not independent causality)

16. Library of Congress (2026), **E-Commerce: A Research Guide—History**. https://guides.loc.gov/e-commerce/history
17. Google (2015), **Happy 15th Birthday, AdWords**. https://adwords.googleblog.com/2015/10/happy-15th-birthday-adwords.html
18. Apple (2014), **Apple Announces Apple Pay**. https://www.apple.com/newsroom/2014/09/09Apple-Announces-Apple-Pay/
19. Shopify (2026), **About Us / milestones**. https://www.shopify.com/news/about-us
20. Google Analytics (updated 2026), **Measure Ecommerce**. https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
21. Microsoft (2025), **Experiment Best Practices: Sample Ratio Mismatch**. https://learn.microsoft.com/en-us/xbox/playfab/live-service-management/game-configuration/experiments/experimentation-keys
22. Walmart (2025), **Annual Report** — store/fulfillment omnichannel facts. https://corporate.walmart.com/content/dam/corporate/documents/newsroom/2025/04/24/walmart-releases-2025-annual-report-and-proxy-statement/walmart-inc-2025-annual-report.pdf
23. Etsy (2026), **2025 Form 10-K** — marketplace supply, buyers/sellers, app share, search and retention risks. https://investors.etsy.com/sec-filings/all-sec-filings/content/0001370637-26-000019/etsy-20251231.htm
24. Amazon (2026), **2025 Form 10-K** — marketplace, fulfillment, advertising and seller-service context. https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/amzn-20251231.htm
25. MercadoLibre (2026), **2025 Form 10-K** — integrated marketplace, logistics and fintech scale. https://investor.mercadolibre.com/open-file?file=aHR0cHM6Ly9odHRwMi5tbHN0YXRpYy5jb20vc3RvcmFnZS9tbC1jbXMtYmFja2VuZC9jbXMtZG9jdW1lbnRzLXByb2Qvc2VjLzAwMDEwOTk1OTAvMDAwMTA5OTU5MC0yNi0wMDAwMDYvZm9ybTEwLUstMDAwMTA5OTU5MC0yNi0wMDAwMDYucGRm
26. Sea Limited (2026), **FY2025 Results** — Shopee growth and economics. https://cdn.sea.com/investor/4Q2025/JcKns4LaJC8bxcQdJwXz/2026.03.03%20Sea%20Fourth%20Quarter%20and%20Full%20Year%202025%20Results.pdf
27. TikTok (2021), **New Ways to Discover and Shop / Shopify pilot**. https://newsroom.tiktok.com/new-ways-to-discover-and-shop-on-tiktok/?lang=en
28. TikTok (2023), **Introducing TikTok Shop (U.S. launch)**. https://newsroom.tiktok.com/introducing-tiktok-shop?lang=en&os=io
29. TikTok (2025), **TikTok Shop Is Where Shoppers Come to Discover** — vendor telemetry, not causal evidence. https://newsroom.tiktok.com/tiktok-shop-is-where-shoppers-come-to-discover?lang=en
30. Google (2023), **Generative AI Virtual Try-On Launch**. https://blog.google/products-and-platforms/products/shopping/ai-virtual-try-on-google-shopping/
31. Google (2024), **The New Google Shopping Is Rebuilt with AI**. https://blog.google/products-and-platforms/products/shopping/google-shopping-ai-update-october-2024/
32. Amazon (2024), **Rufus rollout**. https://www.aboutamazon.com/news/retail/how-to-use-amazon-rufus
33. OpenAI (2025), **Introducing Shopping Research in ChatGPT**. https://openai.com/index/chatgpt-shopping-research/
34. Visa (2025), **Trusted Agent Protocol**. https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html
35. Google (2026), **Universal Commerce Protocol launch**. https://blog.google/products/ads-commerce/agentic-commerce-ai-tools-protocol-retailers-platforms/
36. Google (2026), **UCP updates: live product data, carts, identity linking**. https://blog.google/products-and-platforms/products/shopping/ucp-updates/
37. OpenAI (2026), **Powering Product Discovery with expanded Agentic Commerce Protocol**. https://openai.com/index/powering-product-discovery-in-chatgpt/
38. Amazon (2026), **Generative and Agentic AI Shopping / Buy for Me** — vendor usage and association metrics. https://www.aboutamazon.com/news/retail/amazon-agentic-ai-gen-ai-shopping

## 12. Final research verdict

The strongest structural conclusions are: **(1)** trust, relevance, price/fulfillment clarity, control and recoverability repeatedly survive interface eras; **(2)** channel, product, customer and business economics determine how those principles should appear; **(3)** recommendations and persuasion must be evaluated for incremental contribution and downstream harm, not clicks; **(4)** security/privacy controls should be risk-based, transparent and proportionate; and **(5)** agentic commerce makes accurate, live, machine-readable offers and delegated authority new commercial trust objects.

The weakest current claims are that autonomous agents will broadly replace storefronts, that generative interfaces already outperform stable designs, that synthetic users can replace research, or that vendor-reported AI engagement proves incremental profit. Those claims remain **UNVERIFIABLE or PARTLY_TRUE** and belong in an experiment backlog, not a design rulebook.
