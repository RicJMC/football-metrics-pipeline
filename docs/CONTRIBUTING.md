# Contributing to football-metrics-pipeline

This repository follows a deliberate, AI-assisted, PR-driven workflow. The owner is currently the only contributor; the rules below exist to **train the workflow** and to keep the project portable to a real team in the future.

If you found this file as an external contributor: welcome. Open an issue first to discuss intent before opening a PR.

## TL;DR

1. Read the relevant ADR(s) under [docs/adr/](docs/adr/).
2. Create a feature branch off `main`.
3. Make the smallest change that delivers the intent.
4. Run `npm run verify` locally.
5. Open a PR. Fill the PR template honestly.
6. Wait for CI green.
7. (Optional) Request AI review (Copilot Code Review and/or local `reviewer` agent).
8. Final human gate: the repo owner approves and merges (squash).

## The agentic three-layer workflow

```
Issue (intent)
  └─> Implementer agent (branch + commits + draft PR)
        └─> Layer 1: CI (lint + verify + tests)     [automatic, blocking]
        └─> Layer 2: AI reviewer                    [on-demand]
             • GitHub Copilot Code Review
             • Local `reviewer` agent (in chat)
        └─> Layer 3: Human (owner)                  [final gate]
              └─> squash + merge
```

See [ADR-0006](docs/adr/0006-agentic-pr-workflow.md) for the rationale.

## Local agents

Two execution agents and one review agent live under [.github/agents/](.github/agents/):

| Agent | Role | Can edit code? |
| --- | --- | --- |
| `designer` | Plans modernization steps, drafts ADRs, proposes fixtures. | Yes (for ADR drafts) |
| `implementer` | Executes approved tasks; characterization-first. | Yes |
| `reviewer` | Reads diff + repo + ADRs, posts `APPROVE` / `REQUEST_CHANGES`. | **No** (read-only) |

Invoke them from VS Code Chat with `@designer`, `@implementer`, `@reviewer`.

## When to request which AI review

| Situation | Recommended reviewer |
| --- | --- |
| Touches `scrappe/*`, `scripts/playerStats*.js`, parsing, deps, CI, security | Copilot Code Review **and** local `reviewer` agent |
| Touches `docs/`, README, ADRs, comments | Local `reviewer` agent (optional) |
| Single-line typo fix | None — go straight to human gate |
| Touches `.github/workflows/`, `.github/agents/`, `eslint.config.js` | Both AI layers + extra human scrutiny |

Copilot Code Review is **manual** in this repo (not auto-requested on every PR). Trigger it from the PR sidebar when you want a second pair of eyes.

## Commit and PR conventions

- **Conventional commits** in PR titles: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `style:`, `ci:`, `perf:`, `build:`.
- One intent per commit. Never mix doc, refactor, and behavior changes.
- Squash on merge.
- PR title becomes the squash commit subject; the PR description becomes the body.

## What is enforced by `main` branch protection

- Force-push blocked.
- Branch deletion blocked.
- Linear history (squash only).
- Status check `verify` must be green before merge.
- **Admin bypass is enabled** for the owner so emergency reverts and documentation typos remain unblocked. This is a deliberate trade-off for a solo repo (see ADR-0006).

## What is NOT enforced (and why)

- Required review approval: GitHub disallows author self-approval. For a solo owner that would block all merges. The PR template + AI reviewers + manual self-review fill the gap.
- `CODEOWNERS`: decorative for a solo repo. Revisit when collaborators exist.
- Auto-review on every PR: Copilot review consumes premium requests; opt-in keeps cost predictable.

## High-risk paths

The following paths require extra caution from any agent or human. They should not be modified casually:

- `.env`
- `data/`, `jsonfiles/`, `csv/*.csv`
- `scrappe/tmp/`
- `*log*`, `errorLog*.txt`
- Anything under `node_modules/`

See [.github/instructions/safe-change.instructions.md](.github/instructions/safe-change.instructions.md).

## Local validation

```bash
npm ci
npm run lint                  # eslint
npm run format:check          # prettier
npm run test:characterization # node --test snapshot suite
npm run verify                # full bundle (must be green before PR)
```

## Adding a new ADR

1. Copy `docs/adr/0000-template.md` to `docs/adr/NNNN-short-title.md`.
2. Status starts as `Proposed`.
3. Open a PR. Mark `Accepted` (or `Superseded by ADR-XXXX`) on merge.
4. Update [docs/adr/README.md](docs/adr/README.md) index.

## Reporting security issues

See [docs/SECURITY.md](docs/SECURITY.md).
