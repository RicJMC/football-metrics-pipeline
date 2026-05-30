# football-metrics-pipeline

> Football data engineering pipeline that turns FBref player tables into normalized Z-score metrics for scouting, BI and cross-league analysis.

[![CI](https://github.com/RicJMC/football-metrics-pipeline/actions/workflows/verify.yml/badge.svg)](https://github.com/RicJMC/football-metrics-pipeline/actions/workflows/verify.yml)

**Stack:** Node.js 22 · Puppeteer · plain ES2020 · `node --test` · GitHub Actions

## What this project does

A legacy Data Engineering + Sports Analytics pipeline I built to evaluate players across leagues with a consistent statistical lens.

```
┌─────────────┐    ┌────────────────────────────────────────┐    ┌─────────────┐
│  Scrapers   │ →  │  ETL: 5 stages (unicos → CSV)          │ →  │  CSV → BI   │
│  (Puppeteer)│    │  filter · numerical · Z-scores · 4×    │    │  (Sheets)   │
│  per league │    │  metric snapshots · final CSV          │    │             │
└─────────────┘    └────────────────────────────────────────┘    └─────────────┘
```

- **Scrapers** (`scrappe/`): one Puppeteer script per competition (UCL, UEL, Premier League/Big5, Serie A, Eredivisie, Liga MX, MLS, etc.).
- **ETL** (`scripts/`): 5-stage chain that combines raw tables, filters players with < 3 game-equivalents, computes Z-scores per position/league, derives metric bundles and emits a CSV.
- **Output**: a CSV with normalized player metrics, comparable across leagues on the same scale.

The repository is under **incremental modernization** (legacy code preserved, characterization tests added first, refactor later). See [docs/MODERNIZATION_PLAN.md](docs/MODERNIZATION_PLAN.md).

## Try it in 3 commands

No scraping required. The repository ships with a synthetic sample fixture so you can see the pipeline produce a real CSV right after cloning.

```bash
npm ci
npm run pipeline:sample
type tmp\sample-output\playerStatstoCSV1-3.sample.csv   # Windows
# cat tmp/sample-output/playerStatstoCSV1-3.sample.csv  # macOS / Linux
```

The same command also writes intermediate JSON outputs next to the CSV so you can inspect what each stage produces.

For more, see [docs/QUICKSTART.md](docs/QUICKSTART.md).

## Repository layout

| Path | Purpose |
| --- | --- |
| `scrappe/` | Puppeteer scrapers, one per competition (manual mode). |
| `scripts/` | 5-stage ETL chain (`playerStats01_unicos.js` → `playerStats05_CSV.js`) and `scripts/index.js` orchestrator. |
| `scripts/pipeline-sample.js` | Thin CLI that runs the ETL against the bundled sample data and writes a CSV to `tmp/sample-output/`. |
| `scripts/verify.js` | Cross-platform repo verifier (paths, package metadata, secret-pattern scan, characterization tests). |
| `sample-data/etl-phase2/` | Synthetic stage-2 input + approved outputs (canonical happy-path fixture). |
| `sample-data/etl-stage1/` | Synthetic mocked `data/` tree (4 categories, 2 leagues, 6 players) + expected stage-1 output. |
| `sample-data/edge-cases/` | Three fixtures for missing fields, multi-team transfers, and the `< 3 game` filter. |
| `test/characterization/` | `node --test` snapshot tests that pin current ETL behavior before any refactor. |
| `docs/` | Architecture, pipeline doc, data policy, modernization plan, publishing checklist, handoffs. |
| `.github/workflows/verify.yml` | CI: runs `npm ci` + `npm run verify` on push/PR to `main`. |
| `data/`, `jsonfiles/`, `csv/`, `*.log` | Generated artifacts. Kept out of Git on purpose (see [docs/DATA_POLICY.md](docs/DATA_POLICY.md)). |

## Canonical commands

```bash
npm ci                          # install dependencies
npm run pipeline:sample         # run ETL stages 02-05 on bundled sample data
npm run pipeline:sample:stage1  # run stage 01 only on the mocked data tree (etl-stage1)
npm run test:characterization   # node --test snapshot suite (sample + 3 edge cases + stage 1)
npm run verify                  # full repo verification (paths, metadata, secret scan, tests)
```

Legacy commands (require real scraped data under `data/`, which is not bundled):

```bash
npm run scrape:all   # prints a legacy-mode reminder; run scrappe/*.js manually
npm run etl          # root ETL entrypoint (deprecated; use scripts/index.js)
npm run pipeline     # alias for etl
```

The canonical ETL orchestrator going forward is `scripts/index.js`. The root `index.js` is preserved for backwards compatibility. See [docs/PIPELINE.md](docs/PIPELINE.md).

## Data policy

Raw scraping output, generated JSON, full CSVs and logs are **not committed**. Only synthetic sample data lives in the repository:

- `sample-data/etl-phase2/` — happy path (3 synthetic players).
- `sample-data/etl-stage1/` — mocked scrape output for stage 01 (6 synthetic players across 2 leagues).
- `sample-data/edge-cases/` — three small variants for `missing-fields`, `multi-team`, `filtered-out`.

Total tracked sample-data footprint: well under 100 KB.

If you want to run the full pipeline against real data, point the scrapers at FBref yourself; respect their terms of use and rate limits. See [docs/DATA_POLICY.md](docs/DATA_POLICY.md).

## Status

- ✅ Quarantine of generated outputs and secrets.
- ✅ Characterization tests for stages 2-5 (happy path + 3 edge cases).
- ✅ Stage 1 sample fixture (`sample-data/etl-stage1/`, mocked data tree).
- ✅ Cross-platform `verify.js` + GitHub Actions CI.
- ✅ Sample-data demo (`pipeline:sample`).
- ✅ Architecture decisions captured as ADRs (5 records).
- ✅ Copilot agents (`designer`/`implementer`) for safe incremental modernization.
- ⏳ Offline scraper test against a fixture FBref page.
- ⏳ Lint/format and modular refactor.
- ⏳ Optional TypeScript migration.

Modernization order is tracked in [docs/MODERNIZATION_PLAN.md](docs/MODERNIZATION_PLAN.md). Engineering decisions are recorded as ADRs under [docs/adr/](docs/adr/).

## License

ISC. See [LICENSE](LICENSE).
