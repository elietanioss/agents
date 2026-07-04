# Supabase RLS Standards (from claude-code-templates extraction)

## Numeric Quality Gates for Supabase/Postgres Work

**Source**: claude-code-templates → supabase-schema-architect.md (v2024 standards)

These are concrete, measurable standards better than prose expectations:

### Schema Standards
- **Normalization**: 3NF minimum (denormalize only for measured performance need, not assumption)
- **Naming**: snake_case throughout (tables, columns, functions)
- **Query Performance**: Common queries must return <50ms p99 latency
- **Row Security**: RLS on 100% of tables holding sensitive data (user_id, auth context, personal info)

### RLS Policy Standards
- **Performance**: RLS policy overhead <10ms per policy evaluation
- **Coverage**: EVERY RLS policy requires BOTH positive AND negative test cases
  - Positive: user can access their own rows
  - Negative: user cannot access other users' rows
- **Testing**: Automated RLS test suite must pass before deployment

### Migration Standards
- **Transactionality**: All migrations wrapped in transactions with tested rollback
- **Execution Time**: Migration execution <5 minutes (on production-sized data)
- **Backward Compatibility**: Data must survive rollback without loss

### Index Standards
- **B-tree indexing**: Use for `=` and range queries (`a = x AND b > y`)
- **Composite index ordering**: Equality columns first, then range columns
- **Covering indexes**: `INCLUDE (name, created_at)` to avoid table lookups
- **Partial indexes**: `WHERE deleted_at IS NULL` to reduce index size
- **GIN indexes**: For JSONB `@>` and tsvector full-text search

### No-Data-Loss Requirement
- Every schema change validated against rollback scenario
- Tested against production data size
- Migration can be run/rolled-back multiple times safely

## Performance Measurement

### Benchmark Your RLS Policies
```sql
-- Measure RLS overhead by comparing with/without policy
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM documents WHERE user_id = 'auth-user-id';
-- Policy overhead should be <10ms delta from unconstrained query
```

### Index Effectiveness
```sql
-- Find unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Find missing indexes (from slow query log)
SELECT query, mean_exec_time FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;
```

## RLS Policy Template (Full Example)

```sql
-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Positive test: User can select own documents
CREATE POLICY "users_can_select_own" ON documents
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

-- Negative test: User cannot select others' documents
-- (This is automatic enforcement via USING clause)

-- User can insert own documents
CREATE POLICY "users_can_insert_own" ON documents
  FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- User can update own documents
CREATE POLICY "users_can_update_own" ON documents
  FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- User can delete own documents
CREATE POLICY "users_can_delete_own" ON documents
  FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- Index every RLS column and FK
CREATE INDEX CONCURRENTLY idx_documents_user_id ON documents(user_id);
```

## Migration Safety Checklist

- [ ] **NOT NULL without default**: Add with default, backfill, then add constraint (avoid full table rewrite)
- [ ] **CREATE INDEX CONCURRENTLY**: Cannot run inside transaction block; must be separate from DDL
- [ ] **Rename via expand-contract**: 
  1. Add new column
  2. Backfill data
  3. Dual-write in application (write to old + new)
  4. Deploy application
  5. Migrate remaining data
  6. Drop old column
- [ ] **Test rollback**: Can this migration be reversed without data loss?
- [ ] **Forward-only in production**: Rollback = new forward migration, never `ALTER TABLE ... DROP COLUMN`

## Testing RLS Policies

```typescript
// Example test for Supabase RLS using Jest + Supabase SDK
import { createClient } from '@supabase/supabase-js'

const adminClient = createClient(URL, SERVICE_ROLE_KEY) // Full access
const userClient = createClient(URL, ANON_KEY, {
  global: { headers: { Authorization: `Bearer ${USER_TOKEN}` } }
}) // User scoped

describe('Documents RLS', () => {
  it('user can select own documents', async () => {
    const { data, error } = await userClient
      .from('documents')
      .select('*')
      .eq('user_id', USER_ID)
    expect(error).toBeNull()
    expect(data).toEqual([{ id: '...', user_id: USER_ID, ... }])
  })

  it('user cannot select other users documents', async () => {
    const { data, error } = await userClient
      .from('documents')
      .select('*')
      .eq('user_id', OTHER_USER_ID) // Different user
    expect(data).toEqual([]) // No results, not an error
  })
})
```

## Cursor Pagination (O(1) vs O(n))

```sql
-- WRONG: O(n) complexity, slow on large offsets
SELECT * FROM documents WHERE user_id = 'X' ORDER BY id LIMIT 20 OFFSET 1000;

-- RIGHT: O(1) complexity, keyset pagination
SELECT * FROM documents WHERE user_id = 'X' AND id > $last_id ORDER BY id LIMIT 20;

-- For queue workers, use FOR UPDATE SKIP LOCKED for ~10x throughput
SELECT * FROM job_queue
WHERE status = 'pending'
ORDER BY created_at
LIMIT 5
FOR UPDATE SKIP LOCKED;

-- Prevent deadlocks: consistent lock ordering
SELECT * FROM accounts ORDER BY id FOR UPDATE;
SELECT * FROM transactions ORDER BY id FOR UPDATE;
```

## Key Diagnostic Queries

```sql
-- Top 10 slowest queries by mean execution time
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Table size (find bloat)
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index efficiency (find unused/rarely-used indexes)
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

## Reference
- Source: `D:\prompts\data\claude-code-templates-main\claude-code-templates-main\cli-tool\components\agents\database\supabase-schema-architect.md`
- Anthropic SDK: https://supabase.com/docs/guides/auth/row-level-security
- Postgres Index Strategy: https://use-the-index-luke.com/
