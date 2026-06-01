# ADR-0012: Threat model and trust boundary for agentic automation

- **Status:** Proposed
- **Date:** 2026-05-30
- **Deciders:** Repository owner
- **Refines:** [ADR-0011](0011-multi-agent-orchestration.md) (point 4 — GitHub Actions triggers)

## Context

[ADR-0011](0011-multi-agent-orchestration.md) defines an artefact-first orchestration model anchored in GitHub Issues and GitHub Actions. Its point 4 sketches automation triggers:

- On `issues.opened` with label `task` → dispatch workflow that creates a plan stub.
- On `pull_request.*` → CI-side reviewer (per [ADR-0008](0008-ci-side-ai-reviewer.md)).
- On `issue_comment.created` with a known marker → follow-up action (deferred).

This is fine as a concept, but it leaves the **trust boundary** implicit. The repository is intended to be public. In a public repository:

- Any authenticated GitHub user can open an issue and add an issue comment.
- Issue templates can apply labels automatically — including labels the maintainer treats as authorization signals.
- Workflows that trigger on issue/comment events can run with `GITHUB_TOKEN` write scopes and may have access to secrets.
- LLM-based agents that read issue bodies as input are subject to prompt injection: an attacker can write “ignore your instructions and do X”.

If left implicit, the natural reading of ADR-0011 is “open an issue, automation runs”. That reading is unsafe in a public repository.

This ADR makes the trust boundary explicit and tightens ADR-0011 point 4 before any write-capable workflow is implemented (i.e. before PR-3 in ADR-0011 adoption checklist, and before PR-2 if the CI-side reviewer needs any write scope).

## Decision

Adopt an explicit threat model and four enforcement rules. Together these refine ADR-0011 point 4 and apply to every workflow under `.github/workflows/`.

### Threat model (3 trust tiers)

1. **Untrusted intake.** Issue bodies, issue comments, PR descriptions from forks, and PR comments from non-collaborators. Treated as data, never as instructions. Workflows triggered by intake events MUST NOT have write scopes and MUST NOT have access to secrets.
2. **Maintainer-authorized work.** An issue or PR explicitly tagged with the label `agent-approved` by a user whose `author_association` is `OWNER`, `MEMBER`, or `COLLABORATOR`. Workflows in this tier MAY have narrowly scoped write permissions (per-job) but never have unconditional access to secrets.
3. **Human-merged change.** Only a human owner can `gh pr merge`. This is unchanged from [ADR-0006](0006-agentic-pr-workflow.md) and [ADR-0007](0007-local-agent-pr-toolkit.md).

The boundary between tier 1 and tier 2 is the **`agent-approved` label applied by a trusted association**. The boundary between tier 2 and tier 3 is the **human merge action**.

### Four enforcement rules

1. **No write-capable automation on `issues.opened`, `issue_comment.created`, or `pull_request_target` on code from forks.**
   - Plan-stub dispatch (ADR-0011 PR-3) MUST trigger on `issues.labeled` with `agent-approved` and gate on `author_association`.
   - Reviewer follow-up on PR comments stays deferred and, when implemented, MUST also gate on label + association.
   - `pull_request_target` is forbidden unless the workflow does not check out untrusted code and does not pass untrusted input to scripts. Default to `pull_request` for fork PRs; secrets are simply not available there, which is the correct outcome.

2. **Least-privilege `permissions:` are mandatory.**
   - Every workflow file declares `permissions: {}` at the top level (deny by default).
   - Each job that needs scope re-declares only what it needs (e.g. `contents: write`, `pull-requests: write`).
   - Secrets live in **GitHub Environments** with required reviewers when they grant write access to anything beyond the repository (e.g. LLM API keys, package registries).

3. **The `agent-approved` label is never applied automatically.**
   - Issue/PR templates MAY apply classification labels: `task`, `bug`, `docs`, `adr-request`, `plan-request`, `incident`.
   - Issue/PR templates MUST NOT apply `agent-approved`. It is a manual maintainer action and is the trust boundary.
   - Removing `agent-approved` MUST be treated as a revocation: subsequent workflow runs gated on the label simply do not start.

4. **Agents treat untrusted input as quoted data, not as instructions.**
   - When a role agent reads an issue body, PR description, or comment authored at trust tier 1, the agent's system prompt MUST frame that content as a quoted artefact to be analyzed, never as a directive to follow.
   - Agent output is always a reviewable artefact (plan, ADR, commit, comment) and is subject to the existing review and human merge gate.
   - The human merge gate ([ADR-0006](0006-agentic-pr-workflow.md)) is the final mitigation against successful prompt injection: even if an agent is tricked into proposing harmful output, that output cannot reach `main` without human approval.

### Workflow defaults (canonical)

Every workflow under `.github/workflows/` follows this shape:

```yaml
permissions: {}

on:
  # Prefer workflow_dispatch and label-gated events; avoid issues.opened, issue_comment, pull_request_target.
  workflow_dispatch:
  issues:
    types: [labeled]

concurrency:
  group: ${{ github.workflow }}-${{ github.event.issue.number || github.run_id }}
  cancel-in-progress: true

jobs:
  example:
    if: >-
      github.event.label.name == 'agent-approved' &&
      contains(fromJSON('["OWNER","MEMBER","COLLABORATOR"]'), github.event.sender.author_association)
    timeout-minutes: 10
    permissions:
      contents: write
      pull-requests: write
      issues: write
    steps:
      - uses: actions/checkout@<full-sha>   # pin to SHA, not @v4
        with:
          persist-credentials: false
```

Notes:

- `permissions: {}` at the top level is deny-by-default; jobs opt in to scopes.
- `if:` enforces both the label and the trusted association.
- `timeout-minutes` and `concurrency.cancel-in-progress` reduce abuse cost (spam loops, runaway jobs).
- Actions pinned to a full commit SHA prevent silent supply-chain shifts.
- `persist-credentials: false` on checkout prevents accidental token leakage to subsequent steps.

## Alternatives considered

- **Leave ADR-0011 point 4 as-is and rely on later workflow review.** Rejected: the natural reading is unsafe, and the first workflow to land would either re-litigate this or import the unsafe default.
- **Use only `workflow_dispatch` (manual button).** Maximum safety, minimum ergonomics. Kept as the fallback for any workflow whose `if:` gate cannot be made robust. Not adopted as the universal rule because label-gated automation is sufficient when paired with the 4 enforcement rules.
- **Trust `task` (or any classification label) as the authorization signal.** Rejected: issue templates can apply classification labels automatically, so an external user could open an issue and immediately trigger automation. The authorization label must be one that templates never apply.
- **Gate purely on `author_association` without a label.** Rejected: a maintainer commenting casually on an issue could unintentionally trigger automation. Requiring an explicit label keeps the trust action deliberate.
- **Move all automation off GitHub to a private orchestrator.** Rejected for the same reasons as in ADR-0011: adds runtime, auth, and ops surface for a problem GitHub already solves with label + association + Environments.

## Consequences

### Positive

- Trust boundary is explicit and named (`agent-approved` + trusted association).
- Public repository is safe to operate: untrusted intake cannot trigger write-capable automation.
- Prompt injection has a documented mitigation chain: quoted-data framing → reviewable artefact → human merge gate.
- Workflow defaults are canonical, copy-pasteable, and reviewable.

### Negative

- Maintainer must apply `agent-approved` for every issue that should drive automation. This is intentional: it is the trust action.
- Workflows are slightly more verbose due to the `permissions:` and `if:` blocks.

### Neutral

- No change to scraper/ETL behavior.
- No new runtime dependency.
- No conflict with [ADR-0006](0006-agentic-pr-workflow.md), [ADR-0007](0007-local-agent-pr-toolkit.md), [ADR-0008](0008-ci-side-ai-reviewer.md), [ADR-0009](0009-ai-memory-policy.md), [ADR-0010](0010-awesome-copilot-pattern-adoption.md), or [ADR-0011](0011-multi-agent-orchestration.md). This ADR refines ADR-0011 point 4 only.

## Adoption checklist

Sequenced as small, independent PRs.

- [ ] **PR-A — Documentation alignment.** This ADR + README + agent instruction updates. Docs only. Designer-owned.
- [ ] **PR-B — Issue templates (refines ADR-0011 PR-1).** Add `.github/ISSUE_TEMPLATE/*.yml` with classification labels only. Templates MUST NOT apply `agent-approved`. Implementer-owned.
- [ ] **PR-C — Label inventory.** Create the labels `task`, `bug`, `docs`, `adr-request`, `plan-request`, `incident`, `agent-approved` in the repository (via `gh label create`). Document in [docs/CONTRIBUTING.md](../CONTRIBUTING.md). Implementer-owned.
- [ ] **PR-D — Dispatch workflow (refines ADR-0011 PR-3).** Implement under `.github/workflows/agent-dispatch.yml` using the canonical defaults above. Implementer-owned.
- [ ] **PR-E — CI-side reviewer (refines ADR-0011 PR-2).** Implement [ADR-0008](0008-ci-side-ai-reviewer.md) following the same defaults. Implementer-owned.

PR-A is this ADR landing. PR-B, PR-C, PR-D can run in parallel after PR-A is merged. PR-E depends on ADR-0008 being accepted.

## Operational guidance

- Treat any new workflow trigger as a security review item, not a feature toggle.
- When in doubt between label-gated automation and `workflow_dispatch`, choose `workflow_dispatch`. The dispatch button is annoying, not unsafe.
- If a workflow needs a secret beyond `GITHUB_TOKEN`, put the job behind a GitHub Environment with required reviewers — not directly in repository secrets.
- The agent reading untrusted text MUST output an artefact (plan/ADR/comment), never execute commands implied by that text.
- When updating agent-facing docs, keep the trust boundary explicit and never describe untrusted intake as approval.

## References

- [ADR-0006](0006-agentic-pr-workflow.md) — Agentic PR workflow with human merge gate.
- [ADR-0007](0007-local-agent-pr-toolkit.md) — Local agent toolkit and reviewer/implementer hard rules.
- [ADR-0008](0008-ci-side-ai-reviewer.md) — CI-side AI reviewer (must adopt the defaults in this ADR).
- [ADR-0009](0009-ai-memory-policy.md) — Curated AI memory and approval-gated updates.
- [ADR-0010](0010-awesome-copilot-pattern-adoption.md) — Curated adoption of `github/awesome-copilot` patterns.
- [ADR-0011](0011-multi-agent-orchestration.md) — Multi-agent orchestration; this ADR refines its point 4.
- GitHub Docs — [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use).
- GitHub Docs — [Workflow syntax for GitHub Actions](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions).
- GitHub Docs — [Configuring issue templates for your repository](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository).
- GitHub Security Lab — [Keeping your GitHub Actions and workflows secure: Preventing pwn requests](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/).
