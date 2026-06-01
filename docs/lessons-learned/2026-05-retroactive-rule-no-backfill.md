# Lesson: Retroactive-rule / no-backfill failure mode

Date: 2026-05-31

## Context

After a fast-paced bootstrap sprint (PRs #1–#9), the repository had four
governance gaps:

1. `reviewer.agent.md` still listed `agent/runSubagent` even though ADR-0011
   explicitly banned cross-agent delegation — the rule was written _after_ the
   agent file was already committed, and nobody went back to enforce it.
2. ADR-0009 and ADR-0010 were being followed in every PR but their `Status:`
   field still read `Proposed` — decisions were made in practice, never
   formally recorded.
3. `ARCHITECTURE_CURRENT.md` still said "No characterization test harness yet"
   even though Phase 2 delivered five green tests.
4. `docs/plans/0001-…` still read "Status: ready for execution" even though all
   three planned PRs had been merged.

None of these blocked daily work. Collectively, they eroded the docs as a
source of truth and would have misled any future agent or contributor reading
the repo cold.

## Rule

**When a PR implements something that makes a rule, a doc, or a plan stale,
that same PR must bring those artifacts into sync.**

Specifically:

- If a PR _follows_ an ADR that is still `Proposed`: evaluate whether to move
  it to `Accepted` in the same PR (or open an `adr-decision` issue immediately).
- If a PR _delivers_ a capability that is listed as "not yet" or "pending" in
  any doc: update that reference before merge.
- If a PR _enforces_ a rule that was not yet applied to existing artifacts:
  apply it to the existing artifacts in the same PR (or track the gap as an
  issue, not as silent drift).

## Example

| Stale artifact | Trigger PR | Correct backfill action |
|---|---|---|
| `reviewer.agent.md` contains `agent/runSubagent` | ADR-0011 merged (bans delegation) | Remove the tool from the agent file in the same PR |
| ADR-0009/0010 `Status: Proposed` | Every PR that follows those ADRs | After the third PR following the ADR, open an `adr-decision` issue or accept in a small follow-up PR |
| `ARCHITECTURE_CURRENT.md`: "No test harness yet" | Phase 2 characterization tests merged | Update the debt item in the same PR that merges the tests |
| Plan marked "ready for execution" | Final planned PR merged | Update `Status: Completed` with merged SHAs in the same PR |

## Verification

A PR that introduces or closes an ADR-level decision should satisfy this
checklist item before merge:

> **If this PR accepts/enforces an ADR, or delivers a capability that is
> listed as pending in docs or plans: stale references are updated in this
> PR (or an `adr-decision` / tracking issue is opened and linked here).**

This item is added to `.github/pull_request_template.md`.
