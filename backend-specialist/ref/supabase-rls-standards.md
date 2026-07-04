# Supabase RLS Standards & Quality Gates

**Source**: claude-code-templates, everything-claude-code. Concrete numeric thresholds for production Supabase work.

## RLS Coverage & Performance Benchmarks

### Mandatory Gates
- **100% RLS coverage**: Every table holding user-sensitive data (profiles, documents, transactions, auth metadata) must have RLS enabled. Exceptions documented and approved.
- **RLS policy overhead <10ms**: Measure query time with RLS vs without; if overhead >10ms, investigate policy efficiency (see Caching section below).
- **Every policy needs positive AND negative tests**: If you write `USING (auth.uid() = user_id)`, write tests for both "user can access own row" and "user CANNOT access another user's row".
- **Migration isolation**: RLS policy changes must be backward-compatible; deploy with app-level fallback logic during transition.

### Concrete Query Response Targets
- Common-query latency (typical app read): <50ms p99
- Batch queries (10+ items): <100ms p99
- Full-table scans on large tables (>1M rows): Require index strategy + pagination

## RLS Policy Caching Pattern

**Inefficient** (recalculates per row):
```sql
CREATE POLICY "users_own_documents" ON documents
  USING ((SELECT auth.uid()) = user_id);
```

**Efficient** (caches per statement):
```sql
CREATE POLICY "users_own_documents" ON documents
  USING ((SELECT auth.uid()) = user_id);  -- Wrapped in SELECT, cached once
```

**Index every RLS policy column**:
```sql
CREATE INDEX idx_documents_user_id ON documents(user_id);  -- Indexed for RLS + performance
```

## RLS Test Template

```typescript
// Positive test: user can access own data
test('user can read own document', async () => {
  const { data, error } = await client
    .from('documents')
    .select()
    .eq('id', docId)
    .eq('user_id', userId)
  expect(error).toBeNull()
  expect(data).toHaveLength(1)
})

// Negative test: user cannot access other's data
test('user cannot read another user document', async () => {
  const { data, error } = await client
    .from('documents')
    .select()
    .eq('id', otherUserDocId)
  expect(data).toHaveLength(0)  // Query succeeds but returns no rows
})
```

## Realtime WebSocket Optimization Targets

### Latency & Throughput SLAs
- Connection establishment: <100ms
- Message delivery (e2e): <50ms average
- Payload size: <1KB average per message
- Subscription setup: <200ms

### Resilience Patterns

**Auto-reconnect with exponential backoff + jitter**:
```typescript
import { RealtimeClient } from '@supabase/realtime-js'

const client = new RealtimeClient({
  url: SUPABASE_URL,
  headers: { Authorization: `Bearer ${token}` },
  reconnectDelay: 1000,
  heartbeatInterval: 30000,
})

// Auto-reconnect fires every 30s if disconnected
client.onError = (error) => {
  console.error('Realtime error:', error)
  // App continues, client reconnects automatically
}
```

**Graceful fallback to polling** if Realtime unavailable >30s:
```typescript
if (!realtimeConnected && elapsedMs > 30000) {
  switchToPoll(5000)  // Poll every 5s until Realtime recovers
}
```

**Filtered subscriptions must respect RLS**:
```typescript
// Correct: filter applied server-side with RLS
client
  .from('documents')
  .on('*', (payload) => handleChange(payload))
  .eq('user_id', currentUserId)  // RLS prevents other users' rows
  .subscribe()

// Avoid: client-side filtering alone (incomplete RLS enforcement)
```

## Migration Safety Checklist

- [ ] New columns: nullable OR have DEFAULT value (avoid full-table rewrites)
- [ ] Index creation: use `CREATE INDEX CONCURRENTLY` (can run outside transaction)
- [ ] Renames: expand-contract pattern (add new col → backfill → dual-write app → drop old)
- [ ] RLS changes: deploy with app-level guards during transition
- [ ] Rollback tested: can roll back to previous schema state

## Performance Diagnostics

**Find top queries by execution time**:
```sql
SELECT query, calls, mean_exec_time, max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**Identify unused indexes**:
```sql
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

**Table bloat detection**:
```sql
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```
