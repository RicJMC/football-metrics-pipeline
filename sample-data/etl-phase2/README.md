# Phase 2 ETL sample data

Small synthetic fixture set for characterization tests.

## Purpose

- Exercise the legacy ETL from `playerStats02_Numerical3games.js` through `playerStats05_CSV.js`
- Keep inputs deterministic and safe to version
- Avoid dependence on live scraping or generated production data

## Contents

- `input/playerStats01_Unicos.sample.json` — synthetic stage-2 input
- `expected/` — approved snapshots produced by the current legacy behavior

## Notes

- Data is synthetic and does not mirror real production output.
- CSV snapshots in this folder are intentional test artifacts and are allowlisted separately from generated repository CSV files.
