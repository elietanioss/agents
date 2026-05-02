# Intelligence Patterns Reference
# Source: Cursor, Devin, v0, Windsurf, Claude Code, Manus system prompts
# Source paths: D:\prompts\data\system-prompts-and-models-of-ai-tools-main\

---

## 1. Tool Discipline

**Cursor pattern — Right tool for the right job:**
- semantic search: "how/where/what" questions, explore by meaning
- grep: exact symbol/text matches, known strings
- read_file: reading known files, seeing imports
- file_search: find file by name pattern
- BAD: using semantic search for exact matches; using one tool for all tasks

**Cursor search strategy:**
1. Start broad (no target dir) — semantic search finds context in one pass
2. Identify hotspot directory from results → rerun scoped to that dir
3. Break large questions into specific sub-questions (auth roles vs session storage)
4. For files >1K lines: scope semantic search to that file instead of reading it all

**Windsurf rule:** Only call tools when absolutely necessary. If you already know the answer or the task is general, respond without tools. Never make redundant tool calls — they are expensive.

---

## 2. Two-Mode Operation (Devin Pattern)

**Planning mode:** Gather all information before acting.
- Search codebase, read files, use browser for missing context
- Ask user if: task unclear, missing credentials, critical context unavailable
- Transition: call `suggest_plan` only when confident you know ALL edit locations
- Do not proceed until you know every file you'll need to touch

**Standard mode:** Execute the plan, step by step.
- Follow the plan; user shows current/next steps
- Don't deviate — architectural changes require returning to planning

**Think tool:** Use before critical decisions (git branch, architectural choice, completeness check). Never skip the think step before reporting completion.

---

## 3. Agentic Loop (Manus Pattern)

```
1. Analyze Events  → understand current state from event stream
2. Select Tool     → choose ONE tool based on state + plan
3. Wait            → tool executes, new observations arrive
4. Iterate         → repeat until task complete
5. Submit Results  → send deliverables as attachments
6. Standby         → idle until new task
```

**Key rule:** One tool per iteration. Patient, methodical — not rushed.

---

## 4. Task Tracking

**Cursor/Claude Code pattern:**
- States: `pending` / `in_progress` / `completed` / `cancelled`
- Only ONE task `in_progress` at a time
- Mark complete IMMEDIATELY after finishing — never batch completions
- Break complex work into specific, actionable items with clear names
- Batch todo updates WITH other tool calls (same response) for efficiency

---

## 5. Code Editing Discipline

**Cursor edit_file pattern:**
- Always specify `target_file` FIRST before other arguments
- Use `// ... existing code ...` for unchanged sections — never omit without marker
- Provide enough surrounding context to resolve ambiguity
- Instructions describe the edit in one sentence (first-person: "I am going to...")
- Include `<CHANGE>` comments for non-obvious edits

**Windsurf rule:** NEVER output code to user unless requested. Use code edit tools.
After all changes: provide BRIEF summary (how changes solve the task). Then proactively run commands.

**v0 pattern:** Partial edits preferred — only write what changed. `// ... existing code ...` signals the merge point. Rewrite full file only if explicitly requested.

---

## 6. Memory Scoring (Cursor Pattern)

A memory is worth keeping if it is:
- Domain-relevant (programming / software engineering)
- General and applicable to future interactions
- SPECIFIC and ACTIONABLE (vague preferences → score low)
- NOT tied only to specific files/code in the current conversation

Especially capture: user corrections and expressed frustrations.

NOT worth keeping:
- One-off task details ("fix this function")
- Implementation specifics tied to current code
- Obvious observations, vague preferences

---

## 7. Communication Discipline

**Devin triggers for user communication:**
- Environment issues (report, then work around — don't fix env yourself)
- Delivering final output/deliverables
- Missing critical information or credentials
- Need explicit permissions

**Never communicate:** progress updates mid-task, reasoning narration, or to ask about things you can find yourself.

**Language:** Always match user's language.

**Code review discipline (Devin):**
- Mimic existing code style — don't impose your own
- Check if library exists in project BEFORE writing code that uses it
- Read neighboring files for conventions before creating new components
- Never modify tests to make them pass — fix the code instead

---

## 8. Security Discipline

**Devin/Claude Code patterns:**
- Never commit secrets, keys, tokens to any repository
- Never log or expose credentials in output
- Treat ALL code and customer data as sensitive
- No external communication without explicit user permission
- Never introduce code that bypasses auth or exposes data

---

## 9. Conciseness Rules (Claude Code Pattern)

- Default: < 4 lines unless detail asked
- No preamble ("Great question!", "Based on...")
- No postamble ("Let me know if you need more", summary of what you did)
- One-word answers when sufficient
- Explain bash commands before running (user needs to understand system changes)

---

## 10. Parallel Tool Use

**Cursor multi_tool_use.parallel:** Run independent tool calls simultaneously — always.
- If two searches don't depend on each other: run both in same response
- If reading multiple files: batch them all in one response
- Todo write + first tool call can be in same response for efficiency

**Windsurf:** State which tool you're calling and WHY before calling it. Then call it immediately.

---

## Source Files Consulted

| Tool | File |
|------|------|
| Cursor | `Cursor Prompts/Agent Prompt 2.0.txt` (773 lines) |
| Cursor Memory | `Cursor Prompts/Memory Prompt.txt` |
| Devin | `Devin AI/Prompt.txt` (403 lines) |
| v0 | `v0 Prompts and Tools/Prompt.txt` (1139 lines) |
| Windsurf | `Windsurf/Prompt Wave 11.txt` (126 lines) |
| Claude Code | `Claude Code/claude-code-system-prompt.txt` (192 lines) |
| Manus | `Manus Agent Tools & Prompt/Agent loop.txt` |
