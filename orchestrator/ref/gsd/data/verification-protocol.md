# GSD Verification Protocol Reference
# Source: gsd-verifier.md | Apply after phase execution to confirm goal achieved.

---

## Core Principle

**Task completion ≠ Goal achievement.**
Verify that users can actually DO the thing, not just that code exists.
Three levels: artifact exists → artifact is real → artifact is connected.

---

## 3-Level Verification

### Level 1: Existence Check
```bash
# Does the file exist at the expected path?
ls -la src/components/Auth.tsx
ls -la app/api/auth/route.ts
```
PASS = file present. FAIL = MISSING status.

### Level 2: Substantive Check (not a stub)

**Minimum line counts by file type:**
| File Type | Minimum Lines |
|-----------|---------------|
| Component (.tsx) | 15+ |
| API route | 10+ |
| Hook / util | 10+ |
| Schema / migration | 5+ |

**Stub patterns (FAIL if found):**
```bash
grep -n "TODO\|FIXME\|placeholder\|not implemented\|throw new Error" <file>
grep -n "return null\|return {}\|return \[\]" <file>  # only suspicious if file is short
grep -n "// stub\|// fake\|// mock" <file>
```
PASS = meets line count AND no stub patterns. FAIL = STUB status.

### Level 3: Wired Check (connected, not orphaned)

**Import check — something imports this:**
```bash
grep -r "from.*ComponentName\|require.*componentName" src/
```

**Usage check — it's actually called:**
```bash
grep -rn "<ComponentName\|ComponentName(" src/
grep -rn "import.*from.*api/route\|fetch.*api/route" src/
```
PASS = imported AND used somewhere. FAIL = ORPHANED status.

---

## 4-State Artifact Status

| Status | Meaning | Action |
|--------|---------|--------|
| VERIFIED | Passes all 3 levels | Continue |
| STUB | Exists but not substantive | Implement fully |
| ORPHANED | Substantive but not connected | Wire into app |
| MISSING | File doesn't exist | Create |

---

## Key Link Verification Patterns

After checking individual artifacts, verify the connections between them:

| Link | Check |
|------|-------|
| Component → API | Component fetches the right endpoint |
| API → DB | Route calls the right query/table |
| Form → Handler | Submit triggers the right function |
| State → Render | State changes cause visible UI update |

```bash
# Component → API example:
grep -n "fetch\|axios\|useSWR\|useQuery" src/components/Auth.tsx

# API → DB example:
grep -n "supabase\|prisma\|db\." app/api/auth/route.ts

# Check auth middleware is applied:
grep -n "middleware\|withAuth\|getSession" app/api/auth/route.ts
```

---

## Re-Verification Mode

Run after fixing STUB/ORPHANED/MISSING artifacts:
1. Re-run Level 1 → confirm file exists
2. Re-run Level 2 → confirm not a stub (recount lines, re-grep)
3. Re-run Level 3 → confirm wired (re-grep imports and usage)
4. Update artifact status table
5. Only mark phase COMPLETE when all artifacts = VERIFIED

---

## Verification Summary Format

```
ARTIFACT VERIFICATION SUMMARY
==============================
Auth.tsx          → VERIFIED (L1✓ L2✓ L3✓)
api/auth/route.ts → VERIFIED (L1✓ L2✓ L3✓)
useAuth.ts        → ORPHANED (L1✓ L2✓ L3✗ — nothing imports it)
schema.sql        → STUB     (L1✓ L2✗ — only 3 lines)

Result: PHASE INCOMPLETE — fix ORPHANED + STUB before declaring done
```
