# Git Strategy

GSD uses git for milestone isolation and sequential commits within each milestone. You choose an **isolation mode** that controls where work happens. The strategy is fully automated — you don't need to manage branches manually.

## Isolation Modes

| Mode | Working Directory | Branch | Best For |
|------|-------------------|--------|----------|
| `worktree` (default) | `.gsd/worktrees/<MID>/` | `milestone/<MID>` | Most projects — full file isolation |
| `branch` | Project root | `milestone/<MID>` | Submodule-heavy repos |
| `none` | Project root | Current branch | Hot-reload workflows |

### `worktree` Mode (Default)

Each milestone gets its own git worktree at `.gsd/worktrees/<MID>/`. On completion, the worktree is squash-merged to main as one clean commit. The worktree and branch are then cleaned up.

### `none` Mode

Work happens directly on your current branch. GSD still commits sequentially with conventional commit messages, but there's no branch isolation. Use for hot-reload workflows where file isolation breaks dev tooling.

## Commit Format

```
feat: core type definitions

GSD-Task: M001/S01/T01
```

## Workflow Modes

```yaml
mode: solo    # personal projects — auto-push, squash, simple IDs
mode: team    # shared repos — unique IDs, push branches, pre-merge checks
```

| Setting | `solo` | `team` |
|---|---|---|
| `git.auto_push` | `true` | `false` |
| `git.push_branches` | `false` | `true` |
| `git.pre_merge_check` | `false` | `true` |
| `git.merge_strategy` | `"squash"` | `"squash"` |
| `unique_milestone_ids` | `false` | `true` |

## Git Preferences

```yaml
git:
  auto_push: false
  push_branches: false
  remote: origin
  isolation: worktree         # "worktree", "branch", or "none"
  merge_strategy: squash
  commit_docs: true           # commit .gsd/ to git
  auto_pr: false              # create PR on milestone completion
  pr_target_branch: develop
```

## Automatic Pull Requests

```yaml
git:
  auto_push: true
  auto_pr: true
  pr_target_branch: develop
```

Requires `gh` CLI installed and authenticated.

## Self-Healing

GSD includes automatic recovery for common git issues:

- **Detached HEAD** — automatically reattaches to the correct branch
- **Stale lock files** — removes `index.lock` files from crashed processes
- **Orphaned worktrees** — detects and offers to clean up abandoned worktrees

Run `/gsd doctor` to check git health manually.

## Native Git Operations

Since v2.16, GSD uses libgit2 via native bindings for read-heavy operations in the dispatch hot path. This eliminates ~70 process spawns per dispatch cycle.
