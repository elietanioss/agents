## [SECTION 5: FRAMER MOTION ANIMATION PATTERNS (GPU-optimized, scroll-triggered, gesture, text animations, accessibility)]

===========================================
SECTION 5: FRAMER MOTION ANIMATION PATTERNS
===========================================

Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt + Research-added (Framer Motion performance guide)

## 5.1 GPU-Optimized Animations

**Pattern 29: Transform & Opacity (GPU-Accelerated)**
```typescript
// lib/animations.ts
// Source: Framer Motion best practices + Claude source extraction

import { Variants } from 'framer-motion'

// ALWAYS use transform and opacity for best performance
// These are GPU-accelerated and don't trigger reflows

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30  // transform: translateY() - GPU accelerated
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]  // cubic-bezier easing
    },
  },
}

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95  // transform: scale() - GPU accelerated
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    },
  },
}

export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50  // transform: translateX() - GPU accelerated
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    },
  },
}

// AVOID animating:
// - width, height (causes reflow)
// - backgroundColor (not GPU accelerated)
// - padding, margin (causes reflow)
```

**Pattern 30: Stagger Container Pattern**
```typescript
// lib/animations.ts
// Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // 100ms delay between children
      delayChildren: 0.2,    // Wait 200ms before starting
    },
  },
}

// Usage
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/animations'

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {features.map((feature) => (
        <motion.div
          key={feature.id}
          variants={fadeUp}
          className="card p-6"
        >
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
```

## 5.2 Scroll-Triggered Animations

**Pattern 31: whileInView with useInView**
```typescript
// components/scroll-reveal.tsx
// Source: Framer Motion scroll animations

'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function ScrollReveal({
  children,
  className,
  delay = 0
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,       // Animate only once
    margin: '-100px'  // Start animation 100px before entering viewport
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay, ease: 'easeOut' },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Usage
<ScrollReveal>
  <h2>This animates when scrolled into view</h2>
</ScrollReveal>
```

**Pattern 32: Parallax Scroll Effect**
```typescript
// components/parallax-section.tsx
// Source: Framer Motion scroll-linked animations

'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function ParallaxSection({
  children,
  offset = 50,
  className
}: {
  children: React.ReactNode
  offset?: number
  className?: string
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Move from +offset to -offset as user scrolls
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// Usage: Background moves slower than foreground (parallax effect)
<div className="relative">
  <ParallaxSection offset={100} className="absolute inset-0">
    <img src="/background.jpg" alt="" className="w-full h-full object-cover" />
  </ParallaxSection>
  <div className="relative z-10">
    <h1>Content on top</h1>
  </div>
</div>
```

## 5.3 Gesture Animations

**Pattern 33: Hover & Tap Animations**
```typescript
// components/interactive-card.tsx
// Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt

'use client'

import { motion } from 'framer-motion'

export function HoverLiftCard({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: -8,  // Lift up 8px
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'  // Increase shadow
      }}
      whileTap={{ scale: 0.98 }}  // Slight press effect
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
    >
      {children}
    </motion.div>
  )
}

// Button with scale effect
export function HoverScaleButton({
  children,
  className,
  onClick
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  )
}
```

**Pattern 34: Magnetic Button (Cursor Follow)**
```typescript
// components/magnetic-button.tsx
// Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt

'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

export function MagneticButton({
  children,
  className,
  strength = 0.15
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (clientX - left - width / 2) * strength
    const y = (clientY - top - height / 2) * strength
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      animate={position}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.button>
  )
}
```

## 5.4 Text Animations

**Pattern 35: Character Split Animation**
```typescript
// components/split-text.tsx
// Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt

'use client'

import { motion } from 'framer-motion'

export function SplitText({
  text,
  className,
  delay = 0
}: {
  text: string
  className?: string
  delay?: number
}) {
  const characters = text.split('')

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.03,  // 30ms between each character
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {characters.map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, ease: 'easeOut' }
            },
          }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

// Usage
<h1 className="text-5xl font-bold">
  <SplitText text="Hello World" />
</h1>
```

**Pattern 36: Count Up Animation**
```typescript
// components/count-up.tsx
// Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt

'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export function CountUp({
  end,
  duration = 2,
  prefix = '',
  suffix = ''
}: {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      let start = 0
      const increment = end / (duration * 60)  // 60fps
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 1000 / 60)
      return () => clearInterval(timer)
    }
  }, [inView, end, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// Usage
<div className="stats">
  <div className="stat">
    <CountUp end={10000} suffix="+" /> Users
  </div>
  <div className="stat">
    <CountUp end={500} suffix="+" /> Projects
  </div>
</div>
```

## 5.5 Accessibility & Performance

**Pattern 37: Respect prefers-reduced-motion**
```typescript
// lib/animations.ts
// Source: Framer Motion accessibility guide

import { Variants } from 'framer-motion'

// Check user's motion preference
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Conditional animation
export const accessibleFadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: prefersReducedMotion ? 0 : 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion ? 0.01 : 0.5
    },
  },
}

// Or use MotionConfig globally
import { MotionConfig } from 'framer-motion'

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  )
}
```

**Pattern 38: Layout Animations (layout prop)**
```typescript
// components/expandable-card.tsx
// Source: Framer Motion layout animations

'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export function ExpandableCard({ title, content }: { title: string, content: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      layout  // Automatically animates layout changes
      className="card p-6 cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <motion.h3 layout="position" className="font-bold">
        {title}
      </motion.h3>
      {isOpen && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-4"
        >
          {content}
        </motion.p>
      )}
    </motion.div>
  )
}

// layout prop animates size/position changes smoothly
// No manual animation needed!
```

---

## [SECTION 12 (dup letter): VISUAL STORYTELLING FRAMEWORK (narrative structure for UI)]

===========================================
SECTION 12: VISUAL STORYTELLING FRAMEWORK
===========================================

Source: agency-agents/design/design-visual-storyteller.md

## 12.1 Narrative Structure for UI

**Pattern 89: Story Arc in Landing Pages**
```
Visual Narrative Structure:

1. BEGINNING (Above the Fold)
   ├── Hook: Attention-grabbing headline
   ├── Problem Statement: Pain point identification
   └── Promise: What transformation awaits

2. RISING ACTION (Features/Benefits)
   ├── Conflict: Current state problems
   ├── Solution Introduction: How product helps
   └── Building Credibility: Social proof, testimonials

3. CLIMAX (Social Proof Section)
   ├── Transformation Stories: Before/after
   ├── Success Metrics: Numbers, results
   └── Trust Signals: Logos, certifications

4. FALLING ACTION (Pricing/FAQ)
   ├── Objection Handling: FAQ answers
   ├── Value Justification: Pricing context
   └── Risk Removal: Guarantees, trials

5. RESOLUTION (CTA/Footer)
   ├── Clear Call to Action: What to do next
   ├── Urgency Elements: Why act now
   └── Contact Options: Support, follow-up
```

**Pattern 90: Emotional Journey Mapping**
```typescript
// lib/story-patterns.ts

interface StorySection {
  name: string
  emotion: 'curiosity' | 'frustration' | 'hope' | 'confidence' | 'excitement'
  intensity: number // 1-10
  visualElements: string[]
  animations: string[]
}

export const landingPageStory: StorySection[] = [
  {
    name: 'Hero',
    emotion: 'curiosity',
    intensity: 7,
    visualElements: ['Bold headline', 'Aspirational imagery', 'Subtle animation'],
    animations: ['fadeUp', 'typewriter', 'particles']
  },
  {
    name: 'Problem',
    emotion: 'frustration',
    intensity: 5,
    visualElements: ['Relatable scenarios', 'Pain point icons', 'Muted colors'],
    animations: ['slideInLeft', 'stagger']
  },
  {
    name: 'Solution',
    emotion: 'hope',
    intensity: 8,
    visualElements: ['Product screenshots', 'Feature highlights', 'Brighter colors'],
    animations: ['scaleIn', 'reveal', 'glow']
  },
  {
    name: 'Proof',
    emotion: 'confidence',
    intensity: 9,
    visualElements: ['Testimonials', 'Logos', 'Metrics', 'Faces'],
    animations: ['countUp', 'carousel', 'fadeIn']
  },
  {
    name: 'CTA',
    emotion: 'excitement',
    intensity: 10,
    visualElements: ['Prominent button', 'Benefit reminder', 'Urgency'],
    animations: ['pulse', 'gradient', 'attention']
  }
]
```

**Pattern 91: Data Visualization Storytelling**
```typescript
// components/data-story.tsx
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

interface MetricProps {
  label: string
  value: number
  suffix?: string
  prefix?: string
  description?: string
}

export function MetricCard({ label, value, suffix = '', prefix = '', description }: MetricProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center p-8"
    >
      <div className="text-5xl font-bold text-primary mb-2">
        {prefix}{displayValue.toLocaleString()}{suffix}
      </div>
      <div className="text-lg font-semibold mb-1">{label}</div>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </motion.div>
  )
}

// Usage
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <MetricCard
    label="Users"
    value={100000}
    suffix="+"
    description="Active monthly users worldwide"
  />
  <MetricCard
    label="Uptime"
    value={99.9}
    suffix="%"
    description="Guaranteed service availability"
  />
  <MetricCard
    label="Support"
    value={24}
    suffix="/7"
    description="Round-the-clock customer support"
  />
</div>
```

