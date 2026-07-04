# API KB Index

Source: api-designer's slice of the former 178KB `core-02-BACKEND_SPECIALIST.md` monolith (shared with backend-specialist/database-architect). Kept ONLY the API-design-scoped chunk; dropped auth/sessions, data-access/ORM, caching/resilience, security/encryption, observability/jobs, microservices, and config/deployment chunks as out of scope for this agent.

| Chunk | Load this when... |
|-------|--------------------|
| `api-kb-01-rest-graphql-grpc.md` | CORS (all 8 patterns), security headers/CSP nonce (all 13 headers), GraphQL security basics, gRPC auth, API versioning strategies, API gateway security, webhook security, compression, OpenAPI/Swagger, batch requests, deprecation strategy, HATEOAS |

For deep GraphQL-specific attack defenses (depth limits, cost analysis, field auth) see `graphql-security.md`. For REST naming/status-code/pagination/MCP-server conventions see `ecc-api-design-patterns.md`.
