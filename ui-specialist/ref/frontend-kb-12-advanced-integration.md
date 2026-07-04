## [SECTION 15: EDITOR INTEGRATION ENGINEERING (cross-application communication)]

===========================================
SECTION 15: EDITOR INTEGRATION ENGINEERING
===========================================

Source: agency-agents/engineering/engineering-frontend-developer.md

## 15.1 Cross-Application Communication

**Pattern 97: WebSocket Bridge for Editor Integration**
```typescript
// lib/editor-bridge.ts
// Source: engineering-frontend-developer.md - Editor Integration Engineering

type EditorCommand =
  | { type: 'openAt'; file: string; line: number; column?: number }
  | { type: 'reveal'; file: string; preserveFocus?: boolean }
  | { type: 'peek'; file: string; line: number }
  | { type: 'diff'; original: string; modified: string }

interface EditorBridgeConfig {
  wsUrl: string
  reconnectInterval: number
  maxLatency: number // Target: sub-150ms
}

export class EditorBridge {
  private ws: WebSocket | null = null
  private config: EditorBridgeConfig
  private pendingCommands: Map<string, { resolve: Function; reject: Function; timestamp: number }> = new Map()
  private connectionState: 'connecting' | 'connected' | 'disconnected' = 'disconnected'
  private statusCallbacks: ((state: string) => void)[] = []

  constructor(config: EditorBridgeConfig) {
    this.config = config
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connectionState = 'connecting'
      this.notifyStatusChange()

      this.ws = new WebSocket(this.config.wsUrl)

      this.ws.onopen = () => {
        this.connectionState = 'connected'
        this.notifyStatusChange()
        resolve()
      }

      this.ws.onclose = () => {
        this.connectionState = 'disconnected'
        this.notifyStatusChange()
        this.scheduleReconnect()
      }

      this.ws.onerror = (error) => {
        reject(error)
      }

      this.ws.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data))
      }
    })
  }

  private handleMessage(message: { id: string; success: boolean; data?: any; error?: string }) {
    const pending = this.pendingCommands.get(message.id)
    if (pending) {
      const latency = Date.now() - pending.timestamp
      if (latency > this.config.maxLatency) {
        console.warn(`Editor command latency: ${latency}ms (target: ${this.config.maxLatency}ms)`)
      }

      if (message.success) {
        pending.resolve(message.data)
      } else {
        pending.reject(new Error(message.error))
      }
      this.pendingCommands.delete(message.id)
    }
  }

  async sendCommand<T = void>(command: EditorCommand): Promise<T> {
    if (!this.ws || this.connectionState !== 'connected') {
      throw new Error('Not connected to editor')
    }

    const id = crypto.randomUUID()
    const timestamp = Date.now()

    return new Promise((resolve, reject) => {
      this.pendingCommands.set(id, { resolve, reject, timestamp })

      this.ws!.send(JSON.stringify({ id, command }))

      // Timeout for latency guarantee
      setTimeout(() => {
        if (this.pendingCommands.has(id)) {
          this.pendingCommands.delete(id)
          reject(new Error('Command timeout - exceeded max latency'))
        }
      }, this.config.maxLatency * 2)
    })
  }

  // Navigation commands
  async openFile(file: string, line: number, column?: number): Promise<void> {
    await this.sendCommand({ type: 'openAt', file, line, column })
  }

  async revealFile(file: string, preserveFocus = false): Promise<void> {
    await this.sendCommand({ type: 'reveal', file, preserveFocus })
  }

  async peekDefinition(file: string, line: number): Promise<void> {
    await this.sendCommand({ type: 'peek', file, line })
  }

  // Status monitoring
  onStatusChange(callback: (state: string) => void): () => void {
    this.statusCallbacks.push(callback)
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback)
    }
  }

  private notifyStatusChange(): void {
    this.statusCallbacks.forEach(cb => cb(this.connectionState))
  }

  private scheduleReconnect(): void {
    setTimeout(() => {
      this.connect().catch(console.error)
    }, this.config.reconnectInterval)
  }
}

// Usage
const bridge = new EditorBridge({
  wsUrl: 'ws://localhost:9000/editor',
  reconnectInterval: 5000,
  maxLatency: 150 // Sub-150ms round-trip target
})

await bridge.connect()
await bridge.openFile('src/components/Button.tsx', 42, 10)
```

**Pattern 98: Editor Protocol URI Handler**
```typescript
// lib/editor-protocol.ts
// Source: engineering-frontend-developer.md

interface EditorUri {
  scheme: 'vscode' | 'cursor' | 'jetbrains'
  action: 'open' | 'diff' | 'merge'
  path: string
  line?: number
  column?: number
}

export function buildEditorUri(config: EditorUri): string {
  const { scheme, action, path, line, column } = config

  switch (scheme) {
    case 'vscode':
      // vscode://file/path/to/file:line:column
      const vscodePath = encodeURIComponent(path)
      const lineCol = line ? `:${line}${column ? `:${column}` : ''}` : ''
      return `vscode://file/${vscodePath}${lineCol}`

    case 'cursor':
      // cursor://file/path/to/file?line=X&column=Y
      const cursorPath = encodeURIComponent(path)
      const params = new URLSearchParams()
      if (line) params.set('line', String(line))
      if (column) params.set('column', String(column))
      return `cursor://file/${cursorPath}?${params.toString()}`

    case 'jetbrains':
      // jetbrains://idea/navigate/reference?project=X&path=Y&line=Z
      return `jetbrains://idea/navigate/reference?path=${encodeURIComponent(path)}${line ? `&line=${line}` : ''}`

    default:
      throw new Error(`Unsupported editor scheme: ${scheme}`)
  }
}

// Component for clickable file references
'use client'

import { useState, useEffect } from 'react'

interface FileReferenceProps {
  file: string
  line?: number
  column?: number
  children: React.ReactNode
}

export function FileReference({ file, line, column, children }: FileReferenceProps) {
  const [preferredEditor, setPreferredEditor] = useState<EditorUri['scheme']>('vscode')

  useEffect(() => {
    const stored = localStorage.getItem('preferred-editor') as EditorUri['scheme']
    if (stored) setPreferredEditor(stored)
  }, [])

  const handleClick = () => {
    const uri = buildEditorUri({
      scheme: preferredEditor,
      action: 'open',
      path: file,
      line,
      column
    })
    window.location.href = uri
  }

  return (
    <button
      onClick={handleClick}
      className="text-primary hover:underline cursor-pointer font-mono text-sm"
      title={`Open in ${preferredEditor}: ${file}${line ? `:${line}` : ''}`}
    >
      {children}
    </button>
  )
}

// Usage
<FileReference file="src/components/Button.tsx" line={42}>
  Button.tsx:42
</FileReference>
```

**Pattern 99: Connection Status Indicator**
```typescript
// components/editor-status.tsx
// Source: engineering-frontend-developer.md

'use client'

import { useEffect, useState } from 'react'
import { EditorBridge } from '@/lib/editor-bridge'
import { cn } from '@/lib/utils'

interface EditorStatusProps {
  bridge: EditorBridge
  className?: string
}

export function EditorStatusIndicator({ bridge, className }: EditorStatusProps) {
  const [status, setStatus] = useState<string>('disconnected')
  const [latency, setLatency] = useState<number | null>(null)

  useEffect(() => {
    const unsubscribe = bridge.onStatusChange(setStatus)
    return unsubscribe
  }, [bridge])

  // Ping for latency measurement
  useEffect(() => {
    if (status !== 'connected') return

    const interval = setInterval(async () => {
      const start = performance.now()
      try {
        await bridge.sendCommand({ type: 'ping' } as any)
        setLatency(Math.round(performance.now() - start))
      } catch {
        setLatency(null)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [bridge, status])

  const statusConfig = {
    connected: {
      color: 'bg-green-500',
      label: 'Connected',
      pulse: false
    },
    connecting: {
      color: 'bg-yellow-500',
      label: 'Connecting',
      pulse: true
    },
    disconnected: {
      color: 'bg-red-500',
      label: 'Disconnected',
      pulse: false
    }
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.disconnected

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className={cn(
          'w-2 h-2 rounded-full',
          config.color,
          config.pulse && 'animate-pulse'
        )} />
      </div>
      <span className="text-xs text-muted-foreground">
        {config.label}
        {latency !== null && status === 'connected' && (
          <span className={cn(
            'ml-1',
            latency > 150 ? 'text-yellow-500' : 'text-green-500'
          )}>
            ({latency}ms)
          </span>
        )}
      </span>
    </div>
  )
}
```

---

## [SECTION 17: ADVANCED CAPABILITIES (Web Components/micro-frontends, WebAssembly integration)]

===========================================
SECTION 17: ADVANCED CAPABILITIES
===========================================

Source: agency-agents/engineering/engineering-frontend-developer.md

## 17.1 Web Components & Micro-Frontends

**Pattern 101: Web Component Wrapper for React**
```typescript
// lib/create-web-component.ts
// Source: engineering-frontend-developer.md - Advanced Capabilities

import React from 'react'
import { createRoot, Root } from 'react-dom/client'

interface WebComponentConfig {
  tagName: string
  component: React.ComponentType<any>
  observedAttributes?: string[]
  shadowMode?: 'open' | 'closed'
}

export function createWebComponent({
  tagName,
  component: Component,
  observedAttributes = [],
  shadowMode = 'open'
}: WebComponentConfig): void {
  class ReactWebComponent extends HTMLElement {
    private root: Root | null = null
    private mountPoint: HTMLElement | null = null

    static get observedAttributes() {
      return observedAttributes
    }

    connectedCallback() {
      // Create shadow DOM
      const shadow = this.attachShadow({ mode: shadowMode })

      // Create mount point
      this.mountPoint = document.createElement('div')
      shadow.appendChild(this.mountPoint)

      // Add styles (optional - link to your CSS)
      const styles = document.createElement('link')
      styles.rel = 'stylesheet'
      styles.href = '/styles/web-components.css'
      shadow.appendChild(styles)

      // Create React root and render
      this.root = createRoot(this.mountPoint)
      this.render()
    }

    disconnectedCallback() {
      if (this.root) {
        this.root.unmount()
        this.root = null
      }
    }

    attributeChangedCallback() {
      this.render()
    }

    private render() {
      if (!this.root) return

      // Convert attributes to props
      const props: Record<string, any> = {}
      for (const attr of observedAttributes) {
        const value = this.getAttribute(attr)
        if (value !== null) {
          // Try to parse JSON for complex values
          try {
            props[attr] = JSON.parse(value)
          } catch {
            props[attr] = value
          }
        }
      }

      this.root.render(<Component {...props} />)
    }
  }

  // Register the custom element
  if (!customElements.get(tagName)) {
    customElements.define(tagName, ReactWebComponent)
  }
}

// Usage - Register a React component as a Web Component
import { Button } from '@/components/ui/button'

createWebComponent({
  tagName: 'my-button',
  component: Button,
  observedAttributes: ['variant', 'size', 'disabled']
})

// Now usable as: <my-button variant="primary">Click me</my-button>
```

**Pattern 102: Micro-Frontend Module Federation**
```typescript
// next.config.js - Module Federation Setup
// Source: engineering-frontend-developer.md

const NextFederationPlugin = require('@module-federation/nextjs-mf')

module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'host',
        filename: 'static/chunks/remoteEntry.js',
        remotes: {
          // Remote micro-frontends
          dashboard: 'dashboard@http://localhost:3001/_next/static/chunks/remoteEntry.js',
          analytics: 'analytics@http://localhost:3002/_next/static/chunks/remoteEntry.js',
        },
        shared: {
          // Shared dependencies
          react: { singleton: true, eager: true },
          'react-dom': { singleton: true, eager: true },
        },
        exposes: {
          // Components this app exposes to others
          './Button': './components/ui/button',
          './Card': './components/ui/card',
        },
      })
    )
    return config
  },
}

// Loading remote components dynamically
'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Load remote Dashboard component
const RemoteDashboard = dynamic(
  () => import('dashboard/DashboardWidget').catch(() => {
    return { default: () => <div>Dashboard unavailable</div> }
  }),
  {
    ssr: false,
    loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg" />
  }
)

export function MicroFrontendContainer() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteDashboard userId="123" />
      </Suspense>
    </div>
  )
}
```

## 17.2 WebAssembly Integration

**Pattern 103: WebAssembly for Performance-Critical Operations**
```typescript
// lib/wasm-loader.ts
// Source: engineering-frontend-developer.md - WebAssembly integration

interface WasmModule {
  memory: WebAssembly.Memory
  exports: Record<string, Function>
}

class WasmLoader {
  private modules: Map<string, WasmModule> = new Map()

  async load(name: string, wasmUrl: string): Promise<WasmModule> {
    if (this.modules.has(name)) {
      return this.modules.get(name)!
    }

    const response = await fetch(wasmUrl)
    const bytes = await response.arrayBuffer()

    const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 })

    const imports = {
      env: {
        memory,
        // JavaScript functions callable from WASM
        consoleLog: (ptr: number, len: number) => {
          const bytes = new Uint8Array(memory.buffer, ptr, len)
          console.log(new TextDecoder().decode(bytes))
        },
      },
    }

    const { instance } = await WebAssembly.instantiate(bytes, imports)

    const module: WasmModule = {
      memory,
      exports: instance.exports as Record<string, Function>,
    }

    this.modules.set(name, module)
    return module
  }

  get(name: string): WasmModule | undefined {
    return this.modules.get(name)
  }
}

export const wasmLoader = new WasmLoader()

// Usage in React component
'use client'

import { useEffect, useState } from 'react'
import { wasmLoader } from '@/lib/wasm-loader'

export function ImageProcessor() {
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    // Preload WASM module
    wasmLoader.load('image-processor', '/wasm/image-processor.wasm')
  }, [])

  const processImage = async (imageData: ImageData) => {
    setProcessing(true)

    const module = await wasmLoader.load('image-processor', '/wasm/image-processor.wasm')

    // Copy image data to WASM memory
    const inputPtr = module.exports.allocate(imageData.data.length)
    const inputArray = new Uint8ClampedArray(
      module.memory.buffer,
      inputPtr,
      imageData.data.length
    )
    inputArray.set(imageData.data)

    // Call WASM function (e.g., apply blur)
    const outputPtr = module.exports.applyBlur(
      inputPtr,
      imageData.width,
      imageData.height,
      5 // blur radius
    )

    // Read result from WASM memory
    const outputArray = new Uint8ClampedArray(
      module.memory.buffer,
      outputPtr,
      imageData.data.length
    )

    const result = new ImageData(
      new Uint8ClampedArray(outputArray),
      imageData.width,
      imageData.height
    )

    // Free WASM memory
    module.exports.deallocate(inputPtr)
    module.exports.deallocate(outputPtr)

    setProcessing(false)
    return result
  }

  return (
    <div>
      {/* Image processing UI */}
      {processing && <span>Processing with WebAssembly...</span>}
    </div>
  )
}
```

