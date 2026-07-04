# Platform Selection & Discovery Protocol

Source: core-09-workflow-automation.md Sections 1-2. Zapier content condensed to comparison context only — this agent builds n8n, not Zapier.

## n8n vs Zapier Decision Matrix (context for when a client asks "why not Zapier")
**Recommend n8n when**: self-hosted/on-prem required; complex workflows (16+ nodes); custom node development needed; unlimited executions matter more than per-task cost; high-volume (>100K tasks/month, where n8n's fixed hosting beats Zapier's per-task pricing); data-sovereignty/compliance needs on-prem; technical team can manage infrastructure.

**Zapier is better when**: no-code business users; simple workflows (1-10 steps); need the 6,000+ pre-built app library; zero infrastructure tolerance; low-moderate volume where per-task pricing is still cheap.

**Hybrid**: many orgs use Zapier for department-level quick automations and n8n as the central high-volume/mission-critical hub, bridged via webhooks (`Department Zaps → Webhook → Central n8n Hub → On-Prem Systems`).

## n8n Complexity Tiers
- **Simple (≤5 nodes, ~35% of workflows)**: basic trigger→action, single integration. E.g. form submission → email.
- **Standard (6-15 nodes, ~45%)**: multi-system integration, 2-4 conditional branches, basic error handling. E.g. customer onboarding across CRM/email/Slack.
- **Enterprise (16+ nodes, ~20%)**: complex multi-system orchestration, 5+ conditional paths, sub-workflows, comprehensive error handling + monitoring. E.g. order fulfillment across ERP/warehouse/shipping.

## 95% Confidence Discovery Protocol
Never design a workflow below 95% confidence. Calculate it from weighted categories:
- Critical (70% total): business process/objective 15%, trigger mechanism 10%, systems/integrations 15%, data flow/transformations 10%, conditional logic 10%, error handling approach 10%
- Important (20%): volume/performance 7%, security/compliance 8%, credentials verified 5%
- Enhanced (10%): advanced patterns 3%, monitoring 3%, testing strategy 2%, documentation 2%

Threshold bands: <70% need foundational info; 70-90% core understanding but need details; 90-95% nearly ready, clarify edge cases; ≥95% ready to design.

### Discovery process
1. **Analyze user input** — identify what's already clear (process, trigger, systems, data flow, complexity, volume) and state current confidence %.
2. **Identify critical gaps** — list only what's missing to reach 95%.
3. **Ask targeted questions only** — conversational, grouped by topic, prioritized by criticality; stop once at 95%.
4. **Verify API/credential access** before designing — confirm admin access, auth type, permission level, rate limits for every system involved.
5. **Proceed to design.**

### Adaptive questioning by user signal
- **Minimal info given** ("automate something with Salesforce") → ask foundational questions first (process, trigger, connected systems, destination).
- **Detailed spec given** (trigger + systems + volume + access already stated) → confidence may already be 80%; ask only the remaining gap-fillers (error handling, conditional logic, exact data mapping).
- **Enterprise signals** (multi-tenant, HIPAA, 10K+ users, mission-critical) → ask governance questions (data sovereignty, audit logging, dev/staging/prod strategy, approval workflows, disaster recovery).
- **Technical user signals** (mentions webhook payload, rate limiting, exponential backoff) → skip basic explanations, discuss architectural patterns and advanced features directly.
- **Non-technical user signals** ("I don't know much about APIs") → plain language, offer to guide through setup step by step.

### Universal discovery question categories
Business process (what's being automated, pain points, success measure, frequency) → Trigger mechanism (app event / schedule / webhook / email / form / manual / multiple) → Systems & integration (all apps involved, data flow direction, auth status, rate limits) → Data transformations (field mapping, format changes, calculations, enrichment) → Conditional logic (IF/THEN scenarios, filters, multi-path routing) → Error handling (who's notified, retry strategy, fallback, manual review queue) → Volume & performance → Security & compliance (GDPR/HIPAA/SOC2/PCI, PII/PHI handling, audit logging) → Credentials verified → Advanced needs (loops, sub-workflows, delayed actions) → Monitoring → Testing approach → Documentation needs.
