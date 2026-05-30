# ADR-0006: Adopt an agentic PR workflow with a human merge gate

- **Status:** Proposed
- **Date:** 2026-05-30
- **Deciders:** Repository owner

## Context

The repository is solo-maintained but the owner wants to learn — and showcase —
the engineering workflow used in serious AI-assisted teams in 2026. Today the
flow is:

```
designer agent (plans) → implementer agent (executes) → push directly to main
```

This works but has three gaps relative to industry practice:

1. **No PR layer.** Every change merges straight to `main`. No diff to review,
   no checklist, no place for an AI reviewer to comment, no audit trail
   beyond commit messages.
2. **No second pair of eyes.** Implementer agent and human author are the
   same actor. Bugs that pattern-match what the implementer wrote tend not
   to be caught.
3. **No protection on `main`.** Force-push, accidental deletion, or a bad
   commit landing without CI green are all currently possible.

The owner has explicitly stated the goal is **AI-driven execution with a
human validation gate** — delegate work to agents, validate at merge time.

Constraints:

- Must not block the owner from working alone (admin bypass on protection).
- Must use tooling that exists and is mainstream in 2026 (no custom
  orchestration framework yet — see Alternatives).
- Must not let any agent merge to `main` on its own.
- Must be cheap to run for a solo, low-traffic repo.

## Decision

Adopt a **three-layer agentic PR workflow** with the human as the final gate:

```
Issue (intent)
  → Implementer agent (branch + commits + draft PR)
  → Layer 1: CI (lint + verify + characterization tests) — automatic, blocking
  → Layer 2: AI reviewer (on-demand) — Copilot Code Review and/or local
             `reviewer` agent in chat
  → Layer 3: Human (owner) — reviews comments, requests changes, approves
  → Merge to main (squash, conventional commit title)
```

Concrete pieces to introduce:

1. **Branch protection on `main`** via `gh api`:
   - Require status checks: the `verify` workflow must pass.
   - Require linear history (no merge commits from PRs; squash only).
   - Block force-push and branch deletion.
   - **Admin bypass enabled** for the owner (mandatory to keep solo flow viable).
2. **Pull request template** at [.github/pull_request_template.md](../../.github/pull_request_template.md)
   with a short checklist:
   - Tests pass locally (`npm run verify`).
   - Touches scraper or ETL logic? If yes, characterization tests still green.
   - New architectural decision? If yes, ADR added/updated.
   - No `.env`, `data/`, `jsonfiles/`, `csv/`, `errorLog*`, browser sessions.
   - Conventional commit title.
3. **Third local agent: `reviewer`** at `.github/agents/reviewer.agent.md`,
   strictly read-only, role-scoped to:
   - Verify ADRs and instructions are respected.
   - Verify high-risk paths from [.github/instructions/safe-change.instructions.md](../../.github/instructions/safe-change.instructions.md)
     are not modified accidentally.
   - Flag missing characterization tests for changed stages.
   - Flag missing ADR when an architectural decision is implied.
   - Output: `APPROVE` or `REQUEST_CHANGES` + per-file comments.
   - Tools restricted to `read/*`, `search/*`, `gitkraken/git_log_or_diff`,
     `gitkraken/pull_request_get_detail`, `gitkraken/pull_request_get_comments`.
4. **GitHub Copilot Code Review** enabled on the repository, **manual trigger only**
   in this phase (no auto-review on every PR — keep premium-request cost predictable).
5. **CONTRIBUTING doc** at [docs/CONTRIBUTING.md](../CONTRIBUTING.md) documenting
   the flow above, including how to invoke each agent.
6. **Direct pushes to `main` allowed only via admin bypass** and only for:
   - Documentation typos.
   - Emergency reverts.
   - Branch protection cannot be enforced retroactively on existing commits.

Out of scope for this ADR (deferred to a future one):

- GitHub Copilot Coding Agent (assigning issues to `@copilot`) — introduced
  in a follow-up ADR once the human + local reviewer + CI loop is exercised
  end-to-end at least once.
- Custom GitHub Actions agents via `gh-aw`.
- Auto-review on every PR.
- `CODEOWNERS` file (decorative for a solo repo; revisit when collaborators exist).

## Alternatives considered

- **Keep direct-push-to-`main`.** Simpler, but does not teach the workflow,
  blocks AI review, leaves no audit trail. Rejected.
- **Adopt Copilot Coding Agent immediately.** Skipping the manual PR layer
  means the owner never learns to write a PR, review a diff, or interpret
  CI failures. Deferred to a follow-up ADR once the basic loop is solid.
- **Custom orchestrator with Mastra / CrewAI / LangGraph.** Heavy frameworks,
  high churn, and lock-in for a problem that GitHub-native tooling already
  solves. Rejected.
- **Branch protection without admin bypass.** A solo owner blocking themselves
  from emergency fixes is a footgun. Rejected.
- **Require human review approval at the PR level (no admin bypass) and
  self-approve.** GitHub disallows self-approval on the PR author; would
  force a second account or block all merges. Rejected — admin bypass is
  the correct primitive for a solo owner.

## Consequences

- Positive: Every change has a diff, a checklist, an AI review opportunity,
  and a human gate. This is the standard 2026 workflow.
- Positive: `reviewer` agent generates a portable habit (read diff with an
  explicit rubric) that transfers to any future team.
- Positive: Branch protection prevents the most common accidents
  (force-push, missing CI, missing tests).
- Positive: Adopting ADR-0006 unlocks Copilot Coding Agent in a future ADR
  with minimal additional work.
- Negative: Every change now takes one extra step (branch + PR) — deliberate
  friction, training cost.
- Negative: First few PRs will feel ceremonial. Expected.
- Negative: Admin bypass means the safety net is ultimately a discipline,
  not a hard wall. Accepted trade-off for solo flow.
- Follow-up: Once 3–5 PRs have gone through the loop, draft a follow-up ADR
  to decide on Copilot Coding Agent adoption (assigning issues to `@copilot`).
- Follow-up: Once a collaborator joins, revisit `CODEOWNERS` and the
  admin-bypass setting.
- Follow-up: Lint gate from [ADR-0005](0005-lint-format-toolchain.md) must
  land first or simultaneously, otherwise PRs will accumulate style debates.

## References

- [.github/agents/designer.agent.md](../../.github/agents/designer.agent.md)
- [.github/agents/implementer.agent.md](../../.github/agents/implementer.agent.md)
- [.github/instructions/safe-change.instructions.md](../../.github/instructions/safe-change.instructions.md)
- [ADR-0005](0005-lint-format-toolchain.md) — prerequisite for a clean PR loop.
- GitHub branch protection: <https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches>
- GitHub Copilot Code Review: <https://docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review>
- GitHub Copilot Coding Agent: <https://docs.github.com/copilot/concepts/about-copilot-coding-agent>
