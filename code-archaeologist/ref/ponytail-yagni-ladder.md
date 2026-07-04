# Ponytail YAGNI Refactoring & Reuse Ladder

**Philosophy**: Lazy senior developer mode — stop at the first rung that holds. Do not skip rungs.

## The 7-Rung Ladder (Stop First Fit)

### Rung 1: YAGNI (You Ain't Gonna Need It)
**Question**: Does this code need to exist?

- Check: Is it dead code? Unreachable? Vestigial from prior feature?
- Action: **Delete it**
- Marker: `// TODO: remove unused export` with link to last usage

### Rung 2: Reuse Within Codebase
**Question**: Does it already exist in this repo?

- Check: Grep for similar patterns, same logic in another module
- Action: **Reuse it**; refactor duplication away via shared function
- Marker: `// reuse: extracted to ../shared/helpers.ts:lineN`

### Rung 3: Stdlib Exists
**Question**: Does the standard library (or language built-in) already do it?

- Examples:
  - Need array shuffle? Use `Array.prototype.sort()` with comparison
  - Need UUID? Use `crypto.randomUUID()` (modern Node.js)
  - Need HTML parsing? Use `DOMParser` in browser, `jsdom` or native parser in server
  - Need date math? Use `Intl.DateTimeFormat` or platform date lib
- Action: **Use stdlib**
- Marker: `// stdlib: using built-in Array.sort for shuffle`

### Rung 4: Native Platform Feature
**Question**: Does the platform (OS, browser, runtime) have a native API?

- Examples:
  - Need native date picker? HTML `<input type="date">` before flatpickr
  - Need clipboard? Clipboard API before clipboard.js
  - Need file access? File System API before electron/ipc
  - Need geolocation? Geolocation API before external service
- Action: **Use platform API**
- Marker: `// platform: using Geolocation API instead of Google Maps`

### Rung 5: Installed Dependency Available
**Question**: Is an installed dependency (in package.json/Cargo.toml) available?

- Check: `grep "^lodash\\|^axios\\|^uuid" package.json`
- Action: **Use it**; no new deps
- Marker: `// dep: using lodash.debounce (already installed)`

### Rung 6: One-Liner Implementation
**Question**: Can this be a single line of clear code?

- Examples:
  - `const hasKey = (obj, key) => key in obj` vs building a class
  - `const clamp = (v, min, max) => Math.max(min, Math.min(max, v))` vs a full utility
- Action: **Write one line**
- Marker: `// one-liner: inline debounce factory`

### Rung 7: Minimum Viable Code
**Question**: Only then, is minimum viable code justified?

- Minimum = no premature abstraction, no "will be needed later"
- Must: handle current case + add comment with upgrade path
- Example:
  ```typescript
  // laziness: O(n²) scan, upgrade to hash-map if n > 1000
  let found = false;
  for (const item of items) {
    if (item.id === targetId) {
      found = true;
      break;
    }
  }
  ```

## Root-Cause Bug Fixing Pattern

**Symptom** → **Search** → **Fix Once** → **Verify Siblings**

### Step 1: Name the Symptom
User reports: "Button doesn't respond on retry"
- This is a **symptom**, not the bug

### Step 2: Search Every Caller
```bash
grep -r "handleRetry\|retryButton" src/
grep -r "\.retry(" src/ | grep -v "test\|mock"
```
- Find all call sites of the broken function

### Step 3: Patch Shared Function Once
- Do NOT patch every caller
- Patch the shared function with a guard at its boundary
- Why: smaller diff, one place to verify, less regression risk

Example:
```typescript
// GOOD: Fix once, at source
function checkRetryState(state) {
  if (state.retryCount > 3 && !state.hasReset) {
    return false; // gate here
  }
  return state.isReady;
}

// BAD: Fix at every caller
if (button.retryCount > 3 && !button.hasReset) { /* disabled */ }
if (modal.retryCount > 3 && !modal.hasReset) { /* disabled */ }
if (api.retryCount > 3 && !api.hasReset) { /* disabled */ }
```

### Step 4: Verify Sibling Callers Are Also Fixed
- Re-run tests for all call sites
- Check sibling features that call the same function
- One-guard approach beats per-path patching

## Intentional Simplification Markers

When you decide to stop at a specific rung (e.g., skip Rung 6, move to Rung 7), mark it:

```typescript
// laziness: using Set for O(1) lookup, not LinkedHashSet
// upgrade path: if insertion order matters, switch to Map

// laziness: string split, not full CSV parser
// upgrade path: if quoting/escaping needed, use papaparse library
```

**Benefits of markers**:
- Future reader understands the tradeoff
- Upgrade path is explicit
- Easy to find "lazy" spots when perf matters

## Quality Gate Checklist

- [ ] Code passes Rung 1: Not dead code?
- [ ] Code passes Rung 2: No duplication in repo?
- [ ] Code passes Rung 3: Stdlib insufficient?
- [ ] Code passes Rung 4: Platform API insufficient?
- [ ] Code passes Rung 5: No existing dep fits?
- [ ] Code passes Rung 6: Not a one-liner?
- [ ] Code uses Rung 7 minimally with upgrade marker?
- [ ] Root-cause bugs patched once at function boundary?
- [ ] Sibling callers verified fixed?

## Anti-Patterns (What NOT to Do)

- Rebuilding: Rebuilding a feature that exists elsewhere in the codebase
- Over-abstracting: Adding a class when a function suffices
- Premature generalization: "We might need this later"
- Per-caller patching: Fixing the same bug in 5 different places
- Unmarked laziness: No comment explaining simplification ceiling
- Skipping rungs: Not checking stdlib before installing a package

## Integration with Refactoring Workflow

When code-archaeologist engages with legacy code:
1. **Before touching**: Run through Rung 1-2 (is this code needed? already exists?)
2. **While refactoring**: Apply ladder to new code within the refactored section
3. **After refactoring**: Verify sibling callers still work (root-cause check)
4. **In PR**: Explain which rungs you stopped at and why

---

**Source**: Ponytail Framework (https://ponytail.dev/AGENTS.md)
