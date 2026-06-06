---
applyTo: "**"
---

Keep changes scoped and reversible.

- Do not stage or commit generated/sensitive artifacts (`data/`, `jsonfiles/`, `csv/`, `scrappe/tmp/`, `.env`, `errorLog*`, session/cookie files).
- Preserve current scraper/ETL behavior unless the task explicitly requests behavior change.
- If touching `scripts/playerStats*.js` or `scrappe/*`, follow characterization-first workflow (`/etl-change-safe`).
