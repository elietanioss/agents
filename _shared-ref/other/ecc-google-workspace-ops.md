---
name: google-workspace-ops
description: Operate across Google Drive, Docs, Sheets, and Slides as one workflow surface for plans, trackers, decks, and shared documents. Use when the user needs to find, summarize, edit, migrate, or clean up Google Workspace assets without dropping to raw tool calls.
origin: ECC
---

# Google Workspace Ops

This skill is for operating shared docs, spreadsheets, and decks as working systems, not just editing one file in isolation.

## When to Use

- User needs to find a doc, sheet, or deck and update it in place
- Consolidating plans, trackers, notes, or customer lists stored in Google Drive
- Cleaning or restructuring a shared spreadsheet
- Importing, repairing, or reformatting a Google Slides deck
- Producing summaries from Docs, Sheets, or Slides for decision-making

## Preferred Tool Surface

Use Google Drive as the entry point, then switch to the right specialist:
- Google Docs for text-heavy docs
- Google Sheets for tabular work, formulas, and charts
- Google Slides for decks, imports, template migration, and cleanup

Do not guess structure from filenames alone. Inspect first.

## Workflow

### 1. Find the asset
Start with Drive search. Locate the exact file, sibling assets, likely duplicates, recently modified versions. Confirm by title, owner, modified time, or folder if several look similar.

### 2. Inspect before editing
Before making changes: summarize current structure, identify tabs/headings/slide count, detect whether the task is local cleanup or structural surgery. Pick the smallest tool that can safely perform the work.

### 3. Edit with precision
- For Docs: use index-aware edits, not vague rewrites
- For Sheets: operate on explicit tabs and ranges
- For Slides: distinguish content edits from visual cleanup or template migration

### 4. Keep the working system clean
Also surface: duplicate trackers, outdated decks, stale docs vs canonical docs, whether the asset should be archived, merged, or renamed.

## Output Format

```text
ASSET
- file name
- type
- why this is the right file

CURRENT STATE
- structure summary
- key problems or blockers

ACTION
- edits made or recommended

FOLLOW-UPS
- archive / merge / duplicate cleanup / next file to update
```

## Good Use Cases

- "Find the active planning doc and condense it"
- "Clean up this customer spreadsheet and show me the churn-risk rows"
- "Import this deck into Slides and make it presentable"
- "Find the current tracker, not the stale duplicate"
