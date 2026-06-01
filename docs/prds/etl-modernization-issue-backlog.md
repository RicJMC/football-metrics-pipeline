# ETL Modernization — Issue Backlog (ready to create)

Source: `docs/prds/etl-incremental-modernization.md`. Decisions D1/D2 are recorded
in that PRD's Decisions Log (no issue needed). Labels are aligned to the repo's
existing label set (`enhancement`, `adr-decision`, …) — no new labels invented.

Create order: **E1 → A2 (pilot) → A1 → A3 → A4 → A5**. C1/C2 are created later,
only after the relevant Phase A merges. Stage 03's global normalization is the
current documented behavior; there is no B3 issue to create unless a future ADR
reopens the metric definition.

## Ready-to-run `gh` commands

Run from the repo root once authenticated (`gh auth login`):

```bash
gh issue create \
  --title "E1: Stabilize characterization harness for deterministic snapshots" \
  --label enhancement \
  --body "Guarantee byte-stable snapshots (key ordering, float formatting) so every Phase A extraction can prove behavior preservation (green-for-green).

Acceptance:
- Re-running the characterization suite yields byte-identical snapshots.
- Documented as a precondition for all Phase A extraction work.

Risk: if snapshots are nondeterministic, no Phase A can demonstrate behavior preservation.

Priority: P0. Depends on: none. Source: docs/prds/etl-incremental-modernization.md."

gh issue create \
  --title "A2: Stage 02 (Numerical3games) Phase A extraction — pilot" \
  --label enhancement \
  --body "Pilot for the two-phase modernization. Extract convertToNumbers + removePlayersWithLessThanThreeMinutes (drops team-season records with minutes_90s < 3, NOT whole players) into scripts/etl/numerical-3games.js; rewire the existing script to delegate.

Acceptance:
- Filesystem boundary injected and tested via mocks or temp directories.
- Unit tests cover the < 3 minutes_90s boundary.
- Stage-2 characterization snapshot stays byte-identical.
- npm run verify is green; single source of truth (no duplicated logic).
- Establishes the module/test pattern reused by later stages.

Priority: P1. Depends on: E1. Phase: A (behavior-preserving). Source PRD + lessons-learned/2026-05-two-phase-stage-modernization.md."

gh issue create \
  --title "A1: Stage 01 (unicos) Phase A extraction" \
  --label enhancement \
  --body "Extract combineJSONFiles / extractPlayerStatsUnicos / file-path generation into pure functions under scripts/etl/; delegate from the existing script.

Acceptance:
- Filesystem boundary injected and tested via mocks or temp directories.
- Stage-1 characterization snapshot stays byte-identical.
- Unit tests cover file combination and unique-key generation.
- npm run verify is green.

Notes: largest stage (~347 lines, hardcoded league/season config, heavy I/O); the D1 escape hatch (own directory) may apply. Sequenced after A2 to reuse the pilot's pattern — process ordering, NOT a technical dependency on Stage 02.

Priority: P1. Depends on: E1 (and A2 by sequencing). Phase: A."

gh issue create \
  --title "A3: Stage 03 (ZScores) Phase A extraction" \
  --label enhancement \
  --body "Extract calculateStats + addZScores into a tested module, preserving GLOBAL per-attribute mean/stdDev (no position/league grouping) and the 7000-row output chunking.

Acceptance:
- Stage-3 snapshot byte-identical (including chunk hashes).
- Tests explicitly assert the global-distribution behavior.
- npm run verify is green.

Note: the global behavior is the current contract and stays in place during extraction. A future per-position/league redesign would need a new ADR and a separate Phase B issue.

Priority: P1. Depends on: A1. Phase: A."

gh issue create \
  --title "A4: Stage 04 (Metrics) Phase A extraction" \
  --label enhancement \
  --body "Extract the ~11 metric bundles, addMetrica (sum of z-scores) and normalizeMetrica (min-max to [0,1]) into a tested module; processes the 4 z-score chunk files.

Acceptance:
- Stage-4 snapshot byte-identical.
- Tests cover the missing-attribute logging path.
- npm run verify is green.

Priority: P1. Depends on: A3. Phase: A."

gh issue create \
  --title "A5: Stage 05 (CSV) Phase A extraction" \
  --label enhancement \
  --body "Extract filtering (games_starts / minutes_90s), metric selection, column normalization and CSV emission into a tested module.

Acceptance:
- Output CSV byte-identical to the characterization snapshot.
- Tests cover the filter and normalization paths.
- npm run verify is green.

Priority: P1. Depends on: A4. Phase: A."
```

## Later follow-ons (create only after the matching Phase A merges)

```bash
# After A5:
gh issue create \
  --title "C1: Stage handoff contract — on-disk JSON vs in-memory (ADR)" \
  --label adr-decision --label enhancement \
  --body "Evaluate replacing the hardcoded ../jsonfiles/ intermediate-file coupling with in-memory composition. ADR-backed. Depends on: A5."

# After A1–A5:
gh issue create \
  --title "C2: Remove legacy warn-only ESLint carve-out for scripts/playerStats*.js" \
  --label enhancement \
  --body "Once every stage is a strict-tier module, drop the legacy ESLint exception (ADR-0005) so playerStats*.js is linted at the strict level. Acceptance: eslint.config.js no longer lists playerStats*.js as legacy; npm run lint green at strict. Depends on: A1–A5."
```
