## AUDIT LOGGING (WINSTON)

### Pattern 1: Complete Winston Configuration

**File:** `lib/utils/logger.ts`

```typescript
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// Custom log levels with colors
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
  }
}

winston.addColors(customLevels.colors)

// Custom format for structured logging
const structuredFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata(),
  winston.format.json()
)

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, metadata }) => {
    const meta = Object.keys(metadata).length ? JSON.stringify(metadata) : ''
    return `[${timestamp}] ${level}: ${message} ${meta}`
  })
)

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: customLevels.levels,
  format: structuredFormat,
  defaultMeta: {
    service: 'api',
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    hostname: process.env.HOSTNAME
  },
  transports: [
    // Error logs (daily rotation)
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true
    }),
    
    // Combined logs (daily rotation)
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true
    }),
    
    // Access logs (HTTP requests)
    new DailyRotateFile({
      filename: 'logs/access-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'http',
      maxSize: '50m',
      maxFiles: '7d',
      zippedArchive: true
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'logs/exceptions.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: 'logs/rejections.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
})

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug'
  }))
}

// Convenience methods
export const log = {
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  http: (message: string, meta?: any) => logger.http(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta)
}

export default logger
```

### Pattern 2: HTTP Request Logging (Express/Next.js)

**File:** `lib/middleware/request-logger.ts`

```typescript
import { NextRequest } from 'next/server'
import logger from '@/lib/utils/logger'

export function logRequest(
  method: string,
  path: string,
  statusCode: number,
  responseTime: number,
  meta?: Record<string, any>
) {
  logger.http('HTTP Request', {
    method,
    path,
    statusCode,
    responseTime,
    ...meta
  })
}
```

**Usage in Middleware:**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { logRequest } from '@/lib/middleware/request-logger'

export function middleware(request: NextRequest) {
  const startTime = Date.now()
  
  const response = NextResponse.next()
  
  // Log after response
  const responseTime = Date.now() - startTime
  
  logRequest(
    request.method,
    request.nextUrl.pathname,
    response.status,
    responseTime,
    {
      query: Object.fromEntries(request.nextUrl.searchParams),
      ip: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      userId: request.headers.get('x-user-id'),
      requestId: request.headers.get('x-request-id')
    }
  )
  
  return response
}
```

### Pattern 3: Security Event Logging

**File:** `lib/utils/security-logger.ts`

```typescript
import logger from '@/lib/utils/logger'
import { supabase } from '@/lib/db/supabase'

type SecurityEventType =
  | 'FAILED_LOGIN'
  | 'SUCCESSFUL_LOGIN'
  | 'PASSWORD_RESET'
  | 'PASSWORD_CHANGED'
  | 'PERMISSION_DENIED'
  | 'SUSPICIOUS_ACTIVITY'
  | 'RATE_LIMIT_EXCEEDED'
  | 'TOKEN_REUSE_DETECTED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'

interface SecurityEvent {
  type: SecurityEventType
  userId?: string
  ip: string
  userAgent: string
  details?: Record<string, any>
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export async function logSecurityEvent(event: SecurityEvent) {
  // Log to Winston
  const logLevel = event.severity === 'CRITICAL' || event.severity === 'HIGH'
    ? 'error'
    : event.severity === 'MEDIUM'
    ? 'warn'
    : 'info'
  
  logger[logLevel]('Security Event', event)
  
  // Store in database for compliance
  await supabase
    .from('security_events')
    .insert({
      event_type: event.type,
      user_id: event.userId,
      ip_address: event.ip,
      user_agent: event.userAgent,
      details: event.details,
      severity: event.severity,
      created_at: new Date().toISOString()
    })
}
```

**Usage:**

```typescript
// Failed login attempt
await logSecurityEvent({
  type: 'FAILED_LOGIN',
  userId: undefined,
  ip: request.headers.get('x-forwarded-for')!,
  userAgent: request.headers.get('user-agent')!,
  details: { email: 'user@example.com', reason: 'Invalid password' },
  severity: 'MEDIUM'
})

// Token reuse detected
await logSecurityEvent({
  type: 'TOKEN_REUSE_DETECTED',
  userId: payload.userId,
  ip: request.headers.get('x-forwarded-for')!,
  userAgent: request.headers.get('user-agent')!,
  details: { tokenId: 'abc123' },
  severity: 'HIGH'
})
```

---


---

## COMPLETE AUDIT LOGGING (ALL 10 PATTERNS)

### Pattern 4: Database Query Logging

```typescript
// lib/db/query-logger.ts
import { Pool } from 'pg'
import { logger } from '@/lib/utils/logger'

export function createLoggingPool(pool: Pool): Pool {
  const originalQuery = pool.query.bind(pool)

  pool.query = async function(...args: any[]) {
    const startTime = Date.now()
    const queryConfig = args[0]

    try {
      const result = await originalQuery(...args)
      const duration = Date.now() - startTime

      if (duration > 1000) {
        logger.warn('Slow query detected', {
          query: typeof queryConfig === 'string' ? queryConfig : queryConfig.text,
          duration,
          rows: result.rowCount
        })
      } else {
        logger.debug('Query executed', {
          query: typeof queryConfig === 'string' ? queryConfig.substring(0, 100) : queryConfig.text?.substring(0, 100),
          duration,
          rows: result.rowCount
        })
      }

      return result
    } catch (error) {
      logger.error('Query failed', {
        query: typeof queryConfig === 'string' ? queryConfig : queryConfig.text,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown'
      })
      throw error
    }
  }

  return pool
}
```

### Pattern 6: Security Event Logging

```typescript
// lib/utils/security-logger.ts
import { logger } from './logger'

export type SecurityEventType =
  | 'FAILED_LOGIN'
  | 'SUCCESSFUL_LOGIN'
  | 'PASSWORD_RESET'
  | 'PASSWORD_CHANGED'
  | 'PERMISSION_DENIED'
  | 'SUSPICIOUS_ACTIVITY'
  | 'RATE_LIMIT_EXCEEDED'
  | 'TOKEN_REUSE_DETECTED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'

export interface SecurityEvent {
  type: SecurityEventType
  userId?: string
  ip: string
  userAgent: string
  details: Record<string, any>
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export function logSecurityEvent(event: SecurityEvent) {
  const logData = { ...event, timestamp: new Date().toISOString() }

  switch (event.severity) {
    case 'CRITICAL':
    case 'HIGH':
      logger.error('Security Event', logData)
      break
    case 'MEDIUM':
      logger.warn('Security Event', logData)
      break
    case 'LOW':
      logger.info('Security Event', logData)
      break
  }
}
```

### Pattern 7: Performance Monitoring Logging

```typescript
// lib/utils/performance-logger.ts
import { logger } from './logger'

export function logPerformance(
  operation: string,
  duration: number,
  metadata?: Record<string, any>
) {
  const thresholds = { fast: 100, acceptable: 500, slow: 1000, verySlow: 5000 }

  let level: 'debug' | 'info' | 'warn' | 'error' = 'debug'

  if (duration > thresholds.verySlow) level = 'error'
  else if (duration > thresholds.slow) level = 'warn'
  else if (duration > thresholds.acceptable) level = 'info'

  logger[level]('Performance Metric', { operation, duration, ...metadata })
}

// Decorator for automatic timing
export function measurePerformance(operationName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now()

      try {
        const result = await originalMethod.apply(this, args)
        logPerformance(operationName, Date.now() - startTime, { method: propertyKey })
        return result
      } catch (error) {
        logPerformance(operationName, Date.now() - startTime, {
          method: propertyKey,
          error: error instanceof Error ? error.message : 'Unknown'
        })
        throw error
      }
    }

    return descriptor
  }
}
```

### Pattern 9: Centralized Logging Service Integration

```typescript
// lib/utils/centralized-logging.ts
import winston from 'winston'
import Transport from 'winston-transport'

// Elasticsearch Transport
class ElasticsearchTransport extends Transport {
  private endpoint: string
  private apiKey: string

  constructor(opts: any) {
    super(opts)
    this.endpoint = opts.endpoint
    this.apiKey = opts.apiKey
  }

  async log(info: any, callback: () => void) {
    setImmediate(async () => {
      try {
        await fetch(`${this.endpoint}/_doc`, {
          method: 'POST',
          headers: {
            'Authorization': `ApiKey ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...info,
            '@timestamp': new Date().toISOString(),
            environment: process.env.NODE_ENV,
            service: process.env.SERVICE_NAME
          })
        })
      } catch (error) {
        console.error('Failed to send log to Elasticsearch', error)
      }
    })
    callback()
  }
}

// Add in production
if (process.env.NODE_ENV === 'production' && process.env.ELASTICSEARCH_ENDPOINT) {
  logger.add(new ElasticsearchTransport({
    endpoint: process.env.ELASTICSEARCH_ENDPOINT,
    apiKey: process.env.ELASTICSEARCH_API_KEY
  }))
}
```

### Pattern 10: Log Redaction (Sensitive Data Masking)

```typescript
// lib/utils/log-redaction.ts
const sensitivePatterns = [
  { pattern: /password["\s:=]+([^\s,"]+)/gi, replacement: 'password: [REDACTED]' },
  { pattern: /api[_-]?key["\s:=]+([^\s,"]+)/gi, replacement: 'api_key: [REDACTED]' },
  { pattern: /token["\s:=]+([^\s,"]+)/gi, replacement: 'token: [REDACTED]' },
  { pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, replacement: 'XXXX-XXXX-XXXX-XXXX' },
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: 'XXX-XX-XXXX' }
]

export function redactSensitiveData(data: any): any {
  if (typeof data === 'string') {
    let redacted = data
    for (const { pattern, replacement } of sensitivePatterns) {
      redacted = redacted.replace(pattern, replacement)
    }
    return redacted
  }

  if (Array.isArray(data)) {
    return data.map(item => redactSensitiveData(item))
  }

  if (data && typeof data === 'object') {
    const redacted: any = {}
    for (const [key, value] of Object.entries(data)) {
      if (/password|secret|token|api[_-]?key|authorization/i.test(key)) {
        redacted[key] = '[REDACTED]'
      } else {
        redacted[key] = redactSensitiveData(value)
      }
    }
    return redacted
  }

  return data
}

// Secure logger with automatic redaction
export const secureLogger = {
  error: (msg: string, meta?: any) => logger.error(msg, meta ? redactSensitiveData(meta) : undefined),
  warn: (msg: string, meta?: any) => logger.warn(msg, meta ? redactSensitiveData(meta) : undefined),
  info: (msg: string, meta?: any) => logger.info(msg, meta ? redactSensitiveData(meta) : undefined),
  debug: (msg: string, meta?: any) => logger.debug(msg, meta ? redactSensitiveData(meta) : undefined)
}
```

---


---

## OBSERVABILITY PATTERNS (10 PATTERNS)

### Pattern 31: Distributed Tracing (OpenTelemetry)

```typescript
// lib/observability/tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { trace, SpanStatusCode } from '@opentelemetry/api'

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'api',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
})

sdk.start()

const tracer = trace.getTracer('api-tracer')

export function withTracing<T>(name: string, fn: () => Promise<T>, attributes?: Record<string, string>): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      if (attributes) Object.entries(attributes).forEach(([k, v]) => span.setAttribute(k, v))
      const result = await fn()
      span.setStatus({ code: SpanStatusCode.OK })
      return result
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message })
      span.recordException(error as Error)
      throw error
    } finally {
      span.end()
    }
  })
}
```

### Pattern 32: Metrics Collection (Prometheus)

```typescript
// lib/observability/metrics.ts
import client from 'prom-client'

client.collectDefaultMetrics({ prefix: 'app_' })

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
})

export const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
})

export const databaseQueryDuration = new client.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5],
})

export async function getMetrics() {
  return client.register.metrics()
}
```

### Pattern 33-40: Additional Observability Patterns

```typescript
// Pattern 33: Structured Logging with Correlation
import winston from 'winston'
import { AsyncLocalStorage } from 'async_hooks'

interface LogContext { requestId: string; traceId?: string; userId?: string }
const logContext = new AsyncLocalStorage<LogContext>()

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const ctx = logContext.getStore()
      return JSON.stringify({ timestamp, level, message, ...ctx, ...meta })
    })
  ),
  transports: [new winston.transports.Console()],
})

// Pattern 34: Alerting Configuration
export const alertRules = {
  highErrorRate: { condition: 'rate(errors_total[5m]) > 0.01', severity: 'critical' },
  highLatency: { condition: 'histogram_quantile(0.95, http_request_duration_seconds) > 2', severity: 'warning' },
}

// Pattern 35: SLI/SLO Definitions
export const sloDefinitions = {
  availability: { target: 0.999, window: '30d' },
  latency: { target: 0.95, threshold: 0.2 },
}

// Pattern 36: Health Check Aggregation
export async function healthCheck() {
  const checks = {
    database: await checkDatabaseHealth(),
    redis: await checkRedisHealth(),
  }
  return { status: Object.values(checks).every(c => c.status === 'healthy') ? 'healthy' : 'degraded', checks }
}

// Pattern 37: Feature Flag Integration
export async function isFeatureEnabled(flag: string, context?: { userId?: string }): Promise<boolean> {
  if (process.env[`FF_${flag.toUpperCase()}`] !== undefined) {
    return process.env[`FF_${flag.toUpperCase()}`] === 'true'
  }
  return false
}

// Pattern 38: A/B Testing
export function getExperimentVariant(userId: string, experimentId: string): 'control' | 'treatment' {
  const hash = crypto.createHash('md5').update(`${userId}:${experimentId}`).digest('hex')
  return parseInt(hash.substring(0, 8), 16) / 0xffffffff < 0.5 ? 'control' : 'treatment'
}

// Pattern 39: Performance Profiling
export function measurePerformance(operationName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now()
      try {
        return await originalMethod.apply(this, args)
      } finally {
        const duration = Date.now() - startTime
        if (duration > 1000) logger.warn('Slow operation', { operation: operationName, duration })
      }
    }
    return descriptor
  }
}

// Pattern 40: Deployment Tracking
export function getDeploymentInfo() {
  return {
    version: process.env.DEPLOYMENT_VERSION || 'unknown',
    slot: process.env.DEPLOYMENT_SLOT || 'blue',
    timestamp: process.env.DEPLOYMENT_TIMESTAMP,
  }
}
```

---

