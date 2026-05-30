# ADR-0011: Multi-agent orchestration via GitHub Issues + Actions

- **Status:** Proposed
- **Date:** 2026-05-30
- **Deciders:** Repository owner

## Context

The repository already has role-based agents (`designer`, `implementer`, `reviewer`, `memory-curator`) with curated `tools:` and `## Write-scope guardrail` sections (see [ADR-0010](0010-awesome-copilot-pattern-adoption.md)). The agentic PR workflow ([ADR-0006](0006-agentic-pr-workflow.md)) and the local agent PR toolkit ([ADR-0007](0007-local-agent-pr-toolkit.md)) define the human merge gate and the per-PR machine-readable markers (`<!-- ai-reviewer:v1 -->`, `<!-- ai-implementer:v1 -->`). A CI-side reviewer is sketched in [ADR-0008](0008-ci-side-ai-reviewer.md) but not yet implemented.

The operating goal stated by the repository owner is that humans only approve merges. Agents should plan, branch, open PRs, review, discuss, and converge — without the human acting as the dispatcher between every step.

Today the orchestration glue is the human. Each agent waits for an explicit chat prompt. There is no queue, no automated trigger, and no canonical artefact handoff between agents. Two failure modes follow:

1. **Hidden capability expansion** — using `agent/runSubagent` to chain agents creates transitive permissions, breaks role contracts, and hides the audit trail. This was observed during PR `#7` against `designer.agent.md` and `implementer.agent.md` and was removed before merge.
2. **Brittle handoffs** — when an agent’s output is a chat message instead of a file/PR/comment, the next agent cannot reliably resume the task and there is no Git-tracked record of the decision.

Constraints:

- Keep Phase 1 discipline: small, reversible, no scraper/ETL behavior changes ([ADR-0003](0003-characterization-first-modernization.md)).
- Preserve the human merge gate ([ADR-0006](0006-agentic-pr-workflow.md)).
- Do not grant transitive capability between role agents ([ADR-0010](0010-awesome-copilot-pattern-adoption.md)).
- No new runtime dependencies unless an ADR justifies it.

## Decision

Adopt an **artefact-first, handoff-not-delegation** orchestration model anchored in GitHub Issues and GitHub Actions.

1. **Issues are the task queue.** A small set of issue templates encode the entry points: `task`, `adr-request`, `plan-request`, `incident`. The issue body is the agent’s read input.
2. **Each agent reads and writes artefacts, not chat.**
   - `designer` reads an issue → writes a plan under [docs/plans/](../plans/) or an ADR under [docs/adr/](.) and links it back in the issue.
   - `implementer` reads the plan/ADR → branches, commits, opens a PR. The PR body links the source plan/issue.
   - `reviewer` reads the PR → posts a review with the `<!-- ai-reviewer:v1 -->` marker.
   - `implementer` replies with the `<!-- ai-implementer:v1 -->` marker, pushes follow-up commits, and the loop repeats until the human approves the merge.
   - `memory-curator` reads the merged PR / closed issue → proposes a memory delta in chat. A human approves before any write (per [ADR-0009](0009-ai-memory-policy.md)).
3. **No `agent/runSubagent` in role agents.** Delegation between role agents is prohibited. If a wider exploration is needed, a dedicated `explore` or `research` agent may be introduced in a future ADR with a narrow write-scope (e.g. `docs/research/`) and an explicit “may delegate” contract.
4. **GitHub Actions provide the triggers.**
   - On `issues.opened` with label `task` → run a `dispatch` workflow that opens a draft plan stub in `docs/plans/NNNN-<slug>.md` referencing the issue, on a branch `plan/<issue-number>`.
   - On `pull_request.opened` and `pull_request.synchronize` → run the CI-side reviewer from ADR-0008 (independent ADR; this ADR depends on it being implemented).
   - On `issue_comment.created` with a known marker on a PR → optionally trigger a follow-up review or implementer response. Implementation is deferred until the simpler legs work.
5. **The human merge gate is non-negotiable.** Workflows must never call `gh pr merge`. The reviewer agent must never `--approve` a PR the implementer authored ([ADR-0007](0007-local-agent-pr-toolkit.md) hard rules).
6. **Audit trail lives in Git.** Every agent decision is either a commit (plan, ADR, code change) or a PR/issue comment with a versioned marker. Editor `workspaceStorage` is never source-of-truth ([ADR-0009](0009-ai-memory-policy.md)).

## Alternatives considered

- **Keep the human as orchestrator forever.** Rejected: works today, but does not match the stated goal of human-only-at-merge and scales poorly as the agent set grows.
- **Single broad agent with all tools and free-form delegation.** Rejected: collapses the contract clarity that [ADR-0010](0010-awesome-copilot-pattern-adoption.md) just established, weakens audit trail, and conflicts with the “explicit, minimal tools” rule.
- **Build a custom orchestrator service outside GitHub.** Rejected for now: adds new runtime, new auth, new ops surface. GitHub Issues + Actions are already the canonical workspace for this project.
- **Use `agent/runSubagent` between role agents as the handoff mechanism.** Rejected and explicitly forbidden: transitive capability, no Git-tracked artefact, hidden execution path through a planning-only agent. See finding on PR `#7` and the follow-up commit removing `agent/runSubagent` from `designer` and `implementer`.

## Consequences

### Positive

- Every handoff produces a reviewable artefact (plan, ADR, commit, PR, comment) tracked in Git.
- Least-privilege contracts stay honest: an agent can do only what its `tools:` and write-scope allow, with no transitive escape.
- The human only intervenes at the merge gate, in line with [ADR-0006](0006-agentic-pr-workflow.md).
- Workflow is portable: agents can be invoked from VS Code chat, from CI, or from the GitHub CLI without behavioural drift.

### Negative

- Requires implementing [ADR-0008](0008-ci-side-ai-reviewer.md) and at least one dispatch workflow before the full loop closes.
- Slower per task than chat-driven delegation; favours reviewability over raw throughput.
- Agents must always produce written artefacts, even for trivial tasks, which adds a small cost up front.

### Neutral

- No change to scraper/ETL behavior.
- No new runtime dependency in this ADR; GitHub Actions usage is incremental and covered by ADR-0008.

## Adoption checklist

Sequenced as small, independent PRs. Each one is itself a candidate task for the workflow this ADR describes.

- [ ] **PR-1 — Issue templates.** Add `.github/ISSUE_TEMPLATE/task.yml`, `adr-request.yml`, `plan-request.yml`, `incident.yml`. Templates only; no code.
- [ ] **PR-2 — CI-side reviewer.** Implement [ADR-0008](0008-ci-side-ai-reviewer.md) as a workflow under `.github/workflows/ai-reviewer.yml`. Out of designer scope; hand off to `@implementer`.
- [ ] **PR-3 — Dispatch workflow.** On `issues.opened` with label `task`, open a plan stub in `docs/plans/NNNN-<slug>.md` on branch `plan/<issue-number>`. Implementer-owned PR.
- [ ] **PR-4 — Update existing agent bodies.** Each role agent gains a short “Handoff inputs / outputs” section that names the artefacts it reads and writes (no `tools:` change). Designer-owned PR.
- [ ] **PR-5 (optional, deferred) — `explore` agent.** Only if multi-file exploration becomes a bottleneck. Narrow write-scope, explicit “may delegate” contract.

PR-1, PR-3, PR-4 are small. PR-2 is the substantive one and depends on [ADR-0008](0008-ci-side-ai-reviewer.md) being accepted before implementation. PR-5 is explicitly optional.

## Operational guidance

- An agent that needs to coordinate work with another agent must do so by producing an artefact, never by calling another agent directly.
- An agent that proposes a new capability for itself (a new tool, an expanded write-scope, an exception) must do so by drafting an ADR under [docs/adr/](.), not by editing its own `.agent.md` unilaterally.
- The reviewer agent is read-only on the working tree by design (see ADR-0007 hard rules); the human is the only actor allowed to `gh pr merge`.

## References

- [ADR-0003](0003-characterization-first-modernization.md) — Characterization-first modernization.
- [ADR-0006](0006-agentic-pr-workflow.md) — Agentic PR workflow with human merge gate.
- [ADR-0007](0007-local-agent-pr-toolkit.md) — Local agent toolkit for PR operations.
- [ADR-0008](0008-ci-side-ai-reviewer.md) — CI-side AI reviewer (prerequisite for PR-2 above).
- [ADR-0009](0009-ai-memory-policy.md) — Curated AI memory and approval-gated updates.
- [ADR-0010](0010-awesome-copilot-pattern-adoption.md) — Curated adoption of `github/awesome-copilot` patterns.
- Session handoff: [.github/internal/handoffs/2026-05-30-awesome-copilot-adoption-and-least-privilege.md](../../.github/internal/handoffs/2026-05-30-awesome-copilot-adoption-and-least-privilege.md).
- External references: GitHub Copilot custom agents docs, Anthropic “Building effective agents”, `github/awesome-copilot` agent patterns.
