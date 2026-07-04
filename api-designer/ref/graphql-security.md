# GraphQL Security Patterns (from claude-code-templates)

**Source**: claude-code-templates → graphql-security-specialist.md (API security extraction)

## GraphQL-Specific Attack Defenses

The GraphQL half of OWASP API Top 10 that REST-focused agents often miss.

### 1. Depth-Bomb Protection (Query Complexity DoS)

**Attack**: Client sends deeply nested query to exhaust server resources
```graphql
query {
  user {
    friends {
      friends {
        friends {
          friends {
            # ... 50 levels deep
            id
          }
        }
      }
    }
  }
}
```

**Defense**: Use `graphql-depth-limit` validation rule
```typescript
import { graphqlHTTP } from 'express-graphql'
import depthLimit from 'graphql-depth-limit'

app.use('/graphql', graphqlHTTP({
  schema,
  validationRules: [depthLimit(7)], // Max nesting depth
}))
```

Or in Apollo Server:
```typescript
import { ApolloServer } from '@apollo/server'
import { createGraphQLError } from '@graphql-tools/utils'

const depthLimitPlugin = {
  async parsingDidStart() {
    return async (errors) => {
      if (errors) {
        for (const err of errors) {
          if (err.message.includes('exceeds maximum depth')) {
            throw createGraphQLError('Query depth exceeded')
          }
        }
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [depthLimitPlugin],
  validationRules: [depthLimit(7)]
})
```

### 2. Query Complexity / Cost Analysis

**Attack**: Client requests massive paginated results
```graphql
query {
  users(first: 99999) {
    id
    orders(first: 99999) {
      total
    }
  }
}
```

**Defense**: Implement cost analysis with `graphql-cost-analysis`
```typescript
import costAnalysis from 'graphql-cost-analysis'

const costAnalysisPlugin = costAnalysis({
  maximumCost: 1000, // Max cost per query
  defaultCost: 1,
  defaultListItemCost: 5,
  scalarCost: { // Custom costs per field
    'String': 1,
    'Int': 1,
    'ID': 2,
  },
  objectCost: 2,
  listItemCost: 5,
})

app.use('/graphql', graphqlHTTP({
  schema,
  validationRules: [costAnalysisPlugin],
}))
```

**Query cost model**:
- Scalar field (`id`, `name`): 1 point
- Object field (`user`): 2 points
- List item (`users(first: 10)`): 5 points per item
- Total cost = sum of all fields + multipliers

```graphql
query {
  user(id: "123") {  # 0 cost (root)
    id                # 1 cost (scalar)
    name              # 1 cost (scalar)
    posts(first: 10) { # 10 * 5 = 50 cost (list of 10 objects)
      id              # 10 * 1 = 10 cost
      title           # 10 * 1 = 10 cost
      comments(first: 5) { # 10 * 5 * 5 = 250 cost
        id            # 250 cost
      }
    }
  }
}
# Total: 1 + 1 + 50 + 10 + 10 + 250 + 250 = 572 cost
```

### 3. Field-Level Authorization

**Attack**: Authenticated user requests fields they shouldn't see
```graphql
query {
  user(id: "other-user") {
    email       # Should not be visible to other users
    phoneNumber # PII leak
    ssn         # Major breach
  }
}
```

**Defense**: Schema directive for field authorization
```graphql
directive @auth(requires: Role!) on FIELD_DEFINITION

type User {
  id: ID!
  name: String!
  email: String! @auth(requires: OWN_USER)
  ssn: String! @auth(requires: ADMIN)
}

enum Role {
  OWN_USER  # Only the user themselves
  ADMIN     # Admin users only
  USER      # Any authenticated user
  PUBLIC    # Everyone
}
```

**Resolver implementation**:
```typescript
const resolvers = {
  User: {
    email: (parent, args, context) => {
      const isSelf = context.userId === parent.id
      const isAdmin = context.role === 'admin'
      if (!isSelf && !isAdmin) {
        throw new Error('Not authorized to view this field')
      }
      return parent.email
    },
    ssn: (parent, args, context) => {
      if (context.role !== 'admin') {
        throw new Error('Only admins can view SSN')
      }
      return parent.ssn
    }
  }
}
```

### 4. Error Message Sanitization

**Attack**: Error messages leak schema information
```graphql
query {
  user(id: "123") {
    internalSystemId # Field doesn't exist
  }
}

# Response: "Cannot query field 'internalSystemId' on type 'User'. 
#            Available fields: id, name, email, profileSettings, ..."
# ^ Attacker now knows the schema!
```

**Defense**: Sanitize error messages in production
```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    // In production, don't expose GraphQL internals
    if (process.env.NODE_ENV === 'production') {
      // Only expose safe messages
      if (error.originalError instanceof AuthorizationError) {
        return new GraphQLError('Not authorized')
      }
      if (error.originalError instanceof ValidationError) {
        return new GraphQLError('Invalid input')
      }
      // Generic message for unexpected errors
      return new GraphQLError('Internal server error')
    }
    // In dev, expose full error
    return error
  }
})
```

### 5. Per-Operation Rate Limiting

**Attack**: Attacker runs expensive queries repeatedly
```graphql
# Attacker sends 1000 copies of this simultaneously
query ExpensiveQuery {
  users(first: 10000) {
    orders(first: 10000) {
      items(first: 10000) {
        id
      }
    }
  }
}
```

**Defense**: Rate limit per operation, not just per endpoint
```typescript
import rateLimit from 'express-rate-limit'

const graphqlLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  keyGenerator: (req) => {
    // Rate limit per user (from auth context)
    return req.headers['authorization'] || req.ip
  },
  message: 'Too many GraphQL queries'
})

app.post('/graphql', graphqlLimiter, (req, res) => {
  // Handle GraphQL request
})

// Additional: Cost-based rate limiting
const costLimiter = (max_cost_per_min = 50000) => ({
  async parsingDidStart() {
    return async ({ schema, document }) => {
      const cost = calculateQueryCost(document, schema)
      const userCost = getUserCostThisMinute(req.userId)
      if (userCost + cost > max_cost_per_min) {
        throw new Error('Rate limit exceeded: query cost too high')
      }
    }
  }
})
```

### 6. Introspection Control

**Attack**: Client queries `__schema` to dump entire schema
```graphql
query {
  __schema {
    types {
      name
      fields {
        name
        type { name }
      }
    }
  }
}
```

**Defense**: Disable introspection in production
```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  // Only disable introspection in production; development needs it
})
```

## Complete Security Checklist

- [ ] **Depth limit**: Set to 7-10 levels (prevent query-depth DoS)
- [ ] **Cost analysis**: Implement `maximumCost` with `defaultListItemCost: 5+`
- [ ] **Field authorization**: Use `@auth` directives or resolver checks for sensitive fields
- [ ] **Error sanitization**: Only expose business-safe error messages in production
- [ ] **Rate limiting**: Implement per-user rate limits (not just per-IP)
- [ ] **Cost-based rate limiting**: Expensive queries count toward stricter limits
- [ ] **Disable introspection**: In production, prevent schema discovery
- [ ] **CORS**: Restrict GraphQL endpoint to known origins
- [ ] **CSRF protection**: Use SameSite cookies + CSRF tokens for mutations
- [ ] **Query logging**: Log all GraphQL queries for audit trails (especially mutations)
- [ ] **Mutation guards**: Require explicit confirmation headers for write operations

## Reference
- Source: `D:\prompts\data\claude-code-templates-main\claude-code-templates-main\cli-tool\components\agents\api-graphql\graphql-security-specialist.md`
- graphql-depth-limit: https://github.com/stems/graphql-depth-limit
- graphql-cost-analysis: https://github.com/pa-bru/graphql-cost-analysis
- Apollo Server security: https://www.apollographql.com/docs/apollo-server/security/
