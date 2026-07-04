# Taste Skill: Design Dials Framework

Source: taste-skill v2 + ponytail YAGNI principles (extracted 2026-07-02)

## Three Numeric Design Controls (1–10 Scale)

### DESIGN_VARIANCE: Layout Experimentation
- **1–3 (Centered/Clean)**: Symmetric, grid-aligned, minimal asymmetry. Safe, professional, predictable.
- **5 (Balanced)**: Mix of alignment strategies; some asymmetry for visual interest, grounded in rationale.
- **7–10 (Asymmetric/Modern)**: Experimental layouts, overlapping elements, unconventional white space. Requires intentionality to avoid randomness.

### MOTION_INTENSITY: Animation Depth
- **1–3 (Hover-Only)**: Subtle hover states, no scroll animations, minimal transitions.
- **5 (Balanced)**: Strategic scroll effects, magnetic interactions, spring easing on key moments.
- **7–10 (Complex)**: Parallax, stagger animations, frame-by-frame choreography, Lottie-level richness.
- **Always respect `prefers-reduced-motion`** with disabled variants at all levels.

### VISUAL_DENSITY: Information Density
- **1–3 (Spacious)**: Ample whitespace, large typography, minimal card density. Focuses on one item per view.
- **5 (Balanced)**: Standard grid/list density, comfortable scannability, reasonable padding.
- **7–10 (Dashboard/Dense)**: Multi-column tables, small typography for data density, minimal margins. High information-per-pixel.

## Anti-Slop Heuristics

1. **Check native before installing**: Use `<input type="date">` before flatpickr. Use `<details>` before Accordion library. Check if the browser can do it.
2. **Layout communicates intent**: Don't fill space arbitrarily. Whitespace should guide the user's eye.
3. **Typography first**: Premium fonts (Grotesk, Inter, Fraunces) > system font stack. Font choice is design.
4. **Motion is canonical**: Reference GSAP for spring easing, magnetic behavior, skeleton patterns. Don't invent.
5. **Component pre-flight**: Naming consistency, prop types strict, Storybook compliance before shipping.

## Aesthetic Direction Selection

**Soft**: Rounded corners, warm accent colors, gradients. Approachable, human-centered.
**Minimalist**: Monochrome/limited palette, flat design, negative space. Clean, focused, modern.
**Brutalist**: Stark monospace typography, heavy borders, visible structure, raw HTML. Honest, no-nonsense.

Choose ONE primary direction; secondary accents OK. Switch mid-project only if design goal changes.

## Minimal Code, Maximum Design

- **Reuse exists**: Audit the codebase for existing component patterns BEFORE writing new ones.
- **No boilerplate**: If the design system already has a button, don't create ButtonPrimary vs ButtonSecondary; use variants prop.
- **Redesign approach**: Audit existing state first, then fix. Don't rebuild.
- **Lazy principle**: "If the browser has one, use it" applies to components too—prefer platform primitives.

## Pre-Flight Checklist Before Shipping

- [ ] Naming is consistent across variants and props.
- [ ] All variant combinations tested (Storybook or similar).
- [ ] Dark mode variant exists (if applicable).
- [ ] Accessibility props present (`aria-label`, `role`, semantic HTML).
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] No unnecessary dependencies; used system utilities first.
