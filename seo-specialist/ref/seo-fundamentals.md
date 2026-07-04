---
ref-name: seo-fundamentals
description: SEO fundamentals, E-E-A-T, Core Web Vitals (INP updated March 2024), technical SEO principles, schema markup types (June 2025 deprecations), ranking factors, measurement tools.
---

# SEO Fundamentals

> Principles for search engine visibility.

---

## 1. E-E-A-T Framework

| Principle | Signals |
|-----------|---------|
| **Experience** | First-hand knowledge, real examples |
| **Expertise** | Credentials, depth of knowledge |
| **Authoritativeness** | Backlinks, mentions, industry recognition |
| **Trustworthiness** | HTTPS, transparency, accurate info |

---

## 2. Core Web Vitals (Updated March 2024 — INP replaced FID)

| Metric | Target | Measures | Notes |
|--------|--------|----------|-------|
| **LCP** | < 2.5s | Loading performance | Still 2.5s — false "2.0s" claims in circulation |
| **INP** | < 200ms | ALL interactions | Replaced FID March 12, 2024; stricter |
| **CLS** | < 0.1 | Visual stability | Unchanged |

55.9% of tracked origins pass all three (May 2026 CrUX). LCP is the most common failure.

---

## 3. Technical SEO Principles

### Site Structure

| Element | Purpose |
|---------|---------|
| XML sitemap | Help crawling |
| robots.txt | Control access |
| Canonical tags | Prevent duplicates |
| HTTPS | Security signal |

### Performance

| Factor | Impact |
|--------|--------|
| Page speed | Core Web Vital |
| Mobile-friendly | Ranking factor |
| Clean URLs | Crawlability |

---

## 4. Content SEO Principles

### Page Elements

| Element | Best Practice |
|---------|---------------|
| Title tag | 50-60 chars, keyword front |
| Meta description | 150-160 chars, compelling |
| H1 | One per page, main keyword |
| H2-H6 | Logical hierarchy |
| Alt text | Descriptive, not stuffed |

### Content Quality

| Factor | Importance |
|--------|------------|
| Depth | Comprehensive coverage |
| Freshness | Regular updates |
| Uniqueness | Original value |
| Readability | Clear writing |

---

## 5. Schema Markup Types

### Active (full rich result support)
| Type | Use |
|------|-----|
| Product | E-commerce items |
| Review / AggregateRating | Ratings |
| Article | Blog posts, news |
| Organization | Company info |
| Person | Author profiles |
| LocalBusiness | Physical locations |
| FAQPage | Q&A content (gov/health sites only for rich results now) |
| BreadcrumbList | Navigation |
| Recipe | Food content |
| Event | Events |
| Video | Video content |

### Deprecated June 2025 (remove from sites — no longer generates rich results)
`Book Actions`, `Course Info`, `Claim Review`, `Estimated Salary`, `Learning Video`, `Special Announcement`, `Vehicle Listing`

### Entity Schema (new priority for AI visibility)
```json
{
  "@type": "Organization",
  "name": "Brand Name",
  "sameAs": [
    "https://www.wikidata.org/wiki/Q...",
    "https://www.linkedin.com/company/...",
    "https://en.wikipedia.org/wiki/..."
  ],
  "knowsAbout": ["topic1", "topic2"]
}
```
Helps AI engines confidently resolve who your brand is. Highest-leverage schema addition for GEO.

---

## 6. AI Content Guidelines

### What Google Looks For

| ✅ Do | ❌ Don't |
|-------|----------|
| AI draft + human edit | Publish raw AI content |
| Add original insights | Copy without value |
| Expert review | Skip fact-checking |
| Follow E-E-A-T | Keyword stuffing |

---

## 7. Ranking Factors (Prioritized)

| Priority | Factor |
|----------|--------|
| 1 | Quality, relevant content |
| 2 | Backlinks from authority sites |
| 3 | Page experience (Core Web Vitals) |
| 4 | Mobile optimization |
| 5 | Technical SEO fundamentals |

---

## 8. Measurement

| Metric | Tool |
|--------|------|
| Rankings | Search Console, Ahrefs |
| Traffic | Analytics |
| Core Web Vitals | PageSpeed Insights |
| Indexing | Search Console |
| Backlinks | Ahrefs, Semrush |

---

> **Remember:** SEO is a long-term game. Quality content + technical excellence + patience = results.
