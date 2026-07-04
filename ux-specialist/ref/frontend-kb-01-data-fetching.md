## [SECTION 1: NEXT.JS 15 APP ROUTER PATTERNS (Server Components, Server Actions, Data Fetching & Caching, Streaming/Suspense)]

===========================================
SECTION 1: NEXT.JS 15 APP ROUTER PATTERNS
===========================================

Source: Research-added (Next.js 15 official documentation, 2025 best practices articles)

## 1.1 Server Components Architecture

**Pattern 1: Default Server Component Pattern**
```typescript
// app/page.tsx - Server Component by default
// Source: Next.js 15 official docs
// Performance: No JS sent to client, faster initial load

import { db } from '@/lib/database'

export default async function HomePage() {
  // Data fetching directly in component
  const posts = await db.post.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

// Automatic code-splitting by route segments
// No useEffect, no loading states needed
```

**Pattern 2: Client Component Pattern (Event Handlers)**
```typescript
// components/interactive-button.tsx
// Source: Next.js 15 best practices
// Use Client Components ONLY when needed

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function InteractiveButton() {
  const [count, setCount] = useState(0)

  return (
    <Button
      onClick={() => setCount(count + 1)}
      className="relative"
    >
      Clicked {count} times
    </Button>
  )
}

// When to use 'use client':
// - State and event handlers (onClick, onChange)
// - Lifecycle hooks (useEffect, useLayoutEffect)
// - Browser-only APIs (localStorage, window, navigator)
// - Custom hooks that use state/effects
```

**Pattern 3: Composition Pattern (Minimize Client JS)**
```typescript
// app/dashboard/page.tsx
// Source: Next.js 15 performance patterns
// Keep most logic server-side, client-only for interactivity

import { DashboardStats } from '@/components/dashboard-stats' // Server
import { InteractiveChart } from '@/components/interactive-chart' // Client
import { Suspense } from 'react'

export default async function DashboardPage() {
  const stats = await fetchDashboardStats()

  return (
    <div className="container py-12">
      {/* Server Component - no JS bundle */}
      <DashboardStats data={stats} />

      {/* Client Component - only this gets JS */}
      <Suspense fallback={<ChartSkeleton />}>
        <InteractiveChart data={stats.chartData} />
      </Suspense>
    </div>
  )
}

// Performance win: Only InteractiveChart sends JS to client
// DashboardStats is pure server-rendered HTML
```

## 1.2 Server Actions (React 19 + Next.js 15)

**Pattern 4: Inline Server Action with Validation**
```typescript
// app/contact/page.tsx
// Source: Next.js 15 Server Actions guide
// Security: All Server Actions require auth & validation

'use server'

import { z } from 'zod'
import { db } from '@/lib/database'
import { revalidatePath } from 'next/cache'

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function submitContactForm(formData: FormData) {
  // CRITICAL: Validate input with Zod first
  const validatedFields = ContactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    }
  }

  const { name, email, message } = validatedFields.data

  try {
    await db.contact.create({
      data: { name, email, message },
    })

    revalidatePath('/contact')

    return { success: true }
  } catch (error) {
    return {
      success: false,
      errors: { _form: ['Failed to submit form. Please try again.'] }
    }
  }
}

// Client component to consume
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { submitContactForm } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, { success: false })

  return (
    <form action={formAction}>
      <input name="name" required />
      {state.errors?.name && <p className="text-red-500">{state.errors.name[0]}</p>}

      <input name="email" type="email" required />
      {state.errors?.email && <p className="text-red-500">{state.errors.email[0]}</p>}

      <textarea name="message" required />
      {state.errors?.message && <p className="text-red-500">{state.errors.message[0]}</p>}

      <SubmitButton />
      {state.success && <p className="text-green-500">Message sent!</p>}
    </form>
  )
}
```

**Pattern 5: Dedicated Server Actions File**
```typescript
// app/actions/posts.ts
// Source: Next.js 15 best practices (centralized actions)
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/database'

const CreatePostSchema = z.object({
  title: z.string().min(5).max(255),
  content: z.string().min(20),
  published: z.boolean().default(false),
})

export async function createPost(formData: FormData) {
  // CRITICAL: Authentication check first
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  // Validate input
  const validatedFields = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    published: formData.get('published') === 'true',
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const { title, content, published } = validatedFields.data

  try {
    const post = await db.post.create({
      data: {
        title,
        content,
        published,
        authorId: session.user.id,
      },
    })

    revalidatePath('/posts')
    redirect(`/posts/${post.id}`)
  } catch (error) {
    return { errors: { _form: ['Database error'] } }
  }
}

export async function deletePost(postId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const post = await db.post.findUnique({
    where: { id: postId }
  })

  if (post?.authorId !== session.user.id) {
    throw new Error('Forbidden')
  }

  await db.post.delete({ where: { id: postId } })
  revalidatePath('/posts')
}
```

## 1.3 Data Fetching & Caching Strategies

**Pattern 6: Force Cache (Static Data)**
```typescript
// lib/data.ts
// Source: Next.js 15 caching guide

export async function getStaticData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache', // Cached indefinitely
  })
  return res.json()
}

// Usage: Static pages, rarely changing data
// Cache persists across builds
```

**Pattern 7: Revalidate (Incremental Static Regeneration)**
```typescript
export async function getBlogPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }, // Revalidate every hour
  })
  return res.json()
}

// Usage: CMS content, product catalogs
// Fresh data every X seconds
```

**Pattern 8: No Store (Dynamic Data)**
```typescript
export async function getUserDashboard(userId: string) {
  const res = await fetch(`https://api.example.com/users/${userId}/dashboard`, {
    cache: 'no-store', // Never cache, always fresh
  })
  return res.json()
}

// Usage: User-specific dashboards, real-time data
// Fetched on every request
```

**Pattern 9: Route Segment Config**
```typescript
// app/blog/[slug]/page.tsx
// Source: Next.js 15 segment configuration

export const revalidate = 3600 // Revalidate every hour
export const dynamic = 'force-static' // Force static generation
export const dynamicParams = true // Generate params on-demand

export async function generateStaticParams() {
  const posts = await db.post.findMany({ select: { slug: true } })
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const post = await db.post.findUnique({
    where: { slug: params.slug },
  })

  if (!post) notFound()

  return <Article post={post} />
}
```

## 1.4 Streaming & Suspense

**Pattern 10: Streaming with Suspense Boundaries**
```typescript
// app/dashboard/page.tsx
// Source: Next.js 15 streaming guide

import { Suspense } from 'react'

async function RevenueChart() {
  const data = await fetchRevenueData() // Slow query
  return <Chart data={data} />
}

async function QuickStats() {
  const stats = await fetchQuickStats() // Fast query
  return <StatsGrid stats={stats} />
}

export default function DashboardPage() {
  return (
    <div className="container py-12">
      {/* Fast content shows immediately */}
      <Suspense fallback={<StatsSkeleton />}>
        <QuickStats />
      </Suspense>

      {/* Slow content streams in when ready */}
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>
    </div>
  )
}

// Benefits:
// - User sees fast content immediately
// - Slow queries don't block page render
// - Progressive enhancement
```

**Pattern 11: Loading UI (loading.tsx)**
```typescript
// app/dashboard/loading.tsx
// Source: Next.js 15 loading patterns

export default function DashboardLoading() {
  return (
    <div className="container py-12">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Automatically shown while page loads
// Replace with Suspense for granular control
```

