## [SECTION 9: PERFORMANCE OPTIMIZATION (Core Web Vitals 2025, image/asset optimization, code splitting, caching)]

===========================================
SECTION 9: PERFORMANCE OPTIMIZATION
===========================================

Source: Research-added (Core Web Vitals 2025, Google Developer Docs)

## 9.1 Core Web Vitals (2025 Standards)

**Pattern 64: LCP Optimization (Largest Contentful Paint < 2.5s)**
```tsx
// app/page.tsx
// Source: Core Web Vitals 2025 optimization guide

import Image from 'next/image'

export default function HomePage() {
  return (
    <section className="hero">
      <Image
        src="/hero-image.jpg"
        alt="Hero"
        width={1920}
        height={1080}
        priority  // Preload above-the-fold images
        quality={90}
        placeholder="blur"
        blurDataURL="data:image/..." // Low-quality placeholder
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </section>
  )
}

/* LCP optimization techniques:
   1. Use priority prop for hero images
   2. Preload critical resources
   3. Optimize server response time (< 600ms)
   4. Reduce render-blocking JavaScript
   5. Use CDN for static assets
   6. Implement image optimization (WebP, AVIF)
*/
```

**Pattern 65: CLS Prevention (Cumulative Layout Shift < 0.1)**
```tsx
// components/image-card.tsx
// Source: Core Web Vitals CLS optimization

import Image from 'next/image'

export function ImageCard({ src, alt }: { src: string, alt: string }) {
  return (
    <div className="card">
      {/* Always specify dimensions to reserve space */}
      <Image
        src={src}
        alt={alt}
        width={400}
        height={300}
        className="rounded-lg"
        style={{
          width: '100%',
          height: 'auto',
          aspectRatio: '4/3'  // Maintain aspect ratio
        }}
      />
      <div className="p-4">
        <h3 className="font-bold">Title</h3>
      </div>
    </div>
  )
}

/* CLS prevention:
   1. Always set width & height on images/videos
   2. Reserve space for dynamic content
   3. Avoid inserting content above existing content
   4. Use CSS aspect-ratio property
   5. Preload fonts to avoid FOIT/FOUT
*/
```

**Pattern 66: INP Optimization (Interaction to Next Paint < 200ms)**
```typescript
// lib/debounce.ts
// Source: Core Web Vitals INP (replaced FID in March 2024)

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Usage: Debounce search input
'use client'

import { useState } from 'react'
import { debounce } from '@/lib/debounce'

export function SearchInput() {
  const [query, setQuery] = useState('')

  // Debounce search to reduce main thread blocking
  const debouncedSearch = debounce((value: string) => {
    // Perform search
    console.log('Searching for:', value)
  }, 300)

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => {
        setQuery(e.target.value)
        debouncedSearch(e.target.value)
      }}
      placeholder="Search..."
    />
  )
}

/* INP optimization techniques:
   1. Debounce/throttle user interactions
   2. Use Web Workers for heavy computations
   3. Split long tasks into smaller chunks
   4. Minimize main thread work
   5. Optimize JavaScript bundle size
   6. Use React.lazy() for code splitting
*/
```

## 9.2 Image & Asset Optimization

**Pattern 67: Responsive Images with srcset**
```tsx
// components/responsive-image.tsx
// Source: Next.js image optimization

import Image from 'next/image'

export function ResponsiveImage({
  src,
  alt
}: {
  src: string
  alt: string
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      sizes="(max-width: 640px) 100vw,
             (max-width: 1024px) 50vw,
             33vw"
      quality={85}
      // Automatic formats: WebP, AVIF
      // Automatic lazy loading below fold
    />
  )
}

/* Next.js Image automatically:
   - Generates multiple sizes (srcset)
   - Serves WebP/AVIF when supported
   - Lazy loads below-the-fold images
   - Optimizes on-demand
*/
```

**Pattern 68: Font Optimization**
```tsx
// app/layout.tsx
// Source: Next.js font optimization

import { Syne } from 'next/font/google'

const heading = Syne({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-heading',
  display: 'swap',  // FOUT strategy (Flash of Unstyled Text)
  preload: true,    // Preload in <head>
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={heading.variable}>
      <body>{children}</body>
    </html>
  )
}

/* Font optimization:
   - display: 'swap' prevents FOIT (Flash of Invisible Text)
   - Preload critical fonts
   - Self-host fonts for performance
   - Subset fonts to reduce size
*/
```

## 9.3 Code Splitting & Lazy Loading

**Pattern 69: Dynamic Imports for Heavy Components**
```tsx
// app/page.tsx
// Source: Next.js code splitting

import dynamic from 'next/dynamic'

// Lazy load heavy components
const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,  // Disable SSR if component uses browser APIs
})

const InteractiveMap = dynamic(() => import('@/components/map'), {
  loading: () => <div>Loading map...</div>,
})

export default function DashboardPage() {
  return (
    <div className="container py-12">
      <h1>Dashboard</h1>

      {/* Only loads when component renders */}
      <HeavyChart data={data} />

      {/* Only loads when map is needed */}
      <InteractiveMap location={location} />
    </div>
  )
}

/* Benefits:
   - Reduces initial bundle size
   - Faster initial page load
   - Components load on demand
*/
```

**Pattern 70: Route-Based Code Splitting**
```tsx
// Next.js automatically code-splits by route

// app/page.tsx → home page bundle
// app/about/page.tsx → about page bundle
// app/dashboard/page.tsx → dashboard page bundle

// Each route only loads its required JavaScript
// Shared code is automatically extracted to shared chunks
```

## 9.4 Caching Strategies

**Pattern 71: Static Asset Caching**
```javascript
// next.config.js
// Source: Next.js caching configuration

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Cache static assets aggressively
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

---

## [SECTION 12 (orig): PRODUCTION DEPLOYMENT PATTERNS (env config, production optimization)]

===========================================
SECTION 12: PRODUCTION DEPLOYMENT PATTERNS
===========================================

Source: Extracted from Master_Claude_Code_Architect.txt + Next.js docs

## 12.1 Environment Configuration

**Pattern 83: Environment Variables**
```bash
# .env.local
# Source: Next.js environment variables guide

# Public variables (exposed to browser)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXXXXXX

# Private variables (server-only)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
API_SECRET_KEY=your-secret-key-here
SMTP_HOST=smtp.example.com
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

```typescript
// lib/env.ts
// Type-safe environment variables

import { z } from 'zod'

const envSchema = z.object({
  // Public
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),

  // Private
  DATABASE_URL: z.string(),
  API_SECRET_KEY: z.string().min(32),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  DATABASE_URL: process.env.DATABASE_URL,
  API_SECRET_KEY: process.env.API_SECRET_KEY,
})
```

## 12.2 Production Optimization

**Pattern 84: Next.js Production Configuration**
```javascript
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ]
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
}

module.exports = nextConfig
```

**Pattern 85: Bundle Analysis**
```json
// package.json

{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "analyze": "ANALYZE=true next build"
  },
  "dependencies": {
    "next": "^15.0.0"
  },
  "devDependencies": {
    "@next/bundle-analyzer": "^15.0.0"
  }
}
```

```javascript
// next.config.js with bundle analyzer

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ... config
})

// Run: npm run analyze
// Opens bundle visualization in browser
```

---

## [SECTION 23: RENDERING PERFORMANCE OPTIMIZATION (UI-only React rendering)]

===========================================
SECTION 23: RENDERING PERFORMANCE OPTIMIZATION
===========================================

Source: Research (React 19 best practices, Core Web Vitals 2025)

## 23.1 React Rendering Optimization (UI Only)

**Pattern 122: Strategic Memoization**
```typescript
// Only memoize components that receive stable primitive props
// or that render expensive visual output

import { memo, useMemo, useCallback } from 'react'

// GOOD: Expensive visual component with stable props
const DataVisualization = memo(function DataVisualization({
  data,
  width,
  height
}: {
  data: number[]
  width: number
  height: number
}) {
  // Expensive SVG path calculation
  const path = useMemo(() => {
    return data.map((d, i) => {
      const x = (i / data.length) * width
      const y = height - (d / Math.max(...data)) * height
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }, [data, width, height])

  return (
    <svg width={width} height={height}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth={2} />
    </svg>
  )
})

// GOOD: Stable callback for child components
function ParentComponent() {
  const [items, setItems] = useState<Item[]>([])

  const handleDelete = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} onDelete={handleDelete} />
      ))}
    </div>
  )
}
```

**Pattern 123: Virtual List for Large Datasets**
```typescript
// Use virtualization when rendering 100+ items
'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export function VirtualizedList({ items }: { items: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,  // Estimated row height
    overscan: 5,             // Render 5 extra items above/below
  })

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto rounded-2xl border"
    >
      <div
        style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
            className="flex items-center px-4 border-b"
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Pattern 124: Image Optimization**
```typescript
// Next.js Image optimization for visual performance
import Image from 'next/image'

// Pattern: Responsive hero image with blur placeholder
export function HeroImage() {
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
      <Image
        src="/hero.jpg"
        alt="Hero image description"
        fill
        priority                    // LCP image - preload
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        className="object-cover"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQ..."  // 10px blur
      />
    </div>
  )
}

// Pattern: Lazy-loaded gallery images
export function ImageGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((src, i) => (
        <div key={src} className="relative aspect-square rounded-xl overflow-hidden">
          <Image
            src={src}
            alt={`Gallery image ${i + 1}`}
            fill
            loading="lazy"          // Not priority - lazy load
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  )
}
```

**Pattern 125: CSS containment for Paint Performance**
```css
/* Reduce paint cost for complex UI components */

/* Isolate card paint from rest of page */
.card-container {
  contain: layout style paint;
  content-visibility: auto;
  contain-intrinsic-size: auto 300px;
}

/* Optimize list items */
.list-item {
  contain: layout style;
  will-change: transform;  /* Only when animating */
}

/* GPU acceleration for animations */
.animated-element {
  transform: translateZ(0);  /* Force GPU layer */
  backface-visibility: hidden;
}

/* content-visibility for off-screen sections */
.below-fold-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px;  /* Estimated height */
}
```

