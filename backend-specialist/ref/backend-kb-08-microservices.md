## MICROSERVICES PATTERNS (10 PATTERNS)

### Pattern 11: Service Discovery

```typescript
// lib/microservices/discovery.ts
interface ServiceInstance {
  id: string
  name: string
  host: string
  port: number
  healthCheckUrl: string
  lastHeartbeat: Date
}

class ServiceRegistry {
  private services: Map<string, ServiceInstance[]> = new Map()
  private readonly heartbeatInterval = 30000

  register(instance: ServiceInstance): void {
    const instances = this.services.get(instance.name) || []
    const existing = instances.findIndex(i => i.id === instance.id)

    if (existing >= 0) {
      instances[existing] = { ...instance, lastHeartbeat: new Date() }
    } else {
      instances.push({ ...instance, lastHeartbeat: new Date() })
    }

    this.services.set(instance.name, instances)
  }

  deregister(serviceName: string, instanceId: string): void {
    const instances = this.services.get(serviceName) || []
    this.services.set(serviceName, instances.filter(i => i.id !== instanceId))
  }

  discover(serviceName: string): ServiceInstance | null {
    const instances = this.services.get(serviceName) || []
    const healthy = instances.filter(
      i => Date.now() - i.lastHeartbeat.getTime() < this.heartbeatInterval * 2
    )

    if (healthy.length === 0) return null
    return healthy[Math.floor(Math.random() * healthy.length)]
  }

  async healthCheck(instance: ServiceInstance): Promise<boolean> {
    try {
      const response = await fetch(instance.healthCheckUrl, { signal: AbortSignal.timeout(5000) })
      return response.ok
    } catch {
      return false
    }
  }
}

export const registry = new ServiceRegistry()
```

### Pattern 12: Circuit Breaker

```typescript
// lib/microservices/circuit-breaker.ts
enum CircuitState { CLOSED = 'CLOSED', OPEN = 'OPEN', HALF_OPEN = 'HALF_OPEN' }

interface CircuitBreakerConfig {
  failureThreshold: number
  successThreshold: number
  timeout: number
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED
  private failures: number = 0
  private successes: number = 0
  private lastFailureTime: number = 0

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime >= this.config.timeout) {
        this.state = CircuitState.HALF_OPEN
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successes++
      if (this.successes >= this.config.successThreshold) {
        this.state = CircuitState.CLOSED
        this.failures = 0
        this.successes = 0
      }
    } else {
      this.failures = 0
    }
  }

  private onFailure(): void {
    this.failures++
    this.lastFailureTime = Date.now()
    if (this.failures >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN
    }
  }

  getState(): CircuitState { return this.state }
}

export const circuitBreakers = {
  userService: new CircuitBreaker({ failureThreshold: 5, successThreshold: 3, timeout: 30000 }),
  orderService: new CircuitBreaker({ failureThreshold: 5, successThreshold: 3, timeout: 30000 }),
  paymentService: new CircuitBreaker({ failureThreshold: 3, successThreshold: 2, timeout: 60000 }),
}
```

### Pattern 13: Bulkhead Pattern

```typescript
// lib/microservices/bulkhead.ts
class Bulkhead {
  private activeCount: number = 0
  private queue: Array<{ resolve: Function; reject: Function; fn: () => Promise<any> }> = []

  constructor(
    private maxConcurrent: number,
    private queueLimit: number = 100
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.activeCount < this.maxConcurrent) {
      return this.run(fn)
    }

    if (this.queue.length >= this.queueLimit) {
      throw new Error('Bulkhead queue is full')
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, fn })
    })
  }

  private async run<T>(fn: () => Promise<T>): Promise<T> {
    this.activeCount++
    try {
      return await fn()
    } finally {
      this.activeCount--
      this.processQueue()
    }
  }

  private processQueue(): void {
    if (this.queue.length > 0 && this.activeCount < this.maxConcurrent) {
      const { resolve, reject, fn } = this.queue.shift()!
      this.run(fn).then(resolve).catch(reject)
    }
  }

  getStats() {
    return { active: this.activeCount, queued: this.queue.length, max: this.maxConcurrent }
  }
}

export const bulkheads = {
  userService: new Bulkhead(10, 50),
  orderService: new Bulkhead(20, 100),
  paymentService: new Bulkhead(5, 25),
}
```

### Pattern 14: Saga Pattern (Distributed Transactions)

```typescript
// lib/microservices/saga.ts
interface SagaStep<T> {
  name: string
  execute: (context: T) => Promise<T>
  compensate: (context: T) => Promise<void>
}

class SagaOrchestrator<T> {
  private steps: SagaStep<T>[] = []
  private executedSteps: SagaStep<T>[] = []

  addStep(step: SagaStep<T>): this {
    this.steps.push(step)
    return this
  }

  async execute(initialContext: T): Promise<T> {
    let context = initialContext
    this.executedSteps = []

    try {
      for (const step of this.steps) {
        context = await step.execute(context)
        this.executedSteps.push(step)
      }
      return context
    } catch (error) {
      await this.compensate(context)
      throw error
    }
  }

  private async compensate(context: T): Promise<void> {
    for (const step of this.executedSteps.reverse()) {
      try {
        await step.compensate(context)
      } catch (error) {
        console.error(`Compensation failed for step: ${step.name}`, error)
      }
    }
  }
}

// Example usage
interface OrderContext {
  orderId: string
  userId: string
  items: any[]
  paymentId?: string
  inventoryReserved?: boolean
}

export const orderSaga = new SagaOrchestrator<OrderContext>()
  .addStep({
    name: 'reserveInventory',
    execute: async (ctx) => ({ ...ctx, inventoryReserved: true }),
    compensate: async (ctx) => { /* release inventory */ },
  })
  .addStep({
    name: 'processPayment',
    execute: async (ctx) => ({ ...ctx, paymentId: 'payment-123' }),
    compensate: async (ctx) => { /* refund payment */ },
  })
  .addStep({
    name: 'createOrder',
    execute: async (ctx) => ctx,
    compensate: async (ctx) => { /* cancel order */ },
  })
```

### Pattern 15: Event Sourcing

```typescript
// lib/microservices/event-sourcing.ts
interface DomainEvent {
  id: string
  aggregateId: string
  aggregateType: string
  eventType: string
  payload: any
  timestamp: Date
  version: number
}

class EventStore {
  async append(event: Omit<DomainEvent, 'id' | 'timestamp'>): Promise<DomainEvent> {
    const storedEvent: DomainEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }

    await pool.query(
      `INSERT INTO events (id, aggregate_id, aggregate_type, event_type, payload, version)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [storedEvent.id, storedEvent.aggregateId, storedEvent.aggregateType,
       storedEvent.eventType, JSON.stringify(storedEvent.payload), storedEvent.version]
    )

    return storedEvent
  }

  async getEvents(aggregateId: string): Promise<DomainEvent[]> {
    const { rows } = await pool.query(
      'SELECT * FROM events WHERE aggregate_id = $1 ORDER BY version ASC',
      [aggregateId]
    )
    return rows.map(r => ({ ...r, payload: JSON.parse(r.payload) }))
  }
}

class UserAggregate {
  private id: string = ''
  private email: string = ''
  private name: string = ''
  private version: number = 0

  static async fromEvents(events: DomainEvent[]): Promise<UserAggregate> {
    const user = new UserAggregate()
    for (const event of events) {
      user.apply(event)
    }
    return user
  }

  private apply(event: DomainEvent): void {
    switch (event.eventType) {
      case 'UserCreated':
        this.id = event.aggregateId
        this.email = event.payload.email
        this.name = event.payload.name
        break
      case 'UserEmailChanged':
        this.email = event.payload.newEmail
        break
    }
    this.version = event.version
  }
}

export const eventStore = new EventStore()
```

### Pattern 16: CQRS Implementation

```typescript
// lib/microservices/cqrs.ts
interface Command { type: string; payload: any; metadata: { userId: string; timestamp: Date } }
interface Query { type: string; params: any }

class CommandBus {
  private handlers: Map<string, (cmd: Command) => Promise<void>> = new Map()

  register(commandType: string, handler: (cmd: Command) => Promise<void>): void {
    this.handlers.set(commandType, handler)
  }

  async dispatch(command: Command): Promise<void> {
    const handler = this.handlers.get(command.type)
    if (!handler) throw new Error(`No handler for command: ${command.type}`)
    await handler(command)
  }
}

class QueryBus {
  private handlers: Map<string, (query: Query) => Promise<any>> = new Map()

  register(queryType: string, handler: (query: Query) => Promise<any>): void {
    this.handlers.set(queryType, handler)
  }

  async dispatch<T>(query: Query): Promise<T> {
    const handler = this.handlers.get(query.type)
    if (!handler) throw new Error(`No handler for query: ${query.type}`)
    return handler(query)
  }
}

class ReadModelProjection {
  async project(event: DomainEvent): Promise<void> {
    switch (event.eventType) {
      case 'UserCreated':
        await pool.query(
          'INSERT INTO user_read_model (id, email, name, created_at) VALUES ($1, $2, $3, $4)',
          [event.aggregateId, event.payload.email, event.payload.name, event.timestamp]
        )
        break
      case 'UserEmailChanged':
        await pool.query(
          'UPDATE user_read_model SET email = $1 WHERE id = $2',
          [event.payload.newEmail, event.aggregateId]
        )
        break
    }
  }
}

export const commandBus = new CommandBus()
export const queryBus = new QueryBus()
```

### Pattern 17: Sidecar Pattern

```typescript
// lib/microservices/sidecar.ts
interface SidecarConfig {
  serviceName: string
  servicePort: number
  features: { logging: boolean; metrics: boolean; tracing: boolean; rateLimiting: boolean }
}

class SidecarProxy {
  constructor(private config: SidecarConfig) {}

  async handleRequest(request: Request): Promise<Response> {
    const startTime = Date.now()
    const traceId = crypto.randomUUID()

    try {
      if (this.config.features.rateLimiting) {
        const allowed = await this.checkRateLimit(request)
        if (!allowed) return new Response('Rate limited', { status: 429 })
      }

      const headers = new Headers(request.headers)
      headers.set('X-Trace-ID', traceId)
      headers.set('X-Service-Name', this.config.serviceName)

      const serviceUrl = `http://localhost:${this.config.servicePort}${new URL(request.url).pathname}`
      const response = await fetch(serviceUrl, { method: request.method, headers, body: request.body })

      if (this.config.features.metrics) this.recordMetrics(request, response, Date.now() - startTime)
      if (this.config.features.logging) this.logRequest(request, response, traceId)

      return response
    } catch (error) {
      throw error
    }
  }

  private async checkRateLimit(request: Request): Promise<boolean> { return true }
  private recordMetrics(request: Request, response: Response, duration: number): void {}
  private logRequest(request: Request, response: Response, traceId: string): void {}
}
```

### Pattern 18: Backend for Frontend (BFF)

```typescript
// lib/bff/aggregator.ts
class BFFAggregator {
  constructor(private clientType: 'web' | 'mobile' | 'iot') {}

  async getDashboardData(userId: string) {
    const [user, orders, notifications] = await Promise.all([
      this.callService('user-service', `/users/${userId}`),
      this.callService('order-service', `/users/${userId}/orders?limit=5`),
      this.callService('notification-service', `/users/${userId}/unread`),
    ])

    return this.transformForClient({ user, recentOrders: orders, unreadCount: notifications.count })
  }

  private async callService(service: string, path: string) {
    const instance = registry.discover(service)
    if (!instance) throw new Error(`Service ${service} not available`)
    const response = await fetch(`http://${instance.host}:${instance.port}${path}`)
    return response.json()
  }

  private transformForClient(data: any) {
    switch (this.clientType) {
      case 'mobile':
        return { ...data, user: { id: data.user.id, name: data.user.name } }
      case 'iot':
        return { userId: data.user.id, alerts: data.unreadCount }
      default:
        return data
    }
  }
}

export const webBFF = new BFFAggregator('web')
export const mobileBFF = new BFFAggregator('mobile')
```

### Pattern 19: Strangler Fig Migration

```typescript
// lib/migration/strangler.ts
interface RoutingRule {
  path: string
  target: 'legacy' | 'new' | 'shadow'
  percentage?: number
}

class StranglerFigRouter {
  private rules: RoutingRule[] = []

  constructor(private legacyUrl: string, private newUrl: string) {}

  addRule(rule: RoutingRule): void { this.rules.push(rule) }

  async route(request: Request): Promise<Response> {
    const path = new URL(request.url).pathname
    const rule = this.rules.find(r => path.startsWith(r.path))

    if (!rule) return this.forward(request, this.legacyUrl)

    switch (rule.target) {
      case 'new': return this.forward(request, this.newUrl)
      case 'legacy': return this.forward(request, this.legacyUrl)
      case 'shadow': return this.shadowTest(request)
    }
  }

  private async forward(request: Request, baseUrl: string): Promise<Response> {
    const url = new URL(request.url)
    return fetch(`${baseUrl}${url.pathname}${url.search}`, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    })
  }

  private async shadowTest(request: Request): Promise<Response> {
    const [legacyResponse] = await Promise.all([
      this.forward(request.clone(), this.legacyUrl),
      this.forward(request.clone(), this.newUrl),
    ])
    return legacyResponse
  }
}
```

### Pattern 20: Service Mesh Configuration

```typescript
// lib/microservices/service-mesh.ts
interface MeshConfig {
  enableMtls: boolean
  retryPolicy: { attempts: number; perTryTimeout: string }
  circuitBreaker: { consecutiveErrors: number; interval: string; baseEjectionTime: string }
}

export function generateVirtualService(serviceName: string, config: MeshConfig) {
  return {
    apiVersion: 'networking.istio.io/v1beta1',
    kind: 'VirtualService',
    metadata: { name: serviceName },
    spec: {
      hosts: [serviceName],
      http: [{
        route: [{ destination: { host: serviceName } }],
        retries: { attempts: config.retryPolicy.attempts, perTryTimeout: config.retryPolicy.perTryTimeout },
        timeout: '30s',
      }],
    },
  }
}

export function generateDestinationRule(serviceName: string, config: MeshConfig) {
  return {
    apiVersion: 'networking.istio.io/v1beta1',
    kind: 'DestinationRule',
    metadata: { name: serviceName },
    spec: {
      host: serviceName,
      trafficPolicy: {
        connectionPool: { tcp: { maxConnections: 100 }, http: { http2MaxRequests: 1000 } },
        outlierDetection: {
          consecutive5xxErrors: config.circuitBreaker.consecutiveErrors,
          interval: config.circuitBreaker.interval,
          baseEjectionTime: config.circuitBreaker.baseEjectionTime,
        },
        tls: config.enableMtls ? { mode: 'ISTIO_MUTUAL' } : undefined,
      },
    },
  }
}
```

---

