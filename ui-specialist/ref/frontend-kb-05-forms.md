## [SECTION 4.1: Accessible Form Components (react-hook-form + Zod + shadcn/ui, WCAG 2.2 AA)]

===========================================
SECTION 4: SHADCN/UI COMPONENT PATTERNS
===========================================

Source: Research-added (shadcn/ui documentation, component catalog)

## 4.1 Accessible Form Components

**Pattern 26: Form with shadcn/ui (WCAG 2.2 AA)**
```tsx
// components/contact-form.tsx
// Source: shadcn/ui + WCAG 2.2 accessibility patterns

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Form submission logic
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              {/* Automatic htmlFor linking */}
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  {...field}
                  aria-invalid={!!form.formState.errors.name}
                />
              </FormControl>
              <FormDescription>
                Your full name
              </FormDescription>
              {/* aria-describedby automatically linked */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  {...field}
                  aria-invalid={!!form.formState.errors.email}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your message..."
                  className="resize-none"
                  rows={5}
                  {...field}
                  aria-invalid={!!form.formState.errors.message}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full sm:w-auto"
        >
          {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  )
}

/* Accessibility features (automatic via shadcn/ui):
   - htmlFor attribute on labels
   - aria-invalid on error states
   - aria-describedby for error messages
   - Keyboard navigation (Tab order)
   - Screen reader announcements
   - WCAG 2.2 AA color contrast
*/
```

**Pattern 27: Dialog with Focus Management**
```tsx
// components/confirm-dialog.tsx
// Source: shadcn/ui Radix UI primitives

'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export function ConfirmDialog({
  onConfirm,
  title,
  description
}: {
  onConfirm: () => void
  title: string
  description: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/* Accessibility features (Radix UI):
   - Focus trap (keeps focus inside dialog)
   - Escape key to close
   - Focus returns to trigger on close
   - aria-modal="true"
   - aria-labelledby for title
   - aria-describedby for description
*/
```

---

## [SECTION 13: INFORMATION ARCHITECTURE (page hierarchy & visual weight)]

===========================================
SECTION 13: INFORMATION ARCHITECTURE
===========================================

Source: agency-agents/design/design-ux-architect.md

## 13.1 Page Hierarchy & Visual Weight

**Pattern 92: Information Hierarchy System**
```markdown
## Page Hierarchy Structure

### Level 1: Primary (Highest Visual Weight)
- H1 page title: Largest text, highest contrast
- Hero CTA button: Prominent, contrasting color
- Primary navigation: Always visible, top of page

### Level 2: Secondary (High Visual Weight)
- H2 section headings: Second largest, section anchors
- Feature cards: Highlighted content blocks
- Secondary CTAs: Visible but less prominent

### Level 3: Tertiary (Medium Visual Weight)
- H3 subsection headings: Content grouping
- Body text: Readable, comfortable size
- List items: Scannable content

### Level 4: Supporting (Lower Visual Weight)
- Captions: Smaller, muted text
- Metadata: Dates, categories, tags
- Footer content: Supporting information

### Visual Weight Indicators
- Size: Larger = more important
- Color: High contrast = attention
- Position: Top/left = read first (LTR languages)
- Whitespace: More space = more emphasis
- Weight: Bold = importance
```

**Pattern 93: Navigation Architecture**
```typescript
// lib/navigation.ts

interface NavItem {
  label: string
  href: string
  priority: 'primary' | 'secondary' | 'utility'
  children?: NavItem[]
}

export const navigationArchitecture: NavItem[] = [
  // Primary Navigation (5-7 items max)
  {
    label: 'Products',
    href: '/products',
    priority: 'primary',
    children: [
      { label: 'Features', href: '/features', priority: 'secondary' },
      { label: 'Pricing', href: '/pricing', priority: 'secondary' },
      { label: 'Integrations', href: '/integrations', priority: 'secondary' }
    ]
  },
  {
    label: 'Solutions',
    href: '/solutions',
    priority: 'primary',
    children: [
      { label: 'For Startups', href: '/solutions/startups', priority: 'secondary' },
      { label: 'For Enterprise', href: '/solutions/enterprise', priority: 'secondary' }
    ]
  },
  {
    label: 'Resources',
    href: '/resources',
    priority: 'primary',
    children: [
      { label: 'Blog', href: '/blog', priority: 'secondary' },
      { label: 'Docs', href: '/docs', priority: 'secondary' },
      { label: 'Help Center', href: '/help', priority: 'secondary' }
    ]
  },
  {
    label: 'Company',
    href: '/about',
    priority: 'primary'
  },
  // Utility Navigation (right-aligned)
  {
    label: 'Sign In',
    href: '/login',
    priority: 'utility'
  },
  {
    label: 'Get Started',
    href: '/signup',
    priority: 'utility'
  }
]

// Best Practices:
// - Primary nav: 5-7 items max (cognitive load)
// - Dropdown depth: 2 levels max
// - Mobile: Hamburger menu with full navigation
// - Utility: Login/Signup always visible
// - Active states: Clear indication of current page
```

**Pattern 94: Content Section Architecture**
```typescript
// lib/section-architecture.ts

interface Section {
  id: string
  name: string
  purpose: string
  components: string[]
  placement: 'above-fold' | 'mid-page' | 'below-fold'
  priority: number
}

export const landingPageArchitecture: Section[] = [
  {
    id: 'hero',
    name: 'Hero Section',
    purpose: 'Capture attention, communicate value proposition',
    components: ['Headline', 'Subheadline', 'CTA', 'Hero Image/Video'],
    placement: 'above-fold',
    priority: 1
  },
  {
    id: 'social-proof',
    name: 'Logo Bar',
    purpose: 'Build instant credibility',
    components: ['Client logos', 'Trust badges', '"As seen in"'],
    placement: 'above-fold',
    priority: 2
  },
  {
    id: 'problem',
    name: 'Problem Statement',
    purpose: 'Connect with user pain points',
    components: ['Pain point cards', 'Relatable scenarios'],
    placement: 'mid-page',
    priority: 3
  },
  {
    id: 'solution',
    name: 'Solution/Features',
    purpose: 'Show how product solves problems',
    components: ['Feature grid', 'Screenshots', 'Demos'],
    placement: 'mid-page',
    priority: 4
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    purpose: 'Provide social proof from real users',
    components: ['Quote cards', 'User photos', 'Company logos'],
    placement: 'mid-page',
    priority: 5
  },
  {
    id: 'pricing',
    name: 'Pricing',
    purpose: 'Present options and value',
    components: ['Pricing cards', 'Feature comparison', 'Toggle'],
    placement: 'mid-page',
    priority: 6
  },
  {
    id: 'faq',
    name: 'FAQ',
    purpose: 'Address objections and questions',
    components: ['Accordion items', 'Search'],
    placement: 'below-fold',
    priority: 7
  },
  {
    id: 'cta-final',
    name: 'Final CTA',
    purpose: 'Drive conversion action',
    components: ['Large CTA button', 'Value reminder', 'Guarantee'],
    placement: 'below-fold',
    priority: 8
  }
]
```

