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

## Local agentic playbook (ADR-0007)

The local agents drive PRs through a small set of `gh` commands. The helper at [scripts/internal/pr-context.js](../scripts/internal/pr-context.js) is the single source of truth for reading PR state — it consolidates conversation comments, inline review comments, reviews, and CI checks in one normalized payload. See [ADR-0007](adr/0007-local-agent-pr-toolkit.md).

### Marker conventions

Every agent-authored review or comment body MUST begin with a machine-readable marker so the GitHub audit trail can distinguish agent activity from manual human activity (both are authored by the owner's `gh` identity locally):

- Reviewer agent: `<!-- ai-reviewer:v1 -->` followed by `Verdict: APPROVE | REQUEST_CHANGES | COMMENT` and `Head SHA: <full sha>`.
- Implementer agent: `<!-- ai-implementer:v1 -->` followed by `Head SHA: <full sha>`.

### Happy path (no review feedback)

```powershell
# 1. Implementer opens the PR after pushing the branch.
git push -u origin feat/short-description
gh pr create `
  --title "feat(scope): one-line conventional commit" `
  --body-file .github/internal/pr-bodies/123.md `
  --base main

# 2. Wait for CI to start, then watch it.
gh run list --branch feat/short-description --limit 1
gh run watch <run-id> --exit-status

# 3. Reviewer agent (or human) reads the full PR state.
node scripts/internal/pr-context.js 123

# 4. Reviewer posts the verdict (body file starts with the ai-reviewer marker).
gh pr review 123 --approve --body-file .github/internal/reviews/123-approve.md

# 5. Human merges (the only actor allowed to merge).
gh pr merge 123 --squash --delete-branch
```

### Failure path (reviewer requests changes)

```powershell
# 1. Reviewer posts REQUEST_CHANGES.
gh pr review 124 --request-changes --body-file .github/internal/reviews/124-changes.md

# 2. Implementer re-reads the full PR state (don't cherry-pick — read everything).
node scripts/internal/pr-context.js 124

# 3. Implementer commits the fixes on the same branch.
git add -- <changed-files>
git commit -m "fix(scope): address reviewer feedback on <thing>"
git push

# 4. Implementer posts a reply comment (body starts with the ai-implementer marker).
gh pr review 124 --comment --body-file .github/internal/reviews/124-reply.md

# 5. Reviewer re-runs pr-context.js, re-evaluates, posts APPROVE.
node scripts/internal/pr-context.js 124
gh pr review 124 --approve --body-file .github/internal/reviews/124-approve.md

# 6. Human merges.
gh pr merge 124 --squash --delete-branch
```

### Hard rules

- Only the **human owner** runs `gh pr merge`. No agent — implementer or reviewer — is ever allowed to merge, under any flag, for any reason.
- The **implementer** never self-approves its own PR. It may only post `--comment` replies.
- The **reviewer** may use `--approve`, `--request-changes`, or `--comment`. Never `--merge`, never `gh pr close`.
- Every agent review/comment body starts with its versioned marker (see above).

## Reporting security issues

See [docs/SECURITY.md](docs/SECURITY.md).
