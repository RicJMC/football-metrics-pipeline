# PRD: Agent docs and ETL documentation alignment

- **Status:** Draft
- **Date:** 2026-06-01
- **Author:** Repository owner (via grill-me / to-prd session)
- **Related ADRs:** ADR-0003, ADR-0006, ADR-0011, ADR-0012

---

## Problem Statement

Several repository docs still lag behind the actual behavior of the codebase:

- `playerStats03_ZScores.js` computes global Z-scores across all player-season-team records, but some docs still imply positional or league grouping.
- The root `index.js` is a compatibility shim, while `scripts/index.js` is the canonical ETL orchestrator.
- Agent-facing guidance needs a stronger source-of-truth rule so future plans do not follow stale prose over the code.
- Security guidance for agentic automation already exists in ADR-0012, but it should be reflected in the docs that guide planning.

---

## Goals

1. Align public and internal docs with the current global Z-score behavior.
2. Keep the shim/orchestrator distinction explicit.
3. Update agent instructions so they inspect the code first and cite ADR-0012 when planning automation.
4. Remove ambiguity from modernization notes and backlog docs.

---

## Non-Goals

- No ETL behavior changes.
- No scraper changes.
- No `package.json` cleanup in this work.
- No workflow or GitHub Actions implementation.

---

## User Impact

- Contributors get a single, honest description of the current ETL contract.
- The `designer` agent is less likely to plan against stale documentation.
- Security expectations for future automation stay visible at the point where plans are made.

---

## Acceptance Criteria

1. README says stage 03 uses global Z-scores and mentions ADR-0012 for agentic automation trust boundaries.
2. `.github/copilot-instructions.md` states the stage 03 global behavior and the ADR-0012 trust boundary.
3. `docs/prds/etl-incremental-modernization.md` no longer leaves stage 03 normalization ambiguous.
4. `docs/prds/etl-modernization-issue-backlog.md` no longer proposes a B3 issue for a current stage 03 redesign.
5. `docs/lessons-learned/2026-05-two-phase-stage-modernization.md` reflects the current global contract.
6. `docs/adr/0012-agentic-automation-threat-model.md` explicitly ties agent-facing docs to the trust boundary.
7. `.github/agents/designer.agent.md` instructs the agent to treat code as the source of truth and to cite ADR-0012 for automation plans.

---

## Constraints

- Keep changes small and reversible.
- Preserve behavior; this is docs/instructions work only.
- Do not add new workflows or labels in this round.

---

## Risks

- Repeating the same guidance in multiple docs can create future drift if one file is missed.
- Stronger agent instructions may make the designer more verbose, but that is acceptable if it reduces wrong plans.

---

## Open Questions

None. The current behavior is the contract for now.
