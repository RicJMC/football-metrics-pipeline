# Current Pipeline (Legacy)

This document describes the existing workflow without changing behavior.

## 1) Scraping Stage

Current mode: manual legacy execution of individual scripts under `scrappe/`.

- Each scraper targets one competition or competition group.
- The workflow may require manual attention because FBref pages can change.
- Produces raw competition data files (generated artifacts).
- No current tracked `runAllScrapers.js` orchestrator exists in this snapshot.

Run:

```bash
npm run scrape:all
```

The current npm command intentionally prints a legacy-mode reminder instead of running live scraping automatically.

## 2) ETL Stage

**Canonical entry point:** `scripts/index.js`. This is the orchestrator used by the characterization tests and by `npm run etl:from-scripts-dir`.

**Legacy root entry point:** `index.js` at repo root. Preserved for backwards compatibility; will be deprecated in a later modernization phase.

Both entry points execute the processing chain sequentially:

1. `playerStats01_unicos.js`
2. `playerStats02_Numerical3games.js`
3. `playerStats03_ZScores.js`
4. `playerStats04_Metrics.js`
5. `playerStats05_CSV.js`

Notes:

- Uses `--max-old-space-size=8192` for memory headroom.
- Continues processing sequence while logging failures.

Run:

```bash
npm run etl
```

Alternative from the scripts directory:

```bash
npm run etl:from-scripts-dir
```

Characterization baseline:

- Canonical automated validation uses `scripts/index.js` path semantics.
- The tracked sample fixture lives under `sample-data/etl-phase2/` and starts from the `playerStats01_Unicos.json` contract.
- A mocked `data/` tree under `sample-data/etl-stage1/` (4 categories, 2 leagues, 6 synthetic players) exercises stage 01 parsing without scraping.
- Three additional fixtures under `sample-data/edge-cases/` cover missing fields, multi-team transfers and the stage-2 `< 3 games` filter.
- Automated checks execute stage 01 against the mocked tree and stages 02–05 against the phase-2 fixture without running live scraping.

## 3) Sample-data demo

Runs stages 02–05 against the bundled fixture and writes CSV + intermediate JSON to `tmp/sample-output/`:

```bash
npm run pipeline:sample
```

Point at any fixture (e.g. an edge case) with `--fixture`:

```bash
npm run pipeline:sample -- --fixture sample-data/edge-cases/multi-team/input/playerStats01_Unicos.sample.json
```

Run stage 01 only against the mocked `data/` tree:

```bash
npm run pipeline:sample:stage1
```

## 4) End-to-End against real data

Requires real scraped data under `data/` (not bundled).

```bash
npm run pipeline
```

## Known Limitations

- Scraping reliability depends on FBref page changes.
- Current flow is script-based and partially manual.
- Generated outputs are large and must remain outside public Git history.
- Characterization coverage currently starts at stage 2, not at raw scraping ingestion.
- A stage 1 sample fixture (raw `data/` tree mock) is not yet provided.
