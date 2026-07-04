## CONNECTION POOLING

### Pattern 1: PostgreSQL Connection Pool (pg)

**File:** `lib/db/pool.ts`

```typescript
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  
  // Pool configuration
  max: 20,                    // Maximum number of clients
  min: 5,                     // Minimum number of clients
  idleTimeoutMillis: 30000,  // Close idle clients after 30s
  connectionTimeoutMillis: 2000, // Wait 2s for connection
  
  // SSL configuration (production only)
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }
    : false
})

// Error handling
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
})

// Pool statistics (for monitoring)
export function getPoolStats() {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount
  }
}

export default pool
```

### Pattern 2: Supabase Connection (Already Pooled)

**File:** `lib/db/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Supabase handles connection pooling automatically
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
```

---


---

## SQL INJECTION PREVENTION

### Pattern 1: Parameterized Queries (pg-postgres) ✅ SAFE

```typescript
import pool from '@/lib/db/pool'

// ✅ SAFE: Parameterized query
export async function getUserByEmail(email: string) {
  const query = 'SELECT * FROM users WHERE email = $1 AND status = $2'
  const values = [email, 'active']
  
  const result = await pool.query(query, values)
  return result.rows[0]
}

// ❌ UNSAFE: String concatenation - SQL INJECTION!
export async function getUserByEmailUnsafe(email: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`
  const result = await pool.query(query)
  return result.rows[0]
}
```

### Pattern 2: Supabase Query Builder ✅ SAFE

```typescript
import { supabase } from '@/lib/db/supabase'

// ✅ SAFE: All Supabase filters are automatically parameterized
export async function searchUsers(searchTerm: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('name', `%${searchTerm}%`)
    .eq('status', 'active')
  
  return { data, error }
}
```

### Pattern 3: Prisma ORM ✅ SAFE

```typescript
import { prisma } from '@/lib/db/prisma'

// ✅ SAFE: Prisma automatically parameterizes
export async function getUser(email: string) {
  return prisma.user.findUnique({
    where: { email }
  })
}

// ✅ SAFE: Raw queries with parameters
export async function customQuery(userId: string) {
  return prisma.$queryRaw`
    SELECT * FROM users WHERE id = ${userId}
  `
}
```

### Pattern 4: Input Validation with Zod ✅ SAFE

```typescript
import { z } from 'zod'
import pool from '@/lib/db/pool'

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(18).max(120),
  role: z.enum(['admin', 'user', 'guest'])
})

export async function createUser(input: unknown) {
  // Validate input BEFORE database query
  const validated = userSchema.parse(input)
  
  const query = `
    INSERT INTO users (email, age, role)
    VALUES ($1, $2, $3)
    RETURNING *
  `
  
  const result = await pool.query(query, [
    validated.email,
    validated.age,
    validated.role
  ])
  
  return result.rows[0]
}
```

### Pattern 5: Whitelisting (Column Names, Sort Orders)

```typescript
const allowedSortColumns = ['name', 'email', 'created_at']
const allowedSortOrders = ['ASC', 'DESC']

export async function getUsers(
  sortBy: string = 'created_at',
  sortOrder: string = 'DESC'
) {
  // Validate against whitelist
  if (!allowedSortColumns.includes(sortBy)) {
    sortBy = 'created_at'
  }
  
  if (!allowedSortOrders.includes(sortOrder.toUpperCase())) {
    sortOrder = 'DESC'
  }
  
  // ✅ SAFE: Column name is whitelisted
  const query = `
    SELECT * FROM users
    ORDER BY ${sortBy} ${sortOrder}
  `
  
  const result = await pool.query(query)
  return result.rows
}
```

---


---

## COMPLETE CONNECTION POOLING (ALL 9 PATTERNS)

### Pattern 3: Connection Retry Logic with Exponential Backoff

```typescript
// lib/db/retry.ts
import { Pool, PoolClient } from 'pg'
import { logger } from '@/lib/utils/logger'

interface RetryConfig {
  maxRetries: number
  initialDelay: number
  maxDelay: number
  factor: number
}

const defaultConfig: RetryConfig = {
  maxRetries: 5,
  initialDelay: 100,
  maxDelay: 5000,
  factor: 2
}

export async function queryWithRetry<T>(
  pool: Pool,
  query: string,
  params?: any[],
  config: Partial<RetryConfig> = {}
): Promise<T[]> {
  const { maxRetries, initialDelay, maxDelay, factor } = { ...defaultConfig, ...config }

  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await pool.query(query, params)
      return result.rows as T[]
    } catch (error) {
      lastError = error as Error

      if (!isRetryableError(error)) {
        throw error
      }

      if (attempt === maxRetries) {
        logger.error('Max retries exceeded', {
          query: query.substring(0, 100),
          attempts: attempt + 1,
          error: lastError.message
        })
        throw lastError
      }

      const delay = Math.min(initialDelay * Math.pow(factor, attempt), maxDelay)

      logger.warn('Query failed, retrying', {
        attempt: attempt + 1,
        maxRetries,
        delay,
        error: lastError.message
      })

      await sleep(delay)
    }
  }

  throw lastError!
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  const retryableCodes = [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    '53300', // too_many_connections
    '57P03', // cannot_connect_now
    '08006', // connection_failure
    '08001', // sqlclient_unable_to_establish_sqlconnection
  ]

  const code = (error as any).code
  return retryableCodes.includes(code) ||
    error.message.toLowerCase().includes('connection') ||
    error.message.toLowerCase().includes('timeout')
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### Pattern 4: Connection Health Checks

```typescript
// lib/db/health.ts
import pool from '@/lib/db/pool'
import { logger } from '@/lib/utils/logger'

export interface DatabaseHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  latency: number
  poolStats: {
    total: number
    idle: number
    waiting: number
  }
  timestamp: string
  error?: string
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const startTime = Date.now()

  try {
    await pool.query('SELECT 1 as health_check')

    const latency = Date.now() - startTime
    const poolStats = {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount
    }

    let status: DatabaseHealth['status'] = 'healthy'

    if (latency > 1000) status = 'degraded'
    if (poolStats.waiting > 5) status = 'degraded'
    if (poolStats.idle === 0 && poolStats.total >= 20) status = 'degraded'

    return { status, latency, poolStats, timestamp: new Date().toISOString() }

  } catch (error) {
    logger.error('Database health check failed', { error })

    return {
      status: 'unhealthy',
      latency: Date.now() - startTime,
      poolStats: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      },
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Health check API endpoint
// app/api/health/route.ts
export async function GET() {
  const health = await checkDatabaseHealth()
  const statusCode = health.status === 'unhealthy' ? 503 : 200
  return NextResponse.json(health, { status: statusCode })
}
```

### Pattern 5: Transaction Management with Pooled Connections

```typescript
// lib/db/transactions.ts
import { Pool, PoolClient } from 'pg'
import pool from '@/lib/db/pool'
import { logger } from '@/lib/utils/logger'

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    logger.debug('Transaction started')

    const result = await callback(client)

    await client.query('COMMIT')
    logger.debug('Transaction committed')

    return result

  } catch (error) {
    await client.query('ROLLBACK')
    logger.warn('Transaction rolled back', { error })
    throw error

  } finally {
    client.release()
    logger.debug('Client released back to pool')
  }
}

// Usage - atomic multi-table updates
export async function transferFunds(
  fromUserId: string,
  toUserId: string,
  amount: number
) {
  return withTransaction(async (client) => {
    // Deduct from sender
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
      [amount, fromUserId]
    )

    // Add to receiver
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
      [amount, toUserId]
    )

    // Log transaction
    const { rows } = await client.query(
      'INSERT INTO transactions (from_user, to_user, amount) VALUES ($1, $2, $3) RETURNING *',
      [fromUserId, toUserId, amount]
    )

    return rows[0]
  })
}
```

### Pattern 6: Connection Leak Detection

```typescript
// lib/db/leak-detection.ts
import { Pool } from 'pg'
import { logger } from '@/lib/utils/logger'

export function setupLeakDetection(pool: Pool) {
  const activeClients = new Map<number, { timestamp: number; stack: string }>()

  pool.on('acquire', (client) => {
    const stack = new Error().stack || 'No stack trace'
    activeClients.set(client.processID, { timestamp: Date.now(), stack })
  })

  pool.on('release', (client) => {
    activeClients.delete(client.processID)
  })

  // Check for leaks every 30 seconds
  setInterval(() => {
    const now = Date.now()
    const leakThreshold = 60000 // 1 minute

    for (const [processID, info] of activeClients.entries()) {
      const duration = now - info.timestamp

      if (duration > leakThreshold) {
        logger.warn('Potential connection leak detected', {
          processID,
          duration,
          acquiredAt: new Date(info.timestamp).toISOString(),
          stack: info.stack
        })
      }
    }
  }, 30000)
}

// Enable in development
if (process.env.NODE_ENV === 'development') {
  setupLeakDetection(pool)
}
```

### Pattern 7: Prepared Statements (Performance)

```typescript
// lib/db/prepared.ts
import pool from '@/lib/db/pool'

// Named query configurations
const queries = {
  getUserById: {
    name: 'get_user_by_id',
    text: 'SELECT * FROM users WHERE id = $1'
  },
  getUserProjects: {
    name: 'get_user_projects',
    text: 'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC'
  },
  createAuditLog: {
    name: 'create_audit_log',
    text: 'INSERT INTO audit_logs (user_id, action, resource_type, resource_id) VALUES ($1, $2, $3, $4) RETURNING *'
  }
}

// Execute prepared query
export async function queryPrepared<T>(
  queryKey: keyof typeof queries,
  params: any[]
): Promise<T[]> {
  const config = queries[queryKey]
  const result = await pool.query(config, params)
  return result.rows as T[]
}

// Usage
const users = await queryPrepared('getUserById', ['user-123'])
```

### Pattern 8: Read Replicas (Load Balancing)

```typescript
// lib/db/replicas.ts
import { Pool } from 'pg'

const primaryPool = new Pool({
  host: process.env.DB_PRIMARY_HOST,
  max: 20
})

const replicaPools = [
  new Pool({ host: process.env.DB_REPLICA_1_HOST, max: 30 }),
  new Pool({ host: process.env.DB_REPLICA_2_HOST, max: 30 })
]

let replicaIndex = 0

export function getReadPool(): Pool {
  const pool = replicaPools[replicaIndex]
  replicaIndex = (replicaIndex + 1) % replicaPools.length
  return pool
}

export function getWritePool(): Pool {
  return primaryPool
}

// Read from replica
export async function queryRead<T>(query: string, params?: any[]): Promise<T[]> {
  const pool = getReadPool()
  const result = await pool.query(query, params)
  return result.rows
}

// Write to primary
export async function queryWrite<T>(query: string, params?: any[]): Promise<T[]> {
  const pool = getWritePool()
  const result = await pool.query(query, params)
  return result.rows
}
```

### Pattern 9: Connection Pool Monitoring Dashboard

```typescript
// lib/db/monitoring.ts
import pool from '@/lib/db/pool'
import { logger } from '@/lib/utils/logger'

export interface PoolMetrics {
  timestamp: string
  total: number
  idle: number
  active: number
  waiting: number
  maxSize: number
  utilization: number
}

const metricsHistory: PoolMetrics[] = []
const MAX_HISTORY = 1000

export function collectPoolMetrics(): PoolMetrics {
  const metrics: PoolMetrics = {
    timestamp: new Date().toISOString(),
    total: pool.totalCount,
    idle: pool.idleCount,
    active: pool.totalCount - pool.idleCount,
    waiting: pool.waitingCount,
    maxSize: 20,
    utilization: ((pool.totalCount - pool.idleCount) / 20) * 100
  }

  metricsHistory.push(metrics)
  if (metricsHistory.length > MAX_HISTORY) metricsHistory.shift()

  return metrics
}

// Start metrics collection
export function startMetricsCollection(intervalMs = 5000) {
  setInterval(() => {
    const metrics = collectPoolMetrics()

    if (metrics.utilization > 80) {
      logger.warn('High pool utilization', metrics)
    }

    if (metrics.waiting > 5) {
      logger.warn('Many connections waiting', metrics)
    }
  }, intervalMs)
}

// API endpoint for metrics
export async function GET() {
  const current = collectPoolMetrics()
  const avgUtilization = metricsHistory.reduce((sum, m) => sum + m.utilization, 0) / metricsHistory.length

  return NextResponse.json({
    current,
    averages: { utilization: avgUtilization.toFixed(2) },
    history: metricsHistory.slice(-100)
  })
}
```

### Pool Size Guidelines Table

```
| Database Tier       | Max Connections | Recommended Pool | Reserve | Use Case         |
|---------------------|-----------------|------------------|---------|------------------|
| Micro (Free)        | 60              | 15               | 45      | Dev/Testing      |
| Small               | 90              | 25               | 65      | Small production |
| Medium              | 120             | 50               | 70      | Standard prod    |
| Large               | 160             | 75               | 85      | High traffic     |
| Enterprise          | 200+            | 100+             | 100+    | Very high traffic|

Formula: Pool Size = (Max DB Connections) × 0.4 to 0.8
Conservative: 40% (leave room for PostgREST, Realtime)
Aggressive: 80% (most connections for your app)
```

---


---

## ADVANCED DATABASE PATTERNS (10 PATTERNS)

### Pattern 21: Database Sharding

```typescript
// lib/db/sharding.ts
import { Pool } from 'pg'
import crypto from 'crypto'

interface ShardConfig { id: number; host: string; port: number; database: string }

class ShardManager {
  private shards: Map<number, Pool> = new Map()
  private shardCount: number

  constructor(configs: ShardConfig[]) {
    this.shardCount = configs.length
    for (const config of configs) {
      this.shards.set(config.id, new Pool({
        host: config.host, port: config.port, database: config.database,
        user: process.env.DB_USER, password: process.env.DB_PASSWORD, max: 10,
      }))
    }
  }

  getShardId(key: string): number {
    const hash = crypto.createHash('md5').update(key).digest('hex')
    return parseInt(hash.substring(0, 8), 16) % this.shardCount
  }

  getPool(key: string): Pool {
    const shardId = this.getShardId(key)
    const pool = this.shards.get(shardId)
    if (!pool) throw new Error(`Shard ${shardId} not found`)
    return pool
  }

  async queryAll<T>(query: string, params?: any[]): Promise<T[]> {
    const results = await Promise.all(
      Array.from(this.shards.values()).map(pool => pool.query(query, params))
    )
    return results.flatMap(r => r.rows)
  }

  async queryShard<T>(shardKey: string, query: string, params?: any[]): Promise<T[]> {
    const pool = this.getPool(shardKey)
    const result = await pool.query(query, params)
    return result.rows
  }
}

export const shardManager = new ShardManager([
  { id: 0, host: 'shard0.db.local', port: 5432, database: 'app' },
  { id: 1, host: 'shard1.db.local', port: 5432, database: 'app' },
])
```

### Pattern 22: Database Partitioning

```sql
-- Range partitioning by date
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024_01 PARTITION OF orders FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE orders_2024_02 PARTITION OF orders FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- List partitioning by region
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL
) PARTITION BY LIST (region);

CREATE TABLE customers_us PARTITION OF customers FOR VALUES IN ('us-east', 'us-west');
CREATE TABLE customers_eu PARTITION OF customers FOR VALUES IN ('eu-west', 'eu-central');

-- Auto-create monthly partitions
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $$
DECLARE
  partition_date DATE := DATE_TRUNC('month', NOW() + INTERVAL '1 month');
  partition_name TEXT := 'orders_' || TO_CHAR(partition_date, 'YYYY_MM');
BEGIN
  EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF orders FOR VALUES FROM (%L) TO (%L)',
    partition_name, partition_date, partition_date + INTERVAL '1 month');
END;
$$ LANGUAGE plpgsql;
```

### Pattern 23: Cache Patterns

```typescript
// lib/cache/patterns.ts
import Redis from 'ioredis'
const redis = new Redis(process.env.REDIS_URL!)

// Cache-Aside Pattern
export async function cacheAside<T>(key: string, fetchFn: () => Promise<T>, ttl: number = 3600): Promise<T> {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  const data = await fetchFn()
  await redis.setex(key, ttl, JSON.stringify(data))
  return data
}

// Read-Through Cache
class ReadThroughCache<T> {
  constructor(private prefix: string, private loader: (id: string) => Promise<T>, private ttl: number = 3600) {}

  async get(id: string): Promise<T | null> {
    const key = `${this.prefix}:${id}`
    const cached = await redis.get(key)
    if (cached) return JSON.parse(cached)

    const data = await this.loader(id)
    if (data) await redis.setex(key, this.ttl, JSON.stringify(data))
    return data
  }

  async invalidate(id: string): Promise<void> { await redis.del(`${this.prefix}:${id}`) }
}

// Write-Through Cache
class WriteThroughCache<T> {
  constructor(private prefix: string, private writer: (id: string, data: T) => Promise<void>, private ttl: number = 3600) {}

  async set(id: string, data: T): Promise<void> {
    await Promise.all([
      redis.setex(`${this.prefix}:${id}`, this.ttl, JSON.stringify(data)),
      this.writer(id, data),
    ])
  }
}

export const userCache = new ReadThroughCache<any>('user', async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return rows[0]
})
```

### Pattern 24: Database Migration Framework

```typescript
// lib/db/migrations.ts
interface Migration { version: number; name: string; up: string; down: string }

class MigrationRunner {
  constructor(private pool: any) {}

  async initialize(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
  }

  async getCurrentVersion(): Promise<number> {
    const { rows } = await this.pool.query('SELECT MAX(version) as version FROM migrations')
    return rows[0].version || 0
  }

  async migrate(migrations: Migration[], targetVersion?: number): Promise<void> {
    const currentVersion = await this.getCurrentVersion()
    const target = targetVersion ?? Math.max(...migrations.map(m => m.version))

    if (target > currentVersion) {
      const toApply = migrations.filter(m => m.version > currentVersion && m.version <= target)
        .sort((a, b) => a.version - b.version)

      for (const migration of toApply) {
        await this.runMigration(migration, 'up')
      }
    }
  }

  private async runMigration(migration: Migration, direction: 'up' | 'down'): Promise<void> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(direction === 'up' ? migration.up : migration.down)
      if (direction === 'up') {
        await client.query('INSERT INTO migrations (version, name) VALUES ($1, $2)', [migration.version, migration.name])
      } else {
        await client.query('DELETE FROM migrations WHERE version = $1', [migration.version])
      }
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}
```

### Pattern 25: Temporal Tables (Audit History)

```sql
-- Main table with history tracking
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products_history (
  id UUID NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_to TIMESTAMPTZ NOT NULL,
  operation TEXT NOT NULL
);

CREATE INDEX idx_products_history_id ON products_history(id);
CREATE INDEX idx_products_history_valid ON products_history(valid_from, valid_to);

CREATE OR REPLACE FUNCTION track_product_changes() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO products_history (id, name, price, valid_from, valid_to, operation)
    VALUES (OLD.id, OLD.name, OLD.price, OLD.updated_at, NOW(), 'UPDATE');
    NEW.updated_at = NOW();
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO products_history (id, name, price, valid_from, valid_to, operation)
    VALUES (OLD.id, OLD.name, OLD.price, OLD.updated_at, NOW(), 'DELETE');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_audit BEFORE UPDATE OR DELETE ON products FOR EACH ROW EXECUTE FUNCTION track_product_changes();

-- Query product at point in time
CREATE OR REPLACE FUNCTION get_product_at(product_id UUID, at_time TIMESTAMPTZ)
RETURNS TABLE(id UUID, name TEXT, price DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.price FROM products p WHERE p.id = product_id AND p.updated_at <= at_time
  UNION ALL
  SELECT h.id, h.name, h.price FROM products_history h WHERE h.id = product_id AND h.valid_from <= at_time AND h.valid_to > at_time
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```


### Pattern 27-30: Additional Database Patterns

```typescript
// Pattern 27: Soft Deletes
export async function softDelete(table: string, id: string, deletedBy: string): Promise<void> {
  await pool.query(`UPDATE ${table} SET deleted_at = NOW(), deleted_by = $1 WHERE id = $2`, [deletedBy, id])
}

export async function restore(table: string, id: string): Promise<void> {
  await pool.query(`UPDATE ${table} SET deleted_at = NULL, deleted_by = NULL WHERE id = $1`, [id])
}

// Pattern 28: Optimistic Locking
export async function updateWithOptimisticLock<T>(
  table: string, id: string, updates: Partial<T>, expectedVersion: number
): Promise<T | null> {
  const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 3}`).join(', ')
  const result = await pool.query(
    `UPDATE ${table} SET ${setClause}, version = version + 1 WHERE id = $1 AND version = $2 RETURNING *`,
    [id, expectedVersion, ...Object.values(updates)]
  )
  if (result.rowCount === 0) throw new Error('Record was modified by another transaction')
  return result.rows[0]
}

// Pattern 29: Secure Query Builder
class SecureQueryBuilder {
  private table: string
  private conditions: string[] = []
  private params: any[] = []

  constructor(table: string) {
    const allowedTables = ['users', 'posts', 'orders']
    if (!allowedTables.includes(table)) throw new Error('Invalid table')
    this.table = table
  }

  where(column: string, operator: '=' | '>' | '<', value: any): this {
    if (!/^[a-zA-Z_]\w*$/.test(column)) throw new Error('Invalid column')
    this.params.push(value)
    this.conditions.push(`${column} ${operator} $${this.params.length}`)
    return this
  }

  async execute<T>(): Promise<T[]> {
    const sql = `SELECT * FROM ${this.table} ${this.conditions.length ? 'WHERE ' + this.conditions.join(' AND ') : ''}`
    const result = await pool.query(sql, this.params)
    return result.rows
  }
}

// Pattern 30: Connection Health Check
export async function checkDatabaseHealth() {
  const startTime = Date.now()
  try {
    await pool.query('SELECT 1')
    return { status: 'healthy', latency: Date.now() - startTime }
  } catch {
    return { status: 'unhealthy', latency: Date.now() - startTime }
  }
}
```

---

