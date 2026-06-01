# Agent Governance Consistency Backlog

Issue-ready drafts from the `.github/` audit (2026-06-01). Recorded as backlog,
**not** active GitHub issues — promote to GitHub issues when `gh`/a token is
available. Convert with the [`to-issues`](../../.github/skills/upstream/to-issues/SKILL.md)
skill.

> Source: read-only audit of `.github/` agents, instructions, prompts, and skills.
> Cross-checked against accepted ADRs.

## GOV-1 — reviewer agent tools cannot run its ADR-0007 workflow

Status: Candidate
Priority: P2
Labels: `adr-decision`
Depends on / relates to: PR #10 (already edits `reviewer.agent.md` `tools:`),
[ADR-0007](../adr/0007-local-agent-pr-toolkit.md), [ADR-0011](../adr/0011-multi-agent-orchestration.md)

Problem:
`.github/agents/reviewer.agent.md` workflow step 1 and "Allowed verbs" require
`node scripts/internal/pr-context.js <pr>` and `gh pr review` (mandated by the
**Accepted** ADR-0007). But the agent's `tools:` list declares no `execute/*`
capability, so it cannot run either command. The prose and the toolset
contradict each other.

Options:
- A. Add `execute/runInTerminal` + `execute/getTerminalOutput` to the reviewer's
  `tools:`. This is a capability expansion — ADR-0011 (operational guidance)
  requires owner/ADR sign-off, not a unilateral self-edit. Best folded into or
  sequenced with PR #10, which already touches the same block.
- B. Drop the `gh`/`pr-context.js` prose and use the `gitkraken/pull_request_*`
  MCP tools the reviewer already has. Rejected unless owner prefers it: those
  tools do not fetch inline review comments, which is the core problem ADR-0007
  was written to solve.

Acceptance criteria:
- Owner picks an option.
- `reviewer.agent.md` `tools:` and prose are internally consistent.
- If Option A: change reviewed as an explicit capability decision (PR #10 or sibling PR).

Risks / rollback:
- Option A widens reviewer privilege from read-only to "can run terminal
  commands"; mitigated by keeping write-scope unchanged (no file edits, no merge).
- Rollback: revert the `tools:` lines.

## GOV-2 — copilot-instructions mislabels @designer as "Read-only"

Status: Candidate
Priority: P3
Labels: `documentation`

Problem:
`.github/copilot-instructions.md` (Agents section) calls `@designer`
"Read-only," but `designer.agent.md` grants write tools scoped to `docs/` and
parts of `.github/`. The label is inaccurate.

Fix (drafted in working tree):
Replace the "Read-only." sentence with an accurate note that the designer writes
docs/ADRs only (no code or workflow changes).

Acceptance criteria:
- The description reflects the designer's real docs/ADR write-scope.

Risks / rollback:
- Low-risk Markdown-only change. Rollback: revert the one line.
