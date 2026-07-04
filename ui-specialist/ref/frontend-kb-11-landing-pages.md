## [SECTION 11 (orig): LANDING PAGE PATTERNS (hero, feature, CTA, testimonial section patterns)]

===========================================
SECTION 11: LANDING PAGE PATTERNS
===========================================

Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt

## 11.1 Hero Section Variants

**Pattern 77: Centered Hero with Animated Gradient**
```tsx
// components/sections/hero.tsx
// Source: Extracted 21st.dev hero patterns

'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { SplitText } from '@/components/split-text'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 animate-gradient" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="container mx-auto px-4 text-center">
        {/* Headline with character animation */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
          <SplitText text="Build The Future" delay={0.2} />
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          The most powerful platform for modern developers
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 1.2, type: 'spring' }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="min-w-[160px]">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="min-w-[160px]">
            Learn More
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
```

**Pattern 78: Split Hero (Text + Image)**
```tsx
// components/sections/split-hero.tsx

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function SplitHero() {
  return (
    <section className="min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Designed for Modern Teams
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Collaborate seamlessly, ship faster, and scale with confidence.
            </p>
            <div className="flex gap-4">
              <Button size="lg">Start Free Trial</Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Right: Image/Product screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <Image
              src="/product-screenshot.png"
              alt="Product"
              width={800}
              height={600}
              priority
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

## 11.2 Feature Section Patterns

**Pattern 79: Bento Grid Features**
```tsx
// components/sections/bento-features.tsx
// Source: Extracted 21st.dev bento grid patterns

'use client'

import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/animations'
import { Icon } from 'lucide-react'

interface Feature {
  title: string
  description: string
  icon: any
  span?: string
}

export function BentoFeatures({ features }: { features: Feature[] }) {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`
                card p-8 hover:shadow-lg transition-shadow
                ${feature.span || ''}
              `}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Usage with asymmetric grid (Bento layout)
<BentoFeatures features={[
  {
    title: 'Fast Performance',
    description: '10x faster than competitors',
    icon: Zap,
    span: 'md:col-span-2'  // Takes 2 columns
  },
  {
    title: 'Secure',
    description: 'Enterprise-grade security',
    icon: Shield,
  },
  // ...
]} />
```

**Pattern 80: Three-Column Icon Grid**
```tsx
// components/sections/icon-features.tsx

'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/scroll-reveal'

export function IconFeatures() {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance',
    },
    {
      icon: '🔒',
      title: 'Secure by Default',
      description: 'Enterprise-grade security built-in',
    },
    {
      icon: '🚀',
      title: 'Easy to Deploy',
      description: 'Deploy in seconds, scale infinitely',
    },
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for developers, trusted by enterprises
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

## 11.3 CTA Section Patterns

**Pattern 81: Gradient CTA with Background**
```tsx
// components/sections/cta.tsx

'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of teams already using our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="min-w-[180px]">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="min-w-[180px]">
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

## 11.4 Testimonial Patterns

**Pattern 82: Carousel Testimonials**
```tsx
// components/sections/testimonials.tsx

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  avatar: string
}

export function TestimonialCarousel({
  testimonials
}: {
  testimonials: Testimonial[]
}) {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((current + 1) % testimonials.length)
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">
          What Our Users Say
        </h2>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="card p-12 text-center"
            >
              <p className="text-2xl mb-8 italic">
                "{testimonials[current].quote}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[current].avatar}
                  alt={testimonials[current].author}
                  className="w-16 h-16 rounded-full"
                />
                <div className="text-left">
                  <p className="font-bold">{testimonials[current].author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[current].role} at {testimonials[current].company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={prev} variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={next} variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## [SECTION 11 (Enhanced dup): THEME TOGGLE SYSTEM (complete theme management system)]

===========================================
SECTION 11: THEME TOGGLE SYSTEM (Enhanced)
===========================================

Source: agency-agents/design/design-ux-architect.md + research-added

## 11.1 Complete Theme Management System

**Pattern 86: Theme Toggle Component (React/Next.js)**
```typescript
// components/theme-toggle.tsx
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Monitor } from 'lucide-react'

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      root.removeAttribute('data-theme')
      localStorage.removeItem('theme')
    } else {
      root.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  // Handle system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      if (theme === 'system') {
        // Force re-render when system preference changes
        setTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  if (!mounted) {
    return <div className="w-24 h-10" /> // Placeholder to prevent layout shift
  }

  return (
    <div
      className="inline-flex rounded-full bg-muted p-1"
      role="radiogroup"
      aria-label="Theme selection"
    >
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        className="rounded-full px-3"
        onClick={() => setTheme('light')}
        role="radio"
        aria-checked={theme === 'light'}
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Light theme</span>
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        className="rounded-full px-3"
        onClick={() => setTheme('dark')}
        role="radio"
        aria-checked={theme === 'dark'}
      >
        <Moon className="h-4 w-4" />
        <span className="sr-only">Dark theme</span>
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="sm"
        className="rounded-full px-3"
        onClick={() => setTheme('system')}
        role="radio"
        aria-checked={theme === 'system'}
      >
        <Monitor className="h-4 w-4" />
        <span className="sr-only">System theme</span>
      </Button>
    </div>
  )
}
```

**Pattern 87: Theme CSS Variables (Complete System)**
```css
/* styles/theme.css */

:root {
  /* Light Theme - Default */
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
}

/* Dark Theme */
[data-theme="dark"] {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}

/* System Theme Preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

/* Smooth theme transitions */
html {
  color-scheme: light;
  transition: color-scheme 0.3s ease;
}

html[data-theme="dark"] {
  color-scheme: dark;
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

**Pattern 88: Flash Prevention (SSR/SSG)**
```typescript
// app/layout.tsx
import { cookies } from 'next/headers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Read theme from cookie to prevent flash
  const cookieStore = cookies()
  const theme = cookieStore.get('theme')?.value

  return (
    <html
      lang="en"
      data-theme={theme !== 'system' ? theme : undefined}
      suppressHydrationWarning
    >
      <head>
        {/* Inline script to set theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else if (theme === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

