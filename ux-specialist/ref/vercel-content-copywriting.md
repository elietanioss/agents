# Vercel Content & Copywriting Guidelines

Source: Vercel Web Interface Guidelines (extracted 2026-07-02)

## URL & State

- **Persist all interactive state in URL**: Filters, tabs, pagination, expanded panels must be linkable.
- **Every interactive state is linkable**: Users should be able to share a link and see the exact state.
- **Scroll restoration**: Restore scroll position on back/forward navigation.

## Content & Typography

- **Inline help over tooltips**: Prefer contextual text over hover tooltips; accessible by default.
- **Skeleton layouts**: Skeletons should mirror the final layout to reduce cognitive load.
- **Page titles reflect context**: Titles should include filter/scope to aid user orientation.
- **Empty states**: Design for empty, sparse, dense, and error states explicitly.
- **Error recovery**: Every error screen offers a clear next step.
- **Typographic details**:
  - Curly quotes (smart quotes) for readability.
  - Tabular numbers for numerical comparisons (monospace alignment).
  - Ellipsis character (…) instead of three dots.
- **Icon-only buttons**: Always include `aria-label`; never icon-only without text backup.
- **Content length handling**: Layouts should handle short, average, and long content gracefully.
- **Locale formatting**: Use locale-aware formatting for dates, times, numbers, currency.
- **Content preservation**: Use `translate="no"` on brand/product names and code to prevent accidental translation.

## Copywriting (Vercel Voice)

### Tone & Style
- **Active, action-oriented voice**: "Install the CLI" not "The CLI can be installed".
- **Title Case for headings/buttons**: Chicago Manual of Style conventions.
- **Sentence case for marketing**: Marketing copy uses sentence case, less formal.
- **Concise**: Use "&" instead of "and"; prefer second person ("you"); use numerals for counts.

### Practical Details
- **Non-breaking spaces**: Put non-breaking space between number and unit: `10&nbsp;MB`.
- **Consistent decimals**: Within context, use consistent decimal precision (e.g., always 2 decimals for currency).
- **Specific button labels**: "Save API Key" not "Continue"; "Delete Account" not "Confirm".
- **Error messages guide resolution**: Every error message should suggest an action path, not just state the problem.
- **Positive framing**: "You can now X" instead of "No longer prevented from X".
- **Link text is self-explanatory**: "Learn more" links should expand to "Learn more about performance optimization" in context.

### Examples
- ❌ "An error occurred" → ✓ "Failed to load projects. Check your connection and try again."
- ❌ "Please continue" → ✓ "Deploy your changes"
- ❌ "and/or" → ✓ use "or" or list with commas
- ❌ "The API key was not found" → ✓ "Your API key is invalid. Generate a new one or check your settings."

## Accessibility in Copy

- **Label visibility**: Form labels should always be visible (placeholder alone is insufficient).
- **Instructions before input**: Place hint text above fields, not inside (placeholders can disappear).
- **Alt text for images**: Describe purpose, not just content ("Share this project with your team" vs "Graph showing metrics").
- **Form feedback**: Success and error messages should be announced to screen readers (`aria-live`).
- **Skip links**: Provide skip navigation for keyboard users (often hidden visually but available via focus).
