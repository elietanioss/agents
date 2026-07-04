# Schema Design & Migration Patterns

**Source**: everything-claude-code, claude-code-templates. Normalization, naming, and safe migration practices.

## Column Type Selection

```typescript
// Type reference for common fields
interface TypeGuide {
  // IDs
  id: 'bigint'  // Never int (overflows at 2B); if UUID use UUIDv7 (sortable)
  parentId: 'bigint | uuid'
  
  // Strings
  email: 'text'  // Enforce length in app, not DB; allows future expansions
  title: 'text'  // Same
  
  // Timestamps
  createdAt: 'timestamptz'  // Always with timezone, stored UTC
  updatedAt: 'timestamptz'
  deletedAt: 'timestamptz | null'  // Soft deletes
  
  // Money
  price: 'numeric(10, 2)'  // Never float (rounding errors)
  balance: 'numeric(18, 2)'
  
  // Flags
  isActive: 'boolean'
  verified: 'boolean'
  
  // JSON
  metadata: 'jsonb'  // Allows indexing + querying
  config: 'jsonb'
}
```

## Normalization Strategy

**Goal**: 3rd Normal Form (3NF) minimum. Denormalize ONLY for measured performance reasons.

```sql
-- ✅ Normalized (3NF): each table represents one entity
CREATE TABLE users (
  id bigint PRIMARY KEY,
  email text UNIQUE,
  role text,  -- or enum
  created_at timestamptz
);

CREATE TABLE documents (
  id bigint PRIMARY KEY,
  user_id bigint REFERENCES users(id),
  title text,
  created_at timestamptz
);

-- ✅ Denormalized view (if query is hot path)
-- Only after measuring: SELECT documents.title, users.email is slow
CREATE INDEX idx_documents_user_email ON documents(user_id)
INCLUDE (title);
-- OR if still slow, denormalize:
-- ALTER TABLE documents ADD COLUMN user_email text;
-- UPDATE with trigger on users.email change
```

## Naming Conventions

**Columns**: snake_case, singular nouns
```sql
-- ✅ Good
id, user_id, first_name, created_at, is_active

-- ❌ Bad
userId (camelCase), users_id (plural), creation_date (not standard)
```

**Tables**: snake_case, plural
```sql
-- ✅ Good
CREATE TABLE users (...)
CREATE TABLE order_items (...)

-- ❌ Bad
CREATE TABLE User (...) -- singular
CREATE TABLE order_item (...) -- inconsistent case
```

**Indexes**: `idx_<table>_<columns>` or `idx_<table>_<purpose>`
```sql
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_user_created ON documents(user_id, created_at);
CREATE INDEX idx_documents_active ON documents(user_id) WHERE deleted_at IS NULL;
```

**Foreign keys**: `fk_<table>_<referenced_table>`
```sql
ALTER TABLE documents 
  ADD CONSTRAINT fk_documents_users 
  FOREIGN KEY (user_id) REFERENCES users(id);
```

## Soft Delete Pattern (Preserve History)

```sql
-- ✅ Soft delete: mark deleted but keep data
ALTER TABLE documents ADD COLUMN deleted_at timestamptz DEFAULT NULL;

-- Always filter out deleted rows
SELECT * FROM documents WHERE deleted_at IS NULL;

-- Index for performance
CREATE INDEX idx_documents_active ON documents(user_id, created_at) 
WHERE deleted_at IS NULL;

-- Restore if needed
UPDATE documents SET deleted_at = NULL WHERE id = ...;
```

## Migration Best Practices

### Forward-Only Migrations (Production Safe)

```sql
-- migration_001_create_users.sql
CREATE TABLE users (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- migration_002_add_documents.sql
CREATE TABLE documents (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id bigint NOT NULL REFERENCES users(id),
  title text NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Rollback = new forward migration
-- migration_003_drop_documents.sql (if needed)
DROP TABLE documents;
```

### Safe Schema Changes (No Downtime)

**Adding a nullable column** (no table rewrite):
```sql
-- ✅ Safe: nullable, no rewrite
ALTER TABLE users ADD COLUMN phone text DEFAULT NULL;
```

**Adding a NOT NULL column** (requires default):
```sql
-- ❌ Unsafe: locks table, full rewrite
ALTER TABLE users ADD COLUMN phone text NOT NULL;

-- ✅ Safe: add nullable, backfill, then make NOT NULL
ALTER TABLE users ADD COLUMN phone text DEFAULT NULL;
UPDATE users SET phone = '...' WHERE phone IS NULL;
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
```

**Renaming a column** (expand-contract pattern):
```sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN email_new text;

-- Step 2: Backfill
UPDATE users SET email_new = email;

-- Step 3: Deploy app logic to dual-write
-- UPDATE users SET email = ?, email_new = ? (same value)

-- Step 4: Verify both columns in sync (after 1 day in prod)

-- Step 5: Drop old column
ALTER TABLE users DROP COLUMN email;

-- Step 6: Rename new column
ALTER TABLE users RENAME COLUMN email_new TO email;
```

**Index creation** (concurrent, non-blocking):
```sql
-- ✅ Concurrent: doesn't lock table
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- ❌ Blocking: only for maintenance windows
CREATE INDEX idx_users_email ON users(email);
```

## Migration Testing

```bash
# Test against production-sized copy BEFORE deploying
$ pg_dump production_db > /tmp/prod_backup.sql
$ psql test_db < /tmp/prod_backup.sql
$ psql test_db < migration_004_...sql

# Measure performance
$ psql test_db -c "EXPLAIN ANALYZE SELECT ... FROM users WHERE ..."
# Verify execution time acceptable before deploying to production
```

## Multi-Tenant Isolation (Per-Tenant Tables)

**Approach 1: Schema-per-tenant** (best isolation, most overhead)
```sql
CREATE SCHEMA tenant_123;
CREATE TABLE tenant_123.documents (...);
CREATE TABLE tenant_123.users (...);

SET search_path = tenant_123;
SELECT * FROM documents;  -- Only sees tenant_123.documents
```

**Approach 2: Row-level tenant isolation** (shared tables, RLS)
```sql
ALTER TABLE documents ADD COLUMN tenant_id uuid;
CREATE POLICY tenant_isolation ON documents
  USING (tenant_id = get_tenant_id());  -- From auth context

CREATE INDEX idx_documents_tenant ON documents(tenant_id, id);
```

**Approach 3: Hybrid** (documents shared, sensitive data tenanted)
```sql
-- Shared, low-risk
CREATE TABLE documents (
  id bigint,
  content text,
  created_at timestamptz
);

-- Tenanted, sensitive
CREATE TABLE document_permissions (
  id bigint,
  document_id bigint,
  tenant_id uuid,
  permission text
);
```

## Performance & Bloat Diagnostics

**Find tables by size** (identify bloat):
```sql
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Rebuild table if bloated** (full table rewrite):
```sql
VACUUM FULL documents;  -- OR:
CLUSTER documents USING idx_documents_user_id;  -- Reclusters + reclaims space
```

**Connection pool settings** (PgBouncer for Supabase):
```ini
# pgbouncer.ini
[databases]
mydb = host=db.example.com dbname=mydb
default_pool_size = 25
min_pool_size = 10
reserve_pool_size = 5
reserve_pool_timeout = 3
```
