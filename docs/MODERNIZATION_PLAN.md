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
- Characterization tests exist for stages 2–5 under `test/characterization/`.
- `scripts/verify.sh` and `npm run verify` provide a local baseline check.
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

- Minimal GitHub Actions verification workflow now runs `npm run verify` on `push`/`pull_request` to `main`.

Validation:

- CI green
- no regression on sample outputs
