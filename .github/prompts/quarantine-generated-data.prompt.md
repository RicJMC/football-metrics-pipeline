# Phase 1B — Quarantine

Allowed files to change only:

- `.gitignore`
- `.env.example`
- `docs/DATA_POLICY.md`

Do not change scraper/ETL logic.

Goal:

- Prevent generated data/logs/tmp/sessions/secrets from being committed.

Return:

- concise diff summary
- `git status --short`
- `git add --dry-run .`
- remaining risks
