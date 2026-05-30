# Quickstart

A 60-second tour of the repository for someone who just cloned it.

## Requirements

- Node.js 22 (the only supported runtime; `engines` is pinned in `package.json`).
- npm 10+.
- Windows, macOS or Linux.

## 1. Install

```bash
git clone https://github.com/RicJMC/fbref-webscrap.git
cd fbref-webscrap
npm ci
```

## 2. Run the ETL on the bundled sample

```bash
npm run pipeline:sample
```

This runs stages 02–05 of the legacy ETL against the synthetic fixture in `sample-data/etl-phase2/` and writes:

- `tmp/sample-output/playerStatstoCSV1-3.sample.csv` — final CSV (the artifact a real run would feed into Google Sheets).
- `tmp/sample-output/playerStats02_Filtered.sample.json` — intermediate filtered stage-2 output.
- `tmp/sample-output/playerStats02_Numerical.sample.json` — intermediate numerical stage-2 output.

No scraping, no network, no data under `data/` required.

### Try the edge cases

```bash
npm run pipeline:sample -- --fixture sample-data/edge-cases/multi-team/input/playerStats01_Unicos.sample.json
npm run pipeline:sample -- --fixture sample-data/edge-cases/missing-fields/input/playerStats01_Unicos.sample.json
npm run pipeline:sample -- --fixture sample-data/edge-cases/filtered-out/input/playerStats01_Unicos.sample.json
```

## 3. Run the tests

```bash
npm run test:characterization
```

These are snapshot tests pinned to the current legacy behavior. They cover the happy path and the three edge cases. They do **not** test scraping.

## 4. (Optional) Full repo verification

```bash
npm run verify
```

Runs cross-platform checks: required paths exist, `package.json` and lock file parse, sample fixtures parse, characterization tests pass, and tracked source has no obvious secret patterns.

## Running against real data

The bundled scrapers under `scrappe/` target FBref. To run the full pipeline against real data:

1. Run individual scrapers manually with `node scrappe/<scraper>.js` to populate `data/<competitionId>-<league>/<season>/<category>/*.json`.
2. Run `npm run etl` (or `npm run pipeline`) to execute stages 01–05 over that data.

Respect FBref's terms of use and rate limits. Generated outputs under `data/`, `jsonfiles/` and `csv/` are gitignored; do not commit them.

## Where to look next

- [docs/PIPELINE.md](PIPELINE.md) — pipeline diagram and per-stage detail.
- [docs/ARCHITECTURE_CURRENT.md](ARCHITECTURE_CURRENT.md) — current architecture snapshot.
- [docs/DATA_POLICY.md](DATA_POLICY.md) — what stays in Git, what doesn't.
- [docs/MODERNIZATION_PLAN.md](MODERNIZATION_PLAN.md) — phased modernization plan.
- [docs/handoffs/](handoffs/) — most recent handoff summaries.
