# Modernization Plan

## Phase 1 — Safe Bootstrap + Quarantine

Goal: Make repository safe for public publication without changing scraper/ETL behavior.

- Strengthen ignore rules and artifact boundaries.
- Add baseline docs and Copilot operating constraints.
- Add Node runtime baseline metadata.
- Remove generated/local-only files from Git tracking without deleting local files.

Validation:

- `git add --dry-run .`
- `git status --short`
- large file scan before any push

## Phase 2 — Reproducibility + Quality Baseline

Goal: Add minimal reproducible sample and automated checks.

- Create `sample-data/` with small fixture inputs and expected outputs.
- Add characterization tests for ETL behavior.
- Add lint/format tooling.
- Decide whether to keep root `index.js`, `scripts/index.js`, or a new explicit orchestrator as the canonical ETL entry point.

Current status:

- Phase 2 sample fixture exists for the stage-2 ETL contract under `sample-data/etl-phase2/`.
- Stage 1 sample fixture exists under `sample-data/etl-stage1/` (mocked `data/` tree: 4 categories, 2 leagues, 6 synthetic players).
- Edge-case fixtures cover `missing-fields`, `multi-team` and `filtered-out` under `sample-data/edge-cases/`.
- Characterization tests exist for stages 1–5 under `test/characterization/` (5 tests via `node --test`, all green).
- `scripts/verify.js` and `npm run verify` provide a cross-platform local baseline check (replaced the original `verify.sh` for Windows/macOS/Linux portability).
- Canonical automated validation currently assumes `scripts/index.js` path semantics.

Validation:

- sample pipeline run
- tests + lint pass locally

## Phase 3 — CI + Incremental Refactor

Goal: Improve maintainability without rewriting from scratch.

- Add GitHub Actions for stable local commands.
- Reduce orchestration duplication.
- Extract pure transformation functions module-by-module.
- Evaluate gradual TypeScript migration after behavior is protected by tests.

Current status:

- Minimal GitHub Actions verification workflow runs `npm run verify` on `push`/`pull_request` to `main`; CI has been green on every commit since the workflow landed.
- 5 ADRs published under [docs/adr/](adr/) covering history rewrite, generated-data quarantine, sample-data policy, fixture layout and synthetic-data constraint.
- Two scoped Copilot agents (`designer`, `implementer`) defined under `.github/agents/` to keep modernization incremental and characterization-first.
- Lint/format toolchain adopted: ESLint v9 flat config + Prettier wired into `npm run verify` and CI (see [ADR-0005](adr/0005-lint-format-toolchain.md)). Strict on new code; warn-only on legacy until each file is refactored.
- Pending: first module extraction (candidate: `scripts/playerStats02_filter.js`, the most isolated stage).

Validation:

- CI green
- no regression on sample outputs

## Phase 4 — Polish & DX

Goal: Make the modernized codebase pleasant to work in and contribute to.

- Adopt lint/format (decision via ADR before adoption).
- Refactor stage-by-stage, one PR per module, characterization tests as the regression gate.
- Evaluate gradual TypeScript migration after 2–3 modules have been refactored under the new conventions.
- Optional: publish a small reproducibility report (sample-run CSV diffed against a golden file) as a CI artifact.

Validation:

- characterization suite remains green at every step
- no behavior change in sample outputs
- ADR exists for each tooling decision adopted
