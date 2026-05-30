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

Primary root entry point: `index.js`

Legacy scripts-directory entry point: `scripts/index.js`

Executes the processing chain sequentially:

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
- Automated checks execute the sample path from stages 2–5 without running live scraping.

## 3) End-to-End

```bash
npm run pipeline
```

## Known Limitations

- Scraping reliability depends on FBref page changes.
- Current flow is script-based and partially manual.
- Generated outputs are large and must remain outside public Git history.
- Characterization coverage currently starts at stage 2, not at raw scraping ingestion.
