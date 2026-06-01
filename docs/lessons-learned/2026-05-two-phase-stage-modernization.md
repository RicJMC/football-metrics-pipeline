# Lesson: Two-phase stage modernization (extract green, then improve)

Date: 2026-05-31

## Context

The ETL lives in five monolithic legacy scripts (`scripts/playerStats01_*.js`
… `05_*.js`), coupled by intermediate files on disk and full of non-obvious
behavior. One concrete example: `playerStats03_ZScores.js` computes a single
**global** per-attribute mean/stdDev across all player-season-team records. The
docs must say that plainly so future plans do not accidentally treat
positional or league grouping as the current contract. The old code is the only
behavioral spec we have; there is no external oracle that says which output
number is "correct".

The temptation when modernizing (SOLID, DI, unit tests, TDD) is to extract a
stage into clean modules **and** "improve while we're in there" in the same
change. If extraction and improvement land together, the characterization
snapshot can no longer answer the only question that matters during a refactor:
*is this output diff a bug I introduced, or the improvement I intended?* The
safety net goes slack exactly when the change is largest.

## Rule

**Modernize each stage in two strictly separate, ordered phases. Never combine
them.**

1. **Phase A — behavior-preserving extraction (`refactor:` PR).** Pull pure
   functions into a unit-tested module with dependency injection and mocks, then
   wire it back into the existing script. The stage's characterization snapshot
   MUST stay byte-identical. Green-for-green is the pass condition. No
   "improvements" of any kind in this PR.
2. **Phase B — behavior-changing improvement (`feat:` / `perf:` PR, optional).**
   Only after Phase A is merged green. The characterization snapshot is now
   *expected* to change; update it deliberately, with the diff reviewed. If the
   change alters a metric definition (e.g. global vs. per-position/league
   Z-scores), record it in an ADR before merge.

Work the stages in order: 01 → 02 → 03 → 04 → 05. The end state is a SOLID,
unit-tested, DI-based pipeline reached without a single big-bang rewrite.

## Example

| Situation | Wrong (combined) | Right (two-phase) |
|---|---|---|
| Extract stage 02 filter into a module | One PR that extracts AND changes the `< 3 minutes_90s` rule | Phase A: extract, snapshot identical. Phase B: change the rule, snapshot updated + reviewed |
| Stage 03 global Z-score "looks wrong" | Silently switch to per-position grouping during extraction | Phase A preserves global behavior. Phase B switches grouping behind an ADR with an intentional snapshot diff |
| Stage 01 hardcoded league/season lists | Extract to config AND drop a league in the same PR | Phase A: extract config, same output. Phase B: change the league set as a reviewed data change |

## Verification

For any stage-modernization PR, satisfy this checklist item before merge:

> **This PR is either (A) a pure extraction with a byte-identical
> characterization snapshot, or (B) a deliberate behavior change with a
> reviewed snapshot update (and an ADR if a metric definition changed) — never
> both in one PR.**

Concretely:

- Phase A PR: `npm run test:characterization` is green with **no** snapshot
  file changes in the diff.
- Phase B PR: snapshot changes are present, intentional, and explained in the
  PR body (link the ADR when a metric definition changes).
