# Backend KB Index

Source: former monolith `core-02-BACKEND_SPECIALIST.md` (178KB), chunked topic-wise. Load only the chunk you need.

| Chunk | Load this when... |
|-------|--------------------|
| `backend-kb-01-auth-sessions.md` | Building JWT auth, login/refresh/logout endpoints, middleware, RS256 asymmetric JWT, refresh-token family rotation with reuse detection |
| `backend-kb-02-rls-multitenancy.md` | Writing Supabase/Postgres Row-Level Security policies (user-scoped, team-based, public+private, RBAC) or schema-per-tenant multi-tenancy |
| `backend-kb-03-api-design.md` | CORS configuration (all 8 patterns), security headers/Helmet/CSP nonce (all 13 headers), GraphQL/gRPC/versioning/gateway/webhooks/compression/OpenAPI/batch/deprecation/HATEOAS |
| `backend-kb-04-data-access-orm.md` | Connection pooling (all 9 patterns: retry, health checks, transactions, leak detection, prepared statements, read replicas, monitoring), SQL injection prevention, sharding/partitioning/cache/migrations/temporal tables |
| `backend-kb-05-caching-resilience.md` | Rate limiting (token bucket, sliding window, adaptive, fixed window, tiered), resilience patterns (retry+jitter, timeouts, fallback, load shedding) |
| `backend-kb-06-security-encryption.md` | Global/centralized error handling (all 11 patterns incl. Zod validation errors, DB error codes, graceful shutdown, Sentry), encryption (bcrypt, pgcrypto, AES-256-CBC, TLS, key management) |
| `backend-kb-07-observability-jobs.md` | Winston audit logging (all 10 patterns: query logging, security events, performance, log redaction), distributed tracing/metrics/observability |
| `backend-kb-08-microservices.md` | Service discovery, circuit breaker, bulkhead, saga, event sourcing, CQRS, sidecar, BFF, strangler fig, service mesh |
| `backend-kb-09-config-deployment.md` | Environment configuration/secrets (Zod-validated, multi-env, Vercel), feature flags, SaaS commercial use case walkthrough, production deployment checklist, activation triggers, handoff templates |

All chunks preserve full code samples from the original monolith (zero summarization retained per-pattern).
