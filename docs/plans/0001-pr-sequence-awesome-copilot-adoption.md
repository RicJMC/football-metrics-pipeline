# Plan 0001 — PR sequence for `awesome-copilot` adoption

> Tactical plan for the implementer. Strategy lives in [ADR-0010](../adr/0010-awesome-copilot-pattern-adoption.md).
> Status: ready for execution. Approval required before each destructive git step.

## Intent

Land three small, independent PRs that (1) capture an unrelated docs improvement already in the working tree, (2) introduce ADR-0010 and the `docs/plans/` scaffold, and (3) shrink the two agents that still have bloated `tools:` lists.

## Pre-flight state (observed 2026-05-30)

```
On branch main
Your branch and 'origin/main' have diverged,
and have 3 and 3 different commits each, respectively.

modified:   .github/agents/designer.agent.md           ← regression (discard)
modified:   .github/agents/implementer.agent.md        ← regression (discard)
modified:   .github/agents/memory-curator.agent.md     ← regression (discard)
modified:   .github/agents/reviewer.agent.md           ← regression (discard)
modified:   docs/adr/README.md                         ← keep (PR-A)
modified:   docs/ai-context.md                         ← keep (PR-0)

untracked:  docs/adr/0010-awesome-copilot-pattern-adoption.md   ← PR-A
untracked:  docs/plans/                                          ← PR-A
```

### Why the 4 agent edits are discarded

`HEAD` already contains a curated `tools:` list for `memory-curator` (12 tools) and `reviewer` (27 tools). The working-tree versions revert them to ~100 tools — a regression caused by editing through the VS Code custom-agent UI. See the operational note in [ADR-0010](../adr/0010-awesome-copilot-pattern-adoption.md#operational-note-vs-code-agent-editor-ui-may-regress-curated-tool-lists).

For `designer` and `implementer`, both the HEAD and the working-tree versions are bloated. The working-tree edit is only a cosmetic reflow (multi-line → single-line). Discarding it does not lose anything; PR-B will shrink both files properly.

### Why `origin/main` diverged

The three local commits (`8a8f7c7`, `62908fa`, `14efaf8`) have identical commit messages to the three remote commits (`018af9a`, `e36c18b`, `fc05602`). Pattern: GitHub squash-merged PRs `#2`, `#3`, `#4`, producing new SHAs. The remote is canonical. The local branch must be reset to `origin/main` before opening new PRs.

---

## Step 0 — Discard agent regressions (non-destructive: only working tree)

```powershell
git restore .github/agents/designer.agent.md
git restore .github/agents/implementer.agent.md
git restore .github/agents/memory-curator.agent.md
git restore .github/agents/reviewer.agent.md
git status --short
```

Expected after:

```
 M docs/adr/README.md
 M docs/ai-context.md
?? docs/adr/0010-awesome-copilot-pattern-adoption.md
?? docs/plans/
```

If anything else still shows as modified, **stop** and investigate before continuing.

---

## Step 1 — Resolve divergence with `origin/main`

⚠ **`git reset --hard` is destructive.** Stash with `-u` (includes untracked) first so the ADR-0010, `docs/plans/`, and the two `M` files survive.

```powershell
git fetch origin
git stash push -u -m "wip: ADR-0010 + ai-context baseline + adr index"
git stash list
git stash show -u stash@{0} --stat   # must list all 4 paths
git reset --hard origin/main
git stash pop
git status --short                    # must match the expected state from Step 0
```

If `git stash pop` reports conflicts, **stop**. Most likely cause: a remote commit also touched `docs/adr/README.md` or `docs/ai-context.md`. Resolve manually, do not force.

---

## Step 2 — PR-0: `docs(ai-context)` (independent, no dependencies)

```powershell
git switch -c docs/ai-context-memory-baseline
git add docs/ai-context.md
git status --short                    # only docs/ai-context.md staged
git commit -m "docs(ai-context): add memory workflow baseline section"
git push -u origin docs/ai-context-memory-baseline
```

PR body (save to `pr-0-body.md` then `gh pr create --body-file`):

```markdown
Adds an "AI memory workflow baseline (2026-05-30)" section to `docs/ai-context.md`,
codifying the contract from ADR-0009: durable memory in Markdown, proposal-first
updates, end-of-task memory outcome, no secrets.

Docs only. No code, tests, data, or workflow changes.
```

Then:

```powershell
gh pr create --title "docs(ai-context): add memory workflow baseline section" --base main --body-file pr-0-body.md
Remove-Item pr-0-body.md
```

---

## Step 3 — PR-A: `docs(adr): 0010 awesome-copilot pattern adoption`

Can run in parallel with PR-0 (no shared files).

```powershell
git switch main
git switch -c docs/adr-0010-awesome-copilot-adoption
git add docs/adr/0010-awesome-copilot-pattern-adoption.md docs/plans/README.md docs/adr/README.md docs/plans/0001-pr-sequence-awesome-copilot-adoption.md
git status --short
git commit -m "docs(adr): 0010 awesome-copilot pattern adoption"
git push -u origin docs/adr-0010-awesome-copilot-adoption
```

PR body:

```markdown
ADR-0010 establishes a curated adoption policy for patterns from
`github/awesome-copilot`: external catalog used as reference only, never
vendored or copied wholesale; new/modified agents must declare explicit
minimal `tools:` and a `## Write-scope guardrail` section; 5 adoption filters
documented.

Also introduces `docs/plans/` as the write-scope for tactical per-task plans
(planner agents only), and the first plan `0001-pr-sequence-awesome-copilot-adoption.md`.

Updates `docs/adr/README.md` index with the missing ADR-0009 row and the new
ADR-0010 row.

Docs only. No code, tests, data, or workflow changes.
```

---

## Step 4 — PR-B: `chore(agents): least-privilege tools + write-scope for designer/implementer`

**Wait until PR-A is merged** (PR-B's new sections reference ADR-0010).

Scope: only `designer.agent.md` and `implementer.agent.md`. `memory-curator` and `reviewer` are already curated in `main` — do not touch them.

```powershell
git switch main; git pull --ff-only
git switch -c chore/agents-least-privilege
# Apply the two diffs below (one commit per agent)
```

### 4a — designer.agent.md

Replace the entire `tools:` block with:

```yaml
tools:
  [
    read/readFile,
    read/problems,
    search/codebase,
    search/fileSearch,
    search/listDirectory,
    search/textSearch,
    search/usages,
    edit/createDirectory,
    edit/createFile,
    edit/editFiles,
    edit/rename,
    web/fetch,
    web/githubRepo,
    web/githubTextSearch,
    agent/runSubagent,
    vscode/askQuestions,
    todo,
  ]
```

Insert this section immediately before `## Output Format`:

```markdown
## Write-scope guardrail

May create or modify files **only** under:

- `docs/`
- `docs/adr/`
- `docs/plans/`
- `sample-data/*/README.md`
- `.github/agents/`
- `.github/prompts/`
- `.github/instructions/`
- `.github/internal/handoffs/`

May not modify:

- `scrappe/`, `scripts/`, `test/`, `tools/`, `index.js`, `package.json`, `package-lock.json`, `eslint.config.js`
- any file under `data/`, `jsonfiles/`, `csv/`, `scrappe/tmp/`
- any GitHub Actions workflow under `.github/workflows/`

If code or workflow changes are needed, hand off to `@implementer`.
```

Commit:

```powershell
git add .github/agents/designer.agent.md
git diff --cached --stat              # confirm only this file staged
git commit -m "chore(agents): least-privilege tools + write-scope for designer"
```

### 4b — implementer.agent.md

Replace the entire `tools:` block with:

```yaml
tools:
  [
    read/readFile,
    read/problems,
    read/getTaskOutput,
    read/terminalLastCommand,
    read/terminalSelection,
    search/codebase,
    search/fileSearch,
    search/listDirectory,
    search/textSearch,
    search/usages,
    edit/createDirectory,
    edit/createFile,
    edit/editFiles,
    edit/rename,
    execute/runInTerminal,
    execute/getTerminalOutput,
    execute/sendToTerminal,
    execute/killTerminal,
    execute/runTask,
    execute/createAndRunTask,
    execute/runTests,
    execute/testFailure,
    gitkraken/git_status,
    gitkraken/git_branch,
    gitkraken/git_checkout,
    gitkraken/git_fetch,
    gitkraken/git_pull,
    gitkraken/git_push,
    gitkraken/git_add_or_commit,
    gitkraken/git_stash,
    gitkraken/git_log_or_diff,
    gitkraken/git_blame,
    gitkraken/pull_request_create,
    gitkraken/pull_request_get_detail,
    gitkraken/pull_request_get_comments,
    web/fetch,
    agent/runSubagent,
    vscode/askQuestions,
    todo,
  ]
```

> Note: `gitkraken/pull_request_create_review` is intentionally **excluded**. The hard rule "no self-approve" is already in the agent body; removing the tool is defense-in-depth.

Insert this section immediately before `## Output Format`:

```markdown
## Write-scope guardrail

May modify any file in the repository **except**:

- Anything under `data/`, `jsonfiles/`, `csv/`, `scrappe/tmp/`
- `.env`, `errorLog*`, browser session/cookie artifacts
- Anything under `_reference/` (external reference clones — out of this repo by convention)

May execute any non-destructive shell command. For destructive git operations
(`reset --hard`, `push --force` without `--force-with-lease`, history rewrites,
`branch -D` of unmerged work, `git gc --prune=now`), explicit user confirmation
in the same turn is required — see "Constraints" above.

Hard rules from "PR operations" remain in force: no self-approve, no `gh pr merge`,
no `gh pr close` without explicit instruction.
```

Commit:

```powershell
git add .github/agents/implementer.agent.md
git diff --cached --stat
git commit -m "chore(agents): least-privilege tools + write-scope for implementer"
```

### 4c — Push and open PR

```powershell
git push -u origin chore/agents-least-privilege
```

PR body:

```markdown
Implements PR-B from ADR-0010 (least-privilege agents).

Scope: only `designer` and `implementer`. `memory-curator` and `reviewer` are
already curated in `main` and intentionally untouched.

Changes per agent:

- `designer`: ~100 tools → 17 (read + search + edit + web/github + agent + ask + todo). Adds `## Write-scope guardrail` limited to docs and agent/prompt files.
- `implementer`: ~100 tools → 39 (read + search + edit + execute + curated gitkraken + web/fetch + agent + ask + todo). Adds `## Write-scope guardrail` listing forbidden paths. Excludes `gitkraken/pull_request_create_review` (defense-in-depth for the "no self-approve" hard rule).

One commit per agent for granular revert.

No code, tests, data, or workflow changes.
```

### 4d — Manual validation before requesting merge

For each agent, invoke once in chat and confirm no tool is missing:

| Agent | Test prompt | Expected | Fails if |
|---|---|---|---|
| `@designer` | "draft an ADR stub at `docs/adr/9999-test.md`" | file created via `edit/createFile` | needs a tool not in the shrunk list |
| `@implementer` | "run `npm run verify`" | command executes via `execute/runInTerminal` | needs git or PR tool not granted |

If validation fails for either, **add the missing tool**, amend the commit, force-push with `--force-with-lease`, document in the ADR-0010 "Patterns evaluated" section under a new "Lessons" subsection.

---

## Step 5 — Optional follow-up PRs (deferred)

- **PR-C** (ADR-0010): `modernization-planner` agent with write-scope `docs/plans/`. Only if `@designer` proves overloaded.
- **PR-D** (ADR-0010): `.github/prompts/evaluate-copilot-pattern.prompt.md`. Adds the 5-filter evaluation workflow.

Both are non-blocking. Open issues to track instead of opening branches now.

---

## Rollback

| PR | Rollback |
|---|---|
| PR-0 | `git revert <pr-0 merge sha>` |
| PR-A | `git revert <pr-a merge sha>` — restores agent files index, removes ADR-0010 and `docs/plans/` |
| PR-B | `git revert <pr-b merge sha>` per agent commit — restores bloated `tools:` |

All three are pure documentation/configuration. No data migration. No CI changes. Reverts are safe.

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| `git stash pop` conflicts in Step 1 | Low | Stop and resolve manually; do not force |
| Shrunk `tools:` breaks designer/implementer on a real task | Medium | Step 4d manual validation; revert PR-B per-agent if needed |
| User reopens an agent in the VS Code agent UI and re-inflates `tools:` | High | Operational note in ADR-0010 warns about this; pre-commit `git diff` check |
| New tasks need a tool not granted | Medium | Add explicitly, document why in ADR-0010 |

---

## Approval gate

Before executing Step 1 (`git reset --hard origin/main`), the implementer must:

1. Show this plan to the user.
2. Show the output of `git stash show -u stash@{0} --stat`.
3. Wait for explicit "prossegue" in the same turn.
