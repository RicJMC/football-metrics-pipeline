# Repository Inventory

This is a Phase 1 inventory snapshot. It documents the current repository boundaries without changing scraper or ETL behavior.

## Runtime Source Areas

- `scrappe/`: legacy FBref scraper scripts, currently run manually per competition.
- `scripts/`: legacy ETL stages for player statistics processing.
- `index.js`: root ETL launcher that runs the player statistics stages from the repository root.
- `package.json`: npm metadata and current command aliases.
- `test/characterization/`: harness and characterization tests for the tracked ETL sample path.
- `sample-data/etl-phase2/`: synthetic fixture input and approved expected outputs for ETL stages 2â€“5.

## Documentation and Guardrails

- `README.md`: project overview and current commands.
- `docs/`: pipeline, data policy, publishing checklist, security notes, and modernization plan.
- `.github/copilot-instructions.md`: repository-specific Copilot operating rules.
- `.github/instructions/`: reusable instruction files for safe changes and legacy data work.
- `.github/prompts/`: retired from active workflow in favor of focused skills (legacy prompts removed).
- `.github/skills/`: focused project skills (`etl-change-safe`, `pr-review-flow`, `adr-decision-draft`, `fixture-synthetic-data`, `workflow-threat-model`).
- `.github/workflows/verify.yml`: minimal CI that runs repository verification without live scraping.

## Generated / Local-Only Areas

These paths are treated as generated, local, or sensitive and should not be part of public Git history:

- `.env`
- `data/`
- `jsonfiles/`
- `csv/**/*.csv`
- `scrappe/tmp/`
- `scripts/*Log*.txt`
- `scripts/errorLog*.txt`
- `scripts/old/**/*.json`
- `scripts/old/**/*.csv`

Tracked exceptions kept intentionally in Git:

- `sample-data/**/*.json`
- `sample-data/**/*.csv`
- `sample-data/**/*.sha256`

## Current Entry Points

- Scraping: run individual scripts under `scrappe/` manually in legacy mode.
- ETL from repo root: `npm run etl`.
- ETL from `scripts/`: `npm run etl:from-scripts-dir`.
- Full current pipeline alias: `npm run pipeline`.
- Characterization tests: `npm run test:characterization`.
- Repository verification: `npm run verify`.

## Known Gaps

- Sample coverage starts at the stage-2 ETL contract, not at scraper/raw-ingest level.
- Lint/format tooling is still not established.
- CI currently validates the synthetic sample path only.
- Historical `.env` and old secret-like patterns must be reviewed before public release.

