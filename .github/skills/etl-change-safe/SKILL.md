---
name: etl-change-safe
description: Characterization-first workflow for changes that touch scrapers or ETL stage scripts.
---

Use this skill when a task changes files under `scrappe/` or `scripts/playerStats*.js`.

## Required workflow

1. Confirm scope and list target files before editing.
2. Add or update characterization coverage under `test/characterization/` before behavior-affecting edits.
3. Apply the smallest reversible patch.
4. Run:
   - `npm run test:characterization`
   - `npm run verify`
5. If behavior intentionally changes, update fixtures/expected outputs and explain the decision in PR notes (and ADR if architectural).

## Guardrails

- Preserve current behavior by default (ADR-0003).
- Do not introduce framework migrations or broad refactors in the same patch.
- Keep `scripts/index.js` as canonical orchestrator unless task explicitly says otherwise.
