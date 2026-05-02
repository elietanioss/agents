# Agent Harness: GUI-to-CLI for Open Source Software

## Purpose

Standard operating procedure and toolkit for coding agents to build powerful, stateful CLI interfaces for open-source GUI applications. Let AI agents operate software designed for humans, without needing a display or mouse.

## General SOP: Turning Any GUI App into an Agent-Usable CLI

### Phase 1: Codebase Analysis

1. **Identify the backend engine** — Find the core library/framework (e.g., MLT for Shotcut, ImageMagick for GIMP).
2. **Map GUI actions to API calls** — Every button click corresponds to a function call. Catalog these mappings.
3. **Identify the data model** — What file formats does it use? (XML, JSON, binary, database?)
4. **Find existing CLI tools** — Many backends ship their own CLI. These are building blocks.
5. **Catalog the command/undo system** — If the app has undo/redo, it likely uses a command pattern.

### Phase 2: CLI Architecture Design

**Interaction models:**
- **Stateful REPL** for interactive sessions (agents that maintain context)
- **Subcommand CLI** for one-shot operations (scripting, pipelines)
- **Both** (recommended)

**Command groups:** project management, core operations, import/export, configuration, session/state management.

**Output format:** Human-readable for interactive use + JSON via `--json` flag for agent consumption.

### Phase 3: Implementation

1. Start with the data layer — XML/JSON manipulation of project files
2. Add probe/info commands — Let agents inspect before they modify
3. Add mutation commands — One command per logical operation
4. Add the backend integration — A `utils/<software>_backend.py` module wrapping the real software's CLI
5. Add rendering/export — Call the real software for conversion
6. Add session management — State persistence with file locking

### #1 Rule: Use the Real Software

**The CLI MUST call the actual software for rendering and export — not reimplement it in Python.**

```python
# CORRECT — call the real software
subprocess.run(["libreoffice", "--headless", "--convert-to", "pdf", odf_path])

# WRONG — reimplementing LibreOffice in Python
```

Software mapping:

| Software | Backend CLI | Native Format |
|----------|-------------|---------------|
| LibreOffice | `libreoffice --headless` | ODF ZIP |
| Blender | `blender --background --python` | .blend |
| GIMP | `gimp -i -b '(script-fu ...)'` | .xcf |
| Inkscape | `inkscape --actions="..."` | .svg |
| Shotcut/Kdenlive | `melt` or `ffmpeg` | .mlt XML |

### Phase 4: Test Planning (TEST.md)

Create `TEST.md` BEFORE writing test code. Must contain:
1. Test inventory plan (files + estimated counts)
2. Unit test plan per core module
3. E2E test plan (real-world scenarios)
4. Realistic workflow scenarios

### Phase 5: Test Implementation

- Unit tests — synthetic data, no external dependencies
- E2E tests — invoke the **real software**, verify output exists + correct format (magic bytes)
- CLI subprocess tests — test the installed `cli-anything-<software>` command via `_resolve_cli()`
- **No graceful degradation** — if the software isn't installed, tests fail, not skip

## CLI Design Principles

- **Fail loudly and clearly** — Agents need unambiguous error messages
- **Be idempotent where possible**
- **Provide introspection** — `info`, `list`, `status` commands are critical
- **JSON output mode** — Every command MUST support `--json`
- **REPL as default** — `invoke_without_command=True`, REPL starts when no subcommand given

## Directory Structure

```
<software>/
└── agent-harness/
    ├── setup.py
    ├── cli_anything/          # Namespace package (NO __init__.py)
    │   └── <software>/
    │       ├── __init__.py
    │       ├── <software>_cli.py
    │       ├── core/
    │       ├── utils/
    │       │   ├── <software>_backend.py
    │       │   └── repl_skin.py
    │       └── tests/
    │           ├── TEST.md
    │           ├── test_core.py
    │           └── test_full_e2e.py
    └── examples/
```

**Critical:** `cli_anything/` must NOT contain `__init__.py` — it is a PEP 420 namespace package.
