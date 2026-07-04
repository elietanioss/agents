# PostgreSQL Indexing Strategy & Query Optimization

**Source**: everything-claude-code. Practical indexing patterns for production Postgres.

## Index Type Selection by Query Pattern

| **Query Pattern** | **Best Index Type** | **Example SQL** |
|---|---|---|
| Exact match (`=`) | B-tree | `CREATE INDEX idx_users_email ON users(email)` |
| Range (`>`, `<`, `BETWEEN`) | B-tree | `CREATE INDEX idx_posts_created_at ON posts(created_at)` |
| Exact + Range (`a = x AND b > y`) | B-tree composite | `CREATE INDEX idx_posts_user_date ON posts(user_id, created_at)` |
| JSONB containment (`@>`) | GIN | `CREATE INDEX idx_metadata_gin ON documents USING GIN(metadata)` |
| Full-text search (`@@`) | GiST or GIN | `CREATE INDEX idx_body_fts ON documents USING GIN(to_tsvector('english', body))` |
| Time-series (append-only, large ranges) | BRIN | `CREATE INDEX idx_logs_time ON logs USING BRIN(created_at)` |

## Composite Index Design

**Principle**: Put **equality columns first**, then **range columns**.

```sql
-- Query: SELECT * FROM orders WHERE customer_id = 5 AND created_at > '2026-01-01'
-- ❌ Wrong order: range first
CREATE INDEX idx_orders_bad ON orders(created_at, customer_id)

-- ✅ Correct: equality first
CREATE INDEX idx_orders_good ON orders(customer_id, created_at)
-- This allows DB to quickly narrow to customer_id = 5, then scan range on created_at
```

## Covering Index Pattern (Avoid Table Lookup)

```sql
-- Query: SELECT name, email, created_at FROM users WHERE status = 'active'
-- ❌ Without INCLUDE: index hit, then table lookup for all 3 columns
CREATE INDEX idx_users_status ON users(status)

-- ✅ With INCLUDE: index contains all columns needed, no table lookup
CREATE INDEX idx_users_status_covering ON users(status) INCLUDE (name, email, created_at)
-- Result: "Index Only Scan" (faster)
```

## Partial Index Pattern (Filter at Index Level)

```sql
-- Use case: Only active users are queried frequently
CREATE INDEX idx_users_active ON users(email) WHERE status = 'active'
-- Result: Smaller index, faster scans for active-only queries

-- Soft-delete scenario: Always exclude deleted rows
CREATE INDEX idx_documents_active ON documents(user_id, created_at) WHERE deleted_at IS NULL
-- Queries automatically use this smaller index
```

## Index Performance Diagnostics

**Find unused/duplicate indexes** (wasted space):
```sql
SELECT schemaname, tablename, indexname, idx_scan, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC
LIMIT 20;
-- Action: Drop any index with idx_scan = 0 after 1 week of production traffic
```

**Find slow queries via statement stats**:
```sql
SELECT 
  query,
  calls,
  mean_exec_time,
  max_exec_time,
  stddev_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
-- Action: Look for mean_exec_time > 50ms on common queries
```

**Explain plan for specific query**:
```sql
EXPLAIN ANALYZE SELECT * FROM documents WHERE user_id = 5 AND created_at > '2026-01-01';
-- Look for: "Seq Scan" (bad), "Index Scan" (good), "Index Only Scan" (best)
```

## Type Table (Correct Postgres Types)

| **Use Case** | **✅ Correct Type** | **❌ Avoid** | **Why** |
|---|---|---|---|
| User/record IDs | `bigint` or `uuid` (UUIDv7) | `int`, random UUID | `int` overflows at 2B; UUIDv7 sortable |
| String data | `text` | `varchar(255)` | `text` is more efficient; impose length validation in app |
| Monetary values | `numeric(10,2)` | `float`, `double` | Float has rounding errors; `numeric` exact |
| Timestamps | `timestamptz` | `timestamp` (no TZ) | Always store UTC; `timestamptz` enforces it |
| Boolean flags | `boolean` | `int`, `char(1)` | Semantic, not ambiguous |

## RLS Performance Optimization

**Cache the `auth.uid()` call per statement** (not per row):

```sql
-- ❌ Slow: recalculates auth.uid() for every row
CREATE POLICY "users_own_docs" ON documents
  USING (auth.uid() = user_id);

-- ✅ Fast: caches auth.uid() result, reused for all rows
CREATE POLICY "users_own_docs" ON documents
  USING ((SELECT auth.uid()) = user_id);

-- ✅ Even faster: move to security definer function
CREATE FUNCTION current_user_id() RETURNS uuid AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE POLICY "users_own_docs" ON documents
  USING (current_user_id() = user_id);
```

**Index the RLS column**:
```sql
CREATE INDEX idx_documents_user_id ON documents(user_id);
-- Without this, RLS check scans entire table even for one row
```

## Cursor Pagination (O(1) vs O(n))

**❌ Offset pagination — O(n) for large pages**:
```sql
SELECT * FROM posts ORDER BY id LIMIT 20 OFFSET 2000;
-- Scans 2000 rows, throws them away, returns next 20
-- Performance: ~500ms for offset=100k
```

**✅ Cursor pagination — O(1)**:
```sql
SELECT * FROM posts WHERE id > :lastId ORDER BY id LIMIT 20;
-- Direct index lookup, returns 20 rows immediately
-- Performance: ~5ms regardless of page number
```

## Queue Worker Pattern (Max Throughput)

**Fetch 10 tasks for processing, lock them so no other worker grabs them**:
```sql
SELECT id, payload FROM job_queue
WHERE status = 'pending'
ORDER BY id
FOR UPDATE SKIP LOCKED
LIMIT 10;
-- SKIP LOCKED: Don't wait, just skip locked rows
-- Result: 10x worker throughput vs blocking locks
```

**Deadlock prevention**: Always lock rows in consistent order:
```sql
-- ❌ Worker A locks order 1, then item 5 | Worker B locks item 5, then order 1 → DEADLOCK
-- ✅ Always lock order first, then item
SELECT * FROM orders WHERE id = :orderId FOR UPDATE;
SELECT * FROM items WHERE order_id = :orderId FOR UPDATE;
```

## Migration Safety Checklist

- [ ] **New columns**: Nullable or have DEFAULT (avoid full-table rewrite)
- [ ] **Index creation**: Use `CREATE INDEX CONCURRENTLY` (runs outside txn)
- [ ] **Renames**: Expand-contract pattern (new column → backfill → dual-write → drop old)
- [ ] **Rollback tested**: Can restore from before-migration backup
- [ ] **Production sized data tested**: Run against copy of prod data
