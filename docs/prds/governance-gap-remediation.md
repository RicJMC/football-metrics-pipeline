# PRD: Governance Gap Remediation

- **Status:** Draft
- **Date:** 2026-05-31
- **Author:** Repository owner (via grill-with-docs session)
- **Related ADRs:** ADR-0010, ADR-0011, ADR-0003, ADR-0009

---

## Problem Statement

A `grill-with-docs` audit (2026-05-31) surfaced four governance gaps in the current project state:

1. `reviewer.agent.md` still contains `agent/runSubagent`, directly violating ADR-0011's explicit ban on delegation between role agents.
2. Five ADRs (0008–0012) are stuck at "Proposed" with no assigned owner, no acceptance criteria tracked as issues, and no timeline — leaving the multi-agent orchestration loop (ADR-0011) unable to fully close.
3. `docs/ARCHITECTURE_CURRENT.md` still lists "No characterization test harness yet" as a technical debt item, despite Phase 2 delivering five green characterization tests.
4. `docs/plans/0001-pr-sequence-awesome-copilot-adoption.md` reads as pending even though all three planned PRs (#5, #6, #7) were merged.

None of these gaps block daily coding work. Left unaddressed, they erode trust in the documentation as a source of truth and create onboarding risk for any future contributor or AI agent that reads the docs.

---

## Goals

1. Eliminate the ADR-0011 violation in `reviewer.agent.md` (remove `agent/runSubagent`).
2. Unblock ADRs 0008–0012 by creating a GitHub Issue for each, with explicit acceptance criteria and a status decision (Accept / Defer with reason / Supersede).
3. Bring `ARCHITECTURE_CURRENT.md` in sync with the actual Phase 2 state.
4. Mark `Plan-0001` as completed and link the merged PR SHAs.

---

## Non-Goals

- No changes to scraper or ETL logic.
- No new ADRs required for this remediation (all changes are conformance with already-accepted decisions).
- No changes to CI workflows or GitHub Actions.
- No TypeScript migration or module extraction (those belong to Phase 3).

---

## User Impact

**Repository owner / future AI agents reading the docs:**
- `reviewer.agent.md` with `agent/runSubagent` is a live misconfiguration: any AI that respects the agent file could trigger cross-agent delegation today.
- Stale architecture and plan docs make it harder to onboard a new agent or contributor accurately.
- Untracked Proposed ADRs create invisible blockers: the multi-agent loop (ADR-0011) cannot proceed until ADR-0008 is decided.

---

## Acceptance Criteria

| # | Criterion | Verifiable by |
|---|---|---|
| AC-1 | `agent/runSubagent` is absent from `reviewer.agent.md` | `grep -r "runSubagent" .github/agents/` returns no results |
| AC-2 | Each of ADR-0008 through ADR-0012 has a linked GitHub Issue with status decision and acceptance criteria | Issues visible in repo with label `adr-decision` or similar |
| AC-3 | `ARCHITECTURE_CURRENT.md` Technical Debt section no longer says "No characterization test harness yet"; reflects Phase 2 completion | Read the file |
| AC-4 | `docs/plans/0001-…` has a `Status: Completed` header with merged PR SHA references | Read the file |
| AC-5 | `npm run verify` remains green after all changes | CI pass on PR |
| AC-6 | All changes go through a PR with the `reviewer` agent invoked | PR audit trail in GitHub |

---

## Constraints

| Constraint | Source |
|---|---|
| All changes via PR — no direct push to `main` | ADR-0006 |
| Characterization tests must stay green | ADR-0003 |
| No secrets or generated data committed | `copilot-instructions.md` |
| Memory updates (ai-context, handoff) proposed but not written without explicit approval | ADR-0009 |
| Agent files edited as plain Markdown, not through VS Code agent UI | ADR-0010 operational note |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Removing `runSubagent` from reviewer breaks a real use case | Low — reviewer is read-only and does not delegate | Test prompt after change; revert PR if tool is needed |
| A Proposed ADR is decided as "Accepted" and immediately implies implementation work | Medium | Acceptance decision and implementation PR are separate; acceptance only means "we agree with the decision", not "it must land this sprint" |
| VS Code agent UI re-inflates `reviewer.agent.md` after the fix | High (known recurring issue per ADR-0010) | Edit as plain Markdown only; run `git diff -- .github/agents/` before any commit |

---

## Open Questions

1. **ADR-0008 (CI-side reviewer):** Should it be accepted now, or deferred until ADR-0007 has been used in ≥ 3 PRs cleanly? The ADR's own adoption checklist requires that precondition.
2. **ADR-0009 and ADR-0010:** Both are Proposed but their content is already being followed in practice. Should they be fast-tracked to Accepted as documentation-only decisions, or do they need a formal review PR?
3. **ADRs 0011 and 0012:** These are architectural — accepting them commits to implementing the dispatch workflow and threat model. Should they stay Proposed until Phase 3 begins in earnest?

---

## Proposed Delivery Sequence

Each item is a self-contained PR. All are docs/config-only; none touch scraper or ETL code.

| PR | Scope | Owner | Blocker |
|----|-------|-------|---------|
| PR-1 | Remove `agent/runSubagent` from `reviewer.agent.md` | `@implementer` | None |
| PR-2 | Update `ARCHITECTURE_CURRENT.md` + mark `Plan-0001` completed | `@implementer` | None |
| PR-3 | Create GitHub Issues for ADR-0008 through ADR-0012 with acceptance criteria | Manual / `@designer` | None |
| PR-4 | Move ADR-0009 and ADR-0010 to Accepted (if owner agrees, per Open Question 2) | `@implementer` | Owner decision |
| PR-5 | Move ADR-0008 to Accepted and schedule implementation (if owner agrees, per Open Question 1) | `@implementer` | Owner decision + ADR-0007 stable |

PR-1 and PR-2 are unblocked and should land first. PR-3 is a GitHub-side action (issues), not a code PR. PR-4 and PR-5 depend on owner answers to Open Questions 1–2.

---

## Validation Commands

```bash
# Verify runSubagent is gone from all agent files
grep -r "runSubagent" .github/agents/

# Confirm verify still passes
npm run verify

# Confirm characterization tests still green
npm run test:characterization

# Confirm clean working tree before commit
git status --short
git diff -- .github/agents/
```

---

## Memory Outcome (per ADR-0009)

At completion: propose a short **lesson-learned** entry in `docs/lessons-learned/` documenting the retroactive-rule/no-backfill failure mode and the convention added to the PR template to prevent it. Write only after explicit owner approval.
