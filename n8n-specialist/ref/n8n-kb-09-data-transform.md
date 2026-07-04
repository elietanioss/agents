# Data Transformation

Source: core-09-workflow-automation.md Section 4 (Pattern 4.2) + Advanced Code Node Patterns (Enhancement v2.0).

## Choose the right tool by complexity
1. **Set Node** — simple field mapping, renaming, one-line calculations. Prefer this first; cheapest and most readable.
   ```json
   { "values": { "fullName": "={{$json.firstName}} {{$json.lastName}}", "email": "={{$json.email.toLowerCase()}}" } }
   ```
2. **Function Node** — JavaScript expressions for conditional logic beyond what Set can express (tiered discount calculation, etc.).
3. **Code Node** — full JavaScript, npm libraries (`lodash`, `moment`), multi-item array processing. Use when logic spans several Function-node-sized steps — consolidating into one Code node is also a performance win (see below).

## Batch processing with progress tracking (Code Node)
```javascript
const items = $input.all()
const BATCH_SIZE = 50
const results = []
for (let i = 0; i < items.length; i += BATCH_SIZE) {
  const batch = items.slice(i, i + BATCH_SIZE)
  try {
    results.push(...batch.map(item => ({ json: { ...item.json, processed: true, batchIndex: Math.floor(i/BATCH_SIZE) } })))
  } catch (error) {
    results.push({ json: { error: true, batchIndex: Math.floor(i/BATCH_SIZE), errorMessage: error.message } })
  }
}
return results
```
Batching this way keeps one failed batch from losing the whole run's results, and keeps memory bounded on large datasets — pair with the `Split in Batches` node for very large inputs instead of looping in-code.

## Performance: minimize node count and hops
- Chaining 5 separate Set nodes to add 5 fields is ~3-4x slower than one Set node adding all 5 at once — each node hop has overhead.
- Same logic applies to Function-node chains: consolidate into a single Code node when the steps are tightly related.
- For independent HTTP lookups feeding a transform, fan them out in parallel and Merge rather than requesting sequentially (see `n8n-kb-07-http-api-nodes.md`).

## Data aggregation from multiple sources
```
Parallel source nodes (HTTP/DB/Sheets) → Merge Node → Code Node (dedupe, combine arrays, calculate totals/group-by) → Set Node (structure output) → Split in Batches (if large) → Store
```
Common use: nightly cross-platform customer reconciliation — merge CRM + e-commerce + support + marketing records keyed by email, tracking which systems have seen each record (`sources: [...]`) so downstream distribution knows what's authoritative.

## Validation & sanitization (do this before it reaches storage or a downstream API)
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test($json.email)) throw new Error('Invalid email format')
const sanitize = (input) => input.replace(/[<>]/g, '').replace(/'/g, "\\'").trim()
```
Always validate format AND sanitize (strip HTML tags, escape quotes, trim/limit length) — treat every external-source field as untrusted input, not just webhook bodies.

## Reference: transformation tool comparison
| Need | n8n tool |
|------|----------|
| Simple mapping | Set Node |
| Text manipulation | Function/Code Node |
| Math | Function/Code Node |
| Date formatting | Function/Code Node (or `moment`) |
| Complex logic | Code Node |
| Array operations | Code Node |
| External libraries | Code Node (`npm_install: lodash moment`) |

Best practice: reach for Set before Function before Code — each step up costs more to read and maintain, so only escalate when the simpler tool genuinely can't express the logic.
