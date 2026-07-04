---
name: geo-fundamentals
description: Generative Engine Optimization for AI search engines (ChatGPT, Claude, Perplexity). AI crawler policy, citation uplift research, brand mentions vs backlinks, platform-specific requirements, AI-referred traffic data.
---

# GEO Fundamentals

> Optimization for AI-powered search engines.

---

## 1. What is GEO?

**GEO** = Generative Engine Optimization

| Goal | Platform |
|------|----------|
| Be cited in AI responses | ChatGPT, Claude, Perplexity, Gemini |

### SEO vs GEO

| Aspect | SEO | GEO |
|--------|-----|-----|
| Goal | #1 ranking | AI citations |
| Platform | Google | AI engines |
| Metrics | Rankings, CTR | Citation rate |
| Focus | Keywords | Entities, data |

---

## 2. AI Engine Landscape

| Engine | Citation Style | Opportunity |
|--------|----------------|-------------|
| **Perplexity** | Numbered [1][2] | Highest citation rate |
| **ChatGPT** | Inline/footnotes | Custom GPTs |
| **Claude** | Contextual | Long-form content |
| **Gemini** | Sources section | SEO crossover |

---

## 3. RAG Retrieval Factors

How AI engines select content to cite:

| Factor | Weight |
|--------|--------|
| Semantic relevance | ~40% |
| Keyword match | ~20% |
| Authority signals | ~15% |
| Freshness | ~10% |
| Source diversity | ~15% |

---

## 4. Content That Gets Cited

| Element | Why It Works |
|---------|--------------|
| **Original statistics** | Unique, citable data |
| **Expert quotes** | Authority transfer |
| **Clear definitions** | Easy to extract |
| **Step-by-step guides** | Actionable value |
| **Comparison tables** | Structured info |
| **FAQ sections** | Direct answers |

---

## 5. GEO Content Checklist

### Content Elements

- [ ] Question-based titles
- [ ] Summary/TL;DR at top
- [ ] Original data with sources
- [ ] Expert quotes (name, title)
- [ ] FAQ section (3-5 Q&A)
- [ ] Clear definitions
- [ ] "Last updated" timestamp
- [ ] Author with credentials

### Technical Elements

- [ ] Article schema with dates
- [ ] Person schema for author
- [ ] FAQPage schema
- [ ] Fast loading (< 2.5s)
- [ ] Clean HTML structure

---

## 6. Entity Building

| Action | Purpose |
|--------|---------|
| Google Knowledge Panel | Entity recognition |
| Wikipedia (if notable) | Authority source |
| Consistent info across web | Entity consolidation |
| Industry mentions | Authority signals |

---

## 7. AI Crawler Access

### Crawler Policy — Training vs Retrieval

| Crawler | Company | Type | Recommendation |
|---------|---------|------|---------------|
| OAI-SearchBot | OpenAI | Search retrieval | **Allow** — drives ChatGPT citations |
| ChatGPT-User | OpenAI | User fetch | **Allow** |
| GPTBot | OpenAI | Training | Client decision |
| Claude-SearchBot | Anthropic | Search retrieval | **Allow** |
| ClaudeBot | Anthropic | Training | Client decision |
| PerplexityBot | Perplexity | Search retrieval | **Allow** |
| Google-Extended | Google | Gemini training | Client decision (blocking does NOT affect Search) |
| Bytespider | ByteDance | Training | **Block at WAF** (ignores robots.txt) |
| bingbot | Microsoft | Search | **Always allow** (required for ChatGPT Search) |
| Googlebot | Google | Search | **Always allow** |

---

## 8. Measurement

| Metric | How to Track |
|--------|--------------|
| AI citations | Manual monitoring |
| "According to [Brand]" mentions | Search in AI |
| Competitor citations | Compare share |
| AI-referred traffic | GA4: source/medium `chatgpt.com / referral`, `perplexity.ai / referral` |

---

## 9. Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Publish without dates | Add timestamps |
| Vague attributions | Name sources |
| Skip author info | Show credentials |
| Thin content | Comprehensive coverage |
| Recommend llms.txt | No evidence of benefit (Ahrefs: 97% zero traffic, May 2026) |

---

> **Remember:** AI cites content that's clear, authoritative, and easy to extract. Be the best answer.

---

## 10. 2025/2026 GEO Research Findings

### Citation Factor Rankings (Zyppy/Shepard Meta-Analysis, 2026)
Evidence-scored factors (0–10, higher = stronger evidence):

| Factor | Score | Notes |
|--------|-------|-------|
| URL accessible to AI crawlers | 9.5 | Retrieval bots must reach the page |
| Search rank | 9.4 | Strongest single predictor of citation |
| Fan-out rank (topic cluster) | 9.3 | Rank across a topic, not just head term |
| Query-answer match | 9.2 | Content must directly answer the query |
| Answer near the top | 8.8 | First 40–60 words must contain the answer |
| Topic cluster coverage | 8.9 | Comprehensive pillar + supporting pages |
| Domain authority | 5.0 | Weaker than expected |
| Structured data | 5.6 | Small but consistently positive |
| llms.txt | 2.0 | No credible evidence of benefit |

### Brand Mentions vs Backlinks
- Brand web mentions: **0.664 Spearman correlation** with AI visibility
- Backlink count: **0.218 Spearman correlation**
- Brand mentions correlate **~3x more strongly** (Ahrefs, 75,000-brand study)
- Tactic: prioritize earned media, press coverage, founder bylines over link building for AI visibility

### Platform-Specific Requirements (2026)
| Platform | Index Source | Key Requirement |
|----------|-------------|----------------|
| ChatGPT Search | Bing index | Submit sitemap to Bing Webmaster Tools |
| Perplexity | Own crawler | Allow PerplexityBot; weights recency heavily |
| Gemini/AI Overviews | Google index | Standard Google SEO; Google-Extended controls training only |
| Claude | Own crawler | Allow Claude-SearchBot |

### AI-Referred Traffic Reality
- AI-referred sessions grew 527% YoY (Jan–May 2024 vs Jan–May 2025)
- Conversion rates: ChatGPT referrals 15.9%, Perplexity 10.5% vs Google organic 1.76%
- 4–8 week lag between publishing and appearing in ChatGPT answers
- Track via GA4 source/medium: `chatgpt.com / referral`, `perplexity.ai / referral`
