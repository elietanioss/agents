# Vercel Web Interface Guidelines

Source: https://vercel.com/design/guidelines (extracted 2026-07-02)

## Interactions & Accessibility

- **Keyboard operability**: All flows keyboard-accessible following WAI-ARIA Authoring Patterns.
- **Focus rings**: Use `:focus-visible` to show focus only for keyboard users; preserve pointer usability.
- **Hit targets**: Minimum 24px (44px on mobile); expand visual targets smaller than 24px.
- **Mobile input font**: Minimum 16px to prevent iOS auto-zoom, or set viewport meta.
- **Browser zoom**: Never disable; never block paste in inputs; allow all keystrokes, validate later.
- **Loading states**: Spinner keeps original label; 150–300ms delay + 300–500ms min visibility to avoid flicker.
- **Destructive actions**: Require confirmation or undo with safe recovery window.
- **Navigation**: Use `<a>`/`<Link>`, never a button.
- **Notifications**: Use `aria-live="polite"` for toasts & inline validation.

## Animations

- **Prefers-reduced-motion**: Always provide reduced-motion variants.
- **GPU-accelerated properties**: Animate only `transform` & `opacity`; avoid width/height/top/left.
- **Intentional animation**: Clarify cause/effect or intentional delight only; cancelable; never autoplay.
- **Property specificity**: Never `transition: all`; list specific properties.
- **SVG transforms**: Transform `<g>` wrappers with `transform-box: fill-box`.

## Layout & Spacing

- **Optical alignment**: Adjust ±1px when perception beats geometry.
- **Deliberate alignment**: Every element aligns to grid/baseline/edge/center intentionally.
- **Responsive testing**: Test mobile, laptop, ultra-wide (50% zoom).
- **Safe areas**: Use CSS `env()` for notches; remove unnecessary scrollbars; fix overflow.
- **Layout efficiency**: Prefer flex/grid over JS measurement; avoid layout thrash.

## Forms

- **Enter key behavior**: Submits when single control; applies to last control if multiple.
- **Label + accessible names**: Every control has `<label>` or accessible name; clicking label focuses input.
- **Submit state**: Keep enabled until request starts; disable during flight + spinner.
- **Feedback vs blocking**: Allow any input, show feedback vs blocking keystrokes; focus first error on submit.
- **Browser hints**: Set `autocomplete` + meaningful `name`.
- **Textarea Enter**: ⌘/⌃+Enter submits; Enter = newline.
- **Search fields**: `autocomplete="off"` for search; placeholder shows example pattern; warn on unsaved changes.

## Performance

- **Request budget**: POST/PATCH/DELETE < 500ms.
- **Render optimization**: Minimize re-renders (React DevTools); virtualize large lists or `content-visibility: auto`.
- **Image handling**: Explicit dimensions, lazy-load below fold; preload+subset critical fonts (unicode-range).
- **Computation**: Move expensive compute off main thread; prefer uncontrolled inputs for keystroke perf.

## Design System

- **Shadows**: Layer ≥2 shadows (ambient + direct); combine borders with shadows; semi-transparent borders.
- **Border radius**: Child border-radius ≤ parent (concentric). Tint borders/shadows toward background hue.
- **Contrast**: Prefer APCA over WCAG2; increase contrast on interaction.
- **Browser theming**: `<meta name="theme-color">` matches background; `color-scheme: dark` on HTML for scrollbar contrast.
- **Text animation**: Scale wrappers not text; `translateZ(0)` if artifacts. Use background images vs CSS masks for gradient fades (avoid banding).
