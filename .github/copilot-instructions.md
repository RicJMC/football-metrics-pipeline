## football-metrics-pipeline instructions (always on)

- Keep changes small and reversible. Preserve current scraper/ETL behavior unless the task explicitly asks to change behavior.
- Never commit generated or sensitive artifacts (`data/`, `jsonfiles/`, `csv/`, `scrappe/tmp/`, `.env`, `errorLog*`, browser session/cookie files).
- For changes in `scripts/playerStats*.js` or `scrappe/*`, run characterization-first via the `/etl-change-safe` skill.
- For PR operations, use `/pr-review-flow` (canonical `pr-context.js` + review markers).
- For new architecture/process decisions, use `/adr-decision-draft`.
- For fixture/data updates, use `/fixture-synthetic-data` (synthetic only; no scraped FBref data).
- If editing `.github/workflows/*`, apply ADR-0012 guidance via `/workflow-threat-model`.
