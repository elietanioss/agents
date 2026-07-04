## [SECTION 3: TAILWIND CSS V4 PATTERNS (modern CSS, container queries, P3 color, logical properties)]

===========================================
SECTION 3: TAILWIND CSS V4 PATTERNS
===========================================

Source: Research-added (Tailwind CSS v4 official blog, 2025 features)

## 3.1 Modern CSS Features (@property, color-mix())

**Pattern 19: Registered Custom Properties with @property**
```css
/* app/globals.css */
/* Source: Tailwind CSS v4 modern features */

@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@property --accent-hue {
  syntax: '<number>';
  inherits: false;
  initial-value: 280;
}

/* Now you can animate gradients! */
.animated-gradient {
  background: linear-gradient(var(--gradient-angle), #667eea 0%, #764ba2 100%);
  animation: rotate-gradient 4s linear infinite;
}

@keyframes rotate-gradient {
  to {
    --gradient-angle: 360deg;
  }
}

/* Animated color themes */
.dynamic-theme {
  --accent-color: hsl(var(--accent-hue), 70%, 60%);
  animation: shift-hue 10s linear infinite;
}

@keyframes shift-hue {
  to {
    --accent-hue: 360;
  }
}
```

**Pattern 20: color-mix() for Dynamic Colors**
```css
/* Tailwind v4 automatic color mixing */

.primary-button {
  background: var(--primary);
  /* Hover: mix primary with white for lighter shade */
  &:hover {
    background: color-mix(in srgb, var(--primary) 85%, white);
  }
  /* Active: mix with black for darker shade */
  &:active {
    background: color-mix(in srgb, var(--primary) 85%, black);
  }
}

/* Semi-transparent overlays */
.overlay {
  background: color-mix(in srgb, var(--background) 80%, transparent);
  backdrop-filter: blur(8px);
}
```

**Pattern 21: Cascade Layers (@layer)**
```css
/* app/globals.css */
/* Source: Tailwind v4 cascade layers */

@layer reset, base, components, utilities;

@layer reset {
  /* Browser reset styles - lowest priority */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

@layer base {
  /* Design tokens and base styles */
  :root {
    --primary: #6366f1;
    --secondary: #8b5cf6;
  }

  body {
    font-family: var(--font-body);
  }
}

@layer components {
  /* Component styles */
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors;
  }
}

@layer utilities {
  /* Utility overrides - highest priority */
  .text-balance {
    text-wrap: balance;
  }
}

/* Specificity automatically handled by cascade layers */
```

## 3.2 Container Queries (No Plugin Required)

**Pattern 22: Container Query Patterns**
```tsx
// components/responsive-card.tsx
// Source: Tailwind v4 container queries

export function ResponsiveCard({ content }: { content: string }) {
  return (
    // @container makes this a query container
    <div className="@container">
      <div className="card p-4
        @sm:flex @sm:gap-4
        @md:grid @md:grid-cols-2
        @lg:grid-cols-3
      ">
        {/* Styles based on CONTAINER size, not viewport */}
        <img
          src="/image.jpg"
          alt=""
          className="@sm:w-32 @md:w-48 @lg:w-64"
        />
        <div className="content">
          <h3 className="@sm:text-lg @md:text-xl @lg:text-2xl">
            {content}
          </h3>
        </div>
      </div>
    </div>
  )
}

/* Container query breakpoints:
   @sm: 384px
   @md: 448px
   @lg: 512px
   @xl: 576px
   @2xl: 672px
*/
```

**Pattern 23: Named Containers**
```tsx
export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="@container/sidebar">
      <nav className="@lg/sidebar:flex @lg/sidebar:flex-col">
        {children}
      </nav>
    </aside>
  )
}

// Target specific container by name
```

## 3.3 P3 Color Palette

**Pattern 24: Wide Gamut Colors**
```css
/* app/globals.css */
/* Source: Tailwind v4 P3 color support */

:root {
  /* Wide gamut P3 colors (25% more colors than sRGB) */
  --vivid-red: color(display-p3 1 0.2 0.2);
  --vivid-blue: color(display-p3 0.2 0.4 1);
  --vivid-green: color(display-p3 0.3 0.95 0.4);
}

@supports (color: color(display-p3 1 0 0)) {
  /* P3-capable displays get vivid colors */
  .accent-primary {
    color: var(--vivid-red);
  }
}

@supports not (color: color(display-p3 1 0 0)) {
  /* Fallback to sRGB */
  .accent-primary {
    color: rgb(255, 51, 51);
  }
}
```

## 3.4 Logical Properties (RTL Support)

**Pattern 25: Automatic RTL with Logical Properties**
```tsx
// components/card.tsx
// Source: Tailwind v4 logical properties

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      card
      ps-4 pe-6    {/* padding-inline-start, padding-inline-end */}
      ms-auto      {/* margin-inline-start: auto (aligns to end) */}
      border-s-4   {/* border-inline-start (left in LTR, right in RTL) */}
      text-start   {/* text-align: start (adapts to direction) */}
    ">
      {children}
    </div>
  )
}

/* Logical properties automatically adapt to text direction
   - LTR: start = left, end = right
   - RTL: start = right, end = left
   No manual [dir="rtl"] selectors needed!
*/
```

===========================================

---

## [SECTION 6: DESIGN SYSTEM PATTERNS (typography, CSS variable color system, atmospheric backgrounds, entrance animations)]

===========================================
SECTION 6: DESIGN SYSTEM PATTERNS
===========================================

Source: Extracted from Claude_Code_Frontend_Aesthetics_Enhancement.txt + Master_Claude_Code_Architect.txt

## 6.1 Anti-Generic Typography

**Pattern 39: Distinctive Font Pairings**
```tsx
// app/layout.tsx
// Source: Extracted from Claude_Code_Frontend_Aesthetics_Enhancement.txt

import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'

// AVOID: Inter, Roboto, Arial, Space Grotesk (overused by AI)
// PREFER: Unique font combinations

const heading = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
})

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
```

```css
/* app/globals.css */
/* Source: Extracted from Claude_Code_Frontend_Aesthetics_Enhancement.txt */

:root {
  --font-heading: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

body {
  font-family: var(--font-body);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.2;
}

code, pre {
  font-family: var(--font-mono);
}
```

**Pattern 40: Font Pairing by Mood**
```typescript
// lib/font-config.ts
// Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt

export const fontPairings = {
  tech: {
    heading: 'Cabinet Grotesk',
    body: 'DM Sans',
    mono: 'JetBrains Mono',
  },
  creative: {
    heading: 'Bricolage Grotesque',
    body: 'Plus Jakarta Sans',
    mono: 'Fira Code',
  },
  corporate: {
    heading: 'Plus Jakarta Sans',
    body: 'Work Sans',
    mono: 'IBM Plex Mono',
  },
  luxury: {
    heading: 'Playfair Display',
    body: 'DM Sans',
    mono: 'IBM Plex Mono',
  },
  minimal: {
    heading: 'Satoshi',
    body: 'Satoshi',
    mono: 'Cascadia Code',
  },
}

// NEVER use: Inter, Roboto, Arial, Helvetica, system fonts
```

## 6.2 Color System with CSS Variables

**Pattern 41: Distinctive Color Palette (Tech/Modern)**
```css
/* app/globals.css */
/* Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt */

:root {
  /* AVOID: Purple gradients on white (extremely overused) */
  /* PREFER: Distinctive combinations */

  --background: #0a0a0b;
  --foreground: #fafafa;

  --card: #111113;
  --card-foreground: #fafafa;

  --popover: #111113;
  --popover-foreground: #fafafa;

  --primary: #6366f1;  /* Indigo */
  --primary-foreground: #ffffff;

  --secondary: #27272a;  /* Dark gray */
  --secondary-foreground: #fafafa;

  --muted: #27272a;
  --muted-foreground: #a1a1aa;

  --accent: #22d3ee;  /* Cyan accent (10% usage) */
  --accent-foreground: #0a0a0b;

  --destructive: #ef4444;
  --destructive-foreground: #fafafa;

  --border: #27272a;
  --input: #27272a;
  --ring: #6366f1;

  --radius: 0.5rem;
}

/* Color distribution rule: 60% primary, 30% secondary, 10% accent */
```

**Pattern 42: Creative/Bold Color Palette**
```css
/* app/globals.css */
/* Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt */

:root {
  /* High contrast, energetic palette */

  --background: #0c0c0c;
  --foreground: #ffffff;

  --card: #161616;
  --card-foreground: #ffffff;

  --primary: #ff6b35;  /* Vivid orange */
  --primary-foreground: #0c0c0c;

  --secondary: #262626;
  --secondary-foreground: #ffffff;

  --accent: #7c3aed;  /* Purple accent */
  --accent-foreground: #ffffff;

  --border: #2a2a2a;
  --ring: #ff6b35;
}

/* Inspiration: IDE themes (VS Code, Tokyo Night, Dracula) */
```

## 6.3 Atmospheric Backgrounds

**Pattern 43: Layered Gradient Background**
```css
/* components/hero-section.module.css */
/* Source: Extracted from Claude_Code_Frontend_Aesthetics_Enhancement.txt */

.hero {
  background:
    radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 210, 63, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, #004E89 0%, #1A1A2E 100%);
}

/* Multiple radial gradients create depth */
/* Avoid solid colors - create atmosphere */
```

**Pattern 44: Animated Gradient Mesh**
```css
/* app/globals.css */
/* Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt */

.gradient-mesh {
  background:
    radial-gradient(at 40% 20%, hsla(240, 100%, 74%, 0.3) 0px, transparent 50%),
    radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.2) 0px, transparent 50%),
    radial-gradient(at 0% 50%, hsla(340, 100%, 76%, 0.2) 0px, transparent 50%),
    radial-gradient(at 80% 50%, hsla(240, 100%, 70%, 0.15) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 0.2) 0px, transparent 50%),
    hsl(240, 10%, 6%);
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(30px, -30px);
  }
  66% {
    transform: translate(-20px, 20px);
  }
}

.animated-mesh {
  animation: float 20s ease-in-out infinite;
}
```

**Pattern 45: Geometric Pattern Background**
```css
/* Source: Extracted from Claude_Code_Frontend_Aesthetics_Enhancement.txt */

.geometric-bg {
  background-image:
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255,255,255,.03) 10px,
      rgba(255,255,255,.03) 20px
    );
}

/* Subtle texture without overwhelming content */
```

**Pattern 46: Noise Texture Overlay**
```css
/* Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt */

.noise-overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  mix-blend-mode: overlay;
}

/* Adds subtle film grain texture */
```

## 6.4 Orchestrated Entrance Animations

**Pattern 47: Staggered Page Load Sequence**
```css
/* app/globals.css */
/* Source: Extracted from Claude_Code_Frontend_Aesthetics_Enhancement.txt */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero {
  animation: fadeInUp 0.8s ease forwards;
}

.feature-1 {
  animation: fadeInUp 0.8s ease 0.1s forwards;
  opacity: 0;  /* Start hidden */
}

.feature-2 {
  animation: fadeInUp 0.8s ease 0.2s forwards;
  opacity: 0;
}

.feature-3 {
  animation: fadeInUp 0.8s ease 0.3s forwards;
  opacity: 0;
}

/* Timeline:
   0.0s - Hero begins
   0.8s - Hero complete, Feature 1 begins
   0.9s - Feature 2 begins
   1.0s - Feature 3 begins
   1.1s - All complete
*/
```

**Pattern 48: Framer Motion Page Load Sequence**
```typescript
// components/hero-section.tsx
// Source: Extracted from Master_Claude_Code_Prompt_Generator_Final.txt

'use client'

import { motion } from 'framer-motion'
import { SplitText } from './split-text'

export function HeroSection() {
  return (
    <section className="hero min-h-screen flex items-center justify-center">
      <div className="container mx-auto text-center">
        {/* 0.3s - Headline character reveal */}
        <h1 className="text-6xl font-bold mb-6">
          <SplitText text="Build Something Amazing" delay={0.3} />
        </h1>

        {/* 0.8s - Subheadline fade up */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-xl text-muted-foreground mb-8"
        >
          The most powerful platform for creators
        </motion.p>

        {/* 1.0s - CTA button scale in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 1.0,
            type: 'spring',
            stiffness: 300
          }}
        >
          <button className="btn-primary">
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  )
}

/* Total sequence: 1.4s (feels natural, not too fast/slow) */
```

---

## [SECTION 22: FRONTEND AESTHETICS - Anti-Generic Design (anti-AI-slop system, color patterns, motion patterns, background/depth patterns)]

===========================================
SECTION 22: FRONTEND AESTHETICS (Anti-Generic Design)
===========================================

Source: Anthropic Frontend Aesthetics Cookbook (prompting_for_frontend_aesthetics.ipynb)

## 22.1 The Anti-AI-Slop Aesthetic System

**Pattern 114: Complete Anti-Generic Aesthetics Prompt**
```xml
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend
design, this creates what users call the "AI slop" aesthetic. Avoid this:
make creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid
generic fonts like Arial and Inter; opt instead for distinctive choices that
elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for
consistency. Dominant colors with sharp accents outperform timid, evenly-
distributed palettes. Draw from IDE themes and cultural aesthetics for
inspiration.

Motion: Use animations for effects and micro-interactions. Prioritize
CSS-only solutions for HTML. Use Motion library for React when available.
Focus on high-impact moments: one well-orchestrated page load with staggered
reveals (animation-delay) creates more delight than scattered micro-
interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid
colors. Layer CSS gradients, use geometric patterns, or add contextual
effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed
for the context. Vary between light and dark themes, different fonts,
different aesthetics.
</frontend_aesthetics>
```

**Pattern 115: Typography Excellence System**
```xml
<use_interesting_fonts>
Typography instantly signals quality. Avoid using boring, generic fonts.

NEVER use: Inter, Roboto, Open Sans, Lato, default system fonts

Impact choices by aesthetic:
- Code/Tech: JetBrains Mono, Fira Code, Space Grotesk
- Editorial/Magazine: Playfair Display, Crimson Pro, Fraunces
- Startup/Modern: Clash Display, Satoshi, Cabinet Grotesk
- Technical/Corporate: IBM Plex family, Source Sans 3
- Distinctive/Unique: Bricolage Grotesque, Obviously, Newsreader

Pairing principle: High contrast = interesting.
  Display + monospace, serif + geometric sans, variable font across weights.

Use extremes: 100/200 weight vs 800/900, not 400 vs 600.
Size jumps of 3x+, not 1.5x.

Pick one distinctive font, use it decisively. Load from Google Fonts.
State your choice before coding.
</use_interesting_fonts>
```

**Pattern 116: Theme Constraint Pattern**
```xml
<!-- Lock in a specific aesthetic for consistent generation -->
<always_use_solarpunk_theme>
Always design with Solarpunk aesthetic:
- Warm, optimistic color palettes (greens, golds, earth tones)
- Organic shapes mixed with technical elements
- Nature-inspired patterns and textures
- Bright, hopeful atmosphere
- Retro-futuristic typography
</always_use_solarpunk_theme>

<!-- Other theme examples -->
<always_use_brutalist_theme>
- Raw, unpolished aesthetic with bold typography
- Monospace fonts, harsh borders, stark contrasts
- Intentionally "ugly" but distinctive and memorable
</always_use_brutalist_theme>

<always_use_glassmorphism_theme>
- Frosted glass effects with backdrop-filter: blur()
- Semi-transparent surfaces with subtle borders
- Depth through layered translucent panels
- Light, airy color palettes with gradient overlays
</always_use_glassmorphism_theme>
```

## 22.2 Color System Patterns

**Pattern 117: Dominant Color with Sharp Accents**
```css
/* WRONG: Timid, evenly-distributed palette */
.bad-palette {
  --primary: #6366f1;    /* Indigo - the AI purple cliché */
  --secondary: #8b5cf6;  /* Purple - too similar */
  --accent: #a78bfa;     /* Light purple - yawn */
}

/* RIGHT: Dominant color with sharp accent */
.good-palette {
  --bg-dominant: #0a0a0a;        /* Deep black - 80% of surface */
  --surface: #1a1a2e;            /* Dark blue-black - cards/panels */
  --accent-primary: #00ff88;     /* Electric green - 5% usage, max impact */
  --accent-secondary: #ff6b35;   /* Warm orange - rare highlights */
  --text-primary: #e8e8e8;       /* Soft white */
  --text-muted: #666680;         /* Muted for secondary text */
}

/* IDE-inspired themes */
.dracula-inspired {
  --bg: #282a36;
  --surface: #44475a;
  --accent-pink: #ff79c6;
  --accent-green: #50fa7b;
  --accent-purple: #bd93f9;
  --accent-cyan: #8be9fd;
  --text: #f8f8f2;
}

.nord-inspired {
  --bg: #2e3440;
  --surface: #3b4252;
  --accent-blue: #88c0d0;
  --accent-green: #a3be8c;
  --accent-orange: #d08770;
  --text: #eceff4;
}
```

**Pattern 118: CSS Variable Theme System**
```css
/* Complete theme system with auto dark/light */
:root {
  /* Light theme */
  --color-bg: #fafaf9;
  --color-surface: #ffffff;
  --color-surface-raised: #f5f5f4;
  --color-border: #e7e5e4;
  --color-text: #1c1917;
  --color-text-muted: #78716c;
  --color-accent: #059669;
  --color-accent-hover: #047857;
  --color-accent-subtle: #d1fae5;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0c0a09;
    --color-surface: #1c1917;
    --color-surface-raised: #292524;
    --color-border: #44403c;
    --color-text: #fafaf9;
    --color-text-muted: #a8a29e;
    --color-accent: #34d399;
    --color-accent-hover: #6ee7b7;
    --color-accent-subtle: #064e3b;
  }
}
```

## 22.3 Motion & Animation Patterns

**Pattern 119: Staggered Page Load Reveal**
```typescript
// HIGH IMPACT: One orchestrated page load > scattered micro-interactions
'use client'

import { motion } from 'framer-motion'

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,       // 100ms between each child
      delayChildren: 0.2,         // 200ms before first child
    }
  }
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]  // Custom easing
    }
  }
}

export function StaggeredHero() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.h1 variants={staggerItem} className="text-6xl font-bold">
        Welcome
      </motion.h1>
      <motion.p variants={staggerItem} className="text-xl text-muted-foreground">
        Staggered reveal creates delight
      </motion.p>
      <motion.div variants={staggerItem}>
        <button className="px-6 py-3 bg-accent rounded-2xl">
          Get Started
        </button>
      </motion.div>
    </motion.section>
  )
}
```

**Pattern 120: CSS-Only Animations (No JS Required)**
```css
/* For HTML projects without React/Framer Motion */

/* Fade-in on scroll using animation-timeline */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal-on-scroll {
  animation: fadeInUp 0.6s ease-out forwards;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}

/* Staggered children with animation-delay */
.stagger-children > * {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}
.stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
.stagger-children > *:nth-child(4) { animation-delay: 0.4s; }
.stagger-children > *:nth-child(5) { animation-delay: 0.5s; }

/* Smooth hover micro-interaction */
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Skeleton loading animation */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg,
    var(--color-surface) 25%,
    var(--color-surface-raised) 50%,
    var(--color-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}
```

## 22.4 Background & Depth Patterns

**Pattern 121: Layered Background System**
```css
/* Create atmosphere and depth - NOT solid colors */

/* Gradient mesh background */
.gradient-mesh {
  background:
    radial-gradient(at 20% 80%, hsla(160, 80%, 50%, 0.15) 0, transparent 50%),
    radial-gradient(at 80% 20%, hsla(280, 80%, 50%, 0.12) 0, transparent 50%),
    radial-gradient(at 50% 50%, hsla(220, 80%, 50%, 0.08) 0, transparent 70%),
    var(--color-bg);
}

/* Geometric dot pattern */
.dot-pattern {
  background-image: radial-gradient(
    circle,
    var(--color-border) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
}

/* Grid pattern overlay */
.grid-pattern {
  background-image:
    linear-gradient(var(--color-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.3;
}

/* Noise texture */
.noise-overlay::after {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 50;
}
```

