# AGENTS.md — Google Workspace CLI (gws)

## Project Overview

`gws` is a Rust CLI tool for interacting with Google Workspace APIs. It dynamically generates its command surface at runtime by parsing Google Discovery Service JSON documents.

> **Dynamic Discovery**: This project does NOT use generated Rust crates for API interaction. It fetches the Discovery JSON at runtime and builds `clap` commands dynamically. When adding a new service, only register it in `crates/google-workspace/src/services.rs`. Do NOT add new crates to `Cargo.toml` for standard Google APIs.

## Build & Test

```bash
cargo build          # Build in dev mode
cargo clippy -- -D warnings  # Lint check
cargo test           # Run tests
```

## Architecture

The CLI uses a **two-phase argument parsing** strategy:
1. Parse argv to extract the service name (e.g., `drive`)
2. Fetch the service's Discovery Document, build a dynamic `clap::Command` tree, then re-parse

### Workspace Layout

| Crate | Purpose |
|-------|---------|
| `crates/google-workspace/` | Publishable library — core types and helpers |
| `crates/google-workspace-cli/` | Binary crate — the `gws` CLI |

### Key Files

**Library (`crates/google-workspace/src/`):**
- `discovery.rs` — Serde models for Discovery Document + async fetch/cache
- `services.rs` — Service alias → Discovery API name/version mapping
- `validate.rs` — Path/URL/resource validators, `encode_path_segment()`
- `client.rs` — HTTP client with retry logic

**CLI (`crates/google-workspace-cli/src/`):**
- `auth.rs` — OAuth2 token acquisition
- `commands.rs` — Recursive `clap::Command` builder from Discovery resources
- `executor.rs` — HTTP request construction, response handling

## Input Validation (IMPORTANT for AI Agents)

This CLI is frequently invoked by AI/LLM agents. Always assume inputs can be adversarial.

| Scenario | Validator |
|----------|-----------|
| File path for writing | `validate::validate_safe_output_dir()` |
| File path for reading | `validate::validate_safe_dir_path()` |
| URL path segments | `crate::helpers::encode_path_segment()` |
| Resource names | `validate::validate_resource_name()` |
| Enum flags | clap `value_parser` allowlist |

## Environment Variables

### Authentication
| Variable | Description |
|---|---|
| `GOOGLE_WORKSPACE_CLI_TOKEN` | Pre-obtained OAuth2 access token |
| `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE` | Path to OAuth credentials JSON |
| `GOOGLE_APPLICATION_CREDENTIALS` | Standard Google ADC path |

### Configuration
| Variable | Description |
|---|---|
| `GOOGLE_WORKSPACE_CLI_CONFIG_DIR` | Override config directory (default: `~/.config/gws`) |
| `GOOGLE_WORKSPACE_CLI_LOG` | Log level filter (e.g., `gws=debug`) |

## Helper Commands (`+verb`)

Helpers are handwritten commands prefixed with `+` that provide value the schema-driven Discovery commands cannot: multi-step orchestration, format translation, or multi-API composition.

**Do NOT add a helper that** wraps a single API call already available via Discovery.

## PR Labels

- `area: discovery` — Discovery document fetching, caching, parsing
- `area: auth` — OAuth, credentials, multi-account, ADC
- `area: skills` — AI skill generation and management
- `area: distribution` — Release workflow, install methods
