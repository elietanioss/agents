# PostgreSQL Patterns (from everything-claude-code extraction)

**Source**: everything-claude-code → ECC skills/postgres-patterns + agents/database-reviewer.md

## Type Schema

Use these types consistently across all migrations:

| Purpose | Type | Why |
|---------|------|-----|
| IDs (auto) | `bigint` GENERATED ALWAYS AS IDENTITY | Never `int` (32-bit), never random UUID for primary key |
| IDs (explicit UUID) | `uuid` DEFAULT gen_random_uuid() | Or UUIDv7 if you need sortability |
| Strings | `text` | Never `varchar(255)` (artificial limit) |
| Timestamps | `timestamptz` | Always TZ-aware; use for `created_at`, `updated_at` |
| Money | `numeric(10,2)` | NEVER float (rounding errors); use Stripe amounts (cents) for payments |
| Booleans | `boolean` | Not bit, not int: true boolean type |
| JSON | `jsonb` | Not `json` (binary format, indexable via GIN) |

## Index Strategy (Decision Table)

| Query Pattern | Index Type | Example |
|---------------|-----------|---------|
| `col = x` | B-tree | `CREATE INDEX idx_user_email ON users(email)` |
| `col > x` OR `col BETWEEN x AND y` | B-tree | `CREATE INDEX idx_created_at ON posts(created_at)` |
| `a = x AND b > y` | B-tree composite | `CREATE INDEX idx_user_created ON posts(user_id, created_at)` — equality first |
| `jsonb @> '{"key":"value"}'` | GIN | `CREATE INDEX idx_data_gin ON posts USING GIN(data)` |
| Full-text search | tsvector GIN | `CREATE INDEX idx_search ON docs USING GIN(to_tsvector('english', content))` |
| Time-series (1M+ rows) | BRIN | `CREATE INDEX idx_ts_brin ON metrics USING BRIN(timestamp)` — saves 100x space |
| Frequent filtering | Partial | `CREATE INDEX idx_active ON users(id) WHERE deleted_at IS NULL` |
| Avoid table lookups | Covering | `CREATE INDEX idx_user_select ON posts(user_id) INCLUDE (title, created_at)` |

## RLS Performance Rule (Caching)

**DO THIS:**
```sql
CREATE POLICY "users_select_own" ON documents
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);
```

**NOT THIS** (wraps in SELECT per-row):
```sql
-- SLOW: evaluates auth.uid() for every row
USING (auth.uid() = user_id);
```

The wrapped SELECT caches `auth.uid()` per-statement (not per-row), huge difference at scale.

**Also**: Index every RLS policy column and every foreign key.
```sql
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_parent_id ON documents(parent_id);
```

## Cursor Pagination (O(1) vs O(n))

**SLOW** (OFFSET = O(n)):
```sql
SELECT * FROM posts WHERE user_id = $1 ORDER BY id LIMIT 20 OFFSET 1000;
-- Postgres reads and discards 1000 rows before returning 20
```

**FAST** (keyset = O(1)):
```sql
SELECT * FROM posts 
WHERE user_id = $1 
  AND id > $last_id 
ORDER BY id 
LIMIT 20;
-- Seeks directly to last_id via index
```

## Queue Workers (Skip Locked)

For parallel job processing:

```sql
SELECT id, data FROM job_queue
WHERE status = 'pending'
ORDER BY created_at
LIMIT 5
FOR UPDATE SKIP LOCKED;
-- SKIP LOCKED: other workers don't wait, they skip locked rows
-- ~10x throughput vs SELECT FOR UPDATE (which blocks)
```

## Deadlock Prevention

Always acquire locks in consistent order across transactions:

```sql
-- TRANSACTION 1
BEGIN;
SELECT * FROM accounts WHERE id = 'A' FOR UPDATE;
SELECT * FROM transactions WHERE id = 'T1' FOR UPDATE;
COMMIT;

-- TRANSACTION 2
BEGIN;
SELECT * FROM accounts WHERE id = 'A' FOR UPDATE;
SELECT * FROM transactions WHERE id = 'T1' FOR UPDATE;
COMMIT;

-- GOOD: Both transactions lock in same order (accounts first)
-- No deadlock possible if order is consistent
```

**Pattern**: Sort by ID before locking
```sql
SELECT * FROM accounts ORDER BY id FOR UPDATE;
SELECT * FROM transactions ORDER BY id FOR UPDATE;
```

## Connection Pool Management

```typescript
// Never hold a transaction across an external API call
// BAD:
BEGIN;
INSERT INTO orders (user_id, status) VALUES ($1, 'pending');
const payment = await stripe.paymentIntents.create(...); // BLOCKS ENTIRE POOL
UPDATE orders SET stripe_id = $1 WHERE id = $2;
COMMIT;

// GOOD:
BEGIN;
INSERT INTO orders (user_id, status) VALUES ($1, 'pending');
COMMIT;
// Now webhook can handle payment asynchronously
const payment = await stripe.paymentIntents.create(...);
BEGIN;
UPDATE orders SET stripe_id = $1 WHERE id = $2;
COMMIT;
```

## Diagnostic Queries

```sql
-- Top 10 slowest queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;

-- Table/index sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Unused indexes (low idx_scan = dead weight)
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Bloated tables (seq_scan >> idx_scan = too many full scans)
SELECT schemaname, tablename, seq_scan, seq_tup_read, idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > 1000
ORDER BY seq_scan DESC;
```

## Migration Principles

Every change is a migration. Never manual ALTER TABLE in production.

1. **Forward-only in production**: Rollback = new forward migration (never `DROP COLUMN`)
2. **DDL and DML never mixed** in one migration
3. **Test against production-sized data** (not 100 rows)
4. **Immutable once deployed** (never modify an already-deployed migration)

### Safety Checklist Per Migration

- [ ] New columns: either nullable OR have a DEFAULT (not NOT NULL without default = full table rewrite)
- [ ] Index creation: use `CONCURRENTLY` (cannot run inside transaction block)
- [ ] Column rename: use expand-contract pattern (add new → backfill → dual-write app → drop old)
- [ ] Tested rollback: can this be reversed without data loss?
- [ ] Execution time <5 min on production data size

### Example: Safe Column Rename

```sql
-- Migration 001: Add new column
ALTER TABLE users ADD COLUMN display_name TEXT;

-- Application deploy (dual-write):
// Read from old, write to both old + new
function updateUser(id, name) {
  return db.update('users', {
    name, // old column
    display_name: name // new column (dual-write)
  }).where({ id })
}

// Later, read from new column
const user = await db.query('SELECT display_name FROM users WHERE id = ?', [id])

-- Migration 002: Copy remaining data, drop old
UPDATE users SET display_name = name WHERE display_name IS NULL;
ALTER TABLE users DROP COLUMN name;
```

## Reference
- Source: `D:\prompts\data\everything-claude-code-main\everything-claude-code-main\skills\postgres-patterns\SKILL.md`
- Original agents: database-reviewer.md, database-architect.md from ECC
- Index design: https://use-the-index-luke.com/
