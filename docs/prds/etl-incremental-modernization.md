# PRD: Incremental ETL Modernization (SOLID + TDD, stage-by-stage)

- **Status:** Draft
- **Date:** 2026-05-31
- **Author:** Repository owner (via grill-me session)
- **Related ADRs:** ADR-0003 (characterization-first), ADR-0005 (lint/format)
- **Related docs:** `docs/MODERNIZATION_PLAN.md` (Phase 3–4), `docs/lessons-learned/2026-05-two-phase-stage-modernization.md`, `.github/copilot-instructions.md`

---

## Problem Statement

The ETL is five monolithic legacy scripts (`scripts/playerStats01_unicos.js` …
`playerStats05_CSV.js`), authored ~4 years ago, coupled by intermediate JSON
files on disk via hardcoded relative paths, with no dependency injection, no
unit tests, and significant non-obvious behavior. Concrete examples surfaced
during review:

- Stage 03 computes a **single global** per-attribute mean/stdDev across all
  player-season-team records; documentation must match that behavior.
- Stage 02 deletes individual **team-season records** with `minutes_90s < 3`,
  not whole players.
- Stage 01 hardcodes every league/season/category list inline.

The current structure is hard to test, hard to reason about, and hard to change
safely. The old code is the only behavioral spec — there is no external oracle
to confirm whether a given output number is "correct".

---

## Goals

1. Convert all five ETL stages, in order (01 → 02 → 03 → 04 → 05), into
   SOLID, dependency-injected, unit-tested pure modules with mocks for I/O.
2. Reach that end state **incrementally**, one stage at a time, with each step
   merged green — no big-bang rewrite.
3. Preserve current behavior by default; make every behavior change explicit,
   isolated, and reviewable.
4. Keep the existing characterization suite as the regression gate at every
   step.

---

## Non-Goals

- No scraper (`scrappe/`) changes in this effort.
- No big-bang rewrite or parallel "v2" pipeline.
- No TypeScript migration (deferred until 2–3 stages are modernized; see
  MODERNIZATION_PLAN Phase 4).
- No silent behavior/efficiency "improvements" bundled into extraction PRs.
- No change to the on-disk intermediate-file contract between stages until a
  dedicated, ADR-backed step addresses it.

---

## User Impact

- **Repository owner / future contributors:** code becomes testable, modular,
  and safe to change; onboarding cost drops.
- **AI agents (`designer`/`implementer`):** clear, characterization-gated unit
  of work per PR; lower risk of introducing invisible numeric regressions.
- **Pipeline output consumers (BI / Sheets):** no change during extraction
  phases; any metric change arrives as an explicit, reviewed, documented diff.

---

## Approach: two-phase per stage

For each stage, in order 01 → 05:

- **Phase A — behavior-preserving extraction (`refactor:` PR).** Extract pure
  functions into a unit-tested module with DI + mocks; wire it back into the
  existing script. The stage's characterization snapshot stays **byte-identical**
  (green-for-green). No improvements.
- **Phase B — behavior-changing improvement (`feat:`/`perf:` PR, optional).**
  Only after Phase A merges green. Snapshot changes are intentional, reviewed,
  and — if a metric definition changes (e.g. global vs. per-position/league
  Z-scores) — backed by an ADR.

This protocol is the lesson recorded in
`docs/lessons-learned/2026-05-two-phase-stage-modernization.md`.

---

## Acceptance Criteria

1. Each modernized stage has a pure module under `scripts/` (or a stage
   subfolder) with its I/O injected, plus a unit test suite (`node --test`)
   covering its logic with mocked dependencies.
2. Every Phase A PR shows **no** characterization-snapshot changes in its diff;
   `npm run verify` is green.
3. Every Phase B PR shows intentional snapshot changes explained in the PR body,
   with an ADR linked when a metric definition changes.
4. The existing script for each stage delegates to the extracted module rather
   than duplicating logic (no second source of truth).
5. New modules and tests pass the **strict** ESLint tier (they are new code, not
   legacy) per ADR-0005.
6. One intent per PR; conventional commit prefixes; squash on merge
   (`CONTRIBUTING.md`).
7. At completion, all five stages are modernized and the legacy warn-only
   ESLint exceptions for `scripts/playerStats*.js` can be removed.

---

## Constraints

- Phase-1 safety rules remain in force: never commit `.env`, credentials,
  generated bulk data, logs, or temp artifacts.
- Behavior is defined by the current code + characterization snapshots; treat
  them as the contract.
- Stages communicate via intermediate files with hardcoded relative paths and
  must run from `scripts/`; changing that contract is its own ADR-backed step.
- Human owner remains the sole merge gate; no agent merges.

---

## Risks

- **Invisible numeric regression:** mitigated by the strict Phase A / Phase B
  split and byte-identical snapshots.
- **Snapshot fragility** (e.g. key ordering, float formatting): may require
  stabilizing the harness before extraction; treat as part of Phase A setup.
- **Stage 01 complexity** (347 lines, hardcoded config, heavy I/O): largest
  first target; may need extra decomposition sub-steps within Phase A.
- **Scope creep** toward "improve while we're here": explicitly barred from
  Phase A.

---

## Decisions Log

- **2026-05-31 — D1 (module layout):** Flat **one file per stage** under
  `scripts/etl/<stage>.js`. Escape hatch: promote a stage to its own directory
  (`scripts/etl/<stage>/`) only if it genuinely needs multiple internal modules.
  Resolves Open Question #1.
- **2026-05-31 — D2 (first pilot):** **Stage 02** (`Numerical3games`, ~61 lines,
  most isolated) is the first Phase A pilot and establishes the module/test
  pattern. Stage 01 follows, sequenced for pattern reuse (process ordering, not a
  technical dependency). Resolves Open Question #4.
- **2026-06-01 — D3 (stage 03 scope):** Stage 03 remains global normalization
  across all player-season-team records. Documentation must match the code; a
  per-position/league variant is not in scope for extraction.

---

## Open Questions

1. **Intermediate-file contract:** keep on-disk JSON handoff, or move to
   in-memory composition once all stages are modules? (Likely a final,
   ADR-backed step after 05.)
2. **TypeScript:** confirm the trigger point (after 2–3 stages) and whether it
   becomes a parallel track or a follow-on phase.
