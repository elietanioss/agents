# URL State & User Flows

Source: Vercel Guidelines + openspace-main patterns (extracted 2026-07-02)

## URL as Persistent State

### Core Principles

- **Every interactive state is linkable**: If a user can interact with it (filter, tab, pagination, sort), it belongs in the URL.
- **Restore on back/forward**: Browser back/forward should restore the exact previous state (scroll position, filters, selected tab).
- **Shareable links**: Users should be able to copy a link and hand it to someone else—both see the same view.

### Implementation Patterns

**Query parameters for transient state**:
```
/products?category=shoes&sort=price-asc&page=2
/analytics?from=2026-01-01&to=2026-07-01&view=daily
```

**Hash for client-only state** (less ideal; prefer query):
```
/docs#section-advanced-usage
```

**Nested routes for deep navigation**:
```
/users/123/projects/456/settings
```

### State Serialization Checklist

- [ ] All filters encoded in query string.
- [ ] Pagination state (page + size) in URL.
- [ ] Sorting state (field + order) in URL.
- [ ] Expanded panels (which accordion is open) encoded.
- [ ] Tab selection (current tab index or slug) in URL.
- [ ] Time range selections (date pickers) encoded.
- [ ] User selections (radio buttons, checkboxes) in URL if they affect content.

### Gotchas

- **Scroll restoration**: Manually store scroll position before navigation; restore after mount.
- **History API**: Use `window.history.replaceState()` for filter changes (doesn't create a new entry); use `pushState()` for major view changes.
- **Query string parsing**: Use a robust library (`query-string`, `URLSearchParams`) to avoid parsing bugs with special characters.
- **Back-button expectations**: Users expect back to undo the last action (filter change, tab switch, page navigation)—design accordingly.

## User Flow & State Design

### Transactional Flows

1. **Display empty state** if no data.
2. **Show loading skeleton** matching final layout.
3. **Display populated state** with primary action prominent.
4. **Error state**: Show error + recovery action (retry, contact support, learn more).

### Multi-Step Flows

- **Progress indicator**: Show which step user is on; allow back navigation.
- **Validation before submit**: Highlight errors inline (not just a summary at the end).
- **Undo/cancel**: Always provide a way to abandon the flow without side effects.
- **Summary before commit**: Confirmation screen before irreversible actions.

### Editing Flows

- **Unsaved indicator**: Show visual cue ("*" suffix on title, "Unsaved changes" banner) until saved.
- **Draft auto-save**: Save incrementally to server (every 30s or after typing pauses).
- **Conflict resolution**: If another user edited the same resource, show a merge/reload dialog, don't silently overwrite.
- **Keyboard shortcuts**: Alt+S for save, Escape to cancel (document in UI).

## State Persistence Strategy

### Client-Side Persistence

- **URL** (primary): Filters, pagination, view mode, tab selection.
- **localStorage** (secondary): User preferences (theme, sidebar collapsed state, last viewed project).
- **Session storage** (temporary): In-flight draft state, temporary selections that don't survive a refresh.

### Server-Side Persistence

- **Database**: User preferences, saved filters, bookmarks.
- **Cache** (for performance): Recent searches, auto-complete suggestions.

### Conflict Handling

- **Last-write-wins**: Simple but can lose data if multiple tabs/devices edit simultaneously.
- **Operational transformation (OT)**: Complex but enables collaborative editing (Figma, Google Docs style).
- **Event sourcing**: Store immutable events; replay to derive current state (audit trail built-in).

## Content-Specific UX Patterns

### Sparse Content
- Provide contextual help: "Start by creating a new X".
- Offer templates or example data to reduce cold-start friction.

### Dense Content (Dashboards)
- Persist visual collapse state (which panels are open/closed).
- Provide quick filters or search to reduce cognitive load.
- Use responsive truncation: "Show less"/"Show more" buttons for long lists.

### Long-Form Content
- Provide a table of contents with anchor links.
- Show reading time estimate.
- Highlight current section as user scrolls.
- Provide "next article" suggestion.

### Paginated / Infinite-Scroll Lists
- **Pagination**: URL reflects page; back button works predictably.
- **Infinite scroll**: Auto-load more as user scrolls; show loading indicator; include a "load more" button as fallback.
- **Virtualization**: For 1000+ items, use windowed lists to reduce DOM nodes.
