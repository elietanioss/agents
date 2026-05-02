---
name: deep-research
description: Multi-source deep research using firecrawl and exa MCPs. Searches the web, synthesizes findings, and delivers cited reports with source attribution. Use when the user wants thorough research on any topic with evidence and citations.
origin: ECC
---

# Deep Research

Produce thorough, cited research reports from multiple web sources using firecrawl and exa MCP tools.

## When to Activate

- User asks to research any topic in depth
- Competitive analysis, technology evaluation, or market sizing
- Due diligence on companies, investors, or technologies
- User says "research", "deep dive", "investigate", or "what's the current state of"

## MCP Requirements

At least one of:
- **firecrawl** — `firecrawl_search`, `firecrawl_scrape`, `firecrawl_crawl`
- **exa** — `web_search_exa`, `web_search_advanced_exa`, `crawling_exa`

## Workflow

### Step 1: Understand the Goal
Ask 1-2 quick clarifying questions about goal and depth. If user says "just research it" — skip ahead.

### Step 2: Plan the Research
Break the topic into 3-5 research sub-questions.

### Step 3: Execute Multi-Source Search

For EACH sub-question:

```
firecrawl_search(query: "<sub-question keywords>", limit: 8)
web_search_exa(query: "<keywords>", numResults: 8)
```

Search strategy:
- Use 2-3 different keyword variations per sub-question
- Mix general and news-focused queries
- Aim for 15-30 unique sources total
- Prioritize: academic, official, reputable news > blogs > forums

### Step 4: Deep-Read Key Sources
Fetch full content of 3-5 key sources.

### Step 5: Synthesize and Write Report

```markdown
# [Topic]: Research Report
*Generated: [date] | Sources: [N] | Confidence: [High/Medium/Low]*

## Executive Summary
[3-5 sentence overview of key findings]

## 1. [First Major Theme]
[Findings with inline citations]

## Key Takeaways
- [Actionable insight 1]

## Sources
1. [Title](url) — [one-line summary]

## Methodology
Searched [N] queries across web and news.
```

## Parallel Research with Subagents

For broad topics, launch 3 research agents in parallel — each handles 1-2 sub-questions, main session synthesizes.

## Quality Rules

1. **Every claim needs a source.** No unsourced assertions.
2. **Cross-reference.** If only one source says it, flag as unverified.
3. **Recency matters.** Prefer sources from the last 12 months.
4. **Acknowledge gaps.** Say so if you couldn't find good info on a sub-question.
5. **No hallucination.** If you don't know, say "insufficient data found."
6. **Separate fact from inference.** Label estimates, projections, and opinions clearly.
