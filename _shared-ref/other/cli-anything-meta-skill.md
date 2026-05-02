---
name: cli-hub-meta-skill
description: >-
  Discover agent-native CLIs for professional software. Access the live catalog
  to find tools for creative workflows, productivity, AI, and more.
---

# CLI-Hub Meta-Skill

CLI-Hub is a marketplace of agent-native command-line interfaces that make professional software accessible to AI agents.

## Live Catalog

**URL**: [`https://hkuds.github.io/CLI-Anything/SKILL.txt`](https://hkuds.github.io/CLI-Anything/SKILL.txt)

The catalog is auto-updated and provides:
- Full list of available CLIs organized by category
- One-line `pip install` commands for each tool
- Complete descriptions and usage patterns

## What Can You Do?

- **Creative workflows**: Image editing, 3D modeling, video production, audio processing, music notation
- **Productivity tools**: Office suites, knowledge management, live streaming
- **AI platforms**: Local LLMs, image generation, AI APIs, research assistants
- **Communication**: Video conferencing and collaboration
- **Development**: Diagramming, browser automation, network management

Each CLI provides stateful operations, JSON output for agents, REPL mode, and integrates with real software backends.

## How to Use

1. **Read the catalog**: Fetch `https://hkuds.github.io/CLI-Anything/SKILL.txt`
2. **Find your tool**: Browse by category
3. **Install**: Use the provided `pip install` command
4. **Execute**: All CLIs support `--json` flag for machine-readable output

## Example Workflow

```bash
pip install git+https://github.com/HKUDS/CLI-Anything.git#subdirectory=<software>/agent-harness
cli-anything-<software> --json <command> [options]
```

## Resources

- Live Catalog: https://hkuds.github.io/CLI-Anything/SKILL.txt
- Web Hub: https://hkuds.github.io/CLI-Anything/
- Repository: https://github.com/HKUDS/CLI-Anything
