## ROW-LEVEL SECURITY (RLS)

### Pattern 1: User-Scoped RLS (Users Only See Their Own Data)

**Database Setup:**

```sql
-- Enable RLS on table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own posts
CREATE POLICY "users_view_own_posts"
ON posts
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Users can only insert their own posts
CREATE POLICY "users_insert_own_posts"
ON posts
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Users can only update their own posts
CREATE POLICY "users_update_own_posts"
ON posts
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Users can only delete their own posts
CREATE POLICY "users_delete_own_posts"
ON posts
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
```

**Usage in API:**

```typescript
import { supabase } from '@/lib/db/supabase'

export async function getUserPosts(userId: string) {
  // RLS automatically filters to only this user's posts
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId) // Redundant but explicit
  
  return { data, error }
}
```

### Pattern 2: Team-Based RLS (Multi-Tenancy)

```sql
-- Team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  UNIQUE(team_id, user_id)
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Team members can view team projects
CREATE POLICY "team_members_view_projects"
ON projects
FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members
    WHERE user_id = auth.uid()
  )
);

-- Policy: Only owners/admins can manage projects
CREATE POLICY "owners_admins_manage_projects"
ON projects
FOR ALL
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM team_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
```

### Pattern 3: Public + Private RLS

```sql
-- Posts can be public or private
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view public posts
CREATE POLICY "anyone_view_public_posts"
ON posts
FOR SELECT
TO anon, authenticated
USING (is_public = true);

-- Policy: Users can view their own private posts
CREATE POLICY "users_view_own_posts"
ON posts
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Users can manage their own posts
CREATE POLICY "users_manage_own_posts"
ON posts
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

### Pattern 4: Role-Based RLS (RBAC)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'moderator', 'user')) DEFAULT 'user'
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all audit logs
CREATE POLICY "admins_view_all_logs"
ON audit_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Users can view their own audit logs
CREATE POLICY "users_view_own_logs"
ON audit_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
```

---


---

### Pattern 26: Multi-Tenancy

```typescript
// lib/db/multi-tenant.ts
// Row-Level Security approach
export async function queryWithTenant<T>(tenantId: string, query: string, params: any[] = []): Promise<T[]> {
  await pool.query('SET app.current_tenant = $1', [tenantId])
  const result = await pool.query(query, params)
  return result.rows
}

// Schema-per-tenant approach
class SchemaTenantManager {
  async createTenant(tenantId: string): Promise<void> {
    const schemaName = `tenant_${tenantId.replace(/-/g, '_')}`
    await pool.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`)
  }

  async getTenantPool(tenantId: string): Promise<any> {
    const schemaName = `tenant_${tenantId.replace(/-/g, '_')}`
    return new Pool({ ...baseConfig, options: `-c search_path=${schemaName}` })
  }
}

// Database-per-tenant approach
class DatabaseTenantManager {
  private pools: Map<string, any> = new Map()

  async getTenantPool(tenantId: string): Promise<any> {
    if (this.pools.has(tenantId)) return this.pools.get(tenantId)!

    const { rows } = await centralPool.query('SELECT * FROM tenant_configs WHERE tenant_id = $1', [tenantId])
    const config = rows[0]

    const pool = new Pool({ host: config.host, database: config.database, user: config.user, password: config.password })
    this.pools.set(tenantId, pool)
    return pool
  }
}

export const tenantManager = new SchemaTenantManager()
```

