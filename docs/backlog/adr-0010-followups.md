# ADR-0010 Follow-up Backlog

Deferred follow-ups from [Plan 0001](../plans/0001-pr-sequence-awesome-copilot-adoption.md)
Step 5. Recorded as backlog, **not** active GitHub issues. Strategy lives in
[ADR-0010](../adr/0010-awesome-copilot-pattern-adoption.md).

> Status note: PR-0 (#5), PR-A (#6), and PR-B (#7) from Plan 0001 are already
> merged to `main`. The two entries below are the only remaining items.

## PR-D — evaluate-copilot-pattern prompt

Status: Candidate
Priority: P3
Condition: Create when we evaluate the next external Copilot/awesome-copilot pattern.

Rationale:
Reusable prompt that applies ADR-0010's five adoption filters consistently.

Scope:
- Add `.github/prompts/evaluate-copilot-pattern.prompt.md`
- Reference ADR-0010 as source of truth
- No code, tests, data, or workflow changes

Decision:
Can be promoted to GitHub issue when pattern evaluation becomes active work.

---

## PR-C — modernization-planner agent

Status: Deferred / Conditional
Priority: P3
Condition: Only create if `@designer` is demonstrably overloaded by tactical planning work.

Rationale:
Potentially useful separation of concerns, but risks unnecessary agent proliferation.

Scope:
- Add `.github/agents/modernization-planner.agent.md`
- Write-scope limited to `docs/plans/`
- Cannot modify code, workflows, ADRs, or generated/data paths
- Cross-link from ADR-0010 Patterns evaluated

Decision:
Do not create issue until overload is observed.
