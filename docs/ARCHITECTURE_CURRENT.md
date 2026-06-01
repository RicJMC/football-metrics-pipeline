# Current Architecture (Legacy Snapshot)

## High-Level Flow

1. `scrappe/` extracts league/competition stats from FBref.
2. Generated files are stored as raw/intermediate data.
3. `scripts/` performs multi-step ETL transformations.
4. Final CSV outputs are consumed in external tools (e.g., Google Sheets).

## Main Runtime Entrypoints

- `scrappe/*.js` individual scraper scripts, run manually in legacy mode
- `index.js` root ETL launcher
- `scripts/index.js` ETL launcher when executed from `scripts/`
- `scripts/playerStats01_unicos.js` through `scripts/playerStats05_CSV.js` as ETL stages

## Data Boundaries (Current)

- Source code: `scrappe/`, `scripts/`, root scripts
- Generated data/artifacts: `data/`, `jsonfiles/`, `csv/*.csv`, logs

## Current Technical Debt

- Outputs mixed with code in same repository.
- Minimal repository guardrails before this bootstrap.
- Characterization test harness delivered in Phase 2: five green tests under `test/characterization/` (stage1Pipeline, phase2Pipeline, edgeCases, prContext, and their harness helpers).
- Legacy script naming and duplicated orchestration paths.
- Documentation previously referenced scraper/ETL orchestrators that are not present in the current tracked snapshot.

## Target Direction (Incremental)

- Keep behavior stable first.
- Add sample-data + characterization tests.
- Introduce quality gates (lint/tests/CI).
- Modularize ETL and scraper orchestration gradually.
